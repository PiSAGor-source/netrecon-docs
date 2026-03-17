---
sidebar_position: 3
title: Configuration requise
description: Exigences matérielles, logicielles et réseau pour NetRecon
---

# Configuration requise

Cette page détaille les exigences minimales et recommandées pour tous les composants NetRecon.

## Matériel de la sonde

### Plateformes supportées

| Appareil | Niveau de support | Notes |
|---|---|---|
| Orange Pi R2S (8 Go) | Principal | Double Ethernet, format compact |
| Raspberry Pi 4 (4/8 Go) | Principal | Largement disponible, bonnes performances |
| Raspberry Pi 5 (4/8 Go) | Principal | Meilleures performances ARM |
| Mini PC x86_64 (Intel N100+) | Principal | Meilleures performances globales, plusieurs NIC |
| Autres SBC ARM64 | Avancé | Peut nécessiter une configuration manuelle |
| Machines virtuelles (VMware/Proxmox/Hyper-V) | Supporté | Réseau en pont requis |

### Spécifications matérielles

| Exigence | Minimum | Recommandé |
|---|---|---|
| Architecture | ARM64 ou x86_64 | ARM64 quad-core ou x86_64 |
| Cœurs CPU | 2 | 4+ |
| RAM | 4 Go | 8 Go |
| Stockage | 16 Go (eMMC/SD/SSD) | 32 Go SSD |
| Ports Ethernet | 1 | 2+ (pour le mode pont/TAP) |
| USB | Non requis | USB-A pour adaptateur console série |
| Alimentation | 5V/3A (SBC) | PoE ou jack barrel |

### Considérations de stockage

- **16 Go** suffisent pour le scan et la surveillance de base
- **32 Go+** sont recommandés si vous activez la capture PCAP, la journalisation IDS ou le scan de vulnérabilités
- Les fichiers PCAP peuvent croître rapidement sur les réseaux chargés ; envisagez un stockage externe pour la capture à long terme
- La base de données SQLite utilise le mode WAL pour des performances d'écriture optimales

## Application NetRecon Scanner (Android)

| Exigence | Détails |
|---|---|
| Version Android | 8.0 (API 26) ou supérieure |
| RAM | 2 Go minimum |
| Stockage | 100 Mo pour l'application + les données |
| Réseau | Wi-Fi connecté au réseau cible |
| Accès root | Optionnel (active les modes de scan avancés) |
| Shizuku | Optionnel (active certaines fonctionnalités sans root) |

## Application Admin Connect

| Exigence | Détails |
|---|---|
| Version Android | 8.0 (API 26) ou supérieure |
| RAM | 2 Go minimum |
| Stockage | 80 Mo pour l'application + les données |
| Réseau | Connexion Internet (se connecte via Cloudflare Tunnel) |

## Serveur auto-hébergé

| Exigence | Minimum | Recommandé |
|---|---|---|
| OS | Ubuntu 22.04 LTS / Debian 12 | Ubuntu 24.04 LTS |
| CPU | 2 cœurs | 4+ cœurs |
| RAM | 4 Go | 8 Go |
| Stockage | 40 Go | 100 Go SSD |
| Docker | v24.0+ | Dernière version stable |
| Docker Compose | v2.20+ | Dernière version stable |

Windows Server est également supporté avec Docker Desktop ou WSL2.

## Exigences réseau

### Accès réseau de la sonde

| Direction | Port | Protocole | Fonction |
|---|---|---|---|
| Sonde -> LAN | ARP | Couche 2 | Découverte d'hôtes |
| Sonde -> LAN | TCP (divers) | Couche 4 | Scan de ports |
| Sonde -> LAN | UDP 5353 | mDNS | Découverte de services |
| Sonde -> Internet | TCP 443 | HTTPS | Cloudflare Tunnel, mises à jour |
| LAN -> Sonde | TCP 3000 | HTTPS | Tableau de bord web |
| LAN -> Sonde | TCP 8080 | HTTP | Assistant de configuration (premier démarrage uniquement) |

### Considérations pare-feu

- La sonde **ne nécessite aucun port entrant** depuis Internet lors de l'utilisation de Cloudflare Tunnel
- La sonde a besoin d'un **HTTPS sortant (443)** pour la connectivité du tunnel et les mises à jour système
- Pour le scan du réseau local, la sonde doit être sur le même segment de couche 2 que les appareils cibles (ou utiliser un port SPAN/miroir)

### Cloudflare Tunnel

L'accès distant à la sonde est fourni via Cloudflare Tunnel. Cela nécessite :
- Une connexion Internet active sur la sonde
- Un accès TCP 443 sortant (aucun port entrant nécessaire)
- Un compte Cloudflare (le niveau gratuit est suffisant)

## Exigences du navigateur (tableau de bord web)

| Navigateur | Version minimale |
|---|---|
| Google Chrome | 90+ |
| Mozilla Firefox | 90+ |
| Microsoft Edge | 90+ |
| Safari | 15+ |

JavaScript doit être activé.

## FAQ

**Q : Puis-je exécuter la sonde sur un Raspberry Pi 3 ?**
R : Le Raspberry Pi 3 ne dispose que de 1 Go de RAM, ce qui est inférieur à la configuration minimale requise. Il peut fonctionner pour le scan de base mais n'est pas supporté.

**Q : La sonde a-t-elle besoin d'un accès Internet ?**
R : L'accès Internet n'est requis que pour Cloudflare Tunnel (accès distant) et les mises à jour système. Toutes les fonctionnalités de scan fonctionnent sans Internet.

**Q : Puis-je utiliser un adaptateur Wi-Fi USB pour le scan ?**
R : Le scan Wi-Fi n'est pas supporté. La sonde nécessite une connexion Ethernet filaire pour une découverte réseau fiable et complète.

Pour obtenir de l'aide supplémentaire, contactez [support@netreconapp.com](mailto:support@netreconapp.com).
