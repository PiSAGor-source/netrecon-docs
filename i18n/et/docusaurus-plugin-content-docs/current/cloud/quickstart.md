---
sidebar_position: 1
title: Kiirjuhend
description: Alustage NetRecon Cloudiga minutitega
---

# Pilve kiirjuhend

NetRecon Cloud on kiireim viis alustamiseks. Pole vaja serverit seadistada ega Dockerit — lihtsalt registreeruge, juurutage sond ja alustage oma võrgu avastamist.

## 1. samm: looge oma konto

1. Minge aadressile [app.netreconapp.com](https://app.netreconapp.com) ja klõpsake **Registreeru**
2. Sisestage oma e-posti aadress, ettevõtte nimi ja parool
3. Kinnitage oma e-posti aadress
4. Logige sisse NetReconi juhtpaneeli

## 2. samm: lisage oma esimene asukoht

1. Navigeerige juhtpaneelil külgribal **Asukohad**
2. Klõpsake **Lisa asukoht**
3. Sisestage asukoha nimi ja aadress (nt "Peakontor — Tallinn")
4. Salvestage asukoht

## 3. samm: juurutage sond

Iga asukoht vajab vähemalt ühte sondi võrgutuvastuseks ja jälgimiseks.

### Valik A: NetRecon OS (soovitatav)

1. Minge **Asukohad → [Teie asukoht] → Sondid → Lisa sond**
2. Valige **NetRecon OS** ja laadige alla oma riistvarale sobiv tõmmis
3. Kirjutage tõmmis SD-kaardile või SSD-le, kasutades [balenaEtcher](https://etcher.balena.io/)
4. Ühendage sond oma võrku Etherneti kaudu
5. Lülitage sisse — sond ühendub automaatselt teie pilvekontoga Cloudflare Tunneli kaudu

### Valik B: Docker olemasoleval serveril

```bash
# Tõmmake ja käivitage sondi konteiner
docker run -d \
  --name netrecon-probe \
  --network host \
  --restart unless-stopped \
  -e ENROLLMENT_TOKEN="your-token-from-dashboard" \
  netrecon/probe:latest
```

Hankige registreerimistõend **Asukohad → [Teie asukoht] → Sondid → Lisa sond → Docker** alt.

### Valik C: Virtuaalmasin

1. Laadige OVA-fail juhtpaneelilt alla
2. Importige VMware'i, Proxmoxi või Hyper-V-sse
3. Seadistage VM **sillavõrguga** (vajalik kiht 2 skannimiseks)
4. Käivitage VM — see ilmub automaatselt teie juhtpaneelile

## 4. samm: alustage skannimist

Kui sond on võrgus:

1. Minge **Asukohad → [Teie asukoht] → Seadmed**
2. Klõpsake **Skanni kohe** või oodake automaatset tuvastust (käivitub iga 15 minuti järel)
3. Avastatud seadmed ilmuvad seadmete inventuuri

## 5. samm: installige mobiilirakendus

Laadige Google Play poest alla **NetRecon Scanner** võrgu skannimiseks liikvel olles:

- Skannige mis tahes võrku, millega teie telefon on ühendatud
- Tulemused sünkroniseeritakse automaatselt teie pilve juhtpaneelile
- Üksikasju vaadake [Skanneri ülevaatest](../scanner/overview)

## Mis edasi?

- **Juurutage agendid** lõppseadmetele sügavama nähtavuse jaoks → [Agendi paigaldamine](../agents/overview)
- **Seadistage hoiatused** uute seadmete, haavatavuste või seisakute jaoks
- **Konfigureerige integratsioonid** oma olemasolevate tööriistadega (LDAP, SIEM, Jira, ServiceNow)
- **Kutsuge oma meeskond** menüü **Seaded → Meeskonna haldamine** kaudu

## Pilv vs isehallatav

| Funktsioon | Pilv | Isehallatav |
|---|---|---|
| Serveri haldamine | Haldab NetRecon | Haldate teie |
| Andmete asukoht | NetRecon Cloud (EL) | Teie infrastruktuur |
| Uuendused | Automaatsed | Käsitsi (docker pull) |
| Cloudflare Tunnel | Kaasas | Konfigureerite ise |
| Hinnastamine | Tellimus | Litsentsivõti |

Vajate hoopis isehaldatavat lahendust? Vaadake [Paigaldusjuhendit](../self-hosting/installation).

Abi saamiseks võtke ühendust [support@netreconapp.com](mailto:support@netreconapp.com).
