import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { USER_REPOSITORY } from './domain/repositories/user.repository.interface';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { UserDocument, UserSchema } from './infrastructure/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema }
    ])
  ],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository
    }
  ],
  exports: [USER_REPOSITORY]
})
export class UsersModule {}
