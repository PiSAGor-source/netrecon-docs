---
sidebar_position: 2
title: Skannimisprofiilid
description: Konfigureerige skannimise sügavust ja kiirust profiilidega
---

# Skannimisprofiilid

Skannimisprofiilid võimaldavad kontrollida tasakaalu skannimiskiiruse ja põhjalikkuse vahel. NetRecon sisaldab nelja sisseehitatud profiili ja saate luua kohandatud profiile konkreetsete kasutusjuhtude jaoks.

## Sisseehitatud profiilid

### Kiire

Kiireim profiil, mis on mõeldud kiireks hosti tuvastamiseks minimaalse pordi skannimisega.

| Seade | Väärtus |
|---|---|
| ARP-tuvastus | Jah |
| Pordivahemik | Top 100 porti |
| Teenuse tuvastamine | Põhiline (ainult levinud teenused) |
| Seadme profileerimine | OUI + pordi sõrmejälg |
| Eeldatav aeg (/24) | 1-2 minutit |

**Sobib kõige paremini:** kiire inventuuri kontroll, seadme võrgusoleku kontrollimine, esialgne luure.

### Standard

Tasakaalustatud profiil, mis pakub head katvust ilma liigse skannimisajata.

| Seade | Väärtus |
|---|---|
| ARP-tuvastus | Jah |
| Pordivahemik | Top 1000 porti |
| Teenuse tuvastamine | Täielik bänneri hankimine |
| Seadme profileerimine | Täielik (OUI + pordid + bännerid) |
| Eeldatav aeg (/24) | 5-10 minutit |

**Sobib kõige paremini:** regulaarsed võrguauditid, rutiinsed turvahindamised, üldotstarbeline skannimine.

### Süva

Põhjalik skannimine, mis kontrollib kõiki levinud porte ja teostab põhjaliku teenuste analüüsi.

| Seade | Väärtus |
|---|---|
| ARP-tuvastus | Jah |
| Pordivahemik | 1-10 000 |
| Teenuse tuvastamine | Täielik bänneri hankimine + versiooni tuvastamine |
| Seadme profileerimine | Täielik CVE ristiviitega |
| Eeldatav aeg (/24) | 15-30 minutit |

**Sobib kõige paremini:** põhjalikud turvaauditid, vastavuskontrollid, üksikasjalik võrgu dokumenteerimine.

### Kohandatud

Looge oma profiil täieliku kontrolliga iga skannimisparameetri üle.

## Kohandatud profiili loomine

1. Avage NetRecon Scanner rakendus
2. Navigeerige **Skannimine > Profiilid**
3. Puudutage **Loo uus profiil**
4. Konfigureerige järgmised parameetrid:

### Tuvastuse seaded

| Parameeter | Valikud | Vaikeväärtus |
|---|---|---|
| Tuvastamismeetod | ARP / Ping / Mõlemad | ARP |
| Alamvõrk | Automaatne tuvastus / Käsitsi CIDR | Automaatne tuvastus |
| Väljajäetavad IP-d | Komaga eraldatud loend | Puudub |

### Pordi skannimise seaded

| Parameeter | Valikud | Vaikeväärtus |
|---|---|---|
| Pordivahemik | Top 100 / Top 1000 / 1-10000 / 1-65535 / Kohandatud | Top 1000 |
| Kohandatud pordid | Komaga eraldatud (nt 22,80,443,8080) | — |
| Skannimistehnika | TCP Connect / SYN (ainult root) | TCP Connect |
| Ajalõpp pordi kohta | 500ms - 10 000ms | 2000ms |
| Maks samaaegseid | 5 - 40 | 20 |

### Teenuse tuvastamise seaded

| Parameeter | Valikud | Vaikeväärtus |
|---|---|---|
| Bänneri hankimine | Väljas / Põhiline / Täielik | Põhiline |
| Versiooni tuvastamine | Jah / Ei | Ei |
| SSL/TLS teave | Jah / Ei | Ei |

### Jõudluse seaded

| Parameeter | Valikud | Vaikeväärtus |
|---|---|---|
| Akuteadlik | Jah / Ei | Jah |
| Maks samaaegseid sokleid | 5 - 40 | 20 |
| Skannimisviivitus hostide vahel | 0ms - 1000ms | 0ms |

5. Puudutage **Salvesta profiil**

## Profiilide haldamine

### Profiilide eksportimine ja importimine

Profiile saab seadmete vahel jagada:

1. Minge **Skannimine > Profiilid**
2. Pikalt vajutage profiili
3. Valige **Ekspordi** QR-koodi või JSON-faili genereerimiseks
4. Vastuvõtval seadmel puudutage **Impordi profiil** ja skannige QR-kood või valige fail

### Vaikimisi profiili seadistamine

1. Minge **Skannimine > Profiilid**
2. Pikalt vajutage soovitud profiili
3. Valige **Sea vaikimisi**

Vaikimisi profiili kasutatakse, kui puudutate peamist **Skanni** nuppu ilma profiili valimata.

## Sondi profiilid

Sondiga ühendatuna on saadaval täiendavad profiili valikud:

| Seade | Kirjeldus |
|---|---|
| IDS jälgimine | Luba Suricata IDS skannimise ajal |
| Haavatavuse skannimine | Käivita Nuclei haavatavuse kontrollid avastatud teenustel |
| PCAP salvestamine | Salvesta pakette skannimise ajal hilisemaks analüüsiks |
| Passiivne tuvastus | Kaasa passiivselt jälgitud seadmed tulemustesse |

Need valikud on saadaval ainult siis, kui Scanner rakendus on sondiga ühendatud.

## KKK

**K: Miks võtab Süva profiil nii kaua aega?**
V: Süva profiil skannib kuni 10 000 porti hosti kohta täieliku teenuse tuvastamisega. /24 alamvõrgu puhul, kus on 100+ aktiivset hosti, tähendab see miljoneid ühenduskatseid. Kaaluge Standardse profiili kasutamist rutiinseteks kontrollideks ja reserveerige Süva sihipäraste hindamiste jaoks.

**K: Kas ma saan skannida kõiki 65 535 porti?**
V: Jah, luues Kohandatud profiili pordivahemikuga "1-65535". Pange tähele, et see pikendab oluliselt skannimisaega. Üksiku hosti jaoks võtab täielik pordi skannimine ligikaudu 5-10 minutit; terve /24 alamvõrgu jaoks võib see kesta mitu tundi.

**K: Kas akuteadlik režiim mõjutab skannimistulemusi?**
V: Akuteadlik režiim vähendab samaaegsete ühenduste arvu, kui aku on alla 30%, mis aeglustab skannimist, kuid ei jäta ühtegi sihtmärki ega porti vahele. Tulemused on identsed; muutub ainult lõpuleviimise aeg.

Lisaabi saamiseks võtke ühendust [support@netreconapp.com](mailto:support@netreconapp.com).
