import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class GetUserProfileDto {
  @ApiProperty({
    description: 'ID del usuario',
    example: '60d5f8b8b612d532a483c567'
  })
  userId: string;
}

export class UpdateUserProfileDto {
  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Marco Caamal',
    required: false
  })
  @IsNotEmpty()
  name?: string;

  @ApiProperty({
    description: 'Primer apellido del usuario',
    example: 'Caamal',
    required: false
  })
  @IsNotEmpty()
  firstLastName?: string;

  @ApiProperty({
    description: 'Segundo apellido del usuario',
    example: 'Gonzalez',
    required: false
  })
  @IsNotEmpty()
  secondLastName?: string;

  @ApiProperty({
    description: 'Zona horaria del usuario',
    example: 'America/Mexico_City',
    required: false
  })
  @IsNotEmpty()
  timezone?: string;
}

export class UpdateNotificationPreferencesDto {
  @ApiProperty({
    description: 'Habilitar notificaciones por email',
    example: true,
    required: false
  })
  @IsOptional()
  email?: boolean;

  @ApiProperty({
    description: 'Habilitar notificaciones push',
    example: true,
    required: false
  })
  @IsOptional()
  push?: boolean;

  @ApiProperty({
    description: 'Configuración de horas silenciosas',
    required: false,
    example: {
      enabled: true,
      start: '22:00',
      end: '08:00'
    },
    nullable: true
  })
  @IsOptional()
  silentHours?: {
    enabled?: boolean;
    start?: string;
    end?: string;
  };
  @ApiProperty({
    description: 'Tipos de eventos para notificaciones',
    required: false,
    example: {
      deviceConnection: true,
      deviceDisconnection: true,
      scheduledEvent: true,
      systemAlerts: true
    },
    nullable: true
  })
  @IsOptional()
  @IsString()
  eventTypes?: {
    deviceConnection?: boolean;
    deviceDisconnection?: boolean;
    scheduledEvent?: boolean;
    systemAlerts?: boolean;
  };
}

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Contraseña actual del usuario',
    example: 'CurrentP@ssw0rd'
  })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({
    description: 'Nueva contraseña del usuario',
    example: 'NewStr0ngP@ssw0rd'
  })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1
  })
  newPassword: string;
}
