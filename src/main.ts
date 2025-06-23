import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices/enums/transport.enum';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { 
  DeviceSuccessResponse, 
  DeviceErrorResponse, 
  DeviceData, 
  DeviceResponseValue, 
  DevicesListResponseValue, 
  MessageResponseValue,
  SingleDeviceSuccessResponse,
  DeviceListSuccessResponse,
  MessageSuccessResponse
} from './devices/application/dto/device-swagger-responses.dto';

async function bootstrap() {
  console.log('Iniciando aplicación SIAMP-G...');
  
  // Crear una aplicación HTTP primero
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'], // Habilitar todos los niveles de log
  });

  // Habilitar CORS para solicitudes desde el frontend
  app.enableCors();
  
  // Configurar validación global
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true
  }));
  
  // Configurar Swagger para documentación de API
  const config = new DocumentBuilder()
    .setTitle('SIAMP-G API')
    .setDescription('API para el sistema SIAMP-G')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [
      DeviceData,
      DeviceResponseValue,
      DevicesListResponseValue,
      MessageResponseValue,
      DeviceSuccessResponse,
      DeviceErrorResponse,
      SingleDeviceSuccessResponse,
      DeviceListSuccessResponse,
      MessageSuccessResponse
    ]
  });
  SwaggerModule.setup('api', app, document);

  // Configurar microservicio MQTT
  console.log('Configurando microservicio MQTT...');
  app.connectMicroservice({
    transport: Transport.MQTT,
    options: {
      url: process.env.MQTT_URL,
      clientId: `${process.env.MQTT_CLIENT_ID}_server`,
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
      clean: true,
      reconnectPeriod: 1000,
      rejectUnauthorized: false, // Agregar para ignorar problemas de certificados SSL
      will: {
        topic: 'siamp-g/server/status',
        payload: JSON.stringify({ status: 'offline', timestamp: new Date().toISOString() }),
        qos: 1,
        retain: true,
      },
    },
  });

  try {
    // Iniciar todos los microservicios
    console.log('Iniciando microservicios...');
    await app.startAllMicroservices();
    console.log('MQTT microservice started successfully');
    
    // Iniciar el servidor HTTP
    console.log('Iniciando servidor HTTP...');
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`HTTP API is running on: http://localhost:${port}`);
    console.log(`API documentation available at: http://localhost:${port}/api`);
  } catch (error) {
    console.error('Error al iniciar servicios:', error);
    throw error;
  }
}

bootstrap().catch(err => {
  console.error('Error al iniciar la aplicación:', err);
  process.exit(1); // Terminar el proceso con código de error
});