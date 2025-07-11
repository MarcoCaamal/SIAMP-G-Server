import { Injectable, Inject, OnModuleInit, Logger } from '@nestjs/common';
import { ControlDeviceDto, DeviceStatusDto } from '../../application/dto/device-request.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { DEVICE_REPOSITORY, IDeviceRepository } from '../../domain/repositories/device.repository.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MqttDeviceService implements OnModuleInit {
  private readonly logger = new Logger(MqttDeviceService.name);
  
  constructor(
    @Inject('MQTT_CLIENT') private readonly mqttClient: ClientProxy,
    private readonly configService: ConfigService,
    @Inject(DEVICE_REPOSITORY) private readonly deviceRepository: IDeviceRepository
  ) {}
  async onModuleInit() {
    try {
      // Publish server status when connected
      await this.mqttClient.connect();
      this.logger.log('MQTT client connected successfully');      // Publish online status
      await lastValueFrom(this.mqttClient.emit(
        'siamp-g/client/status', 
        JSON.stringify({
          status: 'online',
          timestamp: new Date().toISOString()
        })
      ));
      
      // Check if client exists before setting up event handlers
      const client = (this.mqttClient as any).client;
      if (client) {
        // Setup event handlers for reconnection
        client.on('connect', () => {
          this.logger.log('MQTT client reconnected');
        });
        
        client.on('error', (err) => {
          this.logger.error(`MQTT client error: ${err.message}`);
        });
      } else {
        this.logger.warn('MQTT client not available for event setup');
      }
      
      // Configurar suscripciones
      await this.setupDeviceSubscriptions();
    } catch (error) {
      this.logger.error('Failed to connect MQTT client', error);
    }
  }  
  async sendPairingCommand(deviceId: string, userId: string): Promise<boolean> {
    try {
      const topic = `siamp-g/${deviceId}/command`;
      const payload = {
        action: 'pair',
        userId,
        timestamp: new Date().toISOString(),
      };

      // Publicar al broker MQTT usando el cliente NestJS
      await lastValueFrom(this.mqttClient.emit(topic, JSON.stringify(payload)));
      console.log(`[MQTT] Published pairing command to ${topic}:`, payload);
      
      return true;
    } catch (error) {
      console.error('Error sending pairing command:', error);
      return false;
    }
  }
  async sendControlCommand(deviceId: string, command: ControlDeviceDto): Promise<boolean> {
    try {
      const topic = `siamp-g/${deviceId}/command`;
      const payload = {
        action: 'control',
        ...command,
        timestamp: new Date().toISOString(),
      };

      // Enviar comando de control
      await lastValueFrom(this.mqttClient.emit(topic, JSON.stringify(payload)));
      console.log(`[MQTT] Published control command to ${topic}:`, payload);

      return true;
    } catch (error) {
      console.error('Error sending control command:', error);
      return false;
    }
  }  
  async requestDeviceStatus(deviceId: string): Promise<boolean> {
    try {
      const topic = `siamp-g/${deviceId}/command`;
      const payload = {
        action: 'get_status',
        timestamp: new Date().toISOString(),
      };

      // Enviar solicitud de estado
      await lastValueFrom(this.mqttClient.emit(topic, JSON.stringify(payload)));
      console.log(`[MQTT] Published status request to ${topic}:`, payload);

      return true;
    } catch (error) {
      console.error('Error requesting device status:', error);
      return false;
    }
  }  
  async sendUnpairCommand(deviceId: string): Promise<boolean> {
    try {
      const topic = `siamp-g/${deviceId}/command`;
      const payload = {
        action: 'unpair',
        timestamp: new Date().toISOString(),
      };

      // Enviar comando de desvinculación
      await lastValueFrom(this.mqttClient.emit(topic, JSON.stringify(payload)));
      console.log(`[MQTT] Published unpair command to ${topic}:`, payload);

      return true;
    } catch (error) {
      console.error('Error sending unpair command:', error);
      return false;
    }
  }  // Agregar método para enviar comandos adicionales
  async sendCustomCommand(deviceId: string, action: string, data: any = {}): Promise<boolean> {
    try {
      const topic = `siamp-g/${deviceId}/command`;
      const payload = {
        action,
        ...data,
        timestamp: new Date().toISOString(),
      };

      await lastValueFrom(this.mqttClient.emit(topic, JSON.stringify(payload)));
      console.log(`[MQTT] Published custom command to ${topic}:`, payload);

      return true;
    } catch (error) {
      console.error(`Error sending custom command ${action}:`, error);
      return false;
    }
  }// En NestJS, la suscripción a tópicos MQTT se maneja típicamente con un controlador de eventos
  // Esta funcionalidad debe implementarse en un módulo separado usando @MessagePattern
  // Por ahora, implementaremos un método para configurar eventos en onModuleInit
  
  // Nota: Para implementar suscripciones MQTT en NestJS correctamente, necesitas:
  // 1. Crear un controlador MQTT separado con decoradores @EventPattern
  // 2. O configurar un handler específico en el módulo principal
  
  async setupDeviceSubscriptions(): Promise<void> {
    console.log('[MQTT] Setting up global subscription for device events');
    
    // En una implementación completa, deberías registrar manejadores de eventos para los tópicos MQTT
    // Por ejemplo, usando un MqttController con @EventPattern('siamp-g/+/state')
    
    // Para propósitos de logging:
    console.log('[MQTT] Device subscriptions should be handled by MQTT controller with @EventPattern decorators');
    console.log('[MQTT] Example: @EventPattern("siamp-g/+/state") handleDeviceState(data: any, @Payload() payload, @Ctx() context: MqttContext)');
  }
  
  // Método para simular la recepción de un mensaje (solo para pruebas)
  // En una implementación real, esto sería manejado por el controlador MQTT
  simulateMessageReceived(topic: string, message: any): void {
    try {
      console.log(`[MQTT] Simulating message received on topic ${topic}:`, message);
      
      // Extraer deviceId del tópico (formato: siamp-g/{deviceId}/state)
      const parts = topic.split('/');
      if (parts.length >= 3) {
        const deviceId = parts[1];
        const messageType = parts[2];
        
        if (messageType === 'state') {
          this.handleDeviceStatusUpdate(deviceId, message);
        }
      }
    } catch (error) {
      console.error('Error handling simulated message:', error);
    }
  }

  // Métodos para manejar respuestas de dispositivos
  async handleDeviceStatusUpdate(deviceId: string, statusDto: DeviceStatusDto): Promise<void> {
    try {
      this.logger.log(`Processing device ${deviceId} status update: ${JSON.stringify(statusDto)}`);
      
      // Verificar si el dispositivo existe
      const device = await this.deviceRepository.findByDeviceId(deviceId);
      
      if (!device) {
        this.logger.warn(`Received status update for unknown device: ${deviceId}`);
        return;
      }
      
      // Actualizar el dispositivo con el nuevo estado
      if (statusDto.currentState !== undefined) {
        if (statusDto.currentState === 'on') {
          device.turnOn();
        } else {
          device.turnOff();
        }
      }
      
      if (statusDto.brightness !== undefined) {
        device.setBrightness(statusDto.brightness);
      }
      
      if (statusDto.color?.mode === 'rgb' && statusDto.color?.rgb) {
        const { r, g, b } = statusDto.color.rgb;
        device.setRgbColor(r, g, b);
      } else if (statusDto.color?.mode === 'temperature' && statusDto.color?.temperature) {
        device.setTemperature(statusDto.color.temperature);
      }
      
      // Actualizar estado de conexión
      device.setConnectionStatus(true);
      
      // Guardar los cambios en la base de datos
      await this.deviceRepository.update(device);
      this.logger.log(`Updated status for device ${deviceId}`);
      
      // Actualizar flag 'online'
      await this.deviceRepository.updateOnlineStatus(deviceId, true);
    } catch (error) {
      this.logger.error(`Error handling device status update: ${error.message}`, error.stack);
    }
  }

  async handleDeviceHeartbeat(deviceId: string, data: any): Promise<void> {
    try {
      this.logger.log(`Device ${deviceId} heartbeat received: ${JSON.stringify(data)}`);
      
      // Verificar si el dispositivo existe
      const device = await this.deviceRepository.findByDeviceId(deviceId);
      
      if (!device) {
        this.logger.warn(`Received heartbeat for unknown device: ${deviceId}`);
        return;
      }
      
      // Extraer información adicional del heartbeat si está disponible
      if (data.firmwareVersion) {
        device.updateFirmwareVersion(data.firmwareVersion);
      }
      
      // Actualizar estado de conexión para reflejar que el dispositivo está conectado
      device.setConnectionStatus(true);
      
      // Guardar los cambios en la base de datos
      await this.deviceRepository.update(device);
      
      // Actualizar flag 'online'
      await this.deviceRepository.updateOnlineStatus(deviceId, true);
      this.logger.log(`Device ${deviceId} heartbeat processed, device is online`);
    } catch (error) {
      this.logger.error(`Error handling device heartbeat: ${error.message}`, error.stack);
    }
  }
}
