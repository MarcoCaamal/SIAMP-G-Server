import { ErrorResult } from '../../../shared/result/interfaces/error.interface';

export class ScheduleErrors {
  public static readonly SCHEDULE_NOT_FOUND: ErrorResult = {
    code: 'SCH_001',
    message: 'Schedule not found',
    statusCode: 404,
  };

  public static readonly INVALID_TIME_FORMAT: ErrorResult = {
    code: 'SCH_002',
    message: 'Invalid time format. Expected HH:mm format',
    statusCode: 400,
  };

  public static readonly INVALID_TIMEZONE: ErrorResult = {
    code: 'SCH_003',
    message: 'Invalid timezone',
    statusCode: 400,
  };

  public static readonly INVALID_BRIGHTNESS: ErrorResult = {
    code: 'SCH_004',
    message: 'Brightness must be between 0 and 100',
    statusCode: 400,
  };

  public static readonly INVALID_RECURRENCE: ErrorResult = {
    code: 'SCH_005',
    message: 'Invalid recurrence configuration',
    statusCode: 400,
  };

  public static readonly SCHEDULE_NAME_REQUIRED: ErrorResult = {
    code: 'SCH_006',
    message: 'Schedule name is required',
    statusCode: 400,
  };

  public static readonly DEVICE_NOT_FOUND: ErrorResult = {
    code: 'SCH_007',
    message: 'Device not found or does not belong to user',
    statusCode: 404,
  };

  public static readonly LIGHTING_MODE_NOT_FOUND: ErrorResult = {
    code: 'SCH_008',
    message: 'Lighting mode not found or not accessible',
    statusCode: 404,
  };

  public static readonly SCHEDULE_CONFLICT: ErrorResult = {
    code: 'SCH_009',
    message: 'Schedule conflicts with existing schedule',
    statusCode: 409,
  };

  public static readonly END_DATE_BEFORE_START: ErrorResult = {
    code: 'SCH_010',
    message: 'End date cannot be before start date',
    statusCode: 400,
  };

  public static readonly CUSTOM_RECURRENCE_NO_DAYS: ErrorResult = {
    code: 'SCH_011',
    message: 'Custom recurrence must specify at least one day',
    statusCode: 400,
  };

  public static readonly UNAUTHORIZED_ACCESS: ErrorResult = {
    code: 'SCH_012',
    message: 'You are not authorized to access this schedule',
    statusCode: 403,
  };

  public static internalError(message: string): ErrorResult {
    return {
      code: 'SCH_INTERNAL',
      message: message || 'An internal error occurred',
      statusCode: 500,
    };
  }

  public static validationError(message: string): ErrorResult {
    return {
      code: 'SCH_VALIDATION',
      message: message || 'Validation failed',
      statusCode: 400,
    };
  }
}
