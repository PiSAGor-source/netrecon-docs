---
sidebar_position: 3
title: Nõuded
description: Riistvara-, tarkvara- ja võrgunõuded NetReconi jaoks
---

# Nõuded

See leht kirjeldab kõigi NetReconi komponentide miinimum- ja soovitatavaid nõudeid.

## Sondi riistvara

### Toetatud platvormid

| Seade | Toe tase | Märkused |
|---|---|---|
| Orange Pi R2S (8 GB) | Esmane | Kahekordne Ethernet, kompaktne vormitegur |
| Raspberry Pi 4 (4/8 GB) | Esmane | Laialdaselt saadaval, hea jõudlus |
| Raspberry Pi 5 (4/8 GB) | Esmane | Parim ARM-jõudlus |
| x86_64 Mini PC (Intel N100+) | Esmane | Parim üldine jõudlus, mitu NIC-i |
| Muud ARM64 SBC-d | Edasijõudnud | Võib vajada käsitsi konfigureerimist |
| Virtuaalmasinad (VMware/Proxmox/Hyper-V) | Toetatud | Vajalik sillavõrk |

### Riistvara spetsifikatsioonid

| Nõue | Minimaalne | Soovitatav |
|---|---|---|
| Arhitektuur | ARM64 või x86_64 | ARM64 neljatuumaline või x86_64 |
| CPU tuumad | 2 | 4+ |
| RAM | 4 GB | 8 GB |
| Salvestus | 16 GB (eMMC/SD/SSD) | 32 GB SSD |
| Etherneti pordid | 1 | 2+ (silla/TAP-režiimi jaoks) |
| USB | Pole nõutav | USB-A jadakonsooli adapteri jaoks |
| Toide | 5V/3A (SBC) | PoE või toitepistik |

### Salvestuse kaalutlused

- **16 GB** on piisav põhiliseks skannimiseks ja jälgimiseks
- **32 GB+** on soovitatav, kui lubate PCAP salvestamise, IDS logimise või haavatavuste skannimise
- PCAP-failid võivad kiirel võrgul kiiresti kasvada; kaaluge pikaajalise salvestamise jaoks välist salvestust
- SQLite andmebaas kasutab WAL-režiimi optimaalse kirjutamise jõudluse jaoks

## NetRecon Scanner rakendus (Android)

| Nõue | Üksikasjad |
|---|---|
| Android versioon | 8.0 (API 26) või uuem |
| RAM | Minimaalselt 2 GB |
| Salvestus | 100 MB rakenduse + andmete jaoks |
| Võrk | Wi-Fi ühendatud sihtvõrguga |
| Root-juurdepääs | Valikuline (võimaldab edasijõudnud skannimisrežiime) |
| Shizuku | Valikuline (võimaldab mõningaid funktsioone ilma rootita) |

## Admin Connect rakendus

| Nõue | Üksikasjad |
|---|---|
| Android versioon | 8.0 (API 26) või uuem |
| RAM | Minimaalselt 2 GB |
| Salvestus | 80 MB rakenduse + andmete jaoks |
| Võrk | Internetiühendus (ühendub Cloudflare Tunneli kaudu) |

## Isehallatav server

| Nõue | Minimaalne | Soovitatav |
|---|---|---|
| OS | Ubuntu 22.04 LTS / Debian 12 | Ubuntu 24.04 LTS |
| CPU | 2 tuuma | 4+ tuuma |
| RAM | 4 GB | 8 GB |
| Salvestus | 40 GB | 100 GB SSD |
| Docker | v24.0+ | Viimane stabiilne |
| Docker Compose | v2.20+ | Viimane stabiilne |

Windows Server on samuti toetatud Docker Desktopi või WSL2 abil.

## Võrgunõuded

### Sondi võrgujuurdepääs

| Suund | Port | Protokoll | Otstarve |
|---|---|---|---|
| Sond -> LAN | ARP | Kiht 2 | Hosti tuvastamine |
| Sond -> LAN | TCP (erinevad) | Kiht 4 | Pordi skannimine |
| Sond -> LAN | UDP 5353 | mDNS | Teenuse tuvastamine |
| Sond -> Internet | TCP 443 | HTTPS | Cloudflare Tunnel, uuendused |
| LAN -> Sond | TCP 3000 | HTTPS | Veebijuhtpaneel |
| LAN -> Sond | TCP 8080 | HTTP | Seadistusviisard (ainult esmakäivitus) |

### Tulemüüri kaalutlused

- Sond **ei vaja ühtegi sissetulevat porti** internetist, kui kasutate Cloudflare Tunnelit
- Sond vajab **väljaminevat HTTPS-i (443)** tunneli ühenduvuse ja süsteemiuuenduste jaoks
- Kohaliku võrgu skannimiseks peab sond olema sihtseadmetega samas kiht 2 segmendis (või kasutama SPAN/mirror porti)

### Cloudflare Tunnel

Kaugjuurdepääs sondile on tagatud Cloudflare Tunneli kaudu. See nõuab:
- Aktiivset internetiühendust sondil
- Väljaminevat TCP 443 juurdepääsu (sissetulevaid porte pole vaja)
- Cloudflare'i kontot (tasuta pakett on piisav)

## Brauseri nõuded (veebijuhtpaneel)

| Brauser | Minimaalne versioon |
|---|---|
| Google Chrome | 90+ |
| Mozilla Firefox | 90+ |
| Microsoft Edge | 90+ |
| Safari | 15+ |

JavaScript peab olema lubatud.

## KKK

**K: Kas ma saan sondi käitada Raspberry Pi 3-l?**
V: Raspberry Pi 3-l on ainult 1 GB RAM-i, mis on alla miinimumnõude. See võib töötada põhiliseks skannimiseks, kuid pole toetatud.

**K: Kas sond vajab internetiühendust?**
V: Internetiühendust on vaja ainult Cloudflare Tunneli (kaugjuurdepääs) ja süsteemiuuenduste jaoks. Kõik skannimise funktsioonid töötavad ilma internetita.

**K: Kas ma saan kasutada USB Wi-Fi adapterit skannimiseks?**
V: Wi-Fi skannimine pole toetatud. Sond vajab usaldusväärse ja täieliku võrgutuvastuse jaoks juhtmega Etherneti ühendust.

Lisaabi saamiseks võtke ühendust [support@netreconapp.com](mailto:support@netreconapp.com).
