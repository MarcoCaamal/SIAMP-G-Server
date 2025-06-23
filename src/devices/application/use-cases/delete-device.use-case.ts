import { Injectable, Inject } from '@nestjs/common';
import { IDeviceRepository, DEVICE_REPOSITORY } from '../../domain/repositories/device.repository.interface';
import { DeviceErrors } from '../../domain/errors/device.errors';
import { Result } from '../../../shared/result/result';
import { UnpairDeviceUseCase } from './unpair-device.use-case';

@Injectable()
export class DeleteDeviceUseCase {
  constructor(
    @Inject(DEVICE_REPOSITORY)
    private readonly deviceRepository: IDeviceRepository,
    private readonly unpairDeviceUseCase: UnpairDeviceUseCase,
  ) {}

  async execute(userId: string, deviceId: string): Promise<Result<{ message: string }>> {
    try {
      // Primero intentamos desemparejar el dispositivo
      const unpairResult = await this.unpairDeviceUseCase.execute(userId, deviceId);
      
      if (!unpairResult.isSuccess) {
        console.warn(`Warning: Device ${deviceId} could not be unpaired`, unpairResult.error);
        // Continuamos con el proceso de eliminación incluso si falló el unpair
      }
      
      // Verificamos si el dispositivo existe y pertenece al usuario
      const device = await this.deviceRepository.findByDeviceId(deviceId);
      
      if (!device) {
        return Result.fail(DeviceErrors.DEVICE_NOT_FOUND);
      }
      
      // Verificar si el usuario es el propietario del dispositivo
      if (device.userId !== userId) {
        return Result.fail(DeviceErrors.UNAUTHORIZED_DEVICE_ACCESS);
      }
      
      // Eliminar el dispositivo usando su ID de documento
      // Solo si no se pudo desemparejar, ya que el unpair también elimina el dispositivo
      if (unpairResult.isSuccess) {
        // El dispositivo ya fue eliminado por el unpair
        return Result.ok({ message: 'Dispositivo eliminado con éxito' });
      } else {
        // Si falló el unpair, eliminamos manualmente
        await this.deviceRepository.delete(device.id);
        return Result.ok({ message: 'Dispositivo eliminado con éxito (sin desemparejar)' });
      }
    } catch (error) {
      console.error('Error al eliminar dispositivo:', error);
      return Result.fail({
        code: 'DEVICE_DELETE_ERROR',
        message: 'Error interno del servidor al eliminar el dispositivo',
        statusCode: 500
      });
    }
  }
}
