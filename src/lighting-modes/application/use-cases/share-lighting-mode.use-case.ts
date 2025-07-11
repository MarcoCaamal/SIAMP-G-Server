import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../shared/result/result';
import { LightingMode } from '../../domain/entities/lighting-mode.entity';
import { ILightingModeRepository, LIGHTING_MODE_REPOSITORY } from '../../domain/repositories/lighting-mode.repository.interface';
import { LightingModeErrors } from '../../domain/errors/lighting-mode.errors';
import { randomBytes } from 'crypto';

@Injectable()
export class ShareLightingModeUseCase {
  constructor(
    @Inject(LIGHTING_MODE_REPOSITORY)
    private readonly lightingModeRepository: ILightingModeRepository,
  ) {}

  async execute(id: string, userId: string): Promise<Result<{ shareCode: string }>> {
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
        return Result.fail(LightingModeErrors.CANNOT_SHARE_SYSTEM_MODE);
      }

      // Check if already shared
      if (existingMode.isShared) {
        return Result.fail(LightingModeErrors.LIGHTING_MODE_ALREADY_SHARED);
      }

      // Generate unique share code
      let shareCode: string;
      let attempts = 0;
      const maxAttempts = 10;

      do {
        shareCode = this.generateShareCode();
        attempts++;
        
        if (attempts > maxAttempts) {
          return Result.fail(LightingModeErrors.SHARE_CODE_GENERATION_FAILED);
        }
      } while (await this.lightingModeRepository.existsByShareCode(shareCode));

      // Share the lighting mode
      const sharedMode = existingMode.share(shareCode);
      const savedMode = await this.lightingModeRepository.update(sharedMode);

      return Result.ok({ shareCode: savedMode.shareCode! });
    } catch (error) {
      return Result.fail(
        LightingModeErrors.internalError(
          `Failed to share lighting mode: ${error.message}`,
        ),
      );
    }
  }

  private generateShareCode(): string {
    // Generate a 8-character alphanumeric code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const bytes = randomBytes(8);
    
    for (let i = 0; i < 8; i++) {
      result += chars[bytes[i] % chars.length];
    }
    
    return result;
  }
}
