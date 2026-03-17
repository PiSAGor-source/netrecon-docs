---
sidebar_position: 1
title: Paigaldamine
description: Installige NetRecon OS oma sondi riistvarale
---

# NetRecon OS paigaldamine

See juhend juhendab teid NetRecon OS paigaldamisel oma sondi riistvarale. Protsess võtab ligikaudu 15 minutit allalaadimisest täielikult töötava sondini.

## Eeltingimused

- Toetatud riistvaraseade (vt [Nõuded](./requirements.md))
- MicroSD-kaart (minimaalselt 16 GB, soovitatav 32 GB) või USB-mälupulk
- Tõmmise kirjutamise tööriist nagu [balenaEtcher](https://etcher.balena.io/) või Raspberry Pi Imager
- Arvuti tõmmise allalaadimiseks ja kirjutamiseks
- Etherneti kaabel, mis on ühendatud teie võrku

## 1. samm: laadige tõmmis alla

Laadige oma riistvarale sobiv tõmmis alla NetReconi kliendiportaalist:

| Riistvara | Tõmmise fail | Arhitektuur |
|---|---|---|
| Orange Pi R2S | `netrecon-os-arm64.img.xz` | ARM64 |
| Raspberry Pi 4/5 | `netrecon-os-arm64.img.xz` | ARM64 |
| x86_64 Mini PC | `netrecon-os-amd64.iso` | x86_64 |

:::tip
Kontrollige allalaadimise kontrollsummat portaalis näidatud väärtuse vastu, et tagada faili terviklikkus.
:::

## 2. samm: kirjutage tõmmis

### ARM64 seadmete jaoks (Orange Pi, Raspberry Pi)

1. Sisestage oma microSD-kaart arvutisse
2. Avage balenaEtcher
3. Valige allalaaditud `.img.xz` fail (ei vaja lahtipakkimist)
4. Valige oma microSD-kaart sihtmärgiks
5. Klõpsake **Flash** ja oodake lõpuleviimist

### x86_64 seadmete jaoks

1. Sisestage USB-mälupulk arvutisse
2. Avage balenaEtcher
3. Valige allalaaditud `.iso` fail
4. Valige oma USB-mälupulk sihtmärgiks
5. Klõpsake **Flash** ja oodake lõpuleviimist
6. Käivitage mini PC USB-mälupulgalt ja järgige ekraanil olevat installiprogrammi

## 3. samm: esmane käivitamine

1. Sisestage microSD-kaart (või sisemine ketas x86_64 jaoks) oma sondiseadmesse
2. Ühendage vähemalt üks Etherneti kaabel oma võrku
3. Lülitage seade sisse
4. Oodake ligikaudu 60 sekundit süsteemi initsialiseerumist

Sond saab esmakäivitusel DHCP kaudu IP-aadressi.

## 4. samm: käivitage seadistusviisard

1. Avage mis tahes samas võrgus olevalt seadmelt veebibrauser
2. Navigeerige `http://<sondi-ip>:8080`
3. Seadistusviisard juhendab teid esialgse konfiguratsiooni läbi

Viisard aitab teil konfigureerida:
- Administraatori konto mandaadid
- Võrguliideste rollid
- Võrgu skannimise režiim
- Cloudflare Tunneli ühendus
- Turvaseaded

Üksikasjalikku viisardi dokumentatsiooni vaadake [Seadistusviisardi ülevaatest](../setup-wizard/overview.md).

## 5. samm: ühendage oma rakendused

Kui viisard on lõpule viidud:

- **NetRecon Scanner**: saab tuvastada sondi mDNS kaudu kohalikus võrgus
- **Admin Connect**: skannige viisardis kuvatud QR-koodi või ühenduge `https://probe.netreconapp.com` kaudu

## Riistvaranõuded

| Nõue | Minimaalne | Soovitatav |
|---|---|---|
| CPU | ARM64 või x86_64 | ARM64 neljatuumaline või x86_64 |
| RAM | 4 GB | 8 GB |
| Salvestus | 16 GB | 32 GB |
| Ethernet | 1 port | 2+ porti |
| Võrk | DHCP saadaval | Staatiline IP eelistatud |

## Veaotsing

### Sondi ei leita võrgust

- Veenduge, et Etherneti kaabel on korrektselt ühendatud ja ühenduse LED on aktiivne
- Kontrollige oma ruuteri DHCP rendi tabelit uue seadme nimega `netrecon` kohta
- Proovige ühendada monitor ja klaviatuur, et näha sondi IP-aadressi konsoolil

### Viisard ei laadi

- Veenduge, et pääsete ligi pordile 8080: `http://<sondi-ip>:8080`
- Viisarditeenus käivitub ligikaudu 60 sekundit pärast alglaadimist
- Kontrollige, et teie arvuti on sondiga samas võrgus/VLAN-is

### Tõmmise kirjutamine ebaõnnestub

- Proovige teist microSD-kaarti; mõnel kaardil on ühilduvusprobleeme
- Laadige tõmmis uuesti alla ja kontrollige kontrollsummat
- Proovige alternatiivset tõmmise kirjutamise tööriista

## KKK

**K: Kas ma saan NetRecon OS-i installida virtuaalmasinale?**
V: Jah, x86_64 ISO saab installida VMware'i, Proxmoxi või Hyper-V-sse. Eraldage vähemalt 4 GB RAM ja tagage, et VM-il on sillavõrguadapter.

**K: Kuidas uuendada NetRecon OS-i pärast paigaldamist?**
V: Uuendused edastatakse Admin Connect rakenduse kaudu või sondi veebijuhtpaneeli kaudu menüüs **Seaded > Süsteemi uuendus**.

**K: Kas ma saan kasutada Wi-Fi-d Etherneti asemel?**
V: Sond vajab vähemalt ühte juhtmega Etherneti ühendust usaldusväärse võrgu skannimise jaoks. Wi-Fi ei ole esmaseks skannimisliideseks toetatud.

Lisaabi saamiseks võtke ühendust [support@netreconapp.com](mailto:support@netreconapp.com).
