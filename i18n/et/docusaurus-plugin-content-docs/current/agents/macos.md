---
sidebar_position: 3
title: macOS agent
description: Installige ja juurutage NetReconi agent macOS-is
---

# macOS agent

Installige NetReconi agent macOS-i lõppseadmetele pidevaks jälgimiseks ja inventuuri raporteerimiseks.

## Eeltingimused

- macOS 12 (Monterey) või uuem
- Administraatori õigused (paigaldamiseks)
- Võrguühendus sondiga (otse või Cloudflare Tunneli kaudu)
- Registreerimistõend sondi juhtpaneelilt

## Käsitsi paigaldamine

### 1. samm: laadige alla PKG

Laadige `netrecon-agent-macos-universal.pkg` sondi juhtpaneelilt alla:
1. Logige sondi juhtpaneelile sisse
2. Navigeerige **Agendid > Allalaadimised**
3. Klõpsake **macOS (PKG)**

Pakett on universaalne binaarne, mis toetab nii Intel (x86_64) kui Apple Silicon (arm64).

### 2. samm: käivitage installer

1. Topeltklõpsake allalaaditud PKG-failil
2. Järgige paigaldusviisardit
3. Kui küsitakse, sisestage:
   - **Serveri URL**: teie sondi URL
   - **Registreerimistõend**: kleepige tõend sondi juhtpaneelilt
4. Sisestage oma macOS-i administraatori parool, kui küsitakse
5. Klõpsake **Installi** ja oodake lõpuleviimist

Agent installitakse kausta `/Library/NetRecon/Agent/` ja registreeritakse launchd teenusena.

### 3. samm: kontrollige paigaldust

Avage Terminal:

```bash
sudo launchctl list | grep netrecon
```

Väljundis peaks olema `com.netrecon.agent`. Kontrollige registreerimist sondi juhtpaneelil **Agendid** all.

## Käsurealt paigaldamine

Skriptitud paigaldamiseks:

```bash
sudo installer -pkg netrecon-agent-macos-universal.pkg -target /

# Konfigureerige agent
sudo /Library/NetRecon/Agent/netrecon-agent configure \
  --server-url "https://probe.netreconapp.com" \
  --enrollment-token "your-token-here"

# Käivitage agent
sudo launchctl load /Library/LaunchDaemons/com.netrecon.agent.plist
```

## Jamf juurutamine

Juurutage agent mastaabis Jamf Pro abil.

### 1. samm: laadige pakett üles

1. Logige Jamf Pro-sse sisse
2. Navigeerige **Settings > Computer Management > Packages**
3. Klõpsake **New**
4. Laadige üles `netrecon-agent-macos-universal.pkg`
5. Salvestage pakett

### 2. samm: looge poliitika

1. Navigeerige **Computers > Policies**
2. Klõpsake **New**
3. Konfigureerige poliitika:
   - **General**: Nimetage see "NetRecon Agent Deployment"
   - **Packages**: Lisage NetReconi agendi PKG, seadistage **Install** peale
   - **Scripts**: Lisage pärast installimist skript (vaadake allpool)
   - **Scope**: Valige soovitud arvutigrupid
   - **Trigger**: Seadistage **Enrollment Complete** ja/või **Recurring Check-in** peale

### Pärast installimist skript

```bash
#!/bin/bash
/Library/NetRecon/Agent/netrecon-agent configure \
  --server-url "https://probe.netreconapp.com" \
  --enrollment-token "your-fleet-token"

launchctl load /Library/LaunchDaemons/com.netrecon.agent.plist
```

### 3. samm: juurutage

1. Salvestage poliitika
2. Jälgige juurutamist menüüs **Computers > Policy Logs**

## MDM juurutamine

Juurutage mis tahes MDM-lahenduse kaudu, mis toetab PKG levitamist.

### Konfiguratsiooniprofiil

Looge konfiguratsiooniprofiil agendi eelkonfigureerimiseks:

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

Juurutage see profiil koos PKG-paketiga oma MDM-i kaudu.

## macOS-i õigused

Agent võib vajada järgmisi macOS-i õigusi:

| Õigus | Otstarve | Kuidas anda |
|---|---|---|
| Täielik kettajuurdepääs | Installitud tarkvara loendi lugemine | Süsteemi seaded > Privaatsus ja turvalisus |
| Võrgujuurdepääs | Andmete saatmine sondile | Antakse automaatselt |

MDM-hallatavate juurutuste jaoks andke Täielik kettajuurdepääs PPPC (Privacy Preferences Policy Control) profiili kaudu:

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

## Agendi haldamine

### Konfiguratsioonifail

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

### Teenuse käsud

```bash
# Peatage agent
sudo launchctl unload /Library/LaunchDaemons/com.netrecon.agent.plist

# Käivitage agent
sudo launchctl load /Library/LaunchDaemons/com.netrecon.agent.plist

# Kontrollige olekut
sudo launchctl list | grep netrecon
```

### Eemaldamine

```bash
# Peatage teenus
sudo launchctl unload /Library/LaunchDaemons/com.netrecon.agent.plist

# Eemaldage failid
sudo rm -rf /Library/NetRecon/Agent/
sudo rm /Library/LaunchDaemons/com.netrecon.agent.plist

# Eemaldage kviitungid
sudo pkgutil --forget com.netrecon.agent
```

## Veaotsing

### Agent ei käivitu pärast installimist
- Kontrollige süsteemilogi: `log show --predicate 'subsystem == "com.netrecon.agent"' --last 5m`
- Kontrollige, et plist on olemas: `ls -la /Library/LaunchDaemons/com.netrecon.agent.plist`
- Kontrollige agendi binaari failiõigusi

### Õiguste keelamine logis
- Andke Täielik kettajuurdepääs nagu ülal kirjeldatud
- MDM-i puhul juurutage PPPC profiil enne agendi installimist

### Agent ei ühendu sondiga
- Kontrollige serveri URL-i: `curl -I https://probe.netreconapp.com/api/health`
- Kontrollige, kas macOS-i tulemüür blokeerib väljaminevaid ühendusi
- Kontrollige, et registreerimistõend on kehtiv

## KKK

**K: Kas agent toetab Apple Siliconit natiivselt?**
V: Jah. PKG on universaalne binaarne, mis töötab natiivselt nii Intel kui Apple Silicon Mac-idel.

**K: Kas agent töötab macOS-i virtuaalmasinates?**
V: Jah, agent töötab VMware Fusion, Parallels ja UTM virtuaalmasinates.

**K: Kas macOS Gatekeeper blokeerib paigaldamise?**
V: PKG on Apple'i poolt allkirjastatud ja notariseeritud. Kui installite käsitsi ja Gatekeeper blokeerib selle, paremklõpsake PKG-l ja valige **Ava** hoiatuse ümbersõitmiseks.

Lisaabi saamiseks võtke ühendust [support@netreconapp.com](mailto:support@netreconapp.com).
