import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../shared/result/result';
import { LightingMode } from '../../domain/entities/lighting-mode.entity';
import { ILightingModeRepository, LIGHTING_MODE_REPOSITORY } from '../../domain/repositories/lighting-mode.repository.interface';
import { LightingModeErrors } from '../../domain/errors/lighting-mode.errors';
import { UpdateLightingModeDto } from '../dto/lighting-mode-request.dto';

@Injectable()
export class UpdateLightingModeUseCase {
  constructor(
    @Inject(LIGHTING_MODE_REPOSITORY)
    private readonly lightingModeRepository: ILightingModeRepository,
  ) {}

  async execute(
    id: string,
    userId: string,
    dto: UpdateLightingModeDto,
  ): Promise<Result<LightingMode>> {
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

      // Update the lighting mode
      let updatedMode = existingMode;

      if (dto.name !== undefined) {
        updatedMode = updatedMode.updateName(dto.name);
      }

      if (dto.description !== undefined) {
        updatedMode = updatedMode.updateDescription(dto.description);
      }

      if (dto.sequence !== undefined) {
        // Validate sequence
        if (dto.sequence.length === 0) {
          return Result.fail(LightingModeErrors.SEQUENCE_TOO_SHORT);
        }

        const totalDuration = dto.sequence.reduce((sum, step) => sum + step.duration, 0);
        if (totalDuration <= 0) {
          return Result.fail(LightingModeErrors.INVALID_DURATION);
        }

        updatedMode = updatedMode.updateSequence(dto.sequence);
      }

      const savedMode = await this.lightingModeRepository.update(updatedMode);
      return Result.ok(savedMode);
    } catch (error) {
      return Result.fail(
        LightingModeErrors.internalError(
          `Failed to update lighting mode: ${error.message}`,
        ),
      );
    }
  }
}
