import { IsString, IsNotEmpty, IsArray, ValidateNested, IsEnum, IsNumber, Min, Max, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RgbColorDto {
  @ApiProperty({ description: 'Red component', minimum: 0, maximum: 255, example: 255 })
  @IsNumber()
  @Min(0)
  @Max(255)
  r: number;

  @ApiProperty({ description: 'Green component', minimum: 0, maximum: 255, example: 100 })
  @IsNumber()
  @Min(0)
  @Max(255)
  g: number;

  @ApiProperty({ description: 'Blue component', minimum: 0, maximum: 255, example: 50 })
  @IsNumber()
  @Min(0)
  @Max(255)
  b: number;
}

export class ColorConfigDto {
  @ApiProperty({
    description: 'Color mode',
    enum: ['rgb', 'temperature'],
    example: 'rgb'
  })
  @IsString()
  @IsEnum(['rgb', 'temperature'])
  mode: 'rgb' | 'temperature';

  @ApiProperty({
    description: 'RGB color values',
    example: { r: 255, g: 100, b: 50 }
  })
  @ValidateNested()
  @Type(() => RgbColorDto)
  rgb: RgbColorDto;

  @ApiProperty({
    description: 'Color temperature in Kelvin',
    minimum: 1000,
    maximum: 10000,
    example: 5500
  })
  @IsNumber()
  @Min(1000)
  @Max(10000)
  temperature: number;
}

export class StateConfigDto {
  @ApiProperty({
    description: 'Power state',
    enum: ['on', 'off'],
    example: 'on'
  })
  @IsString()
  @IsEnum(['on', 'off'])
  power: 'on' | 'off';

  @ApiProperty({
    description: 'Brightness level',
    minimum: 0,
    maximum: 100,
    example: 75
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  brightness: number;

  @ApiProperty({
    description: 'Color configuration',
    type: ColorConfigDto
  })
  @ValidateNested()
  @Type(() => ColorConfigDto)
  color: ColorConfigDto;
}

export class TransitionConfigDto {
  @ApiProperty({
    description: 'Transition type',
    enum: ['fade', 'instant', 'ease-in', 'ease-out'],
    example: 'fade'
  })
  @IsString()
  @IsEnum(['fade', 'instant', 'ease-in', 'ease-out'])
  type: 'fade' | 'instant' | 'ease-in' | 'ease-out';

  @ApiProperty({
    description: 'Transition duration in seconds',
    minimum: 0,
    example: 2
  })
  @IsNumber()
  @Min(0)
  duration: number;
}

export class SequenceStepDto {
  @ApiProperty({
    description: 'Duration of this step in seconds',
    minimum: 0,
    example: 30
  })
  @IsNumber()
  @Min(0)
  duration: number;

  @ApiProperty({
    description: 'State configuration for this step',
    type: StateConfigDto
  })
  @ValidateNested()
  @Type(() => StateConfigDto)
  state: StateConfigDto;

  @ApiProperty({
    description: 'Transition configuration for this step',
    type: TransitionConfigDto
  })
  @ValidateNested()
  @Type(() => TransitionConfigDto)
  transition: TransitionConfigDto;
}

export class CreateLightingModeDto {
  @ApiProperty({
    description: 'Name of the lighting mode',
    example: 'Sunset Relaxation'
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Description of the lighting mode',
    example: 'A calming sunset sequence for evening relaxation',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Habitat type this mode is designed for',
    example: 'aquarium'
  })
  @IsString()
  @IsNotEmpty()
  habitatType: string;

  @ApiProperty({
    description: 'Sequence of lighting steps',
    type: [SequenceStepDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SequenceStepDto)
  sequence: SequenceStepDto[];
}

export class UpdateLightingModeDto {
  @ApiProperty({
    description: 'Name of the lighting mode',
    example: 'Updated Sunset Relaxation',
    required: false
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({
    description: 'Description of the lighting mode',
    example: 'An updated calming sunset sequence',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Sequence of lighting steps',
    type: [SequenceStepDto],
    required: false
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SequenceStepDto)
  sequence?: SequenceStepDto[];
}

export class ShareLightingModeDto {
  @ApiProperty({
    description: 'Custom share code (optional)',
    example: 'SUNSET2024',
    required: false
  })
  @IsOptional()
  @IsString()
  shareCode?: string;
}

export class ImportSharedModeDto {
  @ApiProperty({
    description: 'Share code of the lighting mode to import',
    example: 'SUNSET2024'
  })
  @IsString()
  @IsNotEmpty()
  shareCode: string;
}
