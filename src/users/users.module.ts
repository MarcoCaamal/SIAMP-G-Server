import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { USER_REPOSITORY } from './domain/repositories/user.repository.interface';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { UserDocument, UserSchema } from './infrastructure/schemas/user.schema';
import { UsersController } from './presentation/controllers/users.controller';
import { GetUserProfileUseCase } from './application/use-cases/get-user-profile.use-case';
import { UpdateUserProfileUseCase } from './application/use-cases/update-user-profile.use-case';
import { UpdateNotificationPreferencesUseCase } from './application/use-cases/update-notification-preferences.use-case';
import { ChangePasswordUseCase } from './application/use-cases/change-password.use-case';
import { UploadProfilePictureUseCase } from './application/use-cases/upload-profile-picture.use-case';
import { DeleteProfilePictureUseCase2 } from './application/use-cases/delete-profile-picture-simple.use-case';
import { ProfilePictureService } from './application/services/profile-picture.service';

@Module({
  imports: [
    forwardRef(() => AuthModule), // Usar forwardRef para evitar dependencia circular
    ConfigModule,
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
    UploadProfilePictureUseCase,
    DeleteProfilePictureUseCase2,
    // ProfilePictureService,
  ],
  exports: [USER_REPOSITORY],
})
export class UsersModule {}
