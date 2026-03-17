---
sidebar_position: 3
title: Steel Shield
description: Beveiligingsversterkingsfuncties voor self-hosted implementaties
---

# Steel Shield

Steel Shield is het beveiligingsversterkingsraamwerk van NetRecon. Het biedt meerdere beschermingslagen voor self-hosted implementaties en waarborgt de integriteit en authenticiteit van alle platformonderdelen.

## Overzicht

Steel Shield omvat vier kernbeveiligingsmechanismen:

| Functie | Doel |
|---|---|
| **Binary-integriteit** | Verifieer dat uitvoerbare bestanden niet zijn gemanipuleerd |
| **Certificate pinning** | Voorkom man-in-the-middle-aanvallen op API-communicatie |
| **Manipulatierespons** | Detecteer en reageer op ongeautoriseerde wijzigingen |
| **Runtime-bescherming** | Bescherming tegen geheugenmanipulatie en debugging |

## Binary-integriteitsverificatie

Elke NetRecon-binary (probe-backend, agents, services) is digitaal ondertekend. Bij het opstarten verifieert elk onderdeel zijn eigen integriteit.

### Hoe het werkt

1. Tijdens het bouwen wordt elke binary ondertekend met een privesleutel van NetRecon
2. De handtekening wordt ingebed in de metadata van de binary
3. Bij het opstarten berekent de binary een SHA-256-hash van zichzelf
4. De hash wordt geverifieerd aan de hand van de ingebedde handtekening
5. Als verificatie mislukt, weigert de binary te starten en wordt een waarschuwing gelogd

### Handmatige verificatie

Verifieer de integriteit van een binary handmatig:

```bash
# Verifieer de probe-backend
netrecon-verify /usr/local/bin/netrecon-probe

# Verifieer een agent
netrecon-verify /usr/local/bin/netrecon-agent

# Verwachte uitvoer:
# Binary: /usr/local/bin/netrecon-probe
# SHA-256: a1b2c3d4e5f6...
# Signature: VALID
# Signed by: NetRecon Build System
# Signed at: 2026-03-15T10:00:00Z
```

### Docker-imageverificatie

Docker-images worden ondertekend met Docker Content Trust (DCT):

```bash
# Content trust inschakelen
export DOCKER_CONTENT_TRUST=1

# Ophalen met handtekeningverificatie
docker pull netrecon/api-gateway:latest
```

## Certificate pinning

Certificate pinning zorgt ervoor dat NetRecon-onderdelen alleen communiceren met legitieme servers, waardoor onderschepping wordt voorkomen zelfs als een certificaatautoriteit is gecompromitteerd.

### Vastgezette verbindingen

| Verbinding | Type pinning |
|---|---|
| Agent naar Probe | Publieke-sleutelpin |
| Admin Connect naar Probe | Certificaatvingerafdruk |
| Probe naar Update Server | Publieke-sleutelpin |
| Probe naar License Server | Certificaatvingerafdruk |

### Hoe het werkt

1. De verwachte publieke-sleutelhash van het certificaat is ingebed in elke client-binary
2. Bij het opzetten van een TLS-verbinding extraheert de client de publieke sleutel van de server
3. De client berekent een SHA-256-hash van de publieke sleutel
4. Als de hash niet overeenkomt met de vastgezette waarde, wordt de verbinding geweigerd
5. Mislukte pinvalidatie activeert een beveiligingswaarschuwing

### Pinrotatie

Bij het roteren van certificaten:

1. Nieuwe pins worden gedistribueerd via de updateserver voordat het certificaat wordt gewijzigd
2. Zowel oude als nieuwe pins zijn geldig tijdens de overgangsperiode
3. Na de overgang worden oude pins verwijderd in de volgende update

Voor self-hosted implementaties werkt u de pins bij in de configuratie:

```yaml
# /etc/netrecon/security.yaml
certificate_pins:
  api_gateway:
    - "sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="  # Huidig
    - "sha256/BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB="  # Back-up
```

## Manipulatierespons

Steel Shield bewaakt kritieke bestanden en configuraties op ongeautoriseerde wijzigingen.

### Bewaakte items

| Item | Controlefrequentie | Respons |
|---|---|---|
| Binary-bestanden | Bij opstarten + elk uur | Waarschuwing + optionele afsluiting |
| Configuratiebestanden | Elke 5 minuten | Waarschuwing + terugzetten naar back-up |
| Database-integriteit | Elke 15 minuten | Waarschuwing + consistentiecontrole |
| TLS-certificaten | Elke 5 minuten | Waarschuwing bij wijziging |
| Systeempakketten | Dagelijks | Waarschuwing bij onverwachte wijzigingen |

### Responsacties

Wanneer manipulatie wordt gedetecteerd, kan Steel Shield:

1. **Loggen** — de gebeurtenis vastleggen in het beveiligingsauditlogboek
2. **Waarschuwen** — een melding verzenden via geconfigureerde kanalen
3. **Terugzetten** — het gemanipuleerde bestand herstellen vanuit een bekende goede back-up
4. **Isoleren** — netwerktoegang beperken tot alleen beheer
5. **Afsluiten** — de service stoppen om verdere compromittering te voorkomen

Configureer het responsniveau:

```yaml
# /etc/netrecon/security.yaml
tamper_response:
  level: "alert_and_revert"  # Opties: log, alert, alert_and_revert, isolate, shutdown
  notify_email: "beveiliging@uwbedrijf.com"
```

### Bestandsintegriteitsdatabase

Steel Shield onderhoudt een hashdatabase van alle beschermde bestanden:

```bash
# Integriteitsdatabase initialiseren
netrecon-shield init

# Integriteit handmatig controleren
netrecon-shield verify

# Verwachte uitvoer:
# Checked 47 files
# Status: ALL INTACT
# Last verified: 2026-03-15T14:30:00Z
```

## Runtime-bescherming

### Anti-debugging

In productiemodus bevatten NetRecon-binaries anti-debuggingsmaatregelen:
- Detectie van aangesloten debuggers (ptrace op Linux, IsDebuggerPresent op Windows)
- Timingcontroles voor stap-voor-stap uitvoering
- Wanneer debugging wordt gedetecteerd in productie, stopt het proces netjes

:::info
Anti-debugging is uitgeschakeld in ontwikkelingsbuilds om normale debuggingworkflows mogelijk te maken.
:::

### Geheugenbescherming

- Gevoelige gegevens (tokens, sleutels, wachtwoorden) worden opgeslagen in beschermde geheugengebieden
- Geheugen wordt gewist na gebruik om restgegevensblootstelling te voorkomen
- Op Linux wordt `mlock` gebruikt om te voorkomen dat gevoelige pagina's naar schijf worden geswapped

## Configuratie

### Steel Shield inschakelen

Steel Shield is standaard ingeschakeld in productie-implementaties. Configureer het in:

```yaml
# /etc/netrecon/security.yaml
steel_shield:
  enabled: true
  binary_integrity: true
  certificate_pinning: true
  tamper_response: true
  runtime_protection: true
  integrity_check_interval: 3600  # seconden
  tamper_check_interval: 300      # seconden
```

### Uitschakelen voor ontwikkeling

Voor ontwikkel- en testomgevingen:

```yaml
steel_shield:
  enabled: false
```

Of schakel specifieke functies uit:

```yaml
steel_shield:
  enabled: true
  binary_integrity: false   # Hashverificatie overslaan tijdens ontwikkeling
  runtime_protection: false  # Debugger-aansluiting toestaan
```

## Audittrail

Alle Steel Shield-gebeurtenissen worden gelogd in het beveiligingsauditlogboek:

```bash
# Recente beveiligingsgebeurtenissen bekijken
netrecon-shield audit --last 24h

# Auditlogboek exporteren
netrecon-shield audit --export csv --output security-audit.csv
```

Auditlogboekentries bevatten:
- Tijdstempel
- Gebeurtenistype (integrity_check, pin_validation, tamper_detected, enz.)
- Betreffend onderdeel
- Resultaat (geslaagd/mislukt)
- Ondernomen actie
- Aanvullende details

## Overwegingen voor self-hosting

Houd bij self-hosting het volgende in gedachten:

1. **Aangepaste certificaten**: Als u uw eigen CA gebruikt, werk dan de certificate pin-configuratie bij na implementatie
2. **Binary-updates**: Na het bijwerken van binaries, voer `netrecon-shield init` uit om de integriteitsdatabase opnieuw op te bouwen
3. **Back-up van de integriteitsdatabase**: Neem `/etc/netrecon/integrity.db` op in uw back-uproutine
4. **Monitor waarschuwingen**: Configureer e-mail- of webhookmeldingen voor manipulatiewaarschuwingen

## Veelgestelde vragen

**V: Kan Steel Shield valspositieven veroorzaken?**
A: Valspositieven zijn zeldzaam maar kunnen optreden na systeemupdates die gedeelde bibliotheken wijzigen. Voer `netrecon-shield init` uit na systeemupdates om de integriteitsdatabase te vernieuwen.

**V: Beïnvloedt Steel Shield de prestaties?**
A: De prestatie-impact is minimaal. Integriteitscontroles draaien in een achtergrondthread en zijn doorgaans in minder dan 1 seconde voltooid.

**V: Kan ik Steel Shield-waarschuwingen integreren met mijn SIEM?**
A: Ja. Configureer syslog-uitvoer in de beveiligingsconfiguratie om gebeurtenissen door te sturen naar uw SIEM. Steel Shield ondersteunt syslog (RFC 5424) en JSON-uitvoerformaten.

**V: Is Steel Shield vereist voor productie-implementaties?**
A: Steel Shield wordt sterk aanbevolen maar is niet strikt vereist. U kunt het uitschakelen, maar daarmee verwijdert u belangrijke beveiligingsbeschermingen.

Voor aanvullende hulp kunt u contact opnemen met [support@netreconapp.com](mailto:support@netreconapp.com).
