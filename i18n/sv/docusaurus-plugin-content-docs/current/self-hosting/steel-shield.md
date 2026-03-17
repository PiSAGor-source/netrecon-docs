---
sidebar_position: 3
title: Steel Shield
description: Säkerhetshärdningsfunktioner för distributioner med egen hosting
---

# Steel Shield

Steel Shield är NetRecons ramverk för säkerhetshärdning. Det ger flera lager av skydd för distributioner med egen hosting och säkerställer integriteten och autenticiteten hos alla plattformskomponenter.

## Översikt

Steel Shield inkluderar fyra kärnsäkerhetsmekanismer:

| Funktion | Syfte |
|---|---|
| **Binärintegritet** | Verifiera att körbara filer inte har manipulerats |
| **Certifikatfästning** | Förhindra man-in-the-middle-attacker på API-kommunikation |
| **Manipuleringssvar** | Upptäcka och svara på obehöriga ändringar |
| **Körtidsskydd** | Skydda mot minnesmanipulering och avlusning |

## Verifiering av binärintegritet

Varje NetRecon-binär (prob-backend, agenter, tjänster) är digitalt signerad. Vid start verifierar varje komponent sin egen integritet.

### Hur det fungerar

1. Under bygget signeras varje binär med en privat nyckel som NetRecon innehar
2. Signaturen bäddas in i binärens metadata
3. Vid start beräknar binären en SHA-256-hash av sig själv
4. Hashen verifieras mot den inbäddade signaturen
5. Om verifieringen misslyckas vägrar binären starta och loggar en varning

### Manuell verifiering

Verifiera en binärs integritet manuellt:

```bash
# Verifiera prob-backend
netrecon-verify /usr/local/bin/netrecon-probe

# Verifiera en agent
netrecon-verify /usr/local/bin/netrecon-agent

# Förväntad utdata:
# Binary: /usr/local/bin/netrecon-probe
# SHA-256: a1b2c3d4e5f6...
# Signature: VALID
# Signed by: NetRecon Build System
# Signed at: 2026-03-15T10:00:00Z
```

### Verifiering av Docker-avbildning

Docker-avbildningar signeras med Docker Content Trust (DCT):

```bash
# Aktivera content trust
export DOCKER_CONTENT_TRUST=1

# Hämta med signaturverifiering
docker pull netrecon/api-gateway:latest
```

## Certifikatfästning

Certifikatfästning säkerställer att NetRecon-komponenter bara kommunicerar med legitima servrar, vilket förhindrar avlyssning även om en certifikatutfärdare har komprometterats.

### Fästa anslutningar

| Anslutning | Fästningstyp |
|---|---|
| Agent till prob | Offentlig nyckelfästning |
| Admin Connect till prob | Certifikatfingeravtryck |
| Prob till uppdateringsserver | Offentlig nyckelfästning |
| Prob till licensserver | Certifikatfingeravtryck |

### Hur det fungerar

1. Den förväntade certifikatets publika nyckel-hash bäddas in i varje klientbinär
2. Vid upprättande av en TLS-anslutning extraherar klienten serverns publika nyckel
3. Klienten beräknar en SHA-256-hash av den publika nyckeln
4. Om hashen inte matchar det fästa värdet avvisas anslutningen
5. Misslyckad fästningsvalidering utlöser en säkerhetsvarning

### Fästningsrotation

Vid certifikatrotation:

1. Nya fästningar distribueras via uppdateringsservern innan certifikatbytet
2. Både gamla och nya fästningar är giltiga under övergångsperioden
3. Efter övergången tas gamla fästningar bort i nästa uppdatering

För distributioner med egen hosting, uppdatera fästningar i konfigurationen:

```yaml
# /etc/netrecon/security.yaml
certificate_pins:
  api_gateway:
    - "sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="  # Aktuell
    - "sha256/BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB="  # Reserv
```

## Manipuleringssvar

Steel Shield övervakar kritiska filer och konfigurationer för obehöriga ändringar.

### Övervakade objekt

| Objekt | Kontrollfrekvens | Svar |
|---|---|---|
| Binärfiler | Vid start + varje timme | Varning + valfri avstängning |
| Konfigurationsfiler | Var 5:e minut | Varning + återställning till säkerhetskopia |
| Databasintegritet | Var 15:e minut | Varning + konsistenskontroll |
| TLS-certifikat | Var 5:e minut | Varning om ändrat |
| Systempaket | Dagligen | Varning om oväntade ändringar |

### Svarsåtgärder

När manipulering upptäcks kan Steel Shield:

1. **Logga** — registrera händelsen i säkerhetsgranskningsloggen
2. **Varna** — skicka en notifikation via konfigurerade kanaler
3. **Återställa** — återställa den manipulerade filen från en känd bra säkerhetskopia
4. **Isolera** — begränsa nätverksåtkomst till enbart hantering
5. **Stänga av** — stoppa tjänsten för att förhindra ytterligare kompromiss

Konfigurera svarsnivån:

```yaml
# /etc/netrecon/security.yaml
tamper_response:
  level: "alert_and_revert"  # Alternativ: log, alert, alert_and_revert, isolate, shutdown
  notify_email: "security@yourcompany.com"
```

### Filintegritetsdatabas

Steel Shield underhåller en hashdatabas av alla skyddade filer:

```bash
# Initiera integritetsdatabasen
netrecon-shield init

# Kontrollera integritet manuellt
netrecon-shield verify

# Förväntad utdata:
# Checked 47 files
# Status: ALL INTACT
# Last verified: 2026-03-15T14:30:00Z
```

## Körtidsskydd

### Avlusningsskydd

I produktionsläge inkluderar NetRecon-binärer avlusningsskydd:
- Detektering av anslutna avlusare (ptrace på Linux, IsDebuggerPresent på Windows)
- Tidskontroller för stegvis exekvering
- När avlusning upptäcks i produktion avslutas processen ordnat

:::info
Avlusningsskyddet är inaktiverat i utvecklingsbyggen för att möjliggöra normala avlusningsarbetsflöden.
:::

### Minnesskydd

- Känslig data (token, nycklar, lösenord) lagras i skyddade minnesregioner
- Minnet nollställs efter användning för att förhindra exponering av kvarvarande data
- På Linux används `mlock` för att förhindra att känsliga sidor swappas till disk

## Konfiguration

### Aktivera Steel Shield

Steel Shield är aktiverat som standard i produktionsdistributioner. Konfigurera det i:

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

### Inaktivera för utveckling

För utvecklings- och testmiljöer:

```yaml
steel_shield:
  enabled: false
```

Eller inaktivera specifika funktioner:

```yaml
steel_shield:
  enabled: true
  binary_integrity: false   # Hoppa över hashverifiering under utveckling
  runtime_protection: false  # Tillåt avlusaranslutning
```

## Granskningsspår

Alla Steel Shield-händelser loggas i säkerhetsgranskningsloggen:

```bash
# Visa senaste säkerhetshändelser
netrecon-shield audit --last 24h

# Exportera granskningslogg
netrecon-shield audit --export csv --output security-audit.csv
```

Granskningsloggposter inkluderar:
- Tidsstämpel
- Händelsetyp (integrity_check, pin_validation, tamper_detected, etc.)
- Berörd komponent
- Resultat (godkänt/misslyckat)
- Vidtagen åtgärd
- Ytterligare detaljer

## Överväganden för egen hosting

Vid egen hosting, tänk på:

1. **Egna certifikat**: Om du använder en egen CA, uppdatera konfigurationen för certifikatfästning efter distribution
2. **Binäruppdateringar**: Efter uppdatering av binärer, kör `netrecon-shield init` för att bygga om integritetsdatabasen
3. **Säkerhetskopiera integritetsdatabasen**: Inkludera `/etc/netrecon/integrity.db` i din säkerhetskopieringsrutin
4. **Övervaka varningar**: Konfigurera e-post- eller webhook-notifikationer för manipuleringsvarningar

## Vanliga frågor

**F: Kan Steel Shield orsaka falsklarm?**
S: Falsklarm är sällsynta men kan förekomma efter systemuppdateringar som modifierar delade bibliotek. Kör `netrecon-shield init` efter systemuppdateringar för att uppdatera integritetsdatabasen.

**F: Påverkar Steel Shield prestandan?**
S: Prestandapåverkan är minimal. Integritetskontroller körs i en bakgrundstråd och slutförs normalt på under 1 sekund.

**F: Kan jag integrera Steel Shield-varningar med mitt SIEM?**
S: Ja. Konfigurera syslog-utdata i säkerhetskonfigurationen för att vidarebefordra händelser till ditt SIEM. Steel Shield stöder syslog (RFC 5424) och JSON-utdataformat.

**F: Krävs Steel Shield för produktionsdistributioner?**
S: Steel Shield rekommenderas starkt men är inte strikt nödvändigt. Du kan inaktivera det, men det tar bort viktiga säkerhetsskydd.

För ytterligare hjälp, kontakta [support@netreconapp.com](mailto:support@netreconapp.com).
