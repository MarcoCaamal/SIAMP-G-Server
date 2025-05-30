import { Inject, Injectable } from '@nestjs/common';
import {
  IRefreshTokenRepository,
  REFRESH_TOKEN_REPOSITORY,
} from '../../domain/repositories/refresh-token.repository.interface';
import { Result } from '../../../shared/result/result';
import { AuthErrors } from '../../domain/errors/auth.errors';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(refreshToken: string): Promise<Result<{ message: string }>> {
    try {
      // Revoke the refresh token
      await this.refreshTokenRepository.revoke(refreshToken);

      return Result.ok<{ message: string }>({
        message: 'Logged out successfully',
      });
    } catch (error) {
      return Result.fail<{ message: string }>(
        AuthErrors.internalError(
          error instanceof Error ? error.message : 'Failed to logout',
        ),
      );
    }
  }

  async logoutAll(userId: string): Promise<Result<{ message: string }>> {
    try {
      // Revoke all refresh tokens for the user
      await this.refreshTokenRepository.revokeAllForUser(userId);

      return Result.ok<{ message: string }>({
        message: 'Logged out from all devices successfully',
      });
    } catch (error) {
      return Result.fail<{ message: string }>(
        AuthErrors.internalError(
          error instanceof Error
            ? error.message
            : 'Failed to logout from all devices',
        ),
      );
    }
  }
}
