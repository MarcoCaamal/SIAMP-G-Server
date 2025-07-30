import { Schedule } from '../entities/schedule.entity';

export const SCHEDULE_REPOSITORY = 'SCHEDULE_REPOSITORY';

export interface IScheduleRepository {
  findById(id: string): Promise<Schedule | null>;
  findByUserId(userId: string): Promise<Schedule[]>;
  findByDeviceId(deviceId: string): Promise<Schedule[]>;
  findByUserIdAndDeviceId(userId: string, deviceId: string): Promise<Schedule[]>;
  findActiveSchedules(): Promise<Schedule[]>;
  findSchedulesForExecution(currentTime: Date): Promise<Schedule[]>;
  save(schedule: Schedule): Promise<Schedule>;
  update(schedule: Schedule): Promise<Schedule>;
  delete(id: string): Promise<void>;
  existsByUserIdAndName(userId: string, name: string): Promise<boolean>;
  countByUserId(userId: string): Promise<number>;
}
