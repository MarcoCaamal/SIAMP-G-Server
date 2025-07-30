import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, Min, Max, IsBoolean, ValidateNested, IsDateString, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class ScheduledActionDto {
  @ApiProperty({ description: 'Estado del dispositivo', enum: ['on', 'off'] })
  @IsNotEmpty()
  @IsEnum(['on', 'off'])
  state: 'on' | 'off';

  @ApiProperty({ description: 'Nivel de brillo', minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  brightness: number;

  @ApiPropertyOptional({ description: 'ID del modo de iluminación', nullable: true })
  @IsOptional()
  @IsString()
  lightingModeId?: string | null;
}

export class DaysOfWeekDto {
  @ApiPropertyOptional({ description: 'Lunes', default: false })
  @IsOptional()
  @IsBoolean()
  monday?: boolean;

  @ApiPropertyOptional({ description: 'Martes', default: false })
  @IsOptional()
  @IsBoolean()
  tuesday?: boolean;

  @ApiPropertyOptional({ description: 'Miércoles', default: false })
  @IsOptional()
  @IsBoolean()
  wednesday?: boolean;

  @ApiPropertyOptional({ description: 'Jueves', default: false })
  @IsOptional()
  @IsBoolean()
  thursday?: boolean;

  @ApiPropertyOptional({ description: 'Viernes', default: false })
  @IsOptional()
  @IsBoolean()
  friday?: boolean;

  @ApiPropertyOptional({ description: 'Sábado', default: false })
  @IsOptional()
  @IsBoolean()
  saturday?: boolean;

  @ApiPropertyOptional({ description: 'Domingo', default: false })
  @IsOptional()
  @IsBoolean()
  sunday?: boolean;
}

export class RecurrenceConfigDto {
  @ApiProperty({ description: 'Tipo de recurrencia', enum: ['once', 'daily', 'weekly', 'custom'] })
  @IsNotEmpty()
  @IsEnum(['once', 'daily', 'weekly', 'custom'])
  type: 'once' | 'daily' | 'weekly' | 'custom';

  @ApiPropertyOptional({ description: 'Días de la semana para recurrencia personalizada', type: DaysOfWeekDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => DaysOfWeekDto)
  daysOfWeek?: DaysOfWeekDto;

  @ApiPropertyOptional({ description: 'Fecha de finalización de la programación', nullable: true })
  @IsOptional()
  @IsDateString()
  endDate?: string | null;
}

export class CreateScheduleDto {
  @ApiProperty({ description: 'ID del dispositivo' })
  @IsNotEmpty()
  @IsString()
  deviceId: string;

  @ApiProperty({ description: 'Nombre de la programación' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Descripción de la programación' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Hora programada en formato HH:mm', example: '14:30' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'scheduledTime must be in HH:mm format' })
  scheduledTime: string;

  @ApiProperty({ description: 'Zona horaria', example: 'America/Mexico_City' })
  @IsNotEmpty()
  @IsString()
  timezone: string;

  @ApiProperty({ description: 'Acción programada', type: ScheduledActionDto })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ScheduledActionDto)
  scheduledAction: ScheduledActionDto;

  @ApiProperty({ description: 'Configuración de recurrencia', type: RecurrenceConfigDto })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => RecurrenceConfigDto)
  recurrence: RecurrenceConfigDto;
}

export class UpdateScheduleDto {
  @ApiPropertyOptional({ description: 'Nombre de la programación' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Descripción de la programación' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Hora programada en formato HH:mm', example: '14:30' })
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'scheduledTime must be in HH:mm format' })
  scheduledTime?: string;

  @ApiPropertyOptional({ description: 'Zona horaria', example: 'America/Mexico_City' })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({ description: 'Estado de la programación', enum: ['active', 'inactive'] })
  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: 'active' | 'inactive';

  @ApiPropertyOptional({ description: 'Acción programada', type: ScheduledActionDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ScheduledActionDto)
  scheduledAction?: ScheduledActionDto;

  @ApiPropertyOptional({ description: 'Configuración de recurrencia', type: RecurrenceConfigDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => RecurrenceConfigDto)
  recurrence?: RecurrenceConfigDto;
}

export class ScheduleResponseDto {
  @ApiProperty({ description: 'ID de la programación' })
  id: string;

  @ApiProperty({ description: 'ID del usuario' })
  userId: string;

  @ApiProperty({ description: 'ID del dispositivo' })
  deviceId: string;

  @ApiProperty({ description: 'Nombre de la programación' })
  name: string;

  @ApiProperty({ description: 'Descripción de la programación' })
  description: string;

  @ApiProperty({ description: 'Hora programada en formato HH:mm' })
  scheduledTime: string;

  @ApiProperty({ description: 'Zona horaria' })
  timezone: string;

  @ApiProperty({ description: 'Estado de la programación', enum: ['active', 'inactive'] })
  status: 'active' | 'inactive';

  @ApiProperty({ description: 'Acción programada', type: ScheduledActionDto })
  scheduledAction: ScheduledActionDto;

  @ApiProperty({ description: 'Configuración de recurrencia', type: RecurrenceConfigDto })
  recurrence: RecurrenceConfigDto;

  @ApiPropertyOptional({ description: 'Última fecha de ejecución', nullable: true })
  lastExecutedAt: Date | null;

  @ApiPropertyOptional({ description: 'Próxima fecha de ejecución', nullable: true })
  nextExecutionAt: Date | null;

  @ApiProperty({ description: 'Contador de ejecuciones' })
  executionCount: number;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  updatedAt: Date;
}
