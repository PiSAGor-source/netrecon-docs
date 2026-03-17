---
sidebar_position: 2
title: Mode SSH
description: Connectez-vous aux appareils réseau via SSH pour la gestion de la configuration
---

# Mode SSH

Le mode SSH vous permet de vous connecter aux appareils réseau via le protocole SSH. C'est la méthode de connexion la plus courante pour gérer les commutateurs, routeurs, pare-feu et serveurs.

## Prérequis

- L'appareil cible a SSH activé
- La sonde a une connectivité réseau vers l'adresse IP de gestion de l'appareil
- Des identifiants SSH valides (nom d'utilisateur/mot de passe ou clé SSH)
- Le port SSH de l'appareil est accessible (par défaut : 22)

## Configurer une connexion SSH

### Étape 1 : Ajouter l'appareil

1. Naviguez vers **CMod > Devices**
2. Cliquez sur **Add Device**
3. Remplissez les détails de connexion :

| Champ | Description | Exemple |
|---|---|---|
| Name | Nom convivial de l'appareil | Core-SW-01 |
| IP Address | IP de gestion | 192.168.1.1 |
| Port | Port SSH | 22 |
| Device Type | Fournisseur/OS | Cisco IOS |
| Username | Nom d'utilisateur SSH | admin |
| Authentication | Mot de passe ou clé SSH | Password |
| Password | Mot de passe SSH | (chiffré) |

4. Cliquez sur **Save & Test**

### Étape 2 : Tester la connectivité

Lorsque vous cliquez sur **Save & Test**, CMod va :
1. Tenter une connexion TCP vers l'adresse IP et le port spécifiés
2. Effectuer l'échange de clés SSH
3. S'authentifier avec les identifiants fournis
4. Exécuter une commande de base (ex. : `show version`) pour vérifier que la session fonctionne
5. Afficher le résultat et marquer l'appareil comme "Connected" ou signaler une erreur

### Étape 3 : Ouvrir le terminal

1. Cliquez sur l'appareil dans la liste CMod
2. Cliquez sur **Terminal**
3. Un terminal SSH interactif s'ouvre dans votre navigateur via WebSocket
4. Vous pouvez taper des commandes comme si vous étiez connecté directement à l'appareil

## Authentification par clé SSH

Pour l'authentification par clé :

1. Lors de l'ajout d'un appareil, sélectionnez **SSH Key** comme méthode d'authentification
2. Collez votre clé privée (format PEM) dans le champ clé
3. Fournissez éventuellement une phrase de passe pour la clé
4. La clé publique doit déjà être installée sur l'appareil cible

:::tip
L'authentification par clé SSH est plus sécurisée et recommandée pour les environnements de production. Elle permet également les opérations sans surveillance comme les sauvegardes de configuration planifiées.
:::

## Paramètres de connexion

### Configuration des délais d'expiration

| Paramètre | Par défaut | Plage |
|---|---|---|
| Délai de connexion | 10 secondes | 5-60 secondes |
| Délai de commande | 30 secondes | 10-300 secondes |
| Délai d'inactivité | 15 minutes | 5-60 minutes |
| Intervalle keep-alive | 30 secondes | 10-120 secondes |

Configurez ces paramètres sous **CMod > Settings > SSH**.

### Options SSH

| Option | Par défaut | Description |
|---|---|---|
| Vérification stricte de la clé hôte | Désactivée | Vérifier la clé hôte SSH de l'appareil |
| Chiffrements préférés | Auto | Remplacer l'ordre de négociation des chiffrements |
| Type de terminal | xterm-256color | Type d'émulation de terminal |
| Taille du terminal | 80x24 | Colonnes x Lignes |

## Exécution de commandes

### Terminal interactif

Le terminal WebSocket fournit une session interactive en temps réel :
- Support complet des couleurs ANSI
- Complétion par tabulation (transmise à l'appareil)
- Historique des commandes (flèches haut/bas)
- Support du copier/coller
- Enregistrement de session (optionnel)

### Modèles de commandes

Exécutez des séquences de commandes prédéfinies :

1. Sélectionnez l'appareil
2. Cliquez sur **Run Template**
3. Choisissez un modèle
4. Si le modèle a des variables, remplissez les valeurs
5. Cliquez sur **Execute**

Exemple de modèle avec variables :

```
configure terminal
interface {{interface}}
description {{description}}
switchport mode access
switchport access vlan {{vlan_id}}
no shutdown
end
write memory
```

### Exécution en masse

Exécutez la même commande ou le même modèle sur plusieurs appareils :

1. Naviguez vers **CMod > Bulk Operations**
2. Sélectionnez les appareils cibles (cases à cocher)
3. Choisissez un modèle ou entrez une commande
4. Cliquez sur **Execute on Selected**
5. Les résultats sont affichés par appareil dans une vue à onglets

## Sauvegarde de configuration via SSH

CMod peut automatiquement sauvegarder les configurations des appareils :

1. Naviguez vers **CMod > Backup Schedule**
2. Cliquez sur **Add Schedule**
3. Sélectionnez les appareils à sauvegarder
4. Définissez la planification (quotidienne, hebdomadaire ou cron personnalisé)
5. Choisissez le modèle de commande de sauvegarde (ex. : "Show Running Config")
6. Cliquez sur **Save**

Les configurations sauvegardées sont stockées sur la sonde et incluent :
- Horodatage
- Nom d'hôte de l'appareil
- Différences de configuration par rapport à la sauvegarde précédente
- Texte complet de la configuration

## Dépannage

### Connexion refusée
- Vérifiez que SSH est activé sur l'appareil cible
- Confirmez que l'adresse IP et le port sont corrects
- Vérifiez qu'aucun pare-feu ne bloque la connexion entre la sonde et l'appareil

### Échec d'authentification
- Vérifiez que le nom d'utilisateur et le mot de passe/la clé sont corrects
- Certains appareils verrouillent l'accès après plusieurs tentatives échouées ; attendez et réessayez
- Vérifiez si l'appareil nécessite une version spécifique du protocole SSH (SSHv2)

### Le terminal se fige ou ne répond pas
- L'appareil attend peut-être la fin d'une commande ; appuyez sur Ctrl+C
- Vérifiez le paramètre de délai de commande
- Vérifiez que l'intervalle keep-alive est configuré

### Les commandes produisent une sortie inattendue
- Assurez-vous que le bon type d'appareil est sélectionné ; différents fournisseurs utilisent des syntaxes de commandes différentes
- Certaines commandes nécessitent le mode privilège (ex. : `enable` sur Cisco)

## FAQ

**Q : Puis-je utiliser des hôtes de rebond SSH / hôtes bastion ?**
R : Pas actuellement. CMod se connecte directement de la sonde à l'appareil cible. Assurez-vous que la sonde dispose d'un routage vers tous les appareils gérés.

**Q : Les sessions SSH sont-elles journalisées ?**
R : Oui. Toutes les commandes exécutées via CMod sont enregistrées dans la piste d'audit avec le nom d'utilisateur, l'horodatage, l'appareil et le texte de la commande.

**Q : Puis-je transférer des fichiers vers un appareil via SSH ?**
R : Le transfert de fichiers SCP/SFTP est prévu pour une version future. Actuellement, CMod ne prend en charge que l'interaction en ligne de commande.

Pour une aide supplémentaire, contactez [support@netreconapp.com](mailto:support@netreconapp.com).
