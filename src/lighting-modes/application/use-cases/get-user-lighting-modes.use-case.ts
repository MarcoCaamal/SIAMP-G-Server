import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../shared/result/result';
import { LightingMode } from '../../domain/entities/lighting-mode.entity';
import { ILightingModeRepository, LIGHTING_MODE_REPOSITORY } from '../../domain/repositories/lighting-mode.repository.interface';
import { LightingModeErrors } from '../../domain/errors/lighting-mode.errors';

@Injectable()
export class GetUserLightingModesUseCase {
  constructor(
    @Inject(LIGHTING_MODE_REPOSITORY)
    private readonly lightingModeRepository: ILightingModeRepository,
  ) {}

  async execute(userId: string, habitatType?: string): Promise<Result<LightingMode[]>> {
    try {
      let userModes: LightingMode[];
      let systemModes: LightingMode[];

      if (habitatType) {
        userModes = await this.lightingModeRepository.findByUserIdAndHabitatType(userId, habitatType);
        systemModes = await this.lightingModeRepository.findByHabitatType(habitatType);
        systemModes = systemModes.filter(mode => mode.isSystemMode());
      } else {
        userModes = await this.lightingModeRepository.findByUserId(userId);
        systemModes = await this.lightingModeRepository.findSystemModes();
      }

      // Combine user modes and system modes
      const allModes = [...userModes, ...systemModes];
      return Result.ok(allModes);
    } catch (error) {
      return Result.fail(
        LightingModeErrors.internalError(
          `Failed to get user lighting modes: ${error.message}`,
        ),
      );
    }
  }
}
