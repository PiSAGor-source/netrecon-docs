---
sidebar_position: 3
title: Mode série
description: Connectez-vous aux appareils réseau via un câble console série
---

# Mode série

Le mode série vous permet de vous connecter aux appareils réseau en utilisant un câble console USB-série. C'est essentiel pour la configuration initiale des appareils, la récupération de mot de passe et la gestion hors bande lorsque SSH n'est pas disponible.

## Prérequis

- Un câble console USB-série (RJ45-USB ou DB9-USB)
- Le câble USB connecté au port USB de la sonde
- Un accès physique au port console de l'appareil réseau
- Le débit en bauds correct pour l'appareil cible

## Types de câbles console pris en charge

| Type de câble | Connecteur | Utilisation courante |
|---|---|---|
| RJ45-USB | Port console RJ45 | Cisco, Juniper, Aruba |
| DB9-USB | Port série DB9 | Commutateurs anciens, appareils industriels |
| USB-C/USB-A vers RJ45 | Port console RJ45 | Câbles console modernes |
| USB-C vers USB-C | Port console USB-C | Certains appareils récents |

### Chipsets recommandés

Pour une communication série fiable, utilisez des câbles avec ces chipsets :
- **FTDI FT232R** — le plus compatible, recommandé
- **Prolific PL2303** — largement disponible
- **Silicon Labs CP210x** — bonne compatibilité

Évitez les câbles FTDI contrefaits, car ils peuvent ne pas fonctionner de manière fiable.

## Configurer une connexion série

### Étape 1 : Connecter le câble

1. Connectez l'extrémité USB du câble console au port USB de la sonde
2. Connectez l'extrémité RJ45/DB9 au port console de l'appareil réseau
3. Vérifiez que le câble est détecté par la sonde

### Étape 2 : Ajouter l'appareil

1. Naviguez vers **CMod > Devices**
2. Cliquez sur **Add Device**
3. Sélectionnez **Serial** comme type de connexion
4. Configurez les paramètres série :

| Champ | Description | Par défaut |
|---|---|---|
| Name | Nom convivial de l'appareil | — |
| Serial Port | Périphérique série USB détecté | `/dev/ttyUSB0` |
| Baud Rate | Vitesse de communication | 9600 |
| Data Bits | Nombre de bits de données | 8 |
| Parity | Vérification de parité | None |
| Stop Bits | Nombre de bits d'arrêt | 1 |
| Flow Control | Contrôle de flux matériel/logiciel | None |
| Device Type | Fournisseur/OS (pour la correspondance des modèles) | — |

5. Cliquez sur **Save & Test**

### Étape 3 : Ouvrir le terminal

1. Cliquez sur l'appareil dans la liste CMod
2. Cliquez sur **Terminal**
3. Un terminal série interactif s'ouvre dans votre navigateur
4. Appuyez sur **Entrée** pour réveiller la console de l'appareil

## Référence des débits en bauds

Débits en bauds courants par fournisseur :

| Fournisseur / Appareil | Débit en bauds par défaut |
|---|---|
| Cisco IOS / IOS-XE | 9600 |
| Cisco NX-OS | 9600 |
| Juniper Junos | 9600 |
| HP/Aruba ProCurve | 9600 |
| MikroTik RouterOS | 115200 |
| Fortinet FortiOS | 9600 |
| Palo Alto PAN-OS | 9600 |
| Ubiquiti EdgeOS | 115200 |
| Linux (générique) | 115200 |

:::tip
Si vous voyez du texte illisible dans le terminal, le débit en bauds est probablement incorrect. Essayez les débits courants : 9600, 19200, 38400, 57600, 115200.
:::

## Paramètres de communication série

### Configuration standard 8N1

La plupart des appareils réseau utilisent la norme "8N1" :
- **8** bits de données
- **N** (pas de) parité
- **1** bit d'arrêt

C'est la valeur par défaut dans CMod et cela devrait fonctionner avec la grande majorité des appareils.

### Contrôle de flux

| Type | Quand l'utiliser |
|---|---|
| None | Par défaut ; fonctionne pour la plupart des appareils |
| Hardware (RTS/CTS) | Requis par certains appareils industriels et anciens |
| Software (XON/XOFF) | Rarement utilisé ; certains serveurs de terminaux anciens |

## Détection du port série

Lorsqu'un câble série USB est connecté, CMod le détecte automatiquement :

1. Naviguez vers **CMod > Devices > Add Device > Serial**
2. La liste déroulante **Serial Port** affiche tous les périphériques série USB détectés
3. Si plusieurs câbles sont connectés, chacun apparaît comme un port séparé (ex. : `/dev/ttyUSB0`, `/dev/ttyUSB1`)

Si aucun port n'est détecté :
- Vérifiez que le câble est bien inséré
- Essayez un autre port USB sur la sonde
- Consultez le journal système de la sonde pour les erreurs de détection de périphériques USB

## Cas d'utilisation

### Configuration initiale de l'appareil
Lors de la configuration d'un commutateur ou routeur neuf qui n'a pas d'adresse IP configurée :
1. Connectez-vous via la console série
2. Effectuez la configuration initiale (attribuer une IP de gestion, activer SSH)
3. Passez au mode SSH pour la gestion continue

### Récupération de mot de passe
Lorsque vous êtes verrouillé hors d'un appareil :
1. Connectez-vous via la console série
2. Suivez la procédure de récupération de mot de passe du fournisseur
3. Réinitialisez le mot de passe et regagnez l'accès

### Gestion hors bande
Lorsque l'interface de gestion d'un appareil est inaccessible :
1. Connectez-vous via la console série
2. Diagnostiquez le problème (interface hors service, problème de routage, etc.)
3. Appliquez la configuration corrective

### Mises à jour de firmware
Certains appareils nécessitent un accès console pendant les mises à jour de firmware :
1. Connectez-vous via la console série
2. Surveillez le processus de mise à jour en temps réel
3. Intervenez si la mise à jour rencontre des erreurs

## Dépannage

### Aucune sortie dans le terminal
- Appuyez plusieurs fois sur **Entrée** pour réveiller la console
- Vérifiez que le débit en bauds correspond à la configuration de l'appareil
- Essayez d'inverser le câble console (certains câbles sont câblés différemment)
- Assurez-vous que le pilote USB du câble est chargé (consultez les journaux système de la sonde)

### Texte illisible
- Le débit en bauds est incorrect ; essayez d'abord 9600, puis 115200
- Vérifiez les paramètres de bits de données, parité et bits d'arrêt
- Essayez un autre câble console

### "Permission denied" sur le port série
- Le service CMod nécessite l'accès aux périphériques `/dev/ttyUSB*`
- Ceci est configuré automatiquement lors de l'installation de NetRecon OS
- Si vous utilisez une installation personnalisée, ajoutez l'utilisateur du service CMod au groupe `dialout`

### Déconnexions intermittentes
- Le câble USB peut être mal branché ; assurez une connexion ferme
- Certains câbles USB longs causent une dégradation du signal ; utilisez un câble de moins de 3 mètres
- Les concentrateurs USB peuvent causer des problèmes ; connectez directement au port USB de la sonde

## FAQ

**Q : Puis-je utiliser le mode série à distance via Admin Connect ?**
R : Oui. Le terminal série est accessible via le tableau de bord web, qui est joignable via Cloudflare Tunnel. Vous bénéficiez de la même expérience de terminal interactif à distance.

**Q : Combien de connexions série la sonde peut-elle gérer simultanément ?**
R : Une connexion série par port USB. La plupart du matériel de sonde prend en charge 2 à 4 ports USB. Utilisez un concentrateur USB alimenté pour des connexions supplémentaires, bien que les connexions directes soient plus fiables.

**Q : Puis-je automatiser les commandes de la console série ?**
R : Oui. Les modèles de commandes fonctionnent avec les connexions série tout comme avec SSH. Vous pouvez créer des modèles pour les tâches série répétitives comme la récupération de mot de passe ou la configuration initiale.

Pour une aide supplémentaire, contactez [support@netreconapp.com](mailto:support@netreconapp.com).
