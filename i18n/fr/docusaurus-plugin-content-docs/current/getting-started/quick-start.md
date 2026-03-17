---
sidebar_position: 2
title: Démarrage rapide
description: Du déballage à votre premier scan réseau en 10 minutes
---

# Guide de démarrage rapide

Passez de zéro à votre premier scan réseau en moins de 10 minutes. Ce guide suppose que vous avez déjà écrit l'image NetRecon OS sur votre support de stockage.

## Ce dont vous aurez besoin

- Un appareil sonde avec NetRecon OS installé (voir [Installation](./installation.md))
- Un câble Ethernet connecté à votre réseau
- Un smartphone ou un ordinateur sur le même réseau
- L'application NetRecon Scanner (optionnel, pour le scan mobile)

## Minutes 0-2 : Démarrer la sonde

1. Insérez la carte microSD préparée ou démarrez depuis le stockage interne
2. Connectez le câble Ethernet à votre commutateur ou routeur réseau
3. Mettez l'appareil sous tension
4. Attendez que le voyant LED vert devienne fixe (environ 60 secondes)

## Minutes 2-5 : Compléter l'assistant de configuration

1. Trouvez l'adresse IP de votre sonde dans la table DHCP de votre routeur, ou vérifiez la sortie console
2. Ouvrez `http://<probe-ip>:8080` dans votre navigateur
3. Complétez ces étapes essentielles de l'assistant :
   - **Définir le mot de passe admin** — choisissez un mot de passe fort
   - **Assigner les interfaces réseau** — sélectionnez quel port se connecte à votre réseau de scan
   - **Choisir le mode de scan** — sélectionnez « Single Interface » pour une configuration de base
   - **Configurer Cloudflare Tunnel** (optionnel) — active l'accès à distance via `https://probe.netreconapp.com`
4. Cliquez sur **Finish Setup**

## Minutes 5-7 : Vérifier le tableau de bord de la sonde

1. Après la fin de l'assistant, accédez à `http://<probe-ip>:3000`
2. Connectez-vous avec les identifiants admin que vous avez créés
3. Vérifiez que le tableau de bord affiche :
   - État du système : utilisation CPU, RAM, stockage
   - Interfaces réseau : au moins une interface en rôle « scan »
   - Services : les services principaux doivent afficher un statut vert

## Minutes 7-10 : Lancer votre premier scan

### Option A : Depuis le tableau de bord de la sonde

1. Accédez à **Scan > Start Scan**
2. Sélectionnez le sous-réseau cible (détecté automatiquement depuis votre interface de scan)
3. Choisissez le profil de scan **Quick**
4. Cliquez sur **Start**
5. Observez les appareils apparaître en temps réel sur le tableau de bord

### Option B : Depuis l'application NetRecon Scanner

1. Ouvrez l'application NetRecon Scanner sur votre appareil Android
2. L'application détectera la sonde via mDNS si vous êtes sur le même réseau
3. Alternativement, accédez à **Settings > Probe Connection** et entrez l'IP de la sonde
4. Appuyez sur **Scan** sur l'écran d'accueil
5. Sélectionnez votre réseau et appuyez sur **Start Scan**

## Ce qui se passe pendant un scan

1. **Découverte ARP** — la sonde envoie des requêtes ARP pour trouver tous les hôtes actifs sur le sous-réseau
2. **Scan de ports** — chaque hôte découvert est scanné pour les ports TCP ouverts
3. **Détection de services** — les ports ouverts sont sondés pour identifier le service en cours d'exécution et sa version
4. **Profilage des appareils** — la sonde combine la recherche OUI de l'adresse MAC, les ports ouverts et les bannières de service pour identifier le type d'appareil

## Étapes suivantes

Maintenant que vous avez terminé votre premier scan, explorez ces fonctionnalités :

- [Profils de scan](../scanner/scan-profiles.md) — personnaliser la profondeur et la vitesse du scan
- [Rapports](../scanner/reports.md) — générer des rapports PDF de vos résultats de scan
- [Admin Connect](../admin-connect/overview.md) — configurer la gestion à distance
- [Déploiement d'agents](../agents/overview.md) — déployer des agents sur vos terminaux

## FAQ

**Q : Le scan a trouvé moins d'appareils que prévu. Pourquoi ?**
R : Assurez-vous que la sonde est sur le bon VLAN/sous-réseau. Les pare-feu ou les pare-feu côté client peuvent bloquer les réponses ARP. Essayez d'exécuter un profil **Standard** au lieu de **Quick** pour une découverte plus approfondie.

**Q : Puis-je scanner plusieurs sous-réseaux ?**
R : Oui. Configurez des sous-réseaux supplémentaires dans le tableau de bord de la sonde sous **Settings > Scan Targets**. Le scan multi-sous-réseaux nécessite un routage approprié ou plusieurs interfaces réseau.

**Q : Combien de temps dure un scan ?**
R : Un scan Quick d'un sous-réseau /24 se termine généralement en moins de 2 minutes. Le Standard prend 5-10 minutes. Les scans Deep peuvent prendre 15-30 minutes selon le nombre d'hôtes et de ports scannés.

Pour obtenir de l'aide supplémentaire, contactez [support@netreconapp.com](mailto:support@netreconapp.com).
