import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

// Use Cases
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.use-case';
import { VerifyEmailUseCase } from './application/use-cases/verify-email.use-case';
import { VerifyEmailByCodeUseCase } from './application/use-cases/verify-email-by-code.use-case';
import { VerifyEmailByTokenUseCase } from './application/use-cases/verify-email-by-token.use-case';
import { SendVerificationTokenUseCase } from './application/use-cases/send-verification-token.use-case';
import { SendVerificationCodeUseCase } from './application/use-cases/send-verification-code.use-case';
import { LogoutUseCase } from './application/use-cases/logout.use-case';

// Services
import { HASHING_SERVICE } from './application/interfaces/hashing.service.interface';
import { JWT_SERVICE } from './application/interfaces/jwt.service.interface';
import { EMAIL_SERVICE } from './application/interfaces/email.service.interface';
import { BcryptHashingService } from './infrastructure/services/bcrypt-hashing.service';
import { NestJwtService } from './infrastructure/services/nest-jwt.service';
import { ConsoleEmailService } from './infrastructure/services/console-email.service';

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
    UsersModule,
    JwtModule.register({
      global: true,
    }),
    MongooseModule.forFeature([
      { name: RefreshTokenDocument.name, schema: RefreshTokenSchema },
    ]),
  ],
  controllers: [AuthController],  providers: [
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

    // Services
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
      useClass: ConsoleEmailService,
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
