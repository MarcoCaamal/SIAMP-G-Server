import { ErrorResult } from '../../../shared/result/interfaces/error.interface';

export class UserErrors {
  static readonly USER_NOT_FOUND: ErrorResult = {
    code: 'USER_001',
    message: 'Usuario no encontrado',
    statusCode: 404,
  };

  static readonly UNAUTHORIZED: ErrorResult = {
    code: 'USER_002',
    message: 'Usuario no autenticado',
    statusCode: 401,
  };

  static readonly INVALID_CURRENT_PASSWORD: ErrorResult = {
    code: 'USER_003',
    message: 'La contraseña actual es incorrecta',
    statusCode: 400,
  };

  static readonly WEAK_PASSWORD: ErrorResult = {
    code: 'USER_004',
    message: 'La nueva contraseña debe tener al menos 8 caracteres',
    statusCode: 400,
  };

  static readonly INVALID_PROFILE_DATA: ErrorResult = {
    code: 'USER_005',
    message: 'Datos del perfil inválidos',
    statusCode: 400,
  };

  static readonly INVALID_NOTIFICATION_PREFERENCES: ErrorResult = {
    code: 'USER_006',
    message: 'Preferencias de notificación inválidas',
    statusCode: 400,
  };

  static readonly PROFILE_UPDATE_FAILED: ErrorResult = {
    code: 'USER_007',
    message: 'Error al actualizar el perfil del usuario',
    statusCode: 500,
  };

  static readonly PASSWORD_CHANGE_FAILED: ErrorResult = {
    code: 'USER_008',
    message: 'Error al cambiar la contraseña',
    statusCode: 500,
  };

  static readonly NOTIFICATION_PREFERENCES_UPDATE_FAILED: ErrorResult = {
    code: 'USER_009',
    message: 'Error al actualizar las preferencias de notificación',
    statusCode: 500,
  };

  static readonly DATABASE_ERROR: ErrorResult = {
    code: 'USER_010',
    message: 'Error de base de datos',
    statusCode: 500,
  };

  static readonly SAME_PASSWORD_ERROR: ErrorResult = {
    code: 'USER_011',
    message: 'La nueva contraseña debe ser diferente a la actual',
    statusCode: 400,
  };

  static readonly INVALID_TIMEZONE: ErrorResult = {
    code: 'USER_012',
    message: 'Zona horaria inválida',
    statusCode: 400,
  };

  static readonly PROFILE_PICTURE_INVALID: ErrorResult = {
    code: 'USER_013',
    message: 'URL de imagen de perfil inválida',
    statusCode: 400,
  };

  static readonly NAME_TOO_SHORT: ErrorResult = {
    code: 'USER_014',
    message: 'El nombre debe tener al menos 2 caracteres',
    statusCode: 400,
  };

  static readonly NAME_TOO_LONG: ErrorResult = {
    code: 'USER_015',
    message: 'El nombre no puede exceder 50 caracteres',
    statusCode: 400,
  };

  static internalError(message: string): ErrorResult {
    return {
      code: 'USER_500',
      message: `Error interno del servidor: ${message}`,
      statusCode: 500,
    };
  }
}
