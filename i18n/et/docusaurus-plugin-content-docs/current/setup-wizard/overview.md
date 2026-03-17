---
sidebar_position: 1
title: Seadistusviisardi ülevaade
description: Täielik juhend NetRecon OS esmakäivituse seadistusviisardile
---

# Seadistusviisardi ülevaade

Seadistusviisard käivitub automaatselt NetRecon OS esimesel käivitusel. See juhendab teid läbi kõigi oluliste konfiguratsioonisammude, et teie sond tööle saada. Viisard on kättesaadav veebibrauseri kaudu aadressil `http://<probe-ip>:8080`.

## Eeltingimused

- NetRecon OS edukalt käivitatud teie sondi riistvaral
- Vähemalt üks Etherneti kaabel ühendatud teie võrku
- Arvuti või nutitelefon samas võrgus viisardile juurdepääsuks

## Viisardi sammud

Seadistusviisard koosneb 11 sammust, mis läbitakse järjestikku:

| Samm | Nimi | Kirjeldus |
|---|---|---|
| 1 | **Tervitus** | Keele valik ja litsentsileping |
| 2 | **Administraatori konto** | Administraatori kasutajanime ja parooli loomine |
| 3 | **Hostinimi** | Sondi hostinime seadistamine võrgus |
| 4 | **Võrguliidesed** | Etherneti portide tuvastamine ja rollide määramine |
| 5 | **Võrgurežiim** | Skannimise topoloogia valimine (Üksik, Kahekordne, Sild, TAP) |
| 6 | **IP konfiguratsioon** | Staatiline IP või DHCP iga liidese jaoks |
| 7 | **DNS ja NTP** | DNS-serverite ja aja sünkroonimise konfigureerimine |
| 8 | **Cloudflare Tunnel** | Kaugpöörduse tunneli seadistamine (valikuline) |
| 9 | **Turvaseaded** | TLS-sertifikaatide, 2FA ja seansi ajalõpu konfigureerimine |
| 10 | **Esialgne skannimissihtmärk** | Esimese skannitava alamvõrgu määratlemine |
| 11 | **Kokkuvõte ja rakendamine** | Kõigi seadete ülevaatamine ja konfiguratsiooni rakendamine |

## Sammude üksikasjad

### 1. samm: tervitus

Valige eelistatud keel 11 toetatud keele hulgast. Nõustuge litsentsilepinguga jätkamiseks.

### 2. samm: administraatori konto

Looge administraatori konto, mida kasutatakse sondi armatuurlaualt ja API-st sisselogimiseks. Valige tugev parool — sellel kontol on täielik süsteemi juurdepääs.

### 3. samm: hostinimi

Seadistage sondile tähendusrikas hostinimi (nt `netrecon-hq` või `probe-branch-01`). See hostinimi levitatakse mDNS kaudu kohalikuks tuvastamiseks.

### 4. samm: võrguliidesed

Viisard tuvastab kõik saadaolevad Etherneti pordid ja kuvab nende ühenduse oleku. Igale liidesele saate määrata rolli:

- **Skannimine** — liides, mida kasutatakse võrgu avastamiseks ja skannimiseks
- **Haldus** — liides, mida kasutatakse armatuurlaua juurdepääsuks ja kaughalduseks
- **Üleslink** — liides, mis on ühendatud teie interneti lüüsiga
- **Kasutamata** — keelatud liidesed

Vt [Võrguliidesed](./network-interfaces.md) üksikasjaliku juhenduse jaoks.

### 5. samm: võrgurežiim

Valige, kuidas sond teie võrguga ühendub:

- **Üksik liides** — skannimine ja haldus ühel pordil
- **Kahekordne skannimine** — eraldi skannimise ja halduse liidesed
- **Sild** — läbipaistev sisseehitatud režiim kahe pordi vahel
- **TAP** — passiivne jälgimine võrgu TAP-i või SPAN-pordi kaudu

Vt [Võrgurežiimid](./network-modes.md) üksikasjaliku juhenduse jaoks.

### 6. samm: IP konfiguratsioon

Iga aktiivse liidese jaoks valige DHCP ja staatilise IP konfiguratsiooni vahel. Haldusliidese jaoks on soovitatav staatiline IP, et sondi aadress ei muutuks.

### 7. samm: DNS ja NTP

Konfigureerige ülemised DNS-serverid (vaikimisi Cloudflare 1.1.1.1 ja Google 8.8.8.8). NTP konfigureeritakse täpsete ajatemplite tagamiseks logides ja skannimistulemustes.

### 8. samm: Cloudflare Tunnel

Valikuliselt konfigureerige Cloudflare Tunnel turvaliseks kaugpöörduseks. Teil on vaja:
- Cloudflare'i kontot
- Tunneli tokenit (genereeritud Cloudflare Zero Trust armatuurlaualt)

Seda sammu saab vahele jätta ja hiljem sondi armatuurlaualt konfigureerida.

### 9. samm: turvaseaded

- **TLS-sertifikaat** — genereerige iseallkirjastatud sertifikaat või esitage oma
- **Kahefaktoriline autentimine** — lubage TOTP-põhine 2FA administraatori kontole
- **Seansi ajalõpp** — konfigureerige, kui kaua armatuurlaua seansid aktiivseks jäävad

### 10. samm: esialgne skannimissihtmärk

Määratlege esimene alamvõrk, mida sond skannib. Viisard tuvastab automaatselt alamvõrgu skannimisliidese IP konfiguratsioonist ja soovitab seda vaikesihtmärgina.

### 11. samm: kokkuvõte ja rakendamine

Vaadake üle kõik konfigureeritud seaded. Klõpsake **Rakenda** konfiguratsiooni lõpetamiseks. Sond:

1. Rakendab võrgukonfiguratsiooni
2. Genereerib TLS-sertifikaadid
3. Käivitab kõik teenused
4. Alustab esialgset võrguskannimist (kui konfigureeritud)
5. Suunab teid sondi armatuurlauale

:::info
Viisard käivitub ainult üks kord. Pärast lõpetamist keelatakse esmakäivituse teenus. Viisardi uuesti käivitamiseks kasutage valikut **Tehaseseaded** sondi armatuurlaual menüüs **Seaded > Süsteem**.
:::

## Pärast viisardit

Kui viisard on lõpetatud:

- Ligipääs sondi armatuurlauale aadressil `https://<probe-ip>:3000`
- Kui Cloudflare Tunnel konfigureeriti, kaugpöördus aadressil `https://probe.netreconapp.com`
- Ühendage NetRecon Scanner või Admin Connect rakendus sondiga

## KKK

**K: Kas ma saan eelmisele sammule tagasi minna?**
V: Jah, viisardil on igal sammul tagasinupp. Teie varem sisestatud väärtused säilitatakse.

**K: Mis siis, kui mul on vaja pärast viisardit seadeid muuta?**
V: Kõiki viisardis konfigureeritud seadeid saab hiljem muuta sondi armatuurlaualt menüüs **Seaded**.

**K: Viisard ei näita ühtegi võrguliidest. Mida teha?**
V: Veenduge, et Etherneti kaablid on ühendatud ja ühenduse LED-id on aktiivsed. USB Etherneti adapteri kasutamisel võib olla vajalik draiveri käsitsi paigaldamine. Vt [Võrguliidesed](./network-interfaces.md) draiveri taastamise kohta.

Täiendava abi saamiseks võtke ühendust [support@netreconapp.com](mailto:support@netreconapp.com).
