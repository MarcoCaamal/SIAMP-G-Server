import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../shared/result/result';
import { LightingMode } from '../../domain/entities/lighting-mode.entity';
import { ILightingModeRepository, LIGHTING_MODE_REPOSITORY } from '../../domain/repositories/lighting-mode.repository.interface';
import { LightingModeErrors } from '../../domain/errors/lighting-mode.errors';

@Injectable()
export class GetLightingModeByIdUseCase {
  constructor(
    @Inject(LIGHTING_MODE_REPOSITORY)
    private readonly lightingModeRepository: ILightingModeRepository,
  ) {}

  async execute(id: string, userId?: string): Promise<Result<LightingMode>> {
    try {
      const lightingMode = await this.lightingModeRepository.findById(id);
      
      if (!lightingMode) {
        return Result.fail(LightingModeErrors.LIGHTING_MODE_NOT_FOUND);
      }

      // Check authorization for private modes
      if (lightingMode.isUserMode() && !lightingMode.isShared && userId) {
        if (!lightingMode.belongsToUser(userId)) {
          return Result.fail(LightingModeErrors.UNAUTHORIZED_ACCESS);
        }
      }

      return Result.ok(lightingMode);
    } catch (error) {
      return Result.fail(
        LightingModeErrors.internalError(
          `Failed to get lighting mode: ${error.message}`,
        ),
      );
    }
  }
}
