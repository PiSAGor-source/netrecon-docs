---
sidebar_position: 3
title: Steel Shield
description: Sikkerhedshærdningsfunktioner til self-hosted-implementeringer
---

# Steel Shield

Steel Shield er NetRecons sikkerhedshærdningsframework. Det giver flere lag af beskyttelse til self-hosted-implementeringer og sikrer integriteten og ægtheden af alle platformkomponenter.

## Oversigt

Steel Shield inkluderer fire kernesikkerhedsmekanismer:

| Funktion | Formål |
|---|---|
| **Binær integritet** | Verificer at eksekverbare filer ikke er blevet manipuleret |
| **Certifikatfastgøring** | Forebyg man-in-the-middle-angreb på API-kommunikation |
| **Manipulationsrespons** | Registrer og reager på uautoriserede ændringer |
| **Kørselsbeskyttelse** | Beskyt mod hukommelsesmanipulation og debugging |

## Verificering af binær integritet

Hver NetRecon-binær fil (probe-backend, agenter, tjenester) er digitalt signeret. Ved opstart verificerer hver komponent sin egen integritet.

### Sådan fungerer det

1. Under bygning signeres hver binær fil med en privat nøgle, som NetRecon opbevarer
2. Signaturen indlejres i den binære fils metadata
3. Ved opstart beregner den binære fil en SHA-256-hash af sig selv
4. Hashen verificeres mod den indlejrede signatur
5. Hvis verificeringen fejler, nægter den binære fil at starte og logger en alarm

### Manuel verificering

Verificer en binær fils integritet manuelt:

```bash
# Verificer probe-backend
netrecon-verify /usr/local/bin/netrecon-probe

# Verificer en agent
netrecon-verify /usr/local/bin/netrecon-agent

# Forventet output:
# Binary: /usr/local/bin/netrecon-probe
# SHA-256: a1b2c3d4e5f6...
# Signature: VALID
# Signed by: NetRecon Build System
# Signed at: 2026-03-15T10:00:00Z
```

### Docker image-verificering

Docker-images signeres med Docker Content Trust (DCT):

```bash
# Aktiver content trust
export DOCKER_CONTENT_TRUST=1

# Hent med signaturverificering
docker pull netrecon/api-gateway:latest
```

## Certifikatfastgøring

Certifikatfastgøring sikrer, at NetRecon-komponenter kun kommunikerer med legitime servere og forhindrer aflytning, selv hvis en certifikatudsteder er kompromitteret.

### Fastgjorte forbindelser

| Forbindelse | Fastgøringstype |
|---|---|
| Agent til Probe | Offentlig nøgle-fastgøring |
| Admin Connect til Probe | Certifikatfingeraftryk |
| Probe til Update Server | Offentlig nøgle-fastgøring |
| Probe til License Server | Certifikatfingeraftryk |

### Sådan fungerer det

1. Den forventede certifikats offentlige nøgle-hash indlejres i hver klientbinær
2. Når en TLS-forbindelse etableres, udtrækker klienten serverens offentlige nøgle
3. Klienten beregner en SHA-256-hash af den offentlige nøgle
4. Hvis hashen ikke matcher den fastgjorte værdi, afvises forbindelsen
5. Fejlet fastgøringsvalidering udløser en sikkerhedsalarm

### Fastgøringsrotation

Når certifikater roteres:

1. Nye fastgøringer distribueres via opdateringsserveren før certifikatskiftet
2. Både gamle og nye fastgøringer er gyldige i overgangsperioden
3. Efter overgangen fjernes gamle fastgøringer i den næste opdatering

For self-hosted-implementeringer, opdater fastgøringer i konfigurationen:

```yaml
# /etc/netrecon/security.yaml
certificate_pins:
  api_gateway:
    - "sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="  # Aktuel
    - "sha256/BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB="  # Backup
```

## Manipulationsrespons

Steel Shield overvåger kritiske filer og konfigurationer for uautoriserede ændringer.

### Overvågede elementer

| Element | Kontrolfrekvens | Respons |
|---|---|---|
| Binære filer | Ved opstart + hver time | Alarm + valgfri nedlukning |
| Konfigurationsfiler | Hvert 5. minut | Alarm + gendan fra sikkerhedskopi |
| Databaseintegritet | Hvert 15. minut | Alarm + konsistenskontrol |
| TLS-certifikater | Hvert 5. minut | Alarm ved ændring |
| Systempakker | Dagligt | Alarm ved uventede ændringer |

### Responshandlinger

Når manipulation registreres, kan Steel Shield:

1. **Logge** — registrere hændelsen i sikkerhedsrevisionsloggen
2. **Alarmere** — sende en notifikation via konfigurerede kanaler
3. **Gendanne** — genskabe den manipulerede fil fra en kendt god sikkerhedskopi
4. **Isolere** — begrænse netværksadgang til kun administration
5. **Lukke ned** — stoppe tjenesten for at forhindre yderligere kompromittering

Konfigurer responsniveauet:

```yaml
# /etc/netrecon/security.yaml
tamper_response:
  level: "alert_and_revert"  # Muligheder: log, alert, alert_and_revert, isolate, shutdown
  notify_email: "security@yourcompany.com"
```

### Filintegritetsdatabase

Steel Shield vedligeholder en hashdatabase over alle beskyttede filer:

```bash
# Initialiser integritetsdatabasen
netrecon-shield init

# Kontroller integritet manuelt
netrecon-shield verify

# Forventet output:
# Checked 47 files
# Status: ALL INTACT
# Last verified: 2026-03-15T14:30:00Z
```

## Kørselsbeskyttelse

### Anti-debugging

I produktionstilstand inkluderer NetRecon-binære filer anti-debugging-foranstaltninger:
- Registrering af tilkoblede debuggere (ptrace på Linux, IsDebuggerPresent på Windows)
- Timingkontrol for enkelttrin-eksekvering
- Når debugging registreres i produktion, afsluttes processen elegant

:::info
Anti-debugging er deaktiveret i udviklingsbygninger for at tillade normale debugging-arbejdsgange.
:::

### Hukommelsesbeskyttelse

- Følsomme data (tokens, nøgler, adgangskoder) opbevares i beskyttede hukommelsesområder
- Hukommelsen nulstilles efter brug for at forhindre restdataeksponering
- På Linux bruges `mlock` til at forhindre, at følsomme sider swappes til disk

## Konfiguration

### Aktiver Steel Shield

Steel Shield er aktiveret som standard i produktionsimplementeringer. Konfigurer det i:

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

### Deaktiver til udvikling

Til udviklings- og testmiljøer:

```yaml
steel_shield:
  enabled: false
```

Eller deaktiver specifikke funktioner:

```yaml
steel_shield:
  enabled: true
  binary_integrity: false   # Spring hash-verificering over under udvikling
  runtime_protection: false  # Tillad debugger-tilkobling
```

## Revisionsspor

Alle Steel Shield-hændelser logges i sikkerhedsrevisionsloggen:

```bash
# Se seneste sikkerhedshændelser
netrecon-shield audit --last 24h

# Eksporter revisionslog
netrecon-shield audit --export csv --output security-audit.csv
```

Revisionslogposter inkluderer:
- Tidsstempel
- Hændelsestype (integrity_check, pin_validation, tamper_detected osv.)
- Berørt komponent
- Resultat (bestået/fejlet)
- Handling foretaget
- Yderligere detaljer

## Self-hosted-overvejelser

Ved self-hosting skal du huske:

1. **Brugerdefinerede certifikater**: Hvis du bruger din egen CA, opdater certifikatfastgøringskonfigurationen efter implementering
2. **Binære opdateringer**: Efter opdatering af binære filer, kør `netrecon-shield init` for at genopbygge integritetsdatabasen
3. **Sikkerhedskopier integritetsdatabasen**: Inkluder `/etc/netrecon/integrity.db` i din sikkerhedskopieringsrutine
4. **Overvåg alarmer**: Konfigurer e-mail- eller webhook-notifikationer for manipulationsalarmer

## FAQ

**Sp: Kan Steel Shield forårsage falske positiver?**
Sv: Falske positiver er sjældne, men kan forekomme efter systemopdateringer der ændrer delte biblioteker. Kør `netrecon-shield init` efter systemopdateringer for at genopfriske integritetsdatabasen.

**Sp: Påvirker Steel Shield ydeevnen?**
Sv: Ydeevnepåvirkningen er minimal. Integritetskontroller kører i en baggrundstråd og fuldfører typisk på under 1 sekund.

**Sp: Kan jeg integrere Steel Shield-alarmer med min SIEM?**
Sv: Ja. Konfigurer syslog-output i sikkerhedskonfigurationen for at videresende hændelser til din SIEM. Steel Shield understøtter syslog (RFC 5424) og JSON-outputformater.

**Sp: Er Steel Shield påkrævet til produktionsimplementeringer?**
Sv: Steel Shield anbefales stærkt, men er ikke strengt påkrævet. Du kan deaktivere det, men det fjerner vigtige sikkerhedsbeskyttelser.

For yderligere hjælp, kontakt [support@netreconapp.com](mailto:support@netreconapp.com).
