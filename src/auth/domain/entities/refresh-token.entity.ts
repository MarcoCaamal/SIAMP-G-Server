export class RefreshToken {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly token: string,
    public readonly expiresAt: Date,
    public readonly isRevoked: boolean,
    public readonly createdAt: Date,
  ) {}

  static create(userId: string, token: string, expiresAt: Date): RefreshToken {
    return new RefreshToken(
      '', // Will be set by repository
      userId,
      token,
      expiresAt,
      false,
      new Date(),
    );
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  isValid(): boolean {
    return !this.isRevoked && !this.isExpired();
  }

  revoke(): RefreshToken {
    return new RefreshToken(
      this.id,
      this.userId,
      this.token,
      this.expiresAt,
      true,
      this.createdAt,
    );
  }
}
