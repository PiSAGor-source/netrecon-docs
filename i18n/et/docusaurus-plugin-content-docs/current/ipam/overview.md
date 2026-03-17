---
sidebar_position: 1
title: IPAM ülevaade
description: IP-aadresside haldamine alamvõrkude jälgimise ja kasutuse seirega
---

# IPAM — IP-aadresside haldamine

NetRecon IPAM pakub tsentraliseeritud IP-aadresside jälgimist ja alamvõrkude haldamist. Jälgige alamvõrkude kasutust, hoidke silma peal IP-määrangutel ja säilitage täpne ülevaade oma võrgu aadressiruumist.

## Põhifunktsioonid

- **Alamvõrkude haldamine** — määratlege ja korraldage alamvõrke täieliku CIDR-notatsiooniga
- **IP jälgimine** — jälgige üksikuid IP-määranguid oleku ja metaandmetega
- **Kasutuse seire** — reaalajas alamvõrgu kasutusprotsendid ja hoiatused
- **Skannimise integratsioon** — importige avastatud IP-d otse skannimistulemustest
- **Konflikti tuvastamine** — tuvastage duplikaat-IP-aadressid ja kattuvad alamvõrgud
- **OUI sünkroonimine** — seostage automaatselt MAC-aadressid tootja andmetega
- **Ajalugu** — jälgige IP-määrangute muutusi aja jooksul
- **Eksport** — eksportige IP-andmeid CSV- või JSON-vormingus

## Arhitektuur

IPAM töötab eraldiseisva teenusena sondil (port 8009) PostgreSQL taustasüsteemiga:

```
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│  Dashboard   │  HTTP  │    IPAM      │  SQL   │  PostgreSQL  │
│  (Browser)   ├────────►  Service     ├────────►  Database    │
│              │        │   :8009      │        │              │
└──────────────┘        └──────┬───────┘        └──────────────┘
                               │
                        ┌──────▼───────┐
                        │ Scan Engine  │
                        │ (IP import)  │
                        └──────────────┘
```

## Mõisted

### Alamvõrgud

Alamvõrk esindab IP-aadresside vahemikku, mis on määratletud CIDR-notatsiooniga (nt `192.168.1.0/24`). Igal alamvõrgul on:

| Väli | Kirjeldus |
|---|---|
| CIDR | Võrguaadress CIDR-notatsiooniga |
| Nimi | Sõbralik nimi (nt "Kontori LAN") |
| VLAN | Seotud VLAN ID (valikuline) |
| Lüüs | Vaikelüüsi IP |
| DNS | Selle alamvõrgu DNS-serverid |
| Kirjeldus | Vabas vormis kirjeldus |
| Asukoht | Füüsiline või loogiline asukoht |

### IP-aadressid

Iga IP-aadressi alamvõrgus saab jälgida järgmiselt:

| Väli | Kirjeldus |
|---|---|
| IP-aadress | IPv4 või IPv6 aadress |
| Olek | Saadaval, Määratud, Reserveeritud, DHCP |
| Hostinimi | Seadme hostinimi |
| MAC-aadress | Seotud MAC-aadress |
| Tootja | Automaatselt täidetud OUI andmebaasist |
| Omanik | Määratud kasutaja või osakond |
| Viimati nähtud | Viimase võrgutegevuse ajatempel |
| Märkmed | Vabas vormis märkmed |

### Kasutus

Alamvõrgu kasutus arvutatakse järgmiselt:

```
Kasutus = (Määratud + Reserveeritud + DHCP) / Kasutatavad IP-d kokku * 100%
```

Hoiatusi saab konfigureerida, kui kasutus ületab künnise (vaikimisi: 80%).

## Alustamine

### 1. samm: looge alamvõrk

1. Navigeerige **IPAM > Alamvõrgud** sondi armatuurlaual
2. Klõpsake **Lisa alamvõrk**
3. Sisestage CIDR (nt `10.0.1.0/24`)
4. Täitke valikulised väljad (nimi, VLAN, lüüs jne)
5. Klõpsake **Salvesta**

### 2. samm: importige IP-d skannimisest

Kiireim viis IPAM-i täitmiseks on importida lõpetatud skannimisest:

1. Navigeerige **IPAM > Alamvõrgud**
2. Valige oma alamvõrk
3. Klõpsake **Impordi skannimisest**
4. Valige skannimistulemus, millest importida
5. Vaadake üle imporditavad IP-d
6. Klõpsake **Impordi**

Vt [Skannimisest importimine](./import-from-scan.md) üksikasjalike juhiste jaoks.

### 3. samm: hallake IP-määranguid

1. Klõpsake alamvõrgul selle IP-aadresside vaatamiseks
2. Klõpsake IP-l selle üksikasjade vaatamiseks/muutmiseks
3. Muutke olekut, lisage märkmeid, määrake omanikule
4. Klõpsake **Salvesta**

### 4. samm: jälgige kasutust

1. Navigeerige **IPAM > Armatuurlaud**
2. Vaadake alamvõrkude kasutusgraafikuid
3. Konfigureerige hoiatusi kõrge kasutuse jaoks menüüs **IPAM > Seaded > Hoiatused**

## Alamvõrkude korraldamine

Alamvõrke saab korraldada hierarhiliselt:

```
10.0.0.0/16          (Ettevõtte võrk)
├── 10.0.1.0/24      (Peakontor - Kontori LAN)
├── 10.0.2.0/24      (Peakontor - Serveri VLAN)
├── 10.0.3.0/24      (Peakontor - Wi-Fi)
├── 10.0.10.0/24     (Filiaal 1 - Kontor)
├── 10.0.11.0/24     (Filiaal 1 - Serverid)
└── 10.0.20.0/24     (Filiaal 2 - Kontor)
```

Ema/lapse suhted luuakse automaatselt CIDR-i sisalduvuse põhjal.

## IPv6 tugi

IPAM toetab nii IPv4 kui ka IPv6 aadresse:
- Täielik CIDR-notatsioon IPv6 alamvõrkude jaoks
- IPv6 aadresside jälgimine samade väljadega nagu IPv4
- Topeltvirna seadmed näitavad mõlemaid aadresse seotuna

## KKK

**K: Kas ma saan alamvõrke CSV-failist importida?**
V: Jah. Navigeerige **IPAM > Import** ja laadige üles CSV-fail veergudega: CIDR, Nimi, VLAN, Lüüs, Kirjeldus. Malli-CSV on allalaadimiseks saadaval impordi lehel.

**K: Kui tihti kasutusandmeid uuendatakse?**
V: Kasutus arvutatakse ümber iga kord, kui IP olek muutub, ja ajastatud alusel (vaikimisi iga 5 minuti järel).

**K: Kas IPAM integreerub DHCP-serveritega?**
V: IPAM saab importida DHCP-liisingute andmeid dünaamiliselt määratud IP-de jälgimiseks. Konfigureerige DHCP-serveri ühendus menüüs **IPAM > Seaded > DHCP integratsioon**.

**K: Kas mitu kasutajat saavad IPAM-i andmeid samaaegselt muuta?**
V: Jah. IPAM kasutab optimistlikku lukustamist konfliktide vältimiseks. Kui kaks kasutajat muudavad sama IP-aadressi, kuvatakse teisele salvestamisel konfliktihoiatus koos ühendamise või ülekirjutamise valikuga.

Täiendava abi saamiseks võtke ühendust [support@netreconapp.com](mailto:support@netreconapp.com).
