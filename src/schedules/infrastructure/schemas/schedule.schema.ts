import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false })
export class ScheduledActionSchema {
  @Prop({ required: true, enum: ['on', 'off'] })
  state: string;

  @Prop({ required: true, min: 0, max: 100 })
  brightness: number;

  @Prop({ default: null, type: Types.ObjectId, ref: 'LightingModeDocument' })
  lightingModeId: Types.ObjectId | null;
}

@Schema({ _id: false })
export class DaysOfWeekSchema {
  @Prop({ default: false })
  monday: boolean;

  @Prop({ default: false })
  tuesday: boolean;

  @Prop({ default: false })
  wednesday: boolean;

  @Prop({ default: false })
  thursday: boolean;

  @Prop({ default: false })
  friday: boolean;

  @Prop({ default: false })
  saturday: boolean;

  @Prop({ default: false })
  sunday: boolean;
}

@Schema({ _id: false })
export class RecurrenceConfigSchema {
  @Prop({ required: true, enum: ['once', 'daily', 'weekly', 'custom'] })
  type: string;

  @Prop({ type: DaysOfWeekSchema, default: null })
  daysOfWeek: DaysOfWeekSchema;

  @Prop({ default: null })
  endDate: Date;
}

@Schema({ collection: 'schedules', timestamps: true })
export class ScheduleDocument extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'UserDocument' })
  userId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'DeviceDocument' })
  deviceId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ required: true })
  scheduledTime: string; // formato "HH:mm"

  @Prop({ required: true })
  timezone: string;

  @Prop({ required: true, enum: ['active', 'inactive'] })
  status: string;

  @Prop({ type: ScheduledActionSchema, required: true })
  scheduledAction: ScheduledActionSchema;

  @Prop({ type: RecurrenceConfigSchema, required: true })
  recurrence: RecurrenceConfigSchema;

  @Prop({ default: null })
  lastExecutedAt: Date;

  @Prop({ default: null })
  nextExecutionAt: Date;

  @Prop({ default: 0 })
  executionCount: number;

  // Timestamps automáticos
  createdAt: Date;
  updatedAt: Date;
}

export const ScheduleSchema = SchemaFactory.createForClass(ScheduleDocument);

// Índices para optimizar consultas
ScheduleSchema.index({ userId: 1 });
ScheduleSchema.index({ deviceId: 1 });
ScheduleSchema.index({ status: 1 });
ScheduleSchema.index({ nextExecutionAt: 1 });
ScheduleSchema.index({ userId: 1, status: 1 });
