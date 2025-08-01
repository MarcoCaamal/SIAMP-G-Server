import { User } from '../../domain/entities/user.entity';
import { UserProfileResponseDto, NotificationPreferencesResponseDto } from '../dto/user-response.dto';

export class UserMapper {
  static toProfileResponse(user: User): UserProfileResponseDto {
    return new UserProfileResponseDto(
      user.id,
      user.name,
      user.firstLastName,
      user.secondLastName,
      user.email,
      user.timezone,
      user.profilePicture,
      user.status,
      user.notificationPreferences,
      user.accountType,
      user.lastLoginAt,
      user.createdAt,
      user.updatedAt,
    );
  }

  static toNotificationPreferencesResponse(user: User): NotificationPreferencesResponseDto {
    return new NotificationPreferencesResponseDto(user.notificationPreferences);
  }
}
