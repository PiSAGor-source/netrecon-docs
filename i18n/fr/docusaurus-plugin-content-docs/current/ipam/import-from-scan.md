---
sidebar_position: 2
title: Importer depuis un scan
description: Import automatique des IP découvertes depuis les résultats de scan vers IPAM
---

# Importer depuis un scan

IPAM peut automatiquement importer les appareils découverts depuis les résultats de scan, éliminant la saisie manuelle de données et garantissant que votre inventaire IP reste à jour.

## Prérequis

- Au moins un scan réseau terminé avec des résultats
- Le sous-réseau cible défini dans IPAM (ou la volonté d'en créer un lors de l'import)
- Rôle Analyst, Operator, Admin ou Super Admin

## Fonctionnement de l'import

Lorsque vous importez des résultats de scan dans IPAM :

1. Chaque adresse IP découverte est vérifiée par rapport aux enregistrements IPAM existants
2. Les nouvelles IP sont créées avec le statut "Assigned"
3. Les IP existantes sont mises à jour avec la dernière adresse MAC, le nom d'hôte et l'horodatage "Last Seen"
4. Les conflits (ex. : adresse MAC modifiée pour une IP) sont signalés pour vérification
5. Un rapport de synthèse indique ce qui a été importé et ce qui nécessite une attention

## Import étape par étape

### Étape 1 : Ouvrir la boîte de dialogue d'import

**Depuis IPAM :**
1. Naviguez vers **IPAM > Subnets**
2. Sélectionnez le sous-réseau cible
3. Cliquez sur **Import from Scan**

**Depuis les résultats de scan :**
1. Naviguez vers **Scan > Results**
2. Sélectionnez un scan terminé
3. Cliquez sur **Export to IPAM**

### Étape 2 : Sélectionner le scan

Choisissez les résultats de scan à importer :

| Option | Description |
|---|---|
| Dernier scan | Importer depuis le scan le plus récent |
| Scan spécifique | Choisir un scan par date/heure |
| Tous les scans (fusion) | Combiner les résultats de plusieurs scans |

### Étape 3 : Vérifier l'aperçu d'import

Avant d'importer, vérifiez le tableau d'aperçu :

| Colonne | Description |
|---|---|
| IP Address | L'IP découverte |
| MAC Address | MAC associée |
| Hostname | Nom d'hôte découvert |
| Action | New / Update / Conflict |
| Details | Ce qui va changer |

- **New** — cette IP n'existe pas dans IPAM et sera créée
- **Update** — cette IP existe et sera mise à jour avec les nouvelles données
- **Conflict** — cette IP a des données conflictuelles (voir Résolution des conflits ci-dessous)

### Étape 4 : Résoudre les conflits

Les conflits surviennent lorsque :

- **Incompatibilité d'adresse MAC** — l'IP existe dans IPAM avec une adresse MAC différente de celle trouvée par le scan
- **MAC en double** — la même adresse MAC apparaît sur plusieurs IP
- **Conflit de statut** — l'IP est marquée "Reserved" dans IPAM mais a été trouvée active dans le scan

Pour chaque conflit, choisissez une résolution :

| Résolution | Action |
|---|---|
| **Garder IPAM** | Ignorer les données du scan, conserver l'enregistrement IPAM existant |
| **Utiliser le scan** | Écraser les données IPAM avec les résultats du scan |
| **Marquer pour vérification** | Importer les données mais les marquer comme "Needs Review" |

### Étape 5 : Importer

1. Après avoir résolu tous les conflits, cliquez sur **Import**
2. Une barre de progression affiche l'état de l'import
3. Une fois terminé, un résumé affiche :
   - IP créées
   - IP mises à jour
   - Conflits résolus
   - Erreurs (le cas échéant)

## Import automatique

Configurez l'import automatique après chaque scan :

1. Naviguez vers **IPAM > Settings > Auto-Import**
2. Activez **Auto-import scan results**
3. Configurez les options :

| Option | Par défaut | Description |
|---|---|---|
| Créer de nouvelles IP | Oui | Créer automatiquement de nouveaux enregistrements IP |
| Mettre à jour les existants | Oui | Mettre à jour les enregistrements existants avec des données fraîches |
| Gestion des conflits | Marquer pour vérification | Que faire avec les conflits |
| Création auto de sous-réseau | Non | Créer le sous-réseau dans IPAM s'il n'existe pas |

4. Cliquez sur **Save**

Avec l'import automatique activé, IPAM reste synchronisé avec vos données de scan sans intervention manuelle.

## Import depuis CSV

Vous pouvez également importer des données IP depuis des sources externes :

1. Naviguez vers **IPAM > Import > CSV**
2. Téléchargez le modèle CSV
3. Remplissez vos données en suivant le format du modèle :

```csv
ip_address,mac_address,hostname,status,owner,notes
192.168.1.10,AA:BB:CC:DD:EE:01,fileserver,Assigned,IT Dept,Primary NAS
192.168.1.11,AA:BB:CC:DD:EE:02,printer-01,Assigned,Office,2nd floor
192.168.1.20,,reserved-ip,Reserved,IT Dept,Future use
```

4. Téléversez le CSV et vérifiez l'aperçu
5. Résolvez les éventuels conflits
6. Cliquez sur **Import**

## Enrichissement des données

Lors de l'import, IPAM enrichit automatiquement les données :

| Champ | Source |
|---|---|
| Fabricant | Recherche dans la base de données OUI à partir de l'adresse MAC |
| Type d'appareil | Données de profilage du moteur de scan |
| Ports ouverts | Résultats du scan de ports |
| Services | Résultats de la détection de services |
| Dernière activité | Horodatage du scan |

## FAQ

**Q : L'import écrasera-t-il mes notes et attributions de propriétaire manuelles ?**
R : Non. L'import ne met à jour que les champs techniques (MAC, nom d'hôte, dernière activité). Les champs personnalisés comme Owner, Notes et Status sont préservés sauf si vous choisissez explicitement "Utiliser le scan" pour un conflit.

**Q : Puis-je annuler un import ?**
R : Oui. Chaque import crée un instantané. Naviguez vers **IPAM > Import History** et cliquez sur **Rollback** sur l'import que vous souhaitez annuler.

**Q : Que se passe-t-il pour les IP qui étaient dans IPAM mais non trouvées dans le scan ?**
R : Elles restent inchangées. Un appareil n'apparaissant pas dans un scan ne signifie pas qu'il a disparu — il peut être éteint ou sur un VLAN différent. Utilisez le rapport "Stale IP" (**IPAM > Reports > Stale IPs**) pour trouver les IP qui n'ont pas été vues depuis une période configurable.

**Q : Puis-je importer depuis plusieurs sous-réseaux à la fois ?**
R : Oui. Si votre scan couvre plusieurs sous-réseaux, l'import distribuera les IP vers les sous-réseaux IPAM appropriés en fonction de leurs adresses. Les sous-réseaux doivent déjà exister dans IPAM (ou activez "Création auto de sous-réseau" dans les paramètres d'import automatique).

Pour une aide supplémentaire, contactez [support@netreconapp.com](mailto:support@netreconapp.com).
