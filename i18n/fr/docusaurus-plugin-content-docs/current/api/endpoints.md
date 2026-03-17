---
sidebar_position: 2
title: Référence des points de terminaison
description: Référence complète des points de terminaison API regroupés par service et catégorie
---

# Référence des points de terminaison

Cette page liste chaque point de terminaison API REST de la plateforme NetRecon, regroupé par catégorie de service. Tous les points de terminaison nécessitent une authentification par jeton JWT Bearer sauf indication contraire. Consultez la [Présentation de l'API](./overview.md) pour les détails d'authentification et de limitation de débit.

**URL de base :** `https://probe.netreconapp.com/api/`

---

## Points de terminaison de la sonde

Servis par le backend Go fonctionnant sur l'appliance sonde (Orange Pi R2S, Raspberry Pi ou mini PC x86_64).

### Santé

| Méthode | Chemin | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | Non | Vérification de santé de la sonde. Renvoie `{"status": "ok", "version": "1.0.0"}`. |

### Scan

| Méthode | Chemin | Description |
|---|---|---|
| `POST` | `/api/scan/discover` | Démarrer la découverte d'hôtes ARP sur le sous-réseau configuré. |
| `POST` | `/api/scan/ports` | Démarrer un scan de ports sur les hôtes découverts. |
| `GET` | `/api/scan/status` | Obtenir le statut actuel du scan (idle, running, complete). |

### Appareils

| Méthode | Chemin | Description |
|---|---|---|
| `GET` | `/api/devices` | Lister tous les appareils découverts. Supporte la pagination (`?page=&per_page=`). |
| `GET` | `/api/devices/:mac` | Obtenir les détails d'un appareil par adresse MAC. |
| `PUT` | `/api/devices/:mac/note` | Mettre à jour la note utilisateur sur un appareil. Corps : `{"note": "..."}`. |

### Ligne de base

| Méthode | Chemin | Description |
|---|---|---|
| `GET` | `/api/baseline` | Lister toutes les lignes de base réseau enregistrées. |
| `POST` | `/api/baseline` | Créer un nouveau snapshot de ligne de base à partir de la liste actuelle des appareils. |
| `GET` | `/api/baseline/:id/diff` | Comparer une ligne de base avec l'état actuel du réseau. |

### Voisins (CDP/LLDP)

| Méthode | Chemin | Description |
|---|---|---|
| `GET` | `/api/neighbors` | Lister les voisins CDP/LLDP découverts. |
| `POST` | `/api/neighbors/start` | Démarrer l'écoute de découverte de voisins. |

### Sauvegarde de configuration (locale à la sonde)

| Méthode | Chemin | Description |
|---|---|---|
| `GET` | `/api/config/targets` | Lister les appareils cibles de sauvegarde configurés. |
| `POST` | `/api/config/targets` | Ajouter un nouvel appareil cible de sauvegarde. |
| `POST` | `/api/config/targets/:id/check` | Déclencher une vérification de configuration immédiate pour une cible. |

### Capture PCAP

| Méthode | Chemin | Description |
|---|---|---|
| `POST` | `/api/pcap/start` | Démarrer la capture de paquets. Corps : `{"interface": "eth0", "filter": "tcp port 80"}`. |
| `POST` | `/api/pcap/stop` | Arrêter la capture de paquets en cours. |
| `GET` | `/api/pcap/files` | Lister les fichiers de capture PCAP disponibles. |
| `GET` | `/api/pcap/download/:id` | Télécharger un fichier PCAP par ID. Renvoie `application/octet-stream`. |

### IDS (Suricata)

| Méthode | Chemin | Description |
|---|---|---|
| `GET` | `/api/ids/status` | Obtenir le statut du service IDS (running, stopped, nombre de règles). |
| `POST` | `/api/ids/start` | Démarrer la surveillance IDS Suricata. |
| `POST` | `/api/ids/stop` | Arrêter la surveillance IDS. |
| `GET` | `/api/ids/alerts` | Lister les alertes IDS. Supporte le filtre temporel `?since=24h`. |

### Scan de vulnérabilités (Nuclei)

| Méthode | Chemin | Description |
|---|---|---|
| `POST` | `/api/vuln/scan` | Démarrer un scan de vulnérabilités contre les cibles spécifiées. |
| `POST` | `/api/vuln/stop` | Arrêter le scan de vulnérabilités en cours. |
| `GET` | `/api/vuln/results` | Obtenir les résultats du scan de vulnérabilités. |
| `GET` | `/api/vuln/status` | Obtenir le statut du scanner de vulnérabilités. |

### Honeypot

| Méthode | Chemin | Description |
|---|---|---|
| `GET` | `/api/honeypot/status` | Obtenir le statut du service honeypot. |
| `POST` | `/api/honeypot/start` | Démarrer le service honeypot. |
| `POST` | `/api/honeypot/stop` | Arrêter le service honeypot. |
| `GET` | `/api/honeypot/hits` | Lister les événements d'interaction avec le honeypot. |

### Détection de rogues

| Méthode | Chemin | Description |
|---|---|---|
| `GET` | `/api/rogue/status` | Obtenir le statut du service de détection de rogues. |
| `POST` | `/api/rogue/start` | Démarrer la détection DHCP/ARP rogue. |
| `POST` | `/api/rogue/stop` | Arrêter la détection de rogues. |
| `GET` | `/api/rogue/alerts` | Lister les alertes DHCP rogue et d'usurpation ARP. |

### Moniteur réseau

| Méthode | Chemin | Description |
|---|---|---|
| `POST` | `/api/monitor/targets` | Ajouter une cible de surveillance (IP ou nom d'hôte). |
| `GET` | `/api/monitor/targets` | Lister les cibles de surveillance configurées. |
| `POST` | `/api/monitor/start` | Démarrer la surveillance réseau. |
| `POST` | `/api/monitor/stop` | Arrêter la surveillance réseau. |
| `GET` | `/api/monitor/latency` | Obtenir les mesures de latence pour les cibles surveillées. |
| `GET` | `/api/monitor/packetloss` | Obtenir les données de perte de paquets pour les cibles surveillées. |
| `GET` | `/api/monitor/status` | Obtenir le statut du service de surveillance. |

### VPN (WireGuard)

| Méthode | Chemin | Description |
|---|---|---|
| `POST` | `/api/vpn/setup` | Configurer les paramètres VPN WireGuard. |
| `GET` | `/api/vpn/status` | Obtenir le statut de la connexion VPN. |
| `POST` | `/api/vpn/start` | Démarrer le tunnel VPN. |
| `POST` | `/api/vpn/stop` | Arrêter le tunnel VPN. |
| `GET` | `/api/vpn/config` | Télécharger la configuration WireGuard. |

### Sinkhole DNS

| Méthode | Chemin | Description |
|---|---|---|
| `GET` | `/api/dns/status` | Obtenir le statut du service sinkhole DNS. |
| `POST` | `/api/dns/start` | Démarrer le sinkhole DNS. |
| `POST` | `/api/dns/stop` | Arrêter le sinkhole DNS. |
| `GET` | `/api/dns/threats` | Lister les entrées de menaces DNS bloquées. |

### Santé du système

| Méthode | Chemin | Description |
|---|---|---|
| `GET` | `/api/system/health` | Santé détaillée du système (CPU, RAM, disque, température). |
| `GET` | `/api/system/history` | Points de données historiques de santé du système. |
| `GET` | `/api/system/alerts` | Lister les alertes de seuil de santé du système. |
| `POST` | `/api/system/thresholds` | Configurer les seuils d'alerte de santé (CPU %, RAM %, disque %). |

### Sauvegarde et restauration

| Méthode | Chemin | Description |
|---|---|---|
| `POST` | `/api/backup/create` | Créer une sauvegarde complète de la sonde (config + base de données). |
| `GET` | `/api/backup/list` | Lister les fichiers de sauvegarde disponibles. |
| `GET` | `/api/backup/download/:id` | Télécharger une archive de sauvegarde. Renvoie `application/octet-stream`. |
| `POST` | `/api/backup/restore` | Restaurer la sonde à partir d'un fichier de sauvegarde. |

### Ticketing

| Méthode | Chemin | Description |
|---|---|---|
| `GET` | `/api/ticketing/config` | Obtenir la configuration actuelle de l'intégration ticketing. |
| `POST` | `/api/ticketing/config` | Définir la configuration de ticketing (ServiceNow, Jira, URL webhook). |
| `POST` | `/api/ticketing/test` | Envoyer un ticket de test pour valider l'intégration. |
| `POST` | `/api/ticketing/create` | Créer un ticket à partir d'une alerte ou d'un événement. |
| `GET` | `/api/ticketing/history` | Lister les tickets précédemment créés. |

### WebSocket

| Méthode | Chemin | Description |
|---|---|---|
| `GET` | `/ws/events` | Connexion WebSocket pour les événements en temps réel de la sonde. Passez le jeton via query : `?token=<jwt>`. |

#### Types d'événements WebSocket

| Événement | Description |
|---|---|
| `host_found` | Nouvel appareil découvert |
| `port_found` | Port ouvert détecté sur un appareil |
| `scan_complete` | Scan réseau terminé |
| `neighbor_discovered` | Voisin CDP/LLDP trouvé |
| `config_changed` | Configuration d'appareil modifiée |
| `baseline_diff_alert` | Déviation de la ligne de base réseau détectée |
| `ids_alert` | Règle IDS déclenchée |
| `honeypot_hit` | Interaction avec le honeypot détectée |
| `rogue_detected` | Activité DHCP ou ARP rogue |
| `pcap_ready` | Fichier PCAP prêt au téléchargement |
| `vuln_found` | Vulnérabilité découverte |
| `dns_threat` | Menace DNS bloquée |
| `probe_health_alert` | Seuil de ressource de la sonde dépassé |
| `error` | Événement d'erreur |

---

## Points de terminaison de l'API Gateway

Servis par l'API Gateway FastAPI (port 8000). Gère l'authentification, la gestion des utilisateurs, le RBAC et le routage proxy vers les services backend.

### Authentification

| Méthode | Chemin | Description |
|---|---|---|
| `POST` | `/api/auth/login` | S'authentifier avec nom d'utilisateur/mot de passe, recevoir un jeton JWT. |
| `POST` | `/api/auth/refresh` | Rafraîchir un jeton JWT expirant. |

### Utilisateurs

| Méthode | Chemin | Description |
|---|---|---|
| `GET` | `/api/users` | Lister les utilisateurs de l'organisation. |
| `POST` | `/api/users` | Créer un nouveau compte utilisateur. |
| `GET` | `/api/users/:id` | Obtenir les détails d'un utilisateur. |
| `PUT` | `/api/users/:id` | Mettre à jour un utilisateur. |
| `DELETE` | `/api/users/:id` | Supprimer un utilisateur. |

### RBAC (Contrôle d'accès basé sur les rôles)

| Méthode | Chemin | Description |
|---|---|---|
| `GET` | `/api/rbac/roles` | Lister tous les rôles définis. |
| `POST` | `/api/rbac/roles` | Créer un rôle personnalisé avec des permissions spécifiques. |
| `PUT` | `/api/rbac/roles/:id` | Mettre à jour les permissions d'un rôle. |
| `DELETE` | `/api/rbac/roles/:id` | Supprimer un rôle. |
| `GET` | `/api/rbac/permissions` | Lister toutes les permissions disponibles. |

### Clés API

| Méthode | Chemin | Description |
|---|---|---|
| `GET` | `/api/keys` | Lister les clés API de l'organisation. |
| `POST` | `/api/keys` | Créer une nouvelle clé API longue durée. |
| `DELETE` | `/api/keys/:id` | Révoquer une clé API. |

### Liste blanche IP

| Méthode | Chemin | Description |
|---|---|---|
| `GET` | `/api/ip-allowlist` | Lister les plages IP autorisées. |
| `POST` | `/api/ip-allowlist` | Ajouter une IP ou plage CIDR à la liste blanche. |
| `DELETE` | `/api/ip-allowlist/:id` | Supprimer une plage IP de la liste blanche. |

### Surveillance (Proxy Prometheus)

| Méthode | Chemin | Description |
|---|---|---|
| `GET` | `/api/monitoring/metrics` | Proxy vers le point de terminaison de métriques Prometheus. |
| `GET` | `/api/monitoring/query` | Proxy d'une requête PromQL vers Prometheus. |

### Oxidized (Proxy de sauvegarde de configuration)

| Méthode | Chemin | Description |
|---|---|---|
| `GET` | `/api/oxidized/nodes` | Lister les nœuds réseau gérés par Oxidized. |
| `GET` | `/api/oxidized/nodes/:name` | Obtenir l'historique de configuration d'un nœud. |
| `POST` | `/api/oxidized/nodes` | Ajouter un nœud à la gestion Oxidized. |

### Configuration Vault

| Méthode | Chemin | Description |
|---|---|---|
| `GET` | `/api/vault/config` | Obtenir les paramètres d'intégration vault. |
| `POST` | `/api/vault/config` | Mettre à jour les paramètres d'intégration vault. |

---

## Points de terminaison du service IPAM

Service de gestion des adresses IP (port 8009). Tous les chemins sont préfixés par `/api/v1/ipam`.

### Préfixes (Sous-réseaux)

| Méthode | Chemin | Description |
|---|---|---|
| `GET` | `/api/v1/ipam/prefixes` | Lister tous les préfixes/sous-réseaux gérés. |
| `POST` | `/api/v1/ipam/prefixes` | Créer un nouveau préfixe. Corps : `prefix` (notation CIDR), `description`, `site`, `status`, optionnel `vlan_id`. |
| `GET` | `/api/v1/ipam/prefixes/:id` | Obtenir un préfixe avec pourcentage d'utilisation recalculé. |
| `PUT` | `/api/v1/ipam/prefixes/:id` | Mettre à jour un préfixe. |
| `DELETE` | `/api/v1/ipam/prefixes/:id` | Supprimer un préfixe. Renvoie `204 No Content`. |
| `GET` | `/api/v1/ipam/prefixes/:id/available` | Lister les IP non allouées dans le préfixe. Limité à 256 résultats. |
| `POST` | `/api/v1/ipam/prefixes/:id/next-available` | Allouer la prochaine IP libre dans le préfixe. Renvoie le nouvel enregistrement d'adresse. |

### Adresses

| Méthode | Chemin | Description |
|---|---|---|
| `GET` | `/api/v1/ipam/addresses` | Lister les adresses. Filtres : `?prefix_id=`, `?status=`, `?vendor=`, `?search=`. Max 1000 résultats. |
| `POST` | `/api/v1/ipam/addresses` | Créer un nouvel enregistrement d'adresse IP. |
| `GET` | `/api/v1/ipam/addresses/:id` | Obtenir une adresse par UUID. |
| `PUT` | `/api/v1/ipam/addresses/:id` | Mettre à jour un enregistrement d'adresse. |
| `DELETE` | `/api/v1/ipam/addresses/:id` | Supprimer un enregistrement d'adresse. Renvoie `204 No Content`. |
| `POST` | `/api/v1/ipam/addresses/bulk-import` | Upsert en masse des adresses par IP. Les enregistrements existants sont mis à jour, les nouveaux sont créés. |

### VLANs

| Méthode | Chemin | Description |
|---|---|---|
| `GET` | `/api/v1/ipam/vlans` | Lister tous les VLANs, triés par VLAN ID. |
| `POST` | `/api/v1/ipam/vlans` | Créer un nouvel enregistrement VLAN. Corps : `vlan_id`, `name`, `description`, `status`. |
| `PUT` | `/api/v1/ipam/vlans/:id` | Mettre à jour un VLAN. |
| `DELETE` | `/api/v1/ipam/vlans/:id` | Supprimer un VLAN. Renvoie `204 No Content`. |

### Analytique

| Méthode | Chemin | Description |
|---|---|---|
| `GET` | `/api/v1/ipam/stats` | Statistiques globales IPAM : total préfixes, total adresses, utilisation moyenne, nombre de conflits. |
| `GET` | `/api/v1/ipam/utilization` | Répartition de l'utilisation par préfixe avec comptage des adresses. |
| `GET` | `/api/v1/ipam/conflicts` | Trouver les assignations conflictuelles (MAC en double avec des IP différentes). |

### Import / Export

| Méthode | Chemin | Description |
|---|---|---|
| `POST` | `/api/v1/ipam/import/scan` | Importer les appareils depuis un payload de scan NetRecon. Upserts par IP avec correspondance automatique de préfixe. |
| `GET` | `/api/v1/ipam/export/csv` | Exporter toutes les adresses en CSV. Renvoie `text/csv` avec en-tête `Content-Disposition`. |
| `GET` | `/api/v1/ipam/export/json` | Exporter toutes les données IPAM (préfixes, adresses, VLANs) en JSON. |

---

## Points de terminaison du service CMod

Configuration Management on Demand (port 8008). Fournit un accès SSH et console série aux équipements réseau. Tous les chemins sont préfixés par `/api/v1/cmod`.

### Sessions

| Méthode | Chemin | Description |
|---|---|---|
| `POST` | `/api/v1/cmod/connect` | Ouvrir une nouvelle session SSH ou série. Corps : `host`, `device_type`, `username`, `password`, optionnel `port`, `serial_port`. Renvoie les infos de session avec `session_id`. |
| `POST` | `/api/v1/cmod/disconnect` | Fermer une session. Query : `?session_id=`. |
| `GET` | `/api/v1/cmod/sessions` | Lister toutes les sessions actives. |
| `GET` | `/api/v1/cmod/sessions/:session_id` | Obtenir les détails d'une session et le journal complet des commandes. |
| `DELETE` | `/api/v1/cmod/sessions/:session_id` | Terminer une session. |

### Commandes

| Méthode | Chemin | Description |
|---|---|---|
| `POST` | `/api/v1/cmod/send-command` | Envoyer une commande unique. Corps : `session_id`, `command`, optionnel `expect_string`, `read_timeout`. |
| `POST` | `/api/v1/cmod/send-batch` | Envoyer plusieurs commandes séquentiellement. Corps : `session_id`, `commands[]`, optionnel `delay_factor`. |

### Opérations de configuration

| Méthode | Chemin | Description |
|---|---|---|
| `POST` | `/api/v1/cmod/backup` | Récupérer la configuration active d'un appareil. Sélectionne automatiquement la bonne commande par fabricant (Cisco IOS/NX-OS/XR, Huawei, Juniper, Arista, HP). |
| `POST` | `/api/v1/cmod/rollback` | Pousser un extrait de configuration vers l'appareil en mode config. Corps : `session_id`, `config` (chaîne multiligne). |

### Modèles

| Méthode | Chemin | Description |
|---|---|---|
| `GET` | `/api/v1/cmod/templates` | Lister les modèles de commandes. Filtres : `?vendor=cisco_ios`, `?category=backup`. Modèles pré-chargés pour Cisco IOS, Huawei et Juniper JunOS. |
| `POST` | `/api/v1/cmod/templates` | Créer un modèle de commande personnalisé. Corps : `name`, `vendor`, `category`, `commands[]`, `description`. |

---

## Points de terminaison du registre des agents

Service de gestion des agents (port 8006). Gère l'inscription, les battements de cœur, l'inventaire et le déploiement pour les agents Windows, macOS et Linux.

### Cycle de vie de l'agent

| Méthode | Chemin | Description |
|---|---|---|
| `POST` | `/agents/enroll` | Inscrire un nouvel agent avec un jeton de déploiement. Corps : `deployment_token`, `hostname`, `os_type`, `os_version`, `arch`, `agent_version`. |
| `POST` | `/agents/heartbeat` | Battement de cœur de l'agent. En-têtes : `X-Agent-ID`, `X-Session-Key`. |
| `POST` | `/agents/inventory` | Pousser l'inventaire matériel/logiciel. En-têtes : `X-Agent-ID`, `X-Session-Key`. |
| `GET` | `/agents` | Lister tous les agents de l'organisation. En-tête : `X-Org-ID`. |
| `GET` | `/agents/:agent_id` | Obtenir les détails complets d'un agent incluant les spécifications matérielles et le statut de garantie. |
| `DELETE` | `/agents/:agent_id` | Supprimer un agent du registre. |

### Jetons de déploiement

| Méthode | Chemin | Description |
|---|---|---|
| `POST` | `/agents/tokens` | Créer un jeton de déploiement. En-têtes : `X-Org-ID`, `X-User-ID`. Corps : `expires_in_hours`, `max_uses`, `label`, optionnel `site_id`, `metadata`. Renvoie la chaîne du jeton et les commandes d'installation spécifiques à la plateforme. |
| `GET` | `/agents/tokens` | Lister les jetons de déploiement de l'organisation. En-tête : `X-Org-ID`. |
| `DELETE` | `/agents/tokens/:token_id` | Révoquer un jeton de déploiement. |

### Générateur de packages de déploiement

| Méthode | Chemin | Description |
|---|---|---|
| `POST` | `/agents/deploy/generate` | Générer des artefacts de déploiement spécifiques à la plateforme. Corps : `platform` (windows, linux, macos, ios, android), `method` (msi, powershell, sccm, intune, gpo, pkg, brew, jamf, mdm, deb, rpm, bash, docker, qr, email, mdm_app, managed_play), `role`. Renvoie le jeton d'inscription, les commandes d'installation, les scripts ou le contenu du manifeste. |
| `GET` | `/agents/deploy/quota` | Obtenir l'utilisation du quota d'appareils de l'organisation. En-tête : `X-Org-ID`. |
| `GET` | `/agents/deploy/platforms` | Lister toutes les plateformes supportées et leurs méthodes de déploiement disponibles. Pas d'authentification requise. |

### Connexion à distance

| Méthode | Chemin | Description |
|---|---|---|
| `POST` | `/agents/:agent_id/remote/request` | Demander une nouvelle session distante (RDP, SSH, VNC, ADB) vers un agent inscrit. En-tête : `X-User-ID`. Corps : `session_type`, optionnel `credential_id`, `timeout_hours`. |
| `GET` | `/agents/:agent_id/remote/status` | Obtenir le statut de disponibilité distante (état en ligne, IP Headscale, types de session disponibles). |
| `POST` | `/agents/:agent_id/remote/end` | Terminer la session distante active pour un agent. En-tête : `X-User-ID`. |
| `GET` | `/remote/sessions` | Lister les sessions distantes de l'organisation. En-tête : `X-Org-ID`. Query : `?active_only=true` (par défaut). |
| `POST` | `/agents/:agent_id/remote/ready` | Callback de l'agent lorsque le service distant est préparé. En-têtes : `X-Agent-ID`, `X-Session-Key`. |
| `POST` | `/remote/cleanup` | Expirer les sessions distantes obsolètes. Destiné à un usage interne planificateur/cron. |

---

## Points de terminaison du service Diplomat

Service de classification d'e-mails et d'analyse de journaux (port 8010). Tous les chemins sont préfixés par `/api/v1/diplomat`.

### Classification

| Méthode | Chemin | Description |
|---|---|---|
| `POST` | `/api/v1/diplomat/classify` | Classifier un texte d'entrée (ticket, alerte, e-mail) dans une catégorie et un niveau de priorité. |
| `POST` | `/api/v1/diplomat/summarize` | Générer un résumé du texte fourni. |
| `POST` | `/api/v1/diplomat/translate` | Traduire du texte vers une langue cible spécifiée. |
| `POST` | `/api/v1/diplomat/analyze-log` | Analyser un extrait de journal et extraire les événements clés, erreurs et motifs. |

### Pipeline e-mail

| Méthode | Chemin | Description |
|---|---|---|
| `GET` | `/api/v1/diplomat/emails/stats` | Obtenir les statistiques de traitement des e-mails (reçus, classifiés, comptage de réponses). |
| `GET` | `/api/v1/diplomat/emails/recent` | Lister les e-mails récemment traités. |

### Santé

| Méthode | Chemin | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/diplomat/health` | Non | Vérification de santé du service Diplomat. |

---

## Points de terminaison de santé des services

Chaque microservice expose un point de terminaison `/health` pour la surveillance interne et les vérifications de répartiteur de charge.

| Service | URL | Port |
|---|---|---|
| API Gateway | `/health` | 8000 |
| Vault Server | `/health` | 8001 |
| License Server | `/health` | 8002 |
| Email Service | `/health` | 8003 |
| Notification Service | `/health` | 8004 |
| Update Server | `/health` | 8005 |
| Agent Registry | `/health` | 8006 |
| Warranty Service | `/health` | 8007 |
| CMod Service | `/health` | 8008 |
| IPAM Service | `/health` | 8009 |
| Diplomat Service | `/health` | 8010 |

---

## Support

Pour les questions ou problèmes liés à l'API, contactez [support@netreconapp.com](mailto:support@netreconapp.com).
