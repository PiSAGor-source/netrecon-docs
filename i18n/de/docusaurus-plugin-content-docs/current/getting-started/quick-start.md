---
sidebar_position: 2
title: Schnellstart
description: Vom Auspacken zum ersten Netzwerk-Scan in 10 Minuten
---

# Schnellstart-Anleitung

Vom Nullpunkt zum ersten Netzwerk-Scan in unter 10 Minuten. Diese Anleitung setzt voraus, dass Sie das NetRecon OS-Image bereits auf Ihr Speichermedium geschrieben haben.

## Was Sie benötigen

- Ein Probe-Gerät mit installiertem NetRecon OS (siehe [Installation](./installation.md))
- Ein Ethernet-Kabel, das mit Ihrem Netzwerk verbunden ist
- Ein Smartphone oder Computer im selben Netzwerk
- Die NetRecon Scanner App (optional, für mobiles Scannen)

## Minuten 0-2: Probe starten

1. Setzen Sie die vorbereitete microSD-Karte ein oder booten Sie vom internen Speicher
2. Verbinden Sie das Ethernet-Kabel mit Ihrem Netzwerk-Switch oder Router
3. Schalten Sie das Gerät ein
4. Warten Sie, bis die grüne Status-LED dauerhaft leuchtet (ca. 60 Sekunden)

## Minuten 2-5: Setup-Assistent abschließen

1. Finden Sie die IP-Adresse Ihrer Probe in der DHCP-Tabelle Ihres Routers oder prüfen Sie die Konsolenausgabe
2. Öffnen Sie `http://<probe-ip>:8080` in Ihrem Browser
3. Schließen Sie diese wesentlichen Assistenten-Schritte ab:
   - **Admin-Passwort festlegen** — wählen Sie ein starkes Passwort
   - **Netzwerkschnittstellen zuweisen** — wählen Sie, welcher Port mit Ihrem Scan-Netzwerk verbunden ist
   - **Scan-Modus wählen** — wählen Sie „Einzelschnittstelle" für ein einfaches Setup
   - **Cloudflare Tunnel konfigurieren** (optional) — ermöglicht Fernzugriff über `https://probe.netreconapp.com`
4. Klicken Sie auf **Setup abschließen**

## Minuten 5-7: Probe-Dashboard überprüfen

1. Navigieren Sie nach Abschluss des Assistenten zu `http://<probe-ip>:3000`
2. Melden Sie sich mit den erstellten Admin-Anmeldedaten an
3. Überprüfen Sie, ob das Dashboard Folgendes anzeigt:
   - Systemzustand: CPU, RAM, Speicherverbrauch
   - Netzwerkschnittstellen: mindestens eine Schnittstelle mit der Rolle „Scan"
   - Services: Kern-Services sollten grünen Status anzeigen

## Minuten 7-10: Ersten Scan durchführen

### Option A: Vom Probe-Dashboard

1. Navigieren Sie zu **Scan > Scan starten**
2. Wählen Sie das Zielsubnetz (automatisch erkannt von Ihrer Scan-Schnittstelle)
3. Wählen Sie das **Schnell**-Scan-Profil
4. Klicken Sie auf **Start**
5. Beobachten Sie, wie Geräte in Echtzeit im Dashboard erscheinen

### Option B: Über die NetRecon Scanner App

1. Öffnen Sie die NetRecon Scanner App auf Ihrem Android-Gerät
2. Die App erkennt die Probe per mDNS, wenn Sie im selben Netzwerk sind
3. Alternativ gehen Sie zu **Einstellungen > Probe-Verbindung** und geben die Probe-IP ein
4. Tippen Sie auf **Scannen** auf dem Startbildschirm
5. Wählen Sie Ihr Netzwerk und tippen Sie auf **Scan starten**

## Was während eines Scans passiert

1. **ARP-Erkennung** — die Probe sendet ARP-Anfragen, um alle aktiven Hosts im Subnetz zu finden
2. **Port-Scanning** — jeder entdeckte Host wird auf offene TCP-Ports gescannt
3. **Diensterkennung** — offene Ports werden abgefragt, um den laufenden Dienst und seine Version zu identifizieren
4. **Geräteprofilierung** — die Probe kombiniert MAC-Adresse OUI-Lookup, offene Ports und Dienst-Banner, um den Gerätetyp zu identifizieren

## Nächste Schritte

Nachdem Sie Ihren ersten Scan abgeschlossen haben, erkunden Sie diese Funktionen:

- [Scan-Profile](../scanner/scan-profiles.md) — Scan-Tiefe und -Geschwindigkeit anpassen
- [Berichte](../scanner/reports.md) — PDF-Berichte Ihrer Scanergebnisse erstellen
- [Admin Connect](../admin-connect/overview.md) — Fernverwaltung einrichten
- [Agent-Bereitstellung](../agents/overview.md) — Agents auf Ihren Endgeräten bereitstellen

## FAQ

**F: Der Scan hat weniger Geräte gefunden als erwartet. Warum?**
A: Stellen Sie sicher, dass die Probe im richtigen VLAN/Subnetz ist. Firewalls oder clientseitige Firewalls können ARP-Antworten blockieren. Versuchen Sie, ein **Standard**-Profil anstelle von **Schnell** zu verwenden, um eine gründlichere Erkennung zu erreichen.

**F: Kann ich mehrere Subnetze scannen?**
A: Ja. Konfigurieren Sie zusätzliche Subnetze im Probe-Dashboard unter **Einstellungen > Scan-Ziele**. Multi-Subnetz-Scanning erfordert entsprechendes Routing oder mehrere Netzwerkschnittstellen.

**F: Wie lange dauert ein Scan?**
A: Ein Schnell-Scan eines /24-Subnetzes wird typischerweise in unter 2 Minuten abgeschlossen. Standard dauert 5-10 Minuten. Tiefenscans können je nach Anzahl der Hosts und gescannten Ports 15-30 Minuten dauern.

Für weitere Hilfe kontaktieren Sie [support@netreconapp.com](mailto:support@netreconapp.com).
