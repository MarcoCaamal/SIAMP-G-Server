# Configuración MQTT para SIAMP-G

## Eclipse Mosquitto en Docker

Este proyecto incluye Eclipse Mosquitto como broker MQTT para la comunicación entre el backend, los dispositivos ESP32 y la aplicación móvil.

## Estructura de Archivos

```
mosquitto/
├── config/
│   ├── mosquitto.conf      # Configuración principal
│   └── passwd              # Archivo de contraseñas (generado automáticamente)
├── data/                   # Datos persistentes del broker
├── log/                    # Logs del broker
└── init-mosquitto.sh       # Script de inicialización
```

## Configuración

### Variables de Entorno

```env
MQTT_HOST=localhost          # Host del broker MQTT
MQTT_PORT=1883              # Puerto MQTT estándar
MQTT_WS_PORT=9001           # Puerto WebSocket para clientes web
MQTT_USERNAME=siamp_server  # Usuario del backend
MQTT_PASSWORD=your_password # Contraseña segura
MQTT_CLIENT_ID=siamp_backend # ID del cliente backend
```

### Usuarios Predefinidos

El script de inicialización crea automáticamente tres usuarios:

1. **siamp_server** - Backend NestJS
2. **siamp_device** - Dispositivos ESP32
3. **siamp_mobile** - Aplicación móvil

Todos usan la misma contraseña definida en `MQTT_PASSWORD`.

## Uso

### Iniciar el Broker

```bash
# Iniciar todos los servicios
docker-compose up -d

# Solo el broker MQTT
docker-compose up -d mosquitto
```

### Verificar Funcionamiento

```bash
# Ver logs del broker
docker-compose logs mosquitto

# Probar conexión con mosquitto_pub/sub
mosquitto_pub -h localhost -p 1883 \
  -u siamp_server -P your_password \
  -t "test/topic" -m "Hello MQTT"

mosquitto_sub -h localhost -p 1883 \
  -u siamp_server -P your_password \
  -t "test/topic"
```

### WebSocket

Para clientes web, usar:
- **Host**: localhost
- **Puerto**: 9001
- **Protocolo**: WebSocket (ws://)

## Tópicos SIAMP-G

### Estructura de Tópicos

```
siamp/
├── devices/
│   └── {deviceId}/
│       ├── pair                 # Emparejamiento
│       ├── control              # Control de dispositivo
│       ├── status/
│       │   ├── request         # Solicitar estado
│       │   └── update          # Actualizar estado
│       ├── heartbeat           # Latido de vida
│       └── unpair              # Desemparejamiento
└── system/
    ├── discovery               # Descubrimiento de dispositivos
    └── broadcast              # Mensajes del sistema
```

### Ejemplos de Mensajes

#### Control de Dispositivo
```json
// Tópico: siamp/devices/SIAMP_ABC123/control
{
  "user_id": "user_123",
  "command": "set_lighting",
  "parameters": {
    "brightness": 80,
    "color": {"r": 255, "g": 128, "b": 0},
    "temperature": 4000
  }
}
```

#### Respuesta del Dispositivo
```json
// Tópico: siamp/devices/SIAMP_ABC123/control/response
{
  "device_id": "SIAMP_ABC123",
  "success": true,
  "timestamp": 1640995200,
  "current_state": {
    "brightness": 80,
    "color": {"r": 255, "g": 128, "b": 0},
    "power": true
  }
}
```

## Monitoreo

### Logs

```bash
# Ver logs en tiempo real
docker-compose logs -f mosquitto

# Logs específicos de conexión
tail -f mosquitto/log/mosquitto.log | grep "New connection"
```

### Métricas

- **Puerto 1883**: MQTT estándar
- **Puerto 9001**: WebSocket
- **Persistencia**: Habilitada en `/mosquitto/data`
- **Max conexiones**: Ilimitadas
- **Keep alive**: 60 segundos

## Seguridad

### Configuración Actual

- ✅ Autenticación requerida (no anónimo)
- ✅ Usuarios con contraseña
- ✅ Logs de conexión activados
- ⏳ TLS/SSL (planeado para producción)

### Producción

Para producción, considerar:

1. **TLS/SSL**: Habilitar encriptación
2. **ACLs**: Control de acceso por tópico
3. **Certificados**: Usar certificados válidos
4. **Firewall**: Restringir acceso por IP

## Troubleshooting

### Problemas Comunes

#### Error de Conexión
```bash
# Verificar que el contenedor esté ejecutándose
docker-compose ps mosquitto

# Verificar puertos
netstat -an | grep :1883
```

#### Error de Autenticación
```bash
# Verificar usuarios en el archivo de contraseñas
docker-compose exec mosquitto cat /mosquitto/config/passwd
```

#### Problemas de Permisos
```bash
# Recrear contenedor
docker-compose down mosquitto
docker-compose up -d mosquitto
```

### Comandos Útiles

```bash
# Reiniciar solo Mosquitto
docker-compose restart mosquitto

# Ver configuración activa
docker-compose exec mosquitto cat /mosquitto/config/mosquitto.conf

# Monitorear tráfico
mosquitto_sub -h localhost -p 1883 \
  -u siamp_server -P your_password \
  -t "siamp/+/+/+" -v
```

## Integración con Backend

El backend NestJS se conecta automáticamente al broker usando las variables de entorno. El servicio `MqttDeviceService` maneja:

- Conexión automática al broker
- Suscripción a tópicos de dispositivos
- Publicación de comandos
- Manejo de respuestas y eventos

Para más detalles, ver la documentación del backend SIAMP-G.
