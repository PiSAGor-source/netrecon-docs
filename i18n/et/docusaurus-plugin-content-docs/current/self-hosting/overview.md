---
sidebar_position: 1
title: Isehalduse ülevaade
description: Käitage NetReconi platvormi oma infrastruktuuris
---

# Isehaldus

NetReconi saab täielikult ise hallata oma infrastruktuuris, andes teile täieliku kontrolli oma andmete, turvalisuse ja juurutuse üle.

## Miks isehaldus?

| Eelis | Kirjeldus |
|---|---|
| **Andmesuveräänsus** | Kõik skannimistulemused, konfiguratsioonid ja logid jäävad teie serveritesse |
| **Vastavus** | Täitke regulatiivseid nõudeid, mis nõuavad kohapealsete andmete salvestamist |
| **Võrgu isolatsioon** | Käitage eraldatud keskkondades ilma interneti sõltuvuseta |
| **Kohandatud integratsioon** | Otsene andmebaasijuurdepääs kohandatud aruandluseks ja integratsioonideks |
| **Kulukontroll** | Serveriinfrastruktuuri jaoks pole sondi litsentse vaja |

## Arhitektuur

Isehallatav NetReconi juurutus koosneb mitmest mikroteenusest, mis töötavad Docker konteinerites:

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

## Teenuste ülevaade

| Teenus | Port | Otstarve |
|---|---|---|
| API Gateway | 8000 | Keskne API marsruutimine, autentimine |
| Vault Server | 8001 | Saladuste haldamine, mandaatide salvestamine |
| License Server | 8002 | Litsentsi valideerimine ja haldamine |
| Email Service | 8003 | E-posti teavitused ja hoiatused |
| Notification Service | 8004 | Push-teavitused, veebikonksud |
| Update Server | 8005 | Sondide ja agentide uuenduste jagamine |
| Agent Registry | 8006 | Agentide registreerimine ja haldamine |
| Warranty Service | 8007 | Riistvara garantii jälgimine |
| CMod Service | 8008 | Võrguseadmete konfiguratsioonihaldus |
| IPAM Service | 8009 | IP-aadresside haldamine |

## Juurutusvõimalused

### Docker Compose (soovitatav)

Lihtsaim viis kõigi teenuste juurutamiseks. Sobib väikestele ja keskmistele juurutustele.

Samm-sammult juhised leiate [Paigaldusjuhendist](./installation.md).

### Kubernetes

Suuremahulisteks juurutusteks, mis nõuavad kõrget käideldavust ja horisontaalset skaleerimist. Igale teenusele on saadaval Helm chart'id.

### Üksik binaarne

Minimaalsete juurutuste jaoks pakib üksik binaarne kõik teenused kokku. Sobib testimiseks või väga väikestele keskkondadele.

## Süsteeminõuded

| Nõue | Minimaalne | Soovitatav |
|---|---|---|
| OS | Ubuntu 22.04 / Debian 12 | Ubuntu 24.04 LTS |
| CPU | 2 tuuma | 4+ tuuma |
| RAM | 4 GB | 8 GB |
| Ketas | 40 GB | 100 GB SSD |
| Docker | v24.0+ | Viimane stabiilne |
| Docker Compose | v2.20+ | Viimane stabiilne |

## Võrk

| Port | Protokoll | Otstarve |
|---|---|---|
| 443 | HTTPS | Veebijuhtpaneel ja API (pöördproksi kaudu) |
| 80 | HTTP | Ümbersuunamine HTTPS-le |
| 5432 | TCP | PostgreSQL (sisemine, pole avatud) |
| 6379 | TCP | Redis (sisemine, pole avatud) |

Väliselt tuleb avada ainult pordid 80 ja 443. Kõik sisemised teenuspordid on kättesaadavad ainult Docker-võrgu sees.

## Andmete salvestamine

| Andmed | Salvestus | Varundamine |
|---|---|---|
| PostgreSQL andmebaas | Docker-köide | pg_dump igapäevaselt |
| Konfiguratsioonifailid | Bind mount | Failide varundamine |
| Üleslaaditud failid | Docker-köide | Failide varundamine |
| Logid | Docker-köide | Logide rotatsioon |
| TLS-sertifikaadid | Bind mount | Turvaline varundamine |

## Turvalisus

Isehallatavad juurutused sisaldavad kõiki turvafunktsioone:

- TLS krüpteerimine kogu välise suhtluse jaoks
- JWT-põhine autentimine
- Rollipõhine juurdepääsukontroll
- Auditilogi
- Steel Shield terviklikkuse kontroll (vt [Steel Shield](./steel-shield.md))

## KKK

**K: Kas ma saan ise hallata ilma Dockerita?**
V: Docker Compose on soovitatav ja toetatud juurutusviis. Teenuste otse hostis käitamine on võimalik, kuid pole ametlikult toetatud.

**K: Kuidas sondid ühenduvad isehallatava serveriga?**
V: Konfigureerige sondid osutama teie serveri URL-ile vaikimisi Cloudflare Tunneli lõpp-punkti asemel. Uuendage sondi konfiguratsioonis `server_url`.

**K: Kas veebijuhtpaneel on kaasas?**
V: Jah. API Gateway teenindab veebijuhtpaneeli juur-URL-il. Juurdepääs on teie konfigureeritud domeeni kaudu (nt `https://netrecon.yourcompany.com`).

**K: Kas ma saan seda käitada eraldatud keskkonnas?**
V: Jah. Laadige Docker-tõmmised eelnevalt alla ja edastage need oma eraldatud serverisse. Litsentsi valideerimise saab konfigureerida võrguühenduseta režiimis.

Lisaabi saamiseks võtke ühendust [support@netreconapp.com](mailto:support@netreconapp.com).
