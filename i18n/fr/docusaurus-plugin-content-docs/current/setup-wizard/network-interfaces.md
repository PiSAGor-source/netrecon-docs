---
sidebar_position: 2
title: Interfaces réseau
description: Attribution des rôles NIC et récupération de pilote dans l'assistant de configuration
---

# Interfaces réseau

L'étape Interfaces réseau de l'assistant de configuration détecte tous les ports Ethernet de votre sonde et vous permet d'attribuer un rôle à chacun. Une attribution correcte des interfaces est essentielle pour un scan fiable et un accès de gestion stable.

## Prérequis

- Au moins un câble Ethernet connecté avant de démarrer l'assistant
- Pour les configurations multi-NIC, étiquetez vos câbles avant de les brancher afin de savoir quel port se connecte où

## Détection des interfaces

Lorsque vous atteignez l'étape 4 de l'assistant, le système recherche toutes les interfaces réseau disponibles et affiche :

- **Nom de l'interface** (ex. : `eth0`, `eth1`, `enp1s0`)
- **Adresse MAC**
- **État de la liaison** (connecté / déconnecté)
- **Vitesse** (ex. : 1 Gbps, 2.5 Gbps)
- **Pilote** (ex. : `r8169`, `r8152`)

## Rôles des interfaces

Chaque interface détectée peut se voir attribuer l'un des rôles suivants :

### Scan

Le rôle principal pour la découverte réseau. Cette interface envoie des requêtes ARP, effectue des scans de ports et capture le trafic. Elle doit être connectée au segment réseau que vous souhaitez surveiller.

**Bonne pratique :** Connectez-la à un port d'accès de votre commutateur ou à un port SPAN/miroir pour la surveillance passive.

### Management

Utilisée pour accéder au tableau de bord de la sonde, recevoir les connexions distantes et les mises à jour système. Cette interface doit avoir une connectivité fiable.

**Bonne pratique :** Attribuez une IP statique à l'interface de gestion afin que son adresse ne change pas.

### Uplink

L'interface connectée à votre passerelle internet. Utilisée pour Cloudflare Tunnel, les mises à jour système et la connectivité externe. Dans de nombreuses configurations, les rôles de gestion et d'uplink peuvent partager la même interface.

### Unused

Les interfaces définies sur "Unused" sont désactivées et ne participent à aucune activité réseau.

## Exemples d'attribution de rôles

### Orange Pi R2S (2 ports)

```
eth0 (2.5G) → Scan       — connecté au commutateur du réseau cible
eth1 (1G)   → Management  — connecté à votre VLAN d'administration
```

### Raspberry Pi 4 (1 port intégré + adaptateur USB)

```
eth0        → Scan       — port intégré, connecté au réseau cible
eth1 (USB)  → Management — adaptateur Ethernet USB, connecté au réseau d'administration
```

### Mini PC x86_64 (4 ports)

```
eth0  → Scan        — connecté au VLAN cible 1
eth1  → Scan        — connecté au VLAN cible 2
eth2  → Management  — connecté au réseau d'administration
eth3  → Uplink      — connecté à la passerelle internet
```

## Récupération de pilote

Si une interface est détectée mais affiche "No Driver" ou "Driver Error", l'assistant inclut une fonctionnalité de récupération de pilote :

1. L'assistant vérifie sa base de données de pilotes intégrée pour les pilotes compatibles
2. Si une correspondance est trouvée, cliquez sur **Install Driver** pour le charger
3. Après l'installation du pilote, l'interface apparaîtra avec tous les détails
4. Si aucun pilote correspondant n'est trouvé, vous devrez peut-être l'installer manuellement après avoir terminé l'assistant

:::tip
Le problème de pilote le plus courant survient avec les adaptateurs Ethernet USB Realtek (`r8152`). NetRecon OS inclut les pilotes pour les adaptateurs les plus populaires d'origine.
:::

## Identification des interfaces

Si vous ne savez pas quel port physique correspond à quel nom d'interface :

1. Cliquez sur le bouton **Identify** à côté d'une interface dans l'assistant
2. La sonde fera clignoter la LED de liaison sur ce port pendant 10 secondes
3. Regardez votre appareil sonde pour voir quel port clignote

Alternativement, vous pouvez brancher/débrancher les câbles un par un et observer le changement d'état de la liaison dans l'assistant.

## Support VLAN

Si votre réseau utilise des VLAN, vous pouvez configurer le marquage VLAN sur n'importe quelle interface :

1. Sélectionnez l'interface
2. Activez **VLAN Tagging**
3. Entrez l'ID VLAN (1-4094)
4. La sonde créera une interface virtuelle (ex. : `eth0.100`) pour ce VLAN

C'est utile pour scanner plusieurs VLAN depuis une seule interface physique connectée à un port trunk.

## FAQ

**Q : Puis-je attribuer plusieurs rôles à une seule interface ?**
R : En mode Single Interface, les rôles de scan et de gestion partagent un seul port. Dans les autres modes, chaque interface devrait avoir un seul rôle dédié.

**Q : Mon adaptateur Ethernet USB n'est pas détecté. Que faire ?**
R : Essayez un autre port USB. Si l'adaptateur n'est toujours pas détecté, il n'est peut-être pas compatible. Les chipsets pris en charge incluent Realtek RTL8153, RTL8152, ASIX AX88179 et Intel I225.

**Q : Puis-je changer les rôles des interfaces après l'assistant ?**
R : Oui. Allez dans **Settings > Network** dans le tableau de bord de la sonde pour réattribuer les rôles des interfaces à tout moment.

Pour une aide supplémentaire, contactez [support@netreconapp.com](mailto:support@netreconapp.com).
