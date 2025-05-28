import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { IJwtService, JWT_SERVICE } from '../../application/interfaces/jwt.service.interface';
import { IAuthRepository, AUTH_REPOSITORY } from '../../domain/repositories/auth.repository.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(JWT_SERVICE)
    private readonly jwtService: IJwtService,
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Access token is required');
    }

    try {
      const payload = await this.jwtService.verifyAccessToken(token);
      
      // Verify user still exists and is active
      const user = await this.authRepository.findUserById(payload.sub);
      if (!user || !user.isActive()) {
        throw new UnauthorizedException('User not found or inactive');
      }

      request.user = {
        id: payload.sub,
        email: payload.email
      };
      
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
