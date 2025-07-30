import { Schedule } from '../../domain/entities/schedule.entity';
import { ScheduleResponseDto } from '../../application/dto/schedule-request.dto';

export class ScheduleMapper {
  static toResponseDto(schedule: Schedule): ScheduleResponseDto {
    return {
      id: schedule.id,
      userId: schedule.userId,
      deviceId: schedule.deviceId,
      name: schedule.name,
      description: schedule.description,
      scheduledTime: schedule.scheduledTime,
      timezone: schedule.timezone,
      status: schedule.status,
      scheduledAction: {
        state: schedule.scheduledAction.state,
        brightness: schedule.scheduledAction.brightness,
        lightingModeId: schedule.scheduledAction.lightingModeId,
      },
      recurrence: {
        type: schedule.recurrence.type,
        daysOfWeek: schedule.recurrence.daysOfWeek ? {
          monday: schedule.recurrence.daysOfWeek.monday,
          tuesday: schedule.recurrence.daysOfWeek.tuesday,
          wednesday: schedule.recurrence.daysOfWeek.wednesday,
          thursday: schedule.recurrence.daysOfWeek.thursday,
          friday: schedule.recurrence.daysOfWeek.friday,
          saturday: schedule.recurrence.daysOfWeek.saturday,
          sunday: schedule.recurrence.daysOfWeek.sunday,
        } : undefined,
        endDate: schedule.recurrence.endDate?.toISOString() || undefined,
      },
      lastExecutedAt: schedule.lastExecutedAt,
      nextExecutionAt: schedule.nextExecutionAt,
      executionCount: schedule.executionCount,
      createdAt: schedule.createdAt,
      updatedAt: schedule.updatedAt,
    };
  }

  static toListResponseDto(schedules: Schedule[]): ScheduleResponseDto[] {
    return schedules.map(schedule => this.toResponseDto(schedule));
  }
}
