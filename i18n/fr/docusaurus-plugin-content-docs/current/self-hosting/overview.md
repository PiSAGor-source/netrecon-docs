---
sidebar_position: 1
title: Présentation de l'auto-hébergement
description: Exécutez la plateforme NetRecon sur votre propre infrastructure
---

# Auto-hébergement

NetRecon peut être entièrement auto-hébergé sur votre propre infrastructure, vous donnant un contrôle complet sur vos données, votre sécurité et votre déploiement.

## Pourquoi auto-héberger ?

| Avantage | Description |
|---|---|
| **Souveraineté des données** | Tous les résultats de scan, configurations et journaux restent sur vos serveurs |
| **Conformité** | Répondez aux exigences réglementaires imposant le stockage des données sur site |
| **Isolation réseau** | Fonctionnez dans des environnements isolés sans dépendance à Internet |
| **Intégration personnalisée** | Accès direct à la base de données pour les rapports et intégrations personnalisés |
| **Maîtrise des coûts** | Pas de licence par sonde pour l'infrastructure serveur |

## Architecture

Un déploiement NetRecon auto-hébergé se compose de plusieurs microservices fonctionnant dans des conteneurs Docker :

```
┌────────────────────────────────────────────────────────┐
│                    Docker Host                         │
│                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │ API Gateway  │  │ Vault Server │  │  License     ││
│  │   :8000      │  │   :8001      │  │  Server :8002││
│  └──────────────┘  └──────────────┘  └──────────────┘│
│                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │ Email        │  │ Notification │  │  Update      ││
│  │ Service :8003│  │ Service :8004│  │  Server :8005││
│  └──────────────┘  └──────────────┘  └──────────────┘│
│                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │ Agent        │  │ Warranty     │  │  CMod        ││
│  │ Registry:8006│  │ Service :8007│  │  Service:8008││
│  └──────────────┘  └──────────────┘  └──────────────┘│
│                                                        │
│  ┌──────────────┐  ┌──────────────┐                   │
│  │ IPAM         │  │ PostgreSQL   │                   │
│  │ Service :8009│  │   :5432      │                   │
│  └──────────────┘  └──────────────┘                   │
│                                                        │
│  ┌──────────────┐  ┌──────────────┐                   │
│  │ Redis        │  │ Nginx        │                   │
│  │   :6379      │  │ Reverse Proxy│                   │
│  └──────────────┘  └──────────────┘                   │
└────────────────────────────────────────────────────────┘
```

## Aperçu des services

| Service | Port | Fonction |
|---|---|---|
| API Gateway | 8000 | Routage central des API, authentification |
| Vault Server | 8001 | Gestion des secrets, stockage des identifiants |
| License Server | 8002 | Validation et gestion des licences |
| Email Service | 8003 | Notifications et alertes par e-mail |
| Notification Service | 8004 | Notifications push, webhooks |
| Update Server | 8005 | Distribution des mises à jour des sondes et agents |
| Agent Registry | 8006 | Inscription et gestion des agents |
| Warranty Service | 8007 | Suivi de la garantie matérielle |
| CMod Service | 8008 | Gestion de configuration des équipements réseau |
| IPAM Service | 8009 | Gestion des adresses IP |

## Options de déploiement

### Docker Compose (Recommandé)

Le moyen le plus simple de déployer tous les services. Adapté aux déploiements de petite et moyenne taille.

Consultez le [Guide d'installation](./installation.md) pour des instructions détaillées.

### Kubernetes

Pour les déploiements à grande échelle nécessitant haute disponibilité et mise à l'échelle horizontale. Des charts Helm sont disponibles pour chaque service.

### Binaire unique

Pour les déploiements minimaux, un binaire unique regroupe tous les services. Adapté aux tests ou aux très petits environnements.

## Configuration requise

| Exigence | Minimum | Recommandé |
|---|---|---|
| OS | Ubuntu 22.04 / Debian 12 | Ubuntu 24.04 LTS |
| CPU | 2 cœurs | 4+ cœurs |
| RAM | 4 Go | 8 Go |
| Disque | 40 Go | 100 Go SSD |
| Docker | v24.0+ | Dernière version stable |
| Docker Compose | v2.20+ | Dernière version stable |

## Réseau

| Port | Protocole | Fonction |
|---|---|---|
| 443 | HTTPS | Tableau de bord web et API (via reverse proxy) |
| 80 | HTTP | Redirection vers HTTPS |
| 5432 | TCP | PostgreSQL (interne, non exposé) |
| 6379 | TCP | Redis (interne, non exposé) |

Seuls les ports 80 et 443 doivent être exposés à l'extérieur. Tous les ports de service internes sont accessibles uniquement au sein du réseau Docker.

## Stockage des données

| Données | Stockage | Sauvegarde |
|---|---|---|
| Base de données PostgreSQL | Volume Docker | pg_dump quotidien |
| Fichiers de configuration | Montage bind | Sauvegarde de fichiers |
| Fichiers téléchargés | Volume Docker | Sauvegarde de fichiers |
| Journaux | Volume Docker | Rotation des journaux |
| Certificats TLS | Montage bind | Sauvegarde sécurisée |

## Sécurité

Les déploiements auto-hébergés incluent toutes les fonctionnalités de sécurité :

- Chiffrement TLS pour toutes les communications externes
- Authentification basée sur JWT
- Contrôle d'accès basé sur les rôles
- Journalisation d'audit
- Vérification d'intégrité Steel Shield (voir [Steel Shield](./steel-shield.md))

## FAQ

**Q : Puis-je exécuter l'auto-hébergement sans Docker ?**
R : Docker Compose est la méthode de déploiement recommandée et supportée. L'exécution directe des services sur l'hôte est possible mais n'est pas officiellement supportée.

**Q : Comment les sondes se connectent-elles à un serveur auto-hébergé ?**
R : Configurez les sondes pour pointer vers l'URL de votre serveur au lieu du point de terminaison Cloudflare Tunnel par défaut. Mettez à jour le `server_url` dans la configuration de la sonde.

**Q : Un tableau de bord web est-il inclus ?**
R : Oui. L'API Gateway sert le tableau de bord web à l'URL racine. Accédez-y via votre domaine configuré (par ex., `https://netrecon.yourcompany.com`).

**Q : Puis-je exécuter ceci dans un environnement isolé ?**
R : Oui. Pré-téléchargez les images Docker et transférez-les sur votre serveur isolé. La validation de licence peut être configurée en mode hors ligne.

Pour obtenir de l'aide supplémentaire, contactez [support@netreconapp.com](mailto:support@netreconapp.com).
