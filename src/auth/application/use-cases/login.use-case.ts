import { Inject, Injectable } from '@nestjs/common';
import {
  IAuthRepository,
  AUTH_REPOSITORY,
} from '../../domain/repositories/auth.repository.interface';
import {
  IHashingService,
  HASHING_SERVICE,
} from '../interfaces/hashing.service.interface';
import {
  IJwtService,
  JWT_SERVICE,
  TokenPair,
} from '../interfaces/jwt.service.interface';
import {
  IRefreshTokenRepository,
  REFRESH_TOKEN_REPOSITORY,
} from '../../domain/repositories/refresh-token.repository.interface';
import { LoginDto } from '../dto/login.dto';
import { RefreshToken } from '../../domain/entities/refresh-token.entity';
import { Result } from '../../../shared/result/result';
import { AuthErrors } from '../../domain/errors/auth.errors';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository,
    @Inject(HASHING_SERVICE)
    private readonly hashingService: IHashingService,
    @Inject(JWT_SERVICE)
    private readonly jwtService: IJwtService,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(
    loginDto: LoginDto,
    ipAddress: string,
    userAgent: string,
  ): Promise<
    Result<
      TokenPair & {
        user: { id: string; name: string; email: string; status: string };
      }
    >
  > {
    try {
      // Find user by email
      const user = await this.authRepository.findUserByEmail(loginDto.email);
      if (!user) {
        return Result.fail(AuthErrors.INVALID_CREDENTIALS);
      }

      // Check if user can login (not blocked, not too many failed attempts)
      if (!user.canLogin()) {
        if (user.isBlocked()) {
          return Result.fail(AuthErrors.ACCOUNT_BLOCKED);
        }
        if (user.failedLoginAttempts >= 5) {
          return Result.fail(AuthErrors.ACCOUNT_LOCKED);
        }
      }

      // Verify password
      const isPasswordValid = await this.hashingService.compare(
        loginDto.password,
        user.password,
      );
      if (!isPasswordValid) {
        // Increment failed login attempts
        const updatedUser = user.updateLoginAttempts(
          user.failedLoginAttempts + 1,
        );
        await this.authRepository.updateUser(updatedUser);

        return Result.fail(AuthErrors.INVALID_CREDENTIALS);
      }

      // Check if user is verified
      if (user.isPending()) {
        return Result.fail(AuthErrors.EMAIL_NOT_VERIFIED);
      }

      // Update last login info and reset failed attempts
      const updatedUser = user.updateLastLogin(userAgent, ipAddress);
      await this.authRepository.updateUser(updatedUser);

      // Generate JWT tokens
      const payload = {
        sub: user.id,
        email: user.email,
      };

      const tokens = await this.jwtService.generateTokens(payload);

      // Save refresh token
      const refreshTokenEntity = RefreshToken.create(
        user.id,
        tokens.refreshToken,
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      );
      await this.refreshTokenRepository.save(refreshTokenEntity);

      return Result.ok({
        ...tokens,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          status: user.status,
        },
      });
    } catch (error) {
      return Result.fail(
        AuthErrors.internalError(
          error instanceof Error ? error.message : 'Unknown error',
        ),
      );
    }
  }
}
