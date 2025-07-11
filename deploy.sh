#!/bin/bash

# Script helper para deployment con rutas dinámicas
# Este script detecta automáticamente la ruta del workspace

set -e

# Detectar la ruta actual del workspace
CURRENT_WORKSPACE=$(pwd)
echo "🔍 Detected workspace path: ${CURRENT_WORKSPACE}"

# Exportar la variable para docker-compose
export JENKINS_WORKSPACE_PATH="${CURRENT_WORKSPACE}"

# Función para deployment de staging
deploy_staging() {
    echo "🚀 Deploying to staging..."
    ls -al
    
    # Asegurar permisos del script de mosquitto
    echo "🔧 Setting up Mosquitto script permissions..."
    chmod +x mosquitto/init-mosquitto.sh 2>/dev/null || echo "⚠️ Could not set mosquitto script permissions"
    
    docker-compose -f docker-compose.yml down || true
    docker-compose -f docker-compose.yml up -d --build
    echo "✅ Staging deployment completed"
}

# Función para deployment de producción
deploy_production() {
    echo "🚀 Deploying to production..."
    
    # Verificar que existe el archivo .env
    if [ ! -f .env ]; then
        echo "❌ Error: .env file not found"
        exit 1
    fi
    
    # Asegurar permisos del script de mosquitto
    echo "🔧 Setting up Mosquitto script permissions..."
    chmod +x mosquitto/init-mosquitto.sh 2>/dev/null || echo "⚠️ Could not set mosquitto script permissions"
    
    docker-compose -f docker-compose.prod.yml down || true
    docker-compose --env-file .env -f docker-compose.prod.yml up -d --build
    echo "✅ Production deployment completed"
}

# Verificar argumentos
case "${1:-staging}" in
    "staging")
        deploy_staging
        ;;
    "production")
        deploy_production
        ;;
    *)
        echo "Usage: $0 [staging|production]"
        exit 1
        ;;
esac

# Health check
echo "⏳ Waiting for services to start..."
sleep 30

# Verificar que el servicio está funcionando
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Health check passed"
else
    echo "⚠️ Health check failed"
fi
