import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices/enums/transport.enum';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Crear una aplicación HTTP primero
  const app = await NestFactory.create(AppModule);

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
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Configurar microservicio MQTT
  app.connectMicroservice({
    transport: Transport.MQTT,
    options: {
      url: process.env.MQTT_URL,
      clientId: process.env.MQTT_CLIENT_ID,
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
      clean: true,
      reconnectPeriod: 1000,
    },
  });

  // Iniciar todos los microservicios
  await app.startAllMicroservices();
  console.log('MQTT microservice started successfully');
  
  // Iniciar el servidor HTTP
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`HTTP API is running on: http://localhost:${port}`);
  console.log(`API documentation available at: http://localhost:${port}/api`);
}

bootstrap().catch(err => {
  console.error('Error al iniciar la aplicación:', err);
});