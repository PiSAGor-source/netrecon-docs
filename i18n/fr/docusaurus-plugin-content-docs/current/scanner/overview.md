---
sidebar_position: 1
title: Présentation du Scanner
description: Application NetRecon Scanner — scanner réseau Android autonome
---

# NetRecon Scanner

NetRecon Scanner est un outil autonome d'audit de sécurité réseau pour Android. Il fonctionne indépendamment sur votre appareil Android sans nécessiter de sonde, ce qui le rend idéal pour le travail sur le terrain, les évaluations rapides et la reconnaissance réseau en déplacement.

## Fonctionnalités principales

- **Découverte ARP** — trouver tous les appareils sur le réseau local à l'aide de requêtes ARP
- **Scan de ports** — scanner les ports TCP pour trouver les services ouverts sur les hôtes découverts
- **Détection de services** — identifier les services en cours d'exécution et leurs versions via la capture de bannières
- **Profilage des appareils** — classifier les appareils en combinant la recherche OUI, les ports ouverts et les signatures de services
- **Carte thermique WiFi** — visualiser l'intensité du signal sans fil à travers les emplacements physiques
- **Rapports PDF** — générer des rapports professionnels d'audit de sécurité
- **Terminal SSH** — se connecter aux appareils directement depuis l'application
- **Intelligence CVE** — base de données CVE hors ligne pour la recherche de vulnérabilités
- **Carte de surface d'attaque** — représentation visuelle de l'exposition du réseau
- **Moniteur passif** — surveillance continue en arrière-plan pour les nouveaux appareils
- **11 langues** — support complet de la localisation

## Modes de fonctionnement

NetRecon Scanner prend en charge trois modes de fonctionnement, selon les capacités de votre appareil :

### Mode Standard
Fonctionne sur tout appareil Android sans permissions spéciales. Utilise les API réseau standard d'Android pour la découverte et le scan.

### Mode Shizuku
Utilise le service [Shizuku](https://shizuku.rikka.app/) pour un accès réseau élevé sans root. Permet un scan ARP plus rapide et l'accès aux sockets bruts.

### Mode Root
Accès complet à toutes les capacités réseau. Permet la vitesse de scan la plus rapide, la capture en mode promiscuous et les fonctionnalités avancées comme la détection d'usurpation ARP.

| Fonctionnalité | Standard | Shizuku | Root |
|---|---|---|---|
| Découverte ARP | Lent | Rapide | Plus rapide |
| Scan de ports | Oui | Oui | Oui |
| Sockets bruts | Non | Oui | Oui |
| Capture PCAP | Non | Limitée | Complète |
| Surveillance passive | Limitée | Oui | Oui |

## Types de scan

### Découverte ARP
Envoie des requêtes ARP à chaque IP du sous-réseau cible pour identifier les hôtes actifs. C'est la méthode la plus rapide et la plus fiable pour découvrir les appareils sur un réseau local.

### Scan de ports TCP
Se connecte aux ports TCP spécifiés sur chaque hôte découvert. Prend en charge les plages de ports configurables et les limites de connexions simultanées.

### Détection de services
Après avoir trouvé des ports ouverts, le scanner envoie des sondes spécifiques au protocole pour identifier le service en cours d'exécution. Reconnaît des centaines de services courants dont HTTP, SSH, FTP, SMB, RDP, les bases de données et bien d'autres.

### Profilage des appareils
Combine plusieurs sources de données pour identifier ce qu'est un appareil :
- Recherche OUI (fabricant) de l'adresse MAC
- Correspondance d'empreinte des ports ouverts
- Analyse des bannières de service
- Annonces de services mDNS/SSDP

## Intégration avec la sonde

Bien que le Scanner fonctionne indépendamment, il peut également se connecter à une sonde NetRecon pour des capacités améliorées :

- Visualiser les résultats de scan de la sonde aux côtés des scans locaux
- Déclencher des scans à distance depuis l'application
- Accéder aux alertes IDS et aux données de vulnérabilité de la sonde
- Combiner les données locales et de la sonde dans les rapports

Pour se connecter à une sonde, accédez à **Settings > Probe Connection** et entrez l'adresse IP de la sonde ou scannez le QR code depuis le tableau de bord de la sonde.

## Performances

Le scanner est optimisé pour les appareils mobiles :
- Maximum 40 connexions socket simultanées (adaptatif selon le niveau de batterie)
- Le profilage intensif en CPU s'exécute dans un isolat dédié pour garder l'interface réactive
- La base de données OUI est chargée paresseusement avec un cache LRU (500 entrées)
- Le scan adaptatif à la batterie réduit la concurrence lorsque la batterie est faible

## FAQ

**Q : Le Scanner nécessite-t-il un accès Internet ?**
R : Non. Toutes les fonctionnalités de scan fonctionnent hors ligne. Internet n'est nécessaire que pour le téléchargement initial de la base de données CVE et les mises à jour.

**Q : Puis-je scanner des réseaux auxquels je ne suis pas connecté ?**
R : Le Scanner ne peut découvrir que les appareils sur le réseau auquel votre appareil Android est actuellement connecté via Wi-Fi. Pour scanner des réseaux distants, utilisez une sonde.

**Q : Quelle est la précision du profilage des appareils ?**
R : Le profilage des appareils identifie correctement le type d'appareil dans environ 85-90% des cas. La précision s'améliore lorsque plus de ports et services sont détectés (utilisez le profil de scan Standard ou Deep).

Pour obtenir de l'aide supplémentaire, contactez [support@netreconapp.com](mailto:support@netreconapp.com).
