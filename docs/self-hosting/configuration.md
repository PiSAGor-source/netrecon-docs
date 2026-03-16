---
sidebar_position: 3
title: Configuration
description: Environment variables and configuration reference for self-hosted NetRecon
---

# Configuration Reference

All NetRecon services are configured through a single `.env` file located at `/opt/netrecon/.env`. This page documents every available environment variable.

## Core Settings

| Variable | Required | Default | Description |
|---|---|---|---|
| `NETRECON_DOMAIN` | Yes | — | Your domain name (e.g., `netrecon.yourcompany.com`) |
| `NETRECON_EMAIL` | Yes | — | Admin email for Let's Encrypt and notifications |

## Database (PostgreSQL)

| Variable | Required | Default | Description |
|---|---|---|---|
| `POSTGRES_USER` | Yes | — | PostgreSQL username |
| `POSTGRES_PASSWORD` | Yes | — | PostgreSQL password |
| `POSTGRES_DB` | Yes | `netrecon` | Database name |
| `DATABASE_URL` | Auto | — | Constructed automatically from the above values |

:::tip
Use a strong, randomly generated password. Generate one with:
```bash
openssl rand -base64 24
```
:::

## Cache (Redis)

| Variable | Required | Default | Description |
|---|---|---|---|
| `REDIS_PASSWORD` | Yes | — | Redis authentication password |
| `REDIS_URL` | Auto | — | Constructed automatically |

## Authentication

| Variable | Required | Default | Description |
|---|---|---|---|
| `JWT_SECRET` | Yes | — | Secret key for signing JWT tokens (min 32 chars) |
| `JWT_EXPIRE_MINUTES` | No | `1440` | Token expiration time (default: 24 hours) |

Generate a secure JWT secret:
```bash
openssl rand -hex 32
```

## Agent Registry

| Variable | Required | Default | Description |
|---|---|---|---|
| `AGENT_REGISTRY_SECRET` | Yes | — | Secret for agent enrollment |
| `AGENT_JWT_SECRET` | Yes | — | JWT secret for agent authentication |
| `AGENT_TOKEN_EXPIRE_MINUTES` | No | `1440` | Agent token expiration |
| `AGENT_HEARTBEAT_INTERVAL` | No | `30` | Heartbeat interval in seconds |
| `AGENT_HEARTBEAT_TIMEOUT` | No | `90` | Seconds before marking agent offline |

## Email (SMTP)

| Variable | Required | Default | Description |
|---|---|---|---|
| `SMTP_HOST` | Yes | — | SMTP server hostname |
| `SMTP_PORT` | No | `587` | SMTP port (587 for STARTTLS, 465 for SSL) |
| `SMTP_USER` | Yes | — | SMTP username |
| `SMTP_PASSWORD` | Yes | — | SMTP password |
| `SMTP_FROM` | Yes | — | Sender address (e.g., `NetRecon <noreply@yourcompany.com>`) |

## License

| Variable | Required | Default | Description |
|---|---|---|---|
| `LICENSE_KEY` | Yes | — | Your NetRecon license key |

Contact [sales@netreconapp.com](mailto:sales@netreconapp.com) to obtain a license key.

## Backup Service

| Variable | Required | Default | Description |
|---|---|---|---|
| `BACKUP_S3_ENDPOINT` | No | — | S3-compatible storage endpoint |
| `BACKUP_S3_BUCKET` | No | — | Bucket name for backups |
| `BACKUP_S3_ACCESS_KEY` | No | — | S3 access key |
| `BACKUP_S3_SECRET_KEY` | No | — | S3 secret key |
| `BACKUP_ENCRYPTION_KEY` | No | — | AES-256-GCM encryption key for backups |
| `BACKUP_RETENTION_DAYS` | No | `30` | Days to retain backup files |

## Notifications

| Variable | Required | Default | Description |
|---|---|---|---|
| `TELEGRAM_BOT_TOKEN` | No | — | Telegram bot token for alerts |
| `TELEGRAM_CHAT_ID` | No | — | Telegram chat ID for alert delivery |

## Example `.env` File

```bash
# Core
NETRECON_DOMAIN=netrecon.yourcompany.com
NETRECON_EMAIL=admin@yourcompany.com

# PostgreSQL
POSTGRES_USER=netrecon
POSTGRES_PASSWORD=xK9mP2vL8nQ4wR7j
POSTGRES_DB=netrecon

# Redis
REDIS_PASSWORD=hT6yN3bF9cM1pW5s

# Authentication
JWT_SECRET=a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2

# Agent Registry
AGENT_REGISTRY_SECRET=r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3
AGENT_JWT_SECRET=h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9

# Email
SMTP_HOST=smtp.yourcompany.com
SMTP_PORT=587
SMTP_USER=noreply@yourcompany.com
SMTP_PASSWORD=your-smtp-password
SMTP_FROM=NetRecon <noreply@yourcompany.com>

# License
LICENSE_KEY=your-license-key
```

:::warning
Never commit the `.env` file to version control. All values shown above are examples — replace them with your own secure values before deploying.
:::

## Applying Configuration Changes

After modifying the `.env` file, restart the affected services:

```bash
cd /opt/netrecon

# Restart all services
docker compose down && docker compose up -d

# Or restart a specific service
docker compose restart api-gateway
```

## Service Ports

All services run behind the Nginx reverse proxy on ports 80/443. Internal service ports are not exposed by default:

| Service | Internal Port | Description |
|---|---|---|
| API Gateway | 8000 | Main API endpoint |
| Vault Server | 8001 | Secrets management |
| License Server | 8002 | License validation |
| Email Service | 8003 | SMTP relay |
| Notification Service | 8004 | Push notifications and alerts |
| Update Server | 8005 | Agent and probe updates |
| Agent Registry | 8006 | Agent enrollment and management |
| Warranty Service | 8007 | Hardware warranty lookups |
| CMod Service | 8008 | Configuration management |
| IPAM Service | 8009 | IP address management |

To expose a service port directly (not recommended for production), add it to the service's `ports` mapping in `docker-compose.yml`.

For help, contact [support@netreconapp.com](mailto:support@netreconapp.com).
