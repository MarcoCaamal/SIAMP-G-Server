import { Controller, Get, Post, Put, Delete, Body, Param, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiOkResponse, ApiCreatedResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiInternalServerErrorResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { PairDeviceUseCase } from '../../application/use-cases/pair-device.use-case';
import { GetUserDevicesUseCase } from '../../application/use-cases/get-user-devices.use-case';
import { GetDeviceByIdUseCase } from '../../application/use-cases/get-device-by-id.use-case';
import { ControlDeviceUseCase } from '../../application/use-cases/control-device.use-case';
import { UpdateDeviceUseCase } from '../../application/use-cases/update-device.use-case';
import { UnpairDeviceUseCase } from '../../application/use-cases/unpair-device.use-case';
import { PairDeviceDto } from '../../application/dto/device-request.dto';
import { UpdateDeviceDto, ControlDeviceDto } from '../../application/dto/device-swagger.dto';
import { DeviceErrors } from '../../domain/errors/device.errors';
import { DeviceSuccessResponse, DeviceErrorResponse, SingleDeviceSuccessResponse, DeviceListSuccessResponse, MessageSuccessResponse } from '../../application/dto/device-swagger-responses.dto';

@ApiTags('Devices')
@ApiBearerAuth()
@Controller('api/devices')
@UseGuards(JwtAuthGuard)
export class DevicesController {
  constructor(
    private readonly pairDeviceUseCase: PairDeviceUseCase,
    private readonly getUserDevicesUseCase: GetUserDevicesUseCase,
    private readonly getDeviceByIdUseCase: GetDeviceByIdUseCase,
    private readonly controlDeviceUseCase: ControlDeviceUseCase,
    private readonly updateDeviceUseCase: UpdateDeviceUseCase,
    private readonly unpairDeviceUseCase: UnpairDeviceUseCase,
  ) { }

  @ApiOperation({ summary: 'Emparejar un nuevo dispositivo con el usuario actual' })
  @ApiBody({ type: PairDeviceDto })
  @ApiCreatedResponse({
    description: 'Dispositivo emparejado exitosamente',
    type: SingleDeviceSuccessResponse
  })
  @ApiBadRequestResponse({
    description: 'Datos de entrada inválidos o error de emparejamiento',
    type: DeviceErrorResponse
  })
  @ApiUnauthorizedResponse({
    description: 'No autorizado - se requiere autenticación',
    type: DeviceErrorResponse
  })
  @ApiForbiddenResponse({
    description: 'Acceso prohibido - no tiene permisos para esta acción',
    type: DeviceErrorResponse
  })
  @ApiInternalServerErrorResponse({
    description: 'Error interno del servidor',
    type: DeviceErrorResponse
  })
  @Post('pair')
  async pairDevice(@Req() req: Request, @Res() res: Response, @Body() dto: PairDeviceDto) {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        _isSuccess: false,
        _error: DeviceErrors.UNAUTHORIZED_DEVICE_ACCESS,
      });
    }

    const result = await this.pairDeviceUseCase.execute(userId, dto);

    return res.status(result.isSuccess ? 201 : (result.error?.statusCode || 500)).json(result);
  }

  @ApiOperation({ summary: 'Obtener todos los dispositivos del usuario' })
  @ApiOkResponse({
    description: 'Lista de dispositivos recuperada exitosamente',
    type: DeviceListSuccessResponse
  })
  @ApiUnauthorizedResponse({
    description: 'No autorizado - se requiere autenticación',
    type: DeviceErrorResponse
  })
  @ApiForbiddenResponse({
    description: 'Acceso prohibido - no tiene permisos para esta acción',
    type: DeviceErrorResponse
  })
  @ApiInternalServerErrorResponse({
    description: 'Error interno del servidor',
    type: DeviceErrorResponse
  })
  @Get()
  async getUserDevices(@Req() req: Request, @Res() res: Response) {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        _isSuccess: false,
        _error: DeviceErrors.UNAUTHORIZED_DEVICE_ACCESS,
      });
    }

    const result = await this.getUserDevicesUseCase.execute(userId);

    if (result.isSuccess) {
      return res.status(200).json({
        _isSuccess: true,
        _value: result.value,
      });
    } else {
      return res.status(result.error?.statusCode || 500).json({
        _isSuccess: false,
        _error: result.error,
      });
    }
  }
  @ApiOperation({ summary: 'Obtener detalles de un dispositivo específico' })
  @ApiParam({
    name: 'deviceId',
    description: 'ID único del dispositivo',
    required: true,
    type: String
  }) @ApiOkResponse({
    description: 'Dispositivo encontrado exitosamente',
    type: SingleDeviceSuccessResponse
  })
  @ApiUnauthorizedResponse({
    description: 'No autorizado - se requiere autenticación',
    type: DeviceErrorResponse
  })
  @ApiForbiddenResponse({
    description: 'Acceso prohibido - no tiene permisos para este dispositivo',
    type: DeviceErrorResponse
  })
  @ApiNotFoundResponse({
    description: 'Dispositivo no encontrado',
    type: DeviceErrorResponse
  })
  @ApiInternalServerErrorResponse({
    description: 'Error interno del servidor',
    type: DeviceErrorResponse
  })
  @Get(':deviceId')
  async getDeviceById(@Req() req: Request, @Res() res: Response, @Param('deviceId') deviceId: string) {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        _isSuccess: false,
        _error: DeviceErrors.UNAUTHORIZED_DEVICE_ACCESS,
      });
    }

    const result = await this.getDeviceByIdUseCase.execute(userId, deviceId);

    if (result.isSuccess) {
      return res.status(200).json({
        _isSuccess: true,
        _value: result.value,
      });
    } else {
      return res.status(result.error?.statusCode || 500).json({
        _isSuccess: false,
        _error: result.error,
      });
    }
  }
  @ApiOperation({ summary: 'Controlar un dispositivo (encendido/apagado/brillo/color)' })
  @ApiParam({
    name: 'deviceId',
    description: 'ID único del dispositivo a controlar',
    required: true,
    type: String
  })
  @ApiBody({ type: ControlDeviceDto }) @ApiOkResponse({
    description: 'Comando enviado exitosamente al dispositivo',
    type: SingleDeviceSuccessResponse
  })
  @ApiBadRequestResponse({
    description: 'Parámetros de control inválidos o dispositivo no conectado',
    type: DeviceErrorResponse
  })
  @ApiUnauthorizedResponse({
    description: 'No autorizado - se requiere autenticación',
    type: DeviceErrorResponse
  })
  @ApiForbiddenResponse({
    description: 'Acceso prohibido - no tiene permisos para este dispositivo',
    type: DeviceErrorResponse
  })
  @ApiNotFoundResponse({
    description: 'Dispositivo no encontrado',
    type: DeviceErrorResponse
  })
  @ApiInternalServerErrorResponse({
    description: 'Error interno del servidor o error de comunicación con el dispositivo',
    type: DeviceErrorResponse
  })
  @Post(':deviceId/control')
  async controlDevice(
    @Req() req: Request,
    @Res() res: Response,
    @Param('deviceId') deviceId: string,
    @Body() dto: ControlDeviceDto
  ) {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        _isSuccess: false,
        _error: DeviceErrors.UNAUTHORIZED_DEVICE_ACCESS,
      });
    }

    const result = await this.controlDeviceUseCase.execute(userId, deviceId, dto);

    if (result.isSuccess) {
      return res.status(200).json({
        _isSuccess: true,
        _value: result.value,
      });
    } else {
      return res.status(result.error?.statusCode || 500).json({
        _isSuccess: false,
        _error: result.error,
      });
    }
  }
  
  @ApiOperation({ summary: 'Actualizar información de un dispositivo' })
  @ApiParam({
    name: 'deviceId',
    description: 'ID único del dispositivo a actualizar',
    required: true,
    type: String
  })
  @ApiBody({ type: UpdateDeviceDto })
  @ApiOkResponse({
    description: 'Dispositivo actualizado exitosamente',
    type: SingleDeviceSuccessResponse
  })
  @ApiBadRequestResponse({
    description: 'Datos de actualización inválidos',
    type: DeviceErrorResponse
  })
  @ApiUnauthorizedResponse({
    description: 'No autorizado - se requiere autenticación',
    type: DeviceErrorResponse
  })
  @ApiForbiddenResponse({
    description: 'Acceso prohibido - no tiene permisos para este dispositivo',
    type: DeviceErrorResponse
  })
  @ApiNotFoundResponse({
    description: 'Dispositivo no encontrado',
    type: DeviceErrorResponse
  })
  @ApiInternalServerErrorResponse({
    description: 'Error interno del servidor',
    type: DeviceErrorResponse
  })
  @Put(':deviceId')
  async updateDevice(
    @Req() req: Request, 
    @Res() res: Response, 
    @Param('deviceId') deviceId: string, 
    @Body() dto: UpdateDeviceDto
  ) {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        _isSuccess: false,
        _error: DeviceErrors.UNAUTHORIZED_DEVICE_ACCESS,
      });
    }

    const result = await this.updateDeviceUseCase.execute(userId, deviceId, dto);

    if (result.isSuccess) {
      return res.status(200).json({
        _isSuccess: true,
        _value: result.value,
      });
    } else {
      return res.status(result.error?.statusCode || 500).json({
        _isSuccess: false,
        _error: result.error,
      });
    }
  }

  @ApiOperation({ summary: 'Desemparejar un dispositivo del usuario actual' })
  @ApiParam({
    name: 'deviceId',
    description: 'ID único del dispositivo a desemparejar',
    required: true,
    type: String
  })
  @ApiOkResponse({
    description: 'Dispositivo desemparejado exitosamente',
    type: MessageSuccessResponse
  })
  @ApiUnauthorizedResponse({
    description: 'No autorizado - se requiere autenticación',
    type: DeviceErrorResponse
  })
  @ApiForbiddenResponse({
    description: 'Acceso prohibido - no tiene permisos para este dispositivo',
    type: DeviceErrorResponse
  })
  @ApiNotFoundResponse({
    description: 'Dispositivo no encontrado',
    type: DeviceErrorResponse
  })
  @ApiInternalServerErrorResponse({
    description: 'Error interno del servidor',
    type: DeviceErrorResponse
  })
  @Delete(':deviceId')
  async unpairDevice(@Req() req: Request, @Res() res: Response, @Param('deviceId') deviceId: string) {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        _isSuccess: false,
        _error: DeviceErrors.UNAUTHORIZED_DEVICE_ACCESS,
      });
    }

    const result = await this.unpairDeviceUseCase.execute(userId, deviceId);

    if (result.isSuccess) {
      return res.status(200).json({
        _isSuccess: true,
        _value: { message: 'Device unpaired successfully' },
      });
    } else {
      return res.status(result.error?.statusCode || 500).json({
        _isSuccess: false,
        _error: result.error,
      });
    }
  }
}
