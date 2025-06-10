import { Inject, Injectable } from '@nestjs/common';
import { Result } from '../../../shared/result/result';
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { UpdateNotificationPreferencesDto } from '../dto/get-user-profile.dto';
import { UserErrors } from '../../domain/errors/user.errors';
import { NotificationPreferencesResponseDto } from '../dto/user-response.dto';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UpdateNotificationPreferencesUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string, preferences: UpdateNotificationPreferencesDto): Promise<Result<NotificationPreferencesResponseDto>> {
    try {
      const user = await this.userRepository.findById(userId);
      
      if (!user) {
        return Result.fail(UserErrors.USER_NOT_FOUND);
      }

      // Validaciones básicas
      if (preferences.silentHours?.start && preferences.silentHours?.end) {
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(preferences.silentHours.start) || !timeRegex.test(preferences.silentHours.end)) {
          return Result.fail(UserErrors.INVALID_NOTIFICATION_PREFERENCES);
        }
      }      const updatedUser = user.updateNotificationPreferences(preferences);
      const savedUser = await this.userRepository.update(updatedUser);
      
      const notificationPreferencesDto = UserMapper.toNotificationPreferencesResponse(savedUser);
      return Result.ok(notificationPreferencesDto);
    } catch (error) {
      return Result.fail(UserErrors.internalError('Error al actualizar las preferencias de notificación'));
    }
  }
}
