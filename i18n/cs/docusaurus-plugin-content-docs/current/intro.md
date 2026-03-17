---
slug: /
sidebar_position: 1
title: Začínáme s NetRecon
description: Platforma pro síťovou inteligenci pro MSP a IT týmy
---

# Začínáme s NetRecon

NetRecon je platforma pro síťovou inteligenci vytvořená pro MSP a IT týmy. Poskytuje automatizované zjišťování sítě, inventář zařízení, skenování zranitelností, správu konfigurace a monitorování v reálném čase — vše dostupné prostřednictvím centralizovaného řídicího panelu, mobilních aplikací a REST API.

## Vyberte si typ nasazení

<div className="row" style={{marginTop: '1.5rem'}}>

<div className="col col--6" style={{marginBottom: '1rem'}}>

### Self-Hosted

Nasaďte NetRecon na vlastní infrastrukturu pomocí Docker Compose. Plná kontrola nad vašimi daty, žádné vnější závislosti.

- [Systémové požadavky](self-hosting/requirements)
- [Průvodce instalací](self-hosting/installation)
- [Referenční příručka konfigurace](self-hosting/configuration)

**Nejvhodnější pro:** Organizace s přísnými požadavky na datovou suverenitu, izolované sítě nebo existující serverovou infrastrukturu.

</div>

<div className="col col--6" style={{marginBottom: '1rem'}}>

### Cloud (SaaS)

Začněte okamžitě s NetRecon Cloud. Není potřeba žádné nastavení serveru — stačí nasadit sondy a začít skenovat.

- [Průvodce rychlým startem](cloud/quickstart)

**Nejvhodnější pro:** Týmy, které chtějí rychle začít pracovat bez správy serverové infrastruktury.

</div>

</div>

## Komponenty platformy

| Komponenta | Popis |
|---|---|
| **Dashboard** | Webový řídicí panel pro všechny funkce NetRecon |
| **NetRecon Scanner** | Android aplikace pro skenování sítě na cestách ([Více informací](scanner/overview)) |
| **Admin Connect** | Android aplikace pro vzdálenou správu ([Více informací](admin-connect/overview)) |
| **Agenti** | Lehcí agenti pro koncové stanice s Windows, macOS a Linux ([Instalace](agents/overview)) |
| **Sondy** | Hardwarové nebo VM síťové senzory pro kontinuální monitorování |
| **API** | RESTful API pro automatizaci a integraci ([Reference API](api/overview)) |

## Potřebujete pomoc?

- Procházejte dokumentaci pomocí postranního panelu
- Podívejte se na [referenci API](api/overview) pro detaily integrace
- Kontaktujte [support@netreconapp.com](mailto:support@netreconapp.com) pro pomoc
