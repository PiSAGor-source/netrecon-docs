---
sidebar_position: 3
title: Steel Shield
description: Biztonsagi megeositesi funkciok sajat szerveres telepitesekhez
---

# Steel Shield

A Steel Shield a NetRecon biztonsagi megeositesi keretrendszere. Tobbretegu vedelmet biztosit sajat szerveres telepitesekhez, biztositva az osszes platform-osszetevo integritasat es hitelesseget.

## Attekintes

A Steel Shield negy alapveto biztonsagi mechanizmust tartalmaz:

| Funkcio | Cel |
|---|---|
| **Binarist integritacs** | Ellenorzi, hogy a futtathato fajlok nem lettek modositva |
| **Tanusitvany rogzites** | Megakadalyozza a kozbeekelo tamadasokat az API kommunikacion |
| **Modositas-valasz** | Eszleli es reagal az engedelyt nelkuli modositasokra |
| **Futasideju vedelem** | Vedi a memoriamaniplaciot es a hibakeresest |

## Binarist integritasellenorzes

Minden NetRecon binaris (szonda backend, agensek, szolgaltatasok) digitalisan alairt. Inditaskor minden osszetevo ellenorzi sajat integritasat.

### Mukodese

1. Az epitesi folyamat soran minden binaris ala van irva a NetRecon altal orzott privat kulccsal
2. Az alairas be van agyazva a binaris metaadataiba
3. Inditaskor a binaris kiszamitja sajat SHA-256 hash-et
4. A hash-t ellenorzi a beagyazott alairassal szemben
5. Ha az ellenorzes sikertelen, a binaris nem indul el es riasztast naploz

### Manualis ellenorzes

Binaris integritasanak manualis ellenorzese:

```bash
# Szonda backend ellenorzese
netrecon-verify /usr/local/bin/netrecon-probe

# Agenst ellenorzese
netrecon-verify /usr/local/bin/netrecon-agent

# Vart kimenet:
# Binary: /usr/local/bin/netrecon-probe
# SHA-256: a1b2c3d4e5f6...
# Signature: VALID
# Signed by: NetRecon Build System
# Signed at: 2026-03-15T10:00:00Z
```

### Docker kepfajl ellenorzes

A Docker kepfajlok Docker Content Trust (DCT) segitsegevel vannak alairva:

```bash
# Tartalombizalom engedelyezese
export DOCKER_CONTENT_TRUST=1

# Letoltes alairast ellenorzessel
docker pull netrecon/api-gateway:latest
```

## Tanusitvany rogzites

A tanusitvany rogzites biztositja, hogy a NetRecon osszetevok csak legitim szerverekkel kommunikaljanak, megakadalyozva az elfogast meg akkor is, ha egy tanusitvanyhatosag kompromittalt.

### Rogzitett kapcsolatok

| Kapcsolat | Rogzites tipusa |
|---|---|
| Agenst - Szonda | Nyilvanos kulcs rogzites |
| Admin Connect - Szonda | Tanusitvany ujjlenyomat |
| Szonda - Frissitesi szerver | Nyilvanos kulcs rogzites |
| Szonda - Licencszerver | Tanusitvany ujjlenyomat |

### Mukodese

1. A vart tanusitvany nyilvanos kulcs hash-e be van agyazva minden kliens binarisba
2. TLS kapcsolat letesitesekor a kliens kivonja a szerver nyilvanos kulcsat
3. A kliens kiszamitja a nyilvanos kulcs SHA-256 hash-et
4. Ha a hash nem egyezik a rogzitett ertekkel, a kapcsolat elutasitasra kerul
5. A sikertelen rogzites-ellenorzes biztonsagi riasztast valt ki

### Rogzites rotacio

Tanusitvanyok rotaciojakor:

1. Az uj rogzitesek a frissitesi szerveren keresztul kerulnek terjesztesre a tanusitvanyvaltas elott
2. Az atmeneti idoszakban mind a regi, mind az uj rogzitesek ervenyesek
3. Az atmenet utan a regi rogzitesek a kovetkezo frissitesben kerulnek eltavolitasra

Sajat szerveres telepiteseknel frissitse a rogziteseket a konfiguracioban:

```yaml
# /etc/netrecon/security.yaml
certificate_pins:
  api_gateway:
    - "sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="  # Aktualis
    - "sha256/BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB="  # Tartalek
```

## Modositas-valasz

A Steel Shield figyeli a kritikus fajlokat es konfiguraciokat az engedelyt nelkuli valtozasok szempontjabol.

### Figyelt elemek

| Elem | Ellenorzes gyakorisaga | Valasz |
|---|---|---|
| Binaris fajlok | Inditaskor + oranktent | Riasztas + opcionalis leallitas |
| Konfiguracios fajlok | 5 percenktent | Riasztas + visszaallitas mentesbol |
| Adatbazis integritacs | 15 percenktent | Riasztas + konzisztenciaellenorzes |
| TLS tanusitvanyok | 5 percenktent | Riasztas valtozas eseten |
| Rendszercsomagok | Naponta | Riasztas varatlan valtozasokra |

### Valasz-muveletek

Modositas eszlelesekor a Steel Shield a kovetkezoket teheti:

1. **Naplozas** — az esemeny rogzitese a biztonsagi audit naploba
2. **Riasztas** — ertesites kuldese a konfiguralt csatornakon keresztul
3. **Visszaallitas** — a modositott fajl visszaallitasa ismert jo mentesbol
4. **Izolcio** — halozati hozzaferes korlatozasa csak kezelesi celra
5. **Leallitas** — a szolgaltatas leallitasa a tovabbi kompromittalas megakadalyozasara

Valasz szint konfiguralasa:

```yaml
# /etc/netrecon/security.yaml
tamper_response:
  level: "alert_and_revert"  # Lehetosegek: log, alert, alert_and_revert, isolate, shutdown
  notify_email: "security@yourcompany.com"
```

### Fajlintegritasi adatbazis

A Steel Shield hash adatbazist tart fenn az osszes vedett fajlrol:

```bash
# Integritasi adatbazis inicializalasa
netrecon-shield init

# Integritas manualis ellenorzese
netrecon-shield verify

# Vart kimenet:
# Checked 47 files
# Status: ALL INTACT
# Last verified: 2026-03-15T14:30:00Z
```

## Futasideju vedelem

### Hibakereso-vedelem

Produkcios modban a NetRecon binarisok hibakereso-vedelmi intezkedeseket tartalmaznak:
- Csatolt hibakeresok eszlelese (ptrace Linuxon, IsDebuggerPresent Windowson)
- Idozitesi ellenorzesek az egylepesu vegrehajtashoz
- Produkcios hibakereseees eszlelesekor a folyamat szabalyosan leall

:::info
A hibakereso-vedelem fejlesztoi buildekben le van tiltva a normalis hibakeresesi munkafolyamatok lehetove tetelere.
:::

### Memoriavdelem

- Az erzekeny adatok (tokenek, kulcsok, jelszavak) vedett memoriateruleten kerulnek tarolasra
- A memoria hasznalat utan nullazodik az adatmaradek kitettsegenek megakadalyozasara
- Linuxon az `mlock` megakadalyozza az erzekeny lapok lemezre valo swappeleseert

## Konfigurcio

### Steel Shield engedelyezese

A Steel Shield alapertelmezetten engedelyezve van produkcios telepitesekben. Konfiguralas:

```yaml
# /etc/netrecon/security.yaml
steel_shield:
  enabled: true
  binary_integrity: true
  certificate_pinning: true
  tamper_response: true
  runtime_protection: true
  integrity_check_interval: 3600  # masodperc
  tamper_check_interval: 300      # masodperc
```

### Letiltas fejleszteshez

Fejlesztesi es tesztelesi kornyezetekhez:

```yaml
steel_shield:
  enabled: false
```

Vagy egyes funkciok letiltasa:

```yaml
steel_shield:
  enabled: true
  binary_integrity: false   # Hash ellenorzes kihagyasa fejleszteskor
  runtime_protection: false  # Hibakereso csatolasanak engedelyezese
```

## Audit nyom

Az osszes Steel Shield esemeny naplozva van a biztonsagi audit naploba:

```bash
# Legutobb biztonsagi esemenyek megtekintese
netrecon-shield audit --last 24h

# Audit naplo exportalasa
netrecon-shield audit --export csv --output security-audit.csv
```

Az audit naplo bejegyzesek tartalmazzak:
- Idobelyeg
- Esemeny tipusa (integrity_check, pin_validation, tamper_detected stb.)
- Erintett osszetevo
- Eredmeny (sikeres/sikertelen)
- Vegzett muvelet
- Tovabbi reszletek

## Sajat szerveres szempontok

Sajat szerveres uzemeltetes eseten vegye figyelembe a kovetkezoket:

1. **Egyedi tanusitvanyok**: Ha sajat CA-t hasznal, frissitse a tanusitvany rogzitesi konfiguraciott a telepites utan
2. **Binaris frissitesek**: Binarisok frissitese utan futtassa a `netrecon-shield init` parancsot az integritasi adatbazis ujraepitesehez
3. **Integritasi adatbazis mentese**: Az `/etc/netrecon/integrity.db` fajlt foglalja bele a mentesi rutinjaba
4. **Riasztasok monitorozasa**: Allitson be e-mail vagy webhook ertesiteseket a modositasi riasztasokhoz

## GYIK

**K: A Steel Shield okozhat hamis riasztasokat?**
V: A hamis riasztasok ritkak, de elofordulhatnak rendszerfrissitesek utan, amelyek megosztott konyvtarakat modositanak. Futtassa a `netrecon-shield init` parancsot rendszerfrissitesek utan az integritasi adatbazis frissitesehez.

**K: A Steel Shield befolyasolja a teljesitmenyt?**
V: A teljesitmenyre gyakorolt hatas minimalis. Az integritasellenorzesek hatter szalban futnak es jellemzoen 1 masodperc alatt befejezodnek.

**K: Integralhatomet a Steel Shield riasztasait a SIEM-emmel?**
V: Igen. Allitsa be a syslog kimenetet a biztonsagi konfiguracioban az esemenyek SIEM-je fele torteno tovabbitasahoz. A Steel Shield tamogatja a syslog (RFC 5424) es JSON kimeneti formatomokat.

**K: Kotelezo a Steel Shield produkcios telepitesekhez?**
V: A Steel Shield erosen ajanlott, de nem szigoruan kotelezo. Letilthatja, de ezzel fontos biztonsagi vedelmeket tavolt el.

Segitsegert forduljon a [support@netreconapp.com](mailto:support@netreconapp.com) cimhez.
