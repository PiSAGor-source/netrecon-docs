---
sidebar_position: 2
title: Kiirjuhend
description: Lahtipakkimisest esimese võrgu skannimiseni 10 minutiga
---

# Kiirjuhend

Jõudke nullist esimese võrgu skannimiseni alla 10 minutiga. See juhend eeldab, et olete juba kirjutanud NetRecon OS tõmmise oma salvestusseadmele.

## Mida vajate

- Sondiseade, kuhu on installitud NetRecon OS (vt [Paigaldamine](./installation.md))
- Etherneti kaabel, mis on ühendatud teie võrku
- Nutitelefon või arvuti samas võrgus
- NetRecon Scanner rakendus (valikuline, mobiilseks skannimiseks)

## Minutid 0-2: käivitage sond

1. Sisestage ettevalmistatud microSD-kaart või käivitage sisemisest mälust
2. Ühendage Etherneti kaabel võrgulüliti või ruuteriga
3. Lülitage seade sisse
4. Oodake, kuni roheline oleku LED muutub püsivaks (ligikaudu 60 sekundit)

## Minutid 2-5: läbige seadistusviisard

1. Leidke sondi IP-aadress oma ruuteri DHCP tabelist või vaadake konsooliväljundit
2. Avage `http://<sondi-ip>:8080` brauseris
3. Läbige need olulised viisardi sammud:
   - **Seadistage administraatori parool** — valige tugev parool
   - **Määrake võrguliidesed** — valige, milline port ühendub teie skannimisvõrguga
   - **Valige skannimisrežiim** — valige põhiseadistuse jaoks "Üksik liides"
   - **Konfigureerige Cloudflare Tunnel** (valikuline) — võimaldab kaugjuurdepääsu `https://probe.netreconapp.com` kaudu
4. Klõpsake **Lõpeta seadistamine**

## Minutid 5-7: kontrollige sondi juhtpaneeli

1. Pärast viisardi lõpuleviimist navigeerige `http://<sondi-ip>:3000`
2. Logige sisse loodud administraatori mandaatidega
3. Kontrollige, et juhtpaneel kuvab:
   - Süsteemi tervis: CPU, RAM, salvestuse kasutus
   - Võrguliidesed: vähemalt üks liides "skannimise" rollis
   - Teenused: põhiteenused peaksid näitama rohelist olekut

## Minutid 7-10: käivitage oma esimene skannimine

### Valik A: sondi juhtpaneelilt

1. Navigeerige **Skannimine > Alusta skannimist**
2. Valige sihtmärgi alamvõrk (tuvastatakse automaatselt teie skannimisliidesest)
3. Valige **Kiire** skannimisprofiil
4. Klõpsake **Alusta**
5. Jälgige seadmete ilmumist juhtpaneelile reaalajas

### Valik B: NetRecon Scanner rakendusest

1. Avage NetRecon Scanner rakendus oma Android-seadmes
2. Rakendus tuvastab sondi mDNS kaudu, kui olete samas võrgus
3. Alternatiivselt minge **Seaded > Sondi ühendus** ja sisestage sondi IP
4. Puudutage avakuval **Skanni**
5. Valige oma võrk ja puudutage **Alusta skannimist**

## Mis toimub skannimise ajal

1. **ARP-tuvastus** — sond saadab ARP-päringud kõigi elavate hostide leidmiseks alamvõrgus
2. **Pordi skannimine** — iga avastatud hosti skannitakse avatud TCP-portide suhtes
3. **Teenuse tuvastamine** — avatud porte uuritakse töötava teenuse ja versiooni tuvastamiseks
4. **Seadme profileerimine** — sond kombineerib MAC-aadressi OUI otsingu, avatud pordid ja teenuste bännerid seadme tüübi tuvastamiseks

## Järgmised sammud

Nüüd, kui olete oma esimese skannimise lõpule viinud, uurige neid funktsioone:

- [Skannimisprofiilid](../scanner/scan-profiles.md) — kohandage skannimise sügavust ja kiirust
- [Aruanded](../scanner/reports.md) — genereerige skannimistulemustest PDF-aruandeid
- [Admin Connect](../admin-connect/overview.md) — seadistage kaughaldus
- [Agendi juurutamine](../agents/overview.md) — juurutage agendid oma lõppseadmetele

## KKK

**K: Skannimine leidis oodatust vähem seadmeid. Miks?**
V: Veenduge, et sond on õiges VLAN-is/alamvõrgus. Tulemüürid või kliendipoolsed tulemüürid võivad blokeerida ARP-vastuseid. Proovige käivitada **Standardne** profiil **Kiire** asemel põhjalikumaks tuvastamiseks.

**K: Kas ma saan skannida mitut alamvõrku?**
V: Jah. Konfigureerige lisaalamvõrgud sondi juhtpaneelil menüüs **Seaded > Skannimise sihtmärgid**. Mitme alamvõrgu skannimine nõuab sobivat marsruutimist või mitut võrguliidest.

**K: Kui kaua skannimine kestab?**
V: Kiire skannimine /24 alamvõrgust lõpeb tavaliselt alla 2 minuti. Standardne võtab 5-10 minutit. Süvaskannimine võib kesta 15-30 minutit sõltuvalt hostide ja portide arvust.

Lisaabi saamiseks võtke ühendust [support@netreconapp.com](mailto:support@netreconapp.com).
