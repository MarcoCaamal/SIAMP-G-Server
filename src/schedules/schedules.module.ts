import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleDocument, ScheduleSchema } from './infrastructure/schemas/schedule.schema';
import { AuthModule } from '../auth/auth.module';

// Controllers
import { SchedulesController } from './presentation/controllers/schedules.controller';

// Use Cases
import {
  CreateScheduleUseCase,
  GetScheduleByIdUseCase,
  GetUserSchedulesUseCase,
  UpdateScheduleUseCase,
  DeleteScheduleUseCase,
  ToggleScheduleStatusUseCase,
} from './application/use-cases';

// Repositories
import { MongooseScheduleRepository } from './infrastructure/repositories/mongoose-schedule.repository';
import { SCHEDULE_REPOSITORY } from './domain/repositories/schedule.repository.interface';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ScheduleDocument.name, schema: ScheduleSchema },
    ]),
    AuthModule, // Import AuthModule to access JWT services
  ],
  controllers: [SchedulesController],
  providers: [
    // Use Cases
    CreateScheduleUseCase,
    GetScheduleByIdUseCase,
    GetUserSchedulesUseCase,
    UpdateScheduleUseCase,
    DeleteScheduleUseCase,
    ToggleScheduleStatusUseCase,

    // Repository
    {
      provide: SCHEDULE_REPOSITORY,
      useClass: MongooseScheduleRepository,
    },
  ],
  exports: [
    MongooseModule,
    // Export use cases if needed by other modules
    CreateScheduleUseCase,
    GetScheduleByIdUseCase,
    GetUserSchedulesUseCase,
    UpdateScheduleUseCase,
    DeleteScheduleUseCase,
    ToggleScheduleStatusUseCase,
  ],
})
export class SchedulesModule {}
