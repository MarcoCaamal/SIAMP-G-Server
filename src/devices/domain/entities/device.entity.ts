export interface DeviceStatus {
  isConnected: boolean;
  lastConnectedAt: Date;
  currentState: 'on' | 'off';
  brightness: number; // 0-100
  color: {
    mode: 'rgb' | 'temperature';
    rgb: {
      r: number;
      g: number;
      b: number;
    };
    temperature: number; // Kelvin
  };
}

export interface NetworkConfig {
  ssid: string;
  ipAddress: string;
}

export class Device {
  constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private readonly _deviceId: string,
    private _name: string,
    private readonly _type: string,
    private readonly _model: string,
    private _firmwareVersion: string,
    private _habitatType: string,
    private _status: DeviceStatus,
    private _networkConfig: NetworkConfig,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
  ) {}

  // Getters
  get id(): string { return this._id; }
  get userId(): string { return this._userId; }
  get deviceId(): string { return this._deviceId; }
  get name(): string { return this._name; }
  get type(): string { return this._type; }
  get model(): string { return this._model; }
  get firmwareVersion(): string { return this._firmwareVersion; }
  get habitatType(): string { return this._habitatType; }
  get status(): DeviceStatus { return { ...this._status }; }
  get networkConfig(): NetworkConfig { return { ...this._networkConfig }; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  // Métodos de dominio
  updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Device name cannot be empty');
    }
    this._name = name.trim();
    this._updatedAt = new Date();
  }

  updateFirmwareVersion(version: string): void {
    this._firmwareVersion = version;
    this._updatedAt = new Date();
  }

  updateHabitatType(habitatType: string): void {
    this._habitatType = habitatType;
    this._updatedAt = new Date();
  }

  updateStatus(status: Partial<DeviceStatus>): void {
    this._status = { ...this._status, ...status };
    this._updatedAt = new Date();
  }

  updateNetworkConfig(config: Partial<NetworkConfig>): void {
    this._networkConfig = { ...this._networkConfig, ...config };
    this._updatedAt = new Date();
  }

  turnOn(): void {
    this._status.currentState = 'on';
    this._status.lastConnectedAt = new Date();
    this._updatedAt = new Date();
  }

  turnOff(): void {
    this._status.currentState = 'off';
    this._updatedAt = new Date();
  }

  setBrightness(brightness: number): void {
    if (brightness < 0 || brightness > 100) {
      throw new Error('Brightness must be between 0 and 100');
    }
    this._status.brightness = brightness;
    this._updatedAt = new Date();
  }

  setRgbColor(r: number, g: number, b: number): void {
    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
      throw new Error('RGB values must be between 0 and 255');
    }
    this._status.color = {
      mode: 'rgb',
      rgb: { r, g, b },
      temperature: this._status.color.temperature,
    };
    this._updatedAt = new Date();
  }

  setTemperature(temperature: number): void {
    if (temperature < 1000 || temperature > 10000) {
      throw new Error('Temperature must be between 1000K and 10000K');
    }
    this._status.color = {
      mode: 'temperature',
      rgb: this._status.color.rgb,
      temperature,
    };
    this._updatedAt = new Date();
  }

  setConnectionStatus(isConnected: boolean): void {
    this._status.isConnected = isConnected;
    if (isConnected) {
      this._status.lastConnectedAt = new Date();
    }
    this._updatedAt = new Date();
  }

  canBeControlled(): boolean {
    return this._status.isConnected;
  }

  isOwnedBy(userId: string): boolean {
    return this._userId === userId;
  }
}