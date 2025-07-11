import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DevicesModule } from './devices/devices.module';
import { LightingModesModule } from './lighting-modes/lighting-modes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/siamp-auth',
    ),
    AuthModule,
    UsersModule,
    DevicesModule,
    LightingModesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
