---
sidebar_position: 2
title: Aus Scan importieren
description: Entdeckte IPs automatisch aus Scanergebnissen in IPAM importieren
---

# Aus Scan importieren

IPAM kann entdeckte Geräte automatisch aus Scanergebnissen importieren, wodurch manuelle Dateneingabe entfällt und Ihr IP-Inventar aktuell bleibt.

## Voraussetzungen

- Mindestens ein abgeschlossener Netzwerkscan mit Ergebnissen
- Das Zielsubnetz in IPAM definiert (oder Bereitschaft, eines während des Imports zu erstellen)
- Analyst-, Operator-, Admin- oder Super-Admin-Rolle

## Funktionsweise des Imports

Wenn Sie Scanergebnisse in IPAM importieren:

1. Jede entdeckte IP-Adresse wird gegen bestehende IPAM-Einträge geprüft
2. Neue IPs werden mit dem Status „Zugewiesen" erstellt
3. Bestehende IPs werden mit der aktuellsten MAC-Adresse, Hostname und dem Zeitstempel „Zuletzt gesehen" aktualisiert
4. Konflikte (z.B. MAC-Adresse hat sich für eine IP geändert) werden zur Überprüfung markiert
5. Ein Zusammenfassungsbericht zeigt, was importiert wurde und was Aufmerksamkeit erfordert

## Schritt-für-Schritt-Import

### Schritt 1: Import-Dialog öffnen

**Über IPAM:**
1. Navigieren Sie zu **IPAM > Subnetze**
2. Wählen Sie das Zielsubnetz
3. Klicken Sie auf **Aus Scan importieren**

**Über Scanergebnisse:**
1. Navigieren Sie zu **Scan > Ergebnisse**
2. Wählen Sie einen abgeschlossenen Scan
3. Klicken Sie auf **Nach IPAM exportieren**

### Schritt 2: Scan auswählen

Wählen Sie, welche Scanergebnisse importiert werden sollen:

| Option | Beschreibung |
|---|---|
| Letzter Scan | Vom neuesten Scan importieren |
| Bestimmter Scan | Einen Scan nach Datum/Uhrzeit auswählen |
| Alle Scans (zusammenführen) | Ergebnisse aus mehreren Scans kombinieren |

### Schritt 3: Importvorschau überprüfen

Überprüfen Sie vor dem Import die Vorschautabelle:

| Spalte | Beschreibung |
|---|---|
| IP-Adresse | Die entdeckte IP |
| MAC-Adresse | Zugehörige MAC |
| Hostname | Entdeckter Hostname |
| Aktion | Neu / Aktualisieren / Konflikt |
| Details | Was sich ändern wird |

- **Neu** — diese IP existiert nicht in IPAM und wird erstellt
- **Aktualisieren** — diese IP existiert und wird mit neuen Daten aktualisiert
- **Konflikt** — diese IP hat widersprüchliche Daten (siehe Konfliktlösung unten)

### Schritt 4: Konflikte lösen

Konflikte treten auf, wenn:

- **MAC-Adressen-Abweichung** — die IP existiert in IPAM mit einer anderen MAC-Adresse als der Scan gefunden hat
- **Doppelte MAC** — dieselbe MAC-Adresse erscheint bei mehreren IPs
- **Status-Konflikt** — die IP ist in IPAM als „Reserviert" markiert, wurde aber im Scan als aktiv gefunden

Wählen Sie für jeden Konflikt eine Lösung:

| Lösung | Aktion |
|---|---|
| **IPAM beibehalten** | Scandaten ignorieren, bestehenden IPAM-Eintrag behalten |
| **Scan verwenden** | IPAM-Daten mit Scanergebnissen überschreiben |
| **Zur Überprüfung markieren** | Daten importieren, aber als „Überprüfung erforderlich" markieren |

### Schritt 5: Importieren

1. Nachdem alle Konflikte gelöst sind, klicken Sie auf **Importieren**
2. Ein Fortschrittsbalken zeigt den Importstatus
3. Nach Abschluss wird eine Zusammenfassung angezeigt:
   - Erstellte IPs
   - Aktualisierte IPs
   - Gelöste Konflikte
   - Fehler (falls vorhanden)

## Auto-Import

Automatischen Import nach jedem Scan konfigurieren:

1. Navigieren Sie zu **IPAM > Einstellungen > Auto-Import**
2. Aktivieren Sie **Scanergebnisse automatisch importieren**
3. Optionen konfigurieren:

| Option | Standard | Beschreibung |
|---|---|---|
| Neue IPs erstellen | Ja | Automatisch neue IP-Einträge erstellen |
| Bestehende aktualisieren | Ja | Bestehende Einträge mit aktuellen Daten aktualisieren |
| Konfliktbehandlung | Zur Überprüfung markieren | Umgang mit Konflikten |
| Subnetz automatisch erstellen | Nein | Subnetz in IPAM erstellen, wenn es nicht existiert |

4. Klicken Sie auf **Speichern**

Mit aktiviertem Auto-Import bleibt IPAM ohne manuelles Eingreifen mit Ihren Scandaten synchronisiert.

## Import aus CSV

Sie können auch IP-Daten aus externen Quellen importieren:

1. Navigieren Sie zu **IPAM > Importieren > CSV**
2. Laden Sie die CSV-Vorlage herunter
3. Füllen Sie Ihre Daten gemäß dem Vorlagenformat aus:

```csv
ip_address,mac_address,hostname,status,owner,notes
192.168.1.10,AA:BB:CC:DD:EE:01,fileserver,Assigned,IT Dept,Primary NAS
192.168.1.11,AA:BB:CC:DD:EE:02,printer-01,Assigned,Office,2nd floor
192.168.1.20,,reserved-ip,Reserved,IT Dept,Future use
```

4. CSV hochladen und Vorschau überprüfen
5. Konflikte lösen
6. Klicken Sie auf **Importieren**

## Datenanreicherung

Während des Imports reichert IPAM die Daten automatisch an:

| Feld | Quelle |
|---|---|
| Hersteller | OUI-Datenbank-Abfrage aus MAC-Adresse |
| Gerätetyp | Profilierungsdaten der Scan-Engine |
| Offene Ports | Port-Scan-Ergebnisse |
| Dienste | Diensterkennungsergebnisse |
| Zuletzt gesehen | Scan-Zeitstempel |

## FAQ

**F: Überschreibt der Import meine manuellen Notizen und Eigentümerzuweisungen?**
A: Nein. Der Import aktualisiert nur technische Felder (MAC, Hostname, Zuletzt gesehen). Benutzerdefinierte Felder wie Eigentümer, Notizen und Status bleiben erhalten, es sei denn, Sie wählen explizit „Scan verwenden" für einen Konflikt.

**F: Kann ich einen Import rückgängig machen?**
A: Ja. Jeder Import erstellt einen Snapshot. Navigieren Sie zu **IPAM > Importverlauf** und klicken Sie auf **Zurücksetzen** beim gewünschten Import.

**F: Was passiert mit IPs, die in IPAM waren, aber nicht im Scan gefunden wurden?**
A: Sie bleiben unverändert. Ein Gerät, das nicht in einem Scan erscheint, bedeutet nicht, dass es verschwunden ist — es könnte ausgeschaltet oder in einem anderen VLAN sein. Verwenden Sie den Bericht „Veraltete IPs" (**IPAM > Berichte > Veraltete IPs**), um IPs zu finden, die seit einem konfigurierbaren Zeitraum nicht gesehen wurden.

**F: Kann ich aus mehreren Subnetzen gleichzeitig importieren?**
A: Ja. Wenn Ihr Scan mehrere Subnetze abdeckt, verteilt der Import die IPs basierend auf ihren Adressen an die korrekten IPAM-Subnetze. Subnetze müssen bereits in IPAM existieren (oder aktivieren Sie „Subnetz automatisch erstellen" in den Auto-Import-Einstellungen).

Für weitere Hilfe kontaktieren Sie [support@netreconapp.com](mailto:support@netreconapp.com).
