---
sidebar_position: 1
title: Oversikt over selvhosting
description: Kjor NetRecon-plattformen pa din egen infrastruktur
---

# Selvhosting

NetRecon kan fullstendig selvhostes pa din egen infrastruktur, noe som gir deg komplett kontroll over data, sikkerhet og distribusjon.

## Hvorfor selvhoste?

| Fordel | Beskrivelse |
|---|---|
| **Datasuverenitet** | Alle skanneresultater, konfigurasjoner og logger forblir pa dine servere |
| **Samsvar** | Oppfyll regulatoriske krav som krever lokal datalagring |
| **Nettverksisolasjon** | Kjor i isolerte miljoer uten internettavhengighet |
| **Tilpasset integrasjon** | Direkte databasetilgang for tilpasset rapportering og integrasjon |
| **Kostnadskontroll** | Ingen per-probe-lisensiering for serverinfrastrukturen |

## Arkitektur

En selvhostet NetRecon-distribusjon bestar av flere mikrotjenester som kjorer i Docker-containere:

```
+---------------------------------------------------------+
|                    Docker-vert                           |
|                                                         |
|  +--------------+  +--------------+  +--------------+   |
|  | API Gateway  |  | Vault Server |  |  License     |   |
|  |   :8000      |  |   :8001      |  |  Server :8002|   |
|  +--------------+  +--------------+  +--------------+   |
|                                                         |
|  +--------------+  +--------------+  +--------------+   |
|  | Email        |  | Notification |  |  Update      |   |
|  | Service :8003|  | Service :8004|  |  Server :8005|   |
|  +--------------+  +--------------+  +--------------+   |
|                                                         |
|  +--------------+  +--------------+  +--------------+   |
|  | Agent        |  | Warranty     |  |  CMod        |   |
|  | Registry:8006|  | Service :8007|  |  Service:8008|   |
|  +--------------+  +--------------+  +--------------+   |
|                                                         |
|  +--------------+  +--------------+                     |
|  | IPAM         |  | PostgreSQL   |                     |
|  | Service :8009|  |   :5432      |                     |
|  +--------------+  +--------------+                     |
|                                                         |
|  +--------------+  +--------------+                     |
|  | Redis        |  | Nginx        |                     |
|  |   :6379      |  | Reverse Proxy|                     |
|  +--------------+  +--------------+                     |
+---------------------------------------------------------+
```

## Tjenesteoversikt

| Tjeneste | Port | Formal |
|---|---|---|
| API Gateway | 8000 | Sentral API-ruting, autentisering |
| Vault Server | 8001 | Hemmelighetsadministrasjon, legitimasjonslagring |
| License Server | 8002 | Lisensvalidering og -administrasjon |
| Email Service | 8003 | E-postvarsler og -alarmer |
| Notification Service | 8004 | Push-varsler, webhooks |
| Update Server | 8005 | Distribusjon av probe- og agentoppdateringer |
| Agent Registry | 8006 | Agentregistrering og -administrasjon |
| Warranty Service | 8007 | Maskinvaregarantisporing |
| CMod Service | 8008 | Konfigurasjonsadministrasjon for nettverksenheter |
| IPAM Service | 8009 | IP-adresseadministrasjon |

## Distribusjonsalternativer

### Docker Compose (anbefalt)

Den enkleste maten a distribuere alle tjenester pa. Egnet for sma til mellomstore distribusjoner.

Se [installasjonsguiden](./installation.md) for trinnvise instruksjoner.

### Kubernetes

For storskala-distribusjoner som krever hoy tilgjengelighet og horisontal skalering. Helm-diagrammer er tilgjengelige for hver tjeneste.

### Enkel binarfil

For minimale distribusjoner pakker en enkel binarfil alle tjenester. Egnet for testing eller veldig sma miljoer.

## Systemkrav

| Krav | Minimum | Anbefalt |
|---|---|---|
| OS | Ubuntu 22.04 / Debian 12 | Ubuntu 24.04 LTS |
| CPU | 2 kjerner | 4+ kjerner |
| RAM | 4 GB | 8 GB |
| Disk | 40 GB | 100 GB SSD |
| Docker | v24.0+ | Nyeste stabile |
| Docker Compose | v2.20+ | Nyeste stabile |

## Nettverk

| Port | Protokoll | Formal |
|---|---|---|
| 443 | HTTPS | Nettbasert dashbord og API (via omvendt proxy) |
| 80 | HTTP | Omdirigering til HTTPS |
| 5432 | TCP | PostgreSQL (intern, ikke eksponert) |
| 6379 | TCP | Redis (intern, ikke eksponert) |

Kun portene 80 og 443 ma eksponeres eksternt. Alle interne tjenesteporter er kun tilgjengelige innenfor Docker-nettverket.

## Datalagring

| Data | Lagring | Sikkerhetskopiering |
|---|---|---|
| PostgreSQL-database | Docker-volum | pg_dump daglig |
| Konfigurasjonsfiler | Bind mount | Filsikkerhetskopiering |
| Opplastede filer | Docker-volum | Filsikkerhetskopiering |
| Logger | Docker-volum | Loggrotasjon |
| TLS-sertifikater | Bind mount | Sikker sikkerhetskopiering |

## Sikkerhet

Selvhostede distribusjoner inkluderer alle sikkerhetsfunksjoner:

- TLS-kryptering for all ekstern kommunikasjon
- JWT-basert autentisering
- Rollebasert tilgangskontroll
- Revisjonslogging
- Steel Shield integritetsverifisering (se [Steel Shield](./steel-shield.md))

## Vanlige sporsmal

**Sp: Kan jeg kjore selvhostet uten Docker?**
Sv: Docker Compose er den anbefalte og stottede distribusjonsmetoden. A kjore tjenester direkte pa verten er mulig, men ikke offisielt stottet.

**Sp: Hvordan kobler prober seg til en selvhostet server?**
Sv: Konfigurer prober til a peke til serverens URL i stedet for standard Cloudflare Tunnel-endepunktet. Oppdater `server_url` i probekonfigurasjonen.

**Sp: Er det inkludert et nettbasert dashbord?**
Sv: Ja. API Gateway serverer det nettbaserte dashbordet pa rot-URL-en. Fa tilgang via det konfigurerte domenet (f.eks. `https://netrecon.yourcompany.com`).

**Sp: Kan jeg kjore dette i et isolert miljo?**
Sv: Ja. Forhands-last ned Docker-bildene og overfr dem til den isolerte serveren. Lisensvalidering kan konfigureres for frakoblet modus.

For ytterligere hjelp, kontakt [support@netreconapp.com](mailto:support@netreconapp.com).
