import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../shared/result/result';
import { Schedule, ScheduledAction, DaysOfWeek, RecurrenceConfig } from '../../domain/entities/schedule.entity';
import { IScheduleRepository, SCHEDULE_REPOSITORY } from '../../domain/repositories/schedule.repository.interface';
import { ScheduleErrors } from '../../domain/errors/schedule.errors';
import { CreateScheduleDto } from '../dto/schedule-request.dto';

@Injectable()
export class CreateScheduleUseCase {
  constructor(
    @Inject(SCHEDULE_REPOSITORY)
    private readonly scheduleRepository: IScheduleRepository,
  ) {}

  async execute(
    userId: string,
    dto: CreateScheduleDto,
  ): Promise<Result<Schedule>> {
    try {
      // Validate time format
      if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(dto.scheduledTime)) {
        return Result.fail(ScheduleErrors.INVALID_TIME_FORMAT);
      }

      // Validate brightness
      if (dto.scheduledAction.brightness < 0 || dto.scheduledAction.brightness > 100) {
        return Result.fail(ScheduleErrors.INVALID_BRIGHTNESS);
      }

      // Validate recurrence configuration
      if (dto.recurrence.type === 'custom') {
        if (!dto.recurrence.daysOfWeek) {
          return Result.fail(ScheduleErrors.CUSTOM_RECURRENCE_NO_DAYS);
        }

        const daysOfWeek = new DaysOfWeek(
          dto.recurrence.daysOfWeek.monday || false,
          dto.recurrence.daysOfWeek.tuesday || false,
          dto.recurrence.daysOfWeek.wednesday || false,
          dto.recurrence.daysOfWeek.thursday || false,
          dto.recurrence.daysOfWeek.friday || false,
          dto.recurrence.daysOfWeek.saturday || false,
          dto.recurrence.daysOfWeek.sunday || false,
        );

        if (!daysOfWeek.hasAnyDay()) {
          return Result.fail(ScheduleErrors.CUSTOM_RECURRENCE_NO_DAYS);
        }
      }

      // Check if name already exists for this user
      const nameExists = await this.scheduleRepository.existsByUserIdAndName(userId, dto.name);
      if (nameExists) {
        return Result.fail(ScheduleErrors.validationError('A schedule with this name already exists'));
      }

      // Create scheduled action
      const scheduledAction = new ScheduledAction(
        dto.scheduledAction.state,
        dto.scheduledAction.brightness,
        dto.scheduledAction.lightingModeId || null,
      );

      // Create days of week if needed
      let daysOfWeek: DaysOfWeek | null = null;
      if (dto.recurrence.type === 'weekly' || dto.recurrence.type === 'custom') {
        daysOfWeek = new DaysOfWeek(
          dto.recurrence.daysOfWeek?.monday || false,
          dto.recurrence.daysOfWeek?.tuesday || false,
          dto.recurrence.daysOfWeek?.wednesday || false,
          dto.recurrence.daysOfWeek?.thursday || false,
          dto.recurrence.daysOfWeek?.friday || false,
          dto.recurrence.daysOfWeek?.saturday || false,
          dto.recurrence.daysOfWeek?.sunday || false,
        );
      }

      // Create recurrence config
      const recurrenceConfig = new RecurrenceConfig(
        dto.recurrence.type,
        daysOfWeek,
        dto.recurrence.endDate ? new Date(dto.recurrence.endDate) : null,
      );

      // Validate end date
      if (recurrenceConfig.endDate && recurrenceConfig.endDate < new Date()) {
        return Result.fail(ScheduleErrors.END_DATE_BEFORE_START);
      }

      // Create schedule
      const schedule = Schedule.create(
        userId,
        dto.deviceId,
        dto.name,
        dto.description || '',
        dto.scheduledTime,
        dto.timezone,
        scheduledAction,
        recurrenceConfig,
      );

      const savedSchedule = await this.scheduleRepository.save(schedule);
      return Result.ok(savedSchedule);
    } catch (error) {
      return Result.fail(
        ScheduleErrors.internalError(
          `Failed to create schedule: ${error.message}`,
        ),
      );
    }
  }
}
