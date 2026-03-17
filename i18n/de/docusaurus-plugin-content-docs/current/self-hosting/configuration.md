---
sidebar_position: 3
title: Konfiguration
description: Umgebungsvariablen und Konfigurationsreferenz für Self-Hosted NetRecon
---

# Konfigurationsreferenz

Alle NetRecon-Services werden über eine einzelne `.env`-Datei konfiguriert, die sich unter `/opt/netrecon/.env` befindet. Diese Seite dokumentiert alle verfügbaren Umgebungsvariablen.

## Grundeinstellungen

| Variable | Erforderlich | Standard | Beschreibung |
|---|---|---|---|
| `NETRECON_DOMAIN` | Ja | — | Ihr Domainname (z. B. `netrecon.yourcompany.com`) |
| `NETRECON_EMAIL` | Ja | — | Admin-E-Mail für Let's Encrypt und Benachrichtigungen |

## Datenbank (PostgreSQL)

| Variable | Erforderlich | Standard | Beschreibung |
|---|---|---|---|
| `POSTGRES_USER` | Ja | — | PostgreSQL-Benutzername |
| `POSTGRES_PASSWORD` | Ja | — | PostgreSQL-Passwort |
| `POSTGRES_DB` | Ja | `netrecon` | Datenbankname |
| `DATABASE_URL` | Auto | — | Wird automatisch aus den obigen Werten zusammengesetzt |

:::tip
Verwenden Sie ein starkes, zufällig generiertes Passwort. Generieren Sie eines mit:
```bash
openssl rand -base64 24
```
:::

## Cache (Redis)

| Variable | Erforderlich | Standard | Beschreibung |
|---|---|---|---|
| `REDIS_PASSWORD` | Ja | — | Redis-Authentifizierungspasswort |
| `REDIS_URL` | Auto | — | Wird automatisch zusammengesetzt |

## Authentifizierung

| Variable | Erforderlich | Standard | Beschreibung |
|---|---|---|---|
| `JWT_SECRET` | Ja | — | Geheimer Schlüssel zum Signieren von JWT-Tokens (mind. 32 Zeichen) |
| `JWT_EXPIRE_MINUTES` | Nein | `1440` | Token-Ablaufzeit (Standard: 24 Stunden) |

Einen sicheren JWT-Schlüssel generieren:
```bash
openssl rand -hex 32
```

## Agent Registry

| Variable | Erforderlich | Standard | Beschreibung |
|---|---|---|---|
| `AGENT_REGISTRY_SECRET` | Ja | — | Geheimnis für die Agent-Registrierung |
| `AGENT_JWT_SECRET` | Ja | — | JWT-Geheimnis für die Agent-Authentifizierung |
| `AGENT_TOKEN_EXPIRE_MINUTES` | Nein | `1440` | Agent-Token-Ablaufzeit |
| `AGENT_HEARTBEAT_INTERVAL` | Nein | `30` | Heartbeat-Intervall in Sekunden |
| `AGENT_HEARTBEAT_TIMEOUT` | Nein | `90` | Sekunden bis zur Markierung als offline |

## E-Mail (SMTP)

| Variable | Erforderlich | Standard | Beschreibung |
|---|---|---|---|
| `SMTP_HOST` | Ja | — | SMTP-Server-Hostname |
| `SMTP_PORT` | Nein | `587` | SMTP-Port (587 für STARTTLS, 465 für SSL) |
| `SMTP_USER` | Ja | — | SMTP-Benutzername |
| `SMTP_PASSWORD` | Ja | — | SMTP-Passwort |
| `SMTP_FROM` | Ja | — | Absenderadresse (z. B. `NetRecon <noreply@yourcompany.com>`) |

## Lizenz

| Variable | Erforderlich | Standard | Beschreibung |
|---|---|---|---|
| `LICENSE_KEY` | Ja | — | Ihr NetRecon-Lizenzschlüssel |

Kontaktieren Sie [sales@netreconapp.com](mailto:sales@netreconapp.com), um einen Lizenzschlüssel zu erhalten.

## Backup-Service

| Variable | Erforderlich | Standard | Beschreibung |
|---|---|---|---|
| `BACKUP_S3_ENDPOINT` | Nein | — | S3-kompatibler Speicher-Endpunkt |
| `BACKUP_S3_BUCKET` | Nein | — | Bucket-Name für Backups |
| `BACKUP_S3_ACCESS_KEY` | Nein | — | S3-Zugriffsschlüssel |
| `BACKUP_S3_SECRET_KEY` | Nein | — | S3-Geheimschlüssel |
| `BACKUP_ENCRYPTION_KEY` | Nein | — | AES-256-GCM-Verschlüsselungsschlüssel für Backups |
| `BACKUP_RETENTION_DAYS` | Nein | `30` | Aufbewahrungsdauer der Backup-Dateien in Tagen |

## Benachrichtigungen

| Variable | Erforderlich | Standard | Beschreibung |
|---|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Nein | — | Telegram-Bot-Token für Warnungen |
| `TELEGRAM_CHAT_ID` | Nein | — | Telegram-Chat-ID für Warnungszustellung |

## Beispiel-`.env`-Datei

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
Übertragen Sie die `.env`-Datei niemals in die Versionskontrolle. Alle oben gezeigten Werte sind Beispiele — ersetzen Sie sie durch Ihre eigenen sicheren Werte vor der Bereitstellung.
:::

## Konfigurationsänderungen anwenden

Nachdem Sie die `.env`-Datei geändert haben, starten Sie die betroffenen Services neu:

```bash
cd /opt/netrecon

# Alle Services neu starten
docker compose down && docker compose up -d

# Oder einen bestimmten Service neu starten
docker compose restart api-gateway
```

## Service-Ports

Alle Services laufen hinter dem Nginx Reverse Proxy auf den Ports 80/443. Interne Service-Ports werden standardmäßig nicht exponiert:

| Service | Interner Port | Beschreibung |
|---|---|---|
| API Gateway | 8000 | Haupt-API-Endpunkt |
| Vault Server | 8001 | Geheimnisverwaltung |
| License Server | 8002 | Lizenzvalidierung |
| Email Service | 8003 | SMTP-Relay |
| Notification Service | 8004 | Push-Benachrichtigungen und Warnungen |
| Update Server | 8005 | Agent- und Probe-Updates |
| Agent Registry | 8006 | Agent-Registrierung und -Verwaltung |
| Warranty Service | 8007 | Hardware-Garantieabfragen |
| CMod Service | 8008 | Konfigurationsmanagement |
| IPAM Service | 8009 | IP-Adressverwaltung |

Um einen Service-Port direkt zu exponieren (nicht empfohlen für Produktionsumgebungen), fügen Sie ihn zum `ports`-Mapping des Services in `docker-compose.yml` hinzu.

Für Hilfe kontaktieren Sie [support@netreconapp.com](mailto:support@netreconapp.com).
