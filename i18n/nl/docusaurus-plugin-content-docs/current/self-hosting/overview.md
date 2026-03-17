---
sidebar_position: 1
title: Overzicht self-hosting
description: Draai het NetRecon-platform op uw eigen infrastructuur
---

# Self-hosting

NetRecon kan volledig self-hosted worden op uw eigen infrastructuur, waardoor u volledige controle hebt over uw gegevens, beveiliging en implementatie.

## Waarom self-hosten?

| Voordeel | Beschrijving |
|---|---|
| **Gegevenssoevereiniteit** | Alle scanresultaten, configuraties en logboeken blijven op uw servers |
| **Compliance** | Voldoe aan wettelijke eisen die on-premises gegevensopslag vereisen |
| **Netwerkisolatie** | Draai in air-gapped omgevingen zonder internetafhankelijkheid |
| **Aangepaste integratie** | Directe databasetoegang voor aangepaste rapportage en integratie |
| **Kostenbeheer** | Geen per-probe licentiekosten voor de serverinfrastructuur |

## Architectuur

Een self-hosted NetRecon-implementatie bestaat uit meerdere microservices die in Docker-containers draaien:

```
┌────────────────────────────────────────────────────────┐
│                    Docker Host                         │
│                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │ API Gateway  │  │ Vault Server │  │  License     ││
│  │   :8000      │  │   :8001      │  │  Server :8002││
│  └──────────────┘  └──────────────┘  └──────────────┘│
│                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │ Email        │  │ Notification │  │  Update      ││
│  │ Service :8003│  │ Service :8004│  │  Server :8005││
│  └──────────────┘  └──────────────┘  └──────────────┘│
│                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │ Agent        │  │ Warranty     │  │  CMod        ││
│  │ Registry:8006│  │ Service :8007│  │  Service:8008││
│  └──────────────┘  └──────────────┘  └──────────────┘│
│                                                        │
│  ┌──────────────┐  ┌──────────────┐                   │
│  │ IPAM         │  │ PostgreSQL   │                   │
│  │ Service :8009│  │   :5432      │                   │
│  └──────────────┘  └──────────────┘                   │
│                                                        │
│  ┌──────────────┐  ┌──────────────┐                   │
│  │ Redis        │  │ Nginx        │                   │
│  │   :6379      │  │ Reverse Proxy│                   │
│  └──────────────┘  └──────────────┘                   │
└────────────────────────────────────────────────────────┘
```

## Service-overzicht

| Service | Poort | Doel |
|---|---|---|
| API Gateway | 8000 | Centrale API-routering, authenticatie |
| Vault Server | 8001 | Beheer van geheimen, opslag van inloggegevens |
| License Server | 8002 | Licentievalidatie en -beheer |
| Email Service | 8003 | E-mailmeldingen en waarschuwingen |
| Notification Service | 8004 | Pushmeldingen, webhooks |
| Update Server | 8005 | Distributie van probe- en agent-updates |
| Agent Registry | 8006 | Inschrijving en beheer van agents |
| Warranty Service | 8007 | Tracking van hardwaregarantie |
| CMod Service | 8008 | Configuratiebeheer van netwerkapparaten |
| IPAM Service | 8009 | IP-adresbeheer |

## Implementatieopties

### Docker Compose (Aanbevolen)

De eenvoudigste manier om alle services te implementeren. Geschikt voor kleine tot middelgrote implementaties.

Zie de [Installatiehandleiding](./installation.md) voor stapsgewijze instructies.

### Kubernetes

Voor grootschalige implementaties die hoge beschikbaarheid en horizontale schaalbaarheid vereisen. Helm charts zijn beschikbaar voor elke service.

### Enkele binary

Voor minimale implementaties bundelt een enkele binary alle services. Geschikt voor testen of zeer kleine omgevingen.

## Systeemvereisten

| Vereiste | Minimum | Aanbevolen |
|---|---|---|
| OS | Ubuntu 22.04 / Debian 12 | Ubuntu 24.04 LTS |
| CPU | 2 cores | 4+ cores |
| RAM | 4 GB | 8 GB |
| Schijf | 40 GB | 100 GB SSD |
| Docker | v24.0+ | Laatste stabiele versie |
| Docker Compose | v2.20+ | Laatste stabiele versie |

## Netwerk

| Poort | Protocol | Doel |
|---|---|---|
| 443 | HTTPS | Webdashboard en API (via reverse proxy) |
| 80 | HTTP | Doorverwijzing naar HTTPS |
| 5432 | TCP | PostgreSQL (intern, niet blootgesteld) |
| 6379 | TCP | Redis (intern, niet blootgesteld) |

Alleen poorten 80 en 443 moeten extern worden blootgesteld. Alle interne servicepoorten zijn alleen toegankelijk binnen het Docker-netwerk.

## Gegevensopslag

| Gegevens | Opslag | Back-up |
|---|---|---|
| PostgreSQL-database | Docker volume | Dagelijks pg_dump |
| Configuratiebestanden | Bind mount | Bestandsback-up |
| Geupload bestanden | Docker volume | Bestandsback-up |
| Logboeken | Docker volume | Logrotatie |
| TLS-certificaten | Bind mount | Beveiligde back-up |

## Beveiliging

Self-hosted implementaties bevatten alle beveiligingsfuncties:

- TLS-versleuteling voor alle externe communicatie
- JWT-gebaseerde authenticatie
- Rolgebaseerde toegangscontrole
- Auditlogboek
- Steel Shield-integriteitsverificatie (zie [Steel Shield](./steel-shield.md))

## Veelgestelde vragen

**V: Kan ik self-hosted draaien zonder Docker?**
A: Docker Compose is de aanbevolen en ondersteunde implementatiemethode. Services rechtstreeks op de host draaien is mogelijk maar wordt niet officieel ondersteund.

**V: Hoe maken probes verbinding met een self-hosted server?**
A: Configureer probes om naar de URL van uw server te verwijzen in plaats van het standaard Cloudflare Tunnel-eindpunt. Werk de `server_url` in de probeconfiguratie bij.

**V: Is er een webdashboard inbegrepen?**
A: Ja. De API Gateway bedient het webdashboard op de root-URL. Ga erheen via uw geconfigureerde domein (bijv. `https://netrecon.uwbedrijf.com`).

**V: Kan ik dit in een air-gapped omgeving draaien?**
A: Ja. Download de Docker-images vooraf en breng ze over naar uw air-gapped server. Licentievalidatie kan worden geconfigureerd voor offlinemodus.

Voor aanvullende hulp kunt u contact opnemen met [support@netreconapp.com](mailto:support@netreconapp.com).
