---
sidebar_position: 3
title: Configuratie
description: Omgevingsvariabelen en configuratiereferentie voor self-hosted NetRecon
---

# Configuratiereferentie

Alle NetRecon-services worden geconfigureerd via een enkel `.env`-bestand in `/opt/netrecon/.env`. Deze pagina documenteert elke beschikbare omgevingsvariabele.

## Kerninstellingen

| Variabele | Vereist | Standaard | Beschrijving |
|---|---|---|---|
| `NETRECON_DOMAIN` | Ja | — | Uw domeinnaam (bijv. `netrecon.uwbedrijf.com`) |
| `NETRECON_EMAIL` | Ja | — | Beheerders-e-mail voor Let's Encrypt en meldingen |

## Database (PostgreSQL)

| Variabele | Vereist | Standaard | Beschrijving |
|---|---|---|---|
| `POSTGRES_USER` | Ja | — | PostgreSQL-gebruikersnaam |
| `POSTGRES_PASSWORD` | Ja | — | PostgreSQL-wachtwoord |
| `POSTGRES_DB` | Ja | `netrecon` | Databasenaam |
| `DATABASE_URL` | Auto | — | Wordt automatisch opgebouwd uit bovenstaande waarden |

:::tip
Gebruik een sterk, willekeurig gegenereerd wachtwoord. Genereer er een met:
```bash
openssl rand -base64 24
```
:::

## Cache (Redis)

| Variabele | Vereist | Standaard | Beschrijving |
|---|---|---|---|
| `REDIS_PASSWORD` | Ja | — | Redis-authenticatiewachtwoord |
| `REDIS_URL` | Auto | — | Wordt automatisch opgebouwd |

## Authenticatie

| Variabele | Vereist | Standaard | Beschrijving |
|---|---|---|---|
| `JWT_SECRET` | Ja | — | Geheime sleutel voor het ondertekenen van JWT-tokens (min. 32 tekens) |
| `JWT_EXPIRE_MINUTES` | Nee | `1440` | Vervaltijd van tokens (standaard: 24 uur) |

Genereer een veilig JWT-geheim:
```bash
openssl rand -hex 32
```

## Agent Registry

| Variabele | Vereist | Standaard | Beschrijving |
|---|---|---|---|
| `AGENT_REGISTRY_SECRET` | Ja | — | Geheim voor agent-inschrijving |
| `AGENT_JWT_SECRET` | Ja | — | JWT-geheim voor agent-authenticatie |
| `AGENT_TOKEN_EXPIRE_MINUTES` | Nee | `1440` | Vervaltijd van agent-tokens |
| `AGENT_HEARTBEAT_INTERVAL` | Nee | `30` | Heartbeat-interval in seconden |
| `AGENT_HEARTBEAT_TIMEOUT` | Nee | `90` | Seconden voordat agent als offline wordt gemarkeerd |

## E-mail (SMTP)

| Variabele | Vereist | Standaard | Beschrijving |
|---|---|---|---|
| `SMTP_HOST` | Ja | — | SMTP-serverhostnaam |
| `SMTP_PORT` | Nee | `587` | SMTP-poort (587 voor STARTTLS, 465 voor SSL) |
| `SMTP_USER` | Ja | — | SMTP-gebruikersnaam |
| `SMTP_PASSWORD` | Ja | — | SMTP-wachtwoord |
| `SMTP_FROM` | Ja | — | Afzenderadres (bijv. `NetRecon <noreply@uwbedrijf.com>`) |

## Licentie

| Variabele | Vereist | Standaard | Beschrijving |
|---|---|---|---|
| `LICENSE_KEY` | Ja | — | Uw NetRecon-licentiesleutel |

Neem contact op met [sales@netreconapp.com](mailto:sales@netreconapp.com) om een licentiesleutel te verkrijgen.

## Back-upservice

| Variabele | Vereist | Standaard | Beschrijving |
|---|---|---|---|
| `BACKUP_S3_ENDPOINT` | Nee | — | S3-compatibel opslageindpunt |
| `BACKUP_S3_BUCKET` | Nee | — | Bucketnaam voor back-ups |
| `BACKUP_S3_ACCESS_KEY` | Nee | — | S3-toegangssleutel |
| `BACKUP_S3_SECRET_KEY` | Nee | — | S3-geheime sleutel |
| `BACKUP_ENCRYPTION_KEY` | Nee | — | AES-256-GCM-versleutelingssleutel voor back-ups |
| `BACKUP_RETENTION_DAYS` | Nee | `30` | Dagen om back-upbestanden te bewaren |

## Meldingen

| Variabele | Vereist | Standaard | Beschrijving |
|---|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Nee | — | Telegram-bottoken voor waarschuwingen |
| `TELEGRAM_CHAT_ID` | Nee | — | Telegram-chat-ID voor het bezorgen van waarschuwingen |

## Voorbeeld `.env`-bestand

```bash
# Kern
NETRECON_DOMAIN=netrecon.uwbedrijf.com
NETRECON_EMAIL=admin@uwbedrijf.com

# PostgreSQL
POSTGRES_USER=netrecon
POSTGRES_PASSWORD=xK9mP2vL8nQ4wR7j
POSTGRES_DB=netrecon

# Redis
REDIS_PASSWORD=hT6yN3bF9cM1pW5s

# Authenticatie
JWT_SECRET=a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2

# Agent Registry
AGENT_REGISTRY_SECRET=r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3
AGENT_JWT_SECRET=h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9

# E-mail
SMTP_HOST=smtp.uwbedrijf.com
SMTP_PORT=587
SMTP_USER=noreply@uwbedrijf.com
SMTP_PASSWORD=uw-smtp-wachtwoord
SMTP_FROM=NetRecon <noreply@uwbedrijf.com>

# Licentie
LICENSE_KEY=uw-licentiesleutel
```

:::warning
Commit het `.env`-bestand nooit naar versiebeheer. Alle bovenstaande waarden zijn voorbeelden — vervang ze door uw eigen veilige waarden voordat u implementeert.
:::

## Configuratiewijzigingen toepassen

Na het wijzigen van het `.env`-bestand herstart u de betreffende services:

```bash
cd /opt/netrecon

# Alle services herstarten
docker compose down && docker compose up -d

# Of een specifieke service herstarten
docker compose restart api-gateway
```

## Servicepoorten

Alle services draaien achter de Nginx reverse proxy op poorten 80/443. Interne servicepoorten worden standaard niet blootgesteld:

| Service | Interne poort | Beschrijving |
|---|---|---|
| API Gateway | 8000 | Hoofd-API-eindpunt |
| Vault Server | 8001 | Beheer van geheimen |
| License Server | 8002 | Licentievalidatie |
| Email Service | 8003 | SMTP-relay |
| Notification Service | 8004 | Pushmeldingen en waarschuwingen |
| Update Server | 8005 | Agent- en probe-updates |
| Agent Registry | 8006 | Inschrijving en beheer van agents |
| Warranty Service | 8007 | Opzoeken van hardwaregarantie |
| CMod Service | 8008 | Configuratiebeheer |
| IPAM Service | 8009 | IP-adresbeheer |

Om een servicepoort direct bloot te stellen (niet aanbevolen voor productie), voeg deze toe aan de `ports`-mapping van de service in `docker-compose.yml`.

Voor hulp kunt u contact opnemen met [support@netreconapp.com](mailto:support@netreconapp.com).
