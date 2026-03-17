---
sidebar_position: 1
title: Installation
description: Installer NetRecon OS sur votre matériel sonde
---

# Installation de NetRecon OS

Ce guide vous accompagne dans l'installation de NetRecon OS sur votre matériel sonde. Le processus prend environ 15 minutes du téléchargement à une sonde pleinement opérationnelle.

## Prérequis

- Un appareil matériel compatible (voir [Configuration requise](./requirements.md))
- Une carte microSD (16 Go minimum, 32 Go recommandé) ou une clé USB
- Un outil d'écriture d'image tel que [balenaEtcher](https://etcher.balena.io/) ou Raspberry Pi Imager
- Un ordinateur pour télécharger et écrire l'image
- Un câble Ethernet connecté à votre réseau

## Étape 1 : Télécharger l'image

Téléchargez l'image appropriée pour votre matériel depuis le portail client NetRecon :

| Matériel | Fichier image | Architecture |
|---|---|---|
| Orange Pi R2S | `netrecon-os-arm64.img.xz` | ARM64 |
| Raspberry Pi 4/5 | `netrecon-os-arm64.img.xz` | ARM64 |
| Mini PC x86_64 | `netrecon-os-amd64.iso` | x86_64 |

:::tip
Vérifiez la somme de contrôle du téléchargement par rapport à la valeur affichée sur le portail pour garantir l'intégrité du fichier.
:::

## Étape 2 : Écrire l'image

### Pour les appareils ARM64 (Orange Pi, Raspberry Pi)

1. Insérez votre carte microSD dans votre ordinateur
2. Ouvrez balenaEtcher
3. Sélectionnez le fichier `.img.xz` téléchargé (pas besoin de l'extraire)
4. Sélectionnez votre carte microSD comme cible
5. Cliquez sur **Flash** et attendez la fin du processus

### Pour les appareils x86_64

1. Insérez une clé USB dans votre ordinateur
2. Ouvrez balenaEtcher
3. Sélectionnez le fichier `.iso` téléchargé
4. Sélectionnez votre clé USB comme cible
5. Cliquez sur **Flash** et attendez la fin du processus
6. Démarrez le mini PC depuis la clé USB et suivez l'installateur à l'écran

## Étape 3 : Premier démarrage

1. Insérez la carte microSD (ou le disque interne pour x86_64) dans votre appareil sonde
2. Connectez au moins un câble Ethernet à votre réseau
3. Mettez l'appareil sous tension
4. Attendez environ 60 secondes pour l'initialisation du système

La sonde obtiendra une adresse IP via DHCP lors du premier démarrage.

## Étape 4 : Exécuter l'assistant de configuration

1. Depuis n'importe quel appareil sur le même réseau, ouvrez un navigateur web
2. Accédez à `http://<probe-ip>:8080`
3. L'assistant de configuration vous guidera dans la configuration initiale

L'assistant vous aidera à configurer :
- Les identifiants du compte administrateur
- Les rôles des interfaces réseau
- Le mode de scan réseau
- La connexion Cloudflare Tunnel
- Les paramètres de sécurité

Consultez [Présentation de l'assistant de configuration](../setup-wizard/overview.md) pour la documentation détaillée de l'assistant.

## Étape 5 : Connecter vos applications

Une fois l'assistant terminé :

- **NetRecon Scanner** : peut découvrir la sonde via mDNS sur le réseau local
- **Admin Connect** : scannez le QR code affiché dans l'assistant, ou connectez-vous via `https://probe.netreconapp.com`

## Configuration matérielle requise

| Exigence | Minimum | Recommandé |
|---|---|---|
| CPU | ARM64 ou x86_64 | ARM64 quad-core ou x86_64 |
| RAM | 4 Go | 8 Go |
| Stockage | 16 Go | 32 Go |
| Ethernet | 1 port | 2+ ports |
| Réseau | DHCP disponible | IP statique préférée |

## Résolution de problèmes

### Impossible de trouver la sonde sur le réseau

- Assurez-vous que le câble Ethernet est correctement connecté et que le voyant de liaison est actif
- Vérifiez la table des baux DHCP de votre routeur pour un nouvel appareil nommé `netrecon`
- Essayez de connecter un moniteur et un clavier pour voir l'adresse IP de la sonde sur la console

### L'assistant ne se charge pas

- Vérifiez que vous accédez au port 8080 : `http://<probe-ip>:8080`
- Le service de l'assistant démarre environ 60 secondes après le démarrage
- Vérifiez que votre ordinateur est sur le même réseau/VLAN que la sonde

### L'écriture de l'image échoue

- Essayez une autre carte microSD ; certaines cartes ont des problèmes de compatibilité
- Retéléchargez l'image et vérifiez la somme de contrôle
- Essayez un autre outil d'écriture d'image

## FAQ

**Q : Puis-je installer NetRecon OS sur une machine virtuelle ?**
R : Oui, l'ISO x86_64 peut être installé dans VMware, Proxmox ou Hyper-V. Allouez au moins 4 Go de RAM et assurez-vous que la VM dispose d'un adaptateur réseau en pont.

**Q : Comment mettre à jour NetRecon OS après l'installation ?**
R : Les mises à jour sont livrées via l'application Admin Connect ou via le tableau de bord web de la sonde sous **Settings > System Update**.

**Q : Puis-je utiliser le Wi-Fi au lieu de l'Ethernet ?**
R : La sonde nécessite au moins une connexion Ethernet filaire pour un scan réseau fiable. Le Wi-Fi n'est pas pris en charge comme interface de scan principale.

Pour obtenir de l'aide supplémentaire, contactez [support@netreconapp.com](mailto:support@netreconapp.com).
