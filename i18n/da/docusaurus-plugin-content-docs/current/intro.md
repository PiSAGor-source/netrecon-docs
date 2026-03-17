---
slug: /
sidebar_position: 1
title: Kom godt i gang med NetRecon
description: Netværksintelligensplatform for MSP'er og IT-teams
---

# Kom godt i gang med NetRecon

NetRecon er en netværksintelligensplatform bygget til MSP'er og IT-teams. Den tilbyder automatiseret netværksopdagelse, enhedsoversigt, sårbarhedsscanning, konfigurationsstyring og realtidsovervågning — alt tilgængeligt via et centralt dashboard, mobilapps og REST API.

## Vælg din implementeringsmodel

<div className="row" style={{marginTop: '1.5rem'}}>

<div className="col col--6" style={{marginBottom: '1rem'}}>

### Self-Hosted

Implementer NetRecon på din egen infrastruktur med Docker Compose. Fuld kontrol over dine data, ingen eksterne afhængigheder.

- [Systemkrav](self-hosting/requirements)
- [Installationsguide](self-hosting/installation)
- [Konfigurationsreference](self-hosting/configuration)

**Bedst til:** Organisationer med strenge krav til datasuverænitet, isolerede netværk eller eksisterende serverinfrastruktur.

</div>

<div className="col col--6" style={{marginBottom: '1rem'}}>

### Cloud (SaaS)

Kom i gang med det samme med NetRecon Cloud. Ingen serveropsætning nødvendig — deploy blot prober og begynd at scanne.

- [Hurtigstartguide](cloud/quickstart)

**Bedst til:** Teams der ønsker at komme hurtigt i gang uden at skulle administrere serverinfrastruktur.

</div>

</div>

## Platformkomponenter

| Komponent | Beskrivelse |
|---|---|
| **Dashboard** | Webbaseret kontrolpanel til alle NetRecon-funktioner |
| **NetRecon Scanner** | Android-app til netværksscanning på farten ([Læs mere](scanner/overview)) |
| **Admin Connect** | Android-administrationsapp til fjernadministration ([Læs mere](admin-connect/overview)) |
| **Agenter** | Letvægtsagenter til Windows, macOS og Linux-endepunkter ([Installation](agents/overview)) |
| **Prober** | Hardware- eller VM-baserede netværkssensorer til kontinuerlig overvågning |
| **API** | RESTful API til automatisering og integration ([API-reference](api/overview)) |

## Brug for hjælp?

- Gennemse dokumentationen via sidepanelet
- Se [API-referencen](api/overview) for integrationsdetaljer
- Kontakt [support@netreconapp.com](mailto:support@netreconapp.com) for assistance
