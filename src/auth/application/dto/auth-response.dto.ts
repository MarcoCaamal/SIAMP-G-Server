import { ApiProperty } from '@nestjs/swagger';

/**
 * Clase para los datos del usuario en respuestas exitosas
 */
class UserData {
  @ApiProperty({
    description: 'ID del usuario',
    example: '60d5f8b8b612d532a483c567'
  })
  id: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Marco'
  })
  name: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'usuario@ejemplo.com'
  })
  email: string;

  @ApiProperty({
    description: 'Estado de la cuenta del usuario',
    example: 'active'
  })
  status: string;
}

/**
 * Clase para el valor de respuesta en casos exitosos
 */
class ResponseValue {
  @ApiProperty({
    description: 'Token de acceso utilizado para autenticación',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  accessToken: string;

  @ApiProperty({
    description: 'Token de actualización para obtener nuevos tokens de acceso',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Datos del usuario',
    type: UserData
  })
  user: UserData;
}

/**
 * Clase para respuestas exitosas del servicio de autenticación
 */
export class AuthSuccessResponse {
  @ApiProperty({
    description: 'Indica si la operación fue exitosa',
    example: true
  })
  _isSuccess: boolean;

  @ApiProperty({
    description: 'Datos de la respuesta exitosa',
    type: ResponseValue
  })
  _value: ResponseValue;
  @ApiProperty({
    description: 'Mensaje de éxito (opcional)',
    example: 'Operación completada con éxito',
    required: false
  })
  message?: string;
}

/**
 * Clase para representar la estructura de errores en el dominio
 * @see ErrorResult en shared/result/interfaces/error.interface.ts
 */
class ErrorData {
  @ApiProperty({
    description: 'Código interno del error',
    example: 'AUTH_006',
    enum: [
      'AUTH_001', // Usuario ya existe
      'AUTH_002', // Formato de email inválido
      'AUTH_003', // Contraseña débil
      'AUTH_004', // Error servicio email
      'AUTH_005', // Error de base de datos
      'AUTH_006', // Credenciales inválidas
      // Otros códigos de error definidos en AuthErrors
    ]
  })
  code: string;

  @ApiProperty({
    description: 'Mensaje de error',
    example: 'Invalid credentials'
  })
  message: string;

  @ApiProperty({
    description: 'Código de estado HTTP del error',
    example: 401
  })
  statusCode: number;
}

/**
 * Clase para respuestas de error del servicio de autenticación
 */
export class AuthErrorResponse {
  @ApiProperty({
    description: 'Indica si la operación falló',
    example: false
  })
  _isSuccess: boolean;
  
  @ApiProperty({
    description: 'Detalles del error',
    type: ErrorData
  })
  _error: ErrorData;
}
