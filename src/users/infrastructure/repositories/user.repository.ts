import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  User,
  NotificationPreferences,
  VerificationToken,
  UserStatus,
  AccountType,
} from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(UserDocument.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async findById(id: string): Promise<User | null> {
    const userDoc = await this.userModel.findById(id).exec();
    return userDoc ? this.toDomain(userDoc) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await this.userModel.findOne({ email }).exec();
    return userDoc ? this.toDomain(userDoc) : null;
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    const userDoc = await this.userModel
      .findOne({
        'verificationToken.token': token,
        'verificationToken.expiresAt': { $gt: new Date() },
      })
      .exec();
    return userDoc ? this.toDomain(userDoc) : null;
  }

  async findByVerificationCode(code: string): Promise<User | null> {
    const userDoc = await this.userModel
      .findOne({
        'verificationToken.token': code,
        'verificationToken.expiresAt': { $gt: new Date() },
      })
      .exec();
    return userDoc ? this.toDomain(userDoc) : null;
  }

  async save(user: User): Promise<User> {
    const userDoc = new this.userModel(this.toPersistence(user));
    const savedDoc = await userDoc.save();
    return this.toDomain(savedDoc);
  }

  async update(user: User): Promise<User> {
    const updatedDoc = await this.userModel
      .findByIdAndUpdate(user.id, this.toPersistence(user), { new: true })
      .exec();

    if (!updatedDoc) {
      throw new Error('User not found');
    }

    return this.toDomain(updatedDoc);
  }

  async delete(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }

  private toDomain(userDoc: UserDocument): User {
    const notificationPreferences: NotificationPreferences = {
      email: userDoc.notificationPreferences?.email ?? true,
      push: userDoc.notificationPreferences?.push ?? true,
      silentHours: {
        enabled: userDoc.notificationPreferences?.silentHours?.enabled ?? false,
        start: userDoc.notificationPreferences?.silentHours?.start ?? '22:00',
        end: userDoc.notificationPreferences?.silentHours?.end ?? '08:00',
      },
      eventTypes: {
        deviceConnection:
          userDoc.notificationPreferences?.eventTypes?.deviceConnection ?? true,
        deviceDisconnection:
          userDoc.notificationPreferences?.eventTypes?.deviceDisconnection ??
          true,
        scheduledEvent:
          userDoc.notificationPreferences?.eventTypes?.scheduledEvent ?? true,
        systemAlerts:
          userDoc.notificationPreferences?.eventTypes?.systemAlerts ?? true,
      },
    };

    const verificationToken: VerificationToken | null =
      userDoc.verificationToken
        ? {
            token: userDoc.verificationToken.token,
            expiresAt: userDoc.verificationToken.expiresAt,
          }
        : null;
    return new User(
      String(userDoc._id), // ✅ Conversión segura usando String()
      userDoc.name,
      userDoc.email,
      userDoc.password,
      userDoc.timezone,
      userDoc.profilePicture,
      userDoc.status as UserStatus,
      verificationToken,
      userDoc.failedLoginAttempts,
      userDoc.lastLoginAt,
      userDoc.lastLoginDevice,
      userDoc.lastLoginLocation,
      notificationPreferences,
      userDoc.accountType as AccountType,
      userDoc.createdAt ? new Date(userDoc.createdAt) : new Date(), // ✅ Conversión segura
      userDoc.updatedAt ? new Date(userDoc.updatedAt) : new Date(), // ✅ Conversión segura
    );
  }

  private toPersistence(user: User): Partial<UserDocument> {
    return {
      name: user.name,
      email: user.email,
      password: user.password,
      timezone: user.timezone,
      profilePicture: user.profilePicture,
      status: user.status,
      verificationToken: user.verificationToken,
      failedLoginAttempts: user.failedLoginAttempts,
      lastLoginAt: user.lastLoginAt,
      lastLoginDevice: user.lastLoginDevice,
      lastLoginLocation: user.lastLoginLocation,
      notificationPreferences: user.notificationPreferences,
      accountType: user.accountType,
    };
  }
}
