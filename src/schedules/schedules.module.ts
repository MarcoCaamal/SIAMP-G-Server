import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleDocument, ScheduleSchema } from './infrastructure/schemas/schedule.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ScheduleDocument.name, schema: ScheduleSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class SchedulesModule {}
