import { Body, Controller, Get, Put, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiBody, ApiOkResponse, ApiUnauthorizedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { GetUserProfileUseCase } from '../../application/use-cases/get-user-profile.use-case';
import { UpdateUserProfileUseCase } from '../../application/use-cases/update-user-profile.use-case';
import { UpdateNotificationPreferencesUseCase } from '../../application/use-cases/update-notification-preferences.use-case';
import { ChangePasswordUseCase } from '../../application/use-cases/change-password.use-case';
import { UpdateUserProfileDto, UpdateNotificationPreferencesDto, ChangePasswordDto } from '../../application/dto/get-user-profile.dto';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { UserErrors } from '../../domain/errors/user.errors';
import { UserSuccessResponse, UserErrorResponse } from '../../application/dto/user-swagger.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('api/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
    private readonly updateNotificationPreferencesUseCase: UpdateNotificationPreferencesUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
  ) { } 
  @ApiOperation({ summary: 'Obtener perfil del usuario actual' })
  @ApiOkResponse({
    description: 'Perfil de usuario obtenido exitosamente',
    type: UserSuccessResponse
  })
  @ApiUnauthorizedResponse({
    description: 'Usuario no autenticado',
    type: UserErrorResponse
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
    type: UserErrorResponse
  })
  @Get('profile')
  async getProfile(@Req() req: Request, @Res() res: Response) {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        _isSuccess: false,
        _error: UserErrors.UNAUTHORIZED,
      });
    }

    const result = await this.getUserProfileUseCase.execute(userId);

    return res.status(result.isSuccess ? 200 : (result.error?.statusCode || 500)).json(result);
  } 
  @ApiOperation({ summary: 'Actualizar información del perfil del usuario' })
  @ApiBody({ type: UpdateUserProfileDto })
  @ApiOkResponse({
    description: 'Perfil actualizado exitosamente',
    type: UserSuccessResponse
  })
  @ApiUnauthorizedResponse({
    description: 'Usuario no autenticado',
    type: UserErrorResponse
  })
  @ApiBadRequestResponse({
    description: 'Datos de perfil inválidos',
    type: UserErrorResponse
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
    type: UserErrorResponse
  })
  @Put('profile')
  async updateProfile(
    @Body() updateProfileDto: UpdateUserProfileDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        _isSuccess: false,
        _error: UserErrors.UNAUTHORIZED,
      });
    }

    const result = await this.updateUserProfileUseCase.execute(userId, updateProfileDto);

    // Agregar mensaje de éxito si la operación fue exitosa
    if (result.isSuccess) {
      return res.status(200).json(result);
    }

    return res.status(result.error?.statusCode || 500).json(result);
  } 
  @ApiOperation({ summary: 'Actualizar preferencias de notificaciones' })
  @ApiBody({ type: UpdateNotificationPreferencesDto })
  @ApiOkResponse({
    description: 'Preferencias de notificación actualizadas exitosamente',
    type: UserSuccessResponse
  })
  @ApiUnauthorizedResponse({
    description: 'Usuario no autenticado',
    type: UserErrorResponse
  })
  @ApiBadRequestResponse({
    description: 'Preferencias de notificación inválidas',
    type: UserErrorResponse
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
    type: UserErrorResponse
  })
  @Put('notifications')
  async updateNotificationPreferences(
    @Body() notificationDto: UpdateNotificationPreferencesDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        _isSuccess: false,
        _error: UserErrors.UNAUTHORIZED,
      });
    }

    const result = await this.updateNotificationPreferencesUseCase.execute(userId, notificationDto);

    // Agregar mensaje de éxito si la operación fue exitosa
    if (result.isSuccess) {
      return res.status(200).json(result);
    }

    return res.status(result.error?.statusCode || 500).json(result);
  } @ApiOperation({ summary: 'Cambiar contraseña del usuario' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiOkResponse({
    description: 'Contraseña cambiada exitosamente',
    type: UserSuccessResponse
  })
  @ApiUnauthorizedResponse({
    description: 'Usuario no autenticado',
    type: UserErrorResponse
  })
  @ApiBadRequestResponse({
    description: 'Contraseña actual incorrecta o nueva contraseña no cumple requisitos',
    type: UserErrorResponse
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
    type: UserErrorResponse
  })
  @Post('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        _isSuccess: false,
        _error: UserErrors.UNAUTHORIZED,
      });
    }

    const result = await this.changePasswordUseCase.execute(userId, changePasswordDto);

    return res.status(result.isSuccess ? 200 : (result.error?.statusCode || 500)).json(result);
  }
}
