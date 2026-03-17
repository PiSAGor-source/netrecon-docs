---
slug: /
sidebar_position: 1
title: Kom igång med NetRecon
description: Nätverksintelligensplattform för MSP:er och IT-team
---

# Kom igång med NetRecon

NetRecon är en nätverksintelligensplattform byggd för MSP:er och IT-team. Den erbjuder automatiserad nätverksupptäckt, enhetsinventering, sårbarhetsskanning, konfigurationshantering och realtidsövervakning — allt tillgängligt via en centraliserad instrumentpanel, mobilappar och REST API.

## Välj din distribution

<div className="row" style={{marginTop: '1.5rem'}}>

<div className="col col--6" style={{marginBottom: '1rem'}}>

### Egen hosting

Distribuera NetRecon på din egen infrastruktur med Docker Compose. Full kontroll över din data, inga externa beroenden.

- [Systemkrav](self-hosting/requirements)
- [Installationsguide](self-hosting/installation)
- [Konfigurationsreferens](self-hosting/configuration)

**Bäst för:** Organisationer med strikta krav på datasuveränitet, isolerade nätverk eller befintlig serverinfrastruktur.

</div>

<div className="col col--6" style={{marginBottom: '1rem'}}>

### Moln (SaaS)

Kom igång direkt med NetRecon Cloud. Ingen serverinstallation krävs — distribuera bara prober och börja skanna.

- [Snabbstartsguide](cloud/quickstart)

**Bäst för:** Team som vill komma igång snabbt utan att hantera serverinfrastruktur.

</div>

</div>

## Plattformskomponenter

| Komponent | Beskrivning |
|---|---|
| **Instrumentpanel** | Webbaserat kontrollpanel för alla NetRecon-funktioner |
| **NetRecon Scanner** | Android-app för nätverksskanning i fält ([Läs mer](scanner/overview)) |
| **Admin Connect** | Android-hanteringsapp för fjärradministration ([Läs mer](admin-connect/overview)) |
| **Agenter** | Lättviktsagenter för Windows, macOS och Linux-enheter ([Installation](agents/overview)) |
| **Prober** | Hårdvaru- eller VM-baserade nätverkssensorer för kontinuerlig övervakning |
| **API** | RESTful API för automation och integration ([API-referens](api/overview)) |

## Behöver du hjälp?

- Bläddra i dokumentationen via sidofältet
- Se [API-referensen](api/overview) för integrationsdetaljer
- Kontakta [support@netreconapp.com](mailto:support@netreconapp.com) för hjälp
