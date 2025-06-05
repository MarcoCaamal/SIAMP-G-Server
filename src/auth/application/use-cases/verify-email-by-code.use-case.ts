import { Inject, Injectable } from '@nestjs/common';
import {
  IAuthRepository,
  AUTH_REPOSITORY,
} from '../../domain/repositories/auth.repository.interface';
import {
  IEmailService,
  EMAIL_SERVICE,
} from '../interfaces/email.service.interface';
import { VerifyEmailByCodeDto } from '../dto/verify-email-by-code.dto';
import { Result } from '../../../shared/result/result';
import { AuthErrors } from '../../domain/errors/auth.errors';

@Injectable()
export class VerifyEmailByCodeUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository,
    @Inject(EMAIL_SERVICE)
    private readonly emailService: IEmailService,
  ) {}

  async execute(
    verifyEmailDto: VerifyEmailByCodeDto,
  ): Promise<Result<{ message: string }>> {
    try {
      // Find user by verification code
      const user = await this.authRepository.findUserByVerificationCode(
        verifyEmailDto.code,
      );

      if (!user) {
        return Result.fail<{ message: string }>(
          AuthErrors.INVALID_VERIFICATION_CODE,
        );
      }

      // Check if code is expired
      if (
        user.verificationToken &&
        new Date() > user.verificationToken.expiresAt
      ) {
        return Result.fail<{ message: string }>(
          AuthErrors.VERIFICATION_CODE_EXPIRED,
        );
      }

      // Activate user (this removes the verification token)
      const activatedUser = user.activate();
      await this.authRepository.updateUser(activatedUser);

      // Send welcome email
      try {
        await this.emailService.sendWelcomeEmail(user.email, user.name);
      } catch {
        return Result.fail<{ message: string }>(AuthErrors.WELCOME_EMAIL_ERROR);
      }

      return Result.ok<{ message: string }>({
        message: 'Email verified successfully with code. Your account is now active.',
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
