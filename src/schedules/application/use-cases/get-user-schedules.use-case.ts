import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../shared/result/result';
import { Schedule } from '../../domain/entities/schedule.entity';
import { IScheduleRepository, SCHEDULE_REPOSITORY } from '../../domain/repositories/schedule.repository.interface';
import { ScheduleErrors } from '../../domain/errors/schedule.errors';

@Injectable()
export class GetUserSchedulesUseCase {
  constructor(
    @Inject(SCHEDULE_REPOSITORY)
    private readonly scheduleRepository: IScheduleRepository,
  ) {}

  async execute(
    userId: string,
    deviceId?: string,
  ): Promise<Result<Schedule[]>> {
    try {
      let schedules: Schedule[];

      if (deviceId) {
        schedules = await this.scheduleRepository.findByUserIdAndDeviceId(userId, deviceId);
      } else {
        schedules = await this.scheduleRepository.findByUserId(userId);
      }

      return Result.ok(schedules);
    } catch (error) {
      return Result.fail(
        ScheduleErrors.internalError(
          `Failed to get user schedules: ${error.message}`,
        ),
      );
    }
  }
}
