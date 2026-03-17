---
sidebar_position: 1
title: Scanner-Übersicht
description: NetRecon Scanner App — eigenständiger Android-Netzwerkscanner
---

# NetRecon Scanner

NetRecon Scanner ist ein eigenständiges Android-Tool für Netzwerksicherheitsaudits. Es arbeitet unabhängig auf Ihrem Android-Gerät ohne eine Probe und ist ideal für Außeneinsätze, schnelle Bewertungen und Netzwerkaufklärung unterwegs.

## Hauptfunktionen

- **ARP-Erkennung** — alle Geräte im lokalen Netzwerk per ARP-Anfragen finden
- **Port-Scanning** — TCP-Ports scannen, um offene Dienste auf entdeckten Hosts zu finden
- **Diensterkennung** — laufende Dienste und deren Versionen per Banner-Grabbing identifizieren
- **Geräteprofilierung** — Geräte durch Kombination von OUI-Lookup, offenen Ports und Dienstsignaturen klassifizieren
- **WLAN-Heatmap** — drahtlose Signalstärke über physische Standorte visualisieren
- **PDF-Berichte** — professionelle Sicherheitsaudit-Berichte erstellen
- **SSH-Terminal** — direkt aus der App mit Geräten verbinden
- **CVE-Intelligence** — Offline-CVE-Datenbank für Schwachstellenabfragen
- **Angriffsflächen-Karte** — visuelle Darstellung der Netzwerk-Exposition
- **Passiver Monitor** — kontinuierliche Hintergrundüberwachung für neue Geräte
- **11 Sprachen** — volle Lokalisierungsunterstützung

## Betriebsmodi

NetRecon Scanner unterstützt drei Betriebsmodi, abhängig von den Fähigkeiten Ihres Geräts:

### Standardmodus
Funktioniert auf jedem Android-Gerät ohne besondere Berechtigungen. Verwendet Standard-Android-Netzwerk-APIs für Erkennung und Scanning.

### Shizuku-Modus
Nutzt den [Shizuku](https://shizuku.rikka.app/)-Dienst für erweiterten Netzwerkzugriff ohne Root. Ermöglicht schnelleres ARP-Scanning und Raw-Socket-Zugriff.

### Root-Modus
Voller Zugriff auf alle Netzwerkfähigkeiten. Ermöglicht die schnellste Scan-Geschwindigkeit, Promiscuous-Mode-Aufzeichnung und erweiterte Funktionen wie ARP-Spoofing-Erkennung.

| Funktion | Standard | Shizuku | Root |
|---|---|---|---|
| ARP-Erkennung | Langsam | Schnell | Am schnellsten |
| Port-Scanning | Ja | Ja | Ja |
| Raw Sockets | Nein | Ja | Ja |
| PCAP-Aufzeichnung | Nein | Eingeschränkt | Vollständig |
| Passive Überwachung | Eingeschränkt | Ja | Ja |

## Scan-Typen

### ARP-Erkennung
Sendet ARP-Anfragen an jede IP im Zielsubnetz, um aktive Hosts zu identifizieren. Dies ist die schnellste und zuverlässigste Methode zur Geräteerkennung in einem lokalen Netzwerk.

### TCP-Port-Scan
Verbindet sich mit angegebenen TCP-Ports auf jedem entdeckten Host. Unterstützt konfigurierbare Port-Bereiche und Limits für gleichzeitige Verbindungen.

### Diensterkennung
Nach dem Finden offener Ports sendet der Scanner protokollspezifische Anfragen, um den laufenden Dienst zu identifizieren. Erkennt Hunderte gängiger Dienste einschließlich HTTP, SSH, FTP, SMB, RDP, Datenbanken und mehr.

### Geräteprofilierung
Kombiniert mehrere Datenquellen, um ein Gerät zu identifizieren:
- MAC-Adresse OUI (Hersteller)-Lookup
- Offene-Port-Fingerabdruck-Abgleich
- Dienst-Banner-Analyse
- mDNS/SSDP-Dienstankündigungen

## Probe-Integration

Obwohl der Scanner eigenständig arbeitet, kann er auch mit einer NetRecon Probe für erweiterte Fähigkeiten verbunden werden:

- Probe-Scanergebnisse neben lokalen Scans anzeigen
- Fernscans von der App aus auslösen
- Auf IDS-Warnungen und Schwachstellendaten der Probe zugreifen
- Lokale und Probe-Daten in Berichten kombinieren

Um eine Probe zu verbinden, gehen Sie zu **Einstellungen > Probe-Verbindung** und geben Sie die IP-Adresse der Probe ein oder scannen Sie den QR-Code vom Probe-Dashboard.

## Leistung

Der Scanner ist für mobile Geräte optimiert:
- Maximal 40 gleichzeitige Socket-Verbindungen (adaptiv basierend auf Akkustand)
- CPU-intensive Profilierung läuft in einem dedizierten Isolate, um die UI reaktionsfähig zu halten
- OUI-Datenbank wird verzögert geladen mit einem LRU-Cache (500 Einträge)
- Akkubewusstes Scanning reduziert die Parallelität bei niedrigem Akkustand

## FAQ

**F: Benötigt der Scanner Internetzugang?**
A: Nein. Alle Scan-Funktionen arbeiten offline. Internet wird nur für den initialen CVE-Datenbank-Download und Updates benötigt.

**F: Kann ich Netzwerke scannen, mit denen ich nicht verbunden bin?**
A: Der Scanner kann nur Geräte in dem Netzwerk erkennen, mit dem Ihr Android-Gerät aktuell per WLAN verbunden ist. Für das Scannen entfernter Netzwerke verwenden Sie eine Probe.

**F: Wie genau ist die Geräteprofilierung?**
A: Die Geräteprofilierung identifiziert den Gerätetyp in ca. 85-90% der Fälle korrekt. Die Genauigkeit verbessert sich, wenn mehr Ports und Dienste erkannt werden (verwenden Sie das Standard- oder Tiefen-Scan-Profil).

Für weitere Hilfe kontaktieren Sie [support@netreconapp.com](mailto:support@netreconapp.com).
