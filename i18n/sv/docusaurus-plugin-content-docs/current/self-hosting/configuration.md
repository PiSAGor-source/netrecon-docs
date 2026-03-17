---
sidebar_position: 3
title: Konfiguration
description: Miljövariabler och konfigurationsreferens för egenhostad NetRecon
---

# Konfigurationsreferens

Alla NetRecon-tjänster konfigureras via en enda `.env`-fil placerad i `/opt/netrecon/.env`. Denna sida dokumenterar varje tillgänglig miljövariabel.

## Grundinställningar

| Variabel | Krävs | Standard | Beskrivning |
|---|---|---|---|
| `NETRECON_DOMAIN` | Ja | — | Ditt domännamn (t.ex. `netrecon.yourcompany.com`) |
| `NETRECON_EMAIL` | Ja | — | Administratörens e-post för Let's Encrypt och notifikationer |

## Databas (PostgreSQL)

| Variabel | Krävs | Standard | Beskrivning |
|---|---|---|---|
| `POSTGRES_USER` | Ja | — | PostgreSQL-användarnamn |
| `POSTGRES_PASSWORD` | Ja | — | PostgreSQL-lösenord |
| `POSTGRES_DB` | Ja | `netrecon` | Databasnamn |
| `DATABASE_URL` | Auto | — | Konstrueras automatiskt från ovanstående värden |

:::tip
Använd ett starkt, slumpmässigt genererat lösenord. Generera ett med:
```bash
openssl rand -base64 24
```
:::

## Cache (Redis)

| Variabel | Krävs | Standard | Beskrivning |
|---|---|---|---|
| `REDIS_PASSWORD` | Ja | — | Redis-autentiseringslösenord |
| `REDIS_URL` | Auto | — | Konstrueras automatiskt |

## Autentisering

| Variabel | Krävs | Standard | Beskrivning |
|---|---|---|---|
| `JWT_SECRET` | Ja | — | Hemlig nyckel för signering av JWT-token (minst 32 tecken) |
| `JWT_EXPIRE_MINUTES` | Nej | `1440` | Tokenutgångstid (standard: 24 timmar) |

Generera en säker JWT-hemlighet:
```bash
openssl rand -hex 32
```

## Agentregister

| Variabel | Krävs | Standard | Beskrivning |
|---|---|---|---|
| `AGENT_REGISTRY_SECRET` | Ja | — | Hemlighet för agentregistrering |
| `AGENT_JWT_SECRET` | Ja | — | JWT-hemlighet för agentautentisering |
| `AGENT_TOKEN_EXPIRE_MINUTES` | Nej | `1440` | Utgångstid för agenttoken |
| `AGENT_HEARTBEAT_INTERVAL` | Nej | `30` | Heartbeat-intervall i sekunder |
| `AGENT_HEARTBEAT_TIMEOUT` | Nej | `90` | Sekunder innan agenten markeras som offline |

## E-post (SMTP)

| Variabel | Krävs | Standard | Beskrivning |
|---|---|---|---|
| `SMTP_HOST` | Ja | — | SMTP-servervärdnamn |
| `SMTP_PORT` | Nej | `587` | SMTP-port (587 för STARTTLS, 465 för SSL) |
| `SMTP_USER` | Ja | — | SMTP-användarnamn |
| `SMTP_PASSWORD` | Ja | — | SMTP-lösenord |
| `SMTP_FROM` | Ja | — | Avsändaradress (t.ex. `NetRecon <noreply@yourcompany.com>`) |

## Licens

| Variabel | Krävs | Standard | Beskrivning |
|---|---|---|---|
| `LICENSE_KEY` | Ja | — | Din NetRecon-licensnyckel |

Kontakta [sales@netreconapp.com](mailto:sales@netreconapp.com) för att erhålla en licensnyckel.

## Säkerhetskopieringstjänst

| Variabel | Krävs | Standard | Beskrivning |
|---|---|---|---|
| `BACKUP_S3_ENDPOINT` | Nej | — | S3-kompatibel lagringsändpunkt |
| `BACKUP_S3_BUCKET` | Nej | — | Bucket-namn för säkerhetskopior |
| `BACKUP_S3_ACCESS_KEY` | Nej | — | S3-åtkomstnyckel |
| `BACKUP_S3_SECRET_KEY` | Nej | — | S3-hemlig nyckel |
| `BACKUP_ENCRYPTION_KEY` | Nej | — | AES-256-GCM-krypteringsnyckel för säkerhetskopior |
| `BACKUP_RETENTION_DAYS` | Nej | `30` | Antal dagar att behålla säkerhetskopior |

## Notifikationer

| Variabel | Krävs | Standard | Beskrivning |
|---|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Nej | — | Telegram-bottoken för varningar |
| `TELEGRAM_CHAT_ID` | Nej | — | Telegram-chatt-ID för leverans av varningar |

## Exempel på `.env`-fil

```bash
# Grundläggande
NETRECON_DOMAIN=netrecon.yourcompany.com
NETRECON_EMAIL=admin@yourcompany.com

# PostgreSQL
POSTGRES_USER=netrecon
POSTGRES_PASSWORD=xK9mP2vL8nQ4wR7j
POSTGRES_DB=netrecon

# Redis
REDIS_PASSWORD=hT6yN3bF9cM1pW5s

# Autentisering
JWT_SECRET=a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2

# Agentregister
AGENT_REGISTRY_SECRET=r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3
AGENT_JWT_SECRET=h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9

# E-post
SMTP_HOST=smtp.yourcompany.com
SMTP_PORT=587
SMTP_USER=noreply@yourcompany.com
SMTP_PASSWORD=your-smtp-password
SMTP_FROM=NetRecon <noreply@yourcompany.com>

# Licens
LICENSE_KEY=your-license-key
```

:::warning
Committa aldrig `.env`-filen till versionshantering. Alla värden som visas ovan är exempel — ersätt dem med dina egna säkra värden innan distribution.
:::

## Tillämpa konfigurationsändringar

Efter att ha ändrat `.env`-filen, starta om de berörda tjänsterna:

```bash
cd /opt/netrecon

# Starta om alla tjänster
docker compose down && docker compose up -d

# Eller starta om en specifik tjänst
docker compose restart api-gateway
```

## Tjänsteportar

Alla tjänster körs bakom Nginx reverse proxy på portarna 80/443. Interna tjänsteportar exponeras inte som standard:

| Tjänst | Intern port | Beskrivning |
|---|---|---|
| API Gateway | 8000 | Huvud-API-ändpunkt |
| Vault Server | 8001 | Hemlighetshantering |
| License Server | 8002 | Licensvalidering |
| Email Service | 8003 | SMTP-relä |
| Notification Service | 8004 | Push-notifikationer och varningar |
| Update Server | 8005 | Agent- och probuppdateringar |
| Agent Registry | 8006 | Agentregistrering och -hantering |
| Warranty Service | 8007 | Sökning av hårdvarugaranti |
| CMod Service | 8008 | Konfigurationshantering |
| IPAM Service | 8009 | IP-adresshantering |

För att exponera en tjänsteport direkt (rekommenderas inte för produktion), lägg till den i tjänstens `ports`-mappning i `docker-compose.yml`.

För hjälp, kontakta [support@netreconapp.com](mailto:support@netreconapp.com).
