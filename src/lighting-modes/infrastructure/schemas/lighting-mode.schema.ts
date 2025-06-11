import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false })
export class ColorConfigSchema {
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
export class LightingConfigSchema {
  @Prop({ required: true, min: 0, max: 100 })
  brightness: number;

  @Prop({ type: ColorConfigSchema, required: true })
  color: ColorConfigSchema;

  @Prop({ default: 0, min: 0 })
  transitionDuration: number; // milisegundos

  @Prop({ default: false })
  isAnimated: boolean;

  @Prop({ default: 1000, min: 100 })
  animationSpeed: number; // milisegundos
}

@Schema({ collection: 'lightingModes', timestamps: true })
export class LightingModeDocument extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'UserDocument' })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ required: true, enum: ['system', 'user'] })
  type: string;

  @Prop({ type: LightingConfigSchema, required: true })
  config: LightingConfigSchema;

  @Prop({ required: true, enum: ['relaxation', 'focus', 'sleep', 'party', 'reading', 'custom'] })
  category: string;

  @Prop({ default: 0 })
  usageCount: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isFavorite: boolean;

  // Timestamps automáticos
  createdAt: Date;
  updatedAt: Date;
}

export const LightingModeSchema = SchemaFactory.createForClass(LightingModeDocument);

// Índices para optimizar consultas
LightingModeSchema.index({ userId: 1 });
LightingModeSchema.index({ type: 1 });
LightingModeSchema.index({ category: 1 });
LightingModeSchema.index({ userId: 1, isActive: 1 });
LightingModeSchema.index({ userId: 1, isFavorite: 1 });
