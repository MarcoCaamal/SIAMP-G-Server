import { Inject, Injectable } from '@nestjs/common';
import {
  IRefreshTokenRepository,
  REFRESH_TOKEN_REPOSITORY,
} from '../../domain/repositories/refresh-token.repository.interface';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(refreshToken: string): Promise<{ message: string }> {
    // Revoke the refresh token
    await this.refreshTokenRepository.revoke(refreshToken);

    return {
      message: 'Logged out successfully',
    };
  }

  async logoutAll(userId: string): Promise<{ message: string }> {
    // Revoke all refresh tokens for the user
    await this.refreshTokenRepository.revokeAllForUser(userId);

    return {
      message: 'Logged out from all devices successfully',
    };
  }
}
