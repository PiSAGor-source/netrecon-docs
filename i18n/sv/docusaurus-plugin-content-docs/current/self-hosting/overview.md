---
sidebar_position: 1
title: Översikt egen hosting
description: Kör NetRecon-plattformen på din egen infrastruktur
---

# Egen hosting

NetRecon kan köras helt på din egen infrastruktur, vilket ger dig fullständig kontroll över din data, säkerhet och distribution.

## Varför egen hosting?

| Fördel | Beskrivning |
|---|---|
| **Datasuveränitet** | Alla skanningsresultat, konfigurationer och loggar förblir på dina servrar |
| **Regelefterlevnad** | Uppfyll regulatoriska krav som kräver lokal datalagring |
| **Nätverksisolering** | Kör i isolerade miljöer utan internetberoende |
| **Anpassad integration** | Direkt databasåtkomst för anpassad rapportering och integration |
| **Kostnadskontroll** | Ingen per-prob-licensiering för serverinfrastrukturen |

## Arkitektur

En egen hostingdistribution av NetRecon består av flera mikrotjänster som körs i Docker-containrar:

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

## Tjänsteöversikt

| Tjänst | Port | Syfte |
|---|---|---|
| API Gateway | 8000 | Central API-routing, autentisering |
| Vault Server | 8001 | Hemlighetshantering, lagring av autentiseringsuppgifter |
| License Server | 8002 | Licensvalidering och -hantering |
| Email Service | 8003 | E-postnotifikationer och varningar |
| Notification Service | 8004 | Push-notifikationer, webhooks |
| Update Server | 8005 | Distribution av prob- och agentuppdateringar |
| Agent Registry | 8006 | Agentregistrering och -hantering |
| Warranty Service | 8007 | Spårning av hårdvarugaranti |
| CMod Service | 8008 | Konfigurationshantering av nätverksenheter |
| IPAM Service | 8009 | IP-adresshantering |

## Distributionsalternativ

### Docker Compose (rekommenderat)

Det enklaste sättet att distribuera alla tjänster. Lämpligt för små till medelstora distributioner.

Se [Installationsguide](./installation.md) för steg-för-steg-instruktioner.

### Kubernetes

För storskaliga distributioner som kräver hög tillgänglighet och horisontell skalning. Helm-charts finns tillgängliga för varje tjänst.

### Enskild binär

För minimala distributioner paketerar en enskild binär alla tjänster. Lämpligt för testning eller mycket små miljöer.

## Systemkrav

| Krav | Minimum | Rekommenderat |
|---|---|---|
| OS | Ubuntu 22.04 / Debian 12 | Ubuntu 24.04 LTS |
| CPU | 2 kärnor | 4+ kärnor |
| RAM | 4 GB | 8 GB |
| Disk | 40 GB | 100 GB SSD |
| Docker | v24.0+ | Senaste stabila |
| Docker Compose | v2.20+ | Senaste stabila |

## Nätverk

| Port | Protokoll | Syfte |
|---|---|---|
| 443 | HTTPS | Webbinstrumentpanel och API (via reverse proxy) |
| 80 | HTTP | Omdirigering till HTTPS |
| 5432 | TCP | PostgreSQL (intern, ej exponerad) |
| 6379 | TCP | Redis (intern, ej exponerad) |

Bara portarna 80 och 443 behöver exponeras externt. Alla interna tjänsteportar är tillgängliga enbart inom Docker-nätverket.

## Datalagring

| Data | Lagring | Säkerhetskopiering |
|---|---|---|
| PostgreSQL-databas | Docker-volym | pg_dump dagligen |
| Konfigurationsfiler | Bind mount | Filsäkerhetskopiering |
| Uppladdade filer | Docker-volym | Filsäkerhetskopiering |
| Loggar | Docker-volym | Loggrotation |
| TLS-certifikat | Bind mount | Säker säkerhetskopiering |

## Säkerhet

Distributioner med egen hosting inkluderar alla säkerhetsfunktioner:

- TLS-kryptering för all extern kommunikation
- JWT-baserad autentisering
- Rollbaserad åtkomstkontroll
- Granskningsloggning
- Steel Shield integritetverifiering (se [Steel Shield](./steel-shield.md))

## Vanliga frågor

**F: Kan jag köra egen hosting utan Docker?**
S: Docker Compose är den rekommenderade och stödda distributionsmetoden. Att köra tjänster direkt på värden är möjligt men officiellt ostött.

**F: Hur ansluter prober till en egenhostad server?**
S: Konfigurera prober att peka mot din servers URL istället för standardändpunkten för Cloudflare Tunnel. Uppdatera `server_url` i probkonfigurationen.

**F: Ingår en webbinstrumentpanel?**
S: Ja. API Gateway serverar webbinstrumentpanelen på rot-URL:en. Åtkomst sker via din konfigurerade domän (t.ex. `https://netrecon.yourcompany.com`).

**F: Kan jag köra detta i en isolerad miljö?**
S: Ja. Ladda ner Docker-avbildningarna i förväg och överför dem till din isolerade server. Licensvalidering kan konfigureras för offlineläge.

För ytterligare hjälp, kontakta [support@netreconapp.com](mailto:support@netreconapp.com).
