import { Injectable, Inject } from '@nestjs/common';
import { IDeviceRepository, DEVICE_REPOSITORY } from '../../domain/repositories/device.repository.interface';
import { DeviceErrors } from '../../domain/errors/device.errors';
import { Result } from '../../../shared/result/result';
import { UpdateDeviceDto } from '../dto/device-request.dto';
import { DeviceResponseDto } from '../dto/device-response.dto';
import { DeviceMapper } from '../mappers/device.mapper';

@Injectable()
export class UpdateDeviceUseCase {
  constructor(
    @Inject(DEVICE_REPOSITORY)
    private readonly deviceRepository: IDeviceRepository,
  ) {}

  async execute(userId: string, deviceId: string, dto: UpdateDeviceDto): Promise<Result<DeviceResponseDto>> {
    try {
      // Buscar dispositivo
      const device = await this.deviceRepository.findByUserIdAndDeviceId(userId, deviceId);
      if (!device) {
        return Result.fail(DeviceErrors.DEVICE_NOT_FOUND);
      }

      // Aplicar actualizaciones
      try {
        if (dto.name !== undefined) {
          device.updateName(dto.name);
        }

        if (dto.habitatType !== undefined) {
          device.updateHabitatType(dto.habitatType);
        }
      } catch (domainError) {
        if (domainError.message.includes('name cannot be empty')) {
          return Result.fail(DeviceErrors.INVALID_DEVICE_NAME);
        }
        return Result.fail(DeviceErrors.INVALID_DEVICE_COMMAND);
      }

      // Guardar cambios
      const updatedDevice = await this.deviceRepository.update(device);

      return Result.ok(DeviceMapper.toResponseDto(updatedDevice));
    } catch (error) {
      console.error('Error updating device:', error);
      return Result.fail(DeviceErrors.DEVICE_COMMUNICATION_ERROR);
    }
  }
}
