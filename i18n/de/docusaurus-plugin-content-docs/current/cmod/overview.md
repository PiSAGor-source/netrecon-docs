---
sidebar_position: 1
title: CMod-Übersicht
description: Netzwerkgeräte-Konfigurationsmanagement über SSH und serielle Konsole
---

# CMod — Konfigurationsmanagement

CMod (Configuration Module) ermöglicht es Ihnen, Netzwerkgeräte-Konfigurationen direkt über das NetRecon-Dashboard zu verwalten. Verbinden Sie sich mit Switches, Routern, Firewalls und anderen Netzwerkgeräten über SSH oder serielle Konsole, um Befehle auszuführen, Vorlagen anzuwenden und Konfigurationsänderungen nachzuverfolgen.

## Hauptfunktionen

- **SSH-Verbindungen** — Verbindung zu jedem Netzwerkgerät über SSH
- **Serielle Konsole** — Verbindung zu Geräten über USB-zu-Seriell-Adapter für Out-of-Band-Zugriff
- **Befehlsvorlagen** — vorgefertigte und benutzerdefinierte Befehlsvorlagen für gängige Operationen
- **Massenoperationen** — Befehle gleichzeitig auf mehreren Geräten ausführen
- **Echtzeit-Terminal** — interaktives WebSocket-basiertes Terminal in Ihrem Browser
- **Konfigurationssicherung** — laufende Konfigurationen automatisch speichern
- **Änderungsverfolgung** — Diff-basierte Verfolgung von Konfigurationsänderungen über die Zeit

## Architektur

CMod läuft als dedizierter Dienst auf der Probe (Port 8008) und verbindet sich in Ihrem Auftrag mit Netzwerkgeräten:

```
┌──────────┐    WebSocket     ┌──────────┐    SSH/Serial    ┌──────────────┐
│ Dashboard ├─────────────────► CMod     ├──────────────────► Network      │
│ (Browser) │                 │ Service  │                  │ Device       │
└──────────┘                  │ :8008    │                  │ (Switch/     │
                              └──────────┘                  │  Router/FW)  │
                                                            └──────────────┘
```

## Unterstützte Geräte

CMod unterstützt jedes Gerät, das SSH- oder serielle Konsolenverbindungen akzeptiert. Getestet und optimiert für:

| Hersteller | Gerätetypen | SSH | Seriell |
|---|---|---|---|
| Cisco | IOS, IOS-XE, NX-OS, ASA | Ja | Ja |
| Juniper | Junos | Ja | Ja |
| HP/Aruba | ProCurve, ArubaOS-Switch, ArubaOS-CX | Ja | Ja |
| MikroTik | RouterOS | Ja | Ja |
| Ubiquiti | EdgeOS, UniFi | Ja | Nein |
| Fortinet | FortiOS | Ja | Ja |
| Palo Alto | PAN-OS | Ja | Ja |
| Linux | Jedes SSH-fähige System | Ja | Ja |

## Erste Schritte

### Schritt 1: Gerät hinzufügen

1. Navigieren Sie zu **CMod > Geräte** im Probe-Dashboard
2. Klicken Sie auf **Gerät hinzufügen**
3. Geben Sie die Gerätedetails ein:
   - **Name**: eine aussagekräftige Bezeichnung (z.B. „Core Switch 1")
   - **IP-Adresse**: die Management-IP des Geräts
   - **Gerätetyp**: aus der Herstellerliste auswählen
   - **Verbindungstyp**: SSH oder Seriell
4. Geben Sie die Zugangsdaten ein (verschlüsselt in der lokalen Datenbank der Probe gespeichert)
5. Klicken Sie auf **Speichern & Testen**, um die Verbindung zu überprüfen

### Schritt 2: Mit einem Gerät verbinden

1. Klicken Sie auf ein Gerät in der CMod-Geräteliste
2. Wählen Sie **Terminal** für eine interaktive Sitzung oder **Vorlage ausführen** für einen vordefinierten Befehlssatz
3. Das Terminal öffnet sich in Ihrem Browser mit einer Live-Verbindung zum Gerät

### Schritt 3: Vorlage anwenden

1. Wählen Sie ein Gerät und klicken Sie auf **Vorlage ausführen**
2. Wählen Sie eine Vorlage aus der Bibliothek (z.B. „Show Running Config", „Show Interfaces")
3. Überprüfen Sie die Befehle, die ausgeführt werden
4. Klicken Sie auf **Ausführen**
5. Sehen Sie die Ausgabe in Echtzeit

Siehe [SSH-Modus](./ssh-mode.md) und [Serieller Modus](./serial-mode.md) für detaillierte Verbindungsanleitungen.

## Befehlsvorlagen

Vorlagen sind wiederverwendbare Befehlssätze, organisiert nach Gerätetyp:

### Integrierte Vorlagen

| Vorlage | Cisco IOS | Junos | ArubaOS | FortiOS |
|---|---|---|---|---|
| Running Config anzeigen | `show run` | `show config` | `show run` | `show full-config` |
| Interfaces anzeigen | `show ip int brief` | `show int terse` | `show int brief` | `get system interface` |
| Routing-Tabelle anzeigen | `show ip route` | `show route` | `show ip route` | `get router info routing` |
| ARP-Tabelle anzeigen | `show arp` | `show arp` | `show arp` | `get system arp` |
| MAC-Tabelle anzeigen | `show mac add` | `show eth-switch table` | `show mac-address` | `get system arp` |
| Konfiguration speichern | `write memory` | `commit` | `write memory` | `execute backup config` |

### Benutzerdefinierte Vorlagen

Erstellen Sie Ihre eigenen Vorlagen:

1. Navigieren Sie zu **CMod > Vorlagen**
2. Klicken Sie auf **Vorlage erstellen**
3. Wählen Sie den Zielgerätetyp
4. Geben Sie die Befehlssequenz ein (ein Befehl pro Zeile)
5. Fügen Sie Variablen für dynamische Werte hinzu (z.B. `{{interface}}`, `{{vlan_id}}`)
6. Speichern Sie die Vorlage

## FAQ

**F: Werden Gerätezugangsdaten sicher gespeichert?**
A: Ja. Alle Zugangsdaten werden verschlüsselt in der lokalen SQLite-Datenbank der Probe mit AES-256-Verschlüsselung gespeichert. Zugangsdaten werden niemals im Klartext übertragen.

**F: Kann ich CMod ohne eine Probe verwenden?**
A: Nein. CMod läuft als Dienst auf der Probe-Hardware. Es erfordert, dass die Probe sich im selben Netzwerk wie die Zielgeräte befindet (oder Routing zu ihnen hat).

**F: Unterstützt CMod SNMP?**
A: CMod konzentriert sich auf CLI-basiertes Management (SSH und seriell). SNMP-Überwachung wird von der Netzwerküberwachungs-Engine der Probe übernommen.

Für weitere Hilfe kontaktieren Sie [support@netreconapp.com](mailto:support@netreconapp.com).
