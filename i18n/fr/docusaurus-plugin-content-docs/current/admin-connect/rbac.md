---
sidebar_position: 3
title: Contrôle d'accès basé sur les rôles
description: Configurer les rôles et permissions utilisateur dans Admin Connect
---

# Contrôle d'accès basé sur les rôles (RBAC)

NetRecon utilise le contrôle d'accès basé sur les rôles pour gérer ce que chaque utilisateur peut voir et faire. Les rôles sont définis sur la sonde et appliqués à la fois sur le tableau de bord web et l'application Admin Connect.

## Prérequis

- Accès de niveau administrateur au tableau de bord de la sonde
- Au moins une sonde inscrite dans Admin Connect

## Comment fonctionne le RBAC

Chaque compte utilisateur se voit attribuer un rôle. Les rôles contiennent un ensemble de permissions qui contrôlent l'accès aux fonctionnalités. Lorsqu'un utilisateur se connecte via Admin Connect ou le tableau de bord web, le système vérifie son rôle avant d'autoriser toute action.

```
Utilisateur → Rôle → Permissions → Accès Accordé / Refusé
```

Les permissions sont appliquées à la fois au niveau de l'interface (masquage des fonctionnalités indisponibles) et au niveau de l'API (rejet des requêtes non autorisées).

## Rôles prédéfinis

NetRecon inclut cinq rôles prédéfinis :

| Rôle | Description | Utilisateur type |
|---|---|---|
| **Super Admin** | Accès complet à toutes les fonctionnalités et paramètres | Propriétaire de la plateforme |
| **Admin** | Accès complet sauf gestion des rôles et paramètres système | Responsable IT |
| **Analyst** | Voir les résultats de scan, alertes, rapports ; ne peut pas modifier les paramètres | Analyste sécurité |
| **Operator** | Démarrer/arrêter les scans et services ; voir les résultats | Technicien NOC |
| **Viewer** | Accès en lecture seule aux tableaux de bord et rapports | Cadre, auditeur |

## Matrice des permissions

| Permission | Super Admin | Admin | Analyst | Operator | Viewer |
|---|---|---|---|---|---|
| Voir le tableau de bord | Oui | Oui | Oui | Oui | Oui |
| Voir les résultats de scan | Oui | Oui | Oui | Oui | Oui |
| Démarrer/arrêter les scans | Oui | Oui | Non | Oui | Non |
| Voir les alertes IDS | Oui | Oui | Oui | Oui | Oui |
| Gérer les règles IDS | Oui | Oui | Non | Non | Non |
| Démarrer/arrêter PCAP | Oui | Oui | Non | Oui | Non |
| Télécharger les fichiers PCAP | Oui | Oui | Oui | Non | Non |
| Lancer des scans de vulnérabilités | Oui | Oui | Non | Oui | Non |
| Voir les résultats de vulnérabilités | Oui | Oui | Oui | Oui | Oui |
| Gérer le honeypot | Oui | Oui | Non | Non | Non |
| Gérer le VPN | Oui | Oui | Non | Non | Non |
| Configurer le sinkhole DNS | Oui | Oui | Non | Non | Non |
| Générer des rapports | Oui | Oui | Oui | Oui | Non |
| Gérer les utilisateurs | Oui | Oui | Non | Non | Non |
| Gérer les rôles | Oui | Non | Non | Non | Non |
| Paramètres système | Oui | Non | Non | Non | Non |
| Sauvegarde/restauration | Oui | Oui | Non | Non | Non |
| Voir le journal d'audit | Oui | Oui | Oui | Non | Non |
| Ticketing | Oui | Oui | Oui | Oui | Non |
| Gestion de flotte | Oui | Oui | Non | Non | Non |

## Gérer les utilisateurs

### Créer un utilisateur

1. Connectez-vous au tableau de bord de la sonde en tant que Super Admin ou Admin
2. Accédez à **Settings > Users**
3. Cliquez sur **Add User**
4. Remplissez les détails de l'utilisateur :
   - Nom d'utilisateur
   - Adresse e-mail
   - Mot de passe (ou envoyer un lien d'invitation)
   - Rôle (sélectionner parmi les rôles prédéfinis)
5. Cliquez sur **Create**

### Modifier le rôle d'un utilisateur

1. Accédez à **Settings > Users**
2. Cliquez sur l'utilisateur que vous souhaitez modifier
3. Changez la liste déroulante **Role**
4. Cliquez sur **Save**

### Désactiver un utilisateur

1. Accédez à **Settings > Users**
2. Cliquez sur l'utilisateur
3. Basculez **Active** sur désactivé
4. Cliquez sur **Save**

Les utilisateurs désactivés ne peuvent pas se connecter mais leur historique d'audit est préservé.

## Rôles personnalisés

Les Super Admins peuvent créer des rôles personnalisés avec des permissions granulaires :

1. Accédez à **Settings > Roles**
2. Cliquez sur **Create Role**
3. Entrez un nom et une description de rôle
4. Activez/désactivez les permissions individuelles
5. Cliquez sur **Save**

Les rôles personnalisés apparaissent aux côtés des rôles prédéfinis lors de l'attribution des utilisateurs.

## Authentification à deux facteurs

La 2FA peut être imposée par rôle :

1. Accédez à **Settings > Roles**
2. Sélectionnez un rôle
3. Activez **Require 2FA**
4. Cliquez sur **Save**

Les utilisateurs avec ce rôle devront configurer la 2FA basée sur TOTP lors de leur prochaine connexion.

## Gestion des sessions

Configurez les politiques de session par rôle :

| Paramètre | Description | Par défaut |
|---|---|---|
| Timeout de session | Déconnexion automatique après inactivité | 30 minutes |
| Sessions simultanées max | Nombre maximum de connexions simultanées | 3 |
| Restriction IP | Limiter la connexion à des plages IP spécifiques | Désactivé |

Configurez ces paramètres sous **Settings > Roles > [Nom du rôle] > Session Policy**.

## Journal d'audit

Toutes les actions liées aux permissions sont journalisées :

- Événements de connexion/déconnexion des utilisateurs
- Changements de rôle
- Modifications de permissions
- Tentatives d'accès échouées
- Changements de configuration

Consultez le journal d'audit à **Settings > Audit Log**. Les journaux sont conservés pendant 90 jours par défaut.

## FAQ

**Q : Puis-je modifier les rôles prédéfinis ?**
R : Non. Les rôles prédéfinis sont en lecture seule pour garantir une base cohérente. Créez un rôle personnalisé si vous avez besoin de permissions différentes.

**Q : Que se passe-t-il si je supprime un rôle qui a des utilisateurs assignés ?**
R : Vous devez réassigner tous les utilisateurs à un rôle différent avant de supprimer un rôle personnalisé. Le système empêchera la suppression si des utilisateurs sont encore assignés.

**Q : Les rôles sont-ils synchronisés entre plusieurs sondes ?**
R : Les rôles sont définis par sonde. Si vous gérez plusieurs sondes, vous devez configurer les rôles sur chacune d'elles. Une future mise à jour prendra en charge la gestion centralisée des rôles.

**Q : Puis-je restreindre un utilisateur à des sous-réseaux ou appareils spécifiques ?**
R : Actuellement, les rôles contrôlent l'accès aux fonctionnalités, pas l'accès au niveau des données. Les restrictions au niveau des sous-réseaux sont prévues dans la feuille de route.

Pour obtenir de l'aide supplémentaire, contactez [support@netreconapp.com](mailto:support@netreconapp.com).
