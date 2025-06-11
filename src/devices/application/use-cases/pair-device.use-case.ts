import { Injectable, Inject } from '@nestjs/common';
import { IDeviceRepository, DEVICE_REPOSITORY } from '../../domain/repositories/device.repository.interface';
import { Device } from '../../domain/entities/device.entity';
import { DeviceErrors } from '../../domain/errors/device.errors';
import { Result } from '../../../shared/result/result';
import { PairDeviceDto } from '../dto/device-request.dto';
import { DeviceResponseDto } from '../dto/device-response.dto';
import { DeviceMapper } from '../mappers/device.mapper';
import { MqttDeviceService } from '../../infrastructure/services/mqtt-device.service';

@Injectable()
export class PairDeviceUseCase {
  constructor(
    @Inject(DEVICE_REPOSITORY)
    private readonly deviceRepository: IDeviceRepository,
    private readonly mqttDeviceService: MqttDeviceService,
  ) {}

  async execute(userId: string, dto: PairDeviceDto): Promise<Result<DeviceResponseDto>> {
    try {
      // Verificar si el dispositivo ya está emparejado
      const existingDevice = await this.deviceRepository.findByDeviceId(dto.deviceId);
      if (existingDevice) {
        return Result.fail(DeviceErrors.DEVICE_ALREADY_PAIRED);
      }

      // Crear nueva instancia del dispositivo
      const device = new Device(
        '', // Se generará en la base de datos
        userId,
        dto.deviceId,
        dto.name,
        dto.type,
        dto.model,
        dto.firmwareVersion || '1.0.0',
        dto.habitatType || 'general',
        {
          isConnected: false,
          lastConnectedAt: new Date(),
          currentState: 'off',
          brightness: 0,
          color: {
            mode: 'temperature',
            rgb: { r: 255, g: 255, b: 255 },
            temperature: 5500,
          },
        },
        {
          ssid: dto.ssid || '',
          ipAddress: dto.ipAddress || '',
        },
        new Date(),
        new Date(),
      );

      // Guardar en base de datos
      const savedDevice = await this.deviceRepository.save(device);

      // Enviar comando de emparejamiento por MQTT
      await this.mqttDeviceService.sendPairingCommand(dto.deviceId, userId);

      return Result.ok(DeviceMapper.toResponseDto(savedDevice));
    } catch (error) {
      console.error('Error pairing device:', error);
      return Result.fail(DeviceErrors.DEVICE_PAIRING_FAILED);
    }
  }
}
