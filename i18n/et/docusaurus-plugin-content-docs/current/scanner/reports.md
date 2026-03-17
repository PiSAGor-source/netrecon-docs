---
sidebar_position: 3
title: Aruanded
description: Genereerige ja kohandage PDF turvaauditi aruandeid
---

# Aruanded

NetRecon Scanner genereerib professionaalseid PDF-aruandeid teie skannimistulemustest. Aruanded on mõeldud turvaaudititeks, vastavusdokumentatsiooniks ja klientidele esitatavateks materjalideks.

## Eeltingimused

- Vähemalt üks lõpuleviidud skannimine tulemustega
- Piisav seadme salvestusruum PDF genereerimiseks (tavaliselt 1-5 MB aruande kohta)

## Aruande genereerimine

1. Viige lõpule võrgu skannimine
2. Skannimistulemuste kuval puudutage ülemises paremas nurgas **Aruanne** nuppu
3. Valige aruande tüüp ja kohandage valikuid
4. Puudutage **Genereeri PDF**
5. Aruanne salvestatakse ja seda saab jagada mis tahes Android jagamismeetodil

## Aruande sisu

Standardaruanne sisaldab järgmisi jaotisi:

### Kokkuvõte juhtkonnale
- Skannimise kuupäev ja kestus
- Võrgu ulatus (alamvõrk, kasutatud profiil)
- Avastatud seadmete koguarv
- Peamiste leidude kokkuvõte (avatud kõrge riskiga pordid, tuvastamata seadmed)

### Seadmete inventuur
- Avastatud seadmete täielik loend
- IP-aadress, MAC-aadress, hostinimi
- Seadme tüüp ja tootja
- Operatsioonisüsteem (kui tuvastatud)

### Portide ja teenuste analüüs
- Avatud pordid seadme kohta
- Töötavad teenused ja versioonid
- Teenuse riskiklassifikatsioon (Madal / Keskmine / Kõrge / Kriitiline)

### Turvaleiud
- Kõrge riskiga avatud portidega seadmed (nt Telnet, FTP, SMB)
- Tuvastatud krüpteerimata teenused
- Vaikimisi või teadaolevalt haavatavad teenuseversioonid
- CVE viited tuvastatud teenuseversioonide jaoks (kui CVE andmebaas on saadaval)

### Võrgu topoloogia
- Tekstipõhine võrgu paigutuse kokkuvõte
- Seadmete jaotus tüübi järgi (serverid, tööjaamad, võrguseadmed, IoT)

### Lisa
- Täielikud pordi skannimise üksikasjad hosti kohta
- Töötlemata teenuste bännerid
- Skannimise konfiguratsioon ja profiili seaded

## Aruande kohandamine

Enne genereerimist saate aruannet kohandada:

| Valik | Kirjeldus |
|---|---|
| Ettevõtte nimi | Kuvatakse päises ja tiitellehel |
| Aruande pealkiri | Kohandatud pealkiri (vaikimisi: "Võrgu turvaauditi aruanne") |
| Logo | Laadige üles ettevõtte logo tiitellehe jaoks |
| Jaotiste kaasamine | Lülitage üksikuid jaotisi sisse/välja |
| Tundlikkuse silt | Konfidentsiaalne / Sisemine / Avalik |
| Keel | Genereerige aruanne mis tahes 11-st toetatud keelest |

## Aruannete jagamine

Pärast genereerimist jagage PDF-i:

- **E-post** — puudutage Jaga ja valige oma e-posti rakendus
- **Pilvesalvestus** — salvestage Google Drive'i, OneDrive'i jne
- **QR-kood** — genereerige QR-kood, mis viitab kohalikult majutatud aruandele (kasulik kolleegile samas võrgus edastamiseks)
- **Otsene edastamine** — kasutage Android-i lähedal jagamise funktsiooni

## Fondi ja Unicode tugi

Aruanded kasutavad NotoSans fondiperet, et tagada õige renderdamine:
- Ladina tähemärgid (EN, DE, FR, ES, NL jne)
- Kirillitsa tähemärgid (RU)
- Türgi eritähemärgid (TR)
- Skandinaavia tähemärgid (SV, NO, DA)
- Poola tähemärgid (PL)

Kõik 11 toetatud keelt renderdatakse genereeritud PDF-ides korrektselt.

## Aruannete salvestamine

Genereeritud aruanded salvestatakse seadmesse lokaalselt:

- Vaikimisi asukoht: rakenduse sisemine salvestus
- Aruandeid saab eksportida välisele salvestusele või pilve
- Vanu aruandeid saab hallata menüüst **Aruanded > Ajalugu**
- Aruanded ei aegu ja jäävad kättesaadavaks kuni käsitsi kustutamiseni

## KKK

**K: Kas ma saan genereerida aruannet sondi skannimistulemustest?**
V: Jah. Sondiga ühendatuna saate genereerida aruandeid nii kohalike skannimistulemuste kui ka sondi skannimisandmete põhjal. Sondi aruanded võivad sisaldada lisaandmeid nagu IDS hoiatused ja haavatavuste leiud.

**K: Milline on aruande maksimaalne võrgu suurus?**
V: Aruandeid on testitud kuni 1000 seadmega võrkudega. Suuremad võrgud võivad genereerimiseks kauem aega võtta, kuid kindlat piirangut pole.

**K: Kas ma saan ajastada automaatseid aruandeid?**
V: Ajastatud aruandlus on saadaval sondi juhtpaneelil. Konfigureerige aruannete ajakavasid menüüs **Seaded > Aruanded > Ajaplaneerimine**.

**K: PDF näitab segaduses teksti. Kuidas seda parandada?**
V: See juhtub tavaliselt seadmes, millel pole NotoSans fondi tuge. Avage PDF Google Chrome'is, Adobe Acrobatis või mis tahes kaasaegses PDF-lugejas, mis toetab manustatud fonte.

Lisaabi saamiseks võtke ühendust [support@netreconapp.com](mailto:support@netreconapp.com).
