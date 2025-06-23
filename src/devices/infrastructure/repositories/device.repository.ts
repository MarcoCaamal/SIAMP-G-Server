import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IDeviceRepository } from '../../domain/repositories/device.repository.interface';
import { Device } from '../../domain/entities/device.entity';
import { DeviceDocument } from '../schemas/device.schema';

@Injectable()
export class DeviceRepository implements IDeviceRepository {
  constructor(
    @InjectModel(DeviceDocument.name)
    private readonly deviceModel: Model<DeviceDocument>,
  ) {}

  async findById(id: string): Promise<Device | null> {
    const device = await this.deviceModel.findById(id);
    return device ? this.toDomain(device) : null;
  }

  async findByDeviceId(deviceId: string): Promise<Device | null> {
    const device = await this.deviceModel.findOne({ deviceId });
    return device ? this.toDomain(device) : null;
  }

  async findByUserId(userId: string): Promise<Device[]> {
    const devices = await this.deviceModel.find({ userId: new Types.ObjectId(userId) });
    return devices.map(device => this.toDomain(device));
  }

  async save(device: Device): Promise<Device> {
    const deviceDoc = new this.deviceModel({
      userId: new Types.ObjectId(device.userId),
      deviceId: device.deviceId,
      name: device.name,
      type: device.type,
      deviceModel: device.model,
      firmwareVersion: device.firmwareVersion,
      habitatType: device.habitatType,
      status: device.status,
      networkConfig: device.networkConfig,
      createdAt: device.createdAt,
      updatedAt: new Date(),
    });

    const saved = await deviceDoc.save();
    return this.toDomain(saved);
  }

  async update(device: Device): Promise<Device> {
    const updated = await this.deviceModel.findByIdAndUpdate(
      device.id,
      {
        name: device.name,
        firmwareVersion: device.firmwareVersion,
        habitatType: device.habitatType,
        status: device.status,
        networkConfig: device.networkConfig,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updated) {
      throw new Error('Device not found for update');
    }

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.deviceModel.findByIdAndDelete(id);
  }

  async findConnectedDevices(): Promise<Device[]> {
    const devices = await this.deviceModel.find({ 'status.isConnected': true });
    return devices.map(device => this.toDomain(device));
  }

  async findByUserIdAndDeviceId(userId: string, deviceId: string): Promise<Device | null> {
    const device = await this.deviceModel.findOne({ 
      userId: new Types.ObjectId(userId), 
      deviceId 
    });
    return device ? this.toDomain(device) : null;
  }
  async existsByDeviceId(deviceId: string): Promise<boolean> {
    const count = await this.deviceModel.countDocuments({ deviceId });
    return count > 0;
  }

  async updateOnlineStatus(deviceId: string, isOnline: boolean): Promise<void> {
    const result = await this.deviceModel.updateOne(
      { deviceId },
      { 
        $set: { 
          'status.isConnected': isOnline,
          'status.lastConnectedAt': isOnline ? new Date() : undefined
        } 
      }
    );
    
    if (result.matchedCount === 0) {
      console.warn(`Device with ID ${deviceId} not found for online status update`);
    }
  }
  private toDomain(doc: DeviceDocument): Device {
    return new Device(
      (doc._id as any).toString(),
      doc.userId.toString(),
      doc.deviceId,
      doc.name,
      doc.type,
      doc.deviceModel,
      doc.firmwareVersion,
      doc.habitatType,
      {
        isConnected: doc.status.isConnected,
        lastConnectedAt: doc.status.lastConnectedAt,
        currentState: doc.status.currentState as 'on' | 'off',
        brightness: doc.status.brightness,
        color: {
          mode: doc.status.color.mode as 'rgb' | 'temperature',
          rgb: doc.status.color.rgb,
          temperature: doc.status.color.temperature,
        },
      },
      doc.networkConfig,
      doc.createdAt,
      doc.updatedAt,
    );
  }
}
