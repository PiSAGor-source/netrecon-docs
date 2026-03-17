---
sidebar_position: 3
title: Configurazione
description: Variabili d'ambiente e riferimento alla configurazione per NetRecon self-hosted
---

# Riferimento alla Configurazione

Tutti i servizi NetRecon sono configurati tramite un singolo file `.env` situato in `/opt/netrecon/.env`. Questa pagina documenta ogni variabile d'ambiente disponibile.

## Impostazioni Principali

| Variabile | Obbligatoria | Predefinito | Descrizione |
|---|---|---|---|
| `NETRECON_DOMAIN` | Sì | — | Il tuo nome di dominio (es. `netrecon.tuaazienda.com`) |
| `NETRECON_EMAIL` | Sì | — | Email dell'amministratore per Let's Encrypt e notifiche |

## Database (PostgreSQL)

| Variabile | Obbligatoria | Predefinito | Descrizione |
|---|---|---|---|
| `POSTGRES_USER` | Sì | — | Nome utente PostgreSQL |
| `POSTGRES_PASSWORD` | Sì | — | Password PostgreSQL |
| `POSTGRES_DB` | Sì | `netrecon` | Nome del database |
| `DATABASE_URL` | Auto | — | Costruito automaticamente dai valori sopra |

:::tip
Usa una password forte, generata casualmente. Generane una con:
```bash
openssl rand -base64 24
```
:::

## Cache (Redis)

| Variabile | Obbligatoria | Predefinito | Descrizione |
|---|---|---|---|
| `REDIS_PASSWORD` | Sì | — | Password di autenticazione Redis |
| `REDIS_URL` | Auto | — | Costruito automaticamente |

## Autenticazione

| Variabile | Obbligatoria | Predefinito | Descrizione |
|---|---|---|---|
| `JWT_SECRET` | Sì | — | Chiave segreta per la firma dei token JWT (min 32 caratteri) |
| `JWT_EXPIRE_MINUTES` | No | `1440` | Tempo di scadenza del token (predefinito: 24 ore) |

Genera un segreto JWT sicuro:
```bash
openssl rand -hex 32
```

## Agent Registry

| Variabile | Obbligatoria | Predefinito | Descrizione |
|---|---|---|---|
| `AGENT_REGISTRY_SECRET` | Sì | — | Segreto per la registrazione degli agent |
| `AGENT_JWT_SECRET` | Sì | — | Segreto JWT per l'autenticazione degli agent |
| `AGENT_TOKEN_EXPIRE_MINUTES` | No | `1440` | Scadenza del token agent |
| `AGENT_HEARTBEAT_INTERVAL` | No | `30` | Intervallo di heartbeat in secondi |
| `AGENT_HEARTBEAT_TIMEOUT` | No | `90` | Secondi prima di segnare l'agent come offline |

## Email (SMTP)

| Variabile | Obbligatoria | Predefinito | Descrizione |
|---|---|---|---|
| `SMTP_HOST` | Sì | — | Hostname del server SMTP |
| `SMTP_PORT` | No | `587` | Porta SMTP (587 per STARTTLS, 465 per SSL) |
| `SMTP_USER` | Sì | — | Nome utente SMTP |
| `SMTP_PASSWORD` | Sì | — | Password SMTP |
| `SMTP_FROM` | Sì | — | Indirizzo del mittente (es. `NetRecon <noreply@tuaazienda.com>`) |

## Licenza

| Variabile | Obbligatoria | Predefinito | Descrizione |
|---|---|---|---|
| `LICENSE_KEY` | Sì | — | La tua chiave di licenza NetRecon |

Contatta [sales@netreconapp.com](mailto:sales@netreconapp.com) per ottenere una chiave di licenza.

## Servizio di Backup

| Variabile | Obbligatoria | Predefinito | Descrizione |
|---|---|---|---|
| `BACKUP_S3_ENDPOINT` | No | — | Endpoint di archiviazione compatibile S3 |
| `BACKUP_S3_BUCKET` | No | — | Nome del bucket per i backup |
| `BACKUP_S3_ACCESS_KEY` | No | — | Chiave di accesso S3 |
| `BACKUP_S3_SECRET_KEY` | No | — | Chiave segreta S3 |
| `BACKUP_ENCRYPTION_KEY` | No | — | Chiave di crittografia AES-256-GCM per i backup |
| `BACKUP_RETENTION_DAYS` | No | `30` | Giorni di conservazione dei file di backup |

## Notifiche

| Variabile | Obbligatoria | Predefinito | Descrizione |
|---|---|---|---|
| `TELEGRAM_BOT_TOKEN` | No | — | Token del bot Telegram per gli avvisi |
| `TELEGRAM_CHAT_ID` | No | — | ID chat Telegram per la consegna degli avvisi |

## File `.env` di Esempio

```bash
# Principale
NETRECON_DOMAIN=netrecon.tuaazienda.com
NETRECON_EMAIL=admin@tuaazienda.com

# PostgreSQL
POSTGRES_USER=netrecon
POSTGRES_PASSWORD=xK9mP2vL8nQ4wR7j
POSTGRES_DB=netrecon

# Redis
REDIS_PASSWORD=hT6yN3bF9cM1pW5s

# Autenticazione
JWT_SECRET=a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2

# Agent Registry
AGENT_REGISTRY_SECRET=r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3
AGENT_JWT_SECRET=h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9

# Email
SMTP_HOST=smtp.tuaazienda.com
SMTP_PORT=587
SMTP_USER=noreply@tuaazienda.com
SMTP_PASSWORD=la-tua-password-smtp
SMTP_FROM=NetRecon <noreply@tuaazienda.com>

# Licenza
LICENSE_KEY=la-tua-chiave-di-licenza
```

:::warning
Non eseguire mai il commit del file `.env` nel controllo di versione. Tutti i valori mostrati sopra sono esempi — sostituiscili con i tuoi valori sicuri prima del deployment.
:::

## Applicare le Modifiche alla Configurazione

Dopo aver modificato il file `.env`, riavvia i servizi interessati:

```bash
cd /opt/netrecon

# Riavvia tutti i servizi
docker compose down && docker compose up -d

# Oppure riavvia un servizio specifico
docker compose restart api-gateway
```

## Porte dei Servizi

Tutti i servizi funzionano dietro il reverse proxy Nginx sulle porte 80/443. Le porte interne dei servizi non sono esposte per impostazione predefinita:

| Servizio | Porta Interna | Descrizione |
|---|---|---|
| API Gateway | 8000 | Endpoint API principale |
| Vault Server | 8001 | Gestione dei segreti |
| License Server | 8002 | Validazione delle licenze |
| Email Service | 8003 | Relay SMTP |
| Notification Service | 8004 | Notifiche push e avvisi |
| Update Server | 8005 | Aggiornamenti per agent e sonde |
| Agent Registry | 8006 | Registrazione e gestione degli agent |
| Warranty Service | 8007 | Ricerche sulle garanzie hardware |
| CMod Service | 8008 | Gestione della configurazione |
| IPAM Service | 8009 | Gestione degli indirizzi IP |

Per esporre direttamente la porta di un servizio (non consigliato per la produzione), aggiungila alla mappatura `ports` del servizio nel `docker-compose.yml`.

Per assistenza, contatta [support@netreconapp.com](mailto:support@netreconapp.com).
