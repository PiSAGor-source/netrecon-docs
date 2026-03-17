---
sidebar_position: 3
title: Konfigurace
description: Proměnné prostředí a referenční příručka konfigurace pro self-hosted NetRecon
---

# Referenční příručka konfigurace

Všechny služby NetRecon jsou konfigurovány prostřednictvím jednoho souboru `.env` umístěného v `/opt/netrecon/.env`. Tato stránka dokumentuje všechny dostupné proměnné prostředí.

## Základní nastavení

| Proměnná | Povinná | Výchozí | Popis |
|---|---|---|---|
| `NETRECON_DOMAIN` | Ano | — | Vaše doménové jméno (např. `netrecon.vasefirma.cz`) |
| `NETRECON_EMAIL` | Ano | — | E-mail administrátora pro Let's Encrypt a oznámení |

## Databáze (PostgreSQL)

| Proměnná | Povinná | Výchozí | Popis |
|---|---|---|---|
| `POSTGRES_USER` | Ano | — | Uživatelské jméno PostgreSQL |
| `POSTGRES_PASSWORD` | Ano | — | Heslo PostgreSQL |
| `POSTGRES_DB` | Ano | `netrecon` | Název databáze |
| `DATABASE_URL` | Auto | — | Sestaveno automaticky z výše uvedených hodnot |

:::tip
Použijte silné, náhodně generované heslo. Vygenerujte ho pomocí:
```bash
openssl rand -base64 24
```
:::

## Mezipaměť (Redis)

| Proměnná | Povinná | Výchozí | Popis |
|---|---|---|---|
| `REDIS_PASSWORD` | Ano | — | Heslo pro autentizaci Redis |
| `REDIS_URL` | Auto | — | Sestaveno automaticky |

## Autentizace

| Proměnná | Povinná | Výchozí | Popis |
|---|---|---|---|
| `JWT_SECRET` | Ano | — | Tajný klíč pro podepisování JWT tokenů (min. 32 znaků) |
| `JWT_EXPIRE_MINUTES` | Ne | `1440` | Doba expirace tokenu (výchozí: 24 hodin) |

Vygenerujte bezpečný JWT secret:
```bash
openssl rand -hex 32
```

## Agent Registry

| Proměnná | Povinná | Výchozí | Popis |
|---|---|---|---|
| `AGENT_REGISTRY_SECRET` | Ano | — | Tajný klíč pro registraci agentů |
| `AGENT_JWT_SECRET` | Ano | — | JWT secret pro autentizaci agentů |
| `AGENT_TOKEN_EXPIRE_MINUTES` | Ne | `1440` | Expirace tokenu agenta |
| `AGENT_HEARTBEAT_INTERVAL` | Ne | `30` | Interval heartbeatu v sekundách |
| `AGENT_HEARTBEAT_TIMEOUT` | Ne | `90` | Počet sekund před označením agenta jako offline |

## E-mail (SMTP)

| Proměnná | Povinná | Výchozí | Popis |
|---|---|---|---|
| `SMTP_HOST` | Ano | — | Název hostitele SMTP serveru |
| `SMTP_PORT` | Ne | `587` | SMTP port (587 pro STARTTLS, 465 pro SSL) |
| `SMTP_USER` | Ano | — | SMTP uživatelské jméno |
| `SMTP_PASSWORD` | Ano | — | SMTP heslo |
| `SMTP_FROM` | Ano | — | Adresa odesílatele (např. `NetRecon <noreply@vasefirma.cz>`) |

## Licence

| Proměnná | Povinná | Výchozí | Popis |
|---|---|---|---|
| `LICENSE_KEY` | Ano | — | Váš licenční klíč NetRecon |

Pro získání licenčního klíče kontaktujte [sales@netreconapp.com](mailto:sales@netreconapp.com).

## Zálohovací služba

| Proměnná | Povinná | Výchozí | Popis |
|---|---|---|---|
| `BACKUP_S3_ENDPOINT` | Ne | — | S3 kompatibilní koncový bod úložiště |
| `BACKUP_S3_BUCKET` | Ne | — | Název bucketu pro zálohy |
| `BACKUP_S3_ACCESS_KEY` | Ne | — | S3 přístupový klíč |
| `BACKUP_S3_SECRET_KEY` | Ne | — | S3 tajný klíč |
| `BACKUP_ENCRYPTION_KEY` | Ne | — | AES-256-GCM šifrovací klíč pro zálohy |
| `BACKUP_RETENTION_DAYS` | Ne | `30` | Počet dní uchovávání záložních souborů |

## Oznámení

| Proměnná | Povinná | Výchozí | Popis |
|---|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Ne | — | Token Telegram bota pro upozornění |
| `TELEGRAM_CHAT_ID` | Ne | — | ID Telegram chatu pro doručování upozornění |

## Ukázkový soubor `.env`

```bash
# Základní
NETRECON_DOMAIN=netrecon.vasefirma.cz
NETRECON_EMAIL=admin@vasefirma.cz

# PostgreSQL
POSTGRES_USER=netrecon
POSTGRES_PASSWORD=xK9mP2vL8nQ4wR7j
POSTGRES_DB=netrecon

# Redis
REDIS_PASSWORD=hT6yN3bF9cM1pW5s

# Autentizace
JWT_SECRET=a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2

# Agent Registry
AGENT_REGISTRY_SECRET=r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3
AGENT_JWT_SECRET=h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9

# E-mail
SMTP_HOST=smtp.vasefirma.cz
SMTP_PORT=587
SMTP_USER=noreply@vasefirma.cz
SMTP_PASSWORD=vase-smtp-heslo
SMTP_FROM=NetRecon <noreply@vasefirma.cz>

# Licence
LICENSE_KEY=vas-licencni-klic
```

:::warning
Nikdy neukládejte soubor `.env` do správy verzí. Všechny výše uvedené hodnoty jsou příklady — před nasazením je nahraďte vlastními bezpečnými hodnotami.
:::

## Aplikace změn konfigurace

Po úpravě souboru `.env` restartujte dotčené služby:

```bash
cd /opt/netrecon

# Restart všech služeb
docker compose down && docker compose up -d

# Nebo restart konkrétní služby
docker compose restart api-gateway
```

## Porty služeb

Všechny služby běží za reverzním proxy Nginx na portech 80/443. Interní porty služeb nejsou ve výchozím nastavení vystaveny:

| Služba | Interní port | Popis |
|---|---|---|
| API Gateway | 8000 | Hlavní API koncový bod |
| Vault Server | 8001 | Správa tajných klíčů |
| License Server | 8002 | Validace licencí |
| Email Service | 8003 | SMTP relay |
| Notification Service | 8004 | Push notifikace a upozornění |
| Update Server | 8005 | Aktualizace agentů a sond |
| Agent Registry | 8006 | Registrace a správa agentů |
| Warranty Service | 8007 | Vyhledávání záruky hardwaru |
| CMod Service | 8008 | Správa konfigurace |
| IPAM Service | 8009 | Správa IP adres |

Pro přímé vystavení portu služby (nedoporučeno pro produkci) ho přidejte do mapování `ports` služby v `docker-compose.yml`.

Pro pomoc kontaktujte [support@netreconapp.com](mailto:support@netreconapp.com).
