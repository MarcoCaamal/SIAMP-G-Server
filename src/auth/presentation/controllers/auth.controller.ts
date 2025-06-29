import { Body, Controller, Post, Ip, Headers, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiUnauthorizedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { Response } from 'express';
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
import { AuthSuccessResponse, AuthErrorResponse } from '../../application/dto/auth-response.dto';

@ApiTags('Authentication')
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

  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({
    description: 'Usuario registrado exitosamente',
    type: AuthSuccessResponse
  })
  @ApiBadRequestResponse({
    description: 'Datos de entrada inválidos o el usuario ya existe',
    type: AuthErrorResponse
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
    type: AuthErrorResponse
  })
  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    const result = await this.registerUseCase.execute(registerDto)
    
    return res.status(result.isSuccess ? 201 : (result.error?.statusCode || 500)).json(result)
  }

  @ApiOperation({ summary: 'Iniciar sesión con email y contraseña' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: 'Usuario ha iniciado sesión exitosamente',
    type: AuthSuccessResponse
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciales inválidas',
    type: AuthErrorResponse
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
    type: AuthErrorResponse
  })
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string = '',
    @Res() res: Response,
  ) {
    const result = await this.loginUseCase.execute(loginDto, ip, userAgent)

    return res.status(result.isSuccess ? 200 : (result.error?.statusCode || 500)).json(result)
  }
  
  @ApiOperation({ summary: 'Actualizar token de acceso usando refresh token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({
    description: 'Token actualizado exitosamente',
    type: AuthSuccessResponse
  })
  @ApiUnauthorizedResponse({
    description: 'Token de actualización inválido o expirado',
    type: AuthErrorResponse
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
    type: AuthErrorResponse
  })
  @Post('refresh')
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res() res: Response,
  ) {
    const result = await this.refreshTokenUseCase.execute(refreshTokenDto)

    return res.status(result.isSuccess ? 200 : (result.error?.statusCode || 500)).json(result)
  }

  @ApiOperation({ summary: 'Verificar email del usuario' })
  @ApiBody({ type: VerifyEmailDto })
  @ApiOkResponse({
    description: 'Email verificado exitosamente',
    type: AuthSuccessResponse
  })
  @ApiBadRequestResponse({
    description: 'Datos de verificación inválidos',
    type: AuthErrorResponse
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
    type: AuthErrorResponse
  })
  @Post('verify-email')
  async verifyEmail(
    @Body() verifyEmailDto: VerifyEmailDto,
    @Res() res: Response,
  ) {
    const result = await this.verifyEmailUseCase.execute(verifyEmailDto)

    return res.status(result.isSuccess ? 200 : (result.error?.statusCode || 500)).json(result)
  }

  @ApiOperation({ summary: 'Verificar email usando código numérico' })
  @ApiBody({ type: VerifyEmailByCodeDto })
  @ApiOkResponse({
    description: 'Email verificado exitosamente con código',
    type: AuthSuccessResponse
  })
  @ApiBadRequestResponse({
    description: 'Código de verificación inválido o expirado',
    type: AuthErrorResponse
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
    type: AuthErrorResponse
  })
  @Post('verify-email-code')
  async verifyEmailByCode(
    @Body() verifyEmailDto: VerifyEmailByCodeDto,
    @Res() res: Response,
  ) {
    const result = await this.verifyEmailByCodeUseCase.execute(verifyEmailDto)

    return res.status(result.isSuccess ? 200 : (result.error?.statusCode || 500)).json(result)
  }

  @ApiOperation({ summary: 'Verificar email usando token' })
  @ApiBody({ type: VerifyEmailByTokenDto })
  @ApiOkResponse({
    description: 'Email verificado exitosamente con token',
    type: AuthSuccessResponse
  })
  @ApiUnauthorizedResponse({
    description: 'Token de verificación inválido o expirado',
    type: AuthErrorResponse
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
    type: AuthErrorResponse
  })
  @Post('verify-email-token')
  async verifyEmailByToken(
    @Body() verifyEmailDto: VerifyEmailByTokenDto,
    @Res() res: Response,
  ) {
    const result = await this.verifyEmailByTokenUseCase.execute(verifyEmailDto)

    return res.status(result.isSuccess ? 200 : (result.error?.statusCode || 500)).json(result)
  }

  @ApiOperation({ summary: 'Enviar token de verificación al email del usuario' })
  @ApiBody({ type: SendVerificationTokenDto })
  @ApiOkResponse({
    description: 'Token de verificación enviado correctamente',
    type: AuthSuccessResponse
  })
  @ApiBadRequestResponse({
    description: 'Email inválido o no encontrado',
    type: AuthErrorResponse
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
    type: AuthErrorResponse
  })
  @Post('send-verification-token')
  async sendVerificationToken(
    @Body() sendVerificationTokenDto: SendVerificationTokenDto,
    @Res() res: Response,
  ) {
    const result = await this.sendVerificationTokenUseCase.execute(
      sendVerificationTokenDto.email,
    )

    return res.status(result.isSuccess ? 200 : (result.error?.statusCode || 500)).json(result)
  }

  @ApiOperation({ summary: 'Enviar código de verificación al email del usuario' })
  @ApiBody({ type: SendVerificationCodeDto })
  @ApiOkResponse({
    description: 'Código de verificación enviado correctamente',
    type: AuthSuccessResponse
  })
  @ApiBadRequestResponse({
    description: 'Email inválido o no encontrado',
    type: AuthErrorResponse
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
    type: AuthErrorResponse
  })
  @Post('send-verification-code')
  async sendVerificationCode(
    @Body() sendVerificationCodeDto: SendVerificationCodeDto,
    @Res() res: Response,
  ) {
    const result = await this.sendVerificationCodeUseCase.execute(
      sendVerificationCodeDto
    )

    return res.status(result.isSuccess ? 200 : (result.error?.statusCode || 500)).json(result);
  }

  @ApiOperation({ summary: 'Cerrar sesión del usuario' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({
    description: 'Sesión cerrada exitosamente',
    type: AuthSuccessResponse
  })
  @ApiUnauthorizedResponse({
    description: 'Token de actualización inválido o expirado',
    type: AuthErrorResponse
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
    type: AuthErrorResponse
  })
  @Post('logout')
  async logout(@Body() refreshTokenDto: RefreshTokenDto, @Res() res: Response) {
    const result = await this.logoutUseCase.execute(
      refreshTokenDto.refreshToken,
    );

    return res.status(result.isSuccess ? 200 : (result.error?.statusCode || 500)).json(result);
  }
}
