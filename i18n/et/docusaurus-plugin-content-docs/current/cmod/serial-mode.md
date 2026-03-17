---
sidebar_position: 3
title: Jadarežiim
description: Ühenduge võrguseadmetega jadakonsooli kaabli kaudu
---

# Jadarežiim

Jadarežiim võimaldab ühenduda võrguseadmetega USB-jadakonsooli kaabli abil. See on hädavajalik seadme esmaseks seadistamiseks, parooli taastamiseks ja ribaväliseks haldamiseks, kui SSH pole kättesaadav.

## Eeltingimused

- USB-jadakonsooli kaabel (RJ45-USB või DB9-USB)
- USB-kaabel ühendatud sondi USB-porti
- Füüsiline juurdepääs võrguseadme konsooli pordile
- Sihtseadme jaoks õige baudisuurus

## Toetatud konsooli kaablite tüübid

| Kaabli tüüp | Pistik | Levinud kasutus |
|---|---|---|
| RJ45-USB | RJ45 konsooli port | Cisco, Juniper, Aruba |
| DB9-USB | DB9 jadaport | Vanemad kommutaatorid, tööstuslikud seadmed |
| USB-C/USB-A RJ45-le | RJ45 konsooli port | Kaasaegsed konsooli kaablid |
| USB-C USB-C-le | USB-C konsooli port | Mõned uuemad seadmed |

### Soovitatavad kiibistikud

Usaldusväärse jadaühenduse jaoks kasutage nende kiibistikega kaableid:
- **FTDI FT232R** — kõige ühilduvam, soovitatav
- **Prolific PL2303** — laialdaselt saadaval
- **Silicon Labs CP210x** — hea ühilduvus

Vältige võlts-FTDI kaableid, kuna need ei pruugi töökindlalt töötada.

## Jadaühenduse seadistamine

### 1. samm: ühendage kaabel

1. Ühendage konsooli kaabli USB-ots sondi USB-porti
2. Ühendage RJ45/DB9 ots võrguseadme konsooli porti
3. Veenduge, et sond tuvastab kaabli

### 2. samm: lisage seade

1. Navigeerige **CMod > Seadmed**
2. Klõpsake **Lisa seade**
3. Valige ühenduse tüübiks **Jadaühendus**
4. Konfigureerige jadaparameetrid:

| Väli | Kirjeldus | Vaikeväärtus |
|---|---|---|
| Nimi | Sõbralik seadme nimi | — |
| Jadaport | Tuvastatud USB-jadaseade | `/dev/ttyUSB0` |
| Baudisuurus | Sidekirius | 9600 |
| Andmebitid | Andmebittide arv | 8 |
| Paarsus | Paarsuse kontroll | Puudub |
| Stoppbitid | Stoppbittide arv | 1 |
| Voojuhtimine | Riistvara-/tarkvaravoo juhtimine | Puudub |
| Seadme tüüp | Tootja/OS (malli sobitamiseks) | — |

5. Klõpsake **Salvesta ja testi**

### 3. samm: avage terminal

1. Klõpsake seadmel CMod seadmete loendis
2. Klõpsake **Terminal**
3. Interaktiivne jadaterminal avaneb teie brauseris
4. Vajutage **Enter** seadme konsooli äratamiseks

## Baudisuuruse viide

Levinud baudisuurused tootja järgi:

| Tootja / seade | Vaike-baudisuurus |
|---|---|
| Cisco IOS / IOS-XE | 9600 |
| Cisco NX-OS | 9600 |
| Juniper Junos | 9600 |
| HP/Aruba ProCurve | 9600 |
| MikroTik RouterOS | 115200 |
| Fortinet FortiOS | 9600 |
| Palo Alto PAN-OS | 9600 |
| Ubiquiti EdgeOS | 115200 |
| Linux (üldine) | 115200 |

:::tip
Kui näete terminalis moonutatud teksti, on baudisuurus tõenäoliselt vale. Proovige levinud suurusi: 9600, 19200, 38400, 57600, 115200.
:::

## Jadaühenduse seaded

### Standardne 8N1 konfiguratsioon

Enamik võrguseadmeid kasutab "8N1" standardit:
- **8** andmebitti
- **N** (null) paarsust
- **1** stoppbitt

See on CMod vaikeväärtus ja peaks töötama valdava enamiku seadmetega.

### Voojuhtimine

| Tüüp | Millal kasutada |
|---|---|
| Puudub | Vaikimisi; töötab enamiku seadmetega |
| Riistvara (RTS/CTS) | Vajalik mõnede tööstuslike ja vanemate seadmete puhul |
| Tarkvara (XON/XOFF) | Kasutatakse harva; mõned pärand-terminali serverid |

## Jadapordi tuvastamine

Kui USB-jadakaabel on ühendatud, tuvastab CMod selle automaatselt:

1. Navigeerige **CMod > Seadmed > Lisa seade > Jadaühendus**
2. Rippmenüü **Jadaport** loetleb kõik tuvastatud USB-jadaseadmed
3. Kui mitu kaablit on ühendatud, kuvatakse iga eraldi pordina (nt `/dev/ttyUSB0`, `/dev/ttyUSB1`)

Kui porte ei tuvastata:
- Veenduge, et kaabel on täielikult sisestatud
- Proovige sondil teist USB-porti
- Kontrollige sondi süsteemilogi USB-seadme tuvastamise vigade osas

## Kasutusjuhud

### Seadme esmane seadistamine
Uue karbist-välja kommutaatori või ruuteri konfigureerimisel, millel pole IP-aadressi konfigureeritud:
1. Ühenduge jadakonsooli kaudu
2. Viige lõpule esmane konfiguratsioon (määrake haldus-IP, lubage SSH)
3. Lülituge SSH režiimile jooksvaks haldamiseks

### Parooli taastamine
Kui olete seadmest välja lukustatud:
1. Ühenduge jadakonsooli kaudu
2. Järgige tootja parooli taastamise protseduuri
3. Lähtestage parool ja taastage juurdepääs

### Ribaväline haldamine
Kui seadme haldusliides on kättesaamatu:
1. Ühenduge jadakonsooli kaudu
2. Diagnoosige probleem (liides maas, marsruutimise probleem jne)
3. Rakendage paranduskonfiguratsioon

### Püsivara uuendused
Mõned seadmed vajavad konsooli juurdepääsu püsivara uuenduste ajal:
1. Ühenduge jadakonsooli kaudu
2. Jälgige uuendusprotsessi reaalajas
3. Sekkuge, kui uuendus kohtab vigu

## Veaotsing

### Terminalis puudub väljund
- Vajutage **Enter** mitu korda konsooli äratamiseks
- Veenduge, et baudisuurus vastab seadme konfiguratsioonile
- Proovige konsooli kaablit ümber pöörata (mõned kaablid on erinevalt juhtmestatud)
- Veenduge, et kaabli USB-draiver on laetud (kontrollige sondi süsteemiloge)

### Moonutatud tekst
- Baudisuurus on vale; proovige esmalt 9600, seejärel 115200
- Kontrollige andmebittide, paarsuse ja stoppbittide seadeid
- Proovige teist konsooli kaablit

### "Permission denied" jadapordil
- CMod teenus vajab juurdepääsu `/dev/ttyUSB*` seadmetele
- See konfigureeritakse automaatselt NetRecon OS seadistamise ajal
- Kohandatud installatsiooni korral lisage CMod teenuse kasutaja `dialout` gruppi

### Katkendlikud ühenduse katkestused
- USB-kaabel võib olla lahti; tagage kindel ühendus
- Mõned pikad USB-kaablid põhjustavad signaali nõrgenemist; kasutage alla 3 meetri pikkust kaablit
- USB-jagajad võivad probleeme tekitada; ühendage otse sondi USB-porti

## KKK

**K: Kas ma saan jadarežiimi kasutada kaugelt Admin Connecti kaudu?**
V: Jah. Jadaterminal on kättesaadav veebi armatuurlaua kaudu, mis on ligipääsetav Cloudflare Tunneli kaudu. Saate sama interaktiivse terminali kogemuse kaugelt.

**K: Kui palju jadaühendusi suudab sond samaaegselt hallata?**
V: Üks jadaühendus USB-pordi kohta. Enamik sondi riistvara toetab 2-4 USB-porti. Kasutage toitega USB-jagajat täiendavate ühenduste jaoks, kuigi otseühendused on töökindlamad.

**K: Kas ma saan jadakonsooli käske automatiseerida?**
V: Jah. Käsumallid töötavad jadaühendustega samamoodi nagu SSH-ga. Saate luua malle korduvate jadaülesannete jaoks nagu parooli taastamine või esmane seadistamine.

Täiendava abi saamiseks võtke ühendust [support@netreconapp.com](mailto:support@netreconapp.com).
