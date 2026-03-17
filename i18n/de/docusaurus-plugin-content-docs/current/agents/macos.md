---
sidebar_position: 3
title: macOS Agent
description: NetRecon Agent auf macOS installieren und bereitstellen
---

# macOS Agent

Installieren Sie den NetRecon Agent auf macOS-Endgeräten für kontinuierliche Überwachung und Inventarberichte.

## Voraussetzungen

- macOS 12 (Monterey) oder neuer
- Administratorrechte (für die Installation)
- Netzwerkverbindung zur Probe (direkt oder über Cloudflare Tunnel)
- Ein Registrierungstoken vom Probe-Dashboard

## Manuelle Installation

### Schritt 1: PKG herunterladen

Laden Sie `netrecon-agent-macos-universal.pkg` vom Probe-Dashboard herunter:
1. Melden Sie sich im Probe-Dashboard an
2. Navigieren Sie zu **Agents > Downloads**
3. Klicken Sie auf **macOS (PKG)**

Das Paket ist eine Universal Binary, die sowohl Intel (x86_64) als auch Apple Silicon (arm64) unterstützt.

### Schritt 2: Installer ausführen

1. Doppelklicken Sie auf die heruntergeladene PKG-Datei
2. Folgen Sie dem Installationsassistenten
3. Geben Sie bei Aufforderung ein:
   - **Server-URL**: die URL Ihrer Probe
   - **Registrierungstoken**: fügen Sie den Token vom Probe-Dashboard ein
4. Geben Sie Ihr macOS-Admin-Passwort ein, wenn Sie dazu aufgefordert werden
5. Klicken Sie auf **Installieren** und warten Sie auf den Abschluss

Der Agent wird unter `/Library/NetRecon/Agent/` installiert und als launchd-Dienst registriert.

### Schritt 3: Installation überprüfen

Öffnen Sie das Terminal:

```bash
sudo launchctl list | grep netrecon
```

Sie sollten `com.netrecon.agent` in der Ausgabe sehen. Prüfen Sie die Registrierung im Probe-Dashboard unter **Agents**.

## Befehlszeilen-Installation

Für skriptgesteuerte Installation:

```bash
sudo installer -pkg netrecon-agent-macos-universal.pkg -target /

# Agent konfigurieren
sudo /Library/NetRecon/Agent/netrecon-agent configure \
  --server-url "https://probe.netreconapp.com" \
  --enrollment-token "your-token-here"

# Agent starten
sudo launchctl load /Library/LaunchDaemons/com.netrecon.agent.plist
```

## Jamf-Bereitstellung

Stellen Sie den Agent im großen Maßstab mit Jamf Pro bereit.

### Schritt 1: Paket hochladen

1. Melden Sie sich bei Jamf Pro an
2. Navigieren Sie zu **Settings > Computer Management > Packages**
3. Klicken Sie auf **New**
4. Laden Sie `netrecon-agent-macos-universal.pkg` hoch
5. Speichern Sie das Paket

### Schritt 2: Richtlinie erstellen

1. Navigieren Sie zu **Computers > Policies**
2. Klicken Sie auf **New**
3. Konfigurieren Sie die Richtlinie:
   - **General**: Benennen Sie sie „NetRecon Agent Deployment"
   - **Packages**: Fügen Sie das NetRecon Agent PKG hinzu, setzen Sie auf **Install**
   - **Scripts**: Fügen Sie ein Post-Install-Skript hinzu (siehe unten)
   - **Scope**: Ziel-Computergruppen auswählen
   - **Trigger**: Setzen Sie auf **Enrollment Complete** und/oder **Recurring Check-in**

### Post-Install-Skript

```bash
#!/bin/bash
/Library/NetRecon/Agent/netrecon-agent configure \
  --server-url "https://probe.netreconapp.com" \
  --enrollment-token "your-fleet-token"

launchctl load /Library/LaunchDaemons/com.netrecon.agent.plist
```

### Schritt 3: Bereitstellen

1. Speichern Sie die Richtlinie
2. Überwachen Sie die Bereitstellung unter **Computers > Policy Logs**

## MDM-Bereitstellung

Bereitstellung über jede MDM-Lösung, die PKG-Verteilung unterstützt.

### Konfigurationsprofil

Erstellen Sie ein Konfigurationsprofil zur Vorkonfiguration des Agents:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>PayloadContent</key>
  <array>
    <dict>
      <key>PayloadType</key>
      <string>com.netrecon.agent</string>
      <key>ServerURL</key>
      <string>https://probe.netreconapp.com</string>
      <key>EnrollmentToken</key>
      <string>your-fleet-token</string>
      <key>HeartbeatInterval</key>
      <integer>30</integer>
      <key>ReportInterval</key>
      <integer>900</integer>
    </dict>
  </array>
  <key>PayloadDisplayName</key>
  <string>NetRecon Agent Configuration</string>
  <key>PayloadIdentifier</key>
  <string>com.netrecon.agent.config</string>
  <key>PayloadType</key>
  <string>Configuration</string>
  <key>PayloadVersion</key>
  <integer>1</integer>
</dict>
</plist>
```

Stellen Sie dieses Profil zusammen mit dem PKG-Paket über Ihr MDM bereit.

## macOS-Berechtigungen

Der Agent benötigt möglicherweise die folgenden macOS-Berechtigungen:

| Berechtigung | Zweck | Gewährung |
|---|---|---|
| Vollständiger Festplattenzugriff | Liste der installierten Software lesen | Systemeinstellungen > Datenschutz & Sicherheit |
| Netzwerkzugriff | Daten an Probe senden | Automatisch gewährt |

Für MDM-verwaltete Bereitstellungen gewähren Sie den vollständigen Festplattenzugriff über ein PPPC-Profil (Privacy Preferences Policy Control):

```xml
<key>Services</key>
<dict>
  <key>SystemPolicyAllFiles</key>
  <array>
    <dict>
      <key>Identifier</key>
      <string>com.netrecon.agent</string>
      <key>IdentifierType</key>
      <string>bundleID</string>
      <key>Allowed</key>
      <true/>
    </dict>
  </array>
</dict>
```

## Agent-Verwaltung

### Konfigurationsdatei

```
/Library/NetRecon/Agent/config.yaml
```

```yaml
server_url: "https://probe.netreconapp.com"
heartbeat_interval: 30
report_interval: 900
log_level: "info"
log_file: "/Library/NetRecon/Agent/logs/agent.log"
```

### Dienst-Befehle

```bash
# Agent stoppen
sudo launchctl unload /Library/LaunchDaemons/com.netrecon.agent.plist

# Agent starten
sudo launchctl load /Library/LaunchDaemons/com.netrecon.agent.plist

# Status prüfen
sudo launchctl list | grep netrecon
```

### Deinstallation

```bash
# Dienst stoppen
sudo launchctl unload /Library/LaunchDaemons/com.netrecon.agent.plist

# Dateien entfernen
sudo rm -rf /Library/NetRecon/Agent/
sudo rm /Library/LaunchDaemons/com.netrecon.agent.plist

# Quittungen entfernen
sudo pkgutil --forget com.netrecon.agent
```

## Fehlerbehebung

### Agent startet nach der Installation nicht
- Systemprotokoll prüfen: `log show --predicate 'subsystem == "com.netrecon.agent"' --last 5m`
- Überprüfen, ob die plist existiert: `ls -la /Library/LaunchDaemons/com.netrecon.agent.plist`
- Dateiberechtigungen der Agent-Binärdatei prüfen

### Berechtigungsfehler im Protokoll
- Vollständigen Festplattenzugriff wie oben beschrieben gewähren
- Für MDM: PPPC-Profil vor der Agent-Installation bereitstellen

### Agent verbindet sich nicht mit der Probe
- Server-URL überprüfen: `curl -I https://probe.netreconapp.com/api/health`
- Prüfen, ob die macOS-Firewall ausgehende Verbindungen blockiert
- Registrierungstoken-Gültigkeit überprüfen

## FAQ

**F: Unterstützt der Agent Apple Silicon nativ?**
A: Ja. Das PKG ist eine Universal Binary, die nativ sowohl auf Intel- als auch auf Apple Silicon-Macs läuft.

**F: Funktioniert der Agent auf macOS-VMs?**
A: Ja, der Agent funktioniert in VMware Fusion, Parallels und UTM virtuellen Maschinen.

**F: Wird macOS Gatekeeper die Installation blockieren?**
A: Das PKG ist von Apple signiert und notarisiert. Falls Gatekeeper bei manueller Installation blockiert, klicken Sie mit der rechten Maustaste auf das PKG und wählen Sie **Öffnen**, um die Warnung zu umgehen.

Für weitere Hilfe kontaktieren Sie [support@netreconapp.com](mailto:support@netreconapp.com).
