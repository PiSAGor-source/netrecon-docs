---
sidebar_position: 3
title: Võrgurežiimid
description: Üksiku liidese, kahekordse skannimise, silla ja TAP võrgurežiimide mõistmine
---

# Võrgurežiimid

NetRecon toetab nelja võrgurežiimi, mis määravad, kuidas sond teie võrguga ühendub ja seda jälgib. Õige režiimi valimine sõltub teie riistvarast, võrgu topoloogiast ja jälgimise eesmärkidest.

## Eeltingimused

- Vähemalt üks Etherneti liides tuvastatud ja rollile määratud
- Teie võrgu topoloogia mõistmine (kommutaatori konfiguratsioon, VLAN-id jne)

## Režiimide võrdlus

| Omadus | Üksik | Kahekordne skannimine | Sild | TAP |
|---|---|---|---|---|
| Minimaalsed NIC-id | 1 | 2 | 2 | 2 |
| Aktiivne skannimine | Jah | Jah | Jah | Ei |
| Passiivne jälgimine | Piiratud | Piiratud | Jah | Jah |
| Võrgu häired | Puuduvad | Puuduvad | Minimaalsed | Puuduvad |
| Sisseehitatud paigaldus | Ei | Ei | Jah | Ei |
| Parim kasutus | Väikesed võrgud | Segmenteeritud võrgud | Täielik nähtavus | Tootmisvõrgud |

## Üksiku liidese režiim

Lihtsaim konfiguratsioon. Üks Etherneti port haldab kõike: skannimist, haldust ja internetiühendust.

```
┌─────────────────────────────────────────┐
│              Network Switch             │
│                                         │
│  Port 1    Port 2    Port 3    Port 4   │
│    │         │         │         │      │
│    │         │         │         │      │
└────┼─────────┼─────────┼─────────┼──────┘
     │         │         │         │
   Probe    PC/Server  PC/Server  Router
  (eth0)
```

**Kuidas see töötab:**
- Sond ühendub tavalise kommutaatoripordiga
- ARP avastamine ja portide skannimine läbivad sama liidest
- Halduse armatuurlaud ja kaugpöördus kasutavad samuti seda liidest

**Millal kasutada:**
- Teil on ühe NIC-ga seade (nt Raspberry Pi ilma USB-adapterita)
- Väikesed võrgud (< 50 seadet)
- Kiire paigaldus, kus eelistatakse lihtsust

**Piirangud:**
- Skannimisliiklus jagab ribalaiust haldusliiklusega
- Ei suuda näha liiklust teiste seadmete vahel (ainult liiklus sondist/sondile)

## Kahekordse skannimise režiim

Kaks eraldi liidest: üks on pühendatud skannimisele ja teine haldusele/üleslingile.

```
┌─────────────────────────────────────────┐
│            Target Network Switch        │
│  Port 1    Port 2    Port 3    Port 4   │
│    │         │         │         │      │
└────┼─────────┼─────────┼─────────┼──────┘
     │         │         │         │
   Probe    PC/Server  PC/Server  │
  (eth0)                          │
                                  │
┌──────────────────────────────────┼──────┐
│         Management Switch        │      │
│  Port 1         Port 2         Port 3   │
│    │               │             │      │
└────┼───────────────┼─────────────┼──────┘
     │               │             │
   Probe          Admin PC       Router
  (eth1)
```

**Kuidas see töötab:**
- `eth0` (Skannimine) ühendub sihtvõrguga avastamiseks ja skannimiseks
- `eth1` (Haldus) ühendub teie admin-võrguga armatuurlaua juurdepääsuks

**Millal kasutada:**
- Soovite isoleerida skannimisliikluse haldusliiklusest
- Sihtvõrk ja haldusvõrk on erinevates alamvõrkudes/VLAN-ides
- Orange Pi R2S või mis tahes kahe NIC-ga seade

**Eelised:**
- Puhas skannimise ja halduse liikluse eraldamine
- Haldusliides jääb reageerivaks raskete skannimiste ajal
- Saab skannida võrku, millele te ei soovi haldusliiklust

## Sillarežiim

Sond asub kahe võrgusegmendi vahel, edastades liiklust läbipaistvalt, samal ajal uurides kõiki läbivaid pakette.

```
                    ┌──────────┐
                    │  Probe   │
                    │          │
                    │ eth0  eth1│
                    └──┬────┬──┘
                       │    │
          ┌────────────┘    └────────────┐
          │                              │
┌─────────┼──────────┐    ┌─────────────┼─────┐
│   Switch A         │    │       Switch B     │
│   (Upstream)       │    │    (Downstream)    │
│                    │    │                    │
│  Servers / Router  │    │   Workstations     │
└────────────────────┘    └────────────────────┘
```

**Kuidas see töötab:**
- Sond sillastab `eth0` ja `eth1` Layer 2 tasemel
- Kogu liiklus kahe segmendi vahel läbib sondi
- Sond uurib iga paketti ilma marsruutimise sõlmeks olemata
- Aktiivset skannimist saab teostada ka sillaliideste kaudu

**Millal kasutada:**
- Vajate täielikku liikluse nähtavust (IDS, PCAP hõive)
- Soovite jälgida liiklust võrgusegmentide vahel
- Paigaldate tuumkommutaatori ja juurdepääsukommutaatori vahele

**Kaalutlused:**
- Sond muutub sillastatud tee üheks tõrkepunktiks
- NetRecon sisaldab tõrkeava võimekust: kui sond kaotab toite, jätkub liikluse vool riistvara ümberjuhtimise kaudu (toetatud seadmetel)
- Lisab minimaalse latentsuse (< 1 ms tüüpilisel riistvaral)

## TAP-režiim

Sond saab koopia võrguliiklusest TAP-seadmelt või kommutaatori SPAN/peegelpordilt. See töötab täielikult passiivses režiimis.

```
┌─────────────────────────────────────────┐
│              Network Switch             │
│                                         │
│  Port 1    Port 2    SPAN Port          │
│    │         │         │                │
└────┼─────────┼─────────┼────────────────┘
     │         │         │
   Server    Server    Probe
                      (eth0 — monitor)

                      (eth1 — management,
                       connected to admin network)
```

**Kuidas see töötab:**
- Kommutaator saadab liikluse koopia oma SPAN/peegelpordile
- Sondi skannimisliides võtab selle peegeldatud liikluse vastu promiscuous-režiimis
- Skannimisliidesest ei süstita pakette tagasi võrku
- Eraldi haldusliides tagab armatuurlaua juurdepääsu

**Millal kasutada:**
- Tootmisvõrgud, kus skannimisliikluse süstimine pole vastuvõetav
- Vastavuskeskkonnad, mis nõuavad ainult passiivset jälgimist
- Kui soovite IDS-i ja liiklusanalüüsi ilma aktiivse skannimiseta

**Kommutaatori konfigureerimine:**
- Ciscol: `monitor session 1 source vlan 10` / `monitor session 1 destination interface Gi0/24`
- HP/Arubal: `mirror-port <port>`
- Juniperil: `set forwarding-options port-mirroring input ingress interface <source>`

**Piirangud:**
- TAP-liidesest ei saa teostada aktiivset skannimist (ARP avastamine, portide skannimine)
- Seadmete avastamine tugineb täielikult vaadeldud liiklusele
- Võite jääda ilma seadmetest, mis on jõudeolekus ega genereeri vaatluse ajal liiklust

## Režiimi muutmine pärast seadistamist

Võrgurežiimi saab igal ajal muuta sondi armatuurlaualt:

1. Navigeerige **Seaded > Võrk**
2. Valige uus režiim
3. Vajadusel määrake liidese rollid ümber
4. Klõpsake **Rakenda**

:::warning
Võrgurežiimide vahetamine katkestab lühiajaliselt sondi teenuseid. Planeerige režiimi muudatused hoolduse ajal.
:::

## KKK

**K: Millist režiimi soovitate esmakordseks seadistamiseks?**
V: Alustage **Üksiku liidese** režiimiga lihtsuse huvides. Saate hiljem üle minna kahekordse skannimise või sillarežiimile, kui teie vajadused arenevad.

**K: Kas ma saan TAP-režiimi kombineerida aktiivse skannimisega?**
V: Jah, kui teil on kolm või enam liidest. Määrake üks TAP-ile (passiivne), üks aktiivsele skannimisele ja üks haldusele.

**K: Kas sillarežiim mõjutab võrgu jõudlust?**
V: Sond lisab sillarežiimis vähem kui 1 ms latentsust. Orange Pi R2S-il 2.5G portidega jääb läbilaskevõime reaalkiirusele tüüpiliste ettevõtte liikluskoormuste puhul.

Täiendava abi saamiseks võtke ühendust [support@netreconapp.com](mailto:support@netreconapp.com).
