---
sidebar_position: 2
title: Skannimisest importimine
description: Avastatud IP-de automaatne importimine skannimistulemustest IPAM-i
---

# Skannimisest importimine

IPAM suudab automaatselt importida avastatud seadmeid skannimistulemustest, kõrvaldades käsitsi andmesisestuse ja tagades, et teie IP-register püsib ajakohane.

## Eeltingimused

- Vähemalt üks lõpetatud võrguskannimine tulemustega
- Siht-alamvõrk on IPAM-is määratletud (või valmisolek selle loomiseks importimise ajal)
- Analüütiku, Operaatori, Administraatori või Superadministraatori roll

## Kuidas importimine töötab

Kui impordite skannimistulemused IPAM-i:

1. Iga avastatud IP-aadressi kontrollitakse olemasolevate IPAM-i kirjete vastu
2. Uued IP-d luuakse olekuga "Määratud"
3. Olemasolevad IP-d uuendatakse viimase MAC-aadressi, hostinime ja "Viimati nähtud" ajatempliga
4. Konfliktid (nt MAC-aadress muutunud IP jaoks) märgitakse ülevaatamiseks
5. Kokkuvõtte raport näitab, mis imporditi ja mis vajab tähelepanu

## Samm-sammult importimine

### 1. samm: avage impordidialoog

**IPAM-ist:**
1. Navigeerige **IPAM > Alamvõrgud**
2. Valige siht-alamvõrk
3. Klõpsake **Impordi skannimisest**

**Skannimistulemustest:**
1. Navigeerige **Skannimine > Tulemused**
2. Valige lõpetatud skannimine
3. Klõpsake **Ekspordi IPAM-i**

### 2. samm: valige skannimine

Valige, millistest skannimistulemustest importida:

| Valik | Kirjeldus |
|---|---|
| Viimane skannimine | Impordi viimasest skannimisest |
| Konkreetne skannimine | Valige skannimine kuupäeva/kellaaja järgi |
| Kõik skannimised (ühendamine) | Kombineeri mitme skannimise tulemused |

### 3. samm: vaadake üle impordi eelvaade

Enne importimist vaadake üle eelvaate tabel:

| Veerg | Kirjeldus |
|---|---|
| IP-aadress | Avastatud IP |
| MAC-aadress | Seotud MAC |
| Hostinimi | Avastatud hostinimi |
| Toiming | Uus / Uuendus / Konflikt |
| Üksikasjad | Mis muutub |

- **Uus** — see IP ei eksisteeri IPAM-is ja luuakse
- **Uuendus** — see IP eksisteerib ja uuendatakse uute andmetega
- **Konflikt** — sellel IP-l on vastuolulised andmed (vt Konflikti lahendamine allpool)

### 4. samm: lahendage konfliktid

Konfliktid tekivad, kui:

- **MAC-aadressi mittevastavus** — IP eksisteerib IPAM-is erineva MAC-aadressiga kui skannimine leidis
- **Duplikaat-MAC** — sama MAC-aadress esineb mitmel IP-l
- **Oleku konflikt** — IP on IPAM-is märgitud "Reserveeritud", kuid skannimine leidis selle aktiivsena

Iga konflikti jaoks valige lahendus:

| Lahendus | Toiming |
|---|---|
| **Säilita IPAM** | Ignoreeri skannimisandmeid, säilita olemasolev IPAM-i kirje |
| **Kasuta skannimist** | Kirjuta IPAM-i andmed üle skannimistulemustega |
| **Märgi ülevaatamiseks** | Impordi andmed, kuid märgi olekusse "Vajab ülevaatamist" |

### 5. samm: importimine

1. Pärast kõigi konfliktide lahendamist klõpsake **Impordi**
2. Edenemisriba näitab impordi olekut
3. Lõpetamisel kuvatakse kokkuvõte:
   - Loodud IP-d
   - Uuendatud IP-d
   - Lahendatud konfliktid
   - Vead (kui neid on)

## Automaatne importimine

Konfigureerige automaatne importimine pärast iga skannimist:

1. Navigeerige **IPAM > Seaded > Automaatne importimine**
2. Lubage **Skannimistulemuste automaatne importimine**
3. Konfigureerige valikud:

| Valik | Vaikeväärtus | Kirjeldus |
|---|---|---|
| Loo uued IP-d | Jah | Uute IP-kirjete automaatne loomine |
| Uuenda olemasolevaid | Jah | Olemasolevate kirjete uuendamine värskete andmetega |
| Konflikti käsitlus | Märgi ülevaatamiseks | Mida teha konfliktidega |
| Alamvõrgu automaatne loomine | Ei | Loo alamvõrk IPAM-is, kui seda pole olemas |

4. Klõpsake **Salvesta**

Automaatse importimise lubamisel püsib IPAM sünkroonitud teie skannimisandmetega ilma käsitsi sekkumiseta.

## CSV-st importimine

Saate importida IP-andmeid ka välistest allikatest:

1. Navigeerige **IPAM > Import > CSV**
2. Laadige alla CSV-mall
3. Täitke oma andmed vastavalt malli vormingule:

```csv
ip_address,mac_address,hostname,status,owner,notes
192.168.1.10,AA:BB:CC:DD:EE:01,fileserver,Assigned,IT Dept,Primary NAS
192.168.1.11,AA:BB:CC:DD:EE:02,printer-01,Assigned,Office,2nd floor
192.168.1.20,,reserved-ip,Reserved,IT Dept,Future use
```

4. Laadige CSV üles ja vaadake üle eelvaade
5. Lahendage võimalikud konfliktid
6. Klõpsake **Impordi**

## Andmete rikastamine

Importimise ajal rikastab IPAM automaatselt andmeid:

| Väli | Allikas |
|---|---|
| Tootja | OUI andmebaasi otsing MAC-aadressist |
| Seadme tüüp | Skannimismootori profileerimisandmed |
| Avatud pordid | Portide skannimise tulemused |
| Teenused | Teenuste tuvastamise tulemused |
| Viimati nähtud | Skannimise ajatempel |

## KKK

**K: Kas importimine kirjutab mu käsitsi märkmed ja omaniku määrangud üle?**
V: Ei. Import uuendab ainult tehnilisi välju (MAC, hostinimi, Viimati nähtud). Kohandatud väljad nagu Omanik, Märkmed ja Olek säilitatakse, välja arvatud juhul, kui valite konflikti jaoks selgesõnaliselt "Kasuta skannimist".

**K: Kas ma saan importimise tagasi võtta?**
V: Jah. Iga importimine loob hetktõmmise. Navigeerige **IPAM > Impordi ajalugu** ja klõpsake tagasivõtmiseks soovitud importimisel **Taasta**.

**K: Mis juhtub IP-dega, mis olid IPAM-is, kuid mida skannimises ei leitud?**
V: Need jäävad muutumatuks. Seadme puudumine skannimisest ei tähenda, et see on kadunud — see võib olla välja lülitatud või teises VLAN-is. Kasutage "Aegunud IP-de" raportit (**IPAM > Raportid > Aegunud IP-d**), et leida IP-d, mida pole konfigureeritud perioodi jooksul nähtud.

**K: Kas ma saan importida mitmest alamvõrgust korraga?**
V: Jah. Kui teie skannimine hõlmab mitut alamvõrku, jaotab import IP-d õigetesse IPAM-i alamvõrkudesse nende aadresside põhjal. Alamvõrgud peavad IPAM-is juba olemas olema (või lubage "Alamvõrgu automaatne loomine" automaatse importimise seadetes).

Täiendava abi saamiseks võtke ühendust [support@netreconapp.com](mailto:support@netreconapp.com).
