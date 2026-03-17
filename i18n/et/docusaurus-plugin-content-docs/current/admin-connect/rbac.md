---
sidebar_position: 3
title: Rollipõhine juurdepääsukontroll
description: Konfigureerige kasutajarolle ja õigusi Admin Connectis
---

# Rollipõhine juurdepääsukontroll (RBAC)

NetRecon kasutab rollipõhist juurdepääsukontrolli, et hallata, mida iga kasutaja näeb ja teha saab. Rollid on määratud sondil ja jõustatud nii veebijuhtpaneelil kui Admin Connect rakenduses.

## Eeltingimused

- Administraatori tasemel juurdepääs sondi juhtpaneelile
- Vähemalt üks sond registreeritud Admin Connectis

## Kuidas RBAC töötab

Igale kasutajakontole on määratud roll. Rollid sisaldavad õiguste kogumit, mis kontrollib juurdepääsu funktsioonidele. Kui kasutaja logib sisse Admin Connecti või veebijuhtpaneeli kaudu, kontrollib süsteem enne mis tahes toimingu lubamist tema rolli.

```
Kasutaja → Roll → Õigused → Juurdepääs lubatud / keelatud
```

Õigused jõustatakse nii kasutajaliidese tasandil (mittekättesaadavate funktsioonide peitmine) kui API tasandil (volitamata päringute tagasilükkamine).

## Eelseadistatud rollid

NetRecon sisaldab viit eelseadistatud rolli:

| Roll | Kirjeldus | Tüüpiline kasutaja |
|---|---|---|
| **Peaadministraator** | Täielik juurdepääs kõigile funktsioonidele ja seadetele | Platvormi omanik |
| **Administraator** | Täielik juurdepääs v.a rollide haldamine ja süsteemiseaded | IT-juht |
| **Analüütik** | Vaata skannimistulemusi, hoiatusi, aruandeid; ei saa muuta seadeid | Turvaanalüütik |
| **Operaator** | Käivita/peata skannimisi ja teenuseid; vaata tulemusi | NOC-tehnik |
| **Vaatleja** | Ainult lugemise juurdepääs juhtpaneelidele ja aruannetele | Juht, audiitor |

## Õiguste maatriks

| Õigus | Peaadmin | Admin | Analüütik | Operaator | Vaatleja |
|---|---|---|---|---|---|
| Vaata juhtpaneeli | Jah | Jah | Jah | Jah | Jah |
| Vaata skannimistulemusi | Jah | Jah | Jah | Jah | Jah |
| Käivita/peata skannimisi | Jah | Jah | Ei | Jah | Ei |
| Vaata IDS hoiatusi | Jah | Jah | Jah | Jah | Jah |
| Halda IDS reegleid | Jah | Jah | Ei | Ei | Ei |
| Käivita/peata PCAP | Jah | Jah | Ei | Jah | Ei |
| Laadi alla PCAP faile | Jah | Jah | Jah | Ei | Ei |
| Käivita haavatavuse skannimisi | Jah | Jah | Ei | Jah | Ei |
| Vaata haavatavuse tulemusi | Jah | Jah | Jah | Jah | Jah |
| Halda meepotti | Jah | Jah | Ei | Ei | Ei |
| Halda VPN-i | Jah | Jah | Ei | Ei | Ei |
| Konfigureeri DNS sinkhole | Jah | Jah | Ei | Ei | Ei |
| Genereeri aruandeid | Jah | Jah | Jah | Jah | Ei |
| Halda kasutajaid | Jah | Jah | Ei | Ei | Ei |
| Halda rolle | Jah | Ei | Ei | Ei | Ei |
| Süsteemiseaded | Jah | Ei | Ei | Ei | Ei |
| Varundamine/taastamine | Jah | Jah | Ei | Ei | Ei |
| Vaata auditilogit | Jah | Jah | Jah | Ei | Ei |
| Piletisüsteem | Jah | Jah | Jah | Jah | Ei |
| Pargi haldamine | Jah | Jah | Ei | Ei | Ei |

## Kasutajate haldamine

### Kasutaja loomine

1. Logige sondi juhtpaneelile sisse peaadministraatori või administraatorina
2. Navigeerige **Seaded > Kasutajad**
3. Klõpsake **Lisa kasutaja**
4. Täitke kasutaja üksikasjad:
   - Kasutajanimi
   - E-posti aadress
   - Parool (või saatke kutselink)
   - Roll (valige eelseadistatud rollidest)
5. Klõpsake **Loo**

### Kasutaja rolli muutmine

1. Navigeerige **Seaded > Kasutajad**
2. Klõpsake kasutajal, keda soovite muuta
3. Muutke **Rolli** ripploend
4. Klõpsake **Salvesta**

### Kasutaja deaktiveerimine

1. Navigeerige **Seaded > Kasutajad**
2. Klõpsake kasutajal
3. Lülitage **Aktiivne** välja
4. Klõpsake **Salvesta**

Deaktiveeritud kasutajad ei saa sisse logida, kuid nende auditiajalugu säilib.

## Kohandatud rollid

Peaadministraatorid saavad luua kohandatud rolle detailsete õigustega:

1. Navigeerige **Seaded > Rollid**
2. Klõpsake **Loo roll**
3. Sisestage rolli nimi ja kirjeldus
4. Lülitage üksikuid õigusi sisse/välja
5. Klõpsake **Salvesta**

Kohandatud rollid kuvatakse eelseadistatud rollide kõrval kasutajatele määramisel.

## Kaheastmeline autentimine

2FA saab jõustada rolli kohta:

1. Navigeerige **Seaded > Rollid**
2. Valige roll
3. Lubage **Nõua 2FA**
4. Klõpsake **Salvesta**

Selle rolliga kasutajatelt nõutakse TOTP-põhise 2FA seadistamist järgmisel sisselogimisel.

## Seansihaldus

Konfigureerige seansipoliitikad rolli kohta:

| Seade | Kirjeldus | Vaikeväärtus |
|---|---|---|
| Seansi ajalõpp | Automaatne väljalogimine mitteaktiivsuse tõttu | 30 minutit |
| Maks samaaegseid seansse | Maksimaalne samaaegne sisselogimine | 3 |
| IP piirang | Piira sisselogimine kindlate IP vahemikeni | Keelatud |

Konfigureerige need menüüs **Seaded > Rollid > [Rolli nimi] > Seansipoliitika**.

## Auditilog

Kõik õigustega seotud toimingud logitakse:

- Kasutaja sisselogimise/väljalogimise sündmused
- Rollimuudatused
- Õiguste muudatused
- Ebaõnnestunud juurdepääsukatsed
- Konfiguratsioonimuudatused

Vaadake auditilogit menüüs **Seaded > Auditilog**. Logisid säilitatakse vaikimisi 90 päeva.

## KKK

**K: Kas ma saan muuta eelseadistatud rolle?**
V: Ei. Eelseadistatud rollid on ainult lugemiseks, et tagada ühtlane alustase. Looge kohandatud roll, kui vajate erinevaid õigusi.

**K: Mis juhtub, kui kustutan rolli, millele on kasutajad määratud?**
V: Enne kohandatud rolli kustutamist peate kõik kasutajad ümber määrama teisele rollile. Süsteem takistab kustutamist, kui kasutajad on endiselt määratud.

**K: Kas rollid sünkronitakse mitme sondi vahel?**
V: Rollid on määratud sondi kohta. Kui haldate mitut sondi, peate rolle igal sondil konfigureerima. Tulevane uuendus toetab tsentraliseeritud rollide haldamist.

**K: Kas ma saan piirata kasutaja juurdepääsu konkreetsetele alamvõrkudele või seadmetele?**
V: Hetkel kontrollivad rollid funktsioonidele juurdepääsu, mitte andmete tasemel juurdepääsu. Alamvõrgu tasemel piirangud on tegevuskavas.

Lisaabi saamiseks võtke ühendust [support@netreconapp.com](mailto:support@netreconapp.com).
