import { ErrorResult } from '../../../shared/result/interfaces/error.interface';

export class FileErrors {
  static readonly INVALID_FILE_TYPE: ErrorResult = {
    code: 'FILE_001',
    message: 'Invalid file type. Only JPEG, PNG, JPG, and WebP are allowed',
    statusCode: 400,
  };

  static readonly FILE_TOO_LARGE: ErrorResult = {
    code: 'FILE_002',
    message: 'File size too large. Maximum size is 5MB',
    statusCode: 400,
  };

  static readonly NO_FILE_PROVIDED: ErrorResult = {
    code: 'FILE_003',
    message: 'No file provided',
    statusCode: 400,
  };

  static readonly UPLOAD_FAILED: ErrorResult = {
    code: 'FILE_004',
    message: 'Failed to upload file',
    statusCode: 500,
  };

  static readonly DELETE_FAILED: ErrorResult = {
    code: 'FILE_005',
    message: 'Failed to delete file',
    statusCode: 500,
  };

  static readonly FILE_NOT_FOUND: ErrorResult = {
    code: 'FILE_006',
    message: 'File not found',
    statusCode: 404,
  };

  static uploadError(message: string): ErrorResult {
    return {
      code: 'FILE_500',
      message: `Upload error: ${message}`,
      statusCode: 500,
    };
  }

  static deleteError(message: string): ErrorResult {
    return {
      code: 'FILE_501',
      message: `Delete error: ${message}`,
      statusCode: 500,
    };
  }
}
