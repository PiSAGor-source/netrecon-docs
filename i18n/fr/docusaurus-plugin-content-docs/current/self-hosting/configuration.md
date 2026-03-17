---
sidebar_position: 3
title: Configuration
description: Variables d'environnement et référence de configuration pour NetRecon auto-hébergé
---

# Référence de configuration

Tous les services NetRecon sont configurés via un fichier `.env` unique situé à `/opt/netrecon/.env`. Cette page documente toutes les variables d'environnement disponibles.

## Paramètres principaux

| Variable | Requis | Par défaut | Description |
|---|---|---|---|
| `NETRECON_DOMAIN` | Oui | — | Votre nom de domaine (par ex., `netrecon.yourcompany.com`) |
| `NETRECON_EMAIL` | Oui | — | E-mail administrateur pour Let's Encrypt et les notifications |

## Base de données (PostgreSQL)

| Variable | Requis | Par défaut | Description |
|---|---|---|---|
| `POSTGRES_USER` | Oui | — | Nom d'utilisateur PostgreSQL |
| `POSTGRES_PASSWORD` | Oui | — | Mot de passe PostgreSQL |
| `POSTGRES_DB` | Oui | `netrecon` | Nom de la base de données |
| `DATABASE_URL` | Auto | — | Construit automatiquement à partir des valeurs ci-dessus |

:::tip
Utilisez un mot de passe fort généré aléatoirement. Générez-en un avec :
```bash
openssl rand -base64 24
```
:::

## Cache (Redis)

| Variable | Requis | Par défaut | Description |
|---|---|---|---|
| `REDIS_PASSWORD` | Oui | — | Mot de passe d'authentification Redis |
| `REDIS_URL` | Auto | — | Construit automatiquement |

## Authentification

| Variable | Requis | Par défaut | Description |
|---|---|---|---|
| `JWT_SECRET` | Oui | — | Clé secrète pour la signature des jetons JWT (min 32 caractères) |
| `JWT_EXPIRE_MINUTES` | Non | `1440` | Durée d'expiration du jeton (par défaut : 24 heures) |

Générez un secret JWT sécurisé :
```bash
openssl rand -hex 32
```

## Registre des agents

| Variable | Requis | Par défaut | Description |
|---|---|---|---|
| `AGENT_REGISTRY_SECRET` | Oui | — | Secret pour l'inscription des agents |
| `AGENT_JWT_SECRET` | Oui | — | Secret JWT pour l'authentification des agents |
| `AGENT_TOKEN_EXPIRE_MINUTES` | Non | `1440` | Expiration du jeton agent |
| `AGENT_HEARTBEAT_INTERVAL` | Non | `30` | Intervalle de battement de cœur en secondes |
| `AGENT_HEARTBEAT_TIMEOUT` | Non | `90` | Secondes avant de marquer un agent hors ligne |

## E-mail (SMTP)

| Variable | Requis | Par défaut | Description |
|---|---|---|---|
| `SMTP_HOST` | Oui | — | Nom d'hôte du serveur SMTP |
| `SMTP_PORT` | Non | `587` | Port SMTP (587 pour STARTTLS, 465 pour SSL) |
| `SMTP_USER` | Oui | — | Nom d'utilisateur SMTP |
| `SMTP_PASSWORD` | Oui | — | Mot de passe SMTP |
| `SMTP_FROM` | Oui | — | Adresse d'expéditeur (par ex., `NetRecon <noreply@yourcompany.com>`) |

## Licence

| Variable | Requis | Par défaut | Description |
|---|---|---|---|
| `LICENSE_KEY` | Oui | — | Votre clé de licence NetRecon |

Contactez [sales@netreconapp.com](mailto:sales@netreconapp.com) pour obtenir une clé de licence.

## Service de sauvegarde

| Variable | Requis | Par défaut | Description |
|---|---|---|---|
| `BACKUP_S3_ENDPOINT` | Non | — | Point de terminaison de stockage compatible S3 |
| `BACKUP_S3_BUCKET` | Non | — | Nom du bucket pour les sauvegardes |
| `BACKUP_S3_ACCESS_KEY` | Non | — | Clé d'accès S3 |
| `BACKUP_S3_SECRET_KEY` | Non | — | Clé secrète S3 |
| `BACKUP_ENCRYPTION_KEY` | Non | — | Clé de chiffrement AES-256-GCM pour les sauvegardes |
| `BACKUP_RETENTION_DAYS` | Non | `30` | Jours de rétention des fichiers de sauvegarde |

## Notifications

| Variable | Requis | Par défaut | Description |
|---|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Non | — | Jeton de bot Telegram pour les alertes |
| `TELEGRAM_CHAT_ID` | Non | — | Identifiant de chat Telegram pour la livraison des alertes |

## Exemple de fichier `.env`

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

# Authentification
JWT_SECRET=a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2

# Registre des agents
AGENT_REGISTRY_SECRET=r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3
AGENT_JWT_SECRET=h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9

# E-mail
SMTP_HOST=smtp.yourcompany.com
SMTP_PORT=587
SMTP_USER=noreply@yourcompany.com
SMTP_PASSWORD=your-smtp-password
SMTP_FROM=NetRecon <noreply@yourcompany.com>

# Licence
LICENSE_KEY=your-license-key
```

:::warning
Ne commitez jamais le fichier `.env` dans le contrôle de version. Toutes les valeurs montrées ci-dessus sont des exemples — remplacez-les par vos propres valeurs sécurisées avant le déploiement.
:::

## Appliquer les modifications de configuration

Après avoir modifié le fichier `.env`, redémarrez les services concernés :

```bash
cd /opt/netrecon

# Redémarrer tous les services
docker compose down && docker compose up -d

# Ou redémarrer un service spécifique
docker compose restart api-gateway
```

## Ports des services

Tous les services fonctionnent derrière le reverse proxy Nginx sur les ports 80/443. Les ports de service internes ne sont pas exposés par défaut :

| Service | Port interne | Description |
|---|---|---|
| API Gateway | 8000 | Point de terminaison API principal |
| Vault Server | 8001 | Gestion des secrets |
| License Server | 8002 | Validation des licences |
| Email Service | 8003 | Relais SMTP |
| Notification Service | 8004 | Notifications push et alertes |
| Update Server | 8005 | Mises à jour des agents et sondes |
| Agent Registry | 8006 | Inscription et gestion des agents |
| Warranty Service | 8007 | Recherche de garantie matérielle |
| CMod Service | 8008 | Gestion de configuration |
| IPAM Service | 8009 | Gestion des adresses IP |

Pour exposer directement un port de service (non recommandé en production), ajoutez-le au mappage `ports` du service dans `docker-compose.yml`.

Pour obtenir de l'aide, contactez [support@netreconapp.com](mailto:support@netreconapp.com).
