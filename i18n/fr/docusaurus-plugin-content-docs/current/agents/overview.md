---
sidebar_position: 1
title: Présentation des agents
description: Déployer des agents de surveillance légers sur les terminaux
---

# Déploiement des agents

Les agents NetRecon sont des programmes de surveillance légers installés sur les terminaux (postes de travail, serveurs, ordinateurs portables) qui rapportent à la sonde. Les agents fournissent une visibilité au niveau du terminal que le scan réseau seul ne peut pas atteindre.

## Ce que font les agents

- **Surveillance par battement de cœur** — vérification régulière pour confirmer que le terminal est en ligne
- **Inventaire logiciel** — rapport des logiciels installés et de leurs versions
- **Rapport des ports ouverts** — rapport des ports en écoute locale du point de vue du terminal
- **Données d'interface réseau** — rapport de toutes les NIC, IP, adresses MAC et état de liaison
- **Informations OS** — rapport du système d'exploitation, de la version et du niveau de correctif
- **Informations matérielles** — CPU, RAM, disque, numéro de série
- **Posture de sécurité** — état du pare-feu, de l'antivirus et du chiffrement

## Plateformes supportées

| Plateforme | Format de package | Version minimale |
|---|---|---|
| Windows | Installeur MSI | Windows 10 / Server 2016 |
| macOS | Installeur PKG | macOS 12 (Monterey) |
| Linux (Debian/Ubuntu) | Package DEB | Ubuntu 20.04 / Debian 11 |
| Linux (RHEL/Fedora) | Package RPM | RHEL 8 / Fedora 36 |

## Architecture

```
┌───────────────┐     HTTPS      ┌─────────────────┐
│   Terminal    │  (battement +  │   Agent         │
│   (Agent)     ├────────────────►  Registry       │
│               │   envoi data)  │   :8006         │
└───────────────┘                └────────┬────────┘
                                         │
                                ┌────────▼────────┐
                                │  Tableau de bord │
                                │  (Vue agents)    │
                                └─────────────────┘
```

Les agents communiquent avec le service Agent Registry (port 8006) sur la sonde :
- **Battement de cœur** : toutes les 30 secondes (configurable)
- **Rapport complet** : toutes les 15 minutes (configurable)
- **Protocole** : HTTPS avec authentification JWT
- **Payload** : JSON, compressé gzip

## Méthodes de déploiement

### Installation manuelle
Téléchargez et installez le package d'agent directement sur chaque terminal. Idéal pour les petits déploiements ou les tests.

- [Agent Windows](./windows.md)
- [Agent macOS](./macos.md)
- [Agent Linux](./linux.md)

### Déploiement d'entreprise
Pour un déploiement à grande échelle, déployez les agents à l'aide de vos outils de gestion existants :

| Outil | Plateforme | Guide |
|---|---|---|
| SCCM | Windows | [Agent Windows](./windows.md#sccm-deployment) |
| Microsoft Intune | Windows | [Agent Windows](./windows.md#intune-deployment) |
| Group Policy (GPO) | Windows | [Agent Windows](./windows.md#gpo-deployment) |
| Jamf Pro | macOS | [Agent macOS](./macos.md#jamf-deployment) |
| MDM générique | macOS | [Agent macOS](./macos.md#mdm-deployment) |
| CLI / Ansible | Linux | [Agent Linux](./linux.md#automated-deployment) |

### Inscription par QR Code

Pour le BYOD ou le déploiement sur le terrain :
1. Générez un QR code depuis le tableau de bord de la sonde (**Agents > Enrollment**)
2. L'utilisateur scanne le QR code sur son appareil
3. L'agent se télécharge et s'installe avec les paramètres préconfigurés

## Configuration de l'agent

Après l'installation, les agents sont configurés via un fichier de configuration local ou à distance via le tableau de bord de la sonde :

| Paramètre | Par défaut | Description |
|---|---|---|
| `server_url` | — | URL de la sonde ou URL Cloudflare Tunnel |
| `enrollment_token` | — | Jeton d'inscription à usage unique |
| `heartbeat_interval` | 30s | Fréquence de vérification de l'agent |
| `report_interval` | 15m | Fréquence d'envoi des données complètes |
| `log_level` | info | Verbosité de la journalisation |

## Cycle de vie de l'agent

1. **Installation** — le package d'agent est installé sur le terminal
2. **Inscription** — l'agent s'enregistre auprès de la sonde à l'aide d'un jeton d'inscription
3. **Actif** — l'agent envoie des battements de cœur et des rapports réguliers
4. **Inactif** — l'agent a manqué des battements de cœur au-delà du seuil de timeout (par défaut : 90 secondes)
5. **Hors ligne** — l'agent ne s'est pas manifesté depuis une période prolongée
6. **Décommissionné** — l'agent est retiré de la flotte

## Intégration au tableau de bord

Les agents inscrits apparaissent dans le tableau de bord de la sonde sous **Agents** :

- **Liste des agents** — tous les agents inscrits avec des indicateurs de statut
- **Détail de l'agent** — données complètes du terminal pour un agent sélectionné
- **Alertes** — notifications pour les agents inactifs/hors ligne ou les changements de posture de sécurité
- **Groupes** — organiser les agents en groupes logiques (par département, emplacement, etc.)

## Sécurité

- Toute communication agent-sonde est chiffrée via TLS
- Les agents s'authentifient à l'aide de jetons JWT émis lors de l'inscription
- Les jetons d'inscription sont à usage unique et expirent après une période configurable
- Les binaires d'agent sont signés pour la vérification d'intégrité
- Aucune connexion entrante n'est requise sur le terminal

## FAQ

**Q : Quelle bande passante un agent utilise-t-il ?**
R : Les battements de cœur représentent environ 200 octets chacun (toutes les 30 secondes). Les rapports complets font généralement 2-10 Ko compressés (toutes les 15 minutes). La bande passante totale est négligeable même sur les connexions lentes.

**Q : L'agent nécessite-t-il des privilèges admin/root ?**
R : L'agent s'exécute en tant que service système et nécessite des privilèges élevés pour l'installation. Après l'installation, il s'exécute sous un compte de service dédié avec des permissions minimales.

**Q : Puis-je désinstaller l'agent à distance ?**
R : Oui. Depuis le tableau de bord de la sonde, sélectionnez un agent et cliquez sur **Uninstall**. L'agent se supprimera lui-même lors du prochain battement de cœur.

**Q : L'agent affecte-t-il les performances du terminal ?**
R : L'agent est conçu pour être léger. Il utilise généralement moins de 20 Mo de RAM et un CPU négligeable. La collecte de données s'exécute en priorité basse pour éviter d'impacter l'expérience utilisateur.

Pour obtenir de l'aide supplémentaire, contactez [support@netreconapp.com](mailto:support@netreconapp.com).
