import { IsString, IsNotEmpty, IsNumber, Min, Max, IsOptional, IsBoolean, IsIn, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PairDeviceDto {
  @ApiProperty({
    description: 'Identificador único del dispositivo',
    example: 'D123456789'
  })
  @IsString({ message: 'deviceId debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'deviceId no puede estar vacío' })
  @Length(5, 50, { message: 'deviceId debe tener entre 5 y 50 caracteres' })
  deviceId: string;

  @ApiProperty({
    description: 'Nombre amigable para el dispositivo',
    example: 'Lámpara de sala'
  })
  @IsString({ message: 'name debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'name no puede estar vacío' })
  @Length(2, 100, { message: 'name debe tener entre 2 y 100 caracteres' })
  name: string;

  @ApiProperty({
    description: 'Tipo de dispositivo',
    example: 'light'
  })
  @IsString({ message: 'type debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'type no puede estar vacío' })
  @Matches(/^[a-zA-Z0-9_-]+$/, { message: 'type solo puede contener letras, números, guiones y guiones bajos' })
  type: string;

  @ApiProperty({
    description: 'Modelo del dispositivo',
    example: 'SIAMP-L1'
  })
  @IsString({ message: 'model debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'model no puede estar vacío' })
  model: string;

  @ApiProperty({
    description: 'Versión del firmware del dispositivo',
    example: '1.2.3',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'firmwareVersion debe ser una cadena de texto' })
  firmwareVersion?: string;

  @ApiProperty({
    description: 'Tipo de hábitat o habitación donde está el dispositivo',
    example: 'sala',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'habitatType debe ser una cadena de texto' })
  habitatType?: string;

  @ApiProperty({
    description: 'Nombre de la red WiFi a la que está conectado el dispositivo',
    example: 'Mi-Red-WiFi',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'ssid debe ser una cadena de texto' })
  ssid?: string;
  @ApiProperty({
    description: 'Dirección IP del dispositivo',
    example: '192.168.1.100',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'ipAddress debe ser una cadena de texto' })
  @Matches(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, { message: 'ipAddress debe ser una dirección IP válida' })
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
  @IsBoolean()
  @IsOptional()
  on?: boolean;

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
