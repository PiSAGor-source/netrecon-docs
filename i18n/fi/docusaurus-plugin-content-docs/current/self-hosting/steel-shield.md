---
sidebar_position: 3
title: Steel Shield
description: Tietoturvan koventamisominaisuudet itse isannoidyille kayttoonotoille
---

# Steel Shield

Steel Shield on NetReconin tietoturvan koventamiskehys. Se tarjoaa useita suojakerroksia itse isannoidyille kayttoonotoille, varmistaen kaikkien alustakomponenttien eheyden ja aitouden.

## Yleiskatsaus

Steel Shield sisaltaa nelja ydintietoturvamekanismia:

| Ominaisuus | Tarkoitus |
|---|---|
| **Binaarien eheys** | Vahvista, ettei suoritettavia tiedostoja ole peukaloitu |
| **Varmenteen kiinnitys** | Esta man-in-the-middle-hyokkaykset API-viestinnassa |
| **Peukaloinnin tunnistus** | Tunnista ja reagoi luvattomiin muutoksiin |
| **Ajonaikainen suojaus** | Suojaa muistimanipulaatiolta ja virheenkorjaukselta |

## Binaarien eheyden varmennus

Jokainen NetRecon-binaari (mittarin backend, agentit, palvelut) on digitaalisesti allekirjoitettu. Kaynistyksen yhteydessa kukin komponentti varmistaa oman eheytensa.

### Miten se toimii

1. Rakennuksen aikana jokainen binaari allekirjoitetaan NetReconin yksityisella avaimella
2. Allekirjoitus upotetaan binaarin metatietoihin
3. Kaynnistyksen yhteydessa binaari laskee SHA-256-tiivisteen itsestaan
4. Tiiviste varmennetaan upotettua allekirjoitusta vastaan
5. Jos varmennus epaonnistuu, binaari kieltaytyy kaynnistymasta ja kirjaa halytyksen

### Manuaalinen varmennus

Vahvista binaarin eheys manuaalisesti:

```bash
# Vahvista mittarin backend
netrecon-verify /usr/local/bin/netrecon-probe

# Vahvista agentti
netrecon-verify /usr/local/bin/netrecon-agent

# Odotettu tuloste:
# Binary: /usr/local/bin/netrecon-probe
# SHA-256: a1b2c3d4e5f6...
# Signature: VALID
# Signed by: NetRecon Build System
# Signed at: 2026-03-15T10:00:00Z
```

### Docker-levykuvien varmennus

Docker-levykuvat allekirjoitetaan Docker Content Trustin (DCT) avulla:

```bash
# Ota sisallonluottamus kayttoon
export DOCKER_CONTENT_TRUST=1

# Hae allekirjoituksen varmennuksella
docker pull netrecon/api-gateway:latest
```

## Varmenteen kiinnitys

Varmenteen kiinnitys varmistaa, etta NetRecon-komponentit kommunikoivat vain oikeiden palvelimien kanssa, estaan sieppauksen vaikka varmenneviranomainen olisi vaarantunut.

### Kiinnitetyt yhteydet

| Yhteys | Kiinnitystyyppi |
|---|---|
| Agentti mittariin | Julkisen avaimen kiinnitys |
| Admin Connect mittariin | Varmenteen sormenjlki |
| Mittari paivityspalvelimeen | Julkisen avaimen kiinnitys |
| Mittari lisenssipalvelimeen | Varmenteen sormenjlki |

### Miten se toimii

1. Odotetun varmenteen julkisen avaimen tiiviste upotetaan jokaiseen asiakasbinaariin
2. TLS-yhteytta muodostettaessa asiakas poimii palvelimen julkisen avaimen
3. Asiakas laskee julkisen avaimen SHA-256-tiivisteen
4. Jos tiiviste ei vastaa kiinnitetytta arvoa, yhteys hylataaan
5. Epaonnistunut kiinnityksen validointi kaynnistaa tietoturvahalytyksen

### Kiinnityksen kierto

Kun varmenteita kierretaan:

1. Uudet kiinnitykset jaetaan paivityspalvelimen kautta ennen varmenteen vaihtoa
2. Seka vanhat etta uudet kiinnitykset ovat voimassa siirtymakauden ajan
3. Siirtyman jalkeen vanhat kiinnitykset poistetaan seuraavassa paivityksessa

Itse isannoidyissa kayttoonotoissa paivita kiinnitykset konfiguraatiossa:

```yaml
# /etc/netrecon/security.yaml
certificate_pins:
  api_gateway:
    - "sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="  # Nykyinen
    - "sha256/BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB="  # Varalla
```

## Peukaloinnin tunnistus

Steel Shield valvoo kriittisia tiedostoja ja konfiguraatioita luvattomien muutosten varalta.

### Valvotut kohteet

| Kohde | Tarkistustiheys | Toimenpide |
|---|---|---|
| Binaaritiedostot | Kaynnistyksen yhteydessa + tunnin valein | Halytys + valinnainen sammutus |
| Konfiguraatiotiedostot | 5 minuutin valein | Halytys + palautus varmuuskopiosta |
| Tietokannan eheys | 15 minuutin valein | Halytys + johdonmukaisuustarkistus |
| TLS-varmenteet | 5 minuutin valein | Halytys jos muuttunut |
| Jarjestelmapaketit | Paivittain | Halytys odottamattomista muutoksista |

### Toimenpiteet

Kun peukalointia havaitaan, Steel Shield voi:

1. **Kirjata** -- tallentaa tapahtuman tietoturvan auditointilokiin
2. **Halyttaa** -- lahettaa ilmoituksen maaritettya kanavaa pitkin
3. **Palauttaa** -- palauttaa peukaloitu tiedosto tunnetusta hyvasta varmuuskopiosta
4. **Eristaa** -- rajoittaa verkkopaasyn vain hallintaan
5. **Sammuttaa** -- pysayttaa palvelun lisavaarantumisen estamiseksi

Maarita toimenpidetaso:

```yaml
# /etc/netrecon/security.yaml
tamper_response:
  level: "alert_and_revert"  # Vaihtoehdot: log, alert, alert_and_revert, isolate, shutdown
  notify_email: "tietoturva@yrityksesi.com"
```

### Tiedostojen eheystietokanta

Steel Shield yllapitaa tiivistetietokantaa kaikista suojatuista tiedostoista:

```bash
# Alusta eheystietokanta
netrecon-shield init

# Tarkista eheys manuaalisesti
netrecon-shield verify

# Odotettu tuloste:
# Checked 47 files
# Status: ALL INTACT
# Last verified: 2026-03-15T14:30:00Z
```

## Ajonaikainen suojaus

### Virheenkorjauksen esto

Tuotantotilassa NetRecon-binaarit sisaltavat virheenkorjauksen estotoimenpiteita:
- Kiinnitettyjen virheenkorjaajien tunnistus (ptrace Linuxissa, IsDebuggerPresent Windowsissa)
- Ajastustarkistukset askelluksen havaitsemiseksi
- Kun virheenkorjaus havaitaan tuotannossa, prosessi paattyy hallitusti

:::info
Virheenkorjauksen esto on poistettu kaytosta kehitysversiossa normaalin virheenkorjauksen mahdollistamiseksi.
:::

### Muistisuojaus

- Arkaluonteinen data (tokenit, avaimet, salasanat) sailytetaan suojatuilla muistialueilla
- Muisti nollataan kayton jalkeen tietojaamien estamiseksi
- Linuxissa `mlock`-kutsua kaytetaan estamaan arkaluonteisten sivujen vaihtaminen levylle

## Konfiguraatio

### Steel Shieldin kayttoonotto

Steel Shield on oletuksena kaytossa tuotantokayttoonotoissa. Maarita se tiedostossa:

```yaml
# /etc/netrecon/security.yaml
steel_shield:
  enabled: true
  binary_integrity: true
  certificate_pinning: true
  tamper_response: true
  runtime_protection: true
  integrity_check_interval: 3600  # sekuntia
  tamper_check_interval: 300      # sekuntia
```

### Poista kaytosta kehitysymparistossa

Kehitys- ja testausymparistoissa:

```yaml
steel_shield:
  enabled: false
```

Tai poista yksittaiset ominaisuudet kaytosta:

```yaml
steel_shield:
  enabled: true
  binary_integrity: false   # Ohita tiivistevarmennus kehityksessa
  runtime_protection: false  # Salli virheenkorjaajan liittaminen
```

## Auditointipolku

Kaikki Steel Shield -tapahtumat kirjataan tietoturvan auditointilokiin:

```bash
# Nayta viimeaikaiset tietoturvatapahtumat
netrecon-shield audit --last 24h

# Vie auditointiloki
netrecon-shield audit --export csv --output security-audit.csv
```

Auditointilokin merkinnaat sisaltavat:
- Aikaleima
- Tapahtumatyyppi (integrity_check, pin_validation, tamper_detected jne.)
- Vaikutettu komponentti
- Tulos (hyvaksytty/hylatty)
- Suoritettu toimenpide
- Lisatiedot

## Itse isannoinnin huomiot

Itse isannoitaessa pidaa mielessaa:

1. **Mukautetut varmenteet**: Jos kaytat omaa CA:ta, paivita varmenteen kiinnityskonfiguraatio kayttoonoton jalkeen
2. **Binaarien paivitykset**: Binaarien paivittamisen jalkeen suorita `netrecon-shield init` eheystietokannan uudelleenrakentamiseksi
3. **Varmuuskopioi eheystietokanta**: Sisallyta `/etc/netrecon/integrity.db` varmuuskopiointirutiiniisi
4. **Valvo halytyksia**: Maarita sahkoposti- tai webhook-ilmoitukset peukaloinnin halytyksille

## UKK

**K: Voiko Steel Shield aiheuttaa vaaria halytyksia?**
V: Vaarat halytykset ovat harvinaisia, mutta niita voi esiintya jarjestelmapaivitysten jalkeen, jotka muuttavat jaettuja kirjastoja. Suorita `netrecon-shield init` jarjestelmapaivitysten jalkeen eheystietokannan virkistamiseksi.

**K: Vaikuttaako Steel Shield suorituskykyyn?**
V: Suorituskykyvaikutus on minimaalinen. Eheystarkistukset suoritetaan taustasaikkeessa ja valmistuvat tyypillisesti alle 1 sekunnissa.

**K: Voinko integroida Steel Shield -halytykset SIEM-jarjestelmaani?**
V: Kylla. Maarita syslog-tuloste tietoturvakonfiguraatiossa tapahtumien valittamiseksi SIEM-jarjestelmaasi. Steel Shield tukee syslog (RFC 5424)- ja JSON-tulostemuotoja.

**K: Onko Steel Shield pakollinen tuotantokayttoonotoille?**
V: Steel Shieldia suositellaan vahvasti, mutta se ei ole ehdottomasti pakollinen. Voit poistaa sen kaytosta, mutta se poistaa tarkeita tietoturvasuojauksia.

Lisaavun saamiseksi ota yhteytta osoitteeseen [support@netreconapp.com](mailto:support@netreconapp.com).
