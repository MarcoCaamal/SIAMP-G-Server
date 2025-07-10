import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../shared/result/result';
import { ILightingModeRepository, LIGHTING_MODE_REPOSITORY } from '../../domain/repositories/lighting-mode.repository.interface';
import { LightingModeErrors } from '../../domain/errors/lighting-mode.errors';

@Injectable()
export class DeleteLightingModeUseCase {
  constructor(
    @Inject(LIGHTING_MODE_REPOSITORY)
    private readonly lightingModeRepository: ILightingModeRepository,
  ) {}

  async execute(id: string, userId: string): Promise<Result<void>> {
    try {
      const existingMode = await this.lightingModeRepository.findById(id);
      
      if (!existingMode) {
        return Result.fail(LightingModeErrors.LIGHTING_MODE_NOT_FOUND);
      }

      // Check if user owns the lighting mode
      if (!existingMode.belongsToUser(userId)) {
        return Result.fail(LightingModeErrors.UNAUTHORIZED_ACCESS);
      }

      // Check if it's a system mode
      if (existingMode.isSystemMode()) {
        return Result.fail(LightingModeErrors.CANNOT_MODIFY_SYSTEM_MODE);
      }

      await this.lightingModeRepository.delete(id);
      return Result.ok(undefined);
    } catch (error) {
      return Result.fail(
        LightingModeErrors.internalError(
          `Failed to delete lighting mode: ${error.message}`,
        ),
      );
    }
  }
}
