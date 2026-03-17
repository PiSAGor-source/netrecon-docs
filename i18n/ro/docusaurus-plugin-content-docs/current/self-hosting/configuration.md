---
sidebar_position: 3
title: Configurare
description: Variabile de mediu și referință de configurare pentru NetRecon auto-găzduit
---

# Referință de configurare

Toate serviciile NetRecon sunt configurate printr-un singur fișier `.env` situat la `/opt/netrecon/.env`. Această pagină documentează fiecare variabilă de mediu disponibilă.

## Setări principale

| Variabilă | Obligatorie | Implicit | Descriere |
|---|---|---|---|
| `NETRECON_DOMAIN` | Da | — | Numele domeniului dvs. (de ex., `netrecon.yourcompany.com`) |
| `NETRECON_EMAIL` | Da | — | Email administrator pentru Let's Encrypt și notificări |

## Baza de date (PostgreSQL)

| Variabilă | Obligatorie | Implicit | Descriere |
|---|---|---|---|
| `POSTGRES_USER` | Da | — | Nume utilizator PostgreSQL |
| `POSTGRES_PASSWORD` | Da | — | Parola PostgreSQL |
| `POSTGRES_DB` | Da | `netrecon` | Numele bazei de date |
| `DATABASE_URL` | Auto | — | Construită automat din valorile de mai sus |

:::tip
Folosiți o parolă puternică, generată aleatoriu. Generați una cu:
```bash
openssl rand -base64 24
```
:::

## Cache (Redis)

| Variabilă | Obligatorie | Implicit | Descriere |
|---|---|---|---|
| `REDIS_PASSWORD` | Da | — | Parola de autentificare Redis |
| `REDIS_URL` | Auto | — | Construită automat |

## Autentificare

| Variabilă | Obligatorie | Implicit | Descriere |
|---|---|---|---|
| `JWT_SECRET` | Da | — | Cheie secretă pentru semnarea token-urilor JWT (minim 32 caractere) |
| `JWT_EXPIRE_MINUTES` | Nu | `1440` | Timp de expirare token (implicit: 24 ore) |

Generați un secret JWT securizat:
```bash
openssl rand -hex 32
```

## Registru agenți

| Variabilă | Obligatorie | Implicit | Descriere |
|---|---|---|---|
| `AGENT_REGISTRY_SECRET` | Da | — | Secret pentru înrolarea agenților |
| `AGENT_JWT_SECRET` | Da | — | Secret JWT pentru autentificarea agenților |
| `AGENT_TOKEN_EXPIRE_MINUTES` | Nu | `1440` | Expirare token agent |
| `AGENT_HEARTBEAT_INTERVAL` | Nu | `30` | Interval heartbeat în secunde |
| `AGENT_HEARTBEAT_TIMEOUT` | Nu | `90` | Secunde înainte de marcarea agentului ca offline |

## Email (SMTP)

| Variabilă | Obligatorie | Implicit | Descriere |
|---|---|---|---|
| `SMTP_HOST` | Da | — | Numele gazdei serverului SMTP |
| `SMTP_PORT` | Nu | `587` | Port SMTP (587 pentru STARTTLS, 465 pentru SSL) |
| `SMTP_USER` | Da | — | Nume utilizator SMTP |
| `SMTP_PASSWORD` | Da | — | Parola SMTP |
| `SMTP_FROM` | Da | — | Adresa expeditor (de ex., `NetRecon <noreply@yourcompany.com>`) |

## Licență

| Variabilă | Obligatorie | Implicit | Descriere |
|---|---|---|---|
| `LICENSE_KEY` | Da | — | Cheia dvs. de licență NetRecon |

Contactați [sales@netreconapp.com](mailto:sales@netreconapp.com) pentru a obține o cheie de licență.

## Serviciu backup

| Variabilă | Obligatorie | Implicit | Descriere |
|---|---|---|---|
| `BACKUP_S3_ENDPOINT` | Nu | — | Endpoint stocare compatibil S3 |
| `BACKUP_S3_BUCKET` | Nu | — | Numele bucket-ului pentru backup-uri |
| `BACKUP_S3_ACCESS_KEY` | Nu | — | Cheie de acces S3 |
| `BACKUP_S3_SECRET_KEY` | Nu | — | Cheie secretă S3 |
| `BACKUP_ENCRYPTION_KEY` | Nu | — | Cheie de criptare AES-256-GCM pentru backup-uri |
| `BACKUP_RETENTION_DAYS` | Nu | `30` | Zile de retenție pentru fișierele de backup |

## Notificări

| Variabilă | Obligatorie | Implicit | Descriere |
|---|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Nu | — | Token bot Telegram pentru alerte |
| `TELEGRAM_CHAT_ID` | Nu | — | ID chat Telegram pentru livrarea alertelor |

## Exemplu fișier `.env`

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

# Autentificare
JWT_SECRET=a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2

# Registru agenți
AGENT_REGISTRY_SECRET=r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3
AGENT_JWT_SECRET=h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9

# Email
SMTP_HOST=smtp.yourcompany.com
SMTP_PORT=587
SMTP_USER=noreply@yourcompany.com
SMTP_PASSWORD=parola-dvs-smtp
SMTP_FROM=NetRecon <noreply@yourcompany.com>

# Licență
LICENSE_KEY=cheia-dvs-de-licenta
```

:::warning
Nu comiteți niciodată fișierul `.env` în controlul versiunilor. Toate valorile afișate mai sus sunt exemple — înlocuiți-le cu propriile valori securizate înainte de implementare.
:::

## Aplicarea modificărilor de configurare

După modificarea fișierului `.env`, reporniți serviciile afectate:

```bash
cd /opt/netrecon

# Reporniți toate serviciile
docker compose down && docker compose up -d

# Sau reporniți un serviciu specific
docker compose restart api-gateway
```

## Porturi servicii

Toate serviciile rulează în spatele proxy-ului invers Nginx pe porturile 80/443. Porturile interne ale serviciilor nu sunt expuse implicit:

| Serviciu | Port intern | Descriere |
|---|---|---|
| API Gateway | 8000 | Endpoint API principal |
| Vault Server | 8001 | Gestionare secrete |
| License Server | 8002 | Validare licențe |
| Email Service | 8003 | Releu SMTP |
| Notification Service | 8004 | Notificări push și alerte |
| Update Server | 8005 | Actualizări agenți și sonde |
| Agent Registry | 8006 | Înrolare și gestionare agenți |
| Warranty Service | 8007 | Căutări garanții hardware |
| CMod Service | 8008 | Managementul configurării |
| IPAM Service | 8009 | Managementul adreselor IP |

Pentru a expune direct un port de serviciu (nerecomandat pentru producție), adăugați-l la maparea `ports` a serviciului în `docker-compose.yml`.

Pentru ajutor, contactați [support@netreconapp.com](mailto:support@netreconapp.com).
