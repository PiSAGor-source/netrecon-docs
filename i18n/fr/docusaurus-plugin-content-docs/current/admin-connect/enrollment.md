---
sidebar_position: 2
title: Inscription
description: Inscrire des sondes dans Admin Connect via QR code ou configuration manuelle
---

# Inscription des sondes

L'inscription est le processus de connexion d'une sonde à votre application Admin Connect. Une fois inscrite, vous pouvez surveiller et gérer la sonde à distance depuis n'importe où.

## Prérequis

- Application Admin Connect installée sur votre appareil Android
- Une sonde NetRecon ayant terminé l'assistant de configuration
- Accès Internet sur la sonde et votre appareil mobile

## Méthode 1 : Inscription par QR Code

L'inscription par QR code est la méthode la plus rapide et la plus fiable. Le QR code contient les détails de connexion de la sonde et le jeton d'authentification dans un format chiffré.

### Étape 1 : Afficher le QR Code

Le QR code est disponible à deux endroits :

**Pendant l'assistant de configuration :**
À la fin de l'assistant (étape 11), un QR code est affiché sur l'écran de résumé.

**Depuis le tableau de bord de la sonde :**
1. Connectez-vous au tableau de bord de la sonde à `https://<probe-ip>:3000`
2. Accédez à **Settings > Remote Access**
3. Cliquez sur **Generate Enrollment QR Code**
4. Un QR code sera affiché à l'écran

### Étape 2 : Scanner le QR Code

1. Ouvrez Admin Connect
2. Appuyez sur le bouton **+** pour ajouter une nouvelle sonde
3. Sélectionnez **Scan QR Code**
4. Pointez votre caméra vers le QR code affiché sur la sonde
5. L'application analysera automatiquement les détails de connexion

### Étape 3 : Vérifier et se connecter

1. Examinez les détails de la sonde affichés dans l'application (nom d'hôte, IP, URL du tunnel)
2. Appuyez sur **Connect**
3. L'application établira une connexion sécurisée avec la sonde
4. Une fois connectée, la sonde apparaît dans votre tableau de bord de flotte

### Contenu du QR Code

Le QR code encode un payload JSON contenant :

```json
{
  "hostname": "netrecon-hq",
  "tunnel_url": "https://probe.netreconapp.com",
  "token": "<enrollment-token>",
  "fingerprint": "<certificate-fingerprint>",
  "version": "2.2.0"
}
```

Le jeton d'inscription est à usage unique et expire après 24 heures.

## Méthode 2 : Inscription manuelle

Utilisez l'inscription manuelle lorsque vous ne pouvez pas accéder physiquement à la sonde pour scanner un QR code.

### Étape 1 : Obtenir les détails de connexion

Vous aurez besoin des informations suivantes de votre administrateur de sonde :
- **URL du tunnel** : généralement `https://probe.netreconapp.com` ou un domaine personnalisé
- **Jeton d'inscription** : une chaîne alphanumérique de 32 caractères
- **Empreinte de certificat** (optionnel) : pour la vérification de l'épinglage de certificat

### Étape 2 : Saisir les détails dans Admin Connect

1. Ouvrez Admin Connect
2. Appuyez sur le bouton **+** pour ajouter une nouvelle sonde
3. Sélectionnez **Manual Setup**
4. Entrez les champs requis :
   - **Nom de la sonde** : un nom convivial pour l'identification
   - **URL du tunnel** : l'URL HTTPS de la sonde
   - **Jeton d'inscription** : collez le jeton fourni par votre administrateur
5. Appuyez sur **Connect**

### Étape 3 : Vérifier la connexion

1. L'application tentera de se connecter et de s'authentifier
2. En cas de succès, les détails de la sonde seront affichés
3. Appuyez sur **Add to Fleet** pour confirmer

## Inscription d'entreprise

Pour les déploiements à grande échelle, Admin Connect prend en charge l'inscription en masse :

### Configuration gérée MDM

Déployez les paramètres d'inscription via votre solution MDM :

```xml
<managedAppConfiguration>
  <key>probe_url</key>
  <value>https://probe.netreconapp.com</value>
  <key>enrollment_token</key>
  <value>your-enrollment-token</value>
  <key>auto_enroll</key>
  <value>true</value>
</managedAppConfiguration>
```

### Jeton d'inscription de flotte

Générez un jeton d'inscription réutilisable depuis le tableau de bord de la sonde :

1. Accédez à **Settings > Remote Access > Fleet Enrollment**
2. Cliquez sur **Generate Fleet Token**
3. Définissez une date d'expiration et un nombre maximum d'inscriptions
4. Distribuez le jeton à votre équipe

Les jetons de flotte peuvent être utilisés par plusieurs instances Admin Connect pour inscrire la même sonde.

## Gérer les sondes inscrites

### Visualiser les sondes inscrites

Toutes les sondes inscrites apparaissent sur l'écran d'accueil d'Admin Connect. Chaque sonde affiche :
- Statut de connexion (en ligne/hors ligne)
- Horodatage de dernière vue
- Résumé de santé (CPU, RAM, disque)
- Nombre d'alertes actives

### Supprimer une sonde

1. Appuyez longuement sur la sonde dans la liste de flotte
2. Sélectionnez **Remove Probe**
3. Confirmez la suppression

Cela supprime la sonde de votre application uniquement. La sonde elle-même n'est pas affectée.

### Réinscription

Si vous devez réinscrire une sonde (par ex., après une rotation de jeton) :
1. Supprimez la sonde d'Admin Connect
2. Générez un nouveau QR code ou jeton d'inscription sur la sonde
3. Réinscrivez en utilisant l'une des méthodes ci-dessus

## Résolution de problèmes

### Le scan du QR code échoue
- Assurez-vous d'un éclairage adéquat et maintenez la caméra stable
- Essayez d'augmenter la luminosité de l'écran de l'appareil affichant le QR code
- Si la caméra ne peut pas faire la mise au point, essayez de vous rapprocher ou de vous éloigner de l'écran

### Timeout de connexion
- Vérifiez que la sonde a un accès Internet et que le Cloudflare Tunnel est actif
- Vérifiez qu'aucun pare-feu ne bloque le HTTPS sortant (port 443) sur votre appareil mobile
- Essayez de basculer entre Wi-Fi et données mobiles

### Jeton expiré
- Les jetons d'inscription expirent après 24 heures
- Générez un nouveau QR code ou jeton depuis le tableau de bord de la sonde

## FAQ

**Q : Plusieurs utilisateurs peuvent-ils inscrire la même sonde ?**
R : Oui. Chaque utilisateur s'inscrit indépendamment et reçoit sa propre session. L'accès est contrôlé par le rôle assigné à chaque utilisateur (voir [RBAC](./rbac.md)).

**Q : L'inscription fonctionne-t-elle sur un réseau local sans Internet ?**
R : L'inscription manuelle peut fonctionner sur un réseau local en utilisant l'adresse IP locale de la sonde au lieu de l'URL du tunnel. L'inscription par QR fonctionne également localement.

**Q : Comment effectuer la rotation des jetons d'inscription ?**
R : Accédez à **Settings > Remote Access** sur le tableau de bord de la sonde et cliquez sur **Rotate Token**. Cela invalide tous les jetons précédents.

Pour obtenir de l'aide supplémentaire, contactez [support@netreconapp.com](mailto:support@netreconapp.com).
