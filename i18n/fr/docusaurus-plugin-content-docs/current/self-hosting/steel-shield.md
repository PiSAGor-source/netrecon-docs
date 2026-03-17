---
sidebar_position: 3
title: Steel Shield
description: Fonctionnalités de renforcement de la sécurité pour les déploiements auto-hébergés
---

# Steel Shield

Steel Shield est le cadre de renforcement de la sécurité de NetRecon. Il fournit plusieurs couches de protection pour les déploiements auto-hébergés, garantissant l'intégrité et l'authenticité de tous les composants de la plateforme.

## Aperçu

Steel Shield comprend quatre mécanismes de sécurité principaux :

| Fonctionnalité | Objectif |
|---|---|
| **Intégrité des binaires** | Vérifier que les exécutables n'ont pas été altérés |
| **Épinglage de certificats** | Empêcher les attaques de type « man-in-the-middle » sur les communications API |
| **Réponse aux altérations** | Détecter et répondre aux modifications non autorisées |
| **Protection à l'exécution** | Protéger contre la manipulation de la mémoire et le débogage |

## Vérification de l'intégrité des binaires

Chaque binaire NetRecon (backend de sonde, agents, services) est signé numériquement. Au démarrage, chaque composant vérifie sa propre intégrité.

### Comment ça fonctionne

1. Lors de la compilation, chaque binaire est signé avec une clé privée détenue par NetRecon
2. La signature est intégrée dans les métadonnées du binaire
3. Au démarrage, le binaire calcule un hachage SHA-256 de lui-même
4. Le hachage est vérifié par rapport à la signature intégrée
5. Si la vérification échoue, le binaire refuse de démarrer et journalise une alerte

### Vérification manuelle

Vérifiez manuellement l'intégrité d'un binaire :

```bash
# Vérifier le backend de la sonde
netrecon-verify /usr/local/bin/netrecon-probe

# Vérifier un agent
netrecon-verify /usr/local/bin/netrecon-agent

# Sortie attendue :
# Binary: /usr/local/bin/netrecon-probe
# SHA-256: a1b2c3d4e5f6...
# Signature: VALID
# Signed by: NetRecon Build System
# Signed at: 2026-03-15T10:00:00Z
```

### Vérification des images Docker

Les images Docker sont signées avec Docker Content Trust (DCT) :

```bash
# Activer la vérification de confiance
export DOCKER_CONTENT_TRUST=1

# Télécharger avec vérification de signature
docker pull netrecon/api-gateway:latest
```

## Épinglage de certificats

L'épinglage de certificats garantit que les composants NetRecon ne communiquent qu'avec des serveurs légitimes, empêchant l'interception même si une autorité de certification est compromise.

### Connexions épinglées

| Connexion | Type d'épinglage |
|---|---|
| Agent vers Probe | Épinglage de clé publique |
| Admin Connect vers Probe | Empreinte de certificat |
| Probe vers Update Server | Épinglage de clé publique |
| Probe vers License Server | Empreinte de certificat |

### Comment ça fonctionne

1. Le hachage de la clé publique du certificat attendu est intégré dans chaque binaire client
2. Lors de l'établissement d'une connexion TLS, le client extrait la clé publique du serveur
3. Le client calcule un hachage SHA-256 de la clé publique
4. Si le hachage ne correspond pas à la valeur épinglée, la connexion est rejetée
5. Un échec de validation de l'épinglage déclenche une alerte de sécurité

### Rotation des épinglages

Lors de la rotation des certificats :

1. Les nouveaux épinglages sont distribués via le serveur de mise à jour avant le changement de certificat
2. Les anciens et nouveaux épinglages sont valides pendant la période de transition
3. Après la transition, les anciens épinglages sont supprimés lors de la prochaine mise à jour

Pour les déploiements auto-hébergés, mettez à jour les épinglages dans la configuration :

```yaml
# /etc/netrecon/security.yaml
certificate_pins:
  api_gateway:
    - "sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="  # Actuel
    - "sha256/BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB="  # Sauvegarde
```

## Réponse aux altérations

Steel Shield surveille les fichiers et configurations critiques pour détecter les modifications non autorisées.

### Éléments surveillés

| Élément | Fréquence de vérification | Réponse |
|---|---|---|
| Fichiers binaires | Au démarrage + toutes les heures | Alerte + arrêt optionnel |
| Fichiers de configuration | Toutes les 5 minutes | Alerte + restauration de sauvegarde |
| Intégrité de la base de données | Toutes les 15 minutes | Alerte + vérification de cohérence |
| Certificats TLS | Toutes les 5 minutes | Alerte en cas de modification |
| Paquets système | Quotidiennement | Alerte en cas de modifications inattendues |

### Actions de réponse

Lorsqu'une altération est détectée, Steel Shield peut :

1. **Journaliser** — enregistrer l'événement dans le journal d'audit de sécurité
2. **Alerter** — envoyer une notification via les canaux configurés
3. **Restaurer** — restaurer le fichier altéré à partir d'une sauvegarde connue et fiable
4. **Isoler** — restreindre l'accès réseau à la gestion uniquement
5. **Arrêter** — stopper le service pour empêcher toute compromission supplémentaire

Configurez le niveau de réponse :

```yaml
# /etc/netrecon/security.yaml
tamper_response:
  level: "alert_and_revert"  # Options : log, alert, alert_and_revert, isolate, shutdown
  notify_email: "security@yourcompany.com"
```

### Base de données d'intégrité des fichiers

Steel Shield maintient une base de données de hachages de tous les fichiers protégés :

```bash
# Initialiser la base de données d'intégrité
netrecon-shield init

# Vérifier l'intégrité manuellement
netrecon-shield verify

# Sortie attendue :
# Checked 47 files
# Status: ALL INTACT
# Last verified: 2026-03-15T14:30:00Z
```

## Protection à l'exécution

### Anti-débogage

En mode production, les binaires NetRecon incluent des mesures anti-débogage :
- Détection des débogueurs attachés (ptrace sous Linux, IsDebuggerPresent sous Windows)
- Vérifications temporelles pour l'exécution pas à pas
- Lorsqu'un débogage est détecté en production, le processus se termine proprement

:::info
L'anti-débogage est désactivé dans les builds de développement pour permettre les flux de débogage normaux.
:::

### Protection de la mémoire

- Les données sensibles (jetons, clés, mots de passe) sont stockées dans des régions de mémoire protégées
- La mémoire est mise à zéro après utilisation pour empêcher l'exposition de données résiduelles
- Sous Linux, `mlock` est utilisé pour empêcher les pages sensibles d'être transférées sur le disque

## Configuration

### Activer Steel Shield

Steel Shield est activé par défaut dans les déploiements en production. Configurez-le dans :

```yaml
# /etc/netrecon/security.yaml
steel_shield:
  enabled: true
  binary_integrity: true
  certificate_pinning: true
  tamper_response: true
  runtime_protection: true
  integrity_check_interval: 3600  # secondes
  tamper_check_interval: 300      # secondes
```

### Désactiver pour le développement

Pour les environnements de développement et de test :

```yaml
steel_shield:
  enabled: false
```

Ou désactivez des fonctionnalités spécifiques :

```yaml
steel_shield:
  enabled: true
  binary_integrity: false   # Ignorer la vérification de hachage en développement
  runtime_protection: false  # Autoriser l'attachement du débogueur
```

## Journal d'audit

Tous les événements Steel Shield sont journalisés dans le journal d'audit de sécurité :

```bash
# Voir les événements de sécurité récents
netrecon-shield audit --last 24h

# Exporter le journal d'audit
netrecon-shield audit --export csv --output security-audit.csv
```

Les entrées du journal d'audit incluent :
- Horodatage
- Type d'événement (integrity_check, pin_validation, tamper_detected, etc.)
- Composant affecté
- Résultat (succès/échec)
- Action entreprise
- Détails supplémentaires

## Considérations pour l'auto-hébergement

Lors de l'auto-hébergement, gardez à l'esprit :

1. **Certificats personnalisés** : si vous utilisez votre propre CA, mettez à jour la configuration d'épinglage de certificat après le déploiement
2. **Mises à jour de binaires** : après la mise à jour des binaires, exécutez `netrecon-shield init` pour reconstruire la base de données d'intégrité
3. **Sauvegardez la base de données d'intégrité** : incluez `/etc/netrecon/integrity.db` dans votre routine de sauvegarde
4. **Surveillez les alertes** : configurez les notifications par e-mail ou webhook pour les alertes d'altération

## FAQ

**Q : Steel Shield peut-il provoquer des faux positifs ?**
R : Les faux positifs sont rares mais peuvent se produire après des mises à jour système modifiant des bibliothèques partagées. Exécutez `netrecon-shield init` après les mises à jour système pour actualiser la base de données d'intégrité.

**Q : Steel Shield affecte-t-il les performances ?**
R : L'impact sur les performances est minimal. Les vérifications d'intégrité s'exécutent dans un thread d'arrière-plan et se terminent généralement en moins d'1 seconde.

**Q : Puis-je intégrer les alertes Steel Shield avec mon SIEM ?**
R : Oui. Configurez la sortie syslog dans la configuration de sécurité pour transmettre les événements à votre SIEM. Steel Shield prend en charge les formats de sortie syslog (RFC 5424) et JSON.

**Q : Steel Shield est-il requis pour les déploiements en production ?**
R : Steel Shield est fortement recommandé mais pas strictement requis. Vous pouvez le désactiver, mais cela supprime d'importantes protections de sécurité.

Pour obtenir de l'aide supplémentaire, contactez [support@netreconapp.com](mailto:support@netreconapp.com).
