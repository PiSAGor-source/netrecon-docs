---
slug: /
sidebar_position: 1
title: Kezdeti lepesek a NetRecon-nal
description: Halozati intelligencia platform MSP-k es IT csapatok szamara
---

# Kezdeti lepesek a NetRecon-nal

A NetRecon egy halozati intelligencia platform, amelyet MSP-k es IT csapatok szamara fejlesztettek. Automatizalt halozatfelderites, eszkozleltarozas, sebezhetosegi vizsgalat, konfiguraciomenedzsment es valos ideju monitorozas — mindez egy kozponti vezerlopultrol, mobil alkalmazasokbol es REST API-n keresztul erheto el.

## Valassza ki a telepitesi modot

<div className="row" style={{marginTop: '1.5rem'}}>

<div className="col col--6" style={{marginBottom: '1rem'}}>

### Sajat szerverrel

Telepitse a NetRecon-t sajat infrastrukturajara Docker Compose segitsegevel. Teljes kontroll az adatai felett, kulso fuggoseg nelkul.

- [Rendszerkovetelmeny](self-hosting/requirements)
- [Telepitesi utmutato](self-hosting/installation)
- [Konfiguracios referencia](self-hosting/configuration)

**Idealis:** Szigoru adatszuverenitasi kovetelmenyekkel rendelkezo szervezetek, levalasztott halozatok vagy meglevo szerver-infrastruktura eseten.

</div>

<div className="col col--6" style={{marginBottom: '1rem'}}>

### Felho (SaaS)

Azonnal kezdjen hozza a NetRecon Felhoszolgaltatassal. Nincs szukseg szerverre — csak telepitse a szondakat es kezdje meg a vizsgalatot.

- [Gyors kezdesi utmutato](cloud/quickstart)

**Idealis:** Olyan csapatok szamara, akik gyorsan szeretnenek beallitani mindent szerver-infrastruktura kezelese nelkul.

</div>

</div>

## Platform osszetevok

| Osszetevo | Leiras |
|---|---|
| **Vezerlopult** | Webes kezeloi felulet az osszes NetRecon funkciohoz |
| **NetRecon Scanner** | Android alkalmazas halozati vizsgalathoz utkovzben ([Bovebben](scanner/overview)) |
| **Admin Connect** | Android kezeloi alkalmazas tavoli administraciohoz ([Bovebben](admin-connect/overview)) |
| **Agensek** | Konnyu agensek Windows, macOS es Linux vegpontokhoz ([Telepites](agents/overview)) |
| **Szondak** | Hardveres vagy VM-alapu halozati szenzorok folyamatos monitorozashoz |
| **API** | RESTful API automatizalashoz es integracio ([API Referencia](api/overview)) |

## Segitsegre van szuksege?

- Bongesszen a dokumentacioban az oldalsavon keresztul
- Tekintse meg az [API Referenciat](api/overview) az integracios reszletekert
- Kerjen segitseget a [support@netreconapp.com](mailto:support@netreconapp.com) cimen
