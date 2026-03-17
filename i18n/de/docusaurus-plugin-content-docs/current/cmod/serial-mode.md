---
sidebar_position: 3
title: Serieller Modus
description: Verbindung zu Netzwerkgeräten über serielles Konsolenkabel
---

# Serieller Modus

Der serielle Modus ermöglicht es Ihnen, sich über ein USB-zu-Seriell-Konsolenkabel mit Netzwerkgeräten zu verbinden. Dies ist unverzichtbar für die Ersteinrichtung von Geräten, Passwortwiederherstellung und Out-of-Band-Management, wenn SSH nicht verfügbar ist.

## Voraussetzungen

- Ein USB-zu-Seriell-Konsolenkabel (RJ45-zu-USB oder DB9-zu-USB)
- Das USB-Kabel an den USB-Port der Probe angeschlossen
- Physischer Zugang zum Konsolen-Port des Netzwerkgeräts
- Die korrekte Baudrate für das Zielgerät

## Unterstützte Konsolenkabeltypen

| Kabeltyp | Stecker | Häufige Verwendung |
|---|---|---|
| RJ45-zu-USB | RJ45-Konsolen-Port | Cisco, Juniper, Aruba |
| DB9-zu-USB | DB9-Seriell-Port | Ältere Switches, Industriegeräte |
| USB-C/USB-A zu RJ45 | RJ45-Konsolen-Port | Moderne Konsolenkabel |
| USB-C zu USB-C | USB-C-Konsolen-Port | Einige neuere Geräte |

### Empfohlene Chipsätze

Für zuverlässige serielle Kommunikation verwenden Sie Kabel mit diesen Chipsätzen:
- **FTDI FT232R** — am kompatibelsten, empfohlen
- **Prolific PL2303** — weit verbreitet
- **Silicon Labs CP210x** — gute Kompatibilität

Vermeiden Sie gefälschte FTDI-Kabel, da diese möglicherweise nicht zuverlässig funktionieren.

## Serielle Verbindung einrichten

### Schritt 1: Kabel anschließen

1. Verbinden Sie das USB-Ende des Konsolenkabels mit dem USB-Port der Probe
2. Verbinden Sie das RJ45/DB9-Ende mit dem Konsolen-Port des Netzwerkgeräts
3. Überprüfen Sie, ob das Kabel von der Probe erkannt wird

### Schritt 2: Gerät hinzufügen

1. Navigieren Sie zu **CMod > Geräte**
2. Klicken Sie auf **Gerät hinzufügen**
3. Wählen Sie **Seriell** als Verbindungstyp
4. Konfigurieren Sie die seriellen Parameter:

| Feld | Beschreibung | Standard |
|---|---|---|
| Name | Aussagekräftiger Gerätename | — |
| Serieller Port | Erkanntes USB-Seriell-Gerät | `/dev/ttyUSB0` |
| Baudrate | Kommunikationsgeschwindigkeit | 9600 |
| Datenbits | Anzahl der Datenbits | 8 |
| Parität | Paritätsprüfung | Keine |
| Stoppbits | Anzahl der Stoppbits | 1 |
| Flusskontrolle | Hardware-/Software-Flusskontrolle | Keine |
| Gerätetyp | Hersteller/OS (für Vorlagenzuordnung) | — |

5. Klicken Sie auf **Speichern & Testen**

### Schritt 3: Terminal öffnen

1. Klicken Sie auf das Gerät in der CMod-Geräteliste
2. Klicken Sie auf **Terminal**
3. Ein interaktives serielles Terminal öffnet sich in Ihrem Browser
4. Drücken Sie **Enter**, um die Gerätekonsole aufzuwecken

## Baudraten-Referenz

Gängige Baudraten nach Hersteller:

| Hersteller / Gerät | Standard-Baudrate |
|---|---|
| Cisco IOS / IOS-XE | 9600 |
| Cisco NX-OS | 9600 |
| Juniper Junos | 9600 |
| HP/Aruba ProCurve | 9600 |
| MikroTik RouterOS | 115200 |
| Fortinet FortiOS | 9600 |
| Palo Alto PAN-OS | 9600 |
| Ubiquiti EdgeOS | 115200 |
| Linux (generisch) | 115200 |

:::tip
Wenn Sie unlesbaren Text im Terminal sehen, ist die Baudrate wahrscheinlich falsch. Versuchen Sie die gängigen Raten: 9600, 19200, 38400, 57600, 115200.
:::

## Serielle Kommunikationseinstellungen

### Standard-8N1-Konfiguration

Die meisten Netzwerkgeräte verwenden den „8N1"-Standard:
- **8** Datenbits
- **N** (keine) Parität
- **1** Stoppbit

Dies ist der Standard in CMod und sollte mit der überwiegenden Mehrheit der Geräte funktionieren.

### Flusskontrolle

| Typ | Verwendung |
|---|---|
| Keine | Standard; funktioniert für die meisten Geräte |
| Hardware (RTS/CTS) | Erforderlich bei einigen Industrie- und älteren Geräten |
| Software (XON/XOFF) | Selten verwendet; einige ältere Terminalserver |

## Serieller Port-Erkennung

Wenn ein USB-Seriell-Kabel angeschlossen wird, erkennt CMod es automatisch:

1. Navigieren Sie zu **CMod > Geräte > Gerät hinzufügen > Seriell**
2. Das Dropdown **Serieller Port** listet alle erkannten USB-Seriell-Geräte auf
3. Wenn mehrere Kabel angeschlossen sind, erscheint jedes als separater Port (z.B. `/dev/ttyUSB0`, `/dev/ttyUSB1`)

Wenn keine Ports erkannt werden:
- Überprüfen Sie, ob das Kabel vollständig eingesteckt ist
- Versuchen Sie einen anderen USB-Port an der Probe
- Prüfen Sie das Systemprotokoll der Probe auf USB-Geräteerkennungsfehler

## Anwendungsfälle

### Ersteinrichtung von Geräten
Beim Konfigurieren eines neuen Switches oder Routers ab Werk, der keine IP-Adresse konfiguriert hat:
1. Über serielle Konsole verbinden
2. Erstkonfiguration abschließen (Management-IP zuweisen, SSH aktivieren)
3. Zum SSH-Modus für die laufende Verwaltung wechseln

### Passwortwiederherstellung
Wenn der Zugang zu einem Gerät gesperrt ist:
1. Über serielle Konsole verbinden
2. Die Passwortwiederherstellungsprozedur des Herstellers befolgen
3. Passwort zurücksetzen und Zugang wiederherstellen

### Out-of-Band-Management
Wenn die Management-Schnittstelle eines Geräts nicht erreichbar ist:
1. Über serielle Konsole verbinden
2. Das Problem diagnostizieren (Interface down, Routing-Problem usw.)
3. Korrigierende Konfiguration anwenden

### Firmware-Upgrades
Einige Geräte erfordern Konsolenzugang während Firmware-Upgrades:
1. Über serielle Konsole verbinden
2. Den Upgrade-Prozess in Echtzeit überwachen
3. Bei Fehlern während des Upgrades eingreifen

## Fehlerbehebung

### Keine Ausgabe im Terminal
- Drücken Sie mehrmals **Enter**, um die Konsole aufzuwecken
- Überprüfen Sie, ob die Baudrate mit der Konfiguration des Geräts übereinstimmt
- Versuchen Sie, das Konsolenkabel umzudrehen (einige Kabel sind unterschiedlich verdrahtet)
- Stellen Sie sicher, dass der USB-Treiber des Kabels geladen ist (prüfen Sie die Systemprotokolle der Probe)

### Unlesbarer Text
- Die Baudrate ist falsch; versuchen Sie zuerst 9600, dann 115200
- Überprüfen Sie die Einstellungen für Datenbits, Parität und Stoppbits
- Versuchen Sie ein anderes Konsolenkabel

### „Permission denied" am seriellen Port
- Der CMod-Dienst benötigt Zugriff auf `/dev/ttyUSB*`-Geräte
- Dies wird automatisch während der NetRecon OS-Einrichtung konfiguriert
- Bei einer benutzerdefinierten Installation fügen Sie den CMod-Dienstbenutzer zur Gruppe `dialout` hinzu

### Intermittierende Verbindungsabbrüche
- Das USB-Kabel könnte locker sein; stellen Sie eine feste Verbindung sicher
- Einige lange USB-Kabel verursachen Signalverschlechterung; verwenden Sie ein Kabel unter 3 Metern
- USB-Hubs können Probleme verursachen; verbinden Sie direkt mit dem USB-Port der Probe

## FAQ

**F: Kann ich den seriellen Modus remote über Admin Connect verwenden?**
A: Ja. Das serielle Terminal ist über das Web-Dashboard zugänglich, das über Cloudflare Tunnel erreichbar ist. Sie erhalten dieselbe interaktive Terminal-Erfahrung aus der Ferne.

**F: Wie viele serielle Verbindungen kann die Probe gleichzeitig verwalten?**
A: Eine serielle Verbindung pro USB-Port. Die meiste Probe-Hardware unterstützt 2-4 USB-Ports. Verwenden Sie einen aktiven USB-Hub für zusätzliche Verbindungen, obwohl direkte Verbindungen zuverlässiger sind.

**F: Kann ich serielle Konsolenbefehle automatisieren?**
A: Ja. Befehlsvorlagen funktionieren mit seriellen Verbindungen genauso wie mit SSH. Sie können Vorlagen für wiederkehrende serielle Aufgaben wie Passwortwiederherstellung oder Ersteinrichtung erstellen.

Für weitere Hilfe kontaktieren Sie [support@netreconapp.com](mailto:support@netreconapp.com).
