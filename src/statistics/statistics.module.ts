import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatisticDocument, StatisticSchema } from './infrastructure/schemas/statistic.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StatisticDocument.name, schema: StatisticSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class StatisticsModule {}
