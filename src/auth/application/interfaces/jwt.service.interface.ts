export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface IJwtService {
  generateTokens(payload: JwtPayload): Promise<TokenPair>;
  verifyAccessToken(token: string): Promise<JwtPayload>;
  verifyRefreshToken(token: string): Promise<JwtPayload>;
  generateAccessToken(payload: JwtPayload): Promise<string>;
  generateRefreshToken(payload: JwtPayload): Promise<string>;
}

export const JWT_SERVICE = Symbol('JWT_SERVICE');
