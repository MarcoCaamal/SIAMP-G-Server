import { Body, Controller, Post, Ip, Headers } from '@nestjs/common';
import { RegisterUseCase } from '../../application/use-cases/register.use-case';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { RefreshTokenUseCase } from '../../application/use-cases/refresh-token.use-case';
import { VerifyEmailUseCase } from '../../application/use-cases/verify-email.use-case';
import { VerifyEmailByCodeUseCase } from '../../application/use-cases/verify-email-by-code.use-case';
import { VerifyEmailByTokenUseCase } from '../../application/use-cases/verify-email-by-token.use-case';
import { SendVerificationTokenUseCase } from '../../application/use-cases/send-verification-token.use-case';
import { SendVerificationCodeUseCase } from '../../application/use-cases/send-verification-code.use-case';
import { LogoutUseCase } from '../../application/use-cases/logout.use-case';
import { RegisterDto } from '../../application/dto/register.dto';
import { LoginDto } from '../../application/dto/login.dto';
import { RefreshTokenDto } from '../../application/dto/refresh-token.dto';
import { VerifyEmailDto } from '../../application/dto/verify-email.dto';
import { VerifyEmailByCodeDto } from '../../application/dto/verify-email-by-code.dto';
import { VerifyEmailByTokenDto } from '../../application/dto/verify-email-by-token.dto';
import { SendVerificationTokenDto } from '../../application/dto/send-verification-token.dto';
import { SendVerificationCodeDto } from '../../application/dto/send-verification-code.dto';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
    private readonly verifyEmailByCodeUseCase: VerifyEmailByCodeUseCase,
    private readonly verifyEmailByTokenUseCase: VerifyEmailByTokenUseCase,
    private readonly sendVerificationTokenUseCase: SendVerificationTokenUseCase,
    private readonly sendVerificationCodeUseCase: SendVerificationCodeUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.registerUseCase.execute(registerDto);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string = '',
  ) {
    return this.loginUseCase.execute(loginDto, ip, userAgent);
  }

  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.refreshTokenUseCase.execute(refreshTokenDto);
  }
  @Post('verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.verifyEmailUseCase.execute(verifyEmailDto);
  }

  @Post('verify-email-code')
  async verifyEmailByCode(@Body() verifyEmailDto: VerifyEmailByCodeDto) {
    return this.verifyEmailByCodeUseCase.execute(verifyEmailDto);
  }

  @Post('verify-email-token')
  async verifyEmailByToken(@Body() verifyEmailDto: VerifyEmailByTokenDto) {
    return this.verifyEmailByTokenUseCase.execute(verifyEmailDto);
  }

  @Post('send-verification-token')
  async sendVerificationToken(@Body() sendVerificationTokenDto: SendVerificationTokenDto) {
    return this.sendVerificationTokenUseCase.execute(sendVerificationTokenDto.email);
  }

  @Post('send-verification-code')
  async sendVerificationCode(@Body() sendVerificationCodeDto: SendVerificationCodeDto) {
    return this.sendVerificationCodeUseCase.execute(sendVerificationCodeDto);
  }

  @Post('logout')
  async logout(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.logoutUseCase.execute(refreshTokenDto.refreshToken);
  }
}
