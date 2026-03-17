---
sidebar_position: 1
title: Self-Hosting-Übersicht
description: Betreiben Sie die NetRecon-Plattform auf Ihrer eigenen Infrastruktur
---

# Self-Hosting

NetRecon kann vollständig auf Ihrer eigenen Infrastruktur selbst gehostet werden, sodass Sie die volle Kontrolle über Ihre Daten, Sicherheit und Bereitstellung haben.

## Warum Self-Hosting?

| Vorteil | Beschreibung |
|---|---|
| **Datensouveränität** | Alle Scanergebnisse, Konfigurationen und Protokolle verbleiben auf Ihren Servern |
| **Compliance** | Erfüllung regulatorischer Anforderungen, die eine lokale Datenspeicherung vorschreiben |
| **Netzwerkisolation** | Betrieb in Air-Gap-Umgebungen ohne Internetabhängigkeit |
| **Individuelle Integration** | Direkter Datenbankzugriff für benutzerdefinierte Berichte und Integration |
| **Kostenkontrolle** | Keine Pro-Probe-Lizenzierung für die Server-Infrastruktur |

## Architektur

Eine Self-Hosted-NetRecon-Bereitstellung besteht aus mehreren Microservices, die in Docker-Containern laufen:

```
┌────────────────────────────────────────────────────────┐
│                    Docker Host                         │
│                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │ API Gateway  │  │ Vault Server │  │  License     ││
│  │   :8000      │  │   :8001      │  │  Server :8002││
│  └──────────────┘  └──────────────┘  └──────────────┘│
│                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │ Email        │  │ Notification │  │  Update      ││
│  │ Service :8003│  │ Service :8004│  │  Server :8005││
│  └──────────────┘  └──────────────┘  └──────────────┘│
│                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │ Agent        │  │ Warranty     │  │  CMod        ││
│  │ Registry:8006│  │ Service :8007│  │  Service:8008││
│  └──────────────┘  └──────────────┘  └──────────────┘│
│                                                        │
│  ┌──────────────┐  ┌──────────────┐                   │
│  │ IPAM         │  │ PostgreSQL   │                   │
│  │ Service :8009│  │   :5432      │                   │
│  └──────────────┘  └──────────────┘                   │
│                                                        │
│  ┌──────────────┐  ┌──────────────┐                   │
│  │ Redis        │  │ Nginx        │                   │
│  │   :6379      │  │ Reverse Proxy│                   │
│  └──────────────┘  └──────────────┘                   │
└────────────────────────────────────────────────────────┘
```

## Service-Übersicht

| Service | Port | Zweck |
|---|---|---|
| API Gateway | 8000 | Zentrales API-Routing, Authentifizierung |
| Vault Server | 8001 | Geheimnisverwaltung, Anmeldedatenspeicherung |
| License Server | 8002 | Lizenzvalidierung und -verwaltung |
| Email Service | 8003 | E-Mail-Benachrichtigungen und Warnungen |
| Notification Service | 8004 | Push-Benachrichtigungen, Webhooks |
| Update Server | 8005 | Probe- und Agent-Update-Verteilung |
| Agent Registry | 8006 | Agent-Registrierung und -Verwaltung |
| Warranty Service | 8007 | Hardware-Garantieverfolgung |
| CMod Service | 8008 | Konfigurationsmanagement für Netzwerkgeräte |
| IPAM Service | 8009 | IP-Adressverwaltung |

## Bereitstellungsoptionen

### Docker Compose (Empfohlen)

Der einfachste Weg, alle Services bereitzustellen. Geeignet für kleine bis mittlere Bereitstellungen.

Siehe [Installationsanleitung](./installation.md) für eine Schritt-für-Schritt-Anleitung.

### Kubernetes

Für groß angelegte Bereitstellungen, die Hochverfügbarkeit und horizontale Skalierung erfordern. Helm Charts sind für jeden Service verfügbar.

### Einzelne Binärdatei

Für minimale Bereitstellungen bündelt eine einzelne Binärdatei alle Services. Geeignet für Tests oder sehr kleine Umgebungen.

## Systemanforderungen

| Anforderung | Minimum | Empfohlen |
|---|---|---|
| Betriebssystem | Ubuntu 22.04 / Debian 12 | Ubuntu 24.04 LTS |
| CPU | 2 Kerne | 4+ Kerne |
| RAM | 4 GB | 8 GB |
| Speicher | 40 GB | 100 GB SSD |
| Docker | v24.0+ | Neueste stabile Version |
| Docker Compose | v2.20+ | Neueste stabile Version |

## Netzwerk

| Port | Protokoll | Zweck |
|---|---|---|
| 443 | HTTPS | Web-Dashboard und API (über Reverse Proxy) |
| 80 | HTTP | Weiterleitung zu HTTPS |
| 5432 | TCP | PostgreSQL (intern, nicht exponiert) |
| 6379 | TCP | Redis (intern, nicht exponiert) |

Nur die Ports 80 und 443 müssen extern exponiert werden. Alle internen Service-Ports sind nur innerhalb des Docker-Netzwerks erreichbar.

## Datenspeicherung

| Daten | Speicher | Backup |
|---|---|---|
| PostgreSQL-Datenbank | Docker Volume | pg_dump täglich |
| Konfigurationsdateien | Bind Mount | Datei-Backup |
| Hochgeladene Dateien | Docker Volume | Datei-Backup |
| Protokolle | Docker Volume | Log-Rotation |
| TLS-Zertifikate | Bind Mount | Sicheres Backup |

## Sicherheit

Self-Hosted-Bereitstellungen umfassen alle Sicherheitsfunktionen:

- TLS-Verschlüsselung für alle externen Kommunikation
- JWT-basierte Authentifizierung
- Rollenbasierte Zugriffskontrolle
- Audit-Protokollierung
- Steel Shield Integritätsverifizierung (siehe [Steel Shield](./steel-shield.md))

## FAQ

**F: Kann ich Self-Hosting ohne Docker betreiben?**
A: Docker Compose ist die empfohlene und unterstützte Bereitstellungsmethode. Das direkte Ausführen von Services auf dem Host ist möglich, wird aber nicht offiziell unterstützt.

**F: Wie verbinden sich Probes mit einem selbst gehosteten Server?**
A: Konfigurieren Sie Probes so, dass sie auf die URL Ihres Servers anstatt des Standard-Cloudflare-Tunnel-Endpunkts verweisen. Aktualisieren Sie die `server_url` in der Probe-Konfiguration.

**F: Ist ein Web-Dashboard enthalten?**
A: Ja. Das API Gateway stellt das Web-Dashboard unter der Root-URL bereit. Greifen Sie über Ihre konfigurierte Domain darauf zu (z. B. `https://netrecon.yourcompany.com`).

**F: Kann ich dies in einer Air-Gap-Umgebung betreiben?**
A: Ja. Laden Sie die Docker-Images vorab herunter und übertragen Sie sie auf Ihren Air-Gap-Server. Die Lizenzvalidierung kann für den Offline-Modus konfiguriert werden.

Für weitere Hilfe kontaktieren Sie [support@netreconapp.com](mailto:support@netreconapp.com).
