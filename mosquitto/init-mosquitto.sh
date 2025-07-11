#!/bin/sh
# Script para inicializar Mosquitto con credenciales
# Este script se ejecuta cuando se inicia el contenedor

set -e  # Salir si hay errores

echo "🚀 Inicializando Mosquitto para SIAMP-G..."

# Verificar que mosquitto_passwd esté disponible
if ! command -v mosquitto_passwd >/dev/null 2>&1; then
    echo "❌ mosquitto_passwd no encontrado, iniciando Mosquitto sin autenticación..."
    exec mosquitto -c /mosquitto/config/mosquitto.conf
fi

# Crear directorios si no existen
echo "📁 Creando directorios necesarios..."
mkdir -p /mosquitto/config
mkdir -p /mosquitto/data  
mkdir -p /mosquitto/log

# Verificar si el archivo de configuración existe
if [ ! -f /mosquitto/config/mosquitto.conf ]; then
    echo "⚠️ Archivo de configuración no encontrado, creando uno básico..."
    cat > /mosquitto/config/mosquitto.conf << 'EOF'
# Configuración básica de Mosquitto
listener 1883
allow_anonymous false
password_file /mosquitto/config/passwd

# WebSocket listener (opcional)
listener 9001
protocol websockets
allow_anonymous false

# Logging
log_dest file /mosquitto/log/mosquitto.log
log_dest stdout
log_type error
log_type warning
log_type notice
log_type information

# Persistence
persistence true
persistence_location /mosquitto/data/
EOF
fi

# Crear archivo de contraseñas solo si no existe
if [ ! -f /mosquitto/config/passwd ]; then
    echo "🔐 Creando archivo de contraseñas..."
    touch /mosquitto/config/passwd
    
    # Crear usuarios con mosquitto_passwd
    echo "👤 Creando usuarios MQTT..."
    mosquitto_passwd -b /mosquitto/config/passwd ${MQTT_USERNAME:-siamp_server} ${MQTT_PASSWORD:-mqtt_secure_pass}
    mosquitto_passwd -b /mosquitto/config/passwd siamp_device ${MQTT_PASSWORD:-mqtt_secure_pass}
    mosquitto_passwd -b /mosquitto/config/passwd siamp_mobile ${MQTT_PASSWORD:-mqtt_secure_pass}
    
    echo "✅ Usuarios MQTT creados:"
    echo "  - ${MQTT_USERNAME:-siamp_server} (Backend)"
    echo "  - siamp_device (Dispositivos ESP32)"
    echo "  - siamp_mobile (Aplicación móvil)"
else
    echo "✅ Archivo de contraseñas ya existe, utilizando configuración existente"
fi

# Establecer permisos correctos
echo "🔧 Estableciendo permisos..."
chmod 600 /mosquitto/config/passwd 2>/dev/null || echo "⚠️ No se pudieron establecer permisos para passwd"
chmod 755 /mosquitto/config 2>/dev/null || echo "⚠️ No se pudieron establecer permisos para config"
chmod 755 /mosquitto/data 2>/dev/null || echo "⚠️ No se pudieron establecer permisos para data"
chmod 755 /mosquitto/log 2>/dev/null || echo "⚠️ No se pudieron establecer permisos para log"

# Verificar configuración antes de iniciar
echo "🔍 Verificando configuración..."
if [ -f /mosquitto/config/mosquitto.conf ]; then
    echo "✅ Archivo de configuración encontrado"
else
    echo "❌ Archivo de configuración no encontrado"
    exit 1
fi

echo "🎯 Iniciando Mosquitto..."
exec mosquitto -c /mosquitto/config/mosquitto.conf
