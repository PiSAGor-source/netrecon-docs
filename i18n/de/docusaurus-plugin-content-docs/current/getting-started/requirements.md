---
sidebar_position: 3
title: Anforderungen
description: Hardware-, Software- und Netzwerkanforderungen für NetRecon
---

# Anforderungen

Diese Seite beschreibt die Mindest- und empfohlenen Anforderungen für alle NetRecon-Komponenten.

## Probe-Hardware

### Unterstützte Plattformen

| Gerät | Support-Stufe | Hinweise |
|---|---|---|
| Orange Pi R2S (8 GB) | Primär | Dual-Ethernet, kompakter Formfaktor |
| Raspberry Pi 4 (4/8 GB) | Primär | Weit verbreitet, gute Leistung |
| Raspberry Pi 5 (4/8 GB) | Primär | Beste ARM-Leistung |
| x86_64 Mini PC (Intel N100+) | Primär | Beste Gesamtleistung, mehrere NICs |
| Andere ARM64 SBCs | Fortgeschritten | Erfordert möglicherweise manuelle Konfiguration |
| Virtuelle Maschinen (VMware/Proxmox/Hyper-V) | Unterstützt | Bridged Networking erforderlich |

### Hardware-Spezifikationen

| Anforderung | Minimum | Empfohlen |
|---|---|---|
| Architektur | ARM64 oder x86_64 | ARM64 Quad-Core oder x86_64 |
| CPU-Kerne | 2 | 4+ |
| RAM | 4 GB | 8 GB |
| Speicher | 16 GB (eMMC/SD/SSD) | 32 GB SSD |
| Ethernet-Ports | 1 | 2+ (für Bridge-/TAP-Modus) |
| USB | Nicht erforderlich | USB-A für seriellen Konsolenadapter |
| Stromversorgung | 5V/3A (SBC) | PoE oder Hohlstecker |

### Speicheraspekte

- **16 GB** reichen für grundlegendes Scannen und Überwachung
- **32 GB+** werden empfohlen, wenn Sie PCAP-Aufzeichnung, IDS-Protokollierung oder Schwachstellen-Scanning aktivieren
- PCAP-Dateien können in belebten Netzwerken schnell wachsen; erwägen Sie externen Speicher für Langzeitaufzeichnungen
- Die SQLite-Datenbank verwendet den WAL-Modus für optimale Schreibleistung

## NetRecon Scanner App (Android)

| Anforderung | Details |
|---|---|
| Android-Version | 8.0 (API 26) oder höher |
| RAM | Mindestens 2 GB |
| Speicher | 100 MB für App + Daten |
| Netzwerk | WLAN verbunden mit dem Zielnetzwerk |
| Root-Zugriff | Optional (aktiviert erweiterte Scan-Modi) |
| Shizuku | Optional (aktiviert einige Funktionen ohne Root) |

## Admin Connect App

| Anforderung | Details |
|---|---|
| Android-Version | 8.0 (API 26) oder höher |
| RAM | Mindestens 2 GB |
| Speicher | 80 MB für App + Daten |
| Netzwerk | Internetverbindung (verbindet sich über Cloudflare Tunnel) |

## Self-Hosted-Server

| Anforderung | Minimum | Empfohlen |
|---|---|---|
| Betriebssystem | Ubuntu 22.04 LTS / Debian 12 | Ubuntu 24.04 LTS |
| CPU | 2 Kerne | 4+ Kerne |
| RAM | 4 GB | 8 GB |
| Speicher | 40 GB | 100 GB SSD |
| Docker | v24.0+ | Neueste stabile Version |
| Docker Compose | v2.20+ | Neueste stabile Version |

Windows Server wird ebenfalls mit Docker Desktop oder WSL2 unterstützt.

## Netzwerkanforderungen

### Probe-Netzwerkzugriff

| Richtung | Port | Protokoll | Zweck |
|---|---|---|---|
| Probe -> LAN | ARP | Layer 2 | Host-Erkennung |
| Probe -> LAN | TCP (verschiedene) | Layer 4 | Port-Scanning |
| Probe -> LAN | UDP 5353 | mDNS | Diensterkennung |
| Probe -> Internet | TCP 443 | HTTPS | Cloudflare Tunnel, Updates |
| LAN -> Probe | TCP 3000 | HTTPS | Web-Dashboard |
| LAN -> Probe | TCP 8080 | HTTP | Setup-Assistent (nur beim ersten Start) |

### Firewall-Hinweise

- Die Probe **benötigt keine eingehenden Ports** aus dem Internet bei Verwendung von Cloudflare Tunnel
- Die Probe benötigt **ausgehendes HTTPS (443)** für Tunnel-Konnektivität und Systemupdates
- Für lokales Netzwerk-Scanning muss die Probe im selben Layer-2-Segment wie die Zielgeräte sein (oder einen SPAN-/Mirror-Port verwenden)

### Cloudflare Tunnel

Der Fernzugriff auf die Probe wird über Cloudflare Tunnel bereitgestellt. Dies erfordert:
- Eine aktive Internetverbindung auf der Probe
- Ausgehenden TCP 443-Zugriff (keine eingehenden Ports erforderlich)
- Ein Cloudflare-Konto (kostenlose Stufe ist ausreichend)

## Browser-Anforderungen (Web-Dashboard)

| Browser | Mindestversion |
|---|---|
| Google Chrome | 90+ |
| Mozilla Firefox | 90+ |
| Microsoft Edge | 90+ |
| Safari | 15+ |

JavaScript muss aktiviert sein.

## FAQ

**F: Kann ich die Probe auf einem Raspberry Pi 3 betreiben?**
A: Der Raspberry Pi 3 hat nur 1 GB RAM, was unter der Mindestanforderung liegt. Er könnte für einfaches Scanning funktionieren, wird aber nicht unterstützt.

**F: Benötigt die Probe Internetzugang?**
A: Internetzugang ist nur für Cloudflare Tunnel (Fernzugriff) und Systemupdates erforderlich. Alle Scan-Funktionen arbeiten ohne Internet.

**F: Kann ich einen USB-WLAN-Adapter zum Scannen verwenden?**
A: WLAN-Scanning wird nicht unterstützt. Die Probe benötigt kabelgebundenes Ethernet für zuverlässige und vollständige Netzwerkerkennung.

Für weitere Hilfe kontaktieren Sie [support@netreconapp.com](mailto:support@netreconapp.com).
