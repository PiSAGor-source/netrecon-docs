---
sidebar_position: 3
title: Configuración
description: Variables de entorno y referencia de configuración para NetRecon autoalojado
---

# Referencia de Configuración

Todos los servicios de NetRecon se configuran a través de un único archivo `.env` ubicado en `/opt/netrecon/.env`. Esta página documenta todas las variables de entorno disponibles.

## Configuración Principal

| Variable | Requerida | Predeterminado | Descripción |
|---|---|---|---|
| `NETRECON_DOMAIN` | Sí | — | Su nombre de dominio (ej., `netrecon.yourcompany.com`) |
| `NETRECON_EMAIL` | Sí | — | Correo de administrador para Let's Encrypt y notificaciones |

## Base de Datos (PostgreSQL)

| Variable | Requerida | Predeterminado | Descripción |
|---|---|---|---|
| `POSTGRES_USER` | Sí | — | Nombre de usuario de PostgreSQL |
| `POSTGRES_PASSWORD` | Sí | — | Contraseña de PostgreSQL |
| `POSTGRES_DB` | Sí | `netrecon` | Nombre de la base de datos |
| `DATABASE_URL` | Auto | — | Construida automáticamente a partir de los valores anteriores |

:::tip
Use una contraseña fuerte generada aleatoriamente. Genere una con:
```bash
openssl rand -base64 24
```
:::

## Caché (Redis)

| Variable | Requerida | Predeterminado | Descripción |
|---|---|---|---|
| `REDIS_PASSWORD` | Sí | — | Contraseña de autenticación de Redis |
| `REDIS_URL` | Auto | — | Construida automáticamente |

## Autenticación

| Variable | Requerida | Predeterminado | Descripción |
|---|---|---|---|
| `JWT_SECRET` | Sí | — | Clave secreta para firmar tokens JWT (mín. 32 caracteres) |
| `JWT_EXPIRE_MINUTES` | No | `1440` | Tiempo de expiración del token (predeterminado: 24 horas) |

Genere un secreto JWT seguro:
```bash
openssl rand -hex 32
```

## Registro de Agentes

| Variable | Requerida | Predeterminado | Descripción |
|---|---|---|---|
| `AGENT_REGISTRY_SECRET` | Sí | — | Secreto para la inscripción de agentes |
| `AGENT_JWT_SECRET` | Sí | — | Secreto JWT para autenticación de agentes |
| `AGENT_TOKEN_EXPIRE_MINUTES` | No | `1440` | Expiración del token del agente |
| `AGENT_HEARTBEAT_INTERVAL` | No | `30` | Intervalo de heartbeat en segundos |
| `AGENT_HEARTBEAT_TIMEOUT` | No | `90` | Segundos antes de marcar un agente como desconectado |

## Correo Electrónico (SMTP)

| Variable | Requerida | Predeterminado | Descripción |
|---|---|---|---|
| `SMTP_HOST` | Sí | — | Nombre de host del servidor SMTP |
| `SMTP_PORT` | No | `587` | Puerto SMTP (587 para STARTTLS, 465 para SSL) |
| `SMTP_USER` | Sí | — | Nombre de usuario SMTP |
| `SMTP_PASSWORD` | Sí | — | Contraseña SMTP |
| `SMTP_FROM` | Sí | — | Dirección del remitente (ej., `NetRecon <noreply@yourcompany.com>`) |

## Licencia

| Variable | Requerida | Predeterminado | Descripción |
|---|---|---|---|
| `LICENSE_KEY` | Sí | — | Su clave de licencia de NetRecon |

Contacte a [sales@netreconapp.com](mailto:sales@netreconapp.com) para obtener una clave de licencia.

## Servicio de Respaldos

| Variable | Requerida | Predeterminado | Descripción |
|---|---|---|---|
| `BACKUP_S3_ENDPOINT` | No | — | Endpoint de almacenamiento compatible con S3 |
| `BACKUP_S3_BUCKET` | No | — | Nombre del bucket para respaldos |
| `BACKUP_S3_ACCESS_KEY` | No | — | Clave de acceso S3 |
| `BACKUP_S3_SECRET_KEY` | No | — | Clave secreta S3 |
| `BACKUP_ENCRYPTION_KEY` | No | — | Clave de cifrado AES-256-GCM para respaldos |
| `BACKUP_RETENTION_DAYS` | No | `30` | Días de retención de archivos de respaldo |

## Notificaciones

| Variable | Requerida | Predeterminado | Descripción |
|---|---|---|---|
| `TELEGRAM_BOT_TOKEN` | No | — | Token del bot de Telegram para alertas |
| `TELEGRAM_CHAT_ID` | No | — | ID del chat de Telegram para entrega de alertas |

## Archivo `.env` de Ejemplo

```bash
# Principal
NETRECON_DOMAIN=netrecon.yourcompany.com
NETRECON_EMAIL=admin@yourcompany.com

# PostgreSQL
POSTGRES_USER=netrecon
POSTGRES_PASSWORD=xK9mP2vL8nQ4wR7j
POSTGRES_DB=netrecon

# Redis
REDIS_PASSWORD=hT6yN3bF9cM1pW5s

# Autenticación
JWT_SECRET=a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2

# Registro de Agentes
AGENT_REGISTRY_SECRET=r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3
AGENT_JWT_SECRET=h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9

# Correo Electrónico
SMTP_HOST=smtp.yourcompany.com
SMTP_PORT=587
SMTP_USER=noreply@yourcompany.com
SMTP_PASSWORD=su-contraseña-smtp
SMTP_FROM=NetRecon <noreply@yourcompany.com>

# Licencia
LICENSE_KEY=su-clave-de-licencia
```

:::warning
Nunca suba el archivo `.env` al control de versiones. Todos los valores mostrados arriba son ejemplos — reemplácelos con sus propios valores seguros antes del despliegue.
:::

## Aplicar Cambios de Configuración

Después de modificar el archivo `.env`, reinicie los servicios afectados:

```bash
cd /opt/netrecon

# Reiniciar todos los servicios
docker compose down && docker compose up -d

# O reiniciar un servicio específico
docker compose restart api-gateway
```

## Puertos de Servicios

Todos los servicios se ejecutan detrás del proxy inverso Nginx en los puertos 80/443. Los puertos internos de servicios no están expuestos por defecto:

| Servicio | Puerto Interno | Descripción |
|---|---|---|
| API Gateway | 8000 | Endpoint principal de API |
| Vault Server | 8001 | Gestión de secretos |
| License Server | 8002 | Validación de licencias |
| Email Service | 8003 | Relay SMTP |
| Notification Service | 8004 | Notificaciones push y alertas |
| Update Server | 8005 | Actualizaciones de agentes y sondas |
| Agent Registry | 8006 | Inscripción y gestión de agentes |
| Warranty Service | 8007 | Consultas de garantía de hardware |
| CMod Service | 8008 | Gestión de configuración |
| IPAM Service | 8009 | Gestión de direcciones IP |

Para exponer un puerto de servicio directamente (no recomendado para producción), agréguelo al mapeo de `ports` del servicio en `docker-compose.yml`.

Para ayuda, contacte a [support@netreconapp.com](mailto:support@netreconapp.com).
