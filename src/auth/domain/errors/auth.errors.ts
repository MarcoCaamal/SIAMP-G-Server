import { ErrorResult } from '../../../shared/result/interfaces/error.interface';

export class AuthErrors {
  static readonly USER_ALREADY_EXISTS: ErrorResult = {
    code: 'AUTH_001',
    message: 'User already exists with this email',
    statusCode: 409,
  };

  static readonly INVALID_EMAIL_FORMAT: ErrorResult = {
    code: 'AUTH_002',
    message: 'Invalid email format',
    statusCode: 400,
  };

  static readonly WEAK_PASSWORD: ErrorResult = {
    code: 'AUTH_003',
    message: 'Password does not meet security requirements',
    statusCode: 400,
  };

  static readonly EMAIL_SERVICE_ERROR: ErrorResult = {
    code: 'AUTH_004',
    message: 'Failed to send verification email',
    statusCode: 500,
  };

  static readonly DATABASE_ERROR: ErrorResult = {
    code: 'AUTH_005',
    message: 'Database operation failed',
    statusCode: 500,
  };

  static readonly INVALID_CREDENTIALS: ErrorResult = {
    code: 'AUTH_006',
    message: 'Invalid credentials',
    statusCode: 401,
  };

  static readonly ACCOUNT_BLOCKED: ErrorResult = {
    code: 'AUTH_007',
    message: 'Account is blocked. Please contact support.',
    statusCode: 403,
  };

  static readonly ACCOUNT_LOCKED: ErrorResult = {
    code: 'AUTH_008',
    message:
      'Account temporarily locked due to too many failed login attempts.',
    statusCode: 423,
  };

  static readonly EMAIL_NOT_VERIFIED: ErrorResult = {
    code: 'AUTH_009',
    message: 'Please verify your email before logging in',
    statusCode: 403,
  };

  static readonly INVALID_VERIFICATION_TOKEN: ErrorResult = {
    code: 'AUTH_010',
    message: 'Invalid or expired verification token',
    statusCode: 400,
  };

  static readonly VERIFICATION_TOKEN_EXPIRED: ErrorResult = {
    code: 'AUTH_011',
    message: 'Verification token has expired',
    statusCode: 410,
  };
  static readonly WELCOME_EMAIL_ERROR: ErrorResult = {
    code: 'AUTH_012',
    message: 'Failed to send welcome email',
    statusCode: 500,
  };

  static readonly INVALID_VERIFICATION_CODE: ErrorResult = {
    code: 'AUTH_017',
    message: 'Invalid or expired verification code',
    statusCode: 400,
  };

  static readonly VERIFICATION_CODE_EXPIRED: ErrorResult = {
    code: 'AUTH_018',
    message: 'Verification code has expired',
    statusCode: 410,
  };

  static readonly INVALID_REFRESH_TOKEN: ErrorResult = {
    code: 'AUTH_013',
    message: 'Invalid or expired refresh token',
    statusCode: 401,
  };

  static readonly REFRESH_TOKEN_EXPIRED: ErrorResult = {
    code: 'AUTH_014',
    message: 'Refresh token has expired',
    statusCode: 401,
  };

  static readonly USER_NOT_FOUND_OR_INACTIVE: ErrorResult = {
    code: 'AUTH_015',
    message: 'User not found or inactive',
    statusCode: 401,
  };

  static readonly LOGOUT_ERROR: ErrorResult = {
    code: 'AUTH_016',
    message: 'Failed to logout',
    statusCode: 500,
  };

  static readonly USER_NOT_FOUND: ErrorResult = {
    code: 'AUTH_017',
    message: 'User not found',
    statusCode: 404,
  };

  static readonly USER_ALREADY_VERIFIED: ErrorResult = {
    code: 'AUTH_018',
    message: 'User account is already verified',
    statusCode: 400,
  };

  static readonly INVALID_RESET_TOKEN: ErrorResult = {
    code: 'AUTH_019',
    message: 'Invalid or expired password reset token',
    statusCode: 400,
  };

  static readonly RESET_TOKEN_EXPIRED: ErrorResult = {
    code: 'AUTH_020',
    message: 'Password reset token has expired',
    statusCode: 410,
  };

  static readonly INVALID_RESET_CODE: ErrorResult = {
    code: 'AUTH_021',
    message: 'Invalid or expired password reset code',
    statusCode: 400,
  };

  static readonly RESET_CODE_EXPIRED: ErrorResult = {
    code: 'AUTH_022',
    message: 'Password reset code has expired',
    statusCode: 410,
  };

  static readonly RESET_EMAIL_ERROR: ErrorResult = {
    code: 'AUTH_023',
    message: 'Failed to send password reset email',
    statusCode: 500,
  };

  static readonly PASSWORD_RESET_SUCCESS: ErrorResult = {
    code: 'AUTH_024',
    message: 'Password reset successfully',
    statusCode: 200,
  };

  static readonly RESET_TOKEN_ALREADY_USED: ErrorResult = {
    code: 'AUTH_025',
    message: 'Password reset token has already been used',
    statusCode: 400,
  };

  static readonly NO_RESET_TOKEN: ErrorResult = {
    code: 'AUTH_026',
    message: 'No active password reset token found',
    statusCode: 400,
  };

  static internalError(message: string): ErrorResult {
    return {
      code: 'AUTH_500',
      message: `Internal server error: ${message}`,
      statusCode: 500,
    };
  }
}
