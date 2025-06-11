import { Injectable, Inject } from '@nestjs/common';
import { IDeviceRepository, DEVICE_REPOSITORY } from '../../domain/repositories/device.repository.interface';
import { DeviceErrors } from '../../domain/errors/device.errors';
import { Result } from '../../../shared/result/result';
import { DeviceResponseDto } from '../dto/device-response.dto';
import { DeviceMapper } from '../mappers/device.mapper';

@Injectable()
export class GetDeviceByIdUseCase {
  constructor(
    @Inject(DEVICE_REPOSITORY)
    private readonly deviceRepository: IDeviceRepository,
  ) {}

  async execute(userId: string, deviceId: string): Promise<Result<DeviceResponseDto>> {
    try {
      const device = await this.deviceRepository.findByUserIdAndDeviceId(userId, deviceId);
      
      if (!device) {
        return Result.fail(DeviceErrors.DEVICE_NOT_FOUND);
      }

      return Result.ok(DeviceMapper.toResponseDto(device));
    } catch (error) {
      console.error('Error fetching device by ID:', error);
      return Result.fail(DeviceErrors.DEVICE_NOT_FOUND);
    }
  }
}
