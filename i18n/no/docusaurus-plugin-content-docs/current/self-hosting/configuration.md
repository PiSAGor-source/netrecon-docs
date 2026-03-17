---
sidebar_position: 3
title: Konfigurasjon
description: Miljovariabler og konfigurasjonsreferanse for selvhostet NetRecon
---

# Konfigurasjonsreferanse

Alle NetRecon-tjenester konfigureres gjennom en enkelt `.env`-fil som ligger pa `/opt/netrecon/.env`. Denne siden dokumenterer alle tilgjengelige miljovariabler.

## Kjerneinnstillinger

| Variabel | Pakrevd | Standard | Beskrivelse |
|---|---|---|---|
| `NETRECON_DOMAIN` | Ja | -- | Ditt domenenavn (f.eks. `netrecon.yourcompany.com`) |
| `NETRECON_EMAIL` | Ja | -- | Administrator-e-post for Let's Encrypt og varsler |

## Database (PostgreSQL)

| Variabel | Pakrevd | Standard | Beskrivelse |
|---|---|---|---|
| `POSTGRES_USER` | Ja | -- | PostgreSQL-brukernavn |
| `POSTGRES_PASSWORD` | Ja | -- | PostgreSQL-passord |
| `POSTGRES_DB` | Ja | `netrecon` | Databasenavn |
| `DATABASE_URL` | Auto | -- | Konstrueres automatisk fra verdiene ovenfor |

:::tip
Bruk et sterkt, tilfeldig generert passord. Generer et med:
```bash
openssl rand -base64 24
```
:::

## Hurtigbuffer (Redis)

| Variabel | Pakrevd | Standard | Beskrivelse |
|---|---|---|---|
| `REDIS_PASSWORD` | Ja | -- | Redis-autentiseringspassord |
| `REDIS_URL` | Auto | -- | Konstrueres automatisk |

## Autentisering

| Variabel | Pakrevd | Standard | Beskrivelse |
|---|---|---|---|
| `JWT_SECRET` | Ja | -- | Hemmelighet for signering av JWT-tokener (min 32 tegn) |
| `JWT_EXPIRE_MINUTES` | Nei | `1440` | Tokenutlopstid (standard: 24 timer) |

Generer en sikker JWT-hemmelighet:
```bash
openssl rand -hex 32
```

## Agentregister

| Variabel | Pakrevd | Standard | Beskrivelse |
|---|---|---|---|
| `AGENT_REGISTRY_SECRET` | Ja | -- | Hemmelighet for agentregistrering |
| `AGENT_JWT_SECRET` | Ja | -- | JWT-hemmelighet for agentautentisering |
| `AGENT_TOKEN_EXPIRE_MINUTES` | Nei | `1440` | Utlopstid for agenttoken |
| `AGENT_HEARTBEAT_INTERVAL` | Nei | `30` | Hjerteslagintervall i sekunder |
| `AGENT_HEARTBEAT_TIMEOUT` | Nei | `90` | Sekunder for agenten merkes som frakoblet |

## E-post (SMTP)

| Variabel | Pakrevd | Standard | Beskrivelse |
|---|---|---|---|
| `SMTP_HOST` | Ja | -- | SMTP-servernavn |
| `SMTP_PORT` | Nei | `587` | SMTP-port (587 for STARTTLS, 465 for SSL) |
| `SMTP_USER` | Ja | -- | SMTP-brukernavn |
| `SMTP_PASSWORD` | Ja | -- | SMTP-passord |
| `SMTP_FROM` | Ja | -- | Avsenderadresse (f.eks. `NetRecon <noreply@yourcompany.com>`) |

## Lisens

| Variabel | Pakrevd | Standard | Beskrivelse |
|---|---|---|---|
| `LICENSE_KEY` | Ja | -- | Din NetRecon-lisensnokkel |

Kontakt [sales@netreconapp.com](mailto:sales@netreconapp.com) for a fa en lisensnokkel.

## Sikkerhetskopieringstjeneste

| Variabel | Pakrevd | Standard | Beskrivelse |
|---|---|---|---|
| `BACKUP_S3_ENDPOINT` | Nei | -- | S3-kompatibelt lagringsendepunkt |
| `BACKUP_S3_BUCKET` | Nei | -- | Botte-navn for sikkerhetskopier |
| `BACKUP_S3_ACCESS_KEY` | Nei | -- | S3-tilgangsnokkel |
| `BACKUP_S3_SECRET_KEY` | Nei | -- | S3-hemmelig nokkel |
| `BACKUP_ENCRYPTION_KEY` | Nei | -- | AES-256-GCM-krypteringsnokkel for sikkerhetskopier |
| `BACKUP_RETENTION_DAYS` | Nei | `30` | Dager a beholde sikkerhetskopifiler |

## Varsler

| Variabel | Pakrevd | Standard | Beskrivelse |
|---|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Nei | -- | Telegram-bot-token for alarmer |
| `TELEGRAM_CHAT_ID` | Nei | -- | Telegram-chat-ID for alarmlevering |

## Eksempel pa `.env`-fil

```bash
# Kjerne
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
SMTP_PASSWORD=ditt-smtp-passord
SMTP_FROM=NetRecon <noreply@yourcompany.com>

# Lisens
LICENSE_KEY=din-lisensnokkel
```

:::warning
Aldri overfr `.env`-filen til versjonskontroll. Alle verdier vist ovenfor er eksempler -- erstatt dem med dine egne sikre verdier for distribusjon.
:::

## Bruke konfigurasjonsendringer

Etter a ha endret `.env`-filen, start de berurte tjenestene pa nytt:

```bash
cd /opt/netrecon

# Start alle tjenester pa nytt
docker compose down && docker compose up -d

# Eller start en spesifikk tjeneste pa nytt
docker compose restart api-gateway
```

## Tjenesteporter

Alle tjenester kjorer bak Nginx omvendt proxy pa portene 80/443. Interne tjenesteporter er ikke eksponert som standard:

| Tjeneste | Intern port | Beskrivelse |
|---|---|---|
| API Gateway | 8000 | Hoved-API-endepunkt |
| Vault Server | 8001 | Hemmelighetsadministrasjon |
| License Server | 8002 | Lisensvalidering |
| Email Service | 8003 | SMTP-rele |
| Notification Service | 8004 | Push-varsler og alarmer |
| Update Server | 8005 | Agent- og probeoppdateringer |
| Agent Registry | 8006 | Agentregistrering og -administrasjon |
| Warranty Service | 8007 | Maskinvaregarantioppslag |
| CMod Service | 8008 | Konfigurasjonsadministrasjon |
| IPAM Service | 8009 | IP-adresseadministrasjon |

For a eksponere en tjenesteport direkte (ikke anbefalt for produksjon), legg den til i tjenestens `ports`-tilordning i `docker-compose.yml`.

For hjelp, kontakt [support@netreconapp.com](mailto:support@netreconapp.com).
