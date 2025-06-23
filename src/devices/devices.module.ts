import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceDocument, DeviceSchema } from './infrastructure/schemas/device.schema';
import { DeviceRepository } from './infrastructure/repositories/device.repository';
import { DEVICE_REPOSITORY } from './domain/repositories/device.repository.interface';

// Use Cases
import { PairDeviceUseCase } from './application/use-cases/pair-device.use-case';
import { GetUserDevicesUseCase } from './application/use-cases/get-user-devices.use-case';
import { GetDeviceByIdUseCase } from './application/use-cases/get-device-by-id.use-case';
import { ControlDeviceUseCase } from './application/use-cases/control-device.use-case';
import { UpdateDeviceUseCase } from './application/use-cases/update-device.use-case';
import { UnpairDeviceUseCase } from './application/use-cases/unpair-device.use-case';

// Services
import { MqttDeviceService } from './infrastructure/services/mqtt-device.service';

// Controllers
import { DevicesController } from './presentation/controllers/devices.controller';
import { MqttController } from './presentation/controllers/mqtt.controller';

// External modules
import { AuthModule } from '../auth/auth.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DeviceDocument.name, schema: DeviceSchema },
    ]),
    forwardRef(() => AuthModule),
    ClientsModule.registerAsync([
      {
        name: 'MQTT_CLIENT',
        imports: [ConfigModule],        useFactory: (configService: ConfigService) => ({
          transport: Transport.MQTT,
          options: {
            url: configService.get('MQTT_URL'),
            clientId: `${configService.get('MQTT_CLIENT_ID')}_client`,
            username: configService.get('MQTT_USERNAME'),
            password: configService.get('MQTT_PASSWORD'),
            host: 'mosquitto',
            clean: true,
            reconnectPeriod: 1000,
            will: {
              topic: 'siamp-g/client/status',
              payload: JSON.stringify({ status: 'offline', timestamp: new Date().toISOString() }),
              qos: 1,
              retain: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [DevicesController, MqttController],
  providers: [
    {
      provide: DEVICE_REPOSITORY,
      useClass: DeviceRepository,
    },
    PairDeviceUseCase,
    GetUserDevicesUseCase,
    GetDeviceByIdUseCase,
    ControlDeviceUseCase,
    UpdateDeviceUseCase,
    UnpairDeviceUseCase,
    MqttDeviceService,
  ],
  exports: [DEVICE_REPOSITORY, MqttDeviceService],
})
export class DevicesModule { }
