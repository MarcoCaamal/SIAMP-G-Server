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
    TokenPair & {
      user: { id: string; name: string; email: string; status: string };
    }
  > {
    // Find user by email
    const user = await this.authRepository.findUserByEmail(loginDto.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check if user can login (not blocked, not too many failed attempts)
    if (!user.canLogin()) {
      if (user.isBlocked()) {
        throw new Error('Account is blocked. Please contact support.');
      }
      if (user.failedLoginAttempts >= 5) {
        throw new Error(
          'Account temporarily locked due to too many failed login attempts.',
        );
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

      throw new Error('Invalid credentials');
    }

    // Check if user is verified
    if (user.isPending()) {
      throw new Error('Please verify your email before logging in');
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

    return {
      ...tokens,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
      },
    };
  }
}
