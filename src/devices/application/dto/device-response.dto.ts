export class DeviceResponseDto {
  id: string;
  deviceId: string;
  name: string;
  type: string;
  model: string;
  firmwareVersion: string;
  habitatType: string;
  status: {
    isConnected: boolean;
    lastConnectedAt: Date;
    currentState: 'on' | 'off';
    brightness: number;
    color: {
      mode: 'rgb' | 'temperature';
      rgb: {
        r: number;
        g: number;
        b: number;
      };
      temperature: number;
    };
  };
  networkConfig: {
    ssid: string;
    ipAddress: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export class DeviceListResponseDto {
  devices: DeviceResponseDto[];
  total: number;
  connectedCount: number;
  disconnectedCount: number;
}

export class DeviceControlResponseDto {
  success: boolean;
  message: string;
  deviceStatus?: {
    isConnected: boolean;
    currentState: 'on' | 'off';
    brightness: number;
    color: {
      mode: 'rgb' | 'temperature';
      rgb: {
        r: number;
        g: number;
        b: number;
      };
      temperature: number;
    };
  };
}
