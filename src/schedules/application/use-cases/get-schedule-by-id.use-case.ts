import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../shared/result/result';
import { Schedule } from '../../domain/entities/schedule.entity';
import { IScheduleRepository, SCHEDULE_REPOSITORY } from '../../domain/repositories/schedule.repository.interface';
import { ScheduleErrors } from '../../domain/errors/schedule.errors';

@Injectable()
export class GetScheduleByIdUseCase {
  constructor(
    @Inject(SCHEDULE_REPOSITORY)
    private readonly scheduleRepository: IScheduleRepository,
  ) {}

  async execute(
    userId: string,
    scheduleId: string,
  ): Promise<Result<Schedule>> {
    try {
      const schedule = await this.scheduleRepository.findById(scheduleId);

      if (!schedule) {
        return Result.fail(ScheduleErrors.SCHEDULE_NOT_FOUND);
      }

      // Check if user has access to this schedule
      if (schedule.userId !== userId) {
        return Result.fail(ScheduleErrors.UNAUTHORIZED_ACCESS);
      }

      return Result.ok(schedule);
    } catch (error) {
      return Result.fail(
        ScheduleErrors.internalError(
          `Failed to get schedule: ${error.message}`,
        ),
      );
    }
  }
}
