import { Inject, Injectable } from '@nestjs/common';
import {
  IAuthRepository,
  AUTH_REPOSITORY,
} from '../../domain/repositories/auth.repository.interface';
import { RequestPasswordResetDto } from '../dto/request-password-reset.dto';
import { Result } from '../../../shared/result/result';
import { AuthErrors } from '../../domain/errors/auth.errors';
import {
  IEmailService,
  EMAIL_SERVICE,
} from '../interfaces/email.service.interface';
import { randomBytes } from 'crypto';

@Injectable()
export class RequestPasswordResetTokenUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository,
    @Inject(EMAIL_SERVICE)
    private readonly emailService: IEmailService,
  ) {}

  async execute(
    requestPasswordResetDto: RequestPasswordResetDto,
  ): Promise<Result<{ message: string }>> {
    try {
      // Find user by email
      const user = await this.authRepository.findUserByEmail(
        requestPasswordResetDto.email,
      );

      // Don't reveal if user exists or not for security reasons
      if (!user) {
        return Result.ok<{ message: string }>({
          message:
            'If an account with this email exists, a password reset link will be sent.',
        });
      }

      // Don't send reset token to unverified accounts
      if (user.status !== 'active') {
        return Result.ok<{ message: string }>({
          message:
            'If an account with this email exists, a password reset link will be sent.',
        });
      }

      // Generate reset token (32 bytes hex string)
      const resetToken = randomBytes(32).toString('hex');
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1); // Token expires in 1 hour

      // Update user with reset token
      const userWithResetToken = user.setResetToken(resetToken, expiresAt);
      await this.authRepository.updateUser(userWithResetToken);

      // Send reset token via email
      try {
        await this.emailService.sendPasswordResetToken(
          requestPasswordResetDto.email,
          resetToken,
        );
      } catch {
        return Result.fail<{ message: string }>(AuthErrors.RESET_EMAIL_ERROR);
      }

      return Result.ok<{ message: string }>({
        message:
          'Password reset link sent to your email. Please check your inbox.',
      });
    } catch (error) {
      return Result.fail<{ message: string }>(
        AuthErrors.internalError(
          error instanceof Error ? error.message : 'Unknown error',
        ),
      );
    }
  }
}
