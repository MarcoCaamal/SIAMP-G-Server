import { ApiProperty } from '@nestjs/swagger';

/**
 * Clase para los datos del perfil de usuario
 */
export class UserProfileData {
  @ApiProperty({
    description: 'ID del usuario',
    example: '60d5f8b8b612d532a483c567'
  })
  id: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Marco Caamal'
  })
  name: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'usuario@ejemplo.com'
  })
  email: string;

  @ApiProperty({
    description: 'Zona horaria del usuario',
    example: 'America/Mexico_City',
    required: false
  })
  timezone?: string;

  @ApiProperty({
    description: 'URL de la foto de perfil del usuario',
    example: 'https://example.com/profiles/user123.jpg',
    required: false
  })
  profilePicture?: string;

  @ApiProperty({
    description: 'Estado de la cuenta del usuario',
    example: 'active'
  })
  status: string;

  @ApiProperty({
    description: 'Preferencias de notificación',
    required: false
  })
  notificationPreferences?: {
    email: boolean;
    push: boolean;
    silentHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
    eventTypes: {
      deviceConnection: boolean;
      deviceDisconnection: boolean;
      scheduledEvent: boolean;
      systemAlerts: boolean;
    };
  };
}

/**
 * Clase para el valor de respuesta en casos exitosos
 */
export class UserResponseValue {
  @ApiProperty({
    description: 'Datos del perfil del usuario',
    type: UserProfileData
  })
  user: UserProfileData;
}

/**
 * Clase para respuestas exitosas del servicio de usuarios
 */
export class UserSuccessResponse {
  @ApiProperty({
    description: 'Indica si la operación fue exitosa',
    example: true
  })
  _isSuccess: boolean;

  @ApiProperty({
    description: 'Datos de la respuesta exitosa',
    type: UserResponseValue
  })
  _value: UserResponseValue;
}

/**
 * Clase para representar errores del servicio de usuarios
 */
export class UserErrorData {
  @ApiProperty({
    description: 'Código interno del error',
    example: 'USER_001',
    enum: [
      'USER_001', // Usuario no encontrado
      'USER_002', // Usuario no autenticado
      'USER_003', // Contraseña actual incorrecta
      'USER_004', // Contraseña débil
      'USER_005', // Datos del perfil inválidos
      'USER_006', // Preferencias de notificación inválidas
      'USER_007', // Error al actualizar perfil
      'USER_008', // Error al cambiar contraseña
    ]
  })
  code: string;

  @ApiProperty({
    description: 'Mensaje de error',
    example: 'Usuario no encontrado'
  })
  message: string;

  @ApiProperty({
    description: 'Código de estado HTTP del error',
    example: 404
  })
  statusCode: number;
}

/**
 * Clase para respuestas de error del servicio de usuarios
 */
export class UserErrorResponse {
  @ApiProperty({
    description: 'Indica si la operación falló',
    example: false
  })
  _isSuccess: boolean;
  
  @ApiProperty({
    description: 'Detalles del error',
    type: UserErrorData
  })
  _error: UserErrorData;
}
