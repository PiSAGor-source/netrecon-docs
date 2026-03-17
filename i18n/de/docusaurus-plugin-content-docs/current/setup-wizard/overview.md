---
sidebar_position: 1
title: Einrichtungsassistent-Übersicht
description: Vollständige Anleitung zum Erststart-Einrichtungsassistenten von NetRecon OS
---

# Einrichtungsassistent-Übersicht

Der Einrichtungsassistent startet automatisch beim ersten Start von NetRecon OS. Er führt Sie durch alle wesentlichen Konfigurationsschritte, um Ihre Probe betriebsbereit zu machen. Der Assistent ist über einen Webbrowser unter `http://<probe-ip>:8080` erreichbar.

## Voraussetzungen

- NetRecon OS erfolgreich auf Ihrer Probe-Hardware gestartet
- Mindestens ein Ethernet-Kabel mit Ihrem Netzwerk verbunden
- Ein Computer oder Smartphone im selben Netzwerk, um auf den Assistenten zuzugreifen

## Assistenten-Schritte

Der Einrichtungsassistent besteht aus 11 Schritten, die nacheinander abgeschlossen werden:

| Schritt | Name | Beschreibung |
|---|---|---|
| 1 | **Willkommen** | Sprachauswahl und Lizenzvereinbarung |
| 2 | **Admin-Konto** | Administrator-Benutzername und Passwort erstellen |
| 3 | **Hostname** | Hostname der Probe im Netzwerk festlegen |
| 4 | **Netzwerkschnittstellen** | Ethernet-Ports erkennen und Rollen zuweisen |
| 5 | **Netzwerkmodus** | Scan-Topologie auswählen (Single, Dual, Bridge, TAP) |
| 6 | **IP-Konfiguration** | Statische IP oder DHCP für jede Schnittstelle festlegen |
| 7 | **DNS & NTP** | DNS-Server und Zeitsynchronisation konfigurieren |
| 8 | **Cloudflare Tunnel** | Remote-Zugriffstunnel einrichten (optional) |
| 9 | **Sicherheitseinstellungen** | TLS-Zertifikate, 2FA und Sitzungs-Timeout konfigurieren |
| 10 | **Erstes Scanziel** | Erstes zu scannendes Subnetz definieren |
| 11 | **Zusammenfassung & Anwenden** | Alle Einstellungen überprüfen und Konfiguration anwenden |

## Schrittdetails

### Schritt 1: Willkommen

Wählen Sie Ihre bevorzugte Sprache aus den 11 unterstützten Sprachen. Akzeptieren Sie die Lizenzvereinbarung, um fortzufahren.

### Schritt 2: Admin-Konto

Erstellen Sie das Administratorkonto, das für die Anmeldung am Probe-Dashboard und an der API verwendet wird. Wählen Sie ein starkes Passwort — dieses Konto hat vollen Systemzugriff.

### Schritt 3: Hostname

Legen Sie einen aussagekräftigen Hostnamen für die Probe fest (z.B. `netrecon-hq` oder `probe-branch-01`). Dieser Hostname wird über mDNS für die lokale Erkennung gesendet.

### Schritt 4: Netzwerkschnittstellen

Der Assistent erkennt alle verfügbaren Ethernet-Ports und zeigt deren Verbindungsstatus an. Sie weisen jeder Schnittstelle eine Rolle zu:

- **Scan** — die Schnittstelle für Netzwerkerkennung und Scanning
- **Management** — die Schnittstelle für Dashboard-Zugriff und Fernverwaltung
- **Uplink** — die Schnittstelle, die mit Ihrem Internet-Gateway verbunden ist
- **Unbenutzt** — deaktivierte Schnittstellen

Siehe [Netzwerkschnittstellen](./network-interfaces.md) für detaillierte Anleitungen.

### Schritt 5: Netzwerkmodus

Wählen Sie, wie sich die Probe mit Ihrem Netzwerk verbindet:

- **Single Interface** — Scan und Management auf einem Port
- **Dual Scan** — getrennte Scan- und Management-Schnittstellen
- **Bridge** — transparenter Inline-Modus zwischen zwei Ports
- **TAP** — passives Monitoring über einen Netzwerk-TAP oder SPAN-Port

Siehe [Netzwerkmodi](./network-modes.md) für detaillierte Anleitungen.

### Schritt 6: IP-Konfiguration

Wählen Sie für jede aktive Schnittstelle zwischen DHCP und statischer IP-Konfiguration. Statische IP wird für die Management-Schnittstelle empfohlen, damit sich die Adresse der Probe nicht ändert.

### Schritt 7: DNS & NTP

Konfigurieren Sie Upstream-DNS-Server (Standard: Cloudflare 1.1.1.1 und Google 8.8.8.8). NTP wird konfiguriert, um genaue Zeitstempel für Protokolle und Scanergebnisse sicherzustellen.

### Schritt 8: Cloudflare Tunnel

Konfigurieren Sie optional einen Cloudflare Tunnel für sicheren Fernzugriff. Sie benötigen:
- Ein Cloudflare-Konto
- Ein Tunnel-Token (generiert über das Cloudflare Zero Trust-Dashboard)

Dieser Schritt kann übersprungen und später über das Probe-Dashboard konfiguriert werden.

### Schritt 9: Sicherheitseinstellungen

- **TLS-Zertifikat** — selbstsigniertes Zertifikat generieren oder eigenes bereitstellen
- **Zwei-Faktor-Authentifizierung** — TOTP-basierte 2FA für das Admin-Konto aktivieren
- **Sitzungs-Timeout** — konfigurieren, wie lange Dashboard-Sitzungen aktiv bleiben

### Schritt 10: Erstes Scanziel

Definieren Sie das erste Subnetz, das die Probe scannen soll. Der Assistent erkennt automatisch das Subnetz aus der IP-Konfiguration der Scan-Schnittstelle und schlägt es als Standardziel vor.

### Schritt 11: Zusammenfassung & Anwenden

Überprüfen Sie alle konfigurierten Einstellungen. Klicken Sie auf **Anwenden**, um die Konfiguration abzuschließen. Die Probe wird:

1. Netzwerkkonfiguration anwenden
2. TLS-Zertifikate generieren
3. Alle Dienste starten
4. Den ersten Netzwerkscan starten (falls konfiguriert)
5. Sie zum Probe-Dashboard weiterleiten

:::info
Der Assistent läuft nur einmal. Nach Abschluss wird der Firstboot-Dienst deaktiviert. Um den Assistenten erneut auszuführen, verwenden Sie die Option **Werkseinstellungen** im Probe-Dashboard unter **Einstellungen > System**.
:::

## Nach dem Assistenten

Sobald der Assistent abgeschlossen ist:

- Greifen Sie auf das Probe-Dashboard unter `https://<probe-ip>:3000` zu
- Falls Cloudflare Tunnel konfiguriert wurde, greifen Sie remote unter `https://probe.netreconapp.com` zu
- Verbinden Sie die NetRecon Scanner oder Admin Connect App mit der Probe

## FAQ

**F: Kann ich zu einem vorherigen Schritt zurückkehren?**
A: Ja, der Assistent hat auf jedem Schritt eine Zurück-Schaltfläche. Ihre zuvor eingegebenen Werte bleiben erhalten.

**F: Was wenn ich Einstellungen nach dem Assistenten ändern muss?**
A: Alle im Assistenten konfigurierten Einstellungen können später über das Probe-Dashboard unter **Einstellungen** geändert werden.

**F: Der Assistent zeigt keine Netzwerkschnittstellen an. Was soll ich tun?**
A: Stellen Sie sicher, dass Ihre Ethernet-Kabel angeschlossen sind und die Link-LEDs aktiv sind. Bei Verwendung eines USB-Ethernet-Adapters kann eine manuelle Treiberinstallation erforderlich sein. Siehe [Netzwerkschnittstellen](./network-interfaces.md) für Informationen zur Treiberwiederherstellung.

Für weitere Hilfe kontaktieren Sie [support@netreconapp.com](mailto:support@netreconapp.com).
