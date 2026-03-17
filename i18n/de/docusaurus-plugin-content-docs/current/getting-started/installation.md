---
sidebar_position: 1
title: Installation
description: NetRecon OS auf Ihrer Probe-Hardware installieren
---

# NetRecon OS Installation

Diese Anleitung führt Sie durch die Installation von NetRecon OS auf Ihrer Probe-Hardware. Der Vorgang dauert etwa 15 Minuten vom Download bis zur voll funktionsfähigen Probe.

## Voraussetzungen

- Ein unterstütztes Hardwaregerät (siehe [Anforderungen](./requirements.md))
- Eine microSD-Karte (mindestens 16 GB, 32 GB empfohlen) oder ein USB-Laufwerk
- Ein Image-Schreibtool wie [balenaEtcher](https://etcher.balena.io/) oder Raspberry Pi Imager
- Ein Computer zum Herunterladen und Schreiben des Images
- Ein Ethernet-Kabel, das mit Ihrem Netzwerk verbunden ist

## Schritt 1: Image herunterladen

Laden Sie das passende Image für Ihre Hardware aus dem NetRecon-Kundenportal herunter:

| Hardware | Image-Datei | Architektur |
|---|---|---|
| Orange Pi R2S | `netrecon-os-arm64.img.xz` | ARM64 |
| Raspberry Pi 4/5 | `netrecon-os-arm64.img.xz` | ARM64 |
| x86_64 Mini PC | `netrecon-os-amd64.iso` | x86_64 |

:::tip
Überprüfen Sie die Download-Prüfsumme gegen den im Portal angezeigten Wert, um die Dateiintegrität sicherzustellen.
:::

## Schritt 2: Image schreiben

### Für ARM64-Geräte (Orange Pi, Raspberry Pi)

1. Stecken Sie Ihre microSD-Karte in Ihren Computer
2. Öffnen Sie balenaEtcher
3. Wählen Sie die heruntergeladene `.img.xz`-Datei (kein Entpacken nötig)
4. Wählen Sie Ihre microSD-Karte als Ziel
5. Klicken Sie auf **Flash** und warten Sie auf den Abschluss

### Für x86_64-Geräte

1. Stecken Sie einen USB-Stick in Ihren Computer
2. Öffnen Sie balenaEtcher
3. Wählen Sie die heruntergeladene `.iso`-Datei
4. Wählen Sie Ihren USB-Stick als Ziel
5. Klicken Sie auf **Flash** und warten Sie auf den Abschluss
6. Booten Sie den Mini-PC vom USB-Laufwerk und folgen Sie dem Bildschirm-Installer

## Schritt 3: Erster Start

1. Setzen Sie die microSD-Karte (oder das interne Laufwerk bei x86_64) in Ihr Probe-Gerät ein
2. Verbinden Sie mindestens ein Ethernet-Kabel mit Ihrem Netzwerk
3. Schalten Sie das Gerät ein
4. Warten Sie ca. 60 Sekunden, bis das System initialisiert ist

Die Probe erhält beim ersten Start eine IP-Adresse per DHCP.

## Schritt 4: Setup-Assistent ausführen

1. Öffnen Sie von einem beliebigen Gerät im selben Netzwerk einen Webbrowser
2. Navigieren Sie zu `http://<probe-ip>:8080`
3. Der Setup-Assistent führt Sie durch die Erstkonfiguration

Der Assistent hilft Ihnen bei der Konfiguration von:
- Administratorkonto-Anmeldedaten
- Netzwerkschnittstellen-Rollen
- Netzwerk-Scanning-Modus
- Cloudflare Tunnel-Verbindung
- Sicherheitseinstellungen

Siehe [Setup-Assistent-Übersicht](../setup-wizard/overview.md) für detaillierte Assistenten-Dokumentation.

## Schritt 5: Apps verbinden

Nach Abschluss des Assistenten:

- **NetRecon Scanner**: Kann die Probe per mDNS im lokalen Netzwerk entdecken
- **Admin Connect**: Scannen Sie den QR-Code, der im Assistenten angezeigt wird, oder verbinden Sie sich über `https://probe.netreconapp.com`

## Hardwareanforderungen

| Anforderung | Minimum | Empfohlen |
|---|---|---|
| CPU | ARM64 oder x86_64 | ARM64 Quad-Core oder x86_64 |
| RAM | 4 GB | 8 GB |
| Speicher | 16 GB | 32 GB |
| Ethernet | 1 Port | 2+ Ports |
| Netzwerk | DHCP verfügbar | Statische IP bevorzugt |

## Fehlerbehebung

### Probe im Netzwerk nicht auffindbar

- Stellen Sie sicher, dass das Ethernet-Kabel richtig angeschlossen ist und die Link-LED aktiv ist
- Prüfen Sie die DHCP-Lease-Tabelle Ihres Routers auf ein neues Gerät namens `netrecon`
- Versuchen Sie, einen Monitor und eine Tastatur anzuschließen, um die IP-Adresse der Probe auf der Konsole zu sehen

### Assistent lädt nicht

- Überprüfen Sie, ob Sie auf Port 8080 zugreifen: `http://<probe-ip>:8080`
- Der Assistenten-Service startet ca. 60 Sekunden nach dem Hochfahren
- Prüfen Sie, ob Ihr Computer im selben Netzwerk/VLAN wie die Probe ist

### Image lässt sich nicht schreiben

- Versuchen Sie eine andere microSD-Karte; einige Karten haben Kompatibilitätsprobleme
- Laden Sie das Image erneut herunter und überprüfen Sie die Prüfsumme
- Versuchen Sie ein alternatives Image-Schreibtool

## FAQ

**F: Kann ich NetRecon OS auf einer virtuellen Maschine installieren?**
A: Ja, die x86_64-ISO kann in VMware, Proxmox oder Hyper-V installiert werden. Weisen Sie mindestens 4 GB RAM zu und stellen Sie sicher, dass die VM einen Bridged-Netzwerkadapter hat.

**F: Wie aktualisiere ich NetRecon OS nach der Installation?**
A: Updates werden über die Admin Connect App oder über das Web-Dashboard der Probe unter **Einstellungen > Systemupdate** bereitgestellt.

**F: Kann ich WLAN statt Ethernet verwenden?**
A: Die Probe benötigt mindestens eine kabelgebundene Ethernet-Verbindung für zuverlässiges Netzwerk-Scanning. WLAN wird als primäre Scan-Schnittstelle nicht unterstützt.

Für weitere Hilfe kontaktieren Sie [support@netreconapp.com](mailto:support@netreconapp.com).
