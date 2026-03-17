---
sidebar_position: 1
title: Présentation de l'assistant de configuration
description: Guide complet de l'assistant de configuration au premier démarrage de NetRecon OS
---

# Présentation de l'assistant de configuration

L'assistant de configuration s'exécute automatiquement au premier démarrage de NetRecon OS. Il vous guide à travers toutes les étapes de configuration essentielles pour rendre votre sonde opérationnelle. L'assistant est accessible via un navigateur web à l'adresse `http://<probe-ip>:8080`.

## Prérequis

- NetRecon OS démarré avec succès sur le matériel de votre sonde
- Au moins un câble Ethernet connecté à votre réseau
- Un ordinateur ou smartphone sur le même réseau pour accéder à l'assistant

## Étapes de l'assistant

L'assistant de configuration se compose de 11 étapes, complétées séquentiellement :

| Étape | Nom | Description |
|---|---|---|
| 1 | **Bienvenue** | Sélection de la langue et accord de licence |
| 2 | **Compte administrateur** | Créer le nom d'utilisateur et le mot de passe administrateur |
| 3 | **Nom d'hôte** | Définir le nom d'hôte de la sonde sur le réseau |
| 4 | **Interfaces réseau** | Détecter et attribuer des rôles aux ports Ethernet |
| 5 | **Mode réseau** | Choisir la topologie de scan (Single, Dual, Bridge, TAP) |
| 6 | **Configuration IP** | Définir une IP statique ou DHCP pour chaque interface |
| 7 | **DNS et NTP** | Configurer les serveurs DNS et la synchronisation horaire |
| 8 | **Cloudflare Tunnel** | Configurer le tunnel d'accès distant (optionnel) |
| 9 | **Paramètres de sécurité** | Configurer les certificats TLS, 2FA et le délai de session |
| 10 | **Cible de scan initiale** | Définir le premier sous-réseau à scanner |
| 11 | **Résumé et application** | Vérifier tous les paramètres et appliquer la configuration |

## Détails des étapes

### Étape 1 : Bienvenue

Sélectionnez votre langue préférée parmi les 11 langues prises en charge. Acceptez l'accord de licence pour continuer.

### Étape 2 : Compte administrateur

Créez le compte administrateur qui sera utilisé pour se connecter au tableau de bord de la sonde et à l'API. Choisissez un mot de passe fort — ce compte dispose d'un accès système complet.

### Étape 3 : Nom d'hôte

Définissez un nom d'hôte significatif pour la sonde (ex. : `netrecon-hq` ou `probe-branch-01`). Ce nom d'hôte sera diffusé via mDNS pour la découverte locale.

### Étape 4 : Interfaces réseau

L'assistant détecte tous les ports Ethernet disponibles et affiche leur état de liaison. Vous attribuez un rôle à chaque interface :

- **Scan** — l'interface utilisée pour la découverte réseau et le scan
- **Management** — l'interface utilisée pour l'accès au tableau de bord et la gestion à distance
- **Uplink** — l'interface connectée à votre passerelle internet
- **Unused** — interfaces désactivées

Consultez [Interfaces réseau](./network-interfaces.md) pour des conseils détaillés.

### Étape 5 : Mode réseau

Choisissez comment la sonde se connecte à votre réseau :

- **Single Interface** — scan et gestion sur un seul port
- **Dual Scan** — interfaces de scan et de gestion séparées
- **Bridge** — mode en ligne transparent entre deux ports
- **TAP** — surveillance passive via un TAP réseau ou un port SPAN

Consultez [Modes réseau](./network-modes.md) pour des conseils détaillés.

### Étape 6 : Configuration IP

Pour chaque interface active, choisissez entre DHCP et configuration IP statique. L'IP statique est recommandée pour l'interface de gestion afin que l'adresse de la sonde ne change pas.

### Étape 7 : DNS et NTP

Configurez les serveurs DNS en amont (par défaut Cloudflare 1.1.1.1 et Google 8.8.8.8). NTP est configuré pour garantir des horodatages précis pour les journaux et les résultats de scan.

### Étape 8 : Cloudflare Tunnel

Configurez éventuellement un Cloudflare Tunnel pour un accès distant sécurisé. Vous aurez besoin de :
- Un compte Cloudflare
- Un jeton de tunnel (généré depuis le tableau de bord Cloudflare Zero Trust)

Cette étape peut être ignorée et configurée ultérieurement depuis le tableau de bord de la sonde.

### Étape 9 : Paramètres de sécurité

- **Certificat TLS** — générer un certificat auto-signé ou fournir le vôtre
- **Authentification à deux facteurs** — activer le 2FA basé sur TOTP pour le compte administrateur
- **Délai de session** — configurer la durée pendant laquelle les sessions du tableau de bord restent actives

### Étape 10 : Cible de scan initiale

Définissez le premier sous-réseau que la sonde scannera. L'assistant détecte automatiquement le sous-réseau depuis la configuration IP de l'interface de scan et le suggère comme cible par défaut.

### Étape 11 : Résumé et application

Vérifiez tous les paramètres configurés. Cliquez sur **Apply** pour finaliser la configuration. La sonde va :

1. Appliquer la configuration réseau
2. Générer les certificats TLS
3. Démarrer tous les services
4. Lancer le scan réseau initial (si configuré)
5. Vous rediriger vers le tableau de bord de la sonde

:::info
L'assistant ne s'exécute qu'une seule fois. Après son achèvement, le service de premier démarrage est désactivé. Pour relancer l'assistant, utilisez l'option **Factory Reset** dans le tableau de bord de la sonde sous **Settings > System**.
:::

## Après l'assistant

Une fois l'assistant terminé :

- Accédez au tableau de bord de la sonde à `https://<probe-ip>:3000`
- Si Cloudflare Tunnel a été configuré, accédez à distance à `https://probe.netreconapp.com`
- Connectez l'application NetRecon Scanner ou Admin Connect à la sonde

## FAQ

**Q : Puis-je revenir à une étape précédente ?**
R : Oui, l'assistant dispose d'un bouton retour à chaque étape. Les valeurs précédemment saisies sont conservées.

**Q : Et si je dois modifier les paramètres après l'assistant ?**
R : Tous les paramètres configurés dans l'assistant peuvent être modifiés ultérieurement depuis le tableau de bord de la sonde sous **Settings**.

**Q : L'assistant n'affiche aucune interface réseau. Que faire ?**
R : Assurez-vous que vos câbles Ethernet sont connectés et que les LED de liaison sont actives. Si vous utilisez un adaptateur Ethernet USB, il peut nécessiter une installation manuelle du pilote. Consultez [Interfaces réseau](./network-interfaces.md) pour les informations de récupération de pilote.

Pour une aide supplémentaire, contactez [support@netreconapp.com](mailto:support@netreconapp.com).
