import { LightingMode } from '../../domain/entities/lighting-mode.entity';
import { 
  LightingModeResponseDto, 
  LightingModeListResponseDto,
  ShareResponseDto,
  SequenceStepResponseDto,
  StateConfigResponseDto,
  TransitionConfigResponseDto,
  ColorConfigResponseDto
} from '../dto/lighting-mode-response.dto';

export class LightingModeMapper {
  static toResponseDto(lightingMode: LightingMode): LightingModeResponseDto {
    return {
      id: lightingMode.id,
      userId: lightingMode.userId,
      name: lightingMode.name,
      description: lightingMode.description,
      category: lightingMode.category,
      habitatType: lightingMode.habitatType,
      sequence: lightingMode.sequence.map(step => this.mapSequenceStep(step)),
      isShared: lightingMode.isShared,
      shareCode: lightingMode.shareCode,
      originalModeId: lightingMode.originalModeId,
      originalAuthorId: lightingMode.originalAuthorId,
      createdAt: lightingMode.createdAt,
      updatedAt: lightingMode.updatedAt,
      totalDuration: lightingMode.getTotalDuration(),
    };
  }

  static toListResponseDto(lightingModes: LightingMode[]): LightingModeListResponseDto {
    const modes = lightingModes.map(mode => this.toResponseDto(mode));
    const userModes = lightingModes.filter(mode => mode.isUserMode()).length;
    const systemModes = lightingModes.filter(mode => mode.isSystemMode()).length;
    const sharedModes = lightingModes.filter(mode => mode.isShared).length;

    return {
      modes,
      total: lightingModes.length,
      userModes,
      systemModes,
      sharedModes,
    };
  }

  static toShareResponseDto(shareCode: string): ShareResponseDto {
    return {
      shareCode,
      message: 'Lighting mode shared successfully',
    };
  }

  private static mapSequenceStep(step: any): SequenceStepResponseDto {
    return {
      duration: step.duration,
      state: this.mapStateConfig(step.state),
      transition: this.mapTransitionConfig(step.transition),
    };
  }

  private static mapStateConfig(state: any): StateConfigResponseDto {
    return {
      power: state.power,
      brightness: state.brightness,
      color: this.mapColorConfig(state.color),
    };
  }

  private static mapTransitionConfig(transition: any): TransitionConfigResponseDto {
    return {
      type: transition.type,
      duration: transition.duration,
    };
  }

  private static mapColorConfig(color: any): ColorConfigResponseDto {
    return {
      mode: color.mode,
      rgb: {
        r: color.rgb.r,
        g: color.rgb.g,
        b: color.rgb.b,
      },
      temperature: color.temperature,
    };
  }
}
