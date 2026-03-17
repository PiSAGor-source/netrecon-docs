---
sidebar_position: 1
title: Présentation d'IPAM
description: Gestion des adresses IP avec suivi des sous-réseaux et surveillance de l'utilisation
---

# IPAM — Gestion des adresses IP

NetRecon IPAM fournit un suivi centralisé des adresses IP et une gestion des sous-réseaux. Surveillez l'utilisation des sous-réseaux, suivez les attributions d'adresses IP et maintenez un inventaire précis de votre espace d'adressage réseau.

## Fonctionnalités principales

- **Gestion des sous-réseaux** — définissez et organisez les sous-réseaux avec prise en charge complète de la notation CIDR
- **Suivi des IP** — suivez les attributions individuelles d'adresses IP avec statut et métadonnées
- **Surveillance de l'utilisation** — pourcentages d'utilisation des sous-réseaux en temps réel et alertes
- **Intégration des scans** — importez les IP découvertes directement depuis les résultats de scan
- **Détection de conflits** — identifiez les adresses IP en double et les sous-réseaux chevauchants
- **Synchronisation OUI** — associez automatiquement les adresses MAC aux données du fabricant
- **Historique** — suivez les modifications d'attribution d'IP dans le temps
- **Export** — exportez les données IP en CSV ou JSON

## Architecture

IPAM fonctionne comme un service dédié sur la sonde (port 8009) avec un backend PostgreSQL :

```
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│  Dashboard   │  HTTP  │    IPAM      │  SQL   │  PostgreSQL  │
│  (Browser)   ├────────►  Service     ├────────►  Database    │
│              │        │   :8009      │        │              │
└──────────────┘        └──────┬───────┘        └──────────────┘
                               │
                        ┌──────▼───────┐
                        │ Scan Engine  │
                        │ (IP import)  │
                        └──────────────┘
```

## Concepts

### Sous-réseaux

Un sous-réseau représente une plage d'adresses IP définie par la notation CIDR (ex. : `192.168.1.0/24`). Chaque sous-réseau possède :

| Champ | Description |
|---|---|
| CIDR | Adresse réseau en notation CIDR |
| Name | Nom convivial (ex. : "Office LAN") |
| VLAN | ID VLAN associé (optionnel) |
| Gateway | IP de la passerelle par défaut |
| DNS | Serveurs DNS pour ce sous-réseau |
| Description | Description en texte libre |
| Location | Emplacement physique ou logique |

### Adresses IP

Chaque adresse IP au sein d'un sous-réseau peut être suivie avec :

| Champ | Description |
|---|---|
| IP Address | L'adresse IPv4 ou IPv6 |
| Status | Available, Assigned, Reserved, DHCP |
| Hostname | Nom d'hôte de l'appareil |
| MAC Address | Adresse MAC associée |
| Manufacturer | Renseigné automatiquement depuis la base de données OUI |
| Owner | Utilisateur ou département assigné |
| Last Seen | Horodatage de la dernière activité réseau |
| Notes | Notes en texte libre |

### Utilisation

L'utilisation du sous-réseau est calculée comme suit :

```
Utilization = (Assigned + Reserved + DHCP) / Total Usable IPs * 100%
```

Des alertes peuvent être configurées lorsque l'utilisation dépasse un seuil (par défaut : 80 %).

## Prise en main

### Étape 1 : Créer un sous-réseau

1. Naviguez vers **IPAM > Subnets** dans le tableau de bord de la sonde
2. Cliquez sur **Add Subnet**
3. Entrez le CIDR (ex. : `10.0.1.0/24`)
4. Remplissez les champs optionnels (nom, VLAN, passerelle, etc.)
5. Cliquez sur **Save**

### Étape 2 : Importer les IP depuis un scan

Le moyen le plus rapide de peupler IPAM est d'importer depuis un scan terminé :

1. Naviguez vers **IPAM > Subnets**
2. Sélectionnez votre sous-réseau
3. Cliquez sur **Import from Scan**
4. Sélectionnez le résultat de scan à importer
5. Vérifiez les IP qui seront importées
6. Cliquez sur **Import**

Consultez [Importer depuis un scan](./import-from-scan.md) pour des instructions détaillées.

### Étape 3 : Gérer les attributions d'IP

1. Cliquez sur un sous-réseau pour voir ses adresses IP
2. Cliquez sur une IP pour voir/modifier ses détails
3. Changez le statut, ajoutez des notes, assignez à un propriétaire
4. Cliquez sur **Save**

### Étape 4 : Surveiller l'utilisation

1. Naviguez vers **IPAM > Dashboard**
2. Consultez les graphiques d'utilisation des sous-réseaux
3. Configurez les alertes pour une utilisation élevée sous **IPAM > Settings > Alerts**

## Organisation des sous-réseaux

Les sous-réseaux peuvent être organisés hiérarchiquement :

```
10.0.0.0/16          (Corporate Network)
├── 10.0.1.0/24      (HQ - Office LAN)
├── 10.0.2.0/24      (HQ - Server VLAN)
├── 10.0.3.0/24      (HQ - Wi-Fi)
├── 10.0.10.0/24     (Branch 1 - Office)
├── 10.0.11.0/24     (Branch 1 - Servers)
└── 10.0.20.0/24     (Branch 2 - Office)
```

Les relations parent/enfant sont établies automatiquement en fonction de l'inclusion CIDR.

## Support IPv6

IPAM prend en charge les adresses IPv4 et IPv6 :
- Notation CIDR complète pour les sous-réseaux IPv6
- Suivi des adresses IPv6 avec les mêmes champs qu'IPv4
- Les appareils double pile affichent les deux adresses liées ensemble

## FAQ

**Q : Puis-je importer des sous-réseaux depuis un fichier CSV ?**
R : Oui. Naviguez vers **IPAM > Import** et téléversez un fichier CSV avec les colonnes : CIDR, Name, VLAN, Gateway, Description. Un modèle CSV est disponible en téléchargement sur la page d'import.

**Q : À quelle fréquence les données d'utilisation sont-elles mises à jour ?**
R : L'utilisation est recalculée chaque fois qu'un statut d'IP change et de manière planifiée (toutes les 5 minutes par défaut).

**Q : IPAM s'intègre-t-il avec les serveurs DHCP ?**
R : IPAM peut importer les données de bail DHCP pour suivre les IP attribuées dynamiquement. Configurez la connexion au serveur DHCP sous **IPAM > Settings > DHCP Integration**.

**Q : Plusieurs utilisateurs peuvent-ils modifier les données IPAM simultanément ?**
R : Oui. IPAM utilise le verrouillage optimiste pour prévenir les conflits. Si deux utilisateurs modifient la même adresse IP, la seconde sauvegarde affichera un avertissement de conflit avec l'option de fusionner ou d'écraser.

Pour une aide supplémentaire, contactez [support@netreconapp.com](mailto:support@netreconapp.com).
