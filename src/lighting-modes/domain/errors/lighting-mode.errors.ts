import { ErrorResult } from '../../../shared/result/interfaces/error.interface';

export class LightingModeErrors {
  static readonly LIGHTING_MODE_NOT_FOUND: ErrorResult = {
    code: 'LM_001',
    message: 'Lighting mode not found',
    statusCode: 404,
  };

  static readonly UNAUTHORIZED_ACCESS: ErrorResult = {
    code: 'LM_002',
    message: 'Unauthorized access to lighting mode',
    statusCode: 403,
  };

  static readonly INVALID_SEQUENCE: ErrorResult = {
    code: 'LM_003',
    message: 'Invalid lighting sequence provided',
    statusCode: 400,
  };

  static readonly LIGHTING_MODE_NAME_REQUIRED: ErrorResult = {
    code: 'LM_004',
    message: 'Lighting mode name is required',
    statusCode: 400,
  };

  static readonly INVALID_HABITAT_TYPE: ErrorResult = {
    code: 'LM_005',
    message: 'Invalid habitat type provided',
    statusCode: 400,
  };

  static readonly SHARE_CODE_ALREADY_EXISTS: ErrorResult = {
    code: 'LM_006',
    message: 'Share code already exists',
    statusCode: 409,
  };

  static readonly INVALID_SHARE_CODE: ErrorResult = {
    code: 'LM_007',
    message: 'Invalid or expired share code',
    statusCode: 400,
  };

  static readonly CANNOT_SHARE_SYSTEM_MODE: ErrorResult = {
    code: 'LM_008',
    message: 'Cannot share system lighting modes',
    statusCode: 400,
  };

  static readonly LIGHTING_MODE_ALREADY_SHARED: ErrorResult = {
    code: 'LM_009',
    message: 'Lighting mode is already shared',
    statusCode: 400,
  };

  static readonly CANNOT_MODIFY_SYSTEM_MODE: ErrorResult = {
    code: 'LM_010',
    message: 'Cannot modify system lighting modes',
    statusCode: 403,
  };

  static readonly SEQUENCE_TOO_SHORT: ErrorResult = {
    code: 'LM_011',
    message: 'Lighting sequence must have at least one step',
    statusCode: 400,
  };

  static readonly INVALID_COLOR_CONFIG: ErrorResult = {
    code: 'LM_012',
    message: 'Invalid color configuration provided',
    statusCode: 400,
  };

  static readonly INVALID_BRIGHTNESS_VALUE: ErrorResult = {
    code: 'LM_013',
    message: 'Brightness value must be between 0 and 100',
    statusCode: 400,
  };

  static readonly INVALID_DURATION: ErrorResult = {
    code: 'LM_014',
    message: 'Step duration must be greater than 0',
    statusCode: 400,
  };

  static readonly DATABASE_ERROR: ErrorResult = {
    code: 'LM_015',
    message: 'Database operation failed',
    statusCode: 500,
  };

  static readonly LIGHTING_MODE_CREATION_FAILED: ErrorResult = {
    code: 'LM_016',
    message: 'Failed to create lighting mode',
    statusCode: 500,
  };

  static readonly LIGHTING_MODE_UPDATE_FAILED: ErrorResult = {
    code: 'LM_017',
    message: 'Failed to update lighting mode',
    statusCode: 500,
  };

  static readonly LIGHTING_MODE_DELETE_FAILED: ErrorResult = {
    code: 'LM_018',
    message: 'Failed to delete lighting mode',
    statusCode: 500,
  };

  static readonly SHARE_CODE_GENERATION_FAILED: ErrorResult = {
    code: 'LM_019',
    message: 'Failed to generate share code',
    statusCode: 500,
  };

  static internalError(message: string): ErrorResult {
    return {
      code: 'LM_500',
      message: `Internal server error: ${message}`,
      statusCode: 500,
    };
  }
}
