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
import { User } from 'src/users/domain/entities/user.entity';

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
      // Validate that either code or token is provided, but not both
      if (!verifyEmailDto.code && !verifyEmailDto.token) {
        return Result.fail<{ message: string }>(
          AuthErrors.INVALID_VERIFICATION_CODE,
        );
      }

      if (verifyEmailDto.code && verifyEmailDto.token) {
        return Result.fail<{ message: string }>(
          AuthErrors.INVALID_VERIFICATION_CODE,
        );
      }

      // Find user by verification code or token
      let user: User | null = null;
      if (verifyEmailDto.code) {
        user = await this.authRepository.findUserByVerificationCode(
          verifyEmailDto.code,
        );
      } else if (verifyEmailDto.token) {
        user = await this.authRepository.findUserByVerificationToken(
          verifyEmailDto.token,
        );
      }

      if (!user) {
        return Result.fail<{ message: string }>(
          AuthErrors.INVALID_VERIFICATION_CODE,
        );
      }

      // Check if code/token is expired
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
