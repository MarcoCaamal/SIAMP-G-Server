import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false })
export class ColorConfig {
  @Prop({ required: true, enum: ['rgb', 'temperature'] })
  mode: string;

  @Prop({
    type: {
      r: { type: Number, min: 0, max: 255 },
      g: { type: Number, min: 0, max: 255 },
      b: { type: Number, min: 0, max: 255 },
    },
    required: true,
  })
  rgb: {
    r: number;
    g: number;
    b: number;
  };

  @Prop({ min: 1000, max: 10000, required: true })
  temperature: number;
}

@Schema({ _id: false })
export class DeviceStatusSchema {
  @Prop({ required: true, default: false })
  isConnected: boolean;

  @Prop({ default: null })
  lastConnectedAt: Date;

  @Prop({ required: true, enum: ['on', 'off'], default: 'off' })
  currentState: string;

  @Prop({ required: true, min: 0, max: 100, default: 0 })
  brightness: number;

  @Prop({ type: ColorConfig, required: true })
  color: ColorConfig;
}

@Schema({ _id: false })
export class NetworkConfigSchema {
  @Prop({ required: true, default: '' })
  ssid: string;

  @Prop({ required: true, default: '' })
  ipAddress: string;
}

@Schema({ collection: 'devices', timestamps: true })
export class DeviceDocument extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'UserDocument' })
  userId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  deviceId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string;
  @Prop({ required: true })
  deviceModel: string;

  @Prop({ default: '1.0.0' })
  firmwareVersion: string;

  @Prop({ default: 'general' })
  habitatType: string;

  @Prop({ type: DeviceStatusSchema, required: true })
  status: DeviceStatusSchema;

  @Prop({ type: NetworkConfigSchema, required: true })
  networkConfig: NetworkConfigSchema;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const DeviceSchema = SchemaFactory.createForClass(DeviceDocument);

// Índices según la documentación
DeviceSchema.index({ userId: 1 });
DeviceSchema.index({ deviceId: 1 }, { unique: true });
DeviceSchema.index({ 'status.isConnected': 1 });
