import { Device } from '../entities/device.entity';

export interface IDeviceRepository {
  findById(id: string): Promise<Device | null>;
  findByDeviceId(deviceId: string): Promise<Device | null>;
  findByUserId(userId: string): Promise<Device[]>;
  save(device: Device): Promise<Device>;
  update(device: Device): Promise<Device>;
  delete(id: string): Promise<void>;
  findConnectedDevices(): Promise<Device[]>;
  findByUserIdAndDeviceId(userId: string, deviceId: string): Promise<Device | null>;
  existsByDeviceId(deviceId: string): Promise<boolean>;
}

export const DEVICE_REPOSITORY = Symbol('DEVICE_REPOSITORY');
