import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class VerificationTokenSchema {
  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  expiresAt: Date;
}

@Schema({ _id: false })
export class ResetTokenSchema {
  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  expiresAt: Date;
}

@Schema({ _id: false })
export class SilentHoursSchema {
  @Prop({ default: false })
  enabled: boolean;

  @Prop({ default: '22:00' })
  start: string;

  @Prop({ default: '08:00' })
  end: string;
}

@Schema({ _id: false })
export class EventTypesSchema {
  @Prop({ default: true })
  deviceConnection: boolean;

  @Prop({ default: true })
  deviceDisconnection: boolean;

  @Prop({ default: true })
  scheduledEvent: boolean;

  @Prop({ default: true })
  systemAlerts: boolean;
}

@Schema({ _id: false })
export class NotificationPreferencesSchema {
  @Prop({ default: true })
  email: boolean;

  @Prop({ default: true })
  push: boolean;

  @Prop({ type: SilentHoursSchema, default: {} })
  silentHours: SilentHoursSchema;

  @Prop({ type: EventTypesSchema, default: {} })
  eventTypes: EventTypesSchema;
}

@Schema({ collection: 'users', timestamps: true })
export class UserDocument extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  firstLastName: string;

  @Prop({ required: true })
  secondLastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'UTC' })
  timezone: string;

  @Prop({ default: '' })
  profilePicture: string;

  @Prop({ enum: ['pending', 'active', 'blocked'], default: 'pending' })
  status: string;

  @Prop({ type: VerificationTokenSchema, default: null })
  verificationToken: VerificationTokenSchema | null;

  @Prop({ type: ResetTokenSchema, default: null })
  resetToken: ResetTokenSchema | null;

  @Prop({ default: 0 })
  failedLoginAttempts: number;

  @Prop({ default: null, type: Date })
  lastLoginAt: Date | null;

  @Prop({ default: null, type: String })
  lastLoginDevice: string | null;

  @Prop({ default: null, type: String })
  lastLoginLocation: string | null;

  @Prop({ type: NotificationPreferencesSchema, default: {} })
  notificationPreferences: NotificationPreferencesSchema;

  @Prop({ enum: ['free', 'premium'], default: 'free' })
  accountType: string;

  // Timestamps automáticos (declarados explícitamente para TypeScript)
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
