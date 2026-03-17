---
sidebar_position: 3
title: Konfiguratsioon
description: Keskkonnamuutujad ja konfiguratsiooniviide isehallatava NetReconi jaoks
---

# Konfiguratsiooniviide

Kõik NetReconi teenused konfigureeritakse ühe `.env` faili kaudu, mis asub `/opt/netrecon/.env`. See leht dokumenteerib kõik saadaolevad keskkonnamuutujad.

## Põhiseaded

| Muutuja | Nõutav | Vaikeväärtus | Kirjeldus |
|---|---|---|---|
| `NETRECON_DOMAIN` | Jah | — | Teie domeeninimi (nt `netrecon.yourcompany.com`) |
| `NETRECON_EMAIL` | Jah | — | Administraatori e-post Let's Encrypt'i ja teavituste jaoks |

## Andmebaas (PostgreSQL)

| Muutuja | Nõutav | Vaikeväärtus | Kirjeldus |
|---|---|---|---|
| `POSTGRES_USER` | Jah | — | PostgreSQL kasutajanimi |
| `POSTGRES_PASSWORD` | Jah | — | PostgreSQL parool |
| `POSTGRES_DB` | Jah | `netrecon` | Andmebaasi nimi |
| `DATABASE_URL` | Auto | — | Konstrueeritakse automaatselt ülaltoodud väärtustest |

:::tip
Kasutage tugevat, juhuslikult genereeritud parooli. Genereerige üks käsuga:
```bash
openssl rand -base64 24
```
:::

## Vahemälu (Redis)

| Muutuja | Nõutav | Vaikeväärtus | Kirjeldus |
|---|---|---|---|
| `REDIS_PASSWORD` | Jah | — | Redis autentimisparool |
| `REDIS_URL` | Auto | — | Konstrueeritakse automaatselt |

## Autentimine

| Muutuja | Nõutav | Vaikeväärtus | Kirjeldus |
|---|---|---|---|
| `JWT_SECRET` | Jah | — | Salajane võti JWT tõendite allkirjastamiseks (min 32 märki) |
| `JWT_EXPIRE_MINUTES` | Ei | `1440` | Tõendi aegumisaeg (vaikimisi: 24 tundi) |

Genereerige turvaline JWT saladus:
```bash
openssl rand -hex 32
```

## Agent Registry

| Muutuja | Nõutav | Vaikeväärtus | Kirjeldus |
|---|---|---|---|
| `AGENT_REGISTRY_SECRET` | Jah | — | Saladus agentide registreerimiseks |
| `AGENT_JWT_SECRET` | Jah | — | JWT saladus agentide autentimiseks |
| `AGENT_TOKEN_EXPIRE_MINUTES` | Ei | `1440` | Agendi tõendi aegumine |
| `AGENT_HEARTBEAT_INTERVAL` | Ei | `30` | Südamelöögi intervall sekundites |
| `AGENT_HEARTBEAT_TIMEOUT` | Ei | `90` | Sekundid enne agendi võrguühenduseta märkimist |

## E-post (SMTP)

| Muutuja | Nõutav | Vaikeväärtus | Kirjeldus |
|---|---|---|---|
| `SMTP_HOST` | Jah | — | SMTP serveri hostinimi |
| `SMTP_PORT` | Ei | `587` | SMTP port (587 STARTTLS-i jaoks, 465 SSL-i jaoks) |
| `SMTP_USER` | Jah | — | SMTP kasutajanimi |
| `SMTP_PASSWORD` | Jah | — | SMTP parool |
| `SMTP_FROM` | Jah | — | Saatja aadress (nt `NetRecon <noreply@yourcompany.com>`) |

## Litsents

| Muutuja | Nõutav | Vaikeväärtus | Kirjeldus |
|---|---|---|---|
| `LICENSE_KEY` | Jah | — | Teie NetReconi litsentsivõti |

Litsentsivõtme saamiseks võtke ühendust [sales@netreconapp.com](mailto:sales@netreconapp.com).

## Varundusteenus

| Muutuja | Nõutav | Vaikeväärtus | Kirjeldus |
|---|---|---|---|
| `BACKUP_S3_ENDPOINT` | Ei | — | S3-ühilduv salvestuse lõpp-punkt |
| `BACKUP_S3_BUCKET` | Ei | — | Varunduste salvestusämber |
| `BACKUP_S3_ACCESS_KEY` | Ei | — | S3 juurdepääsuvõti |
| `BACKUP_S3_SECRET_KEY` | Ei | — | S3 salajane võti |
| `BACKUP_ENCRYPTION_KEY` | Ei | — | AES-256-GCM krüptovõti varunduste jaoks |
| `BACKUP_RETENTION_DAYS` | Ei | `30` | Varunduste säilitamise päevade arv |

## Teavitused

| Muutuja | Nõutav | Vaikeväärtus | Kirjeldus |
|---|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Ei | — | Telegram boti tõend hoiatuste jaoks |
| `TELEGRAM_CHAT_ID` | Ei | — | Telegrami vestluse ID hoiatuste edastamiseks |

## Näidis `.env` fail

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
Ärge kunagi lisage `.env` faili versioonihaldusesse. Kõik ülaltoodud väärtused on näited — asendage need oma turvaliste väärtustega enne juurutamist.
:::

## Konfiguratsioonimuudatuste rakendamine

Pärast `.env` faili muutmist taaskäivitage mõjutatud teenused:

```bash
cd /opt/netrecon

# Taaskäivitage kõik teenused
docker compose down && docker compose up -d

# Või taaskäivitage konkreetne teenus
docker compose restart api-gateway
```

## Teenuspordid

Kõik teenused töötavad Nginx pöördproksi taga portidel 80/443. Sisemised teenuspordid pole vaikimisi avatud:

| Teenus | Sisemine port | Kirjeldus |
|---|---|---|
| API Gateway | 8000 | Peamine API lõpp-punkt |
| Vault Server | 8001 | Saladuste haldamine |
| License Server | 8002 | Litsentsi valideerimine |
| Email Service | 8003 | SMTP vahendamine |
| Notification Service | 8004 | Push-teavitused ja hoiatused |
| Update Server | 8005 | Agentide ja sondide uuendused |
| Agent Registry | 8006 | Agentide registreerimine ja haldamine |
| Warranty Service | 8007 | Riistvara garantii päringud |
| CMod Service | 8008 | Konfiguratsioonihaldus |
| IPAM Service | 8009 | IP-aadresside haldamine |

Teenuspordi otse avamiseks (tootmiskeskkonnas pole soovitatav) lisage see teenuse `ports` kaardistusele `docker-compose.yml` failis.

Abi saamiseks võtke ühendust [support@netreconapp.com](mailto:support@netreconapp.com).
