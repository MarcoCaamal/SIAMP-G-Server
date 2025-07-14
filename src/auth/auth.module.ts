import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

// Use Cases
import { 
  LoginUseCase,
  RegisterUseCase,
  RefreshTokenUseCase,
  VerifyEmailUseCase,
  VerifyEmailByCodeUseCase,
  VerifyEmailByTokenUseCase,
  SendVerificationTokenUseCase,
  SendVerificationCodeUseCase,
  LogoutUseCase
} from './application/use-cases';

import {
  RequestPasswordResetCodeUseCase
} from './application/use-cases/request-password-reset-code.use-case';
import {
  RequestPasswordResetTokenUseCase
} from './application/use-cases/request-password-reset-token.use-case';
import {
  ResetPasswordByCodeUseCase
} from './application/use-cases/reset-password-by-code.use-case';
import {
  ResetPasswordByTokenUseCase
} from './application/use-cases/reset-password-by-token.use-case';

// Services
import { 
  BcryptHashingService,
  NestJwtService,
  SmtpEmailService
} from './infrastructure/services';
import {
  EMAIL_SERVICE,
  HASHING_SERVICE,
  JWT_SERVICE,
} from './application/interfaces'

// Repositories
import { AUTH_REPOSITORY } from './domain/repositories/auth.repository.interface';
import { REFRESH_TOKEN_REPOSITORY } from './domain/repositories/refresh-token.repository.interface';
import { AuthRepository } from './infrastructure/repositories/auth.repository';
import { RefreshTokenRepository } from './infrastructure/repositories/refresh-token.repository';

// Schemas
import {
  RefreshTokenDocument,
  RefreshTokenSchema,
} from './infrastructure/schemas/refresh-token.schema';

// Controllers
import { AuthController } from './presentation/controllers/auth.controller';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      global: true,
    }),
    MongooseModule.forFeature([
      { name: RefreshTokenDocument.name, schema: RefreshTokenSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    // Use Cases
    RegisterUseCase,
    LoginUseCase,
    RefreshTokenUseCase,
    VerifyEmailUseCase,
    VerifyEmailByCodeUseCase,
    VerifyEmailByTokenUseCase,
    SendVerificationTokenUseCase,
    SendVerificationCodeUseCase,
    LogoutUseCase,
    RequestPasswordResetCodeUseCase,
    RequestPasswordResetTokenUseCase,
    ResetPasswordByCodeUseCase,
    ResetPasswordByTokenUseCase,    // Services
    {
      provide: HASHING_SERVICE,
      useClass: BcryptHashingService,
    },
    {
      provide: JWT_SERVICE,
      useClass: NestJwtService,
    },
    {
      provide: EMAIL_SERVICE,
      useClass: SmtpEmailService,
    },

    // Repositories
    {
      provide: AUTH_REPOSITORY,
      useClass: AuthRepository,
    },
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: RefreshTokenRepository,
    },
  ],
  exports: [JWT_SERVICE, AUTH_REPOSITORY],
})
export class AuthModule {}
