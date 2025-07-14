import { Inject, Injectable } from '@nestjs/common';
import {
  IAuthRepository,
  AUTH_REPOSITORY,
} from '../../domain/repositories/auth.repository.interface';
import {
  IEmailService,
  EMAIL_SERVICE,
} from '../interfaces/email.service.interface';
import { RequestPasswordResetDto } from '../dto/request-password-reset.dto';
import { Result } from '../../../shared/result/result';
import { AuthErrors } from '../../domain/errors/auth.errors';

@Injectable()
export class RequestPasswordResetCodeUseCase {
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
            'If an account with this email exists, a password reset code will be sent.',
        });
      }

      // Don't send reset code to unverified accounts
      if (user.status !== 'active') {
        return Result.ok<{ message: string }>({
          message:
            'If an account with this email exists, a password reset code will be sent.',
        });
      }

      // Generate 4-digit reset code
      const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15); // Code expires in 15 minutes

      // Update user with reset code
      const userWithResetCode = user.setResetToken(resetCode, expiresAt);
      await this.authRepository.updateUser(userWithResetCode);

      // Send reset code via email
      try {
        await this.emailService.sendPasswordResetCode(
          requestPasswordResetDto.email,
          resetCode,
        );
      } catch {
        return Result.fail<{ message: string }>(AuthErrors.RESET_EMAIL_ERROR);
      }

      return Result.ok<{ message: string }>({
        message:
          'Password reset code sent to your email. Please check your inbox.',
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
