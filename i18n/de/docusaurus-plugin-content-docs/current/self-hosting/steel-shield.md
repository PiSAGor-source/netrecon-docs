---
sidebar_position: 3
title: Steel Shield
description: Sicherheitshärtungsfunktionen für Self-Hosted-Bereitstellungen
---

# Steel Shield

Steel Shield ist das Sicherheitshärtungs-Framework von NetRecon. Es bietet mehrere Schutzschichten für Self-Hosted-Bereitstellungen und gewährleistet die Integrität und Authentizität aller Plattformkomponenten.

## Übersicht

Steel Shield umfasst vier zentrale Sicherheitsmechanismen:

| Funktion | Zweck |
|---|---|
| **Binärintegrität** | Überprüfung, dass ausführbare Dateien nicht manipuliert wurden |
| **Zertifikat-Pinning** | Schutz vor Man-in-the-Middle-Angriffen auf die API-Kommunikation |
| **Manipulationsreaktion** | Erkennung und Reaktion auf unbefugte Änderungen |
| **Laufzeitschutz** | Schutz vor Speichermanipulation und Debugging |

## Binärintegrität-Verifizierung

Jede NetRecon-Binärdatei (Probe-Backend, Agents, Services) ist digital signiert. Beim Start überprüft jede Komponente ihre eigene Integrität.

### Funktionsweise

1. Während des Builds wird jede Binärdatei mit einem privaten Schlüssel von NetRecon signiert
2. Die Signatur wird in die Binär-Metadaten eingebettet
3. Beim Start berechnet die Binärdatei einen SHA-256-Hash von sich selbst
4. Der Hash wird gegen die eingebettete Signatur verifiziert
5. Bei fehlgeschlagener Verifizierung verweigert die Binärdatei den Start und protokolliert eine Warnung

### Manuelle Verifizierung

Überprüfen Sie die Integrität einer Binärdatei manuell:

```bash
# Probe-Backend verifizieren
netrecon-verify /usr/local/bin/netrecon-probe

# Agent verifizieren
netrecon-verify /usr/local/bin/netrecon-agent

# Erwartete Ausgabe:
# Binary: /usr/local/bin/netrecon-probe
# SHA-256: a1b2c3d4e5f6...
# Signature: VALID
# Signed by: NetRecon Build System
# Signed at: 2026-03-15T10:00:00Z
```

### Docker-Image-Verifizierung

Docker-Images werden mit Docker Content Trust (DCT) signiert:

```bash
# Content Trust aktivieren
export DOCKER_CONTENT_TRUST=1

# Mit Signaturverifizierung herunterladen
docker pull netrecon/api-gateway:latest
```

## Zertifikat-Pinning

Zertifikat-Pinning stellt sicher, dass NetRecon-Komponenten nur mit legitimen Servern kommunizieren und verhindert Abfangen, selbst wenn eine Zertifizierungsstelle kompromittiert ist.

### Gepinnte Verbindungen

| Verbindung | Pinning-Typ |
|---|---|
| Agent zu Probe | Public-Key-Pin |
| Admin Connect zu Probe | Zertifikats-Fingerabdruck |
| Probe zu Update Server | Public-Key-Pin |
| Probe zu License Server | Zertifikats-Fingerabdruck |

### Funktionsweise

1. Der erwartete Hash des Zertifikats-Public-Keys wird in jede Client-Binärdatei eingebettet
2. Beim Aufbau einer TLS-Verbindung extrahiert der Client den Public Key des Servers
3. Der Client berechnet einen SHA-256-Hash des Public Keys
4. Stimmt der Hash nicht mit dem gepinnten Wert überein, wird die Verbindung abgelehnt
5. Eine fehlgeschlagene Pin-Validierung löst eine Sicherheitswarnung aus

### Pin-Rotation

Bei der Rotation von Zertifikaten:

1. Neue Pins werden über den Update-Server verteilt, bevor das Zertifikat geändert wird
2. Sowohl alte als auch neue Pins sind während der Übergangsphase gültig
3. Nach dem Übergang werden alte Pins im nächsten Update entfernt

Für Self-Hosted-Bereitstellungen aktualisieren Sie die Pins in der Konfiguration:

```yaml
# /etc/netrecon/security.yaml
certificate_pins:
  api_gateway:
    - "sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="  # Current
    - "sha256/BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB="  # Backup
```

## Manipulationsreaktion

Steel Shield überwacht kritische Dateien und Konfigurationen auf unbefugte Änderungen.

### Überwachte Elemente

| Element | Prüfhäufigkeit | Reaktion |
|---|---|---|
| Binärdateien | Beim Start + stündlich | Warnung + optionaler Stopp |
| Konfigurationsdateien | Alle 5 Minuten | Warnung + Wiederherstellung aus Backup |
| Datenbankintegrität | Alle 15 Minuten | Warnung + Konsistenzprüfung |
| TLS-Zertifikate | Alle 5 Minuten | Warnung bei Änderung |
| Systempakete | Täglich | Warnung bei unerwarteten Änderungen |

### Reaktionsmaßnahmen

Wenn eine Manipulation erkannt wird, kann Steel Shield:

1. **Protokollieren** — das Ereignis im Sicherheits-Audit-Protokoll aufzeichnen
2. **Warnen** — eine Benachrichtigung über konfigurierte Kanäle senden
3. **Wiederherstellen** — die manipulierte Datei aus einem bekannten guten Backup restaurieren
4. **Isolieren** — Netzwerkzugriff auf reinen Verwaltungszugriff beschränken
5. **Herunterfahren** — den Service stoppen, um weitere Kompromittierung zu verhindern

Konfigurieren Sie die Reaktionsstufe:

```yaml
# /etc/netrecon/security.yaml
tamper_response:
  level: "alert_and_revert"  # Options: log, alert, alert_and_revert, isolate, shutdown
  notify_email: "security@yourcompany.com"
```

### Dateiintegritätsdatenbank

Steel Shield pflegt eine Hash-Datenbank aller geschützten Dateien:

```bash
# Integritätsdatenbank initialisieren
netrecon-shield init

# Integrität manuell prüfen
netrecon-shield verify

# Erwartete Ausgabe:
# Checked 47 files
# Status: ALL INTACT
# Last verified: 2026-03-15T14:30:00Z
```

## Laufzeitschutz

### Anti-Debugging

Im Produktionsmodus enthalten NetRecon-Binärdateien Anti-Debugging-Maßnahmen:
- Erkennung angehängter Debugger (ptrace unter Linux, IsDebuggerPresent unter Windows)
- Timing-Prüfungen für Einzelschrittausführung
- Bei Erkennung von Debugging im Produktionsmodus beendet sich der Prozess geordnet

:::info
Anti-Debugging ist in Entwicklungs-Builds deaktiviert, um normale Debugging-Workflows zu ermöglichen.
:::

### Speicherschutz

- Sensible Daten (Tokens, Schlüssel, Passwörter) werden in geschützten Speicherbereichen gespeichert
- Der Speicher wird nach Verwendung mit Nullen überschrieben, um die Exposition von Restdaten zu verhindern
- Unter Linux wird `mlock` verwendet, um zu verhindern, dass sensible Seiten auf die Festplatte ausgelagert werden

## Konfiguration

### Steel Shield aktivieren

Steel Shield ist standardmäßig in Produktionsbereitstellungen aktiviert. Konfigurieren Sie es in:

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

### Für Entwicklung deaktivieren

Für Entwicklungs- und Testumgebungen:

```yaml
steel_shield:
  enabled: false
```

Oder einzelne Funktionen deaktivieren:

```yaml
steel_shield:
  enabled: true
  binary_integrity: false   # Skip hash verification during dev
  runtime_protection: false  # Allow debugger attachment
```

## Audit-Trail

Alle Steel-Shield-Ereignisse werden im Sicherheits-Audit-Protokoll aufgezeichnet:

```bash
# Letzte Sicherheitsereignisse anzeigen
netrecon-shield audit --last 24h

# Audit-Protokoll exportieren
netrecon-shield audit --export csv --output security-audit.csv
```

Audit-Protokolleinträge umfassen:
- Zeitstempel
- Ereignistyp (integrity_check, pin_validation, tamper_detected usw.)
- Betroffene Komponente
- Ergebnis (bestanden/fehlgeschlagen)
- Durchgeführte Aktion
- Zusätzliche Details

## Hinweise für Self-Hosting

Beachten Sie beim Self-Hosting:

1. **Eigene Zertifikate**: Wenn Sie Ihre eigene CA verwenden, aktualisieren Sie die Zertifikat-Pin-Konfiguration nach der Bereitstellung
2. **Binär-Updates**: Führen Sie nach der Aktualisierung von Binärdateien `netrecon-shield init` aus, um die Integritätsdatenbank neu aufzubauen
3. **Integritätsdatenbank sichern**: Fügen Sie `/etc/netrecon/integrity.db` in Ihre Backup-Routine ein
4. **Warnungen überwachen**: Konfigurieren Sie E-Mail- oder Webhook-Benachrichtigungen für Manipulationswarnungen

## FAQ

**F: Kann Steel Shield Fehlalarme verursachen?**
A: Fehlalarme sind selten, können aber nach Systemupdates auftreten, die gemeinsam genutzte Bibliotheken ändern. Führen Sie `netrecon-shield init` nach Systemupdates aus, um die Integritätsdatenbank zu aktualisieren.

**F: Beeinflusst Steel Shield die Leistung?**
A: Die Leistungsauswirkung ist minimal. Integritätsprüfungen laufen in einem Hintergrund-Thread und werden typischerweise in weniger als 1 Sekunde abgeschlossen.

**F: Kann ich Steel-Shield-Warnungen in mein SIEM integrieren?**
A: Ja. Konfigurieren Sie die Syslog-Ausgabe in der Sicherheitskonfiguration, um Ereignisse an Ihr SIEM weiterzuleiten. Steel Shield unterstützt Syslog (RFC 5424) und JSON-Ausgabeformate.

**F: Ist Steel Shield für Produktionsbereitstellungen erforderlich?**
A: Steel Shield wird dringend empfohlen, ist aber nicht zwingend erforderlich. Sie können es deaktivieren, verlieren dadurch aber wichtige Sicherheitsschutzmechanismen.

Für weitere Hilfe kontaktieren Sie [support@netreconapp.com](mailto:support@netreconapp.com).
