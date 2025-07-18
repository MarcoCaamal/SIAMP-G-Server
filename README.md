# SIAMP-G-Server

Sistema de Identificación y Alerta Mediante Pulseras para Generar respuestas en tiempo real - Servidor Backend

## Configuración

### Variables de Entorno

Copia el archivo `.env.example` a `.env` y configura las siguientes variables:

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/siamp-auth

# JWT Configuration
JWT_ACCESS_SECRET=your-super-secret-access-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

# Frontend URL
FRONTEND_URL=http://localhost:3000

# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=SIAMP-G <your-email@gmail.com>

# Port
PORT=3000
```

### Configuración de Email SMTP

#### Gmail
1. Habilita la verificación en 2 pasos en tu cuenta de Gmail
2. Genera una contraseña de aplicación:
   - Ve a [Configuración de cuenta de Google](https://myaccount.google.com/security)
   - Busca "Contraseñas de aplicaciones"
   - Genera una nueva contraseña para "Correo"
3. Usa esta contraseña en la variable `SMTP_PASS`

#### Otros proveedores SMTP
- **Outlook/Hotmail**: `smtp-mail.outlook.com:587`
- **Yahoo**: `smtp.mail.yahoo.com:587`
- **Mailtrap** (para desarrollo): `smtp.mailtrap.io:2525`

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run start:dev
```

### Producción

```bash
npm run build
npm run start:prod
```

## Endpoints de Autenticación

- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/send-verification-code` - Reenvío de código de verificación
- `POST /api/auth/verify-email-code` - Verificación por código
- `POST /api/auth/verify-email-token` - Verificación por token
- `POST /api/auth/refresh` - Renovar token
- `POST /api/auth/logout` - Cerrar sesión

## Funcionalidades de Email

El servicio de email SMTP envía correos HTML profesionales para:

- ✅ **Códigos de verificación** (4 dígitos)
- ✅ **Enlaces de verificación** (tokens)
- ✅ **Restablecimiento de contraseña**
- ✅ **Emails de bienvenida**

### Características de los emails:
- Diseño responsive y profesional
- Branding personalizado (SIAMP-G)
- Códigos destacados visualmente
- Botones de acción claros
- Información de expiración
- Footer corporativo