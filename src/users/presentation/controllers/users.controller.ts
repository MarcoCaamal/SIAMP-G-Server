import { Body, Controller, Get, Put, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { GetUserProfileUseCase } from '../../application/use-cases/get-user-profile.use-case';
import { UpdateUserProfileUseCase } from '../../application/use-cases/update-user-profile.use-case';
import { UpdateNotificationPreferencesUseCase } from '../../application/use-cases/update-notification-preferences.use-case';
import { ChangePasswordUseCase } from '../../application/use-cases/change-password.use-case';
import { UpdateUserProfileDto, UpdateNotificationPreferencesDto, ChangePasswordDto } from '../../application/dto/get-user-profile.dto';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { UserErrors } from '../../domain/errors/user.errors';

@Controller('api/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
    private readonly updateNotificationPreferencesUseCase: UpdateNotificationPreferencesUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
  ) {}
  @Get('profile')
  async getProfile(@Req() req: Request, @Res() res: Response) {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({
        isSuccess: false,
        error: UserErrors.UNAUTHORIZED,
      });
    }

    const result = await this.getUserProfileUseCase.execute(userId);
    
    return res.status(result.isSuccess ? 200 : (result.error?.statusCode || 500)).json(result);
  }
  @Put('profile')
  async updateProfile(
    @Body() updateProfileDto: UpdateUserProfileDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({
        isSuccess: false,
        error: UserErrors.UNAUTHORIZED,
      });
    }

    const result = await this.updateUserProfileUseCase.execute(userId, updateProfileDto);
    
    // Agregar mensaje de éxito si la operación fue exitosa
    if (result.isSuccess) {
      return res.status(200).json(result);
    }
    
    return res.status(result.error?.statusCode || 500).json(result);
  }
  @Put('notifications')
  async updateNotificationPreferences(
    @Body() notificationDto: UpdateNotificationPreferencesDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({
        isSuccess: false,
        error: UserErrors.UNAUTHORIZED,
      });
    }

    const result = await this.updateNotificationPreferencesUseCase.execute(userId, notificationDto);
    
    // Agregar mensaje de éxito si la operación fue exitosa
    if (result.isSuccess) {
      return res.status(200).json(result);
    }
    
    return res.status(result.error?.statusCode || 500).json(result);
  }
  @Post('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({
        isSuccess: false,
        error: UserErrors.UNAUTHORIZED,
      });
    }

    const result = await this.changePasswordUseCase.execute(userId, changePasswordDto);
    
    return res.status(result.isSuccess ? 200 : (result.error?.statusCode || 500)).json(result);
  }
}
