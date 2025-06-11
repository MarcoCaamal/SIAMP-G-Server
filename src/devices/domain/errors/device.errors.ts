import { ErrorResult } from '../../../shared/result/interfaces/error.interface';

export class DeviceErrors {
  static readonly DEVICE_NOT_FOUND: ErrorResult = {
    code: 'DEVICE_001',
    message: 'Device not found',
    statusCode: 404,
  };

  static readonly DEVICE_ALREADY_PAIRED: ErrorResult = {
    code: 'DEVICE_002',
    message: 'Device is already paired with another user',
    statusCode: 409,
  };

  static readonly DEVICE_NOT_CONNECTED: ErrorResult = {
    code: 'DEVICE_003',
    message: 'Device is not connected',
    statusCode: 400,
  };

  static readonly INVALID_DEVICE_COMMAND: ErrorResult = {
    code: 'DEVICE_004',
    message: 'Invalid device command',
    statusCode: 400,
  };

  static readonly DEVICE_COMMUNICATION_ERROR: ErrorResult = {
    code: 'DEVICE_005',
    message: 'Failed to communicate with device',
    statusCode: 500,
  };

  static readonly UNAUTHORIZED_DEVICE_ACCESS: ErrorResult = {
    code: 'DEVICE_006',
    message: 'You do not have permission to access this device',
    statusCode: 403,
  };

  static readonly DEVICE_PAIRING_FAILED: ErrorResult = {
    code: 'DEVICE_007',
    message: 'Failed to pair device',
    statusCode: 400,
  };

  static readonly INVALID_BRIGHTNESS_VALUE: ErrorResult = {
    code: 'DEVICE_008',
    message: 'Brightness value must be between 0 and 100',
    statusCode: 400,
  };

  static readonly INVALID_COLOR_VALUE: ErrorResult = {
    code: 'DEVICE_009',
    message: 'Invalid color values',
    statusCode: 400,
  };

  static readonly DEVICE_OFFLINE: ErrorResult = {
    code: 'DEVICE_010',
    message: 'Device is currently offline',
    statusCode: 503,
  };

  static readonly INVALID_DEVICE_NAME: ErrorResult = {
    code: 'DEVICE_011',
    message: 'Device name cannot be empty',
    statusCode: 400,
  };

  static readonly DEVICE_ALREADY_EXISTS: ErrorResult = {
    code: 'DEVICE_012',
    message: 'A device with this ID already exists',
    statusCode: 409,
  };

  static readonly INVALID_TEMPERATURE_VALUE: ErrorResult = {
    code: 'DEVICE_013',
    message: 'Temperature must be between 1000K and 10000K',
    statusCode: 400,
  };
}
