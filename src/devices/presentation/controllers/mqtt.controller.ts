import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, MqttContext } from '@nestjs/microservices';
import { MqttDeviceService } from '../../infrastructure/services/mqtt-device.service';
import { DeviceStatusDto } from '../../application/dto/device-request.dto';
import { DEVICE_REPOSITORY, IDeviceRepository } from '../../domain/repositories/device.repository.interface';
import { Inject } from '@nestjs/common';

@Controller()
export class MqttController {
  private readonly logger = new Logger(MqttController.name);
  
  constructor(
    private readonly mqttDeviceService: MqttDeviceService,
    @Inject(DEVICE_REPOSITORY) private readonly deviceRepository: IDeviceRepository,
  ) {
    this.logger.log('MQTT Controller initialized');
  }
  @MessagePattern('siamp-g/+/state')
  async handleDeviceState(@Payload() payload: any, @Ctx() context: MqttContext) {
    try {
      // Extraer deviceId del tópico
      const topic = context.getTopic();
      const deviceId = topic.split('/')[1];
      
      this.logger.debug(`Received state update from device ${deviceId}`);
      
      // Convertir el payload a objeto si es string
      let data: DeviceStatusDto;
      if (typeof payload === 'string') {
        data = JSON.parse(payload);
      } else {
        data = payload;
      }
      
      // Procesar el mensaje
      await this.mqttDeviceService.handleDeviceStatusUpdate(deviceId, data);
    } catch (error) {
      this.logger.error('Error handling device state message', error);
    }
  }  
  @MessagePattern('siamp-g/+/heartbeat')
  async handleDeviceHeartbeat(@Payload() payload: any, @Ctx() context: MqttContext) {
    try {
      const topic = context.getTopic();
      const deviceId = topic.split('/')[1];
      
      this.logger.debug(`Received heartbeat from device ${deviceId}`);
      
      // Convertir el payload a objeto si es string
      let data: any;
      if (typeof payload === 'string') {
        data = JSON.parse(payload);
      } else {
        data = payload;
      }
      
      // Procesar el heartbeat en el servicio
      await this.mqttDeviceService.handleDeviceHeartbeat(deviceId, data);
      
      try {
        // Actualizar el estado "online" del dispositivo en la base de datos
        await this.deviceRepository.updateOnlineStatus(deviceId, true);
      } catch (repoError) {
        this.logger.error(`Error updating device online status: ${repoError.message}`);
      }
    } catch (error) {
      this.logger.error('Error handling device heartbeat message', error);
    }
  }
}
