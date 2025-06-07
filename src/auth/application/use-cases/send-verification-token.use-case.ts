import { Inject, Injectable } from '@nestjs/common';
import {
  IAuthRepository,
  AUTH_REPOSITORY,
} from '../../domain/repositories/auth.repository.interface';
import {
  IEmailService,
  EMAIL_SERVICE,
} from '../interfaces/email.service.interface';
import { Result } from '../../../shared/result/result';
import { AuthErrors } from '../../domain/errors/auth.errors';
import { randomBytes } from 'crypto';

@Injectable()
export class SendVerificationTokenUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository,
    @Inject(EMAIL_SERVICE)
    private readonly emailService: IEmailService,
  ) {}

  async execute(email: string): Promise<Result<{ message: string }>> {
    try {
      // Find user by email
      const user = await this.authRepository.findUserByEmail(email);

      if (!user) {
        return Result.fail<{ message: string }>(AuthErrors.USER_NOT_FOUND);
      }

      if (user.status === 'active') {
        return Result.fail<{ message: string }>(
          AuthErrors.USER_ALREADY_VERIFIED,
        );
      } // Generate verification token (32 bytes hex string)
      const verificationToken = randomBytes(32).toString('hex');
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // Token expires in 24 hours// Update user with verification token
      const userWithToken = user.setVerificationToken(
        verificationToken,
        expiresAt,
      );
      await this.authRepository.updateUser(userWithToken);

      // Send verification email with token
      try {
        await this.emailService.sendVerificationToken(email, verificationToken);
      } catch {
        return Result.fail<{ message: string }>(AuthErrors.EMAIL_SERVICE_ERROR);
      }

      return Result.ok<{ message: string }>({
        message:
          'Verification token sent to your email. Please check your inbox.',
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
