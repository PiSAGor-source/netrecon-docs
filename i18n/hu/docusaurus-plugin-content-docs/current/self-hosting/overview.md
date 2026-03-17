---
sidebar_position: 1
title: Sajat szerveres uzemeltetes attekintese
description: A NetRecon platform futtatas sajat infrastrukturan
---

# Sajat szerveres uzemeltetes

A NetRecon teljesen sajat szerveren uzemeltetheto, teljes kontrollt biztositva az adatai, a biztonsag es a telepites felett.

## Miert sajat szerver?

| Elony | Leiras |
|---|---|
| **Adatszuverenitacs** | Minden vizsgalati eredmeny, konfigurcio es naplo a sajat szerverein marad |
| **Megfeleloseg** | Teljesiti a helyi adattarolast eloiro szabalyozasi kovetelmenyeket |
| **Halozati izolaicio** | Levalasztott kornyezetben, internet-fuggoseg nelkul is mukodik |
| **Egyedi integracio** | Kozvetlen adatbazis-hozzaferes egyedi jelentesekhez es integraciohoz |
| **Koltsegkontroll** | Nincs szonda-alapu licencelesi dij a szerver-infrastrukturara |

## Architektura

A sajat szerveres NetRecon telepites tobb mikroszolgaltatasbol all, amelyek Docker kontenerekben futnak:

```
┌────────────────────────────────────────────────────────┐
│                    Docker gazda                        │
│                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │ API Gateway  │  │ Vault Server │  │  Licenc      ││
│  │   :8000      │  │   :8001      │  │  szerver:8002││
│  └──────────────┘  └──────────────┘  └──────────────┘│
│                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │ E-mail       │  │ Ertesitesi   │  │  Frissitesi  ││
│  │ szolg. :8003 │  │ szolg. :8004 │  │  szerver:8005││
│  └──────────────┘  └──────────────┘  └──────────────┘│
│                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │ Agenst       │  │ Garancia     │  │  CMod        ││
│  │ nyilv. :8006 │  │ szolg. :8007 │  │  szolg.:8008 ││
│  └──────────────┘  └──────────────┘  └──────────────┘│
│                                                        │
│  ┌──────────────┐  ┌──────────────┐                   │
│  │ IPAM         │  │ PostgreSQL   │                   │
│  │ szolg. :8009 │  │   :5432      │                   │
│  └──────────────┘  └──────────────┘                   │
│                                                        │
│  ┌──────────────┐  ┌──────────────┐                   │
│  │ Redis        │  │ Nginx        │                   │
│  │   :6379      │  │ Reverse Proxy│                   │
│  └──────────────┘  └──────────────┘                   │
└────────────────────────────────────────────────────────┘
```

## Szolgaltatasok attekintese

| Szolgaltatas | Port | Cel |
|---|---|---|
| API Gateway | 8000 | Kozponti API utvonalvalasztas, hitelesites |
| Vault Server | 8001 | Titkok kezelese, hitelesito adatok tarolasa |
| Licencszerver | 8002 | Licenc ellenorzes es kezeles |
| E-mail szolgaltatas | 8003 | E-mail ertesitesek es riasztasok |
| Ertesitesi szolgaltatas | 8004 | Push ertesitesek, webhookok |
| Frissitesi szerver | 8005 | Szonda- es agensfrissitesek terjesztese |
| Agensnyilvantarto | 8006 | Agensek regisztralasa es kezelese |
| Garanciaszolgaltatas | 8007 | Hardver garancia kovetes |
| CMod szolgaltatas | 8008 | Halozati eszkoz konfiguracio kezeles |
| IPAM szolgaltatas | 8009 | IP-cim kezeles |

## Telepitesi lehetosegek

### Docker Compose (Ajanlott)

A legegyszerubb modja az osszes szolgaltatas telepitesenek. Kicsi es kozepes meretu telepitesekhez alkalmas.

A lepesrol lepesre torteno utasitasokert lasd a [Telepitesi utmutatot](./installation.md).

### Kubernetes

Nagylepteku telepitesekhez, amelyek magas rendelkezesre allast es horizontalis skalazast igenyelnek. Helm chartok erhetok el minden szolgaltatashoz.

### Egyetlen binarist

Minimalis telepitesekhez egyetlen binaris tartalmazza az osszes szolgaltatast. Tesztelesre vagy nagyon kis kornyezetekhez alkalmas.

## Rendszerkovetelmeny

| Kovetelmeny | Minimum | Ajanlott |
|---|---|---|
| OS | Ubuntu 22.04 / Debian 12 | Ubuntu 24.04 LTS |
| CPU | 2 mag | 4+ mag |
| RAM | 4 GB | 8 GB |
| Lemez | 40 GB | 100 GB SSD |
| Docker | v24.0+ | Legfrissebb stabil |
| Docker Compose | v2.20+ | Legfrissebb stabil |

## Halozatkezeles

| Port | Protokoll | Cel |
|---|---|---|
| 443 | HTTPS | Webes vezerlopult es API (reverse proxyn keresztul) |
| 80 | HTTP | Atiranitas HTTPS-re |
| 5432 | TCP | PostgreSQL (belso, nem kitett) |
| 6379 | TCP | Redis (belso, nem kitett) |

Csak a 80-as es 443-as portokat kell kulsoleg kitetni. Az osszes belso szolgaltatasi port csak a Docker halozaton belul erheto el.

## Adattarolas

| Adat | Tarolas | Mentees |
|---|---|---|
| PostgreSQL adatbazis | Docker kotet | pg_dump naponta |
| Konfiguracios fajlok | Bind mount | Fajl mentes |
| Feltoltott fajlok | Docker kotet | Fajl mentes |
| Naplok | Docker kotet | Naplo rotacio |
| TLS tanusitvanyok | Bind mount | Biztonsagos mentes |

## Biztonsag

A sajat szerveres telepitesek tartalmazzak az osszes biztonsagi funkciota:

- TLS titkositas minden kulso kommunikaciohoz
- JWT-alapu hitelesites
- Szerepalapulapu hozzaferesi felugylelet
- Audit naplozas
- Steel Shield integritasellenorzes (lasd [Steel Shield](./steel-shield.md))

## GYIK

**K: Futtathatom sajat szerveren Docker nelkul?**
V: A Docker Compose az ajanlott es tamogatott telepitesi modszer. A szolgaltatasok kozvetlen futtatasa a gazdarendszeren lehetseges, de hivatalosan nem tamogatott.

**K: Hogyan csatlakoznak a szondak sajat szerveres telepiteshez?**
V: Allitsa be a szondakat ugy, hogy a szervere URL-jere mutassanak az alapertelmezett Cloudflare Tunnel vegpont helyett. Frissitse a `server_url` erteket a szonda konfiguracioban.

**K: Van webes vezerlopult mellekelve?**
V: Igen. Az API Gateway szolgaltatja a webes vezerlopultot a gyoker URL-en. Erje el a beallitott domeinen keresztul (pl. `https://netrecon.yourcompany.com`).

**K: Futtathatom levalasztott kornyezetben?**
V: Igen. Toltse le elore a Docker kepfajlokat es vigye at a levalasztott szerverre. A licencellenorzes offline modra is konfiguralhato.

Segitsegert forduljon a [support@netreconapp.com](mailto:support@netreconapp.com) cimhez.
