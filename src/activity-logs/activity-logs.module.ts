import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivityLogDocument, ActivityLogSchema } from './infrastructure/schemas/activity-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ActivityLogDocument.name, schema: ActivityLogSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class ActivityLogsModule {}
