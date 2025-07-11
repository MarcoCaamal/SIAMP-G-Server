import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Infrastructure
import { LightingModeDocument, LightingModeSchema } from './infrastructure/schemas/lighting-mode.schema';
import { MongooseLightingModeRepository } from './infrastructure/repositories/mongoose-lighting-mode.repository';

// Application - Use Cases
import {
  CreateLightingModeUseCase,
  GetLightingModeByIdUseCase,
  GetUserLightingModesUseCase,
  UpdateLightingModeUseCase,
  DeleteLightingModeUseCase,
  ShareLightingModeUseCase,
  ImportSharedLightingModeUseCase,
} from './application/use-cases';

// Domain
import { LIGHTING_MODE_REPOSITORY } from './domain/repositories/lighting-mode.repository.interface';

// Presentation
import { LightingModesController } from './presentation/controllers/lighting-modes.controller';

// External modules
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LightingModeDocument.name, schema: LightingModeSchema },
    ]),
    forwardRef(() => AuthModule), // Usar forwardRef para evitar dependencias circulares
  ],
  controllers: [LightingModesController],
  providers: [
    // Repository implementation
    {
      provide: LIGHTING_MODE_REPOSITORY,
      useClass: MongooseLightingModeRepository,
    },
    // Use Cases
    CreateLightingModeUseCase,
    GetLightingModeByIdUseCase,
    GetUserLightingModesUseCase,
    UpdateLightingModeUseCase,
    DeleteLightingModeUseCase,
    ShareLightingModeUseCase,
    ImportSharedLightingModeUseCase,
  ],
  exports: [
    // Export use cases if needed by other modules
    CreateLightingModeUseCase,
    GetLightingModeByIdUseCase,
    GetUserLightingModesUseCase,
    UpdateLightingModeUseCase,
    DeleteLightingModeUseCase,
    ShareLightingModeUseCase,
    ImportSharedLightingModeUseCase,
    LIGHTING_MODE_REPOSITORY,
  ],
})
export class LightingModesModule {}
