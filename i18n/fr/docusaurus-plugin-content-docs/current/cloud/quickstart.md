---
sidebar_position: 1
title: Démarrage rapide
description: Démarrez avec NetRecon Cloud en quelques minutes
---

# Démarrage rapide Cloud

NetRecon Cloud est le moyen le plus rapide de commencer. Pas de configuration serveur, pas de Docker — inscrivez-vous, déployez une sonde et commencez à découvrir votre réseau.

## Étape 1 : Créer votre compte

1. Rendez-vous sur [app.netreconapp.com](https://app.netreconapp.com) et cliquez sur **Sign Up**
2. Entrez votre adresse e-mail, le nom de votre entreprise et un mot de passe
3. Vérifiez votre adresse e-mail
4. Connectez-vous au tableau de bord NetRecon

## Étape 2 : Ajouter votre premier site

1. Dans le tableau de bord, accédez à **Sites** dans la barre latérale
2. Cliquez sur **Add Site**
3. Entrez un nom et une adresse pour le site (par ex., « Bureau principal — Paris »)
4. Enregistrez le site

## Étape 3 : Déployer une sonde

Chaque site nécessite au moins une sonde pour la découverte et la surveillance réseau.

### Option A : NetRecon OS (Recommandé)

1. Accédez à **Sites → [Votre Site] → Probes → Add Probe**
2. Sélectionnez **NetRecon OS** et téléchargez l'image pour votre matériel
3. Flashez l'image sur une carte SD ou un SSD avec [balenaEtcher](https://etcher.balena.io/)
4. Connectez la sonde à votre réseau via Ethernet
5. Mettez sous tension — la sonde se connectera automatiquement à votre compte cloud via Cloudflare Tunnel

### Option B : Docker sur un serveur existant

```bash
# Télécharger et exécuter le conteneur sonde
docker run -d \
  --name netrecon-probe \
  --network host \
  --restart unless-stopped \
  -e ENROLLMENT_TOKEN="your-token-from-dashboard" \
  netrecon/probe:latest
```

Obtenez le jeton d'inscription depuis **Sites → [Votre Site] → Probes → Add Probe → Docker**.

### Option C : Machine virtuelle

1. Téléchargez le fichier OVA depuis le tableau de bord
2. Importez-le dans VMware, Proxmox ou Hyper-V
3. Configurez la VM avec un **réseau en pont** (nécessaire pour le scan de couche 2)
4. Démarrez la VM — elle apparaîtra automatiquement dans votre tableau de bord

## Étape 4 : Lancer un scan

Une fois la sonde en ligne :

1. Accédez à **Sites → [Votre Site] → Devices**
2. Cliquez sur **Scan Now** ou attendez la découverte automatique (toutes les 15 minutes)
3. Les appareils découverts apparaîtront dans l'inventaire des appareils

## Étape 5 : Installer l'application mobile

Téléchargez **NetRecon Scanner** depuis le Google Play Store pour le scan réseau en déplacement :

- Scannez n'importe quel réseau auquel votre téléphone est connecté
- Les résultats se synchronisent automatiquement avec votre tableau de bord cloud
- Consultez [Présentation du Scanner](../scanner/overview) pour plus de détails

## Et ensuite ?

- **Déployer des agents** sur les terminaux pour une visibilité approfondie → [Installation des agents](../agents/overview)
- **Configurer des alertes** pour les nouveaux appareils, les vulnérabilités ou les interruptions de service
- **Configurer les intégrations** avec vos outils existants (LDAP, SIEM, Jira, ServiceNow)
- **Inviter votre équipe** via **Settings → Team Management**

## Cloud vs Auto-hébergé

| Fonctionnalité | Cloud | Auto-hébergé |
|---|---|---|
| Gestion du serveur | Gérée par NetRecon | Vous gérez |
| Localisation des données | NetRecon Cloud (UE) | Votre infrastructure |
| Mises à jour | Automatiques | Manuelles (docker pull) |
| Cloudflare Tunnel | Inclus | Vous configurez |
| Tarification | Abonnement | Clé de licence |

Besoin d'un auto-hébergement ? Consultez le [Guide d'installation](../self-hosting/installation).

Pour obtenir de l'aide, contactez [support@netreconapp.com](mailto:support@netreconapp.com).
