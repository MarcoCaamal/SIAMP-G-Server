import { SwaggerModule } from '@nestjs/swagger';
import * as DeviceResponseDtos from './application/dto/device-swagger-responses.dto';

export function setupDeviceSwaggerDocumentation(document) {
  // Registrar todas las clases de DTOs de respuesta de dispositivos
  document.definitions['DeviceData'] = 
    Reflect.getMetadata('swagger/apiModelProperties', DeviceResponseDtos.DeviceData.prototype);
  document.definitions['DeviceResponseValue'] = 
    Reflect.getMetadata('swagger/apiModelProperties', DeviceResponseDtos.DeviceResponseValue.prototype);
  document.definitions['DevicesListResponseValue'] = 
    Reflect.getMetadata('swagger/apiModelProperties', DeviceResponseDtos.DevicesListResponseValue.prototype);
  document.definitions['MessageResponseValue'] = 
    Reflect.getMetadata('swagger/apiModelProperties', DeviceResponseDtos.MessageResponseValue.prototype);
  document.definitions['SingleDeviceSuccessResponse'] = 
    Reflect.getMetadata('swagger/apiModelProperties', DeviceResponseDtos.SingleDeviceSuccessResponse.prototype);
  document.definitions['DeviceListSuccessResponse'] = 
    Reflect.getMetadata('swagger/apiModelProperties', DeviceResponseDtos.DeviceListSuccessResponse.prototype);
  document.definitions['MessageSuccessResponse'] = 
    Reflect.getMetadata('swagger/apiModelProperties', DeviceResponseDtos.MessageSuccessResponse.prototype);
}
