import { Injectable, Inject } from '@nestjs/common';
import { IDeviceRepository, DEVICE_REPOSITORY } from '../../domain/repositories/device.repository.interface';
import { DeviceErrors } from '../../domain/errors/device.errors';
import { Result } from '../../../shared/result/result';
import { ControlDeviceDto } from '../dto/device-request.dto';
import { DeviceControlResponseDto } from '../dto/device-response.dto';
import { DeviceMapper } from '../mappers/device.mapper';
import { MqttDeviceService } from '../../infrastructure/services/mqtt-device.service';

@Injectable()
export class ControlDeviceUseCase {
  constructor(
    @Inject(DEVICE_REPOSITORY)
    private readonly deviceRepository: IDeviceRepository,
    private readonly mqttDeviceService: MqttDeviceService,
  ) {}

  async execute(userId: string, deviceId: string, dto: ControlDeviceDto): Promise<Result<DeviceControlResponseDto>> {
    try {
      // Buscar dispositivo
      const device = await this.deviceRepository.findByUserIdAndDeviceId(userId, deviceId);
      if (!device) {
        return Result.fail(DeviceErrors.DEVICE_NOT_FOUND);
      }

      // Verificar que el dispositivo esté conectado
      if (!device.canBeControlled()) {
        return Result.fail(DeviceErrors.DEVICE_OFFLINE);
      }

      // Enviar comando por MQTT primero
      const mqttResult = await this.mqttDeviceService.sendControlCommand(deviceId, dto);
      if (!mqttResult) {
        return Result.fail(DeviceErrors.DEVICE_COMMUNICATION_ERROR);
      }

      // Aplicar cambios de control localmente
      try {
        if (dto.on && dto.on === true) {
          device.turnOn();
        } else {
          device.turnOff();
        }

        if (dto.brightness !== undefined) {
          device.setBrightness(dto.brightness);
        }

        if (dto.color) {
          if (dto.color.mode === 'rgb' && dto.color.rgb) {
            device.setRgbColor(dto.color.rgb.r, dto.color.rgb.g, dto.color.rgb.b);
          } else if (dto.color.mode === 'temperature' && dto.color.temperature) {
            device.setTemperature(dto.color.temperature);
          }
        }
      } catch (domainError) {
        if (domainError.message.includes('Brightness')) {
          return Result.fail(DeviceErrors.INVALID_BRIGHTNESS_VALUE);
        }
        if (domainError.message.includes('RGB')) {
          return Result.fail(DeviceErrors.INVALID_COLOR_VALUE);
        }
        if (domainError.message.includes('Temperature')) {
          return Result.fail(DeviceErrors.INVALID_TEMPERATURE_VALUE);
        }
        return Result.fail(DeviceErrors.INVALID_DEVICE_COMMAND);
      }

      // Guardar cambios
      const updatedDevice = await this.deviceRepository.update(device);

      return Result.ok(DeviceMapper.toControlResponseDto(
        true, 
        'Device controlled successfully', 
        updatedDevice
      ));
    } catch (error) {
      console.error('Error controlling device:', error);
      return Result.fail(DeviceErrors.DEVICE_COMMUNICATION_ERROR);
    }
  }
}
