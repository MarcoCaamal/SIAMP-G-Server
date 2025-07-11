import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
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
  CreateLightingModeUseCase,
  GetLightingModeByIdUseCase,
  GetUserLightingModesUseCase,
  UpdateLightingModeUseCase,
  DeleteLightingModeUseCase,
  ShareLightingModeUseCase,
  ImportSharedLightingModeUseCase,
} from '../../application/use-cases';

// DTOs
import {
  CreateLightingModeDto,
  UpdateLightingModeDto,
  ImportSharedModeDto,
} from '../../application/dto/lighting-mode-request.dto';

// Mapper
import { LightingModeMapper } from '../../application/mappers/lighting-mode.mapper';

@ApiTags('Lighting Modes')
@ApiBearerAuth()
@Controller('api/lighting-modes')
@UseGuards(JwtAuthGuard)
export class LightingModesController {
  constructor(
    private readonly createLightingModeUseCase: CreateLightingModeUseCase,
    private readonly getLightingModeByIdUseCase: GetLightingModeByIdUseCase,
    private readonly getUserLightingModesUseCase: GetUserLightingModesUseCase,
    private readonly updateLightingModeUseCase: UpdateLightingModeUseCase,
    private readonly deleteLightingModeUseCase: DeleteLightingModeUseCase,
    private readonly shareLightingModeUseCase: ShareLightingModeUseCase,
    private readonly importSharedLightingModeUseCase: ImportSharedLightingModeUseCase,
  ) {}

  @ApiOperation({ summary: 'Crear un nuevo modo de iluminación' })
  @ApiBody({ type: CreateLightingModeDto })
  @ApiCreatedResponse({ description: 'Modo de iluminación creado exitosamente' })
  @ApiBadRequestResponse({ description: 'Datos de modo de iluminación inválidos' })
  @ApiUnauthorizedResponse({ description: 'Usuario no autenticado' })
  @Post()
  async createLightingMode(
    @Req() req: Request,
    @Res() res: Response,
    @Body() createDto: CreateLightingModeDto,
  ) {
    try {
      const userId = (req as any).user?.id;
      const result = await this.createLightingModeUseCase.execute(userId, createDto);

      if (result.isFailure) {
        return res.status(400).json({
          success: false,
          message: result.error!.message,
          error: result.error,
        });
      }

      const responseDto = LightingModeMapper.toResponseDto(result.value!);
      return res.status(201).json({
        success: true,
        message: 'Modo de iluminación creado exitosamente',
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

  @ApiOperation({ summary: 'Obtener modos de iluminación del usuario' })
  @ApiQuery({ name: 'habitatType', required: false, description: 'Filtrar por tipo de hábitat' })
  @ApiOkResponse({ description: 'Modos de iluminación obtenidos exitosamente' })
  @ApiUnauthorizedResponse({ description: 'Usuario no autenticado' })
  @Get()
  async getUserLightingModes(
    @Req() req: Request,
    @Res() res: Response,
    @Query('habitatType') habitatType?: string,
  ) {
    try {
      const userId = (req as any).user?.id;
      const result = await this.getUserLightingModesUseCase.execute(userId, habitatType);

      if (result.isFailure) {
        return res.status(400).json({
          success: false,
          message: result.error!.message,
          error: result.error,
        });
      }

      const responseDto = LightingModeMapper.toListResponseDto(result.value!);
      return res.status(200).json({
        success: true,
        message: 'Modos de iluminación obtenidos exitosamente',
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

  @ApiOperation({ summary: 'Obtener modo de iluminación por ID' })
  @ApiParam({ name: 'id', description: 'ID del modo de iluminación' })
  @ApiOkResponse({ description: 'Modo de iluminación obtenido exitosamente' })
  @ApiNotFoundResponse({ description: 'Modo de iluminación no encontrado' })
  @ApiForbiddenResponse({ description: 'Acceso denegado' })
  @ApiUnauthorizedResponse({ description: 'Usuario no autenticado' })
  @Get(':id')
  async getLightingModeById(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    try {
      const userId = (req as any).user?.id;
      const result = await this.getLightingModeByIdUseCase.execute(id, userId);

      if (result.isFailure) {
        const statusCode = result.error!.statusCode || 400;
        return res.status(statusCode).json({
          success: false,
          message: result.error!.message,
          error: result.error,
        });
      }

      const responseDto = LightingModeMapper.toResponseDto(result.value!);
      return res.status(200).json({
        success: true,
        message: 'Modo de iluminación obtenido exitosamente',
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

  @ApiOperation({ summary: 'Actualizar modo de iluminación' })
  @ApiParam({ name: 'id', description: 'ID del modo de iluminación' })
  @ApiBody({ type: UpdateLightingModeDto })
  @ApiOkResponse({ description: 'Modo de iluminación actualizado exitosamente' })
  @ApiNotFoundResponse({ description: 'Modo de iluminación no encontrado' })
  @ApiForbiddenResponse({ description: 'Acceso denegado o no se puede modificar modo del sistema' })
  @ApiUnauthorizedResponse({ description: 'Usuario no autenticado' })
  @Put(':id')
  async updateLightingMode(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateDto: UpdateLightingModeDto,
  ) {
    try {
      const userId = (req as any).user?.id;
      const result = await this.updateLightingModeUseCase.execute(id, userId, updateDto);

      if (result.isFailure) {
        const statusCode = result.error!.statusCode || 400;
        return res.status(statusCode).json({
          success: false,
          message: result.error!.message,
          error: result.error,
        });
      }

      const responseDto = LightingModeMapper.toResponseDto(result.value!);
      return res.status(200).json({
        success: true,
        message: 'Modo de iluminación actualizado exitosamente',
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

  @ApiOperation({ summary: 'Eliminar modo de iluminación' })
  @ApiParam({ name: 'id', description: 'ID del modo de iluminación' })
  @ApiOkResponse({ description: 'Modo de iluminación eliminado exitosamente' })
  @ApiNotFoundResponse({ description: 'Modo de iluminación no encontrado' })
  @ApiForbiddenResponse({ description: 'Acceso denegado o no se puede eliminar modo del sistema' })
  @ApiUnauthorizedResponse({ description: 'Usuario no autenticado' })
  @Delete(':id')
  async deleteLightingMode(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    try {
      const userId = (req as any).user?.id;
      const result = await this.deleteLightingModeUseCase.execute(id, userId);

      if (result.isFailure) {
        const statusCode = result.error!.statusCode || 400;
        return res.status(statusCode).json({
          success: false,
          message: result.error!.message,
          error: result.error,
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Modo de iluminación eliminado exitosamente',
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: { message: error.message },
      });
    }
  }

  @ApiOperation({ summary: 'Compartir modo de iluminación' })
  @ApiParam({ name: 'id', description: 'ID del modo de iluminación' })
  @ApiOkResponse({ description: 'Modo de iluminación compartido exitosamente' })
  @ApiNotFoundResponse({ description: 'Modo de iluminación no encontrado' })
  @ApiForbiddenResponse({ description: 'Acceso denegado o no se puede compartir modo del sistema' })
  @ApiBadRequestResponse({ description: 'Modo de iluminación ya compartido' })
  @ApiUnauthorizedResponse({ description: 'Usuario no autenticado' })
  @Post(':id/share')
  async shareLightingMode(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    try {
      const userId = (req as any).user?.id;
      const result = await this.shareLightingModeUseCase.execute(id, userId);

      if (result.isFailure) {
        const statusCode = result.error!.statusCode || 400;
        return res.status(statusCode).json({
          success: false,
          message: result.error!.message,
          error: result.error,
        });
      }

      const responseDto = LightingModeMapper.toShareResponseDto(result.value!.shareCode);
      return res.status(200).json({
        success: true,
        message: 'Modo de iluminación compartido exitosamente',
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

  @ApiOperation({ summary: 'Importar modo de iluminación compartido' })
  @ApiBody({ type: ImportSharedModeDto })
  @ApiCreatedResponse({ description: 'Modo de iluminación compartido importado exitosamente' })
  @ApiBadRequestResponse({ description: 'Código de compartir inválido o expirado' })
  @ApiUnauthorizedResponse({ description: 'Usuario no autenticado' })
  @Post('import')
  async importSharedLightingMode(
    @Req() req: Request,
    @Res() res: Response,
    @Body() importDto: ImportSharedModeDto,
  ) {
    try {
      const userId = (req as any).user?.id;
      const result = await this.importSharedLightingModeUseCase.execute(
        importDto.shareCode,
        userId,
      );

      if (result.isFailure) {
        const statusCode = result.error!.statusCode || 400;
        return res.status(statusCode).json({
          success: false,
          message: result.error!.message,
          error: result.error,
        });
      }

      const responseDto = LightingModeMapper.toResponseDto(result.value!);
      return res.status(201).json({
        success: true,
        message: 'Modo de iluminación compartido importado exitosamente',
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
}
