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
export class StateConfigSchema {
  @Prop({ required: true, enum: ['on', 'off'] })
  power: string;

  @Prop({ required: true, min: 0, max: 100 })
  brightness: number;

  @Prop({ type: ColorConfigSchema, required: true })
  color: ColorConfigSchema;
}

@Schema({ _id: false })
export class TransitionConfigSchema {
  @Prop({ required: true, enum: ['fade', 'instant', 'ease-in', 'ease-out'] })
  type: string;

  @Prop({ required: true, min: 0 })
  duration: number; // Transition duration in seconds
}

@Schema({ _id: false })
export class SequenceStepSchema {
  @Prop({ required: true, min: 0 })
  duration: number; // Duration of this step in seconds

  @Prop({ type: StateConfigSchema, required: true })
  state: StateConfigSchema;

  @Prop({ type: TransitionConfigSchema, required: true })
  transition: TransitionConfigSchema;
}

@Schema({ collection: 'lightingModes', timestamps: true })
export class LightingModeDocument extends Document {
  @Prop({ type: Types.ObjectId, ref: 'UserDocument', default: null })
  userId: Types.ObjectId | null; // null for system modes

  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ required: true, enum: ['user', 'system'] })
  category: string;

  @Prop({ required: true })
  habitatType: string;

  @Prop({ type: [SequenceStepSchema], required: true })
  sequence: SequenceStepSchema[];

  @Prop({ default: false })
  isShared: boolean;

  @Prop({ type: String, unique: true, sparse: true })
  shareCode: string; // Unique code for sharing

  @Prop({ type: Types.ObjectId, ref: 'LightingModeDocument', default: null })
  originalModeId: Types.ObjectId | null; // Reference to original mode if this is a copy

  @Prop({ type: Types.ObjectId, ref: 'UserDocument', default: null })
  originalAuthorId: Types.ObjectId | null; // Reference to original author if shared

  // Timestamps automáticos
  createdAt: Date;
  updatedAt: Date;
}

export const LightingModeSchema = SchemaFactory.createForClass(LightingModeDocument);

// Índices para optimizar consultas
LightingModeSchema.index({ userId: 1 });
LightingModeSchema.index({ category: 1 });
LightingModeSchema.index({ habitatType: 1 });
LightingModeSchema.index({ userId: 1, category: 1 });
LightingModeSchema.index({ isShared: 1 });
LightingModeSchema.index({ shareCode: 1 });
LightingModeSchema.index({ originalModeId: 1 });
LightingModeSchema.index({ originalAuthorId: 1 });
