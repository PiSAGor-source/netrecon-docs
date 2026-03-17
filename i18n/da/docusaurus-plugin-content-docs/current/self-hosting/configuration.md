---
sidebar_position: 3
title: Konfiguration
description: Miljøvariabler og konfigurationsreference for self-hosted NetRecon
---

# Konfigurationsreference

Alle NetRecon-tjenester konfigureres gennem en enkelt `.env`-fil placeret i `/opt/netrecon/.env`. Denne side dokumenterer alle tilgængelige miljøvariabler.

## Kerneindstillinger

| Variabel | Påkrævet | Standard | Beskrivelse |
|---|---|---|---|
| `NETRECON_DOMAIN` | Ja | — | Dit domænenavn (f.eks. `netrecon.yourcompany.com`) |
| `NETRECON_EMAIL` | Ja | — | Admin-e-mail til Let's Encrypt og notifikationer |

## Database (PostgreSQL)

| Variabel | Påkrævet | Standard | Beskrivelse |
|---|---|---|---|
| `POSTGRES_USER` | Ja | — | PostgreSQL-brugernavn |
| `POSTGRES_PASSWORD` | Ja | — | PostgreSQL-adgangskode |
| `POSTGRES_DB` | Ja | `netrecon` | Databasenavn |
| `DATABASE_URL` | Auto | — | Opbygges automatisk fra ovenstående værdier |

:::tip
Brug en stærk, tilfældigt genereret adgangskode. Generer en med:
```bash
openssl rand -base64 24
```
:::

## Cache (Redis)

| Variabel | Påkrævet | Standard | Beskrivelse |
|---|---|---|---|
| `REDIS_PASSWORD` | Ja | — | Redis-autentificeringsadgangskode |
| `REDIS_URL` | Auto | — | Opbygges automatisk |

## Autentificering

| Variabel | Påkrævet | Standard | Beskrivelse |
|---|---|---|---|
| `JWT_SECRET` | Ja | — | Hemmelig nøgle til signering af JWT-tokens (min. 32 tegn) |
| `JWT_EXPIRE_MINUTES` | Nej | `1440` | Tokens udløbstid (standard: 24 timer) |

Generer en sikker JWT-hemmelighed:
```bash
openssl rand -hex 32
```

## Agent Registry

| Variabel | Påkrævet | Standard | Beskrivelse |
|---|---|---|---|
| `AGENT_REGISTRY_SECRET` | Ja | — | Hemmelighed til agentregistrering |
| `AGENT_JWT_SECRET` | Ja | — | JWT-hemmelighed til agentautentificering |
| `AGENT_TOKEN_EXPIRE_MINUTES` | Nej | `1440` | Agenttokens udløbstid |
| `AGENT_HEARTBEAT_INTERVAL` | Nej | `30` | Heartbeat-interval i sekunder |
| `AGENT_HEARTBEAT_TIMEOUT` | Nej | `90` | Sekunder før agenten markeres som offline |

## E-mail (SMTP)

| Variabel | Påkrævet | Standard | Beskrivelse |
|---|---|---|---|
| `SMTP_HOST` | Ja | — | SMTP-serverens hostnavn |
| `SMTP_PORT` | Nej | `587` | SMTP-port (587 for STARTTLS, 465 for SSL) |
| `SMTP_USER` | Ja | — | SMTP-brugernavn |
| `SMTP_PASSWORD` | Ja | — | SMTP-adgangskode |
| `SMTP_FROM` | Ja | — | Afsenderadresse (f.eks. `NetRecon <noreply@yourcompany.com>`) |

## Licens

| Variabel | Påkrævet | Standard | Beskrivelse |
|---|---|---|---|
| `LICENSE_KEY` | Ja | — | Din NetRecon-licensnøgle |

Kontakt [sales@netreconapp.com](mailto:sales@netreconapp.com) for at få en licensnøgle.

## Sikkerhedskopieringstjeneste

| Variabel | Påkrævet | Standard | Beskrivelse |
|---|---|---|---|
| `BACKUP_S3_ENDPOINT` | Nej | — | S3-kompatibelt lagringsendepunkt |
| `BACKUP_S3_BUCKET` | Nej | — | Bucket-navn til sikkerhedskopier |
| `BACKUP_S3_ACCESS_KEY` | Nej | — | S3-adgangsnøgle |
| `BACKUP_S3_SECRET_KEY` | Nej | — | S3-hemmelig nøgle |
| `BACKUP_ENCRYPTION_KEY` | Nej | — | AES-256-GCM-krypteringsnøgle til sikkerhedskopier |
| `BACKUP_RETENTION_DAYS` | Nej | `30` | Antal dage sikkerhedskopifiler bevares |

## Notifikationer

| Variabel | Påkrævet | Standard | Beskrivelse |
|---|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Nej | — | Telegram bot-token til alarmer |
| `TELEGRAM_CHAT_ID` | Nej | — | Telegram chat-ID til alarmlevering |

## Eksempel på `.env`-fil

```bash
# Kerne
NETRECON_DOMAIN=netrecon.yourcompany.com
NETRECON_EMAIL=admin@yourcompany.com

# PostgreSQL
POSTGRES_USER=netrecon
POSTGRES_PASSWORD=xK9mP2vL8nQ4wR7j
POSTGRES_DB=netrecon

# Redis
REDIS_PASSWORD=hT6yN3bF9cM1pW5s

# Autentificering
JWT_SECRET=a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2

# Agent Registry
AGENT_REGISTRY_SECRET=r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3
AGENT_JWT_SECRET=h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9

# E-mail
SMTP_HOST=smtp.yourcompany.com
SMTP_PORT=587
SMTP_USER=noreply@yourcompany.com
SMTP_PASSWORD=your-smtp-password
SMTP_FROM=NetRecon <noreply@yourcompany.com>

# Licens
LICENSE_KEY=your-license-key
```

:::warning
Commit aldrig `.env`-filen til versionskontrol. Alle værdier vist ovenfor er eksempler — erstat dem med dine egne sikre værdier før implementering.
:::

## Anvendelse af konfigurationsændringer

Efter ændring af `.env`-filen, genstart de berørte tjenester:

```bash
cd /opt/netrecon

# Genstart alle tjenester
docker compose down && docker compose up -d

# Eller genstart en specifik tjeneste
docker compose restart api-gateway
```

## Tjenesteporte

Alle tjenester kører bag Nginx reverse proxy på port 80/443. Interne tjenesteporte er ikke eksponeret som standard:

| Tjeneste | Intern port | Beskrivelse |
|---|---|---|
| API Gateway | 8000 | Hoved-API-endepunkt |
| Vault Server | 8001 | Hemmelighedsadministration |
| License Server | 8002 | Licensvalidering |
| Email Service | 8003 | SMTP-relay |
| Notification Service | 8004 | Push-notifikationer og alarmer |
| Update Server | 8005 | Agent- og probeopdateringer |
| Agent Registry | 8006 | Agentregistrering og -administration |
| Warranty Service | 8007 | Hardwaregarantiopslag |
| CMod Service | 8008 | Konfigurationsstyring |
| IPAM Service | 8009 | IP-adresseadministration |

For at eksponere en tjenesteport direkte (anbefales ikke til produktion), tilføj den til tjenestens `ports`-mapping i `docker-compose.yml`.

For hjælp, kontakt [support@netreconapp.com](mailto:support@netreconapp.com).
