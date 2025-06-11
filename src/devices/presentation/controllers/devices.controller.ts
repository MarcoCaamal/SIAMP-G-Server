import { Controller, Get, Post, Put, Delete, Body, Param, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { PairDeviceUseCase } from '../../application/use-cases/pair-device.use-case';
import { GetUserDevicesUseCase } from '../../application/use-cases/get-user-devices.use-case';
import { GetDeviceByIdUseCase } from '../../application/use-cases/get-device-by-id.use-case';
import { ControlDeviceUseCase } from '../../application/use-cases/control-device.use-case';
import { UpdateDeviceUseCase } from '../../application/use-cases/update-device.use-case';
import { UnpairDeviceUseCase } from '../../application/use-cases/unpair-device.use-case';
import { PairDeviceDto, UpdateDeviceDto, ControlDeviceDto } from '../../application/dto/device-request.dto';
import { DeviceErrors } from '../../domain/errors/device.errors';

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
  ) {}

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
    
    if (result.isSuccess) {
      return res.status(201).json({
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

  @Post(':deviceId/control')
  async controlDevice(@Req() req: Request, @Res() res: Response, @Param('deviceId') deviceId: string, @Body() dto: ControlDeviceDto) {
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

  @Put(':deviceId')
  async updateDevice(@Req() req: Request, @Res() res: Response, @Param('deviceId') deviceId: string, @Body() dto: UpdateDeviceDto) {
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
