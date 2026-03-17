---
sidebar_position: 1
title: IPAM-Übersicht
description: IP-Adressverwaltung mit Subnetzverfolgung und Auslastungsüberwachung
---

# IPAM — IP-Adressverwaltung

NetRecon IPAM bietet zentrale IP-Adressverfolgung und Subnetzverwaltung. Überwachen Sie die Subnetzauslastung, verfolgen Sie IP-Zuweisungen und pflegen Sie ein genaues Inventar Ihres Netzwerkadressraums.

## Hauptfunktionen

- **Subnetzverwaltung** — Subnetze mit vollständiger CIDR-Notation definieren und organisieren
- **IP-Verfolgung** — einzelne IP-Zuweisungen mit Status und Metadaten verfolgen
- **Auslastungsüberwachung** — Echtzeit-Subnetzauslastung in Prozent und Warnungen
- **Scan-Integration** — entdeckte IPs direkt aus Scanergebnissen importieren
- **Konflikterkennung** — doppelte IP-Adressen und überlappende Subnetze identifizieren
- **OUI-Synchronisierung** — MAC-Adressen automatisch mit Herstellerdaten verknüpfen
- **Verlauf** — Änderungen an IP-Zuweisungen über die Zeit verfolgen
- **Export** — IP-Daten als CSV oder JSON exportieren

## Architektur

IPAM läuft als dedizierter Dienst auf der Probe (Port 8009) mit einem PostgreSQL-Backend:

```
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│  Dashboard   │  HTTP  │    IPAM      │  SQL   │  PostgreSQL  │
│  (Browser)   ├────────►  Service     ├────────►  Database    │
│              │        │   :8009      │        │              │
└──────────────┘        └──────┬───────┘        └──────────────┘
                               │
                        ┌──────▼───────┐
                        │ Scan Engine  │
                        │ (IP import)  │
                        └──────────────┘
```

## Konzepte

### Subnetze

Ein Subnetz stellt einen Bereich von IP-Adressen dar, der durch CIDR-Notation definiert ist (z.B. `192.168.1.0/24`). Jedes Subnetz hat:

| Feld | Beschreibung |
|---|---|
| CIDR | Netzwerkadresse in CIDR-Notation |
| Name | Aussagekräftiger Name (z.B. „Büro-LAN") |
| VLAN | Zugehörige VLAN-ID (optional) |
| Gateway | Standard-Gateway-IP |
| DNS | DNS-Server für dieses Subnetz |
| Beschreibung | Freitext-Beschreibung |
| Standort | Physischer oder logischer Standort |

### IP-Adressen

Jede IP-Adresse innerhalb eines Subnetzes kann mit folgenden Daten verfolgt werden:

| Feld | Beschreibung |
|---|---|
| IP-Adresse | Die IPv4- oder IPv6-Adresse |
| Status | Verfügbar, Zugewiesen, Reserviert, DHCP |
| Hostname | Geräte-Hostname |
| MAC-Adresse | Zugehörige MAC-Adresse |
| Hersteller | Automatisch aus OUI-Datenbank befüllt |
| Eigentümer | Zugewiesener Benutzer oder Abteilung |
| Zuletzt gesehen | Zeitstempel der letzten Netzwerkaktivität |
| Notizen | Freitext-Notizen |

### Auslastung

Die Subnetzauslastung wird wie folgt berechnet:

```
Auslastung = (Zugewiesen + Reserviert + DHCP) / Nutzbare IPs gesamt * 100%
```

Warnungen können konfiguriert werden, wenn die Auslastung einen Schwellenwert überschreitet (Standard: 80%).

## Erste Schritte

### Schritt 1: Subnetz erstellen

1. Navigieren Sie zu **IPAM > Subnetze** im Probe-Dashboard
2. Klicken Sie auf **Subnetz hinzufügen**
3. Geben Sie die CIDR ein (z.B. `10.0.1.0/24`)
4. Füllen Sie die optionalen Felder aus (Name, VLAN, Gateway usw.)
5. Klicken Sie auf **Speichern**

### Schritt 2: IPs aus Scan importieren

Der schnellste Weg, IPAM zu befüllen, ist der Import aus einem abgeschlossenen Scan:

1. Navigieren Sie zu **IPAM > Subnetze**
2. Wählen Sie Ihr Subnetz
3. Klicken Sie auf **Aus Scan importieren**
4. Wählen Sie das Scanergebnis zum Importieren
5. Überprüfen Sie die IPs, die importiert werden
6. Klicken Sie auf **Importieren**

Siehe [Aus Scan importieren](./import-from-scan.md) für detaillierte Anweisungen.

### Schritt 3: IP-Zuweisungen verwalten

1. Klicken Sie auf ein Subnetz, um seine IP-Adressen anzuzeigen
2. Klicken Sie auf eine IP, um ihre Details anzuzeigen/bearbeiten
3. Status ändern, Notizen hinzufügen, einem Eigentümer zuweisen
4. Klicken Sie auf **Speichern**

### Schritt 4: Auslastung überwachen

1. Navigieren Sie zu **IPAM > Dashboard**
2. Subnetzauslastungsdiagramme anzeigen
3. Warnungen für hohe Auslastung unter **IPAM > Einstellungen > Warnungen** konfigurieren

## Subnetz-Organisation

Subnetze können hierarchisch organisiert werden:

```
10.0.0.0/16          (Firmennetzwerk)
├── 10.0.1.0/24      (HQ - Büro-LAN)
├── 10.0.2.0/24      (HQ - Server-VLAN)
├── 10.0.3.0/24      (HQ - WLAN)
├── 10.0.10.0/24     (Filiale 1 - Büro)
├── 10.0.11.0/24     (Filiale 1 - Server)
└── 10.0.20.0/24     (Filiale 2 - Büro)
```

Eltern-/Kind-Beziehungen werden automatisch basierend auf CIDR-Zugehörigkeit hergestellt.

## IPv6-Unterstützung

IPAM unterstützt sowohl IPv4- als auch IPv6-Adressen:
- Vollständige CIDR-Notation für IPv6-Subnetze
- IPv6-Adressverfolgung mit denselben Feldern wie IPv4
- Dual-Stack-Geräte zeigen beide Adressen verknüpft an

## FAQ

**F: Kann ich Subnetze aus einer CSV-Datei importieren?**
A: Ja. Navigieren Sie zu **IPAM > Importieren** und laden Sie eine CSV-Datei mit den Spalten: CIDR, Name, VLAN, Gateway, Beschreibung hoch. Eine CSV-Vorlage steht auf der Importseite zum Download bereit.

**F: Wie oft werden die Auslastungsdaten aktualisiert?**
A: Die Auslastung wird jedes Mal neu berechnet, wenn sich ein IP-Status ändert, und zusätzlich planmäßig (standardmäßig alle 5 Minuten).

**F: Integriert sich IPAM mit DHCP-Servern?**
A: IPAM kann DHCP-Lease-Daten importieren, um dynamisch zugewiesene IPs zu verfolgen. Konfigurieren Sie die DHCP-Server-Verbindung unter **IPAM > Einstellungen > DHCP-Integration**.

**F: Können mehrere Benutzer IPAM-Daten gleichzeitig bearbeiten?**
A: Ja. IPAM verwendet optimistisches Sperren, um Konflikte zu vermeiden. Wenn zwei Benutzer dieselbe IP-Adresse bearbeiten, zeigt das zweite Speichern eine Konfliktwarnung mit der Option zum Zusammenführen oder Überschreiben.

Für weitere Hilfe kontaktieren Sie [support@netreconapp.com](mailto:support@netreconapp.com).
