import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RefreshToken } from '../../domain/entities/refresh-token.entity';
import { IRefreshTokenRepository } from '../../domain/repositories/refresh-token.repository.interface';
import { RefreshTokenDocument } from '../schemas/refresh-token.schema';

@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(
    @InjectModel(RefreshTokenDocument.name)
    private readonly refreshTokenModel: Model<RefreshTokenDocument>
  ) {}

  async save(refreshToken: RefreshToken): Promise<RefreshToken> {
    const refreshTokenDoc = new this.refreshTokenModel(this.toPersistence(refreshToken));
    const savedDoc = await refreshTokenDoc.save();
    return this.toDomain(savedDoc);
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const refreshTokenDoc = await this.refreshTokenModel.findOne({ token }).exec();
    return refreshTokenDoc ? this.toDomain(refreshTokenDoc) : null;
  }

  async findByUserId(userId: string): Promise<RefreshToken[]> {
    const refreshTokenDocs = await this.refreshTokenModel.find({ userId }).exec();
    return refreshTokenDocs.map(doc => this.toDomain(doc));
  }

  async revoke(token: string): Promise<void> {
    await this.refreshTokenModel.updateOne(
      { token },
      { isRevoked: true }
    ).exec();
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.refreshTokenModel.updateMany(
      { userId },
      { isRevoked: true }
    ).exec();
  }

  async deleteExpired(): Promise<void> {
    await this.refreshTokenModel.deleteMany({
      $or: [
        { expiresAt: { $lt: new Date() } },
        { isRevoked: true }
      ]
    }).exec();
  }

  private toDomain(refreshTokenDoc: RefreshTokenDocument): RefreshToken {
    return new RefreshToken(
      (refreshTokenDoc._id as any).toString(),
      refreshTokenDoc.userId,
      refreshTokenDoc.token,
      refreshTokenDoc.expiresAt,
      refreshTokenDoc.isRevoked,
      (refreshTokenDoc as any).createdAt || new Date()
    );
  }

  private toPersistence(refreshToken: RefreshToken): Partial<RefreshTokenDocument> {
    return {
      userId: refreshToken.userId,
      token: refreshToken.token,
      expiresAt: refreshToken.expiresAt,
      isRevoked: refreshToken.isRevoked
    };
  }
}
