import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false })
export class UsageTimeSchema {
  @Prop({ required: true, min: 0 })
  totalMinutes: number;

  @Prop({ default: 0, min: 0 })
  onTimeMinutes: number;

  @Prop({ default: 0, min: 0 })
  offTimeMinutes: number;
}

@Schema({ _id: false })
export class BrightnessStatsSchema {
  @Prop({ default: 0, min: 0, max: 100 })
  average: number;

  @Prop({ default: 0, min: 0, max: 100 })
  minimum: number;

  @Prop({ default: 0, min: 0, max: 100 })
  maximum: number;
}

@Schema({ _id: false })
export class LightingModeStatsSchema {
  @Prop({ required: true, type: Types.ObjectId, ref: 'LightingModeDocument' })
  modeId: Types.ObjectId;

  @Prop({ required: true })
  modeName: string;

  @Prop({ required: true, min: 0 })
  usageCount: number;

  @Prop({ required: true, min: 0 })
  totalMinutes: number;
}

@Schema({ _id: false })
export class ScheduleStatsSchema {
  @Prop({ default: 0, min: 0 })
  totalSchedules: number;

  @Prop({ default: 0, min: 0 })
  executedSchedules: number;

  @Prop({ default: 0, min: 0 })
  failedSchedules: number;

  @Prop({ default: 0 })
  successRate: number; // porcentaje
}

@Schema({ _id: false })
export class EnergyStatsSchema {
  @Prop({ default: 0, min: 0 })
  estimatedConsumption: number; // en kWh

  @Prop({ default: 0, min: 0 })
  estimatedCost: number; // en unidad monetaria

  @Prop({ default: 'MXN' })
  currency: string;
}

@Schema({ collection: 'statistics', timestamps: true })
export class StatisticDocument extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'UserDocument' })
  userId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'DeviceDocument' })
  deviceId: Types.ObjectId;

  @Prop({ required: true, enum: ['daily', 'weekly', 'monthly'] })
  period: string;

  @Prop({ required: true })
  date: Date; // fecha de inicio del período

  @Prop({ type: UsageTimeSchema, required: true })
  usageTime: UsageTimeSchema;

  @Prop({ type: BrightnessStatsSchema, default: {} })
  brightnessStats: BrightnessStatsSchema;

  @Prop({ type: [LightingModeStatsSchema], default: [] })
  lightingModeStats: LightingModeStatsSchema[];

  @Prop({ type: ScheduleStatsSchema, default: {} })
  scheduleStats: ScheduleStatsSchema;

  @Prop({ type: EnergyStatsSchema, default: {} })
  energyStats: EnergyStatsSchema;

  @Prop({ default: 0, min: 0 })
  connectionEvents: number;

  @Prop({ default: 0, min: 0 })
  disconnectionEvents: number;

  @Prop({ default: 0 })
  averageResponseTime: number; // en milisegundos

  // Timestamps automáticos
  createdAt: Date;
  updatedAt: Date;
}

export const StatisticSchema = SchemaFactory.createForClass(StatisticDocument);

// Índices para optimizar consultas
StatisticSchema.index({ userId: 1 });
StatisticSchema.index({ deviceId: 1 });
StatisticSchema.index({ period: 1 });
StatisticSchema.index({ date: 1 });
StatisticSchema.index({ userId: 1, deviceId: 1 });
StatisticSchema.index({ userId: 1, period: 1, date: -1 });
