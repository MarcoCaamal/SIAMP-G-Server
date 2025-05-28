export class LoginAttempt {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly success: boolean,
    public readonly ipAddress: string,
    public readonly userAgent: string,
    public readonly timestamp: Date,
    public readonly failureReason?: string
  ) {}

  static success(
    userId: string,
    email: string,
    ipAddress: string,
    userAgent: string
  ): LoginAttempt {
    return new LoginAttempt(
      userId,
      email,
      true,
      ipAddress,
      userAgent,
      new Date()
    );
  }

  static failure(
    userId: string,
    email: string,
    ipAddress: string,
    userAgent: string,
    reason: string
  ): LoginAttempt {
    return new LoginAttempt(
      userId,
      email,
      false,
      ipAddress,
      userAgent,
      new Date(),
      reason
    );
  }
}
