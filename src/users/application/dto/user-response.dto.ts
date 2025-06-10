export class UserProfileResponseDto {
  id: string;
  name: string;
  email: string;
  timezone: string;
  profilePicture: string;
  status: string;
  notificationPreferences: {
    email: boolean;
    push: boolean;
    silentHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
    eventTypes: {
      deviceConnection: boolean;
      deviceDisconnection: boolean;
      scheduledEvent: boolean;
      systemAlerts: boolean;
    };
  };
  accountType: string;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt?: Date;

  constructor(
    id: string,
    name: string,
    email: string,
    timezone: string,
    profilePicture: string,
    status: string,
    notificationPreferences: any,
    accountType: string,
    lastLoginAt: Date | null,
    createdAt: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.timezone = timezone;
    this.profilePicture = profilePicture;
    this.status = status;
    this.notificationPreferences = notificationPreferences;
    this.accountType = accountType;
    this.lastLoginAt = lastLoginAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export class NotificationPreferencesResponseDto {
  email: boolean;
  push: boolean;
  silentHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  eventTypes: {
    deviceConnection: boolean;
    deviceDisconnection: boolean;
    scheduledEvent: boolean;
    systemAlerts: boolean;
  };

  constructor(preferences: any) {
    this.email = preferences.email;
    this.push = preferences.push;
    this.silentHours = preferences.silentHours;
    this.eventTypes = preferences.eventTypes;
  }
}

export class ChangePasswordResponseDto {
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}
