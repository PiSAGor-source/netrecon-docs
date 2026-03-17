---
sidebar_position: 2
title: Registreerimine
description: Registreerige sondid Admin Connecti QR-koodi või käsitsi seadistamise kaudu
---

# Sondi registreerimine

Registreerimine on protsess, millega ühendate sondi oma Admin Connect rakendusega. Pärast registreerimist saate sondi kaugelt jälgida ja hallata kõikjalt.

## Eeltingimused

- Admin Connect rakendus installitud teie Android-seadmesse
- NetRecon Probe, mis on seadistusviisardi lõpetanud
- Internetiühendus nii sondil kui teie mobiilseadmel

## Meetod 1: QR-koodi registreerimine

QR-koodi registreerimine on kiireim ja usaldusväärseim meetod. QR-kood sisaldab sondi ühenduse üksikasju ja autentimistõendit krüpteeritud kujul.

### 1. samm: kuvage QR-kood

QR-kood on saadaval kahes kohas:

**Seadistusviisardi ajal:**
Viisardi lõpus (samm 11) kuvatakse kokkuvõtte ekraanil QR-kood.

**Sondi juhtpaneelilt:**
1. Logige sisse sondi juhtpaneelile aadressil `https://<sondi-ip>:3000`
2. Navigeerige **Seaded > Kaugjuurdepääs**
3. Klõpsake **Genereeri registreerimise QR-kood**
4. QR-kood kuvatakse ekraanil

### 2. samm: skannige QR-kood

1. Avage Admin Connect
2. Puudutage **+** nuppu uue sondi lisamiseks
3. Valige **Skanni QR-kood**
4. Suunake kaamera sondil kuvatavale QR-koodile
5. Rakendus parsib ühenduse üksikasjad automaatselt

### 3. samm: kontrollige ja ühenduge

1. Vaadake üle rakenduses kuvatud sondi üksikasjad (hostinimi, IP, tunneli URL)
2. Puudutage **Ühenda**
3. Rakendus loob turvalise ühenduse sondiga
4. Pärast ühendamist ilmub sond teie pargi juhtpaneelile

### QR-koodi sisu

QR-kood kodeerib JSON-koormuse, mis sisaldab:

```json
{
  "hostname": "netrecon-hq",
  "tunnel_url": "https://probe.netreconapp.com",
  "token": "<enrollment-token>",
  "fingerprint": "<certificate-fingerprint>",
  "version": "2.2.0"
}
```

Registreerimistõend on ühekordselt kasutatav ja aegub 24 tunni pärast.

## Meetod 2: käsitsi registreerimine

Kasutage käsitsi registreerimist, kui te ei saa sondile füüsiliselt ligi QR-koodi skannimiseks.

### 1. samm: hankige ühenduse üksikasjad

Vajate järgmist oma sondi administraatorilt:
- **Tunneli URL**: tavaliselt `https://probe.netreconapp.com` või kohandatud domeen
- **Registreerimistõend**: 32-tähemärgiline tähtnumbriline string
- **Sertifikaadi sõrmejälg** (valikuline): sertifikaadi kinnitamise kontrollimiseks

### 2. samm: sisestage üksikasjad Admin Connecti

1. Avage Admin Connect
2. Puudutage **+** nuppu uue sondi lisamiseks
3. Valige **Käsitsi seadistamine**
4. Sisestage nõutavad väljad:
   - **Sondi nimi**: sõbralik nimi tuvastamiseks
   - **Tunneli URL**: sondi HTTPS URL
   - **Registreerimistõend**: kleepige administraatori antud tõend
5. Puudutage **Ühenda**

### 3. samm: kontrollige ühendust

1. Rakendus proovib ühenduda ja autentida
2. Eduka ühenduse korral kuvatakse sondi üksikasjad
3. Puudutage **Lisa parki** kinnitamiseks

## Ettevõtte registreerimine

Suuremahulisteks juurutusteks toetab Admin Connect hulgiregistreerimist:

### MDM hallatav konfiguratsioon

Juurutage registreerimise seaded oma MDM-lahenduse kaudu:

```xml
<managedAppConfiguration>
  <key>probe_url</key>
  <value>https://probe.netreconapp.com</value>
  <key>enrollment_token</key>
  <value>your-enrollment-token</value>
  <key>auto_enroll</key>
  <value>true</value>
</managedAppConfiguration>
```

### Pargi registreerimistõend

Genereerige taaskasutatav pargi registreerimistõend sondi juhtpaneelilt:

1. Navigeerige **Seaded > Kaugjuurdepääs > Pargi registreerimine**
2. Klõpsake **Genereeri pargi tõend**
3. Seadistage aegumiskuupäev ja maksimaalne registreerimiste arv
4. Jagage tõendit oma meeskonnaga

Pargi tõendeid saavad kasutada mitu Admin Connect eksemplari sama sondi registreerimiseks.

## Registreeritud sondide haldamine

### Registreeritud sondide vaatamine

Kõik registreeritud sondid kuvatakse Admin Connecti avakuval. Iga sond näitab:
- Ühenduse olek (võrgus/võrguühenduseta)
- Viimati nähtud ajatempel
- Tervise kokkuvõte (CPU, RAM, ketas)
- Aktiivsete hoiatuste arv

### Sondi eemaldamine

1. Pikalt vajutage pargi loendis sondi
2. Valige **Eemalda sond**
3. Kinnitage eemaldamine

See eemaldab sondi ainult teie rakendusest. Sondi ennast see ei mõjuta.

### Uuesti registreerimine

Kui vajate sondi uuesti registreerimist (nt pärast tõendi rotatsiooni):
1. Eemaldage sond Admin Connectist
2. Genereerige sondil uus registreerimise QR-kood või tõend
3. Registreerige uuesti kasutades ükskõik millist ülaltoodud meetodit

## Veaotsing

### QR-koodi skannimine ebaõnnestub
- Tagage piisav valgustus ja hoidke kaamerat stabiilselt
- Proovige suurendada ekraani heledust seadmel, mis kuvab QR-koodi
- Kui kaamera ei suuda fokusseerida, proovige liikuda ekraanile lähemale või kaugemale

### Ühenduse ajalõpp
- Kontrollige, et sondil on internetiühendus ja Cloudflare Tunnel on aktiivne
- Kontrollige, et tulemüür ei blokeeri väljaminevat HTTPS-i (port 443) teie mobiilseadmes
- Proovige vahetada Wi-Fi ja mobiilse andmeside vahel

### Tõend on aegunud
- Registreerimistõendid aeguvad 24 tunni pärast
- Genereerige sondi juhtpaneelilt uus QR-kood või tõend

## KKK

**K: Kas mitu kasutajat saavad registreerida sama sondi?**
V: Jah. Iga kasutaja registreerib iseseisvalt ja saab oma seansi. Juurdepääsu kontrollib igale kasutajale määratud roll (vt [RBAC](./rbac.md)).

**K: Kas registreerimine töötab kohaliku võrgu kaudu ilma internetita?**
V: Käsitsi registreerimine võib töötada kohaliku võrgu kaudu, kasutades sondi kohalikku IP-aadressi tunneli URL-i asemel. QR-registreerimine töötab samuti lokaalselt.

**K: Kuidas ma rotatsioonin registreerimistõendeid?**
V: Navigeerige sondi juhtpaneelil **Seaded > Kaugjuurdepääs** ja klõpsake **Roteeri tõendit**. See tühistab kõik eelmised tõendid.

Lisaabi saamiseks võtke ühendust [support@netreconapp.com](mailto:support@netreconapp.com).
