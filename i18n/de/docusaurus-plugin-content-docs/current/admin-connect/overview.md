---
sidebar_position: 1
title: Admin Connect Übersicht
description: Mobile Verwaltungsapp für die NetRecon Probe-Flottenverwaltung
---

# Admin Connect

Admin Connect ist die mobile Verwaltungsapp zur Steuerung und Überwachung Ihrer NetRecon Probe-Flotte. Sie verbindet sich über Cloudflare Tunnel mit Probes für sicheren Fernzugriff von überall.

## Hauptfunktionen

- **Flottenverwaltung** — mehrere Probes über eine einzige App verwalten
- **Fernüberwachung** — Probe-Zustand, Scanergebnisse und Warnungen in Echtzeit anzeigen
- **IDS-Warnungen** — Suricata IDS-Warnungen empfangen und überprüfen
- **Schwachstellen-Scanning** — Nuclei-Schwachstellenscans auslösen und überprüfen
- **PCAP-Aufzeichnung** — Paketaufzeichnung ferngesteuert starten/stoppen
- **Honeypot-Überwachung** — Honeypot-Treffer und Angreiferverhalten überwachen
- **Rogue-Erkennung** — Warnungen bei nicht autorisierter DHCP/ARP-Aktivität erhalten
- **Netzwerk-Monitor** — Latenz und Paketverlust im gesamten Netzwerk verfolgen
- **WireGuard VPN** — VPN-Verbindungen zu Probes verwalten
- **Ticketing-Integration** — Support-Tickets erstellen und verwalten
- **SSO/2FA** — Enterprise-Authentifizierung mit Single Sign-On und Zwei-Faktor-Authentifizierung
- **Rollenbasierter Zugriff** — granulare Berechtigungen pro Benutzerrolle

## Funktionsweise

Admin Connect hat **keine** eigene Scan-Engine. Es ist ausschließlich eine Fernverwaltungsoberfläche für NetRecon Probes.

```
┌──────────────┐       HTTPS/WSS        ┌─────────────────┐
│ Admin Connect├───────────────────────►│ Cloudflare Tunnel│
│   (Mobil)    │   (via Cloudflare)      │                 │
└──────────────┘                         └────────┬────────┘
                                                  │
                                         ┌────────▼────────┐
                                         │  NetRecon Probe  │
                                         │  (REST + WS API) │
                                         └─────────────────┘
```

Die gesamte Kommunikation zwischen Admin Connect und der Probe ist verschlüsselt über:
- **HTTPS** für REST API-Aufrufe
- **WebSocket Secure (WSS)** für Echtzeit-Ereignisse
- **mTLS** für gegenseitige Zertifikatsauthentifizierung

## Erste Schritte

1. Installieren Sie Admin Connect aus dem Google Play Store (Paket: `com.netreconapp.connect`)
2. Öffnen Sie die App und erstellen Sie ein Konto oder melden Sie sich per SSO an
3. Fügen Sie eine Probe mit einer dieser Methoden hinzu:
   - **QR-Code** — scannen Sie den QR-Code vom Setup-Assistenten oder Dashboard der Probe
   - **Manuell** — geben Sie die Tunnel-URL und den Authentifizierungstoken der Probe ein
4. Die Probe erscheint in Ihrem Flotten-Dashboard

Siehe [Registrierung](./enrollment.md) für detaillierte Einrichtungsanweisungen.

## Echtzeit-Ereignisse

Admin Connect hält eine persistente WebSocket-Verbindung zu jeder Probe aufrecht. Sie erhalten sofortige Benachrichtigungen für:

| Ereignis | Beschreibung |
|---|---|
| `ids_alert` | Suricata IDS hat eine Regel ausgelöst |
| `honeypot_hit` | Ein Angreifer hat mit dem Honeypot interagiert |
| `rogue_detected` | Nicht autorisiertes DHCP oder ARP-Spoofing erkannt |
| `vuln_found` | Schwachstellen-Scan hat ein Ergebnis gefunden |
| `host_found` | Neues Gerät im Netzwerk entdeckt |
| `baseline_diff_alert` | Netzwerk-Baseline-Abweichung erkannt |
| `probe_health_alert` | Probe CPU-, RAM- oder Speicherschwellenwert überschritten |
| `pcap_ready` | PCAP-Aufzeichnungsdatei zum Download bereit |
| `dns_threat` | DNS-Sinkhole hat eine Bedrohung blockiert |

## Unterstützte Aktionen

Von Admin Connect aus können Sie ferngesteuert:

- Netzwerk-Scans starten/stoppen
- Scanergebnisse anzeigen und exportieren
- PCAP-Aufzeichnung starten/stoppen und Dateien herunterladen
- IDS-Überwachung aktivieren/deaktivieren
- Schwachstellen-Scans auslösen
- Honeypot konfigurieren und verwalten
- Rogue-DHCP/ARP-Erkennung einrichten
- DNS-Sinkhole-Regeln konfigurieren
- WireGuard VPN-Verbindungen verwalten
- Backup-Snapshots erstellen
- Aus Backup wiederherstellen
- Systemzustand und Ressourcenverbrauch anzeigen
- Benutzerkonten und Rollen verwalten

## FAQ

**F: Kann Admin Connect ohne Internet funktionieren?**
A: Admin Connect benötigt Internetzugang, um die Probe über Cloudflare Tunnel zu erreichen. Für lokalen Netzwerkzugriff verwenden Sie das Web-Dashboard der Probe direkt.

**F: Wie viele Probes kann ich verwalten?**
A: Es gibt keine Begrenzung der Anzahl an Probes. Admin Connect unterstützt Enterprise-Flottenverwaltung.

**F: Ist Admin Connect für iOS verfügbar?**
A: Eine iOS-Version ist geplant. Derzeit ist Admin Connect für Android verfügbar.

Für weitere Hilfe kontaktieren Sie [support@netreconapp.com](mailto:support@netreconapp.com).
