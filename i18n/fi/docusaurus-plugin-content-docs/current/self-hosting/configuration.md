---
sidebar_position: 3
title: Konfiguraatio
description: Ymparistomuuttujat ja konfiguraatio-opas itse isannoidulle NetReconille
---

# Konfiguraatio-opas

Kaikki NetReconin palvelut konfiguroidaan yhdella `.env`-tiedostolla, joka sijaitsee polussa `/opt/netrecon/.env`. Talla sivulla dokumentoidaan kaikki kaytettavissa olevat ymparistomuuttujat.

## Perusasetukset

| Muuttuja | Pakollinen | Oletus | Kuvaus |
|---|---|---|---|
| `NETRECON_DOMAIN` | Kylla | -- | Verkkotunnuksesi (esim. `netrecon.yrityksesi.com`) |
| `NETRECON_EMAIL` | Kylla | -- | Yllapidon sahkoposti Let's Encryptia ja ilmoituksia varten |

## Tietokanta (PostgreSQL)

| Muuttuja | Pakollinen | Oletus | Kuvaus |
|---|---|---|---|
| `POSTGRES_USER` | Kylla | -- | PostgreSQL-kayttajanimi |
| `POSTGRES_PASSWORD` | Kylla | -- | PostgreSQL-salasana |
| `POSTGRES_DB` | Kylla | `netrecon` | Tietokannan nimi |
| `DATABASE_URL` | Auto | -- | Muodostetaan automaattisesti yllaolevista arvoista |

:::tip
Kayta vahvaa, satunnaisesti generoitua salasanaa. Generoi sellainen komennolla:
```bash
openssl rand -base64 24
```
:::

## Valimuisti (Redis)

| Muuttuja | Pakollinen | Oletus | Kuvaus |
|---|---|---|---|
| `REDIS_PASSWORD` | Kylla | -- | Redis-todennussalasana |
| `REDIS_URL` | Auto | -- | Muodostetaan automaattisesti |

## Todennus

| Muuttuja | Pakollinen | Oletus | Kuvaus |
|---|---|---|---|
| `JWT_SECRET` | Kylla | -- | Salainen avain JWT-tokenien allekirjoittamiseen (vah. 32 merkkia) |
| `JWT_EXPIRE_MINUTES` | Ei | `1440` | Tokenin voimassaoloaika (oletus: 24 tuntia) |

Generoi turvallinen JWT-salaisuus:
```bash
openssl rand -hex 32
```

## Agenttirekisteri

| Muuttuja | Pakollinen | Oletus | Kuvaus |
|---|---|---|---|
| `AGENT_REGISTRY_SECRET` | Kylla | -- | Salaisuus agenttien rekisteroinnille |
| `AGENT_JWT_SECRET` | Kylla | -- | JWT-salaisuus agenttien todennusta varten |
| `AGENT_TOKEN_EXPIRE_MINUTES` | Ei | `1440` | Agenttitokenin voimassaolo |
| `AGENT_HEARTBEAT_INTERVAL` | Ei | `30` | Sykevalin sekunneissa |
| `AGENT_HEARTBEAT_TIMEOUT` | Ei | `90` | Sekuntia ennen agentin merkitsemista offline-tilaan |

## Sahkoposti (SMTP)

| Muuttuja | Pakollinen | Oletus | Kuvaus |
|---|---|---|---|
| `SMTP_HOST` | Kylla | -- | SMTP-palvelimen isantanimi |
| `SMTP_PORT` | Ei | `587` | SMTP-portti (587 STARTTLS:lle, 465 SSL:lle) |
| `SMTP_USER` | Kylla | -- | SMTP-kayttajanimi |
| `SMTP_PASSWORD` | Kylla | -- | SMTP-salasana |
| `SMTP_FROM` | Kylla | -- | Lahettajan osoite (esim. `NetRecon <noreply@yrityksesi.com>`) |

## Lisenssi

| Muuttuja | Pakollinen | Oletus | Kuvaus |
|---|---|---|---|
| `LICENSE_KEY` | Kylla | -- | NetRecon-lisenssiavaimesi |

Ota yhteytta [sales@netreconapp.com](mailto:sales@netreconapp.com) lisenssiavaimen hankkimiseksi.

## Varmuuskopiointipalvelu

| Muuttuja | Pakollinen | Oletus | Kuvaus |
|---|---|---|---|
| `BACKUP_S3_ENDPOINT` | Ei | -- | S3-yhteensopiva tallennuspaatepiste |
| `BACKUP_S3_BUCKET` | Ei | -- | Akun nimi varmuuskopioille |
| `BACKUP_S3_ACCESS_KEY` | Ei | -- | S3-avain |
| `BACKUP_S3_SECRET_KEY` | Ei | -- | S3-salainen avain |
| `BACKUP_ENCRYPTION_KEY` | Ei | -- | AES-256-GCM-salausavain varmuuskopioille |
| `BACKUP_RETENTION_DAYS` | Ei | `30` | Paivat varmuuskopiotiedostojen sailyttamiseksi |

## Ilmoitukset

| Muuttuja | Pakollinen | Oletus | Kuvaus |
|---|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Ei | -- | Telegram-botin token halytyksille |
| `TELEGRAM_CHAT_ID` | Ei | -- | Telegram-keskustelun ID halytysten toimittamiseen |

## Esimerkki `.env`-tiedosto

```bash
# Perus
NETRECON_DOMAIN=netrecon.yrityksesi.com
NETRECON_EMAIL=admin@yrityksesi.com

# PostgreSQL
POSTGRES_USER=netrecon
POSTGRES_PASSWORD=xK9mP2vL8nQ4wR7j
POSTGRES_DB=netrecon

# Redis
REDIS_PASSWORD=hT6yN3bF9cM1pW5s

# Todennus
JWT_SECRET=a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2

# Agenttirekisteri
AGENT_REGISTRY_SECRET=r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3
AGENT_JWT_SECRET=h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9

# Sahkoposti
SMTP_HOST=smtp.yrityksesi.com
SMTP_PORT=587
SMTP_USER=noreply@yrityksesi.com
SMTP_PASSWORD=smtp-salasanasi
SMTP_FROM=NetRecon <noreply@yrityksesi.com>

# Lisenssi
LICENSE_KEY=lisenssiavaimesi
```

:::warning
Ala koskaan tallenna `.env`-tiedostoa versionhallintaan. Kaikki yllaolevat arvot ovat esimerkkeja -- korvaa ne omilla turvallisilla arvoillasi ennen kayttoonottoa.
:::

## Konfiguraatiomuutosten soveltaminen

`.env`-tiedoston muuttamisen jalkeen kaynnista asiaankuuluvat palvelut uudelleen:

```bash
cd /opt/netrecon

# Kaynnista kaikki palvelut uudelleen
docker compose down && docker compose up -d

# Tai kaynnista tietty palvelu uudelleen
docker compose restart api-gateway
```

## Palveluportit

Kaikki palvelut toimivat Nginx-kaanteisen valityspalvelimen takana porteissa 80/443. Sisaiset palveluportit eivat ole oletuksena nakyissa:

| Palvelu | Sisainen portti | Kuvaus |
|---|---|---|
| API Gateway | 8000 | Paa-API-paatepiste |
| Vault Server | 8001 | Salaisuuksien hallinta |
| License Server | 8002 | Lisenssien validointi |
| Email Service | 8003 | SMTP-valitys |
| Notification Service | 8004 | Push-ilmoitukset ja halytykset |
| Update Server | 8005 | Agenttien ja mittarien paivitykset |
| Agent Registry | 8006 | Agenttien rekisterointi ja hallinta |
| Warranty Service | 8007 | Laitteistotakuuhaut |
| CMod Service | 8008 | Konfiguraationhallinta |
| IPAM Service | 8009 | IP-osoitteiden hallinta |

Palveluportin avaaminen suoraan (ei suositella tuotantoon) -- lisaa se palvelun `ports`-kohtaan `docker-compose.yml`-tiedostossa.

Avun saamiseksi ota yhteytta osoitteeseen [support@netreconapp.com](mailto:support@netreconapp.com).
