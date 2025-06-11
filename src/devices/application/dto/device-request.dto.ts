import { IsString, IsNotEmpty, IsNumber, Min, Max, IsOptional, IsBoolean, IsIn } from 'class-validator';

export class PairDeviceDto {
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString()
  @IsOptional()
  firmwareVersion?: string;

  @IsString()
  @IsOptional()
  habitatType?: string;

  @IsString()
  @IsOptional()
  ssid?: string;

  @IsString()
  @IsOptional()
  ipAddress?: string;
}

export class UpdateDeviceDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  habitatType?: string;
}

export class ControlDeviceDto {
  @IsString()
  @IsOptional()
  @IsIn(['on', 'off'])
  action?: 'on' | 'off';

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  brightness?: number;

  @IsOptional()
  color?: {
    mode: 'rgb' | 'temperature';
    rgb?: {
      r: number;
      g: number;
      b: number;
    };
    temperature?: number;
  };
}

export class DeviceStatusDto {
  @IsBoolean()
  isConnected: boolean;

  @IsString()
  @IsIn(['on', 'off'])
  currentState: 'on' | 'off';

  @IsNumber()
  @Min(0)
  @Max(100)
  brightness: number;

  @IsOptional()
  color?: {
    mode: 'rgb' | 'temperature';
    rgb?: {
      r: number;
      g: number;
      b: number;
    };
    temperature?: number;
  };
}
