---
sidebar_position: 2
title: Agent Windows
description: Installer et déployer l'agent NetRecon sous Windows
---

# Agent Windows

Installez l'agent NetRecon sur les terminaux Windows pour une surveillance continue et un rapport d'inventaire.

## Prérequis

- Windows 10 ou ultérieur / Windows Server 2016 ou ultérieur
- Privilèges d'administrateur local (pour l'installation)
- Connectivité réseau vers la sonde (directe ou via Cloudflare Tunnel)
- Un jeton d'inscription depuis le tableau de bord de la sonde

## Installation manuelle

### Étape 1 : Télécharger le MSI

Téléchargez `netrecon-agent-windows-x64.msi` depuis le tableau de bord de la sonde :
1. Connectez-vous au tableau de bord de la sonde
2. Accédez à **Agents > Downloads**
3. Cliquez sur **Windows (MSI)**

### Étape 2 : Exécuter l'installeur

1. Double-cliquez sur le fichier MSI téléchargé
2. Cliquez sur **Next** sur l'écran de bienvenue
3. Entrez les détails de configuration :
   - **Server URL** : l'URL de votre sonde (par ex., `https://probe.netreconapp.com`)
   - **Enrollment Token** : collez le jeton depuis le tableau de bord de la sonde
4. Cliquez sur **Install**
5. Cliquez sur **Finish** lorsque l'installation est terminée

L'agent s'installe dans `C:\Program Files\NetRecon\Agent\` et s'enregistre comme service Windows nommé `NetReconAgent`.

### Étape 3 : Vérifier l'installation

Ouvrez une invite de commandes en tant qu'administrateur :

```powershell
sc query NetReconAgent
```

Le service devrait afficher `STATE: RUNNING`.

Vérifiez le statut d'inscription dans le tableau de bord de la sonde sous **Agents** — le nouveau terminal devrait apparaître sous 30 secondes.

## Installation silencieuse

Pour une installation scriptée ou sans intervention :

```powershell
msiexec /i netrecon-agent-windows-x64.msi /quiet /norestart SERVER_URL="https://probe.netreconapp.com" ENROLLMENT_TOKEN="your-token-here"
```

## Déploiement SCCM

Déployez l'agent sur des milliers de terminaux Windows à l'aide de Microsoft SCCM (System Center Configuration Manager).

### Étape 1 : Créer le package

1. Ouvrez la console SCCM
2. Accédez à **Software Library > Application Management > Applications**
3. Cliquez sur **Create Application**
4. Sélectionnez **Windows Installer (MSI file)** et naviguez vers le MSI
5. Complétez l'assistant avec la commande d'installation suivante :

```
msiexec /i netrecon-agent-windows-x64.msi /quiet /norestart SERVER_URL="https://probe.netreconapp.com" ENROLLMENT_TOKEN="your-fleet-token"
```

### Étape 2 : Configurer la détection

Définissez la règle de détection :
- **Type** : Système de fichiers
- **Chemin** : `C:\Program Files\NetRecon\Agent\`
- **Fichier** : `netrecon-agent.exe`
- **Propriété** : Le fichier existe

### Étape 3 : Déployer

1. Cliquez-droit sur l'application et sélectionnez **Deploy**
2. Choisissez votre collection d'appareils cible
3. Définissez le but du déploiement sur **Required**
4. Configurez la planification
5. Cliquez sur **Next** tout au long de l'assistant et déployez

## Déploiement Intune

Déployez via Microsoft Intune pour les terminaux gérés dans le cloud.

### Étape 1 : Préparer le package

1. Convertissez le MSI en package `.intunewin` à l'aide de l'[outil Intune Win32 Content Prep](https://github.com/Microsoft/Microsoft-Win32-Content-Prep-Tool) :

```powershell
IntuneWinAppUtil.exe -c .\source -s netrecon-agent-windows-x64.msi -o .\output
```

### Étape 2 : Créer l'application dans Intune

1. Accédez à **Microsoft Intune Admin Center > Apps > Windows**
2. Cliquez sur **Add > Windows app (Win32)**
3. Téléchargez le fichier `.intunewin`
4. Configurez :
   - **Commande d'installation** : `msiexec /i netrecon-agent-windows-x64.msi /quiet /norestart SERVER_URL="https://probe.netreconapp.com" ENROLLMENT_TOKEN="your-fleet-token"`
   - **Commande de désinstallation** : `msiexec /x {product-code} /quiet`
   - **Règle de détection** : Le fichier existe à `C:\Program Files\NetRecon\Agent\netrecon-agent.exe`

### Étape 3 : Assigner

1. Assignez à un groupe d'appareils ou à tous les appareils
2. Définissez comme **Required** pour un déploiement automatique
3. Surveillez le statut de déploiement dans le portail Intune

## Déploiement GPO

Déployez via les stratégies de groupe pour les environnements Active Directory.

### Étape 1 : Préparer le partage

1. Copiez le MSI vers un partage réseau accessible par toutes les machines cibles :
   ```
   \\fileserver\software\netrecon\netrecon-agent-windows-x64.msi
   ```
2. Assurez-vous que le partage a les permissions de lecture pour **Domain Computers**

### Étape 2 : Créer la GPO

1. Ouvrez la **console de gestion des stratégies de groupe**
2. Créez une nouvelle GPO liée à l'OU cible
3. Accédez à **Computer Configuration > Policies > Software Settings > Software Installation**
4. Cliquez-droit et sélectionnez **New > Package**
5. Naviguez vers le MSI sur le partage réseau
6. Sélectionnez la méthode de déploiement **Assigned**

### Étape 3 : Configurer les paramètres

Puisque l'installation logicielle GPO ne prend pas en charge directement les propriétés MSI, créez un fichier de transformation (MST) ou utilisez un script de démarrage :

Créez un script de démarrage à `\\fileserver\scripts\install-netrecon-agent.bat` :

```batch
@echo off
if not exist "C:\Program Files\NetRecon\Agent\netrecon-agent.exe" (
    msiexec /i "\\fileserver\software\netrecon\netrecon-agent-windows-x64.msi" /quiet /norestart SERVER_URL="https://probe.netreconapp.com" ENROLLMENT_TOKEN="your-fleet-token"
)
```

Assignez ce script sous **Computer Configuration > Policies > Windows Settings > Scripts > Startup**.

## Gestion de l'agent

### Fichier de configuration

Le fichier de configuration de l'agent se trouve à :
```
C:\Program Files\NetRecon\Agent\config.yaml
```

```yaml
server_url: "https://probe.netreconapp.com"
heartbeat_interval: 30
report_interval: 900
log_level: "info"
log_file: "C:\\Program Files\\NetRecon\\Agent\\logs\\agent.log"
```

### Commandes de service

```powershell
# Arrêter l'agent
net stop NetReconAgent

# Démarrer l'agent
net start NetReconAgent

# Redémarrer l'agent
net stop NetReconAgent && net start NetReconAgent
```

### Désinstallation

Via le panneau de configuration :
1. Ouvrez **Settings > Apps > Installed Apps**
2. Trouvez « NetRecon Agent »
3. Cliquez sur **Uninstall**

Via la ligne de commande :
```powershell
msiexec /x netrecon-agent-windows-x64.msi /quiet
```

## Résolution de problèmes

### L'agent n'apparaît pas dans le tableau de bord
- Vérifiez que le service est en cours d'exécution : `sc query NetReconAgent`
- Consultez le journal de l'agent : `C:\Program Files\NetRecon\Agent\logs\agent.log`
- Vérifiez que le SERVER_URL est correct et accessible
- Assurez-vous que le jeton d'inscription est valide et n'a pas expiré

### Le service ne démarre pas
- Vérifiez l'Observateur d'événements Windows pour les erreurs sous le journal **Application**
- Vérifiez que le fichier config.yaml est un YAML valide
- Assurez-vous que le port 443 sortant n'est pas bloqué par un pare-feu

### Utilisation élevée des ressources
- Vérifiez le journal pour les erreurs causant des tentatives rapides
- Vérifiez que les intervalles de battement de cœur et de rapport ne sont pas définis trop bas
- Redémarrez le service pour effacer tout état accumulé

## FAQ

**Q : L'agent fonctionne-t-il sur Windows ARM (par ex., Surface Pro X) ?**
R : Actuellement, l'agent prend en charge uniquement l'architecture x64. Le support ARM64 est prévu.

**Q : Puis-je installer l'agent aux côtés d'autres agents de surveillance ?**
R : Oui. L'agent NetRecon est conçu pour coexister avec d'autres outils de surveillance sans conflit.

**Q : L'agent survit-il aux mises à jour Windows et aux redémarrages ?**
R : Oui. L'agent s'exécute en tant que service Windows configuré en démarrage automatique, il redémarre donc après tout redémarrage.

Pour obtenir de l'aide supplémentaire, contactez [support@netreconapp.com](mailto:support@netreconapp.com).
