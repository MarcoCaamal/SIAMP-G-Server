import { Inject, Injectable } from '@nestjs/common';
import { IJwtService, JWT_SERVICE, TokenPair } from '../interfaces/jwt.service.interface';
import { IRefreshTokenRepository, REFRESH_TOKEN_REPOSITORY } from '../../domain/repositories/refresh-token.repository.interface';
import { IAuthRepository, AUTH_REPOSITORY } from '../../domain/repositories/auth.repository.interface';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { RefreshToken } from '../../domain/entities/refresh-token.entity';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(JWT_SERVICE)
    private readonly jwtService: IJwtService,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository
  ) {}

  async execute(refreshTokenDto: RefreshTokenDto): Promise<TokenPair> {
    // Find refresh token
    const refreshToken = await this.refreshTokenRepository.findByToken(refreshTokenDto.refreshToken);
    if (!refreshToken || !refreshToken.isValid()) {
      throw new Error('Invalid or expired refresh token');
    }

    // Verify the JWT refresh token
    try {
      await this.jwtService.verifyRefreshToken(refreshTokenDto.refreshToken);
    } catch (error) {
      // Revoke the refresh token if JWT verification fails
      await this.refreshTokenRepository.revoke(refreshTokenDto.refreshToken);
      throw new Error('Invalid refresh token');
    }

    // Get user details
    const user = await this.authRepository.findUserById(refreshToken.userId);
    if (!user || !user.isActive()) {
      await this.refreshTokenRepository.revoke(refreshTokenDto.refreshToken);
      throw new Error('User not found or inactive');
    }

    // Generate new tokens
    const payload = {
      sub: user.id,
      email: user.email
    };

    const tokens = await this.jwtService.generateTokens(payload);

    // Revoke old refresh token
    await this.refreshTokenRepository.revoke(refreshTokenDto.refreshToken);

    // Save new refresh token
    const newRefreshToken = RefreshToken.create(
      user.id,
      tokens.refreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    );
    await this.refreshTokenRepository.save(newRefreshToken);

    return tokens;
  }
}
