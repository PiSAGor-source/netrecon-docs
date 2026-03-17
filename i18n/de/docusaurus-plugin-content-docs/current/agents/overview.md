---
sidebar_position: 1
title: Agents-Übersicht
description: Leichtgewichtige Überwachungsagenten auf Endgeräten bereitstellen
---

# Agent-Bereitstellung

NetRecon Agents sind leichtgewichtige Überwachungsprogramme, die auf Endgeräten (Arbeitsstationen, Server, Laptops) installiert werden und an die Probe berichten. Agents bieten Sichtbarkeit auf Endgeräteebene, die Netzwerk-Scanning allein nicht erreichen kann.

## Was Agents tun

- **Heartbeat-Überwachung** — regelmäßiger Check-in, um zu bestätigen, dass das Endgerät online ist
- **Software-Inventar** — installierte Software und Versionen melden
- **Offene-Port-Meldung** — lokal lauschende Ports aus der Perspektive des Endgeräts melden
- **Netzwerkschnittstellen-Daten** — alle NICs, IPs, MAC-Adressen und Link-Status melden
- **Betriebssystem-Informationen** — Betriebssystem, Version und Patch-Level melden
- **Hardware-Informationen** — CPU, RAM, Speicher, Seriennummer
- **Sicherheitsstatus** — Firewall-Status, Antivirus-Status, Verschlüsselungsstatus

## Unterstützte Plattformen

| Plattform | Paketformat | Mindestversion |
|---|---|---|
| Windows | MSI-Installer | Windows 10 / Server 2016 |
| macOS | PKG-Installer | macOS 12 (Monterey) |
| Linux (Debian/Ubuntu) | DEB-Paket | Ubuntu 20.04 / Debian 11 |
| Linux (RHEL/Fedora) | RPM-Paket | RHEL 8 / Fedora 36 |

## Architektur

```
┌───────────────┐     HTTPS      ┌─────────────────┐
│   Endgerät    │  (Heartbeat +  │   Agent         │
│   (Agent)     ├────────────────►  Registry       │
│               │   Daten-Upload)│   :8006         │
└───────────────┘                └────────┬────────┘
                                         │
                                ┌────────▼────────┐
                                │  Probe Dashboard │
                                │  (Agent-Ansicht) │
                                └─────────────────┘
```

Agents kommunizieren mit dem Agent Registry-Service (Port 8006) auf der Probe:
- **Heartbeat**: alle 30 Sekunden (konfigurierbar)
- **Vollständiger Bericht**: alle 15 Minuten (konfigurierbar)
- **Protokoll**: HTTPS mit JWT-Authentifizierung
- **Payload**: JSON, gzip-komprimiert

## Bereitstellungsmethoden

### Manuelle Installation
Laden Sie das Agent-Paket herunter und installieren Sie es direkt auf jedem Endgerät. Ideal für kleine Bereitstellungen oder Tests.

- [Windows Agent](./windows.md)
- [macOS Agent](./macos.md)
- [Linux Agent](./linux.md)

### Enterprise-Bereitstellung
Für den großflächigen Rollout stellen Sie Agents über Ihre bestehenden Verwaltungstools bereit:

| Tool | Plattform | Anleitung |
|---|---|---|
| SCCM | Windows | [Windows Agent](./windows.md#sccm-deployment) |
| Microsoft Intune | Windows | [Windows Agent](./windows.md#intune-deployment) |
| Group Policy (GPO) | Windows | [Windows Agent](./windows.md#gpo-deployment) |
| Jamf Pro | macOS | [macOS Agent](./macos.md#jamf-deployment) |
| Generisches MDM | macOS | [macOS Agent](./macos.md#mdm-deployment) |
| CLI / Ansible | Linux | [Linux Agent](./linux.md#automated-deployment) |

### QR-Code-Registrierung

Für BYOD oder Außeneinsätze:
1. Generieren Sie einen QR-Code im Probe-Dashboard (**Agents > Registrierung**)
2. Der Benutzer scannt den QR-Code auf seinem Gerät
3. Der Agent wird mit vorkonfigurierten Einstellungen heruntergeladen und installiert

## Agent-Konfiguration

Nach der Installation werden Agents über eine lokale Konfigurationsdatei oder ferngesteuert über das Probe-Dashboard konfiguriert:

| Einstellung | Standard | Beschreibung |
|---|---|---|
| `server_url` | — | Probe-URL oder Cloudflare Tunnel-URL |
| `enrollment_token` | — | Einmaliger Registrierungstoken |
| `heartbeat_interval` | 30s | Wie oft der Agent eincheckt |
| `report_interval` | 15m | Wie oft vollständige Daten hochgeladen werden |
| `log_level` | info | Protokollierungsdetailgrad |

## Agent-Lebenszyklus

1. **Installation** — Agent-Paket wird auf dem Endgerät installiert
2. **Registrierung** — Agent registriert sich bei der Probe mit einem Registrierungstoken
3. **Aktiv** — Agent sendet regelmäßige Heartbeats und Berichte
4. **Veraltet** — Agent hat Heartbeats über den Timeout-Schwellenwert hinaus verpasst (Standard: 90 Sekunden)
5. **Offline** — Agent hat sich über einen längeren Zeitraum nicht gemeldet
6. **Außer Betrieb** — Agent wurde aus der Flotte entfernt

## Dashboard-Integration

Registrierte Agents erscheinen im Probe-Dashboard unter **Agents**:

- **Agent-Liste** — alle registrierten Agents mit Statusanzeigen
- **Agent-Detail** — vollständige Endgerätedaten für einen ausgewählten Agent
- **Warnungen** — Benachrichtigungen für veraltete/offline Agents oder Sicherheitsstatusänderungen
- **Gruppen** — Agents in logische Gruppen organisieren (nach Abteilung, Standort usw.)

## Sicherheit

- Alle Agent-zu-Probe-Kommunikation ist per TLS verschlüsselt
- Agents authentifizieren sich mit JWT-Tokens, die bei der Registrierung ausgestellt werden
- Registrierungstokens sind einmalig und laufen nach einer konfigurierbaren Frist ab
- Agent-Binärdateien sind zur Integritätsverifizierung signiert
- Keine eingehenden Verbindungen auf dem Endgerät erforderlich

## FAQ

**F: Wie viel Bandbreite verbraucht ein Agent?**
A: Heartbeats sind ca. 200 Bytes groß (alle 30 Sekunden). Vollständige Berichte sind typischerweise 2-10 KB komprimiert (alle 15 Minuten). Der Gesamtbandbreitenverbrauch ist selbst bei langsamen Verbindungen vernachlässigbar.

**F: Benötigt der Agent Admin-/Root-Rechte?**
A: Der Agent läuft als Systemdienst und benötigt erhöhte Rechte für die Installation. Nach der Installation läuft er unter einem dedizierten Dienstkonto mit minimalen Berechtigungen.

**F: Kann ich den Agent ferngesteuert deinstallieren?**
A: Ja. Wählen Sie im Probe-Dashboard einen Agent aus und klicken Sie auf **Deinstallieren**. Der Agent entfernt sich beim nächsten Heartbeat selbst.

**F: Beeinflusst der Agent die Endgeräteleistung?**
A: Der Agent ist als leichtgewichtig konzipiert. Er verwendet typischerweise weniger als 20 MB RAM und vernachlässigbare CPU. Die Datenerfassung läuft mit niedriger Priorität, um die Benutzererfahrung nicht zu beeinträchtigen.

Für weitere Hilfe kontaktieren Sie [support@netreconapp.com](mailto:support@netreconapp.com).
