---
sidebar_position: 2
title: Autenticación
---

# Autenticación

NetRecon soporta dos métodos de autenticación: tokens JWT bearer y claves de API. Ambos métodos funcionan en todos los endpoints.

## Autenticación JWT

### Inicio de Sesión

```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@company.com",
  "password": "su-contraseña",
  "totp_code": "123456"  // opcional, requerido si 2FA está habilitado
}
```

Respuesta:
```json
{
  "access_token": "eyJhbGciOi...",
  "refresh_token": "eyJhbGciOi...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

### Usar el Token

Incluya el token en el encabezado `Authorization`:
```
Authorization: Bearer eyJhbGciOi...
```

### Renovar el Token

Los tokens expiran después de 1 hora. Use el token de renovación para obtener un nuevo token de acceso:

```
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOi..."
}
```

## Autenticación por Clave de API

Las claves de API son ideales para integraciones servidor a servidor, pipelines CI/CD y scripts de automatización.

### Crear una Clave de API

1. Vaya a **Configuración > Claves de API** en el dashboard
2. Haga clic en **Generar Clave**
3. Establezca un nombre, permisos y expiración opcional
4. Copie la clave inmediatamente — se muestra solo una vez

### Usar una Clave de API

Incluya la clave en el encabezado `X-API-Key`:
```
X-API-Key: nr_live_a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6
```

### Formato de Clave

Todas las claves de API siguen el formato: `nr_live_` seguido de 48 caracteres hexadecimales.

### Permisos

Cada clave de API tiene permisos granulares:

| Permiso | Descripción |
|---|---|
| `scans_read` | Leer resultados de escaneo |
| `scans_write` | Iniciar/detener escaneos |
| `devices_read` | Leer lista de dispositivos |
| `devices_write` | Modificar dispositivos |
| `alerts_read` | Leer alertas |
| `alerts_write` | Gestionar alertas |
| `reports_read` | Leer reportes |
| `reports_write` | Generar reportes |
| `users_manage` | Gestionar usuarios |
| `billing` | Acceso a facturación |
| `cve_read` | Leer datos CVE |
| `ids_read` | Leer alertas IDS |
| `backup_manage` | Gestionar respaldos |
| `api_keys_manage` | Gestionar claves de API |

### Revocar Claves

Revoque una clave en cualquier momento desde **Configuración > Claves de API** o vía la API:

```
DELETE /api/v1/api-keys/{key_id}
```

## OAuth2 (Enterprise)

Los inquilinos empresariales pueden configurar OAuth2/OIDC para integración SSO:

### Flujo de Código de Autorización

```
GET /api/v1/auth/oauth2/authorize?
  client_id=YOUR_CLIENT_ID&
  redirect_uri=https://your-app.com/callback&
  response_type=code&
  scope=scans_read devices_read&
  state=random_state_string
```

### Intercambio de Token

```
POST /api/v1/auth/oauth2/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
code=AUTH_CODE&
client_id=YOUR_CLIENT_ID&
client_secret=YOUR_CLIENT_SECRET&
redirect_uri=https://your-app.com/callback
```

## Mejores Prácticas de Seguridad

1. **Rote las claves regularmente** — establezca una fecha de expiración en las claves de producción
2. **Use privilegios mínimos** — solo asigne los permisos que su integración necesita
3. **Nunca incluya claves en el código** — use variables de entorno o gestores de secretos
4. **Monitoree el uso** — revise la columna "Último Uso" en el dashboard
5. **Habilite 2FA** — requerido para cuentas que gestionan claves de API
