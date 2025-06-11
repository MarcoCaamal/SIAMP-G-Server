import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false })
export class DeliveryMethodsSchema {
  @Prop({ default: false })
  email: boolean;

  @Prop({ default: false })
  push: boolean;

  @Prop({ default: false })
  sms: boolean;
}

@Schema({ _id: false })
export class NotificationDataSchema {
  @Prop({ default: null })
  deviceId: Types.ObjectId;

  @Prop({ default: null })
  scheduleId: Types.ObjectId;

  @Prop({ default: null })
  errorCode: string;

  @Prop({ default: {} })
  additionalInfo: Record<string, any>;
}

@Schema({ collection: 'notifications', timestamps: true })
export class NotificationDocument extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'UserDocument' })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: ['deviceConnection', 'deviceDisconnection', 'scheduledEvent', 'systemAlert'] })
  type: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true, enum: ['info', 'warning', 'error', 'success'] })
  priority: string;

  @Prop({ required: true, enum: ['pending', 'sent', 'delivered', 'failed', 'read'] })
  status: string;

  @Prop({ type: DeliveryMethodsSchema, required: true })
  deliveryMethods: DeliveryMethodsSchema;

  @Prop({ type: NotificationDataSchema, default: {} })
  data: NotificationDataSchema;

  @Prop({ default: null })
  scheduledFor: Date;

  @Prop({ default: null })
  sentAt: Date;

  @Prop({ default: null })
  readAt: Date;

  @Prop({ default: 0 })
  retryCount: number;

  @Prop({ default: 3 })
  maxRetries: number;

  @Prop({ default: null })
  errorMessage: string;

  // Timestamps automáticos
  createdAt: Date;
  updatedAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(NotificationDocument);

// Índices para optimizar consultas
NotificationSchema.index({ userId: 1 });
NotificationSchema.index({ type: 1 });
NotificationSchema.index({ status: 1 });
NotificationSchema.index({ scheduledFor: 1 });
NotificationSchema.index({ userId: 1, status: 1 });
NotificationSchema.index({ userId: 1, readAt: 1 });
NotificationSchema.index({ createdAt: -1 });
