---
sidebar_position: 1
title: Self-Hosting-oversigt
description: Kør NetRecon-platformen på din egen infrastruktur
---

# Self-Hosting

NetRecon kan være fuldt self-hosted på din egen infrastruktur, hvilket giver dig fuldstændig kontrol over dine data, sikkerhed og implementering.

## Hvorfor self-hoste?

| Fordel | Beskrivelse |
|---|---|
| **Datasuverænitet** | Alle scanresultater, konfigurationer og logs forbliver på dine servere |
| **Overholdelse** | Opfyld lovkrav der kræver lokal dataopbevaring |
| **Netværksisolation** | Kør i isolerede miljøer uden internetafhængighed |
| **Tilpasset integration** | Direkte databaseadgang til brugerdefineret rapportering og integration |
| **Omkostningskontrol** | Ingen per-probe-licensering for serverinfrastrukturen |

## Arkitektur

En self-hosted NetRecon-implementering består af flere mikrotjenester der kører i Docker-containere:

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

## Tjenesteoversigt

| Tjeneste | Port | Formål |
|---|---|---|
| API Gateway | 8000 | Central API-routing, autentificering |
| Vault Server | 8001 | Hemmeligheder, legitimationsopbevaring |
| License Server | 8002 | Licensvalidering og -administration |
| Email Service | 8003 | E-mailnotifikationer og alarmer |
| Notification Service | 8004 | Push-notifikationer, webhooks |
| Update Server | 8005 | Distribution af probe- og agentopdateringer |
| Agent Registry | 8006 | Agentregistrering og -administration |
| Warranty Service | 8007 | Sporing af hardwaregaranti |
| CMod Service | 8008 | Konfigurationsstyring af netværksenheder |
| IPAM Service | 8009 | IP-adresseadministration |

## Implementeringsmuligheder

### Docker Compose (Anbefalet)

Den enkleste måde at implementere alle tjenester. Egnet til små og mellemstore implementeringer.

Se [Installationsguide](./installation.md) for trin-for-trin-vejledning.

### Kubernetes

Til storskalaimplementeringer der kræver høj tilgængelighed og horisontal skalering. Helm charts er tilgængelige for hver tjeneste.

### Enkelt binær fil

Til minimale implementeringer pakker en enkelt binær fil alle tjenester. Egnet til test eller meget små miljøer.

## Systemkrav

| Krav | Minimum | Anbefalet |
|---|---|---|
| OS | Ubuntu 22.04 / Debian 12 | Ubuntu 24.04 LTS |
| CPU | 2 kerner | 4+ kerner |
| RAM | 4 GB | 8 GB |
| Disk | 40 GB | 100 GB SSD |
| Docker | v24.0+ | Seneste stabile |
| Docker Compose | v2.20+ | Seneste stabile |

## Netværk

| Port | Protokol | Formål |
|---|---|---|
| 443 | HTTPS | Web-dashboard og API (via reverse proxy) |
| 80 | HTTP | Omdirigering til HTTPS |
| 5432 | TCP | PostgreSQL (intern, ikke eksponeret) |
| 6379 | TCP | Redis (intern, ikke eksponeret) |

Kun port 80 og 443 skal eksponeres eksternt. Alle interne tjenesteporte er kun tilgængelige inden for Docker-netværket.

## Datalagring

| Data | Lagring | Sikkerhedskopi |
|---|---|---|
| PostgreSQL-database | Docker-volume | pg_dump dagligt |
| Konfigurationsfiler | Bind mount | Filsikkerhedskopi |
| Uploadede filer | Docker-volume | Filsikkerhedskopi |
| Logs | Docker-volume | Logrotation |
| TLS-certifikater | Bind mount | Sikker sikkerhedskopi |

## Sikkerhed

Self-hosted-implementeringer inkluderer alle sikkerhedsfunktioner:

- TLS-kryptering for al ekstern kommunikation
- JWT-baseret autentificering
- Rollebaseret adgangskontrol
- Revisionslogning
- Steel Shield integritetskontrol (se [Steel Shield](./steel-shield.md))

## FAQ

**Sp: Kan jeg køre self-hosted uden Docker?**
Sv: Docker Compose er den anbefalede og understøttede implementeringsmetode. Det er muligt at køre tjenester direkte på værten, men det er ikke officielt understøttet.

**Sp: Hvordan forbinder prober til en self-hosted server?**
Sv: Konfigurer prober til at pege på din servers URL i stedet for standard Cloudflare Tunnel-endepunktet. Opdater `server_url` i probe-konfigurationen.

**Sp: Er der et web-dashboard inkluderet?**
Sv: Ja. API Gateway'en serverer web-dashboardet på rod-URL'en. Tilgå det via dit konfigurerede domæne (f.eks. `https://netrecon.yourcompany.com`).

**Sp: Kan jeg køre dette i et isoleret miljø?**
Sv: Ja. Download Docker-images på forhånd og overfør dem til din isolerede server. Licensvalidering kan konfigureres til offlinetilstand.

For yderligere hjælp, kontakt [support@netreconapp.com](mailto:support@netreconapp.com).
