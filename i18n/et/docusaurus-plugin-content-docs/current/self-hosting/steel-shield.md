---
sidebar_position: 3
title: Steel Shield
description: Turvakõvenduse funktsioonid isehallatavate juurutuste jaoks
---

# Steel Shield

Steel Shield on NetReconi turvakõvenduse raamistik. See pakub mitmekihilist kaitset isehallatavate juurutuste jaoks, tagades kõigi platvormi komponentide terviklikkuse ja autentsuse.

## Ülevaade

Steel Shield sisaldab nelja põhilist turvamehhanismi:

| Funktsioon | Otstarve |
|---|---|
| **Binaarne terviklikkus** | Veenduge, et käivitatavaid faile pole muudetud |
| **Sertifikaadi kinnitamine** | Vältige vahemehe rünnakuid API suhtlusel |
| **Manipuleerimise vastus** | Tuvastage ja reageerige volitamata muudatustele |
| **Käituskaitse** | Kaitsege mälu manipuleerimise ja silumise eest |

## Binaarne terviklikkuse kontroll

Iga NetReconi binaarne (sondi taustaprogramm, agendid, teenused) on digitaalselt allkirjastatud. Käivitamisel kontrollib iga komponent oma terviklikkust.

### Kuidas see töötab

1. Ehitamise ajal allkirjastab NetRecon iga binaari privaatvõtmega
2. Allkiri on manustatud binaari metaandmetesse
3. Käivitamisel arvutab binaarne iseendast SHA-256 räsi
4. Räsi kontrollitakse manustatud allkirja vastu
5. Kui kontroll ebaõnnestub, keeldub binaarne käivitumast ja logib hoiatuse

### Käsitsi kontroll

Kontrollige binaari terviklikkust käsitsi:

```bash
# Kontrollige sondi taustaprogrammi
netrecon-verify /usr/local/bin/netrecon-probe

# Kontrollige agenti
netrecon-verify /usr/local/bin/netrecon-agent

# Oodatav väljund:
# Binary: /usr/local/bin/netrecon-probe
# SHA-256: a1b2c3d4e5f6...
# Signature: VALID
# Signed by: NetRecon Build System
# Signed at: 2026-03-15T10:00:00Z
```

### Docker-tõmmise kontroll

Docker-tõmmised allkirjastatakse Docker Content Trust (DCT) abil:

```bash
# Lubage sisu usaldus
export DOCKER_CONTENT_TRUST=1

# Tõmmake allkirja kontrollimisega
docker pull netrecon/api-gateway:latest
```

## Sertifikaadi kinnitamine

Sertifikaadi kinnitamine tagab, et NetReconi komponendid suhtlevad ainult seaduslike serveritega, vältides pealtkuulamist isegi siis, kui sertifitseerimisasutus on kompromiteeritud.

### Kinnitatud ühendused

| Ühendus | Kinnitamise tüüp |
|---|---|
| Agent kuni Probe | Avaliku võtme kinnitamine |
| Admin Connect kuni Probe | Sertifikaadi sõrmejälg |
| Probe kuni Update Server | Avaliku võtme kinnitamine |
| Probe kuni License Server | Sertifikaadi sõrmejälg |

### Kuidas see töötab

1. Oodatava sertifikaadi avaliku võtme räsi on manustatud igasse kliendibinaari
2. TLS-ühenduse loomisel eraldab klient serveri avaliku võtme
3. Klient arvutab avaliku võtme SHA-256 räsi
4. Kui räsi ei vasta kinnitatud väärtusele, lükatakse ühendus tagasi
5. Ebaõnnestunud kinnitamise valideerimine käivitab turvahoiatuse

### Kinnitamise rotatsioon

Sertifikaatide rotatsiooni korral:

1. Uued kinnitused jagatakse uuendusserveri kaudu enne sertifikaadi muutust
2. Nii vanad kui uued kinnitused kehtivad üleminekuperioodi jooksul
3. Pärast üleminekut eemaldatakse vanad kinnitused järgmise uuendusega

Isehallatavate juurutuste jaoks uuendage kinnitusi konfiguratsioonis:

```yaml
# /etc/netrecon/security.yaml
certificate_pins:
  api_gateway:
    - "sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="  # Current
    - "sha256/BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB="  # Backup
```

## Manipuleerimise vastus

Steel Shield jälgib kriitilisi faile ja konfiguratsioone volitamata muudatuste suhtes.

### Jälgitavad elemendid

| Element | Kontrollimissagedus | Vastus |
|---|---|---|
| Binaarfailid | Käivitamisel + iga 1 tunni järel | Hoiatus + valikuline seiskamine |
| Konfiguratsioonifailid | Iga 5 minuti järel | Hoiatus + taastamine varundusest |
| Andmebaasi terviklikkus | Iga 15 minuti järel | Hoiatus + sidusususe kontroll |
| TLS-sertifikaadid | Iga 5 minuti järel | Hoiatus muutmise korral |
| Süsteemipaketid | Igapäevaselt | Hoiatus ootamatute muudatuste korral |

### Vastuse toimingud

Manipuleerimise tuvastamisel saab Steel Shield:

1. **Logida** — salvestada sündmus turvaauditi logisse
2. **Hoiatada** — saata teavitus konfigureeritud kanalite kaudu
3. **Taastada** — taastada manipuleeritud fail teadaolevalt heast varundusest
4. **Isoleerida** — piirata võrgujuurdepääsu ainult haldusele
5. **Seisata** — peatada teenus edasise kompromiteerimise vältimiseks

Konfigureerige vastuse tase:

```yaml
# /etc/netrecon/security.yaml
tamper_response:
  level: "alert_and_revert"  # Options: log, alert, alert_and_revert, isolate, shutdown
  notify_email: "security@yourcompany.com"
```

### Faili terviklikkuse andmebaas

Steel Shield hoiab kõigi kaitstud failide räsiandmebaasi:

```bash
# Initsialiseerige terviklikkuse andmebaas
netrecon-shield init

# Kontrollige terviklikkust käsitsi
netrecon-shield verify

# Oodatav väljund:
# Checked 47 files
# Status: ALL INTACT
# Last verified: 2026-03-15T14:30:00Z
```

## Käituskaitse

### Silumiskaitse

Tootmisrežiimis sisaldavad NetReconi binaarid silumiskaitse meetmeid:
- Lisatud silurite tuvastamine (ptrace Linuxis, IsDebuggerPresent Windowsis)
- Ajastuse kontrollid samm-sammult täitmise jaoks
- Tootmises silumise tuvastamisel väljub protsess graatsiliselt

:::info
Silumiskaitse on arendusversioonides keelatud, et võimaldada tavalisi silumise töövooge.
:::

### Mälukaitse

- Tundlikud andmed (tõendid, võtmed, paroolid) salvestatakse kaitstud mäluregioonidesse
- Mälu nullitakse pärast kasutamist jäägandmete paljastamise vältimiseks
- Linuxis kasutatakse `mlock`'i, et vältida tundlike lehekülgede kettale vahetamist

## Konfiguratsioon

### Steel Shieldi lubamine

Steel Shield on tootmisjuurutustes vaikimisi lubatud. Konfigureerige seda:

```yaml
# /etc/netrecon/security.yaml
steel_shield:
  enabled: true
  binary_integrity: true
  certificate_pinning: true
  tamper_response: true
  runtime_protection: true
  integrity_check_interval: 3600  # seconds
  tamper_check_interval: 300      # seconds
```

### Keelamine arenduse jaoks

Arendus- ja testimiskeskkondade jaoks:

```yaml
steel_shield:
  enabled: false
```

Või keelake konkreetsed funktsioonid:

```yaml
steel_shield:
  enabled: true
  binary_integrity: false   # Skip hash verification during dev
  runtime_protection: false  # Allow debugger attachment
```

## Auditirada

Kõik Steel Shieldi sündmused logitakse turvaauditi logisse:

```bash
# Vaadake hiljutisi turvasündmusi
netrecon-shield audit --last 24h

# Eksportige auditilog
netrecon-shield audit --export csv --output security-audit.csv
```

Auditi logikanded sisaldavad:
- Ajatempel
- Sündmuse tüüp (integrity_check, pin_validation, tamper_detected jne)
- Mõjutatud komponent
- Tulemus (pass/fail)
- Võetud toiming
- Lisaüksikasjad

## Isehalduse kaalutlused

Isehalduse korral pidage meeles:

1. **Kohandatud sertifikaadid**: kui kasutate oma CA-d, uuendage sertifikaadi kinnitamise konfiguratsiooni pärast juurutamist
2. **Binaaride uuendused**: pärast binaaride uuendamist käivitage `netrecon-shield init` terviklikkuse andmebaasi taasehitamiseks
3. **Varundage terviklikkuse andmebaas**: lisage `/etc/netrecon/integrity.db` oma varundusrutiini
4. **Jälgige hoiatusi**: konfigureerige e-posti või veebikonksu teavitused manipuleerimishoiatuste jaoks

## KKK

**K: Kas Steel Shield võib põhjustada valepositiivseid tulemusi?**
V: Valepositiivsed on haruldased, kuid võivad ilmneda pärast süsteemiuuendusi, mis muudavad jagatud teeke. Käivitage `netrecon-shield init` pärast süsteemiuuendusi terviklikkuse andmebaasi värskendamiseks.

**K: Kas Steel Shield mõjutab jõudlust?**
V: Jõudluse mõju on minimaalne. Terviklikkuse kontrollid käivad taustalõimes ja lõpevad tavaliselt alla 1 sekundi.

**K: Kas ma saan Steel Shieldi hoiatusi integreerida oma SIEM-iga?**
V: Jah. Konfigureerige syslog väljund turvakonfiguratsioonis sündmuste edastamiseks teie SIEM-i. Steel Shield toetab syslog (RFC 5424) ja JSON väljundvorminguid.

**K: Kas Steel Shield on tootmisjuurutuste jaoks nõutav?**
V: Steel Shield on tungivalt soovitatav, kuid mitte rangelt nõutav. Saate selle keelata, kuid see eemaldab olulised turvakaitsed.

Lisaabi saamiseks võtke ühendust [support@netreconapp.com](mailto:support@netreconapp.com).
