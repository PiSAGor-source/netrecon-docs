---
sidebar_position: 2
title: SSH-Modus
description: Verbindung zu Netzwerkgeräten über SSH für Konfigurationsmanagement
---

# SSH-Modus

Der SSH-Modus ermöglicht es Ihnen, sich über das Netzwerk mit dem SSH-Protokoll mit Netzwerkgeräten zu verbinden. Dies ist die gebräuchlichste Verbindungsmethode für die Verwaltung von Switches, Routern, Firewalls und Servern.

## Voraussetzungen

- Das Zielgerät hat SSH aktiviert
- Die Probe hat Netzwerkverbindung zur Management-IP des Geräts
- Gültige SSH-Zugangsdaten (Benutzername/Passwort oder SSH-Schlüssel)
- Der SSH-Port des Geräts ist erreichbar (Standard: 22)

## SSH-Verbindung einrichten

### Schritt 1: Gerät hinzufügen

1. Navigieren Sie zu **CMod > Geräte**
2. Klicken Sie auf **Gerät hinzufügen**
3. Füllen Sie die Verbindungsdetails aus:

| Feld | Beschreibung | Beispiel |
|---|---|---|
| Name | Aussagekräftiger Gerätename | Core-SW-01 |
| IP-Adresse | Management-IP | 192.168.1.1 |
| Port | SSH-Port | 22 |
| Gerätetyp | Hersteller/OS | Cisco IOS |
| Benutzername | SSH-Benutzername | admin |
| Authentifizierung | Passwort oder SSH-Schlüssel | Passwort |
| Passwort | SSH-Passwort | (verschlüsselt) |

4. Klicken Sie auf **Speichern & Testen**

### Schritt 2: Verbindung testen

Wenn Sie auf **Speichern & Testen** klicken, wird CMod:
1. Eine TCP-Verbindung zur angegebenen IP und Port versuchen
2. Den SSH-Schlüsselaustausch durchführen
3. Mit den bereitgestellten Zugangsdaten authentifizieren
4. Einen einfachen Befehl ausführen (z.B. `show version`), um die Sitzung zu verifizieren
5. Das Ergebnis anzeigen und das Gerät als „Verbunden" markieren oder einen Fehler melden

### Schritt 3: Terminal öffnen

1. Klicken Sie auf das Gerät in der CMod-Geräteliste
2. Klicken Sie auf **Terminal**
3. Ein interaktives SSH-Terminal öffnet sich in Ihrem Browser über WebSocket
4. Sie können Befehle eingeben, als wären Sie direkt mit dem Gerät verbunden

## SSH-Schlüssel-Authentifizierung

Für schlüsselbasierte Authentifizierung:

1. Wählen Sie beim Hinzufügen eines Geräts **SSH-Schlüssel** als Authentifizierungsmethode
2. Fügen Sie Ihren privaten Schlüssel (PEM-Format) in das Schlüsselfeld ein
3. Geben Sie optional eine Schlüssel-Passphrase an
4. Der öffentliche Schlüssel muss bereits auf dem Zielgerät installiert sein

:::tip
SSH-Schlüssel-Authentifizierung ist sicherer und für Produktionsumgebungen empfohlen. Sie ermöglicht auch unbeaufsichtigte Operationen wie geplante Konfigurationssicherungen.
:::

## Verbindungseinstellungen

### Timeout-Konfiguration

| Einstellung | Standard | Bereich |
|---|---|---|
| Verbindungs-Timeout | 10 Sekunden | 5-60 Sekunden |
| Befehls-Timeout | 30 Sekunden | 10-300 Sekunden |
| Leerlauf-Timeout | 15 Minuten | 5-60 Minuten |
| Keep-Alive-Intervall | 30 Sekunden | 10-120 Sekunden |

Konfigurieren Sie diese unter **CMod > Einstellungen > SSH**.

### SSH-Optionen

| Option | Standard | Beschreibung |
|---|---|---|
| Strikte Host-Key-Prüfung | Deaktiviert | SSH-Host-Key des Geräts verifizieren |
| Bevorzugte Chiffren | Auto | Reihenfolge der Chiffren-Aushandlung überschreiben |
| Terminal-Typ | xterm-256color | Terminal-Emulationstyp |
| Terminal-Größe | 80x24 | Spalten x Zeilen |

## Befehle ausführen

### Interaktives Terminal

Das WebSocket-Terminal bietet eine interaktive Echtzeit-Sitzung:
- Volle ANSI-Farbunterstützung
- Tab-Vervollständigung (wird an das Gerät weitergeleitet)
- Befehlsverlauf (Pfeiltasten hoch/runter)
- Kopieren/Einfügen-Unterstützung
- Sitzungsaufzeichnung (optional)

### Befehlsvorlagen

Vordefinierte Befehlssequenzen ausführen:

1. Gerät auswählen
2. Klicken Sie auf **Vorlage ausführen**
3. Vorlage auswählen
4. Falls die Vorlage Variablen hat, Werte eingeben
5. Klicken Sie auf **Ausführen**

Beispielvorlage mit Variablen:

```
configure terminal
interface {{interface}}
description {{description}}
switchport mode access
switchport access vlan {{vlan_id}}
no shutdown
end
write memory
```

### Massenausführung

Denselben Befehl oder dieselbe Vorlage auf mehreren Geräten ausführen:

1. Navigieren Sie zu **CMod > Massenoperationen**
2. Zielgeräte auswählen (Kontrollkästchen)
3. Vorlage auswählen oder Befehl eingeben
4. Klicken Sie auf **Auf Ausgewählten ausführen**
5. Ergebnisse werden pro Gerät in einer Tab-Ansicht angezeigt

## Konfigurationssicherung über SSH

CMod kann Gerätekonfigurationen automatisch sichern:

1. Navigieren Sie zu **CMod > Sicherungsplan**
2. Klicken Sie auf **Plan hinzufügen**
3. Zu sichernde Geräte auswählen
4. Zeitplan festlegen (täglich, wöchentlich oder benutzerdefinierter Cron)
5. Sicherungsbefehlsvorlage auswählen (z.B. „Show Running Config")
6. Klicken Sie auf **Speichern**

Gesicherte Konfigurationen werden auf der Probe gespeichert und enthalten:
- Zeitstempel
- Geräte-Hostname
- Konfigurationsdiff zur vorherigen Sicherung
- Vollständiger Konfigurationstext

## Fehlerbehebung

### Verbindung abgelehnt
- Überprüfen Sie, ob SSH auf dem Zielgerät aktiviert ist
- Bestätigen Sie, dass IP-Adresse und Port korrekt sind
- Prüfen Sie, ob keine Firewall die Verbindung zwischen Probe und Gerät blockiert

### Authentifizierung fehlgeschlagen
- Überprüfen Sie, ob Benutzername und Passwort/Schlüssel korrekt sind
- Einige Geräte sperren nach mehreren Fehlversuchen; warten Sie und versuchen Sie es erneut
- Prüfen Sie, ob das Gerät eine bestimmte SSH-Protokollversion erfordert (SSHv2)

### Terminal hängt oder reagiert nicht
- Das Gerät wartet möglicherweise auf die Fertigstellung eines Befehls; drücken Sie Strg+C
- Überprüfen Sie die Befehls-Timeout-Einstellung
- Stellen Sie sicher, dass das Keep-Alive-Intervall konfiguriert ist

### Befehle erzeugen unerwartete Ausgabe
- Stellen Sie sicher, dass der richtige Gerätetyp ausgewählt ist; verschiedene Hersteller verwenden unterschiedliche Befehlssyntax
- Einige Befehle erfordern einen erhöhten Berechtigungsmodus (z.B. `enable` bei Cisco)

## FAQ

**F: Kann ich SSH-Jump-Hosts / Bastion-Hosts verwenden?**
A: Derzeit nicht. CMod verbindet sich direkt von der Probe zum Zielgerät. Stellen Sie sicher, dass die Probe Routing zu allen verwalteten Geräten hat.

**F: Werden SSH-Sitzungen protokolliert?**
A: Ja. Alle über CMod ausgeführten Befehle werden im Audit-Trail mit Benutzername, Zeitstempel, Gerät und Befehlstext protokolliert.

**F: Kann ich Dateien per SSH auf ein Gerät hochladen?**
A: SCP/SFTP-Dateiübertragung ist für eine zukünftige Version geplant. Derzeit unterstützt CMod nur Befehlszeilen-Interaktion.

Für weitere Hilfe kontaktieren Sie [support@netreconapp.com](mailto:support@netreconapp.com).
