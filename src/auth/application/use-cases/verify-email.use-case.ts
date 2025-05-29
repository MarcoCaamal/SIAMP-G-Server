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

@Injectable()
export class VerifyEmailUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository,
    @Inject(EMAIL_SERVICE)
    private readonly emailService: IEmailService,
  ) {}

  async execute(verifyEmailDto: VerifyEmailDto): Promise<{ message: string }> {
    // Find user by verification token
    const user = await this.authRepository.findUserByVerificationToken(
      verifyEmailDto.token,
    );
    if (!user) {
      throw new Error('Invalid or expired verification token');
    }

    // Check if token is expired
    if (
      user.verificationToken &&
      new Date() > user.verificationToken.expiresAt
    ) {
      throw new Error('Verification token has expired');
    }

    // Activate user (this removes the verification token)
    const activatedUser = user.activate();
    await this.authRepository.updateUser(activatedUser);

    // Send welcome email
    await this.emailService.sendWelcomeEmail(user.email, user.name);

    return {
      message: 'Email verified successfully. Your account is now active.',
    };
  }
}
