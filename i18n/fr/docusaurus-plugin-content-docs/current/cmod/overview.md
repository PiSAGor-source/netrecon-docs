---
sidebar_position: 1
title: Présentation de CMod
description: Gestion de la configuration des appareils réseau via SSH et console série
---

# CMod — Gestion de la configuration

CMod (Configuration Module) vous permet de gérer les configurations des appareils réseau directement depuis le tableau de bord NetRecon. Connectez-vous aux commutateurs, routeurs, pare-feu et autres appareils réseau via SSH ou console série pour exécuter des commandes, appliquer des modèles et suivre les modifications de configuration.

## Fonctionnalités principales

- **Connexions SSH** — connectez-vous à n'importe quel appareil réseau via SSH
- **Console série** — connectez-vous aux appareils via un adaptateur USB-série pour un accès hors bande
- **Modèles de commandes** — modèles de commandes prédéfinis et personnalisés pour les opérations courantes
- **Opérations en masse** — exécutez des commandes sur plusieurs appareils simultanément
- **Terminal en temps réel** — terminal interactif basé sur WebSocket dans votre navigateur
- **Sauvegarde de configuration** — enregistrez automatiquement les configurations en cours d'exécution
- **Suivi des modifications** — suivi basé sur les différences des modifications de configuration dans le temps

## Architecture

CMod fonctionne comme un service dédié sur la sonde (port 8008) et se connecte aux appareils réseau en votre nom :

```
┌──────────┐    WebSocket     ┌──────────┐    SSH/Serial    ┌──────────────┐
│ Dashboard ├─────────────────► CMod     ├──────────────────► Network      │
│ (Browser) │                 │ Service  │                  │ Device       │
└──────────┘                  │ :8008    │                  │ (Switch/     │
                              └──────────┘                  │  Router/FW)  │
                                                            └──────────────┘
```

## Appareils pris en charge

CMod prend en charge tout appareil acceptant les connexions SSH ou console série. Testé et optimisé pour :

| Fournisseur | Types d'appareils | SSH | Série |
|---|---|---|---|
| Cisco | IOS, IOS-XE, NX-OS, ASA | Oui | Oui |
| Juniper | Junos | Oui | Oui |
| HP/Aruba | ProCurve, ArubaOS-Switch, ArubaOS-CX | Oui | Oui |
| MikroTik | RouterOS | Oui | Oui |
| Ubiquiti | EdgeOS, UniFi | Oui | Non |
| Fortinet | FortiOS | Oui | Oui |
| Palo Alto | PAN-OS | Oui | Oui |
| Linux | Tout système compatible SSH | Oui | Oui |

## Prise en main

### Étape 1 : Ajouter un appareil

1. Naviguez vers **CMod > Devices** dans le tableau de bord de la sonde
2. Cliquez sur **Add Device**
3. Entrez les détails de l'appareil :
   - **Name** : un identifiant convivial (ex. : "Core Switch 1")
   - **IP Address** : l'adresse IP de gestion de l'appareil
   - **Device Type** : sélectionnez dans la liste des fournisseurs
   - **Connection Type** : SSH ou Serial
4. Entrez les identifiants (stockés chiffrés dans la base de données locale de la sonde)
5. Cliquez sur **Save & Test** pour vérifier la connectivité

### Étape 2 : Se connecter à un appareil

1. Cliquez sur un appareil dans la liste CMod
2. Sélectionnez **Terminal** pour une session interactive, ou **Run Template** pour un ensemble de commandes prédéfini
3. Le terminal s'ouvre dans votre navigateur avec une connexion en direct à l'appareil

### Étape 3 : Appliquer un modèle

1. Sélectionnez un appareil et cliquez sur **Run Template**
2. Choisissez un modèle dans la bibliothèque (ex. : "Show Running Config", "Show Interfaces")
3. Vérifiez les commandes qui seront exécutées
4. Cliquez sur **Execute**
5. Visualisez la sortie en temps réel

Consultez [Mode SSH](./ssh-mode.md) et [Mode série](./serial-mode.md) pour des guides de connexion détaillés.

## Modèles de commandes

Les modèles sont des ensembles de commandes réutilisables organisés par type d'appareil :

### Modèles intégrés

| Modèle | Cisco IOS | Junos | ArubaOS | FortiOS |
|---|---|---|---|---|
| Afficher la configuration | `show run` | `show config` | `show run` | `show full-config` |
| Afficher les interfaces | `show ip int brief` | `show int terse` | `show int brief` | `get system interface` |
| Afficher la table de routage | `show ip route` | `show route` | `show ip route` | `get router info routing` |
| Afficher la table ARP | `show arp` | `show arp` | `show arp` | `get system arp` |
| Afficher la table MAC | `show mac add` | `show eth-switch table` | `show mac-address` | `get system arp` |
| Sauvegarder la configuration | `write memory` | `commit` | `write memory` | `execute backup config` |

### Modèles personnalisés

Créez vos propres modèles :

1. Naviguez vers **CMod > Templates**
2. Cliquez sur **Create Template**
3. Sélectionnez le type d'appareil cible
4. Entrez la séquence de commandes (une commande par ligne)
5. Ajoutez des variables pour les valeurs dynamiques (ex. : `{{interface}}`, `{{vlan_id}}`)
6. Enregistrez le modèle

## FAQ

**Q : Les identifiants des appareils sont-ils stockés de manière sécurisée ?**
R : Oui. Tous les identifiants sont chiffrés au repos dans la base de données SQLite locale de la sonde en utilisant le chiffrement AES-256. Les identifiants ne sont jamais transmis en clair.

**Q : Puis-je utiliser CMod sans sonde ?**
R : Non. CMod fonctionne comme un service sur le matériel de la sonde. Il nécessite que la sonde soit sur le même réseau que les appareils cibles (ou qu'elle ait un routage vers eux).

**Q : CMod prend-il en charge SNMP ?**
R : CMod se concentre sur la gestion basée sur CLI (SSH et série). La surveillance SNMP est gérée par le moteur de surveillance réseau de la sonde.

Pour une aide supplémentaire, contactez [support@netreconapp.com](mailto:support@netreconapp.com).
