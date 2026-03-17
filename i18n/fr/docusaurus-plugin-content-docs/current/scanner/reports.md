---
sidebar_position: 3
title: Rapports
description: Générer et personnaliser des rapports PDF d'audit de sécurité
---

# Rapports

NetRecon Scanner génère des rapports PDF professionnels à partir de vos résultats de scan. Les rapports sont conçus pour les audits de sécurité, la documentation de conformité et les livrables clients.

## Prérequis

- Au moins un scan terminé avec des résultats
- Espace de stockage suffisant sur l'appareil pour la génération de PDF (généralement 1-5 Mo par rapport)

## Générer un rapport

1. Effectuez un scan réseau
2. Depuis l'écran des résultats de scan, appuyez sur le bouton **Report** dans le coin supérieur droit
3. Sélectionnez le type de rapport et personnalisez les options
4. Appuyez sur **Generate PDF**
5. Le rapport sera enregistré et pourra être partagé via n'importe quelle méthode de partage Android

## Contenu du rapport

Un rapport standard comprend les sections suivantes :

### Résumé exécutif
- Date et durée du scan
- Périmètre réseau (sous-réseau, profil utilisé)
- Nombre total d'appareils découverts
- Résumé des résultats clés (ports à haut risque ouverts, appareils non identifiés)

### Inventaire des appareils
- Liste complète des appareils découverts
- Adresse IP, adresse MAC, nom d'hôte
- Type d'appareil et fabricant
- Système d'exploitation (lorsque détecté)

### Analyse des ports et services
- Ports ouverts par appareil
- Services en cours d'exécution et versions
- Classification du risque des services (Faible / Moyen / Élevé / Critique)

### Résultats de sécurité
- Appareils avec des ports ouverts à haut risque (par ex., Telnet, FTP, SMB)
- Services non chiffrés détectés
- Versions de services par défaut ou connues comme vulnérables
- Références CVE pour les versions de services détectées (lorsque la base de données CVE est disponible)

### Topologie réseau
- Résumé textuel de la disposition du réseau
- Distribution des appareils par type (serveurs, postes de travail, équipements réseau, IoT)

### Annexe
- Détails complets du scan de ports par hôte
- Bannières de service brutes
- Configuration du scan et paramètres de profil

## Personnalisation du rapport

Avant la génération, vous pouvez personnaliser le rapport :

| Option | Description |
|---|---|
| Nom de l'entreprise | Apparaît dans l'en-tête et la page de titre |
| Titre du rapport | Titre personnalisé (par défaut : « Network Security Audit Report ») |
| Logo | Téléchargez un logo d'entreprise pour la page de titre |
| Inclure les sections | Activer/désactiver les sections individuelles |
| Label de sensibilité | Confidentiel / Interne / Public |
| Langue | Générer le rapport dans l'une des 11 langues supportées |

## Partager les rapports

Après la génération, partagez le PDF via :

- **E-mail** — appuyez sur Partager et sélectionnez votre application e-mail
- **Stockage cloud** — enregistrez sur Google Drive, OneDrive, etc.
- **QR code** — générez un QR code qui pointe vers le rapport hébergé localement (utile pour le transmettre à un collègue sur le même réseau)
- **Transfert direct** — utilisez la fonctionnalité de partage à proximité d'Android

## Support des polices et Unicode

Les rapports utilisent la famille de polices NotoSans pour garantir un rendu correct de :
- Caractères latins (EN, DE, FR, ES, NL, etc.)
- Caractères cyrilliques (RU)
- Caractères spéciaux turcs (TR)
- Caractères scandinaves (SV, NO, DA)
- Caractères polonais (PL)

Les 11 langues supportées s'affichent correctement dans les PDF générés.

## Stockage des rapports

Les rapports générés sont stockés localement sur l'appareil :

- Emplacement par défaut : stockage interne de l'application
- Les rapports peuvent être exportés vers un stockage externe ou le cloud
- Les anciens rapports peuvent être gérés depuis **Reports > History**
- Les rapports n'expirent pas et restent disponibles jusqu'à leur suppression manuelle

## FAQ

**Q : Puis-je générer un rapport à partir des résultats de scan de la sonde ?**
R : Oui. Lorsque connecté à une sonde, vous pouvez générer des rapports à partir des résultats de scan locaux et des données de scan de la sonde. Les rapports de sonde peuvent inclure des données supplémentaires telles que les alertes IDS et les résultats de vulnérabilité.

**Q : Quelle est la taille maximale de réseau pour un rapport ?**
R : Les rapports ont été testés avec des réseaux allant jusqu'à 1 000 appareils. Les réseaux plus grands peuvent prendre plus de temps à générer mais il n'y a pas de limite stricte.

**Q : Puis-je planifier des rapports automatiques ?**
R : La génération programmée de rapports est disponible sur le tableau de bord de la sonde. Configurez les planifications de rapports sous **Settings > Reports > Schedule**.

**Q : Le PDF affiche du texte illisible. Comment corriger cela ?**
R : Cela se produit généralement lors de l'affichage sur un appareil sans support de la police NotoSans. Ouvrez le PDF dans Google Chrome, Adobe Acrobat ou tout lecteur PDF moderne prenant en charge les polices intégrées.

Pour obtenir de l'aide supplémentaire, contactez [support@netreconapp.com](mailto:support@netreconapp.com).
