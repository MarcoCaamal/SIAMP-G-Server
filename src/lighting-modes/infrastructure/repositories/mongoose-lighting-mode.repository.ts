import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { LightingMode } from '../../domain/entities/lighting-mode.entity';
import { ILightingModeRepository } from '../../domain/repositories/lighting-mode.repository.interface';
import { LightingModeDocument } from '../schemas/lighting-mode.schema';

@Injectable()
export class MongooseLightingModeRepository implements ILightingModeRepository {
  constructor(
    @InjectModel(LightingModeDocument.name)
    private readonly lightingModeModel: Model<LightingModeDocument>,
  ) {}

  async findById(id: string): Promise<LightingMode | null> {
    const document = await this.lightingModeModel.findById(id).exec();
    return document ? this.mapToEntity(document) : null;
  }

  async findByUserId(userId: string): Promise<LightingMode[]> {
    const documents = await this.lightingModeModel
      .find({ userId, category: 'user' })
      .exec();
    return documents.map(doc => this.mapToEntity(doc));
  }

  async findSystemModes(): Promise<LightingMode[]> {
    const documents = await this.lightingModeModel
      .find({ category: 'system' })
      .exec();
    return documents.map(doc => this.mapToEntity(doc));
  }

  async findByHabitatType(habitatType: string): Promise<LightingMode[]> {
    const documents = await this.lightingModeModel
      .find({ habitatType })
      .exec();
    return documents.map(doc => this.mapToEntity(doc));
  }

  async findByUserIdAndHabitatType(userId: string, habitatType: string): Promise<LightingMode[]> {
    const documents = await this.lightingModeModel
      .find({ userId, habitatType, category: 'user' })
      .exec();
    return documents.map(doc => this.mapToEntity(doc));
  }

  async findByShareCode(shareCode: string): Promise<LightingMode | null> {
    const document = await this.lightingModeModel
      .findOne({ shareCode, isShared: true })
      .exec();
    return document ? this.mapToEntity(document) : null;
  }

  async findSharedModes(): Promise<LightingMode[]> {
    const documents = await this.lightingModeModel
      .find({ isShared: true })
      .exec();
    return documents.map(doc => this.mapToEntity(doc));
  }

  async save(lightingMode: LightingMode): Promise<LightingMode> {
    const document = new this.lightingModeModel(this.mapToDocument(lightingMode));
    const savedDocument = await document.save();
    return this.mapToEntity(savedDocument);
  }

  async update(lightingMode: LightingMode): Promise<LightingMode> {
    const updatedDocument = await this.lightingModeModel
      .findByIdAndUpdate(
        lightingMode.id,
        this.mapToDocument(lightingMode),
        { new: true }
      )
      .exec();
    
    if (!updatedDocument) {
      throw new Error('Lighting mode not found for update');
    }
    
    return this.mapToEntity(updatedDocument);
  }

  async delete(id: string): Promise<void> {
    await this.lightingModeModel.findByIdAndDelete(id).exec();
  }

  async existsByShareCode(shareCode: string): Promise<boolean> {
    const count = await this.lightingModeModel
      .countDocuments({ shareCode })
      .exec();
    return count > 0;
  }

  private mapToEntity(document: LightingModeDocument): LightingMode {
    return new LightingMode(
      (document._id as Types.ObjectId).toString(),
      document.userId?.toString() || null,
      document.name,
      document.description,
      document.category as 'user' | 'system',
      document.habitatType,
      document.sequence.map(step => ({
        duration: step.duration,
        state: {
          power: step.state.power as 'on' | 'off',
          brightness: step.state.brightness,
          color: {
            mode: step.state.color.mode as 'rgb' | 'temperature',
            rgb: step.state.color.rgb,
            temperature: step.state.color.temperature,
          },
        },
        transition: {
          type: step.transition.type as 'fade' | 'instant' | 'ease-in' | 'ease-out',
          duration: step.transition.duration,
        },
      })),
      document.isShared,
      document.shareCode || null,
      document.originalModeId?.toString() || null,
      document.originalAuthorId?.toString() || null,
      document.createdAt,
      document.updatedAt,
    );
  }

  private mapToDocument(lightingMode: LightingMode): Partial<LightingModeDocument> {
    return {
      ...(lightingMode.id && { _id: new Types.ObjectId(lightingMode.id) }),
      userId: lightingMode.userId ? new Types.ObjectId(lightingMode.userId) : null,
      name: lightingMode.name,
      description: lightingMode.description,
      category: lightingMode.category,
      habitatType: lightingMode.habitatType,
      sequence: lightingMode.sequence,
      isShared: lightingMode.isShared,
      shareCode: lightingMode.shareCode || undefined,
      originalModeId: lightingMode.originalModeId ? new Types.ObjectId(lightingMode.originalModeId) : null,
      originalAuthorId: lightingMode.originalAuthorId ? new Types.ObjectId(lightingMode.originalAuthorId) : null,
    };
  }
}
