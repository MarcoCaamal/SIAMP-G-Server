export class GetUserProfileDto {
  userId: string;
}

export class UpdateUserProfileDto {
  name?: string;
  timezone?: string;
  profilePicture?: string;
}

export class UpdateNotificationPreferencesDto {
  email?: boolean;
  push?: boolean;
  silentHours?: {
    enabled?: boolean;
    start?: string;
    end?: string;
  };
  eventTypes?: {
    deviceConnection?: boolean;
    deviceDisconnection?: boolean;
    scheduledEvent?: boolean;
    systemAlerts?: boolean;
  };
}

export class ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}
