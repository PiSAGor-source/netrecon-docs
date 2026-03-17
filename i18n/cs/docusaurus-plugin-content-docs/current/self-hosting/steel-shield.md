---
sidebar_position: 3
title: Steel Shield
description: Funkce bezpečnostního zpevnění pro self-hosted nasazení
---

# Steel Shield

Steel Shield je framework pro bezpečnostní zpevnění platformy NetRecon. Poskytuje několik vrstev ochrany pro self-hosted nasazení a zajišťuje integritu a autenticitu všech komponent platformy.

## Přehled

Steel Shield zahrnuje čtyři základní bezpečnostní mechanismy:

| Funkce | Účel |
|---|---|
| **Integrita binárních souborů** | Ověření, že spustitelné soubory nebyly pozměněny |
| **Připnutí certifikátů** | Prevence útoků typu man-in-the-middle na API komunikaci |
| **Reakce na manipulaci** | Detekce a reakce na neoprávněné modifikace |
| **Ochrana za běhu** | Ochrana proti manipulaci s pamětí a ladění |

## Ověření integrity binárních souborů

Každý binární soubor NetRecon (backend sondy, agenti, služby) je digitálně podepsán. Při spuštění každá komponenta ověřuje svou vlastní integritu.

### Jak to funguje

1. Během sestavení je každý binární soubor podepsán privátním klíčem drženým společností NetRecon
2. Podpis je vložen do metadat binárního souboru
3. Při spuštění binární soubor vypočítá SHA-256 hash sám ze sebe
4. Hash je ověřen proti vloženému podpisu
5. Pokud ověření selže, binární soubor odmítne spuštění a zaloguje upozornění

### Ruční ověření

Ručně ověřte integritu binárního souboru:

```bash
# Ověření backendu sondy
netrecon-verify /usr/local/bin/netrecon-probe

# Ověření agenta
netrecon-verify /usr/local/bin/netrecon-agent

# Očekávaný výstup:
# Binary: /usr/local/bin/netrecon-probe
# SHA-256: a1b2c3d4e5f6...
# Signature: VALID
# Signed by: NetRecon Build System
# Signed at: 2026-03-15T10:00:00Z
```

### Ověření Docker obrazu

Docker obrazy jsou podepsány pomocí Docker Content Trust (DCT):

```bash
# Povolení ověřování důvěryhodnosti obsahu
export DOCKER_CONTENT_TRUST=1

# Stažení s ověřením podpisu
docker pull netrecon/api-gateway:latest
```

## Připnutí certifikátů

Připnutí certifikátů zajišťuje, že komponenty NetRecon komunikují pouze s legitimními servery, čímž brání odposlouchávání i v případě kompromitace certifikační autority.

### Připnutá spojení

| Spojení | Typ připnutí |
|---|---|
| Agent na Probe | Připnutí veřejného klíče |
| Admin Connect na Probe | Otisk certifikátu |
| Probe na Update Server | Připnutí veřejného klíče |
| Probe na License Server | Otisk certifikátu |

### Jak to funguje

1. Očekávaný hash veřejného klíče certifikátu je vložen do každého klientského binárního souboru
2. Při navazování TLS spojení klient extrahuje veřejný klíč serveru
3. Klient vypočítá SHA-256 hash veřejného klíče
4. Pokud hash neodpovídá připnuté hodnotě, spojení je odmítnuto
5. Neúspěšná validace připnutí spustí bezpečnostní upozornění

### Rotace připnutí

Při rotaci certifikátů:

1. Nová připnutí jsou distribuována prostřednictvím update serveru před změnou certifikátu
2. Během přechodného období jsou platná jak stará, tak nová připnutí
3. Po přechodu jsou stará připnutí odebrána v další aktualizaci

Pro self-hosted nasazení aktualizujte připnutí v konfiguraci:

```yaml
# /etc/netrecon/security.yaml
certificate_pins:
  api_gateway:
    - "sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="  # Aktuální
    - "sha256/BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB="  # Záložní
```

## Reakce na manipulaci

Steel Shield monitoruje kritické soubory a konfigurace pro neoprávněné změny.

### Monitorované položky

| Položka | Frekvence kontroly | Reakce |
|---|---|---|
| Binární soubory | Při spuštění + každou hodinu | Upozornění + volitelné vypnutí |
| Konfigurační soubory | Každých 5 minut | Upozornění + obnovení ze zálohy |
| Integrita databáze | Každých 15 minut | Upozornění + kontrola konzistence |
| TLS certifikáty | Každých 5 minut | Upozornění při změně |
| Systémové balíčky | Denně | Upozornění při neočekávaných změnách |

### Reakce

Při detekci manipulace může Steel Shield:

1. **Zalogovat** — zaznamenat událost do bezpečnostního auditního logu
2. **Upozornit** — odeslat oznámení prostřednictvím nakonfigurovaných kanálů
3. **Obnovit** — obnovit pozměněný soubor ze známé dobré zálohy
4. **Izolovat** — omezit síťový přístup pouze na správu
5. **Vypnout** — zastavit službu pro prevenci dalšího kompromitování

Konfigurace úrovně reakce:

```yaml
# /etc/netrecon/security.yaml
tamper_response:
  level: "alert_and_revert"  # Možnosti: log, alert, alert_and_revert, isolate, shutdown
  notify_email: "bezpecnost@vasefirma.cz"
```

### Databáze integrity souborů

Steel Shield udržuje hashovou databázi všech chráněných souborů:

```bash
# Inicializace databáze integrity
netrecon-shield init

# Ruční kontrola integrity
netrecon-shield verify

# Očekávaný výstup:
# Checked 47 files
# Status: ALL INTACT
# Last verified: 2026-03-15T14:30:00Z
```

## Ochrana za běhu

### Ochrana proti ladění

V produkčním režimu binární soubory NetRecon zahrnují opatření proti ladění:
- Detekce připojených debuggerů (ptrace na Linuxu, IsDebuggerPresent na Windows)
- Časové kontroly pro krokové provádění
- Při detekci ladění v produkci se proces řádně ukončí

:::info
Ochrana proti ladění je v vývojových sestaveních vypnuta, aby bylo umožněno normální ladění.
:::

### Ochrana paměti

- Citlivá data (tokeny, klíče, hesla) jsou uložena v chráněných oblastech paměti
- Paměť je po použití vynulována, aby se zabránilo odhalení zbytkových dat
- Na Linuxu je použit `mlock` pro zabránění prohození citlivých stránek na disk

## Konfigurace

### Povolení Steel Shield

Steel Shield je ve výchozím nastavení povolen v produkčních nasazeních. Konfigurujte ho v:

```yaml
# /etc/netrecon/security.yaml
steel_shield:
  enabled: true
  binary_integrity: true
  certificate_pinning: true
  tamper_response: true
  runtime_protection: true
  integrity_check_interval: 3600  # sekundy
  tamper_check_interval: 300      # sekundy
```

### Vypnutí pro vývoj

Pro vývojová a testovací prostředí:

```yaml
steel_shield:
  enabled: false
```

Nebo vypnutí konkrétních funkcí:

```yaml
steel_shield:
  enabled: true
  binary_integrity: false   # Přeskočení ověření hashů během vývoje
  runtime_protection: false  # Povolení připojení debuggeru
```

## Auditní stopa

Všechny události Steel Shield jsou zaznamenávány do bezpečnostního auditního logu:

```bash
# Zobrazení posledních bezpečnostních událostí
netrecon-shield audit --last 24h

# Export auditního logu
netrecon-shield audit --export csv --output security-audit.csv
```

Záznamy auditního logu zahrnují:
- Časové razítko
- Typ události (integrity_check, pin_validation, tamper_detected atd.)
- Dotčená komponenta
- Výsledek (úspěch/neúspěch)
- Provedená akce
- Další podrobnosti

## Poznámky pro self-hosting

Při self-hostingu mějte na paměti:

1. **Vlastní certifikáty**: Pokud používáte vlastní CA, aktualizujte konfiguraci připnutí certifikátů po nasazení
2. **Aktualizace binárních souborů**: Po aktualizaci binárních souborů spusťte `netrecon-shield init` pro obnovení databáze integrity
3. **Zálohujte databázi integrity**: Zahrňte `/etc/netrecon/integrity.db` do vaší zálohovací rutiny
4. **Monitorujte upozornění**: Nakonfigurujte e-mailové nebo webhookové oznámení pro upozornění na manipulaci

## Často kladené otázky

**Otázka: Může Steel Shield způsobit falešné poplachy?**
Odpověď: Falešné poplachy jsou vzácné, ale mohou nastat po systémových aktualizacích, které modifikují sdílené knihovny. Po systémových aktualizacích spusťte `netrecon-shield init` pro obnovení databáze integrity.

**Otázka: Ovlivňuje Steel Shield výkon?**
Odpověď: Dopad na výkon je minimální. Kontroly integrity běží ve vlákně na pozadí a typicky se dokončí za méně než 1 sekundu.

**Otázka: Mohu integrovat upozornění Steel Shield s mým SIEM?**
Odpověď: Ano. Nakonfigurujte syslog výstup v bezpečnostní konfiguraci pro přeposílání událostí do vašeho SIEM. Steel Shield podporuje syslog (RFC 5424) a JSON výstupní formáty.

**Otázka: Je Steel Shield vyžadován pro produkční nasazení?**
Odpověď: Steel Shield je důrazně doporučen, ale není striktně vyžadován. Můžete ho vypnout, ale tím odstraníte důležité bezpečnostní ochrany.

Pro další pomoc kontaktujte [support@netreconapp.com](mailto:support@netreconapp.com).
