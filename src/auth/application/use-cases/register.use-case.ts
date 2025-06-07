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
import { Result } from '../../../shared/result/result';
import { AuthErrors } from '../../domain/errors/auth.errors';

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

  async execute(
    registerDto: RegisterDto,
  ): Promise<Result<{ message: string }>> {
    try {
      // Validate email format
      let email: Email;
      try {
        email = new Email(registerDto.email);
      } catch {
        return Result.fail<{ message: string }>(
          AuthErrors.INVALID_EMAIL_FORMAT,
        );
      }

      // Validate password strength
      let password: Password;
      try {
        password = new Password(registerDto.password);
      } catch {
        return Result.fail<{ message: string }>(AuthErrors.WEAK_PASSWORD);
      }

      // Check if user already exists
      const existingUser = await this.authRepository.findUserByEmail(
        email.value,
      );
      if (existingUser) {
        return Result.fail<{ message: string }>(AuthErrors.USER_ALREADY_EXISTS);
      }

      // Hash password
      const hashedPassword = await this.hashingService.hash(password.value);

      // Create user
      const user = User.create(
        registerDto.name,
        email.value,
        hashedPassword,
        registerDto.timezone,
      ); // Generate verification code (4 digits)
      const verificationCode = Math.floor(
        1000 + Math.random() * 9000,
      ).toString();
      const codeExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      const userWithCode = user.setVerificationToken(
        verificationCode,
        codeExpiresAt,
      );

      // Save user
      await this.authRepository.saveUser(userWithCode); // Send verification email with code
      try {
        await this.emailService.sendVerificationCode(
          email.value,
          verificationCode,
        );
      } catch {
        return Result.fail<{ message: string }>(AuthErrors.EMAIL_SERVICE_ERROR);
      }

      return Result.ok<{ message: string }>({
        message:
          'User registered successfully. Please check your email to verify your account.',
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
