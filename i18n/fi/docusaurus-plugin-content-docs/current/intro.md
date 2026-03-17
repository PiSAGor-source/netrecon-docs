---
slug: /
sidebar_position: 1
title: NetReconin kayttooonotto
description: Verkkotiedustelualusta MSP-palveluntarjoajille ja IT-tiimeille
---

# NetReconin kayttoonotto

NetRecon on verkkotiedustelualusta, joka on suunniteltu MSP-palveluntarjoajille ja IT-tiimeille. Se tarjoaa automatisoidun verkon loytamisen, laiterekisterin, haavoittuvuusskannauksen, konfiguraationhallinnan ja reaaliaikaisen valvonnan -- kaikki saatavilla keskitetyn hallintapaneelin, mobiilisovellusten ja REST API:n kautta.

## Valitse kayttoonottotapa

<div className="row" style={{marginTop: '1.5rem'}}>

<div className="col col--6" style={{marginBottom: '1rem'}}>

### Itse isannoity

Ota NetRecon kayttoon omalla infrastruktuurillasi Docker Composen avulla. Taysi hallinta tiedoistasi, ei ulkoisia riippuvuuksia.

- [Jarjestelmavaatimukset](self-hosting/requirements)
- [Asennusopas](self-hosting/installation)
- [Konfiguraatio-opas](self-hosting/configuration)

**Sopii parhaiten:** Organisaatioille, joilla on tiukat tietosuvereniteetti-vaatimukset, eristetyt verkot tai olemassa oleva palvelininfrastruktuuri.

</div>

<div className="col col--6" style={{marginBottom: '1rem'}}>

### Pilvi (SaaS)

Aloita heti NetRecon Cloudilla. Palvelimen asennus ei ole tarpeen -- ota mittarit kayttoon ja aloita skannaus.

- [Pika-aloitusopas](cloud/quickstart)

**Sopii parhaiten:** Tiimeille, jotka haluavat paasta nopeasti alkuun ilman palvelininfrastruktuurin hallintaa.

</div>

</div>

## Alustan komponentit

| Komponentti | Kuvaus |
|---|---|
| **Hallintapaneeli** | Verkkopohjanen ohjauspaneeli kaikille NetReconin ominaisuuksille |
| **NetRecon Scanner** | Android-sovellus kenttaskannauskayttoon ([Lisatietoja](scanner/overview)) |
| **Admin Connect** | Android-hallintasovellus etahallintaan ([Lisatietoja](admin-connect/overview)) |
| **Agentit** | Kevyet agentit Windows-, macOS- ja Linux-paatelaitteille ([Asennus](agents/overview)) |
| **Mittarit** | Laitteisto- tai VM-pohjaiset verkkoanturit jatkuvaan valvontaan |
| **API** | RESTful API automaatiota ja integraatiota varten ([API-viite](api/overview)) |

## Tarvitsetko apua?

- Selaa dokumentaatiota sivupalkissa
- Tutustu [API-viitteeseen](api/overview) integraatiotietoihin
- Ota yhteytta [support@netreconapp.com](mailto:support@netreconapp.com) avun saamiseksi
