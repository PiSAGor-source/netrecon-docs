---
sidebar_position: 3
title: Agent macOS
description: Installer et déployer l'agent NetRecon sous macOS
---

# Agent macOS

Installez l'agent NetRecon sur les terminaux macOS pour une surveillance continue et un rapport d'inventaire.

## Prérequis

- macOS 12 (Monterey) ou ultérieur
- Privilèges administrateur (pour l'installation)
- Connectivité réseau vers la sonde (directe ou via Cloudflare Tunnel)
- Un jeton d'inscription depuis le tableau de bord de la sonde

## Installation manuelle

### Étape 1 : Télécharger le PKG

Téléchargez `netrecon-agent-macos-universal.pkg` depuis le tableau de bord de la sonde :
1. Connectez-vous au tableau de bord de la sonde
2. Accédez à **Agents > Downloads**
3. Cliquez sur **macOS (PKG)**

Le package est un binaire universel prenant en charge Intel (x86_64) et Apple Silicon (arm64).

### Étape 2 : Exécuter l'installeur

1. Double-cliquez sur le fichier PKG téléchargé
2. Suivez l'assistant d'installation
3. Lorsque demandé, entrez :
   - **Server URL** : l'URL de votre sonde
   - **Enrollment Token** : collez le jeton depuis le tableau de bord de la sonde
4. Entrez votre mot de passe admin macOS lorsque demandé
5. Cliquez sur **Install** et attendez la fin

L'agent s'installe dans `/Library/NetRecon/Agent/` et s'enregistre comme service launchd.

### Étape 3 : Vérifier l'installation

Ouvrez Terminal :

```bash
sudo launchctl list | grep netrecon
```

Vous devriez voir `com.netrecon.agent` dans la sortie. Vérifiez l'inscription dans le tableau de bord de la sonde sous **Agents**.

## Installation en ligne de commande

Pour une installation scriptée :

```bash
sudo installer -pkg netrecon-agent-macos-universal.pkg -target /

# Configurer l'agent
sudo /Library/NetRecon/Agent/netrecon-agent configure \
  --server-url "https://probe.netreconapp.com" \
  --enrollment-token "your-token-here"

# Démarrer l'agent
sudo launchctl load /Library/LaunchDaemons/com.netrecon.agent.plist
```

## Déploiement Jamf

Déployez l'agent à grande échelle avec Jamf Pro.

### Étape 1 : Télécharger le package

1. Connectez-vous à Jamf Pro
2. Accédez à **Settings > Computer Management > Packages**
3. Cliquez sur **New**
4. Téléchargez `netrecon-agent-macos-universal.pkg`
5. Enregistrez le package

### Étape 2 : Créer une politique

1. Accédez à **Computers > Policies**
2. Cliquez sur **New**
3. Configurez la politique :
   - **General** : Nommez-la « NetRecon Agent Deployment »
   - **Packages** : Ajoutez le PKG de l'agent NetRecon, défini sur **Install**
   - **Scripts** : Ajoutez un script post-installation (voir ci-dessous)
   - **Scope** : Ciblez vos groupes d'ordinateurs souhaités
   - **Trigger** : Définissez sur **Enrollment Complete** et/ou **Recurring Check-in**

### Script post-installation

```bash
#!/bin/bash
/Library/NetRecon/Agent/netrecon-agent configure \
  --server-url "https://probe.netreconapp.com" \
  --enrollment-token "your-fleet-token"

launchctl load /Library/LaunchDaemons/com.netrecon.agent.plist
```

### Étape 3 : Déployer

1. Enregistrez la politique
2. Surveillez le déploiement dans **Computers > Policy Logs**

## Déploiement MDM

Déployez via n'importe quelle solution MDM qui prend en charge la distribution de PKG.

### Profil de configuration

Créez un profil de configuration pour pré-configurer l'agent :

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>PayloadContent</key>
  <array>
    <dict>
      <key>PayloadType</key>
      <string>com.netrecon.agent</string>
      <key>ServerURL</key>
      <string>https://probe.netreconapp.com</string>
      <key>EnrollmentToken</key>
      <string>your-fleet-token</string>
      <key>HeartbeatInterval</key>
      <integer>30</integer>
      <key>ReportInterval</key>
      <integer>900</integer>
    </dict>
  </array>
  <key>PayloadDisplayName</key>
  <string>NetRecon Agent Configuration</string>
  <key>PayloadIdentifier</key>
  <string>com.netrecon.agent.config</string>
  <key>PayloadType</key>
  <string>Configuration</string>
  <key>PayloadVersion</key>
  <integer>1</integer>
</dict>
</plist>
```

Déployez ce profil aux côtés du package PKG via votre MDM.

## Permissions macOS

L'agent peut nécessiter les permissions macOS suivantes :

| Permission | Objectif | Comment accorder |
|---|---|---|
| Accès complet au disque | Lire la liste des logiciels installés | Réglages système > Confidentialité et sécurité |
| Accès réseau | Envoyer des données à la sonde | Accordé automatiquement |

Pour les déploiements gérés par MDM, accordez l'accès complet au disque via un profil PPPC (Privacy Preferences Policy Control) :

```xml
<key>Services</key>
<dict>
  <key>SystemPolicyAllFiles</key>
  <array>
    <dict>
      <key>Identifier</key>
      <string>com.netrecon.agent</string>
      <key>IdentifierType</key>
      <string>bundleID</string>
      <key>Allowed</key>
      <true/>
    </dict>
  </array>
</dict>
```

## Gestion de l'agent

### Fichier de configuration

```
/Library/NetRecon/Agent/config.yaml
```

```yaml
server_url: "https://probe.netreconapp.com"
heartbeat_interval: 30
report_interval: 900
log_level: "info"
log_file: "/Library/NetRecon/Agent/logs/agent.log"
```

### Commandes de service

```bash
# Arrêter l'agent
sudo launchctl unload /Library/LaunchDaemons/com.netrecon.agent.plist

# Démarrer l'agent
sudo launchctl load /Library/LaunchDaemons/com.netrecon.agent.plist

# Vérifier le statut
sudo launchctl list | grep netrecon
```

### Désinstallation

```bash
# Arrêter le service
sudo launchctl unload /Library/LaunchDaemons/com.netrecon.agent.plist

# Supprimer les fichiers
sudo rm -rf /Library/NetRecon/Agent/
sudo rm /Library/LaunchDaemons/com.netrecon.agent.plist

# Supprimer les reçus
sudo pkgutil --forget com.netrecon.agent
```

## Résolution de problèmes

### L'agent ne démarre pas après l'installation
- Vérifiez le journal système : `log show --predicate 'subsystem == "com.netrecon.agent"' --last 5m`
- Vérifiez que le plist existe : `ls -la /Library/LaunchDaemons/com.netrecon.agent.plist`
- Vérifiez les permissions de fichier sur le binaire de l'agent

### Erreurs de permission refusée dans le journal
- Accordez l'accès complet au disque comme décrit ci-dessus
- Pour le MDM, déployez le profil PPPC avant d'installer l'agent

### L'agent ne se connecte pas à la sonde
- Vérifiez l'URL du serveur : `curl -I https://probe.netreconapp.com/api/health`
- Vérifiez si le pare-feu macOS bloque les connexions sortantes
- Vérifiez que le jeton d'inscription est valide

## FAQ

**Q : L'agent prend-il en charge Apple Silicon nativement ?**
R : Oui. Le PKG est un binaire universel qui s'exécute nativement sur les Mac Intel et Apple Silicon.

**Q : L'agent fonctionne-t-il sur les machines virtuelles macOS ?**
R : Oui, l'agent fonctionne dans VMware Fusion, Parallels et les machines virtuelles UTM.

**Q : Gatekeeper de macOS bloquera-t-il l'installation ?**
R : Le PKG est signé et notarisé par Apple. Si l'installation manuelle est bloquée par Gatekeeper, faites un clic-droit sur le PKG et sélectionnez **Ouvrir** pour contourner l'avertissement.

Pour obtenir de l'aide supplémentaire, contactez [support@netreconapp.com](mailto:support@netreconapp.com).
