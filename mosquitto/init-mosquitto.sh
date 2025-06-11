#!/bin/sh
# Script para inicializar Mosquitto con credenciales
# Este script se ejecuta cuando se inicia el contenedor

echo "Inicializando Mosquitto para SIAMP-G..."

# Crear directorios si no existen
mkdir -p /mosquitto/config
mkdir -p /mosquitto/data  
mkdir -p /mosquitto/log

# Crear archivo de contraseñas solo si no existe
if [ ! -f /mosquitto/config/passwd ]; then
    echo "Creando archivo de contraseñas..."
    touch /mosquitto/config/passwd
    
    # Crear usuarios con mosquitto_passwd
    mosquitto_passwd -b /mosquitto/config/passwd ${MQTT_USERNAME:-siamp_server} ${MQTT_PASSWORD:-mqtt_secure_pass}
    mosquitto_passwd -b /mosquitto/config/passwd siamp_device ${MQTT_PASSWORD:-mqtt_secure_pass}
    mosquitto_passwd -b /mosquitto/config/passwd siamp_mobile ${MQTT_PASSWORD:-mqtt_secure_pass}
    
    echo "Usuarios MQTT creados:"
    echo "- ${MQTT_USERNAME:-siamp_server} (Backend)"
    echo "- siamp_device (Dispositivos ESP32)"
    echo "- siamp_mobile (Aplicación móvil)"
else
    echo "Archivo de contraseñas ya existe, utilizando configuración existente"
fi

# Establecer permisos básicos
chmod 600 /mosquitto/config/passwd 2>/dev/null || true
chmod 755 /mosquitto/config 2>/dev/null || true
chmod 755 /mosquitto/data 2>/dev/null || true
chmod 755 /mosquitto/log 2>/dev/null || true

echo "Iniciando Mosquitto..."
exec mosquitto -c /mosquitto/config/mosquitto.conf
