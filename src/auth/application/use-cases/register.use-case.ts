import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../../users/domain/entities/user.entity';
import {
  IAuthRepository,
  AUTH_REPOSITORY,
} from '../../domain/repositories/auth.repository.interface';
import {
  IHashingService,
  HASHING_SERVICE,
} from '../interfaces/hashing.service.interface';
import {
  IEmailService,
  EMAIL_SERVICE,
} from '../interfaces/email.service.interface';
import { RegisterDto } from '../dto/register.dto';
import { Email } from '../../domain/value-objects/email.value-object';
import { Password } from '../../domain/value-objects/password.value-object';
import * as crypto from 'crypto';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository,
    @Inject(HASHING_SERVICE)
    private readonly hashingService: IHashingService,
    @Inject(EMAIL_SERVICE)
    private readonly emailService: IEmailService,
  ) {}

  async execute(registerDto: RegisterDto): Promise<{ message: string }> {
    // Validate email format
    const email = new Email(registerDto.email);

    // Validate password strength
    const password = new Password(registerDto.password);

    // Check if user already exists
    const existingUser = await this.authRepository.findUserByEmail(email.value);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const hashedPassword = await this.hashingService.hash(password.value);

    // Create user
    const user = User.create(
      registerDto.name,
      email.value,
      hashedPassword,
      registerDto.timezone,
    );

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const userWithToken = user.setVerificationToken(
      verificationToken,
      tokenExpiresAt,
    );

    // Save user
    await this.authRepository.saveUser(userWithToken);

    // Send verification email
    await this.emailService.sendVerificationEmail(
      email.value,
      verificationToken,
    );

    return {
      message:
        'User registered successfully. Please check your email to verify your account.',
    };
  }
}
