import { Inject, Injectable } from '@nestjs/common';
import { IJwtService, JWT_SERVICE } from '../interfaces/jwt.service.interface';
import {
  IRefreshTokenRepository,
  REFRESH_TOKEN_REPOSITORY,
} from '../../domain/repositories/refresh-token.repository.interface';
import {
  IAuthRepository,
  AUTH_REPOSITORY,
} from '../../domain/repositories/auth.repository.interface';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { Result } from '../../../shared/result/result';
import { AuthErrors } from '../../domain/errors/auth.errors';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(JWT_SERVICE)
    private readonly jwtService: IJwtService,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository,
  ) {}

  async execute(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<Result<{ accessToken: string }>> {
    try {
      // Find refresh token
      const refreshToken = await this.refreshTokenRepository.findByToken(
        refreshTokenDto.refreshToken,
      );
      if (!refreshToken || !refreshToken.isValid()) {
        return Result.fail<{ accessToken: string }>(
          AuthErrors.INVALID_REFRESH_TOKEN,
        );
      }

      // Verify the JWT refresh token
      try {
        await this.jwtService.verifyRefreshToken(refreshTokenDto.refreshToken);
      } catch {
        await this.refreshTokenRepository.revoke(refreshTokenDto.refreshToken);
        return Result.fail<{ accessToken: string }>(
          AuthErrors.REFRESH_TOKEN_EXPIRED,
        );
      }

      // Get user details
      const user = await this.authRepository.findUserById(refreshToken.userId);
      if (!user || !user.isActive()) {
        await this.refreshTokenRepository.revoke(refreshTokenDto.refreshToken);
        return Result.fail<{ accessToken: string }>(
          AuthErrors.USER_NOT_FOUND_OR_INACTIVE,
        );
      }

      // Generate new access token only
      const payload = {
        sub: user.id,
        email: user.email,
      };

      const accessToken = await this.jwtService.generateAccessToken(payload);

      return Result.ok<{ accessToken: string }>({ accessToken });
    } catch (error) {
      return Result.fail<{ accessToken: string }>(
        AuthErrors.internalError(
          error instanceof Error ? error.message : 'Unknown error',
        ),
      );
    }
  }
}
