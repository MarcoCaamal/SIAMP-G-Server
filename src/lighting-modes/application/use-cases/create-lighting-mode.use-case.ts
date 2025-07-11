import { Injectable } from '@nestjs/common';
import { Result } from '../../../shared/result/result';
import { LightingMode } from '../../domain/entities/lighting-mode.entity';
import { ILightingModeRepository, LIGHTING_MODE_REPOSITORY } from '../../domain/repositories/lighting-mode.repository.interface';
import { LightingModeErrors } from '../../domain/errors/lighting-mode.errors';
import { CreateLightingModeDto } from '../dto/lighting-mode-request.dto';
import { Inject } from '@nestjs/common';

@Injectable()
export class CreateLightingModeUseCase {
  constructor(
    @Inject(LIGHTING_MODE_REPOSITORY)
    private readonly lightingModeRepository: ILightingModeRepository,
  ) {}

  async execute(
    userId: string,
    dto: CreateLightingModeDto,
  ): Promise<Result<LightingMode>> {
    try {
      // Validate sequence duration
      const totalDuration = dto.sequence.reduce((sum, step) => sum + step.duration, 0);
      if (totalDuration <= 0) {
        return Result.fail(LightingModeErrors.SEQUENCE_TOO_SHORT);
      }

      if (dto.sequence.length === 0) {
        return Result.fail(LightingModeErrors.SEQUENCE_TOO_SHORT);
      }

      // Create new lighting mode
      const lightingMode = LightingMode.create(
        userId,
        dto.name,
        dto.description || '',
        'user',
        dto.habitatType,
        dto.sequence,
      );

      const savedMode = await this.lightingModeRepository.save(lightingMode);
      return Result.ok(savedMode);
    } catch (error) {
      return Result.fail(
        LightingModeErrors.internalError(
          `Failed to create lighting mode: ${error.message}`,
        ),
      );
    }
  }
}
