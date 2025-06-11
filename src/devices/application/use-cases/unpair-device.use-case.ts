import { Injectable, Inject } from '@nestjs/common';
import { IDeviceRepository, DEVICE_REPOSITORY } from '../../domain/repositories/device.repository.interface';
import { DeviceErrors } from '../../domain/errors/device.errors';
import { Result } from '../../../shared/result/result';
import { MqttDeviceService } from '../../infrastructure/services/mqtt-device.service';

@Injectable()
export class UnpairDeviceUseCase {
  constructor(
    @Inject(DEVICE_REPOSITORY)
    private readonly deviceRepository: IDeviceRepository,
    private readonly mqttDeviceService: MqttDeviceService,
  ) {}

  async execute(userId: string, deviceId: string): Promise<Result<void>> {
    try {
      // Buscar dispositivo
      const device = await this.deviceRepository.findByUserIdAndDeviceId(userId, deviceId);
      if (!device) {
        return Result.fail(DeviceErrors.DEVICE_NOT_FOUND);
      }

      // Verificar que el usuario es el propietario
      if (!device.isOwnedBy(userId)) {
        return Result.fail(DeviceErrors.UNAUTHORIZED_DEVICE_ACCESS);
      }

      // Enviar comando de desemparejamiento por MQTT
      await this.mqttDeviceService.sendUnpairCommand(deviceId);

      // Eliminar dispositivo de la base de datos
      await this.deviceRepository.delete(device.id);

      return Result.ok(undefined);
    } catch (error) {
      console.error('Error unpairing device:', error);
      return Result.fail(DeviceErrors.DEVICE_COMMUNICATION_ERROR);
    }
  }
}
