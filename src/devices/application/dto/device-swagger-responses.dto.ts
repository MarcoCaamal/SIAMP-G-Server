import { ApiProperty } from '@nestjs/swagger';

/**
 * Clase para representar un dispositivo en respuestas
 */
export class DeviceData {
  @ApiProperty({
    description: 'ID único del dispositivo en la base de datos',
    example: '60d5f8b8b612d532a483c567'
  })
  id: string;

  @ApiProperty({
    description: 'ID único del dispositivo físico',
    example: 'D123456789'
  })
  deviceId: string;

  @ApiProperty({
    description: 'Nombre amigable para el dispositivo',
    example: 'Lámpara de sala'
  })
  name: string;

  @ApiProperty({
    description: 'Tipo de dispositivo',
    example: 'light'
  })
  type: string;

  @ApiProperty({
    description: 'Modelo del dispositivo',
    example: 'SIAMP-L1'
  })
  model: string;

  @ApiProperty({
    description: 'ID del usuario propietario',
    example: '60d5f8b8b612d532a483c123'
  })
  userId: string;

  @ApiProperty({
    description: 'Versión del firmware del dispositivo',
    example: '1.2.3',
    nullable: true
  })
  firmwareVersion: string | null;

  @ApiProperty({
    description: 'Tipo de hábitat o habitación donde está el dispositivo',
    example: 'sala',
    nullable: true
  })
  habitatType: string | null;

  @ApiProperty({
    description: 'Estado actual del dispositivo',
    example: {
      isConnected: true,
      currentState: 'on',
      brightness: 75,
      color: {
        mode: 'rgb',
        rgb: {
          r: 255,
          g: 100,
          b: 50
        }
      }
    }
  })
  status: {
    isConnected: boolean;
    currentState: 'on' | 'off';
    brightness: number;
    color?: {
      mode: 'rgb' | 'temperature';
      rgb?: {
        r: number;
        g: number;
        b: number;
      };
      temperature?: number;
    };
  };

  @ApiProperty({
    description: 'Fecha de creación del registro',
    example: '2025-06-18T10:30:00.000Z'
  })
  createdAt: string;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2025-06-18T10:30:00.000Z'
  })
  updatedAt: string;
}

/**
 * Clase para respuestas exitosas de un solo dispositivo
 */
export class DeviceResponseValue {
  @ApiProperty({
    description: 'Datos del dispositivo',
    type: DeviceData
  })
  device: DeviceData;
}

/**
 * Clase para respuestas exitosas de múltiples dispositivos
 */
export class DevicesListResponseValue {
  @ApiProperty({
    description: 'Lista de dispositivos del usuario',
    type: [DeviceData]
  })
  devices: DeviceData[];
}

/**
 * Clase para respuestas de mensaje simple
 */
export class MessageResponseValue {
  @ApiProperty({
    description: 'Mensaje descriptivo de la operación',
    example: 'Device unpaired successfully'
  })
  message: string;
}

/**
 * Clase para respuestas exitosas
 */
export class DeviceSuccessResponse {
  @ApiProperty({
    description: 'Indica si la operación fue exitosa',
    example: true
  })
  _isSuccess: boolean;  @ApiProperty({
    description: 'Datos de la respuesta exitosa'
  })
  _value: any;
}

/**
 * Clase para errores específicos de dispositivos
 */
export class DeviceErrorData {
  @ApiProperty({
    description: 'Código interno del error',
    example: 'DEVICE_001',
    enum: [
      'DEVICE_001', // Dispositivo no encontrado
      'DEVICE_002', // Dispositivo ya emparejado
      'DEVICE_003', // Dispositivo no conectado
      'DEVICE_004', // Comando inválido
      'DEVICE_005', // Error de comunicación
      'DEVICE_006', // Acceso no autorizado
      'DEVICE_007', // Error de emparejamiento
      'DEVICE_008', // Valor de brillo inválido
    ]
  })
  code: string;

  @ApiProperty({
    description: 'Mensaje de error',
    example: 'Device not found'
  })
  message: string;

  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 404
  })
  statusCode: number;
}

/**
 * Clase para respuestas de error
 */
export class DeviceErrorResponse {
  @ApiProperty({
    description: 'Indica si la operación falló',
    example: false
  })
  _isSuccess: boolean;
  
  @ApiProperty({
    description: 'Detalles del error',
    type: DeviceErrorData
  })
  _error: DeviceErrorData;
}

/**
 * Clase para respuestas exitosas con un solo dispositivo
 */
export class SingleDeviceSuccessResponse {
  @ApiProperty({
    description: 'Indica si la operación fue exitosa',
    example: true
  })
  _isSuccess: boolean;

  @ApiProperty({
    description: 'Datos del dispositivo',
    type: DeviceResponseValue
  })
  _value: DeviceResponseValue;
}

/**
 * Clase para respuestas exitosas con lista de dispositivos
 */
export class DeviceListSuccessResponse {
  @ApiProperty({
    description: 'Indica si la operación fue exitosa',
    example: true
  })
  _isSuccess: boolean;

  @ApiProperty({
    description: 'Lista de dispositivos',
    type: DevicesListResponseValue
  })
  _value: DevicesListResponseValue;
}

/**
 * Clase para respuestas exitosas con mensaje simple
 */
export class MessageSuccessResponse {
  @ApiProperty({
    description: 'Indica si la operación fue exitosa',
    example: true
  })
  _isSuccess: boolean;

  @ApiProperty({
    description: 'Mensaje descriptivo',
    type: MessageResponseValue
  })
  _value: MessageResponseValue;
}
