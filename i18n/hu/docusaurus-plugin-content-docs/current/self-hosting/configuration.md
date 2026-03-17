---
sidebar_position: 3
title: Konfigurcio
description: Kornyezeti valtozok es konfiguracios referencia sajat szerveres NetRecon-hoz
---

# Konfiguracios referencia

Az osszes NetRecon szolgaltatas egyetlen `.env` fajlon keresztul konfiguralhato, amely az `/opt/netrecon/.env` helyen talalhato. Ez az oldal az osszes elerheto kornyezeti valtozot dokumentalja.

## Alapbeallitasok

| Valtozo | Kotelezo | Alapertek | Leiras |
|---|---|---|---|
| `NETRECON_DOMAIN` | Igen | — | Domainneve (pl. `netrecon.yourcompany.com`) |
| `NETRECON_EMAIL` | Igen | — | Adminisztratori e-mail Let's Encrypt-hez es ertesitesekhez |

## Adatbazis (PostgreSQL)

| Valtozo | Kotelezo | Alapertek | Leiras |
|---|---|---|---|
| `POSTGRES_USER` | Igen | — | PostgreSQL felhasznalonev |
| `POSTGRES_PASSWORD` | Igen | — | PostgreSQL jelszo |
| `POSTGRES_DB` | Igen | `netrecon` | Adatbazis nev |
| `DATABASE_URL` | Auto | — | Automatikusan epul a fenti ertekekbol |

:::tip
Hasznaljon eros, veletlenszeruen generalt jelszot. Generalas:
```bash
openssl rand -base64 24
```
:::

## Gyorsitar (Redis)

| Valtozo | Kotelezo | Alapertek | Leiras |
|---|---|---|---|
| `REDIS_PASSWORD` | Igen | — | Redis hitelesitesi jelszo |
| `REDIS_URL` | Auto | — | Automatikusan epul |

## Hitelesites

| Valtozo | Kotelezo | Alapertek | Leiras |
|---|---|---|---|
| `JWT_SECRET` | Igen | — | Titok kulcs JWT tokenek alairasohoz (min. 32 karakter) |
| `JWT_EXPIRE_MINUTES` | Nem | `1440` | Token lejarati ido (alapertek: 24 ora) |

Biztonsagos JWT titok generalasa:
```bash
openssl rand -hex 32
```

## Agensnyilvantarto

| Valtozo | Kotelezo | Alapertek | Leiras |
|---|---|---|---|
| `AGENT_REGISTRY_SECRET` | Igen | — | Titok az agensek regisztralasohoz |
| `AGENT_JWT_SECRET` | Igen | — | JWT titok az agenst hitelesiteshez |
| `AGENT_TOKEN_EXPIRE_MINUTES` | Nem | `1440` | Agenst token lejarata |
| `AGENT_HEARTBEAT_INTERVAL` | Nem | `30` | Eletjel gyakorisag masodpercben |
| `AGENT_HEARTBEAT_TIMEOUT` | Nem | `90` | Masodpercek, mielott az agenst offline-nak jeloli |

## E-mail (SMTP)

| Valtozo | Kotelezo | Alapertek | Leiras |
|---|---|---|---|
| `SMTP_HOST` | Igen | — | SMTP szerver hosztnev |
| `SMTP_PORT` | Nem | `587` | SMTP port (587 STARTTLS-hez, 465 SSL-hez) |
| `SMTP_USER` | Igen | — | SMTP felhasznalonev |
| `SMTP_PASSWORD` | Igen | — | SMTP jelszo |
| `SMTP_FROM` | Igen | — | Felado cim (pl. `NetRecon <noreply@yourcompany.com>`) |

## Licenc

| Valtozo | Kotelezo | Alapertek | Leiras |
|---|---|---|---|
| `LICENSE_KEY` | Igen | — | NetRecon licenckulcsa |

Licenckulcs beszerzeeseert forduljon a [sales@netreconapp.com](mailto:sales@netreconapp.com) cimhez.

## Mentesi szolgaltatas

| Valtozo | Kotelezo | Alapertek | Leiras |
|---|---|---|---|
| `BACKUP_S3_ENDPOINT` | Nem | — | S3-kompatibilis tarolo vegpont |
| `BACKUP_S3_BUCKET` | Nem | — | Mentesek tarolo neve |
| `BACKUP_S3_ACCESS_KEY` | Nem | — | S3 hozzaferesi kulcs |
| `BACKUP_S3_SECRET_KEY` | Nem | — | S3 titkos kulcs |
| `BACKUP_ENCRYPTION_KEY` | Nem | — | AES-256-GCM titkositasi kulcs mentesekhez |
| `BACKUP_RETENTION_DAYS` | Nem | `30` | Mentesi fajlok megorzesi ideje napokban |

## Ertesitesek

| Valtozo | Kotelezo | Alapertek | Leiras |
|---|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Nem | — | Telegram bot token riasztasokhoz |
| `TELEGRAM_CHAT_ID` | Nem | — | Telegram chat azonosito riasztasok kezbesitesehez |

## Pelda `.env` fajl

```bash
# Alap
NETRECON_DOMAIN=netrecon.yourcompany.com
NETRECON_EMAIL=admin@yourcompany.com

# PostgreSQL
POSTGRES_USER=netrecon
POSTGRES_PASSWORD=xK9mP2vL8nQ4wR7j
POSTGRES_DB=netrecon

# Redis
REDIS_PASSWORD=hT6yN3bF9cM1pW5s

# Hitelesites
JWT_SECRET=a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2

# Agensnyilvantarto
AGENT_REGISTRY_SECRET=r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3
AGENT_JWT_SECRET=h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9

# E-mail
SMTP_HOST=smtp.yourcompany.com
SMTP_PORT=587
SMTP_USER=noreply@yourcompany.com
SMTP_PASSWORD=az-on-smtp-jelszava
SMTP_FROM=NetRecon <noreply@yourcompany.com>

# Licenc
LICENSE_KEY=az-on-licenckulcsa
```

:::warning
Soha ne kommitolja az `.env` fajlt verziokovetorendszerbe. A fent latott ertekek mind peldak — cserje ki sajat biztonsagos ertekekre a telepites elott.
:::

## Konfiguracios modositasok alkalmazasa

Az `.env` fajl modositasa utan inditsa ujra az erintett szolgaltatasokat:

```bash
cd /opt/netrecon

# Osszes szolgaltatas ujrainditasa
docker compose down && docker compose up -d

# Vagy egy adott szolgaltatas ujrainditasa
docker compose restart api-gateway
```

## Szolgaltatasi portok

Az osszes szolgaltatas az Nginx reverse proxyn keresztul fut a 80/443 portokon. A belso szolgaltatasi portok alapertelmezetten nincsenek kiteteve:

| Szolgaltatas | Belso port | Leiras |
|---|---|---|
| API Gateway | 8000 | Fo API vegpont |
| Vault Server | 8001 | Titkok kezelese |
| Licencszerver | 8002 | Licencellenorzes |
| E-mail szolgaltatas | 8003 | SMTP tovabbitas |
| Ertesitesi szolgaltatas | 8004 | Push ertesitesek es riasztasok |
| Frissitesi szerver | 8005 | Agenst es szonda frissitesek |
| Agensnyilvantarto | 8006 | Agenst regisztrcio es kezeles |
| Garanciaszolgaltatas | 8007 | Hardver garancia lekerdezesek |
| CMod szolgaltatas | 8008 | Konfigurcio kezeles |
| IPAM szolgaltatas | 8009 | IP-cim kezeles |

Egy szolgaltatasi port kozvetlen kitettesehez (nem ajanlott produkcios kornyezetben) adja hozza a szolgaltatas `ports` lekepezesehez a `docker-compose.yml` fajlban.

Segitsegert forduljon a [support@netreconapp.com](mailto:support@netreconapp.com) cimhez.
