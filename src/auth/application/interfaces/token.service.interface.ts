export interface ITokenService {
  generateAccessToken(userId: string): string;
  generateRefreshToken(userId: string): string;
  generateVerificationToken(): string;
  validateAccessToken(token: string): { userId: string } | null;
  validateRefreshToken(token: string): { userId: string } | null;
}

export const TOKEN_SERVICE = Symbol('TOKEN_SERVICE');
