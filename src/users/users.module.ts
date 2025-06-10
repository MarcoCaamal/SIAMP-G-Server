import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { USER_REPOSITORY } from './domain/repositories/user.repository.interface';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { UserDocument, UserSchema } from './infrastructure/schemas/user.schema';
import { UsersController } from './presentation/controllers/users.controller';
import { GetUserProfileUseCase } from './application/use-cases/get-user-profile.use-case';
import { UpdateUserProfileUseCase } from './application/use-cases/update-user-profile.use-case';
import { UpdateNotificationPreferencesUseCase } from './application/use-cases/update-notification-preferences.use-case';
import { ChangePasswordUseCase } from './application/use-cases/change-password.use-case';

@Module({
  imports: [
    forwardRef(() => AuthModule), // Usar forwardRef para evitar dependencia circular
    MongooseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    GetUserProfileUseCase,
    UpdateUserProfileUseCase,
    UpdateNotificationPreferencesUseCase,
    ChangePasswordUseCase,
  ],
  exports: [USER_REPOSITORY],
})
export class UsersModule {}
