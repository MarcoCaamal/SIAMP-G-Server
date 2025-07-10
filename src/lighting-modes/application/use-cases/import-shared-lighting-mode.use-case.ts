import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../shared/result/result';
import { LightingMode } from '../../domain/entities/lighting-mode.entity';
import { ILightingModeRepository, LIGHTING_MODE_REPOSITORY } from '../../domain/repositories/lighting-mode.repository.interface';
import { LightingModeErrors } from '../../domain/errors/lighting-mode.errors';

@Injectable()
export class ImportSharedLightingModeUseCase {
  constructor(
    @Inject(LIGHTING_MODE_REPOSITORY)
    private readonly lightingModeRepository: ILightingModeRepository,
  ) {}

  async execute(shareCode: string, userId: string): Promise<Result<LightingMode>> {
    try {
      const sharedMode = await this.lightingModeRepository.findByShareCode(shareCode);
      
      if (!sharedMode) {
        return Result.fail(LightingModeErrors.INVALID_SHARE_CODE);
      }

      // Check if user is trying to import their own mode
      if (sharedMode.belongsToUser(userId)) {
        return Result.fail(
          LightingModeErrors.internalError('Cannot import your own lighting mode'),
        );
      }

      // Create a copy for the user
      const copiedMode = sharedMode.createCopy(
        userId,
        sharedMode.id,
        sharedMode.userId!,
      );

      const savedMode = await this.lightingModeRepository.save(copiedMode);
      return Result.ok(savedMode);
    } catch (error) {
      return Result.fail(
        LightingModeErrors.internalError(
          `Failed to import shared lighting mode: ${error.message}`,
        ),
      );
    }
  }
}
