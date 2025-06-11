import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false })
export class ActionDataSchema {
  @Prop({ default: null })
  deviceId: Types.ObjectId;

  @Prop({ default: null })
  scheduleId: Types.ObjectId;

  @Prop({ default: null })
  lightingModeId: Types.ObjectId;

  @Prop({ default: null })
  previousValue: any;

  @Prop({ default: null })
  newValue: any;

  @Prop({ default: {} })
  additionalInfo: Record<string, any>;
}

@Schema({ _id: false })
export class DeviceInfoSchema {
  @Prop({ default: null })
  deviceType: string;

  @Prop({ default: null })
  firmwareVersion: string;

  @Prop({ default: null })
  ipAddress: string;

  @Prop({ default: null })
  userAgent: string;
}

@Schema({ collection: 'activityLogs', timestamps: true })
export class ActivityLogDocument extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'UserDocument' })
  userId: Types.ObjectId;

  @Prop({ 
    required: true, 
    enum: [
      'deviceControl', 
      'scheduleCreated', 
      'scheduleExecuted', 
      'scheduleModified', 
      'scheduleDeleted',
      'modeApplied', 
      'modeCreated', 
      'modeModified', 
      'modeDeleted',
      'deviceConnected', 
      'deviceDisconnected',
      'userLogin', 
      'userLogout',
      'settingsChanged',
      'notificationSent',
      'systemError'
    ] 
  })
  action: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: ['success', 'warning', 'error'] })
  result: string;

  @Prop({ type: ActionDataSchema, default: {} })
  actionData: ActionDataSchema;

  @Prop({ type: DeviceInfoSchema, default: {} })
  deviceInfo: DeviceInfoSchema;

  @Prop({ default: null })
  ipAddress: string;

  @Prop({ default: null })
  userAgent: string;

  @Prop({ default: null })
  errorMessage: string;

  @Prop({ default: null })
  errorCode: string;

  @Prop({ default: 0, min: 0 })
  executionTime: number; // en milisegundos

  @Prop({ default: null })
  sessionId: string;

  // Timestamps automáticos
  createdAt: Date;
  updatedAt: Date;
}

export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLogDocument);

// Índices para optimizar consultas
ActivityLogSchema.index({ userId: 1 });
ActivityLogSchema.index({ action: 1 });
ActivityLogSchema.index({ result: 1 });
ActivityLogSchema.index({ createdAt: -1 });
ActivityLogSchema.index({ userId: 1, action: 1 });
ActivityLogSchema.index({ userId: 1, createdAt: -1 });
ActivityLogSchema.index({ 'actionData.deviceId': 1 });
ActivityLogSchema.index({ sessionId: 1 });
