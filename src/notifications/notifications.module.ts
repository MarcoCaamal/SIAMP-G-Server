import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationDocument, NotificationSchema } from './infrastructure/schemas/notification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NotificationDocument.name, schema: NotificationSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class NotificationsModule {}
