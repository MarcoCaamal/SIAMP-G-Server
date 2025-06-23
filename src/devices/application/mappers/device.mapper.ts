import { Device } from '../../domain/entities/device.entity';
import { DeviceResponseDto, DeviceListResponseDto, DeviceControlResponseDto } from '../dto/device-response.dto';

export class DeviceMapper {  
  static toResponseDto(device: Device): DeviceResponseDto {
    return {
      id: device.id,
      deviceId: device.deviceId,
      name: device.name,
      type: device.type,
      model: device.model,
      firmwareVersion: device.firmwareVersion,
      habitatType: device.habitatType,
      status: {
        isConnected: device.status.isConnected,
        lastConnectedAt: device.status.lastConnectedAt,
        currentState: device.status.currentState,
        brightness: device.status.brightness,
        color: {
          mode: device.status.color.mode,
          rgb: {
            r: device.status.color.rgb.r,
            g: device.status.color.rgb.g,
            b: device.status.color.rgb.b
          },
          temperature: device.status.color.temperature
        }
      },
      networkConfig: {
        ssid: device.networkConfig.ssid,
        ipAddress: device.networkConfig.ipAddress
      },
      createdAt: device.createdAt,
      updatedAt: device.updatedAt,
    };
  }

  static toListResponseDto(devices: Device[]): DeviceListResponseDto {
    const deviceDtos = devices.map(device => this.toResponseDto(device));
    const connectedCount = devices.filter(device => device.status.isConnected).length;
    
    return {
      devices: deviceDtos,
      total: devices.length,
      connectedCount,
      disconnectedCount: devices.length - connectedCount,
    };
  }
  static toControlResponseDto(success: boolean, message: string, device?: Device): DeviceControlResponseDto {
    const response: DeviceControlResponseDto = {
      success,
      message,
    };

    if (device && success) {
      response.deviceStatus = {
        isConnected: device.status.isConnected,
        currentState: device.status.currentState,
        brightness: device.status.brightness,
        color: {
          mode: device.status.color.mode,
          rgb: {
            r: device.status.color.rgb.r,
            g: device.status.color.rgb.g,
            b: device.status.color.rgb.b
          },
          temperature: device.status.color.temperature
        }
      };
    }

    return response;
  }
}
