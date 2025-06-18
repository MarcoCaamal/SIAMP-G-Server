import { ApiProperty } from '@nestjs/swagger';

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
  name?: string;

  @ApiProperty({
    description: 'Zona horaria del usuario',
    example: 'America/Mexico_City',
    required: false
  })
  timezone?: string;

  @ApiProperty({
    description: 'URL de la foto de perfil',
    example: 'https://example.com/profiles/user123.jpg',
    required: false
  })
  profilePicture?: string;
}

export class UpdateNotificationPreferencesDto {
  @ApiProperty({
    description: 'Habilitar notificaciones por email',
    example: true,
    required: false
  })
  email?: boolean;

  @ApiProperty({
    description: 'Habilitar notificaciones push',
    example: true,
    required: false
  })
  push?: boolean;  @ApiProperty({
    description: 'Configuración de horas silenciosas',
    required: false,
    example: {
      enabled: true,
      start: '22:00',
      end: '08:00'
    },
    nullable: true
  })
  silentHours?: {
    enabled?: boolean;
    start?: string;
    end?: string;
  };  @ApiProperty({
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
  currentPassword: string;

  @ApiProperty({
    description: 'Nueva contraseña del usuario',
    example: 'NewStr0ngP@ssw0rd'
  })
  newPassword: string;
}
