import { Injectable, Inject } from '@nestjs/common';
import { IDeviceRepository, DEVICE_REPOSITORY } from '../../domain/repositories/device.repository.interface';
import { Result } from '../../../shared/result/result';
import { DeviceListResponseDto } from '../dto/device-response.dto';
import { DeviceMapper } from '../mappers/device.mapper';

@Injectable()
export class GetUserDevicesUseCase {
  constructor(
    @Inject(DEVICE_REPOSITORY)
    private readonly deviceRepository: IDeviceRepository,
  ) {}

  async execute(userId: string): Promise<Result<DeviceListResponseDto>> {
    try {
      const devices = await this.deviceRepository.findByUserId(userId);
      return Result.ok(DeviceMapper.toListResponseDto(devices));
    } catch (error) {
      console.error('Error fetching user devices:', error);
      return Result.fail({
        code: 'DEVICE_FETCH_ERROR',
        message: 'Failed to fetch user devices',
        statusCode: 500,
      });
    }
  }
}
