import { Inject, Injectable } from '@nestjs/common';
import {
  IAuthRepository,
  AUTH_REPOSITORY,
} from '../../domain/repositories/auth.repository.interface';
import {
  IEmailService,
  EMAIL_SERVICE,
} from '../interfaces/email.service.interface';
import { VerifyEmailByTokenDto } from '../dto/verify-email-by-token.dto';
import { Result } from '../../../shared/result/result';
import { AuthErrors } from '../../domain/errors/auth.errors';

@Injectable()
export class VerifyEmailByTokenUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository,
    @Inject(EMAIL_SERVICE)
    private readonly emailService: IEmailService,
  ) {}

  async execute(
    verifyEmailDto: VerifyEmailByTokenDto,
  ): Promise<Result<{ message: string }>> {
    try {
      // Find user by verification token
      const user = await this.authRepository.findUserByVerificationToken(
        verifyEmailDto.token,
      );

      if (!user) {
        return Result.fail<{ message: string }>(
          AuthErrors.INVALID_VERIFICATION_CODE,
        );
      }

      // Check if token is expired
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
        message:
          'Email verified successfully with token. Your account is now active.',
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
