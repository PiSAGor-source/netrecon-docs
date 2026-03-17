---
sidebar_position: 2
title: Windows Agent
description: NetRecon Agent auf Windows installieren und bereitstellen
---

# Windows Agent

Installieren Sie den NetRecon Agent auf Windows-Endgeräten für kontinuierliche Überwachung und Inventarberichte.

## Voraussetzungen

- Windows 10 oder neuer / Windows Server 2016 oder neuer
- Lokale Administratorrechte (für die Installation)
- Netzwerkverbindung zur Probe (direkt oder über Cloudflare Tunnel)
- Ein Registrierungstoken vom Probe-Dashboard

## Manuelle Installation

### Schritt 1: MSI herunterladen

Laden Sie `netrecon-agent-windows-x64.msi` vom Probe-Dashboard herunter:
1. Melden Sie sich im Probe-Dashboard an
2. Navigieren Sie zu **Agents > Downloads**
3. Klicken Sie auf **Windows (MSI)**

### Schritt 2: Installer ausführen

1. Doppelklicken Sie auf die heruntergeladene MSI-Datei
2. Klicken Sie auf **Weiter** im Willkommensbildschirm
3. Geben Sie die Konfigurationsdetails ein:
   - **Server-URL**: die URL Ihrer Probe (z. B. `https://probe.netreconapp.com`)
   - **Registrierungstoken**: fügen Sie den Token vom Probe-Dashboard ein
4. Klicken Sie auf **Installieren**
5. Klicken Sie auf **Fertig stellen**, wenn die Installation abgeschlossen ist

Der Agent wird unter `C:\Program Files\NetRecon\Agent\` installiert und als Windows-Dienst namens `NetReconAgent` registriert.

### Schritt 3: Installation überprüfen

Öffnen Sie eine Eingabeaufforderung als Administrator:

```powershell
sc query NetReconAgent
```

Der Dienst sollte `STATE: RUNNING` anzeigen.

Prüfen Sie den Registrierungsstatus im Probe-Dashboard unter **Agents** — das neue Endgerät sollte innerhalb von 30 Sekunden erscheinen.

## Unbeaufsichtigte Installation

Für skriptgesteuerte oder unbeaufsichtigte Installation:

```powershell
msiexec /i netrecon-agent-windows-x64.msi /quiet /norestart SERVER_URL="https://probe.netreconapp.com" ENROLLMENT_TOKEN="your-token-here"
```

## SCCM-Bereitstellung

Stellen Sie den Agent auf Tausenden von Windows-Endgeräten mit Microsoft SCCM (System Center Configuration Manager) bereit.

### Schritt 1: Paket erstellen

1. Öffnen Sie die SCCM-Konsole
2. Navigieren Sie zu **Software Library > Application Management > Applications**
3. Klicken Sie auf **Create Application**
4. Wählen Sie **Windows Installer (MSI file)** und navigieren Sie zur MSI
5. Vervollständigen Sie den Assistenten mit folgendem Installationsbefehl:

```
msiexec /i netrecon-agent-windows-x64.msi /quiet /norestart SERVER_URL="https://probe.netreconapp.com" ENROLLMENT_TOKEN="your-fleet-token"
```

### Schritt 2: Erkennung konfigurieren

Erkennungsregel festlegen:
- **Typ**: Dateisystem
- **Pfad**: `C:\Program Files\NetRecon\Agent\`
- **Datei**: `netrecon-agent.exe`
- **Eigenschaft**: Datei existiert

### Schritt 3: Bereitstellen

1. Rechtsklicken Sie auf die Anwendung und wählen Sie **Deploy**
2. Wählen Sie Ihre Zielgerätesammlung
3. Setzen Sie den Bereitstellungszweck auf **Required**
4. Konfigurieren Sie den Zeitplan
5. Klicken Sie durch den Assistenten und stellen Sie bereit

## Intune-Bereitstellung

Bereitstellung über Microsoft Intune für Cloud-verwaltete Endgeräte.

### Schritt 1: Paket vorbereiten

1. Konvertieren Sie die MSI in ein `.intunewin`-Paket mit dem [Intune Win32 Content Prep Tool](https://github.com/Microsoft/Microsoft-Win32-Content-Prep-Tool):

```powershell
IntuneWinAppUtil.exe -c .\source -s netrecon-agent-windows-x64.msi -o .\output
```

### Schritt 2: App in Intune erstellen

1. Gehen Sie zu **Microsoft Intune Admin Center > Apps > Windows**
2. Klicken Sie auf **Add > Windows app (Win32)**
3. Laden Sie die `.intunewin`-Datei hoch
4. Konfigurieren Sie:
   - **Installationsbefehl**: `msiexec /i netrecon-agent-windows-x64.msi /quiet /norestart SERVER_URL="https://probe.netreconapp.com" ENROLLMENT_TOKEN="your-fleet-token"`
   - **Deinstallationsbefehl**: `msiexec /x {product-code} /quiet`
   - **Erkennungsregel**: Datei existiert unter `C:\Program Files\NetRecon\Agent\netrecon-agent.exe`

### Schritt 3: Zuweisen

1. Einer Gerätegruppe oder allen Geräten zuweisen
2. Als **Required** für automatische Bereitstellung festlegen
3. Bereitstellungsstatus im Intune-Portal überwachen

## GPO-Bereitstellung

Bereitstellung über Gruppenrichtlinien für Active Directory-Umgebungen.

### Schritt 1: Freigabe vorbereiten

1. Kopieren Sie die MSI auf eine Netzwerkfreigabe, die für alle Zielcomputer zugänglich ist:
   ```
   \\fileserver\software\netrecon\netrecon-agent-windows-x64.msi
   ```
2. Stellen Sie sicher, dass die Freigabe Leseberechtigungen für **Domänencomputer** hat

### Schritt 2: GPO erstellen

1. Öffnen Sie die **Gruppenrichtlinien-Verwaltungskonsole**
2. Erstellen Sie ein neues GPO, das mit der Ziel-OU verknüpft ist
3. Navigieren Sie zu **Computerkonfiguration > Richtlinien > Softwareeinstellungen > Softwareinstallation**
4. Rechtsklicken Sie und wählen Sie **Neu > Paket**
5. Navigieren Sie zur MSI auf der Netzwerkfreigabe
6. Wählen Sie die Bereitstellungsmethode **Zugewiesen**

### Schritt 3: Parameter konfigurieren

Da die GPO-Softwareinstallation keine MSI-Eigenschaften direkt unterstützt, erstellen Sie eine Transformationsdatei (MST) oder verwenden Sie stattdessen ein Startskript:

Erstellen Sie ein Startskript unter `\\fileserver\scripts\install-netrecon-agent.bat`:

```batch
@echo off
if not exist "C:\Program Files\NetRecon\Agent\netrecon-agent.exe" (
    msiexec /i "\\fileserver\software\netrecon\netrecon-agent-windows-x64.msi" /quiet /norestart SERVER_URL="https://probe.netreconapp.com" ENROLLMENT_TOKEN="your-fleet-token"
)
```

Weisen Sie dieses Skript unter **Computerkonfiguration > Richtlinien > Windows-Einstellungen > Skripts > Systemstart** zu.

## Agent-Verwaltung

### Konfigurationsdatei

Die Agent-Konfiguration wird gespeichert unter:
```
C:\Program Files\NetRecon\Agent\config.yaml
```

```yaml
server_url: "https://probe.netreconapp.com"
heartbeat_interval: 30
report_interval: 900
log_level: "info"
log_file: "C:\\Program Files\\NetRecon\\Agent\\logs\\agent.log"
```

### Dienst-Befehle

```powershell
# Agent stoppen
net stop NetReconAgent

# Agent starten
net start NetReconAgent

# Agent neu starten
net stop NetReconAgent && net start NetReconAgent
```

### Deinstallation

Über die Systemsteuerung:
1. Öffnen Sie **Einstellungen > Apps > Installierte Apps**
2. Suchen Sie „NetRecon Agent"
3. Klicken Sie auf **Deinstallieren**

Über die Befehlszeile:
```powershell
msiexec /x netrecon-agent-windows-x64.msi /quiet
```

## Fehlerbehebung

### Agent erscheint nicht im Dashboard
- Überprüfen Sie, ob der Dienst läuft: `sc query NetReconAgent`
- Prüfen Sie das Agent-Protokoll: `C:\Program Files\NetRecon\Agent\logs\agent.log`
- Stellen Sie sicher, dass die SERVER_URL korrekt und erreichbar ist
- Überprüfen Sie, ob der Registrierungstoken gültig und nicht abgelaufen ist

### Dienst startet nicht
- Prüfen Sie die Windows-Ereignisanzeige auf Fehler im **Anwendungs**-Protokoll
- Überprüfen Sie, ob die config.yaml-Datei gültiges YAML ist
- Stellen Sie sicher, dass Port 443 ausgehend nicht durch eine Firewall blockiert wird

### Hoher Ressourcenverbrauch
- Prüfen Sie das Protokoll auf Fehler, die schnelle Wiederholungen verursachen
- Überprüfen Sie, ob die Heartbeat- und Berichtsintervalle nicht zu niedrig eingestellt sind
- Starten Sie den Dienst neu, um angesammelten Zustand zu löschen

## FAQ

**F: Funktioniert der Agent auf Windows ARM (z. B. Surface Pro X)?**
A: Derzeit unterstützt der Agent nur die x64-Architektur. ARM64-Unterstützung ist geplant.

**F: Kann ich den Agent neben anderen Überwachungsagenten installieren?**
A: Ja. Der NetRecon Agent ist so konzipiert, dass er konfliktfrei mit anderen Überwachungstools koexistiert.

**F: Überlebt der Agent Windows-Updates und Neustarts?**
A: Ja. Der Agent läuft als Windows-Dienst mit automatischem Start und wird nach jedem Neustart erneut gestartet.

Für weitere Hilfe kontaktieren Sie [support@netreconapp.com](mailto:support@netreconapp.com).
