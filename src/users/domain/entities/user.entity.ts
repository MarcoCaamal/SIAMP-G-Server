export interface VerificationToken {
  token: string;
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
    public readonly updatedAt: Date
  ) {}

  static create(
    name: string,
    email: string,
    hashedPassword: string,
    timezone: string = 'UTC'
  ): User {
    const defaultNotificationPreferences: NotificationPreferences = {
      email: true,
      push: true,
      silentHours: {
        enabled: false,
        start: '22:00',
        end: '08:00'
      },
      eventTypes: {
        deviceConnection: true,
        deviceDisconnection: true,
        scheduledEvent: true,
        systemAlerts: true
      }
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
      new Date()
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
      new Date()
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
      new Date()
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
      new Date()
    );
  }

  setVerificationToken(token: string, expiresAt: Date): User {
    return new User(
      this.id,
      this.name,
      this.email,
      this.password,
      this.timezone,
      this.profilePicture,
      this.status,
      { token, expiresAt },
      this.failedLoginAttempts,
      this.lastLoginAt,
      this.lastLoginDevice,
      this.lastLoginLocation,
      this.notificationPreferences,
      this.accountType,
      this.createdAt,
      new Date()
    );
  }
}
