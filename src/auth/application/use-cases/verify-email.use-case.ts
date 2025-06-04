import { Inject, Injectable } from '@nestjs/common';
import {
  IAuthRepository,
  AUTH_REPOSITORY,
} from '../../domain/repositories/auth.repository.interface';
import {
  IEmailService,
  EMAIL_SERVICE,
} from '../interfaces/email.service.interface';
import { VerifyEmailDto } from '../dto/verify-email.dto';
import { Result } from '../../../shared/result/result';
import { AuthErrors } from '../../domain/errors/auth.errors';

@Injectable()
export class VerifyEmailUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository,
    @Inject(EMAIL_SERVICE)
    private readonly emailService: IEmailService,
  ) {}

  async execute(
    verifyEmailDto: VerifyEmailDto,
  ): Promise<Result<{ message: string }>> {
    try {
      // Find user by verification token
      const user = await this.authRepository.findUserByVerificationToken(
        verifyEmailDto.token,
      );
      if (!user) {
        return Result.fail<{ message: string }>(
          AuthErrors.INVALID_VERIFICATION_TOKEN,
        );
      }

      // Check if token is expired
      if (
        user.verificationToken &&
        new Date() > user.verificationToken.expiresAt
      ) {
        return Result.fail<{ message: string }>(
          AuthErrors.VERIFICATION_TOKEN_EXPIRED,
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
        message: 'Email verified successfully. Your account is now active.',
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
