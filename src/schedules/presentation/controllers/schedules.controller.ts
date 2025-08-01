import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';

// Use Cases
import {
  CreateScheduleUseCase,
  GetScheduleByIdUseCase,
  GetUserSchedulesUseCase,
  UpdateScheduleUseCase,
  DeleteScheduleUseCase,
  ToggleScheduleStatusUseCase,
} from '../../application/use-cases';

// DTOs and Mappers
import {
  CreateScheduleDto,
  UpdateScheduleDto,
  ScheduleResponseDto,
} from '../../application/dto/schedule-request.dto';
import { ScheduleMapper } from '../../infrastructure/mappers/schedule.mapper';

@ApiTags('Schedules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/schedules')
export class SchedulesController {
  constructor(
    private readonly createScheduleUseCase: CreateScheduleUseCase,
    private readonly getScheduleByIdUseCase: GetScheduleByIdUseCase,
    private readonly getUserSchedulesUseCase: GetUserSchedulesUseCase,
    private readonly updateScheduleUseCase: UpdateScheduleUseCase,
    private readonly deleteScheduleUseCase: DeleteScheduleUseCase,
    private readonly toggleScheduleStatusUseCase: ToggleScheduleStatusUseCase,
  ) {}

  @ApiOperation({ summary: 'Crear una nueva programación' })
  @ApiBody({ type: CreateScheduleDto })
  @ApiCreatedResponse({ description: 'Programación creada exitosamente' })
  @ApiBadRequestResponse({ description: 'Datos de programación inválidos' })
  @ApiUnauthorizedResponse({ description: 'Usuario no autenticado' })
  @Post()
  async createSchedule(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createDto: CreateScheduleDto,
  ) {
    try {
      const userId = (req as any).user?.id;
      const result = await this.createScheduleUseCase.execute(userId, createDto);

      if (result.isFailure) {
        return res.status(result.error!.statusCode).json({
          success: false,
          message: result.error!.message,
          error: result.error,
        });
      }

      const responseDto = ScheduleMapper.toResponseDto(result.value!);
      return res.status(201).json({
        success: true,
        message: 'Programación creada exitosamente',
        data: responseDto,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: { message: error.message },
      });
    }
  }

  @ApiOperation({ summary: 'Obtener programaciones del usuario' })
  @ApiQuery({ name: 'deviceId', required: false, description: 'Filtrar por ID de dispositivo' })
  @ApiOkResponse({ description: 'Programaciones obtenidas exitosamente' })
  @ApiUnauthorizedResponse({ description: 'Usuario no autenticado' })
  @Get()
  async getUserSchedules(
    @Req() req: Request,
    @Res() res: Response,
    @Query('deviceId') deviceId?: string,
  ) {
    try {
      const userId = (req as any).user?.id;
      const result = await this.getUserSchedulesUseCase.execute(userId, deviceId);

      if (result.isFailure) {
        return res.status(result.error!.statusCode).json({
          success: false,
          message: result.error!.message,
          error: result.error,
        });
      }

      const responseDto = ScheduleMapper.toListResponseDto(result.value!);
      return res.status(200).json({
        success: true,
        message: 'Programaciones obtenidas exitosamente',
        data: responseDto,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: { message: error.message },
      });
    }
  }

  @ApiOperation({ summary: 'Obtener programación por ID' })
  @ApiParam({ name: 'id', description: 'ID de la programación' })
  @ApiOkResponse({ description: 'Programación obtenida exitosamente' })
  @ApiNotFoundResponse({ description: 'Programación no encontrada' })
  @ApiForbiddenResponse({ description: 'Acceso denegado' })
  @ApiUnauthorizedResponse({ description: 'Usuario no autenticado' })
  @Get(':id')
  async getScheduleById(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    try {
      const userId = (req as any).user?.id;
      const result = await this.getScheduleByIdUseCase.execute(userId, id);

      if (result.isFailure) {
        return res.status(result.error!.statusCode).json({
          success: false,
          message: result.error!.message,
          error: result.error,
        });
      }

      const responseDto = ScheduleMapper.toResponseDto(result.value!);
      return res.status(200).json({
        success: true,
        message: 'Programación obtenida exitosamente',
        data: responseDto,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: { message: error.message },
      });
    }
  }

  @ApiOperation({ summary: 'Actualizar programación' })
  @ApiParam({ name: 'id', description: 'ID de la programación' })
  @ApiBody({ type: UpdateScheduleDto })
  @ApiOkResponse({ description: 'Programación actualizada exitosamente' })
  @ApiBadRequestResponse({ description: 'Datos de programación inválidos' })
  @ApiNotFoundResponse({ description: 'Programación no encontrada' })
  @ApiForbiddenResponse({ description: 'Acceso denegado' })
  @ApiUnauthorizedResponse({ description: 'Usuario no autenticado' })
  @Put(':id')
  async updateSchedule(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateDto: UpdateScheduleDto,
  ) {
    try {
      const userId = (req as any).user?.id;
      const result = await this.updateScheduleUseCase.execute(userId, id, updateDto);

      if (result.isFailure) {
        return res.status(result.error!.statusCode).json({
          success: false,
          message: result.error!.message,
          error: result.error,
        });
      }

      const responseDto = ScheduleMapper.toResponseDto(result.value!);
      return res.status(200).json({
        success: true,
        message: 'Programación actualizada exitosamente',
        data: responseDto,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: { message: error.message },
      });
    }
  }

  @ApiOperation({ summary: 'Activar/Desactivar programación' })
  @ApiParam({ name: 'id', description: 'ID de la programación' })
  @ApiQuery({ name: 'activate', description: 'true para activar, false para desactivar' })
  @ApiOkResponse({ description: 'Estado de programación cambiado exitosamente' })
  @ApiNotFoundResponse({ description: 'Programación no encontrada' })
  @ApiForbiddenResponse({ description: 'Acceso denegado' })
  @ApiUnauthorizedResponse({ description: 'Usuario no autenticado' })
  @Patch(':id/toggle')
  async toggleScheduleStatus(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
    @Query('activate') activate: string,
  ) {
    try {
      const userId = (req as any).user?.id;
      const shouldActivate = activate === 'true';
      const result = await this.toggleScheduleStatusUseCase.execute(userId, id, shouldActivate);

      if (result.isFailure) {
        return res.status(result.error!.statusCode).json({
          success: false,
          message: result.error!.message,
          error: result.error,
        });
      }

      const responseDto = ScheduleMapper.toResponseDto(result.value!);
      const action = shouldActivate ? 'activada' : 'desactivada';
      return res.status(200).json({
        success: true,
        message: `Programación ${action} exitosamente`,
        data: responseDto,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: { message: error.message },
      });
    }
  }

  @ApiOperation({ summary: 'Eliminar programación' })
  @ApiParam({ name: 'id', description: 'ID de la programación' })
  @ApiOkResponse({ description: 'Programación eliminada exitosamente' })
  @ApiNotFoundResponse({ description: 'Programación no encontrada' })
  @ApiForbiddenResponse({ description: 'Acceso denegado' })
  @ApiUnauthorizedResponse({ description: 'Usuario no autenticado' })
  @Delete(':id')
  async deleteSchedule(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    try {
      const userId = (req as any).user?.id;
      const result = await this.deleteScheduleUseCase.execute(userId, id);

      if (result.isFailure) {
        return res.status(result.error!.statusCode).json({
          success: false,
          message: result.error!.message,
          error: result.error,
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Programación eliminada exitosamente',
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: { message: error.message },
      });
    }
  }
}
