import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Schedule, ScheduledAction, DaysOfWeek, RecurrenceConfig } from '../../domain/entities/schedule.entity';
import { IScheduleRepository } from '../../domain/repositories/schedule.repository.interface';
import { ScheduleDocument } from '../schemas/schedule.schema';

@Injectable()
export class MongooseScheduleRepository implements IScheduleRepository {
  constructor(
    @InjectModel(ScheduleDocument.name)
    private readonly scheduleModel: Model<ScheduleDocument>,
  ) {}

  async findById(id: string): Promise<Schedule | null> {
    const document = await this.scheduleModel.findById(new Types.ObjectId(id)).exec();
    return document ? this.mapToEntity(document) : null;
  }

  async findByUserId(userId: string): Promise<Schedule[]> {
    const documents = await this.scheduleModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
    return documents.map(doc => this.mapToEntity(doc));
  }

  async findByDeviceId(deviceId: string): Promise<Schedule[]> {
    const documents = await this.scheduleModel
      .find({ deviceId: new Types.ObjectId(deviceId) })
      .sort({ createdAt: -1 })
      .exec();
    return documents.map(doc => this.mapToEntity(doc));
  }

  async findByUserIdAndDeviceId(userId: string, deviceId: string): Promise<Schedule[]> {
    const documents = await this.scheduleModel
      .find({ 
        userId: new Types.ObjectId(userId), 
        deviceId: new Types.ObjectId(deviceId) 
      })
      .sort({ createdAt: -1 })
      .exec();
    return documents.map(doc => this.mapToEntity(doc));
  }

  async findActiveSchedules(): Promise<Schedule[]> {
    const documents = await this.scheduleModel
      .find({ status: 'active' })
      .sort({ nextExecutionAt: 1 })
      .exec();
    return documents.map(doc => this.mapToEntity(doc));
  }

  async findSchedulesForExecution(currentTime: Date): Promise<Schedule[]> {
    const documents = await this.scheduleModel
      .find({
        status: 'active',
        nextExecutionAt: { $lte: currentTime },
      })
      .exec();
    return documents.map(doc => this.mapToEntity(doc));
  }

  async save(schedule: Schedule): Promise<Schedule> {
    const documentData = this.mapToDocument(schedule);
    const document = new this.scheduleModel(documentData);
    const savedDocument = await document.save();
    return this.mapToEntity(savedDocument);
  }

  async update(schedule: Schedule): Promise<Schedule> {
    const updatedDocument = await this.scheduleModel
      .findByIdAndUpdate(
        new Types.ObjectId(schedule.id),
        this.mapToDocument(schedule),
        { new: true }
      )
      .exec();
    
    if (!updatedDocument) {
      throw new Error('Schedule not found for update');
    }
    
    return this.mapToEntity(updatedDocument);
  }

  async delete(id: string): Promise<void> {
    await this.scheduleModel.findByIdAndDelete(new Types.ObjectId(id)).exec();
  }

  async existsByUserIdAndName(userId: string, name: string): Promise<boolean> {
    const count = await this.scheduleModel
      .countDocuments({ 
        userId: new Types.ObjectId(userId), 
        name: { $regex: new RegExp(`^${name}$`, 'i') }
      })
      .exec();
    return count > 0;
  }

  async countByUserId(userId: string): Promise<number> {
    return this.scheduleModel
      .countDocuments({ userId: new Types.ObjectId(userId) })
      .exec();
  }

  private mapToEntity(document: ScheduleDocument): Schedule {
    // Map scheduled action
    const scheduledAction = new ScheduledAction(
      document.scheduledAction.state as 'on' | 'off',
      document.scheduledAction.brightness,
      document.scheduledAction.lightingModeId?.toString() || null,
    );

    // Map days of week if exists
    let daysOfWeek: DaysOfWeek | null = null;
    if (document.recurrence.daysOfWeek) {
      daysOfWeek = new DaysOfWeek(
        document.recurrence.daysOfWeek.monday,
        document.recurrence.daysOfWeek.tuesday,
        document.recurrence.daysOfWeek.wednesday,
        document.recurrence.daysOfWeek.thursday,
        document.recurrence.daysOfWeek.friday,
        document.recurrence.daysOfWeek.saturday,
        document.recurrence.daysOfWeek.sunday,
      );
    }

    // Map recurrence config
    const recurrenceConfig = new RecurrenceConfig(
      document.recurrence.type as 'once' | 'daily' | 'weekly' | 'custom',
      daysOfWeek,
      document.recurrence.endDate || null,
    );

    return new Schedule(
      (document._id as Types.ObjectId).toString(),
      document.userId?.toString() || '',
      document.deviceId?.toString() || '',
      document.name,
      document.description,
      document.scheduledTime,
      document.timezone,
      document.status as 'active' | 'inactive',
      scheduledAction,
      recurrenceConfig,
      document.lastExecutedAt || null,
      document.nextExecutionAt || null,
      document.executionCount,
      document.createdAt,
      document.updatedAt,
    );
  }

  private mapToDocument(schedule: Schedule): Partial<ScheduleDocument> {
    const scheduledActionDoc = {
      state: schedule.scheduledAction.state,
      brightness: schedule.scheduledAction.brightness,
      lightingModeId: schedule.scheduledAction.lightingModeId 
        ? new Types.ObjectId(schedule.scheduledAction.lightingModeId) 
        : null,
    };

    return {
      ...(schedule.id && { _id: new Types.ObjectId(schedule.id) }),
      userId: new Types.ObjectId(schedule.userId),
      deviceId: new Types.ObjectId(schedule.deviceId),
      name: schedule.name,
      description: schedule.description,
      scheduledTime: schedule.scheduledTime,
      timezone: schedule.timezone,
      status: schedule.status,
      scheduledAction: scheduledActionDoc,
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
        } : null,
        endDate: schedule.recurrence.endDate || null,
      },
      lastExecutedAt: schedule.lastExecutedAt || undefined,
      nextExecutionAt: schedule.nextExecutionAt || undefined,
      executionCount: schedule.executionCount,
    };
  }
}
