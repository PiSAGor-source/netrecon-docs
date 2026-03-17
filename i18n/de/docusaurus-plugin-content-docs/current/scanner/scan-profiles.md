---
sidebar_position: 2
title: Scan-Profile
description: Scan-Tiefe und -Geschwindigkeit mit Profilen konfigurieren
---

# Scan-Profile

Scan-Profile ermöglichen es Ihnen, die Balance zwischen Scan-Geschwindigkeit und Gründlichkeit zu steuern. NetRecon enthält vier integrierte Profile, und Sie können benutzerdefinierte Profile für spezielle Anwendungsfälle erstellen.

## Integrierte Profile

### Schnell

Das schnellste Profil, ausgelegt auf schnelle Host-Erkennung mit minimalem Port-Scanning.

| Einstellung | Wert |
|---|---|
| ARP-Erkennung | Ja |
| Port-Bereich | Top 100 Ports |
| Diensterkennung | Einfach (nur gängige Dienste) |
| Geräteprofilierung | OUI + Port-Fingerabdruck |
| Geschätzte Zeit (/24) | 1-2 Minuten |

**Ideal für:** Schnelle Bestandsprüfung, Überprüfung ob ein Gerät online ist, erste Aufklärung.

### Standard

Ein ausgewogenes Profil, das gute Abdeckung ohne übermäßige Scan-Zeit bietet.

| Einstellung | Wert |
|---|---|
| ARP-Erkennung | Ja |
| Port-Bereich | Top 1.000 Ports |
| Diensterkennung | Vollständiges Banner-Grabbing |
| Geräteprofilierung | Vollständig (OUI + Ports + Banner) |
| Geschätzte Zeit (/24) | 5-10 Minuten |

**Ideal für:** Regelmäßige Netzwerk-Audits, routinemäßige Sicherheitsbewertungen, allgemeines Scanning.

### Tiefen

Umfassendes Scanning, das alle gängigen Ports prüft und eine gründliche Dienstanalyse durchführt.

| Einstellung | Wert |
|---|---|
| ARP-Erkennung | Ja |
| Port-Bereich | 1-10.000 |
| Diensterkennung | Vollständiges Banner-Grabbing + Versionserkennung |
| Geräteprofilierung | Vollständig mit CVE-Quervergleich |
| Geschätzte Zeit (/24) | 15-30 Minuten |

**Ideal für:** Gründliche Sicherheitsaudits, Compliance-Prüfungen, detaillierte Netzwerkdokumentation.

### Benutzerdefiniert

Erstellen Sie Ihr eigenes Profil mit voller Kontrolle über jeden Scan-Parameter.

## Benutzerdefiniertes Profil erstellen

1. Öffnen Sie die NetRecon Scanner App
2. Navigieren Sie zu **Scan > Profile**
3. Tippen Sie auf **Neues Profil erstellen**
4. Konfigurieren Sie die folgenden Parameter:

### Erkennungseinstellungen

| Parameter | Optionen | Standard |
|---|---|---|
| Erkennungsmethode | ARP / Ping / Beides | ARP |
| Subnetz | Automatisch erkennen / Manuell CIDR | Automatisch erkennen |
| IPs ausschließen | Kommagetrennte Liste | Keine |

### Port-Scan-Einstellungen

| Parameter | Optionen | Standard |
|---|---|---|
| Port-Bereich | Top 100 / Top 1000 / 1-10000 / 1-65535 / Benutzerdefiniert | Top 1000 |
| Benutzerdefinierte Ports | Kommagetrennt (z. B. 22,80,443,8080) | — |
| Scan-Technik | TCP Connect / SYN (nur Root) | TCP Connect |
| Timeout pro Port | 500ms - 10.000ms | 2.000ms |
| Max. gleichzeitig | 5 - 40 | 20 |

### Diensterkennungs-Einstellungen

| Parameter | Optionen | Standard |
|---|---|---|
| Banner-Grabbing | Aus / Einfach / Vollständig | Einfach |
| Versionserkennung | Ja / Nein | Nein |
| SSL/TLS-Info | Ja / Nein | Nein |

### Leistungseinstellungen

| Parameter | Optionen | Standard |
|---|---|---|
| Akkubewusst | Ja / Nein | Ja |
| Max. gleichzeitige Sockets | 5 - 40 | 20 |
| Scan-Verzögerung zwischen Hosts | 0ms - 1.000ms | 0ms |

5. Tippen Sie auf **Profil speichern**

## Profilverwaltung

### Profile exportieren und importieren

Profile können zwischen Geräten geteilt werden:

1. Gehen Sie zu **Scan > Profile**
2. Halten Sie ein Profil lange gedrückt
3. Wählen Sie **Exportieren**, um einen QR-Code oder eine JSON-Datei zu generieren
4. Tippen Sie auf dem empfangenden Gerät auf **Profil importieren** und scannen Sie den QR-Code oder wählen Sie die Datei

### Standardprofil festlegen

1. Gehen Sie zu **Scan > Profile**
2. Halten Sie das gewünschte Profil lange gedrückt
3. Wählen Sie **Als Standard festlegen**

Das Standardprofil wird verwendet, wenn Sie die Haupt-Schaltfläche **Scannen** tippen, ohne ein Profil auszuwählen.

## Probe-Profile

Wenn Sie mit einer Probe verbunden sind, sind zusätzliche Profiloptionen verfügbar:

| Einstellung | Beschreibung |
|---|---|
| IDS-Überwachung | Suricata IDS während des Scans aktivieren |
| Schwachstellen-Scan | Nuclei-Schwachstellenprüfungen auf entdeckten Diensten ausführen |
| PCAP-Aufzeichnung | Pakete während des Scans zur späteren Analyse aufzeichnen |
| Passive Erkennung | Passiv beobachtete Geräte in die Ergebnisse einschließen |

Diese Optionen sind nur verfügbar, wenn die Scanner App mit einer Probe verbunden ist.

## FAQ

**F: Warum dauert das Tiefen-Profil so lange?**
A: Das Tiefen-Profil scannt bis zu 10.000 Ports pro Host mit vollständiger Diensterkennung. Für ein /24-Subnetz mit 100+ aktiven Hosts bedeutet dies Millionen von Verbindungsversuchen. Verwenden Sie das Standard-Profil für Routineprüfungen und reservieren Sie Tiefen für gezielte Bewertungen.

**F: Kann ich alle 65.535 Ports scannen?**
A: Ja, indem Sie ein benutzerdefiniertes Profil mit dem Port-Bereich „1-65535" erstellen. Beachten Sie, dass dies die Scan-Zeit erheblich erhöht. Für einen einzelnen Host dauert ein vollständiger Port-Scan ca. 5-10 Minuten; für ein gesamtes /24-Subnetz kann es mehrere Stunden dauern.

**F: Beeinflusst der akkubewusste Modus die Scanergebnisse?**
A: Der akkubewusste Modus reduziert die Anzahl gleichzeitiger Verbindungen, wenn der Akku unter 30% liegt, was den Scan verlangsamt, aber keine Ziele oder Ports überspringt. Die Ergebnisse sind identisch; nur die Abschlusszeit ändert sich.

Für weitere Hilfe kontaktieren Sie [support@netreconapp.com](mailto:support@netreconapp.com).
