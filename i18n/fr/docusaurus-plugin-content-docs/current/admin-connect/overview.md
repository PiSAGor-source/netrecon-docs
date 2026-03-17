---
sidebar_position: 1
title: Présentation d'Admin Connect
description: Application mobile de gestion pour l'administration de la flotte de sondes NetRecon
---

# Admin Connect

Admin Connect est l'application mobile de gestion pour contrôler et surveiller votre flotte de sondes NetRecon. Elle se connecte aux sondes via Cloudflare Tunnel pour un accès distant sécurisé depuis n'importe où.

## Fonctionnalités principales

- **Gestion de flotte** — gérer plusieurs sondes depuis une seule application
- **Surveillance à distance** — visualiser l'état des sondes, les résultats de scan et les alertes en temps réel
- **Alertes IDS** — recevoir et examiner les alertes IDS Suricata
- **Scan de vulnérabilités** — déclencher et examiner les scans de vulnérabilités Nuclei
- **Capture PCAP** — démarrer/arrêter la capture de paquets à distance
- **Surveillance honeypot** — surveiller les tentatives d'intrusion et le comportement des attaquants
- **Détection de rogues** — recevoir des alertes pour l'activité DHCP/ARP non autorisée
- **Moniteur réseau** — suivre la latence et la perte de paquets sur votre réseau
- **VPN WireGuard** — gérer les connexions VPN vers les sondes
- **Intégration ticketing** — créer et gérer des tickets de support
- **SSO/2FA** — authentification d'entreprise avec authentification unique et double facteur
- **Accès basé sur les rôles** — permissions granulaires par rôle utilisateur

## Comment ça fonctionne

Admin Connect **ne possède pas** de moteur de scan propre. C'est purement une interface de gestion à distance pour les sondes NetRecon.

```
┌──────────────┐       HTTPS/WSS        ┌─────────────────┐
│ Admin Connect├───────────────────────►│ Cloudflare Tunnel│
│   (Mobile)   │   (via Cloudflare)      │                 │
└──────────────┘                         └────────┬────────┘
                                                  │
                                         ┌────────▼────────┐
                                         │  NetRecon Probe  │
                                         │  (REST + WS API) │
                                         └─────────────────┘
```

Toute communication entre Admin Connect et la sonde est chiffrée via :
- **HTTPS** pour les appels API REST
- **WebSocket Secure (WSS)** pour les événements en temps réel
- **mTLS** pour l'authentification mutuelle par certificat

## Premiers pas

1. Installez Admin Connect depuis le Google Play Store (package : `com.netreconapp.connect`)
2. Ouvrez l'application et créez votre compte ou connectez-vous avec SSO
3. Ajoutez une sonde en utilisant l'une de ces méthodes :
   - **QR Code** — scannez le QR code depuis l'assistant de configuration ou le tableau de bord de la sonde
   - **Manuel** — entrez l'URL du tunnel de la sonde et le jeton d'authentification
4. La sonde apparaîtra dans votre tableau de bord de flotte

Consultez [Inscription](./enrollment.md) pour des instructions de configuration détaillées.

## Événements en temps réel

Admin Connect maintient une connexion WebSocket persistante avec chaque sonde. Vous recevez des notifications instantanées pour :

| Événement | Description |
|---|---|
| `ids_alert` | Suricata IDS a déclenché une règle |
| `honeypot_hit` | Un attaquant a interagi avec le honeypot |
| `rogue_detected` | DHCP ou usurpation ARP non autorisé détecté |
| `vuln_found` | Le scan de vulnérabilités a trouvé un résultat |
| `host_found` | Nouvel appareil découvert sur le réseau |
| `baseline_diff_alert` | Déviation de la ligne de base réseau détectée |
| `probe_health_alert` | Seuil CPU, RAM ou disque de la sonde dépassé |
| `pcap_ready` | Fichier de capture PCAP prêt au téléchargement |
| `dns_threat` | Le sinkhole DNS a bloqué une menace |

## Actions supportées

Depuis Admin Connect, vous pouvez à distance :

- Démarrer/arrêter les scans réseau
- Visualiser et exporter les résultats de scan
- Démarrer/arrêter la capture PCAP et télécharger les fichiers
- Activer/désactiver la surveillance IDS
- Déclencher des scans de vulnérabilités
- Configurer et gérer le honeypot
- Configurer la détection DHCP/ARP rogue
- Configurer les règles du sinkhole DNS
- Gérer les connexions VPN WireGuard
- Créer des snapshots de sauvegarde
- Restaurer à partir d'une sauvegarde
- Visualiser l'état du système et l'utilisation des ressources
- Gérer les comptes utilisateurs et les rôles

## FAQ

**Q : Admin Connect peut-il fonctionner sans Internet ?**
R : Admin Connect nécessite un accès Internet pour atteindre la sonde via Cloudflare Tunnel. Pour un accès réseau local, utilisez directement le tableau de bord web de la sonde.

**Q : Combien de sondes puis-je gérer ?**
R : Il n'y a pas de limite au nombre de sondes. Admin Connect prend en charge la gestion de flotte à l'échelle de l'entreprise.

**Q : Admin Connect est-il disponible pour iOS ?**
R : Une version iOS est prévue. Actuellement, Admin Connect est disponible pour Android.

Pour obtenir de l'aide supplémentaire, contactez [support@netreconapp.com](mailto:support@netreconapp.com).
