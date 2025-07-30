import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../shared/result/result';
import { Schedule, ScheduledAction, DaysOfWeek, RecurrenceConfig } from '../../domain/entities/schedule.entity';
import { IScheduleRepository, SCHEDULE_REPOSITORY } from '../../domain/repositories/schedule.repository.interface';
import { ScheduleErrors } from '../../domain/errors/schedule.errors';
import { UpdateScheduleDto } from '../dto/schedule-request.dto';

@Injectable()
export class UpdateScheduleUseCase {
  constructor(
    @Inject(SCHEDULE_REPOSITORY)
    private readonly scheduleRepository: IScheduleRepository,
  ) {}

  async execute(
    userId: string,
    scheduleId: string,
    dto: UpdateScheduleDto,
  ): Promise<Result<Schedule>> {
    try {
      const existingSchedule = await this.scheduleRepository.findById(scheduleId);

      if (!existingSchedule) {
        return Result.fail(ScheduleErrors.SCHEDULE_NOT_FOUND);
      }

      // Check if user has access to this schedule
      if (existingSchedule.userId !== userId) {
        return Result.fail(ScheduleErrors.UNAUTHORIZED_ACCESS);
      }

      // Validate time format if provided
      if (dto.scheduledTime && !/^([01]\d|2[0-3]):([0-5]\d)$/.test(dto.scheduledTime)) {
        return Result.fail(ScheduleErrors.INVALID_TIME_FORMAT);
      }

      // Validate brightness if provided
      if (dto.scheduledAction?.brightness !== undefined) {
        if (dto.scheduledAction.brightness < 0 || dto.scheduledAction.brightness > 100) {
          return Result.fail(ScheduleErrors.INVALID_BRIGHTNESS);
        }
      }

      // Check name uniqueness if name is being updated
      if (dto.name && dto.name !== existingSchedule.name) {
        const nameExists = await this.scheduleRepository.existsByUserIdAndName(userId, dto.name);
        if (nameExists) {
          return Result.fail(ScheduleErrors.validationError('A schedule with this name already exists'));
        }
      }

      // Create updated scheduled action
      let updatedScheduledAction = existingSchedule.scheduledAction;
      if (dto.scheduledAction) {
        updatedScheduledAction = new ScheduledAction(
          dto.scheduledAction.state ?? existingSchedule.scheduledAction.state,
          dto.scheduledAction.brightness ?? existingSchedule.scheduledAction.brightness,
          dto.scheduledAction.lightingModeId !== undefined 
            ? dto.scheduledAction.lightingModeId 
            : existingSchedule.scheduledAction.lightingModeId,
        );
      }

      // Create updated recurrence config
      let updatedRecurrence = existingSchedule.recurrence;
      if (dto.recurrence) {
        let daysOfWeek: DaysOfWeek | null = existingSchedule.recurrence.daysOfWeek;
        
        if (dto.recurrence.type === 'weekly' || dto.recurrence.type === 'custom') {
          if (dto.recurrence.daysOfWeek) {
            daysOfWeek = new DaysOfWeek(
              dto.recurrence.daysOfWeek.monday ?? existingSchedule.recurrence.daysOfWeek?.monday ?? false,
              dto.recurrence.daysOfWeek.tuesday ?? existingSchedule.recurrence.daysOfWeek?.tuesday ?? false,
              dto.recurrence.daysOfWeek.wednesday ?? existingSchedule.recurrence.daysOfWeek?.wednesday ?? false,
              dto.recurrence.daysOfWeek.thursday ?? existingSchedule.recurrence.daysOfWeek?.thursday ?? false,
              dto.recurrence.daysOfWeek.friday ?? existingSchedule.recurrence.daysOfWeek?.friday ?? false,
              dto.recurrence.daysOfWeek.saturday ?? existingSchedule.recurrence.daysOfWeek?.saturday ?? false,
              dto.recurrence.daysOfWeek.sunday ?? existingSchedule.recurrence.daysOfWeek?.sunday ?? false,
            );
          }
        } else {
          daysOfWeek = null;
        }

        // Validate custom recurrence
        if (dto.recurrence.type === 'custom' && daysOfWeek && !daysOfWeek.hasAnyDay()) {
          return Result.fail(ScheduleErrors.CUSTOM_RECURRENCE_NO_DAYS);
        }

        updatedRecurrence = new RecurrenceConfig(
          dto.recurrence.type ?? existingSchedule.recurrence.type,
          daysOfWeek,
          dto.recurrence.endDate !== undefined 
            ? (dto.recurrence.endDate ? new Date(dto.recurrence.endDate) : null)
            : existingSchedule.recurrence.endDate,
        );

        // Validate end date
        if (updatedRecurrence.endDate && updatedRecurrence.endDate < new Date()) {
          return Result.fail(ScheduleErrors.END_DATE_BEFORE_START);
        }
      }

      // Create updated schedule
      const updatedSchedule = new Schedule(
        existingSchedule.id,
        existingSchedule.userId,
        existingSchedule.deviceId,
        dto.name ?? existingSchedule.name,
        dto.description !== undefined ? dto.description : existingSchedule.description,
        dto.scheduledTime ?? existingSchedule.scheduledTime,
        dto.timezone ?? existingSchedule.timezone,
        dto.status ?? existingSchedule.status,
        updatedScheduledAction,
        updatedRecurrence,
        existingSchedule.lastExecutedAt,
        existingSchedule.nextExecutionAt,
        existingSchedule.executionCount,
        existingSchedule.createdAt,
        new Date(), // updatedAt
      );

      const savedSchedule = await this.scheduleRepository.update(updatedSchedule);
      return Result.ok(savedSchedule);
    } catch (error) {
      return Result.fail(
        ScheduleErrors.internalError(
          `Failed to update schedule: ${error.message}`,
        ),
      );
    }
  }
}
