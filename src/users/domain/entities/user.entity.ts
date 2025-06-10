export interface VerificationToken {
  token: string; // Can be token or code
  expiresAt: Date;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  silentHours: {
    enabled: boolean;
    start: string; // "HH:MM"
    end: string; // "HH:MM"
  };
  eventTypes: {
    deviceConnection: boolean;
    deviceDisconnection: boolean;
    scheduledEvent: boolean;
    systemAlerts: boolean;
  };
}

export type UserStatus = 'pending' | 'active' | 'blocked';
export type AccountType = 'free' | 'premium';

export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly timezone: string,
    public readonly profilePicture: string,
    public readonly status: UserStatus,
    public readonly verificationToken: VerificationToken | null,
    public readonly failedLoginAttempts: number,
    public readonly lastLoginAt: Date | null,
    public readonly lastLoginDevice: string | null,
    public readonly lastLoginLocation: string | null,
    public readonly notificationPreferences: NotificationPreferences,
    public readonly accountType: AccountType,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(
    name: string,
    email: string,
    hashedPassword: string,
    timezone: string = 'UTC',
  ): User {
    const defaultNotificationPreferences: NotificationPreferences = {
      email: true,
      push: true,
      silentHours: {
        enabled: false,
        start: '22:00',
        end: '08:00',
      },
      eventTypes: {
        deviceConnection: true,
        deviceDisconnection: true,
        scheduledEvent: true,
        systemAlerts: true,
      },
    };

    return new User(
      '', // Will be set by repository
      name,
      email,
      hashedPassword,
      timezone,
      '',
      'pending',
      null,
      0,
      null,
      null,
      null,
      defaultNotificationPreferences,
      'free',
      new Date(),
      new Date(),
    );
  }

  isActive(): boolean {
    return this.status === 'active';
  }

  isBlocked(): boolean {
    return this.status === 'blocked';
  }

  isPending(): boolean {
    return this.status === 'pending';
  }

  canLogin(): boolean {
    return this.isActive() && this.failedLoginAttempts < 5;
  }

  updateLoginAttempts(attempts: number): User {
    return new User(
      this.id,
      this.name,
      this.email,
      this.password,
      this.timezone,
      this.profilePicture,
      this.status,
      this.verificationToken,
      attempts,
      this.lastLoginAt,
      this.lastLoginDevice,
      this.lastLoginLocation,
      this.notificationPreferences,
      this.accountType,
      this.createdAt,
      new Date(),
    );
  }

  updateLastLogin(device?: string, location?: string): User {
    return new User(
      this.id,
      this.name,
      this.email,
      this.password,
      this.timezone,
      this.profilePicture,
      this.status,
      this.verificationToken,
      0, // Reset failed attempts on successful login
      new Date(),
      device || this.lastLoginDevice,
      location || this.lastLoginLocation,
      this.notificationPreferences,
      this.accountType,
      this.createdAt,
      new Date(),
    );
  }

  activate(): User {
    return new User(
      this.id,
      this.name,
      this.email,
      this.password,
      this.timezone,
      this.profilePicture,
      'active',
      null, // Clear verification token
      this.failedLoginAttempts,
      this.lastLoginAt,
      this.lastLoginDevice,
      this.lastLoginLocation,
      this.notificationPreferences,
      this.accountType,
      this.createdAt,
      new Date(),
    );
  }
  setVerificationToken(tokenOrCode: string, expiresAt: Date): User {
    return new User(
      this.id,
      this.name,
      this.email,
      this.password,
      this.timezone,
      this.profilePicture,
      this.status,
      { token: tokenOrCode, expiresAt },
      this.failedLoginAttempts,
      this.lastLoginAt,
      this.lastLoginDevice,
      this.lastLoginLocation,
      this.notificationPreferences,
      this.accountType,
      this.createdAt,
      new Date(),
    );
  }

  updateProfile(name?: string, timezone?: string, profilePicture?: string): User {
    return new User(
      this.id,
      name !== undefined ? name : this.name,
      this.email,
      this.password,
      timezone !== undefined ? timezone : this.timezone,
      profilePicture !== undefined ? profilePicture : this.profilePicture,
      this.status,
      this.verificationToken,
      this.failedLoginAttempts,
      this.lastLoginAt,
      this.lastLoginDevice,
      this.lastLoginLocation,
      this.notificationPreferences,
      this.accountType,
      this.createdAt,
      new Date(),
    );
  }

  updateNotificationPreferences(preferences: {
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
  }): User {
    const updatedPreferences: NotificationPreferences = {
      email: preferences.email !== undefined ? preferences.email : this.notificationPreferences.email,
      push: preferences.push !== undefined ? preferences.push : this.notificationPreferences.push,
      silentHours: {
        enabled: preferences.silentHours?.enabled !== undefined 
          ? preferences.silentHours.enabled 
          : this.notificationPreferences.silentHours.enabled,
        start: preferences.silentHours?.start !== undefined 
          ? preferences.silentHours.start 
          : this.notificationPreferences.silentHours.start,
        end: preferences.silentHours?.end !== undefined 
          ? preferences.silentHours.end 
          : this.notificationPreferences.silentHours.end,
      },
      eventTypes: {
        deviceConnection: preferences.eventTypes?.deviceConnection !== undefined 
          ? preferences.eventTypes.deviceConnection 
          : this.notificationPreferences.eventTypes.deviceConnection,
        deviceDisconnection: preferences.eventTypes?.deviceDisconnection !== undefined 
          ? preferences.eventTypes.deviceDisconnection 
          : this.notificationPreferences.eventTypes.deviceDisconnection,
        scheduledEvent: preferences.eventTypes?.scheduledEvent !== undefined 
          ? preferences.eventTypes.scheduledEvent 
          : this.notificationPreferences.eventTypes.scheduledEvent,
        systemAlerts: preferences.eventTypes?.systemAlerts !== undefined 
          ? preferences.eventTypes.systemAlerts 
          : this.notificationPreferences.eventTypes.systemAlerts,
      },
    };

    return new User(
      this.id,
      this.name,
      this.email,
      this.password,
      this.timezone,
      this.profilePicture,
      this.status,
      this.verificationToken,
      this.failedLoginAttempts,
      this.lastLoginAt,
      this.lastLoginDevice,
      this.lastLoginLocation,
      updatedPreferences,
      this.accountType,
      this.createdAt,
      new Date(),
    );
  }

  updatePassword(newHashedPassword: string): User {
    return new User(
      this.id,
      this.name,
      this.email,
      newHashedPassword,
      this.timezone,
      this.profilePicture,
      this.status,
      this.verificationToken,
      0, // Reset failed attempts after password change
      this.lastLoginAt,
      this.lastLoginDevice,
      this.lastLoginLocation,
      this.notificationPreferences,
      this.accountType,
      this.createdAt,
      new Date(),
    );
  }
}
