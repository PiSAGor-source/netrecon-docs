---
sidebar_position: 3
title: Modes réseau
description: Comprendre les modes réseau Single, Dual Scan, Bridge et TAP
---

# Modes réseau

NetRecon prend en charge quatre modes réseau qui déterminent comment la sonde se connecte à votre réseau et le surveille. Le choix du bon mode dépend de votre matériel, de votre topologie réseau et de vos objectifs de surveillance.

## Prérequis

- Au moins une interface Ethernet détectée et un rôle attribué
- Compréhension de votre topologie réseau (configuration des commutateurs, VLAN, etc.)

## Comparaison des modes

| Fonctionnalité | Single | Dual Scan | Bridge | TAP |
|---|---|---|---|---|
| NIC minimum | 1 | 2 | 2 | 2 |
| Scan actif | Oui | Oui | Oui | Non |
| Surveillance passive | Limitée | Limitée | Oui | Oui |
| Perturbation réseau | Aucune | Aucune | Minimale | Aucune |
| Déploiement en ligne | Non | Non | Oui | Non |
| Idéal pour | Petits réseaux | Réseaux segmentés | Visibilité totale | Réseaux de production |

## Mode Single Interface

La configuration la plus simple. Un seul port Ethernet gère tout : scan, gestion et accès internet.

```
┌─────────────────────────────────────────┐
│              Network Switch             │
│                                         │
│  Port 1    Port 2    Port 3    Port 4   │
│    │         │         │         │      │
│    │         │         │         │      │
└────┼─────────┼─────────┼─────────┼──────┘
     │         │         │         │
   Probe    PC/Server  PC/Server  Router
  (eth0)
```

**Fonctionnement :**
- La sonde se connecte à un port de commutateur ordinaire
- La découverte ARP et le scan de ports passent par la même interface
- Le tableau de bord de gestion et l'accès distant utilisent également cette interface

**Quand l'utiliser :**
- Vous avez un appareil à une seule NIC (ex. : Raspberry Pi sans adaptateur USB)
- Petits réseaux (< 50 appareils)
- Déploiement rapide où la simplicité est préférée

**Limitations :**
- Le trafic de scan partage la bande passante avec le trafic de gestion
- Impossible de voir le trafic entre les autres appareils (uniquement le trafic vers/depuis la sonde)

## Mode Dual Scan

Deux interfaces séparées : une dédiée au scan et une pour la gestion/l'uplink.

```
┌─────────────────────────────────────────┐
│            Target Network Switch        │
│  Port 1    Port 2    Port 3    Port 4   │
│    │         │         │         │      │
└────┼─────────┼─────────┼─────────┼──────┘
     │         │         │         │
   Probe    PC/Server  PC/Server  │
  (eth0)                          │
                                  │
┌──────────────────────────────────┼──────┐
│         Management Switch        │      │
│  Port 1         Port 2         Port 3   │
│    │               │             │      │
└────┼───────────────┼─────────────┼──────┘
     │               │             │
   Probe          Admin PC       Router
  (eth1)
```

**Fonctionnement :**
- `eth0` (Scan) se connecte au réseau cible pour la découverte et le scan
- `eth1` (Management) se connecte à votre réseau d'administration pour l'accès au tableau de bord

**Quand l'utiliser :**
- Vous souhaitez isoler le trafic de scan du trafic de gestion
- Le réseau cible et le réseau de gestion sont sur des sous-réseaux/VLAN différents
- Orange Pi R2S ou tout appareil à double NIC

**Avantages :**
- Séparation nette du trafic de scan et de gestion
- L'interface de gestion reste réactive pendant les scans intensifs
- Possibilité de scanner un réseau sur lequel vous ne souhaitez pas de trafic de gestion

## Mode Bridge

La sonde se positionne en ligne entre deux segments réseau, transmettant le trafic de manière transparente tout en inspectant tous les paquets qui transitent.

```
                    ┌──────────┐
                    │  Probe   │
                    │          │
                    │ eth0  eth1│
                    └──┬────┬──┘
                       │    │
          ┌────────────┘    └────────────┐
          │                              │
┌─────────┼──────────┐    ┌─────────────┼─────┐
│   Switch A         │    │       Switch B     │
│   (Upstream)       │    │    (Downstream)    │
│                    │    │                    │
│  Servers / Router  │    │   Workstations     │
└────────────────────┘    └────────────────────┘
```

**Fonctionnement :**
- La sonde fait un pont entre `eth0` et `eth1` au niveau de la couche 2
- Tout le trafic entre les deux segments passe par la sonde
- La sonde inspecte chaque paquet sans être un saut de routage
- Le scan actif peut également être effectué depuis les interfaces du pont

**Quand l'utiliser :**
- Vous avez besoin d'une visibilité totale du trafic (IDS, capture PCAP)
- Vous souhaitez surveiller le trafic entre les segments réseau
- Déploiement entre un commutateur central et un commutateur d'accès

**Considérations :**
- La sonde devient un point unique de défaillance pour le chemin ponté
- NetRecon inclut une capacité de basculement ouvert : si la sonde perd l'alimentation, le trafic continue de circuler via le bypass matériel (sur les appareils pris en charge)
- Ajoute une latence minimale (< 1 ms sur du matériel typique)

## Mode TAP

La sonde reçoit une copie du trafic réseau depuis un appareil TAP ou un port SPAN/miroir du commutateur. Elle opère de manière entièrement passive.

```
┌─────────────────────────────────────────┐
│              Network Switch             │
│                                         │
│  Port 1    Port 2    SPAN Port          │
│    │         │         │                │
└────┼─────────┼─────────┼────────────────┘
     │         │         │
   Server    Server    Probe
                      (eth0 — monitor)

                      (eth1 — management,
                       connected to admin network)
```

**Fonctionnement :**
- Le commutateur envoie une copie du trafic vers son port SPAN/miroir
- L'interface de scan de la sonde reçoit ce trafic miroir en mode promiscuité
- Aucun paquet n'est réinjecté dans le réseau depuis l'interface de scan
- Une interface de gestion séparée fournit l'accès au tableau de bord

**Quand l'utiliser :**
- Réseaux de production où l'injection de trafic de scan n'est pas acceptable
- Environnements de conformité nécessitant une surveillance exclusivement passive
- Lorsque vous souhaitez de l'IDS et de l'analyse de trafic sans scan actif

**Configuration de votre commutateur :**
- Sur Cisco : `monitor session 1 source vlan 10` / `monitor session 1 destination interface Gi0/24`
- Sur HP/Aruba : `mirror-port <port>`
- Sur Juniper : `set forwarding-options port-mirroring input ingress interface <source>`

**Limitations :**
- Impossible d'effectuer un scan actif (découverte ARP, scan de ports) depuis l'interface TAP
- La découverte d'appareils repose entièrement sur le trafic observé
- Vous pouvez manquer des appareils inactifs qui ne génèrent pas de trafic pendant la période d'observation

## Changement de mode après la configuration

Vous pouvez changer le mode réseau à tout moment depuis le tableau de bord de la sonde :

1. Naviguez vers **Settings > Network**
2. Sélectionnez un nouveau mode
3. Réattribuez les rôles des interfaces si nécessaire
4. Cliquez sur **Apply**

:::warning
Le changement de mode réseau interrompra brièvement les services de la sonde. Planifiez les changements de mode pendant une fenêtre de maintenance.
:::

## FAQ

**Q : Quel mode recommandez-vous pour une première installation ?**
R : Commencez par le mode **Single Interface** pour sa simplicité. Vous pourrez passer au mode Dual Scan ou Bridge ultérieurement selon l'évolution de vos besoins.

**Q : Puis-je combiner le mode TAP avec le scan actif ?**
R : Oui, si vous avez trois interfaces ou plus. Attribuez-en une au TAP (passif), une au scan actif et une à la gestion.

**Q : Le mode Bridge affecte-t-il les performances réseau ?**
R : La sonde ajoute moins de 1 ms de latence en mode bridge. Sur l'Orange Pi R2S avec des ports 2.5G, le débit reste au débit nominal pour les charges de trafic d'entreprise typiques.

Pour une aide supplémentaire, contactez [support@netreconapp.com](mailto:support@netreconapp.com).
