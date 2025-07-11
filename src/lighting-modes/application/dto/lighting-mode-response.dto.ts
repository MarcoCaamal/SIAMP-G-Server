import { ApiProperty } from '@nestjs/swagger';

export class ColorConfigResponseDto {
  @ApiProperty({ description: 'Color mode', example: 'rgb' })
  mode: 'rgb' | 'temperature';

  @ApiProperty({ description: 'RGB color values', example: { r: 255, g: 100, b: 50 } })
  rgb: {
    r: number;
    g: number;
    b: number;
  };

  @ApiProperty({ description: 'Color temperature in Kelvin', example: 5500 })
  temperature: number;
}

export class StateConfigResponseDto {
  @ApiProperty({ description: 'Power state', example: 'on' })
  power: 'on' | 'off';

  @ApiProperty({ description: 'Brightness level', example: 75 })
  brightness: number;

  @ApiProperty({ description: 'Color configuration', type: ColorConfigResponseDto })
  color: ColorConfigResponseDto;
}

export class TransitionConfigResponseDto {
  @ApiProperty({ description: 'Transition type', example: 'fade' })
  type: 'fade' | 'instant' | 'ease-in' | 'ease-out';

  @ApiProperty({ description: 'Transition duration in seconds', example: 2 })
  duration: number;
}

export class SequenceStepResponseDto {
  @ApiProperty({ description: 'Duration of this step in seconds', example: 30 })
  duration: number;

  @ApiProperty({ description: 'State configuration for this step', type: StateConfigResponseDto })
  state: StateConfigResponseDto;

  @ApiProperty({ description: 'Transition configuration for this step', type: TransitionConfigResponseDto })
  transition: TransitionConfigResponseDto;
}

export class LightingModeResponseDto {
  @ApiProperty({ description: 'Unique identifier', example: '507f1f77bcf86cd799439011' })
  id: string;

  @ApiProperty({ description: 'User ID (null for system modes)', example: '507f1f77bcf86cd799439012', nullable: true })
  userId: string | null;

  @ApiProperty({ description: 'Name of the lighting mode', example: 'Sunset Relaxation' })
  name: string;

  @ApiProperty({ description: 'Description of the lighting mode', example: 'A calming sunset sequence' })
  description: string;

  @ApiProperty({ description: 'Category of the mode', example: 'user' })
  category: 'user' | 'system';

  @ApiProperty({ description: 'Habitat type', example: 'aquarium' })
  habitatType: string;

  @ApiProperty({ description: 'Sequence of lighting steps', type: [SequenceStepResponseDto] })
  sequence: SequenceStepResponseDto[];

  @ApiProperty({ description: 'Whether the mode is shared', example: false })
  isShared: boolean;

  @ApiProperty({ description: 'Share code if shared', example: 'SUNSET2024', nullable: true })
  shareCode: string | null;

  @ApiProperty({ description: 'Original mode ID if copied', example: '507f1f77bcf86cd799439013', nullable: true })
  originalModeId: string | null;

  @ApiProperty({ description: 'Original author ID if shared', example: '507f1f77bcf86cd799439014', nullable: true })
  originalAuthorId: string | null;

  @ApiProperty({ description: 'Creation date', example: '2024-01-15T10:30:00Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date', example: '2024-01-15T10:30:00Z' })
  updatedAt: Date;

  @ApiProperty({ description: 'Total duration in seconds', example: 300 })
  totalDuration: number;
}

export class LightingModeListResponseDto {
  @ApiProperty({ description: 'List of lighting modes', type: [LightingModeResponseDto] })
  modes: LightingModeResponseDto[];

  @ApiProperty({ description: 'Total number of modes', example: 15 })
  total: number;

  @ApiProperty({ description: 'Number of user modes', example: 10 })
  userModes: number;

  @ApiProperty({ description: 'Number of system modes', example: 5 })
  systemModes: number;

  @ApiProperty({ description: 'Number of shared modes', example: 3 })
  sharedModes: number;
}

export class ShareResponseDto {
  @ApiProperty({ description: 'Generated share code', example: 'SUNSET2024' })
  shareCode: string;

  @ApiProperty({ description: 'Success message', example: 'Lighting mode shared successfully' })
  message: string;
}
