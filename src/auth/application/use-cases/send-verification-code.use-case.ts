import { Inject, Injectable } from '@nestjs/common';
import {
  IAuthRepository,
  AUTH_REPOSITORY,
} from '../../domain/repositories/auth.repository.interface';
import {
  IEmailService,
  EMAIL_SERVICE,
} from '../interfaces/email.service.interface';
import { SendVerificationCodeDto } from '../dto/send-verification-code.dto';
import { Result } from '../../../shared/result/result';
import { AuthErrors } from '../../domain/errors/auth.errors';

@Injectable()
export class SendVerificationCodeUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository,
    @Inject(EMAIL_SERVICE)
    private readonly emailService: IEmailService,
  ) {}

  async execute(
    sendVerificationCodeDto: SendVerificationCodeDto,
  ): Promise<Result<{ message: string }>> {
    try {
      // Find user by email
      const user = await this.authRepository.findUserByEmail(sendVerificationCodeDto.email);

      if (!user) {
        return Result.fail<{ message: string }>(AuthErrors.USER_NOT_FOUND);
      }

      if (user.status === 'active') {
        return Result.fail<{ message: string }>(AuthErrors.USER_ALREADY_VERIFIED);
      }

      // Generate new 4-digit verification code
      const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15); // Code expires in 15 minutes

      // Update user with verification code
      const userWithCode = user.setVerificationToken(verificationCode, expiresAt);
      await this.authRepository.updateUser(userWithCode);

      // Send verification code via email
      try {
        await this.emailService.sendVerificationCode(
          sendVerificationCodeDto.email,
          verificationCode,
        );
      } catch {
        return Result.fail<{ message: string }>(AuthErrors.EMAIL_SERVICE_ERROR);
      }

      return Result.ok<{ message: string }>({
        message: 'New verification code sent to your email. Please check your inbox.',
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
