---
sidebar_position: 1
title: Itse isannoinnin yleiskatsaus
description: Suorita NetRecon-alusta omalla infrastruktuurillasi
---

# Itse isannointi

NetRecon voidaan isannoida kokonaan omalla infrastruktuurillasi, mikka antaa sinulle tayden hallinnan tiedoistasi, tietoturvasta ja kayttoonotosta.

## Miksi itse isannoida?

| Hyoty | Kuvaus |
|---|---|
| **Tietosuvereniteetti** | Kaikki skannaustulokset, konfiguraatiot ja lokit pysyvat omilla palvelimillasi |
| **Vaatimustenmukaisuus** | Taytta saantelyvaatimukset, jotka edellyttavat paikallista tietojen sailyttysta |
| **Verkon eristys** | Suorita eristetyissa ymparistoissa ilman Internet-riippuvuutta |
| **Mukautettu integraatio** | Suora tietokantayhteys mukautettua raportointia ja integraatiota varten |
| **Kustannushallinta** | Ei mittarikohtaista lisensointia palvelininfrastruktuurille |

## Arkkitehtuuri

Itse isannoity NetRecon-kayttoonotto koostuu useista mikropalveluista, jotka toimivat Docker-konteissa:

```
+---------------------------------------------------------+
|                    Docker Host                          |
|                                                         |
|  +--------------+  +--------------+  +--------------+  |
|  | API Gateway  |  | Vault Server |  |  License     |  |
|  |   :8000      |  |   :8001      |  |  Server :8002|  |
|  +--------------+  +--------------+  +--------------+  |
|                                                         |
|  +--------------+  +--------------+  +--------------+  |
|  | Email        |  | Notification |  |  Update      |  |
|  | Service :8003|  | Service :8004|  |  Server :8005|  |
|  +--------------+  +--------------+  +--------------+  |
|                                                         |
|  +--------------+  +--------------+  +--------------+  |
|  | Agent        |  | Warranty     |  |  CMod        |  |
|  | Registry:8006|  | Service :8007|  |  Service:8008|  |
|  +--------------+  +--------------+  +--------------+  |
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

## Palvelukatsaus

| Palvelu | Portti | Tarkoitus |
|---|---|---|
| API Gateway | 8000 | Keskitetty API-reititys, todennus |
| Vault Server | 8001 | Salaisuuksien hallinta, tunnisteiden sailytys |
| License Server | 8002 | Lisenssien validointi ja hallinta |
| Email Service | 8003 | Sahkopostilmoitukset ja halytykset |
| Notification Service | 8004 | Push-ilmoitukset, webhookit |
| Update Server | 8005 | Mittarien ja agenttien paivitysten jakelu |
| Agent Registry | 8006 | Agenttien rekisterointi ja hallinta |
| Warranty Service | 8007 | Laitteistotakuun seuranta |
| CMod Service | 8008 | Verkkolaitteiden konfiguraationhallinta |
| IPAM Service | 8009 | IP-osoitteiden hallinta |

## Kayttoonottovaihtoehdot

### Docker Compose (suositeltu)

Yksinkertaisin tapa ottaa kaikki palvelut kayttoon. Sopii pieniin ja keskikokoisiin kayttoonottoihin.

Katso [Asennusopas](./installation.md) vaiheittaiset ohjeet.

### Kubernetes

Suuriin kayttoonottoihin, jotka vaativat korkeaa saatavuutta ja horisontaalista skaalausta. Helm-kaaviot ovat saatavilla jokaiselle palvelulle.

### Yksittainen binaaritiedosto

Minimaalisia kayttoonottoja varten yksittainen binaaritiedosto sisaltaa kaikki palvelut. Sopii testaukseen tai hyvin pieniin ymparistoihin.

## Jarjestelmavaatimukset

| Vaatimus | Vahimmais | Suositeltu |
|---|---|---|
| Kayttojarjestelma | Ubuntu 22.04 / Debian 12 | Ubuntu 24.04 LTS |
| CPU | 2 ydinta | 4+ ydinta |
| RAM | 4 GB | 8 GB |
| Levy | 40 GB | 100 GB SSD |
| Docker | v24.0+ | Viimeisin vakaa |
| Docker Compose | v2.20+ | Viimeisin vakaa |

## Verkkoyhteydet

| Portti | Protokolla | Tarkoitus |
|---|---|---|
| 443 | HTTPS | Verkkohallintapaneeli ja API (kaanteisen valityspalvelimen kautta) |
| 80 | HTTP | Uudelleenohjaus HTTPS:aan |
| 5432 | TCP | PostgreSQL (sisainen, ei nakyissa) |
| 6379 | TCP | Redis (sisainen, ei nakyissa) |

Vain portit 80 ja 443 taytyy avata ulkoisesti. Kaikki sisaiset palveluportit ovat kaytettavissa vain Docker-verkon sisalla.

## Tietojen sailytys

| Tieto | Sailytys | Varmuuskopio |
|---|---|---|
| PostgreSQL-tietokanta | Docker-volume | pg_dump paivittain |
| Konfiguraatiotiedostot | Bind mount | Tiedostojen varmuuskopio |
| Ladatut tiedostot | Docker-volume | Tiedostojen varmuuskopio |
| Lokit | Docker-volume | Lokien kierto |
| TLS-varmenteet | Bind mount | Turvallinen varmuuskopio |

## Tietoturva

Itse isannoidyt kayttoonotot sisaltavat kaikki tietoturvaominaisuudet:

- TLS-salaus kaikelle ulkoiselle viestinnalle
- JWT-pohjainen todennus
- Roolipohjainen paasyhallinta
- Auditointilokit
- Steel Shield -eheyden varmennus (katso [Steel Shield](./steel-shield.md))

## UKK

**K: Voinko suorittaa itse isannoinnin ilman Dockeria?**
V: Docker Compose on suositeltu ja tuettu kayttoonottomenetelma. Palveluiden suorittaminen suoraan isantakoneella on mahdollista, mutta sita ei virallisesti tueta.

**K: Miten mittarit yhdistyvat itse isannoituun palvelimeen?**
V: Maarita mittarit osoittamaan palvelimesi URL-osoitteeseen oletusarvoisen Cloudflare Tunnel -paatepisteen sijaan. Paivita `server_url` mittarin konfiguraatiossa.

**K: Sisaltyko verkkohallintapaneeli?**
V: Kylla. API Gateway tarjoaa verkkohallintapaneelin juuriosoitteessa. Kaytta sita maaritetyn verkkotunnuksen kautta (esim. `https://netrecon.yrityksesi.com`).

**K: Voinko suorittaa taman eristetyssa ymparistossa?**
V: Kylla. Lataa Docker-levykuvat ennakkoon ja siirra ne eristetylle palvelimelle. Lisenssien validointi voidaan maaritella offline-tilaan.

Lisaavun saamiseksi ota yhteytta osoitteeseen [support@netreconapp.com](mailto:support@netreconapp.com).
