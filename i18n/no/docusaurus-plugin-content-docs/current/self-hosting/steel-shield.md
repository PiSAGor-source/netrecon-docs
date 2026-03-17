---
sidebar_position: 3
title: Steel Shield
description: Sikkerhetsherding for selvhostede distribusjoner
---

# Steel Shield

Steel Shield er NetRecons rammeverk for sikkerhetsherding. Det gir flere lag med beskyttelse for selvhostede distribusjoner, og sikrer integriteten og autentisiteten til alle plattformkomponenter.

## Oversikt

Steel Shield inkluderer fire kjernemekanismer for sikkerhet:

| Funksjon | Formal |
|---|---|
| **Binarintegritet** | Bekreft at kjorbare filer ikke er manipulert |
| **Sertifikatfesting** | Forhindre man-in-the-middle-angrep pa API-kommunikasjon |
| **Manipuleringsrespons** | Oppdage og reagere pa uautoriserte endringer |
| **Kjortidsbeskyttelse** | Beskytte mot minnemanipulering og feilsoking |

## Verifisering av binarintegritet

Hver NetRecon-binarfil (probe-backend, agenter, tjenester) er digitalt signert. Ved oppstart verifiserer hver komponent sin egen integritet.

### Hvordan det fungerer

1. Under bygging signeres hver binarfil med en privat nokkel holdt av NetRecon
2. Signaturen er innebygd i binarfilens metadata
3. Ved oppstart beregner binarfilen en SHA-256-hash av seg selv
4. Hashen verifiseres mot den innebygde signaturen
5. Hvis verifiseringen mislykkes, nekter binarfilen a starte og logger en alarm

### Manuell verifisering

Verifiser en binarfils integritet manuelt:

```bash
# Verifiser probe-backend
netrecon-verify /usr/local/bin/netrecon-probe

# Verifiser en agent
netrecon-verify /usr/local/bin/netrecon-agent

# Forventet utdata:
# Binary: /usr/local/bin/netrecon-probe
# SHA-256: a1b2c3d4e5f6...
# Signature: VALID
# Signed by: NetRecon Build System
# Signed at: 2026-03-15T10:00:00Z
```

### Verifisering av Docker-bilder

Docker-bilder signeres med Docker Content Trust (DCT):

```bash
# Aktiver innholdstillit
export DOCKER_CONTENT_TRUST=1

# Hent med signaturverifisering
docker pull netrecon/api-gateway:latest
```

## Sertifikatfesting

Sertifikatfesting sikrer at NetRecon-komponenter kun kommuniserer med legitime servere, og forhindrer avlytting selv om en sertifikatmyndighet er kompromittert.

### Festede tilkoblinger

| Tilkobling | Type festing |
|---|---|
| Agent til probe | Offentlig nokkelfesting |
| Admin Connect til probe | Sertifikatfingeravtrykk |
| Probe til oppdateringsserver | Offentlig nokkelfesting |
| Probe til lisensserver | Sertifikatfingeravtrykk |

### Hvordan det fungerer

1. Den forventede hash-verdien for sertifikatets offentlige nokkel er innebygd i hver klient-binarfil
2. Nar en TLS-tilkobling opprettes, trekker klienten ut serverens offentlige nokkel
3. Klienten beregner en SHA-256-hash av den offentlige nokkelen
4. Hvis hashen ikke samsvarer med den festede verdien, avvises tilkoblingen
5. Mislykket festing utloser en sikkerhetsalarm

### Rotasjon av festing

Nar sertifikater roteres:

1. Nye festede verdier distribueres via oppdateringsserveren for sertifikatendringen
2. Bade gamle og nye festede verdier er gyldige i overgangsperioden
3. Etter overgangen fjernes gamle festede verdier i neste oppdatering

For selvhostede distribusjoner, oppdater festede verdier i konfigurasjonen:

```yaml
# /etc/netrecon/security.yaml
certificate_pins:
  api_gateway:
    - "sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="  # Gjeldende
    - "sha256/BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB="  # Reserve
```

## Manipuleringsrespons

Steel Shield overvaker kritiske filer og konfigurasjoner for uautoriserte endringer.

### Overvakede elementer

| Element | Kontrollfrekvens | Respons |
|---|---|---|
| Binarfiler | Ved oppstart + hver time | Alarm + valgfri nedstengning |
| Konfigurasjonsfiler | Hvert 5. minutt | Alarm + tilbakestilling til sikkerhetskopi |
| Databaseintegritet | Hvert 15. minutt | Alarm + konsistenssjekk |
| TLS-sertifikater | Hvert 5. minutt | Alarm ved endring |
| Systempakker | Daglig | Alarm ved uventede endringer |

### Responshandlinger

Nar manipulering oppdages, kan Steel Shield:

1. **Logge** -- registrere hendelsen i sikkerhetsrevisjonsloggen
2. **Varsle** -- sende et varsel via konfigurerte kanaler
3. **Tilbakestille** -- gjenopprette den manipulerte filen fra en kjent god sikkerhetskopi
4. **Isolere** -- begrense nettverkstilgang til kun administrasjon
5. **Stenge ned** -- stoppe tjenesten for a forhindre videre kompromittering

Konfigurer responsniva:

```yaml
# /etc/netrecon/security.yaml
tamper_response:
  level: "alert_and_revert"  # Alternativer: log, alert, alert_and_revert, isolate, shutdown
  notify_email: "security@yourcompany.com"
```

### Filintegritetsdatabase

Steel Shield opprettholder en hash-database over alle beskyttede filer:

```bash
# Initialiser integritetsdatabasen
netrecon-shield init

# Sjekk integritet manuelt
netrecon-shield verify

# Forventet utdata:
# Checked 47 files
# Status: ALL INTACT
# Last verified: 2026-03-15T14:30:00Z
```

## Kjortidsbeskyttelse

### Anti-feilsoking

I produksjonsmodus inkluderer NetRecon-binarfiler anti-feilsokingstiltak:
- Oppdagelse av tilkoblede feilsokere (ptrace pa Linux, IsDebuggerPresent pa Windows)
- Tidssjekker for trinnvis kjoring
- Nar feilsoking oppdages i produksjon, avslutter prosessen pa en kontrollert mate

:::info
Anti-feilsoking er deaktivert i utviklingsbygg for a tillate normal feilsokingsarbeidsflyt.
:::

### Minnebeskyttelse

- Sensitive data (tokener, nokler, passord) lagres i beskyttede minneomrader
- Minne nullstilles etter bruk for a forhindre gjenvarende dataeksponering
- Pa Linux brukes `mlock` for a forhindre at sensitive sider skrives til disk

## Konfigurasjon

### Aktiver Steel Shield

Steel Shield er aktivert som standard i produksjonsdistribusjoner. Konfigurer det i:

```yaml
# /etc/netrecon/security.yaml
steel_shield:
  enabled: true
  binary_integrity: true
  certificate_pinning: true
  tamper_response: true
  runtime_protection: true
  integrity_check_interval: 3600  # sekunder
  tamper_check_interval: 300      # sekunder
```

### Deaktiver for utvikling

For utviklings- og testmiljoer:

```yaml
steel_shield:
  enabled: false
```

Eller deaktiver spesifikke funksjoner:

```yaml
steel_shield:
  enabled: true
  binary_integrity: false   # Hopp over hash-verifisering under utvikling
  runtime_protection: false  # Tillat feilsokertilkobling
```

## Revisjonsspor

Alle Steel Shield-hendelser logges i sikkerhetsrevisjonsloggen:

```bash
# Vis nylige sikkerhetshendelser
netrecon-shield audit --last 24h

# Eksporter revisjonslogg
netrecon-shield audit --export csv --output security-audit.csv
```

Revisjonsloggoppforinger inkluderer:
- Tidsstempel
- Hendelsestype (integrity_check, pin_validation, tamper_detected, osv.)
- Berutt komponent
- Resultat (bestatt/ikke bestatt)
- Handling utfort
- Ytterligere detaljer

## Hensyn for selvhosting

Nar du selvhoster, ha folgende i bakhodet:

1. **Tilpassede sertifikater**: Hvis du bruker din egen CA, oppdater konfigurasjonen for sertifikatfesting etter distribusjon
2. **Binaroppdateringer**: Etter oppdatering av binarfiler, kjor `netrecon-shield init` for a gjenoppbygge integritetsdatabasen
3. **Sikkerhetskopier integritetsdatabasen**: Inkluder `/etc/netrecon/integrity.db` i sikkerhetskopirutinen din
4. **Overvaak alarmer**: Konfigurer e-post- eller webhook-varsler for manipuleringsalarmer

## Vanlige sporsmal

**Sp: Kan Steel Shield foarsake falske positiver?**
Sv: Falske positiver er sjeldne, men kan oppsta etter systemoppdateringer som endrer delte biblioteker. Kjor `netrecon-shield init` etter systemoppdateringer for a oppdatere integritetsdatabasen.

**Sp: Pavirker Steel Shield ytelsen?**
Sv: Ytelsespavirkningen er minimal. Integritetssjekker kjorer i en bakgrunnstrad og fullfores vanligvis pa under 1 sekund.

**Sp: Kan jeg integrere Steel Shield-alarmer med min SIEM?**
Sv: Ja. Konfigurer syslog-utdata i sikkerhetskonfigurasjonen for a videresende hendelser til din SIEM. Steel Shield stotter syslog (RFC 5424) og JSON-utdataformater.

**Sp: Er Steel Shield pakrevd for produksjonsdistribusjoner?**
Sv: Steel Shield anbefales sterkt, men er ikke strengt pakrevd. Du kan deaktivere det, men det fjerner viktige sikkerhetsbeskyttelser.

For ytterligere hjelp, kontakt [support@netreconapp.com](mailto:support@netreconapp.com).
