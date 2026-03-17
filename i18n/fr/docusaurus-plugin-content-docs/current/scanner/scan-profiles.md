---
sidebar_position: 2
title: Profils de scan
description: Configurer la profondeur et la vitesse du scan avec des profils
---

# Profils de scan

Les profils de scan vous permettent de contrôler l'équilibre entre la vitesse et la minutie du scan. NetRecon inclut quatre profils intégrés, et vous pouvez créer des profils personnalisés pour des cas d'utilisation spécifiques.

## Profils intégrés

### Quick

Le profil le plus rapide, conçu pour une découverte rapide des hôtes avec un scan de ports minimal.

| Paramètre | Valeur |
|---|---|
| Découverte ARP | Oui |
| Plage de ports | Top 100 ports |
| Détection de services | Basique (services courants uniquement) |
| Profilage des appareils | OUI + empreinte de ports |
| Temps estimé (/24) | 1-2 minutes |

**Idéal pour :** Vérification rapide d'inventaire, vérifier qu'un appareil est en ligne, reconnaissance initiale.

### Standard

Un profil équilibré offrant une bonne couverture sans temps de scan excessif.

| Paramètre | Valeur |
|---|---|
| Découverte ARP | Oui |
| Plage de ports | Top 1 000 ports |
| Détection de services | Capture complète de bannières |
| Profilage des appareils | Complet (OUI + ports + bannières) |
| Temps estimé (/24) | 5-10 minutes |

**Idéal pour :** Audits réseau réguliers, évaluations de sécurité de routine, scan polyvalent.

### Deep

Scan complet vérifiant tous les ports courants avec une analyse de service approfondie.

| Paramètre | Valeur |
|---|---|
| Découverte ARP | Oui |
| Plage de ports | 1-10 000 |
| Détection de services | Capture complète de bannières + détection de version |
| Profilage des appareils | Complet avec référence croisée CVE |
| Temps estimé (/24) | 15-30 minutes |

**Idéal pour :** Audits de sécurité approfondis, vérifications de conformité, documentation réseau détaillée.

### Custom

Créez votre propre profil avec un contrôle complet sur chaque paramètre de scan.

## Créer un profil personnalisé

1. Ouvrez l'application NetRecon Scanner
2. Accédez à **Scan > Profiles**
3. Appuyez sur **Create New Profile**
4. Configurez les paramètres suivants :

### Paramètres de découverte

| Paramètre | Options | Par défaut |
|---|---|---|
| Méthode de découverte | ARP / Ping / Les deux | ARP |
| Sous-réseau | Détection auto / CIDR manuel | Détection auto |
| Exclure des IP | Liste séparée par des virgules | Aucune |

### Paramètres de scan de ports

| Paramètre | Options | Par défaut |
|---|---|---|
| Plage de ports | Top 100 / Top 1000 / 1-10000 / 1-65535 / Personnalisé | Top 1000 |
| Ports personnalisés | Séparés par des virgules (par ex., 22,80,443,8080) | — |
| Technique de scan | TCP Connect / SYN (root uniquement) | TCP Connect |
| Timeout par port | 500ms - 10 000ms | 2 000ms |
| Connexions simultanées max | 5 - 40 | 20 |

### Paramètres de détection de services

| Paramètre | Options | Par défaut |
|---|---|---|
| Capture de bannières | Désactivée / Basique / Complète | Basique |
| Détection de version | Oui / Non | Non |
| Info SSL/TLS | Oui / Non | Non |

### Paramètres de performance

| Paramètre | Options | Par défaut |
|---|---|---|
| Adaptatif batterie | Oui / Non | Oui |
| Sockets simultanés max | 5 - 40 | 20 |
| Délai entre les hôtes | 0ms - 1 000ms | 0ms |

5. Appuyez sur **Save Profile**

## Gestion des profils

### Exporter et importer des profils

Les profils peuvent être partagés entre appareils :

1. Accédez à **Scan > Profiles**
2. Appuyez longuement sur un profil
3. Sélectionnez **Export** pour générer un QR code ou un fichier JSON
4. Sur l'appareil destinataire, appuyez sur **Import Profile** et scannez le QR code ou sélectionnez le fichier

### Définir un profil par défaut

1. Accédez à **Scan > Profiles**
2. Appuyez longuement sur le profil souhaité
3. Sélectionnez **Set as Default**

Le profil par défaut est utilisé lorsque vous appuyez sur le bouton principal **Scan** sans sélectionner de profil.

## Profils de sonde

Lorsque connecté à une sonde, des options de profil supplémentaires sont disponibles :

| Paramètre | Description |
|---|---|
| Surveillance IDS | Activer Suricata IDS pendant le scan |
| Scan de vulnérabilités | Exécuter les vérifications de vulnérabilités Nuclei sur les services découverts |
| Capture PCAP | Enregistrer les paquets pendant le scan pour une analyse ultérieure |
| Découverte passive | Inclure les appareils observés passivement dans les résultats |

Ces options ne sont disponibles que lorsque l'application Scanner est connectée à une sonde.

## FAQ

**Q : Pourquoi le profil Deep prend-il autant de temps ?**
R : Le profil Deep scanne jusqu'à 10 000 ports par hôte avec une détection complète de service. Pour un sous-réseau /24 avec plus de 100 hôtes actifs, cela représente des millions de tentatives de connexion. Envisagez d'utiliser le profil Standard pour les vérifications de routine et de réserver le Deep pour les évaluations ciblées.

**Q : Puis-je scanner les 65 535 ports ?**
R : Oui, en créant un profil Custom avec la plage de ports définie sur « 1-65535 ». Sachez que cela augmente considérablement le temps de scan. Pour un seul hôte, un scan complet de ports prend environ 5-10 minutes ; pour un sous-réseau /24 entier, cela pourrait prendre plusieurs heures.

**Q : Le mode adaptatif batterie affecte-t-il les résultats du scan ?**
R : Le mode adaptatif batterie réduit le nombre de connexions simultanées lorsque la batterie est inférieure à 30%, ce qui ralentit le scan mais ne saute aucune cible ni aucun port. Les résultats sont identiques ; seul le temps de complétion change.

Pour obtenir de l'aide supplémentaire, contactez [support@netreconapp.com](mailto:support@netreconapp.com).
