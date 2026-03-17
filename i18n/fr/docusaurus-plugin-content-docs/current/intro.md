---
slug: /
sidebar_position: 1
title: Premiers pas avec NetRecon
description: Plateforme d'intelligence réseau pour les MSP et les équipes IT
---

# Premiers pas avec NetRecon

NetRecon est une plateforme d'intelligence réseau conçue pour les MSP et les équipes IT. Elle offre la découverte automatique du réseau, l'inventaire des appareils, l'analyse des vulnérabilités, la gestion de configuration et la surveillance en temps réel — le tout accessible via un tableau de bord centralisé, des applications mobiles et une API REST.

## Choisissez votre déploiement

<div className="row" style={{marginTop: '1.5rem'}}>

<div className="col col--6" style={{marginBottom: '1rem'}}>

### Auto-hébergé

Déployez NetRecon sur votre propre infrastructure à l'aide de Docker Compose. Contrôle total de vos données, sans dépendances externes.

- [Configuration requise](self-hosting/requirements)
- [Guide d'installation](self-hosting/installation)
- [Référence de configuration](self-hosting/configuration)

**Idéal pour :** Les organisations ayant des exigences strictes en matière de souveraineté des données, des réseaux isolés ou une infrastructure serveur existante.

</div>

<div className="col col--6" style={{marginBottom: '1rem'}}>

### Cloud (SaaS)

Démarrez instantanément avec NetRecon Cloud. Aucune configuration de serveur requise — déployez simplement des sondes et commencez à scanner.

- [Guide de démarrage rapide](cloud/quickstart)

**Idéal pour :** Les équipes qui souhaitent être opérationnelles rapidement sans gérer d'infrastructure serveur.

</div>

</div>

## Composants de la plateforme

| Composant | Description |
|---|---|
| **Dashboard** | Panneau de contrôle web pour toutes les fonctionnalités NetRecon |
| **NetRecon Scanner** | Application Android pour le scan réseau en déplacement ([En savoir plus](scanner/overview)) |
| **Admin Connect** | Application Android de gestion pour l'administration à distance ([En savoir plus](admin-connect/overview)) |
| **Agents** | Agents légers pour les terminaux Windows, macOS et Linux ([Installation](agents/overview)) |
| **Probes** | Capteurs réseau matériels ou basés sur VM pour la surveillance continue |
| **API** | API RESTful pour l'automatisation et l'intégration ([Référence API](api/overview)) |

## Besoin d'aide ?

- Parcourez la documentation à l'aide de la barre latérale
- Consultez la [Référence API](api/overview) pour les détails d'intégration
- Contactez [support@netreconapp.com](mailto:support@netreconapp.com) pour obtenir de l'aide
