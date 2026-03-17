---
slug: /
sidebar_position: 1
title: Erste Schritte mit NetRecon
description: Netzwerk-Intelligence-Plattform für MSPs und IT-Teams
---

# Erste Schritte mit NetRecon

NetRecon ist eine Netzwerk-Intelligence-Plattform, die für MSPs und IT-Teams entwickelt wurde. Sie bietet automatisierte Netzwerkerkennung, Geräte-Inventarisierung, Schwachstellen-Scanning, Konfigurationsmanagement und Echtzeit-Überwachung — alles zugänglich über ein zentrales Dashboard, mobile Apps und eine REST API.

## Wählen Sie Ihre Bereitstellungsart

<div className="row" style={{marginTop: '1.5rem'}}>

<div className="col col--6" style={{marginBottom: '1rem'}}>

### Self-Hosted

Betreiben Sie NetRecon auf Ihrer eigenen Infrastruktur mit Docker Compose. Volle Kontrolle über Ihre Daten, keine externen Abhängigkeiten.

- [Systemanforderungen](self-hosting/requirements)
- [Installationsanleitung](self-hosting/installation)
- [Konfigurationsreferenz](self-hosting/configuration)

**Ideal für:** Organisationen mit strengen Anforderungen an die Datensouveränität, Air-Gap-Netzwerke oder bestehende Server-Infrastruktur.

</div>

<div className="col col--6" style={{marginBottom: '1rem'}}>

### Cloud (SaaS)

Starten Sie sofort mit NetRecon Cloud. Kein Server-Setup erforderlich — einfach Probes bereitstellen und mit dem Scannen beginnen.

- [Schnellstartanleitung](cloud/quickstart)

**Ideal für:** Teams, die schnell loslegen möchten, ohne Server-Infrastruktur verwalten zu müssen.

</div>

</div>

## Plattform-Komponenten

| Komponente | Beschreibung |
|---|---|
| **Dashboard** | Webbasiertes Kontrollpanel für alle NetRecon-Funktionen |
| **NetRecon Scanner** | Android-App für Netzwerk-Scanning unterwegs ([Mehr erfahren](scanner/overview)) |
| **Admin Connect** | Android-Verwaltungsapp für Fernadministration ([Mehr erfahren](admin-connect/overview)) |
| **Agents** | Leichtgewichtige Agenten für Windows-, macOS- und Linux-Endgeräte ([Installation](agents/overview)) |
| **Probes** | Hardware- oder VM-basierte Netzwerksensoren für kontinuierliche Überwachung |
| **API** | RESTful API für Automatisierung und Integration ([API-Referenz](api/overview)) |

## Brauchen Sie Hilfe?

- Durchsuchen Sie die Dokumentation über die Seitenleiste
- Schauen Sie sich die [API-Referenz](api/overview) für Integrationsdetails an
- Kontaktieren Sie [support@netreconapp.com](mailto:support@netreconapp.com) für Unterstützung
