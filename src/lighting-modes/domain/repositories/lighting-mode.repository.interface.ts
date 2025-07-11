import { LightingMode } from '../entities/lighting-mode.entity';

export interface ILightingModeRepository {
  findById(id: string): Promise<LightingMode | null>;
  findByUserId(userId: string): Promise<LightingMode[]>;
  findSystemModes(): Promise<LightingMode[]>;
  findByHabitatType(habitatType: string): Promise<LightingMode[]>;
  findByUserIdAndHabitatType(userId: string, habitatType: string): Promise<LightingMode[]>;
  findByShareCode(shareCode: string): Promise<LightingMode | null>;
  findSharedModes(): Promise<LightingMode[]>;
  save(lightingMode: LightingMode): Promise<LightingMode>;
  update(lightingMode: LightingMode): Promise<LightingMode>;
  delete(id: string): Promise<void>;
  existsByShareCode(shareCode: string): Promise<boolean>;
}

export const LIGHTING_MODE_REPOSITORY = Symbol('LIGHTING_MODE_REPOSITORY');
