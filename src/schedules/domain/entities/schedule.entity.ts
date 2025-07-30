export class ScheduledAction {
  constructor(
    public readonly state: 'on' | 'off',
    public readonly brightness: number,
    public readonly lightingModeId: string | null = null,
  ) {}
}

export class DaysOfWeek {
  constructor(
    public readonly monday: boolean = false,
    public readonly tuesday: boolean = false,
    public readonly wednesday: boolean = false,
    public readonly thursday: boolean = false,
    public readonly friday: boolean = false,
    public readonly saturday: boolean = false,
    public readonly sunday: boolean = false,
  ) {}

  public hasAnyDay(): boolean {
    return this.monday || this.tuesday || this.wednesday || this.thursday || 
           this.friday || this.saturday || this.sunday;
  }

  public getActiveDays(): string[] {
    const days: string[] = [];
    if (this.monday) days.push('monday');
    if (this.tuesday) days.push('tuesday');
    if (this.wednesday) days.push('wednesday');
    if (this.thursday) days.push('thursday');
    if (this.friday) days.push('friday');
    if (this.saturday) days.push('saturday');
    if (this.sunday) days.push('sunday');
    return days;
  }
}

export class RecurrenceConfig {
  constructor(
    public readonly type: 'once' | 'daily' | 'weekly' | 'custom',
    public readonly daysOfWeek: DaysOfWeek | null = null,
    public readonly endDate: Date | null = null,
  ) {}

  public isRecurring(): boolean {
    return this.type !== 'once';
  }

  public hasEndDate(): boolean {
    return this.endDate !== null;
  }
}

export class Schedule {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly deviceId: string,
    public readonly name: string,
    public readonly description: string,
    public readonly scheduledTime: string, // formato "HH:mm"
    public readonly timezone: string,
    public readonly status: 'active' | 'inactive',
    public readonly scheduledAction: ScheduledAction,
    public readonly recurrence: RecurrenceConfig,
    public readonly lastExecutedAt: Date | null = null,
    public readonly nextExecutionAt: Date | null = null,
    public readonly executionCount: number = 0,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  public static create(
    userId: string,
    deviceId: string,
    name: string,
    description: string,
    scheduledTime: string,
    timezone: string,
    scheduledAction: ScheduledAction,
    recurrence: RecurrenceConfig,
  ): Schedule {
    return new Schedule(
      '', // ID will be set by repository
      userId,
      deviceId,
      name,
      description,
      scheduledTime,
      timezone,
      'active', // Default status
      scheduledAction,
      recurrence,
    );
  }

  public isActive(): boolean {
    return this.status === 'active';
  }

  public isRecurring(): boolean {
    return this.recurrence.isRecurring();
  }

  public shouldExecuteToday(currentDay: string): boolean {
    if (this.recurrence.type === 'once') {
      return true; // Will be handled by date comparison
    }

    if (this.recurrence.type === 'daily') {
      return true;
    }

    if (this.recurrence.type === 'weekly' || this.recurrence.type === 'custom') {
      if (!this.recurrence.daysOfWeek) {
        return false;
      }

      const dayProperty = currentDay.toLowerCase() as keyof DaysOfWeek;
      return Boolean(this.recurrence.daysOfWeek[dayProperty]);
    }

    return false;
  }

  public activate(): Schedule {
    return new Schedule(
      this.id,
      this.userId,
      this.deviceId,
      this.name,
      this.description,
      this.scheduledTime,
      this.timezone,
      'active',
      this.scheduledAction,
      this.recurrence,
      this.lastExecutedAt,
      this.nextExecutionAt,
      this.executionCount,
      this.createdAt,
      new Date(),
    );
  }

  public deactivate(): Schedule {
    return new Schedule(
      this.id,
      this.userId,
      this.deviceId,
      this.name,
      this.description,
      this.scheduledTime,
      this.timezone,
      'inactive',
      this.scheduledAction,
      this.recurrence,
      this.lastExecutedAt,
      this.nextExecutionAt,
      this.executionCount,
      this.createdAt,
      new Date(),
    );
  }

  public markAsExecuted(executedAt: Date, nextExecution?: Date): Schedule {
    return new Schedule(
      this.id,
      this.userId,
      this.deviceId,
      this.name,
      this.description,
      this.scheduledTime,
      this.timezone,
      this.status,
      this.scheduledAction,
      this.recurrence,
      executedAt,
      nextExecution || null,
      this.executionCount + 1,
      this.createdAt,
      new Date(),
    );
  }
}
