---
slug: /
sidebar_position: 1
title: NetReconiga alustamine
description: Võrguluure platvorm MSP-dele ja IT-meeskondadele
---

# NetReconiga alustamine

NetRecon on võrguluure platvorm, mis on loodud MSP-dele ja IT-meeskondadele. See pakub automatiseeritud võrgutuvastust, seadmete inventuuri, haavatavuste skannimist, konfiguratsioonihaldust ja reaalajas jälgimist — kõik kättesaadav tsentraliseeritud juhtpaneeli, mobiilirakenduste ja REST API kaudu.

## Valige oma juurutusviis

<div className="row" style={{marginTop: '1.5rem'}}>

<div className="col col--6" style={{marginBottom: '1rem'}}>

### Isehallatav

Juurutage NetRecon oma infrastruktuuris Docker Compose'i abil. Täielik kontroll oma andmete üle, ilma väliste sõltuvusteta.

- [Süsteeminõuded](self-hosting/requirements)
- [Paigaldusjuhend](self-hosting/installation)
- [Konfiguratsioonijuhend](self-hosting/configuration)

**Sobib kõige paremini:** organisatsioonidele, kellel on ranged andmesuveräänsuse nõuded, eraldatud võrgud või olemasolev serveriinfrastruktuur.

</div>

<div className="col col--6" style={{marginBottom: '1rem'}}>

### Pilv (SaaS)

Alustage kohe NetRecon Cloudiga. Serveri seadistust pole vaja — lihtsalt juurutage sondid ja alustage skannimist.

- [Kiirjuhend](cloud/quickstart)

**Sobib kõige paremini:** meeskondadele, kes soovivad kiiresti alustada ilma serveriinfrastruktuuri haldamiseta.

</div>

</div>

## Platvormi komponendid

| Komponent | Kirjeldus |
|---|---|
| **Juhtpaneel** | Veebipõhine juhtpaneel kõigi NetReconi funktsioonide jaoks |
| **NetRecon Scanner** | Android-rakendus võrgu skannimiseks liikvel olles ([Lisateave](scanner/overview)) |
| **Admin Connect** | Android-haldusrakendus kaughalduseks ([Lisateave](admin-connect/overview)) |
| **Agendid** | Kerged agendid Windows, macOS ja Linux lõppseadmete jaoks ([Paigaldamine](agents/overview)) |
| **Sondid** | Riistvara- või VM-põhised võrgusensorid pidevaks jälgimiseks |
| **API** | RESTful API automatiseerimiseks ja integratsioonideks ([API viide](api/overview)) |

## Vajate abi?

- Sirvige dokumentatsiooni külgriba abil
- Vaadake [API viidet](api/overview) integratsiooni üksikasjade jaoks
- Abi saamiseks võtke ühendust [support@netreconapp.com](mailto:support@netreconapp.com)
