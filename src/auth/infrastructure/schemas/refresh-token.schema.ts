import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'refresh_tokens', timestamps: true })
export class RefreshTokenDocument extends Document {
  @Prop({ type: Types.ObjectId, ref: 'UserDocument', default: null })
  userId: string;

  @Prop({ required: true, unique: true })
  token: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: false })
  isRevoked: boolean;

  // Timestamps automáticos
  createdAt: Date;
  updatedAt: Date;
}

export const RefreshTokenSchema =
  SchemaFactory.createForClass(RefreshTokenDocument);
