---
sidebar_position: 3
title: Berichte
description: PDF-Sicherheitsaudit-Berichte erstellen und anpassen
---

# Berichte

NetRecon Scanner erstellt professionelle PDF-Berichte aus Ihren Scanergebnissen. Berichte sind für Sicherheitsaudits, Compliance-Dokumentation und Kundenlieferungen konzipiert.

## Voraussetzungen

- Mindestens ein abgeschlossener Scan mit Ergebnissen
- Ausreichend Gerätespeicher für die PDF-Erstellung (typischerweise 1-5 MB pro Bericht)

## Bericht erstellen

1. Schließen Sie einen Netzwerk-Scan ab
2. Tippen Sie auf dem Scanergebnis-Bildschirm auf die Schaltfläche **Bericht** oben rechts
3. Wählen Sie den Berichtstyp und passen Sie die Optionen an
4. Tippen Sie auf **PDF erstellen**
5. Der Bericht wird gespeichert und kann über jede Android-Freigabemethode geteilt werden

## Berichtsinhalte

Ein Standardbericht enthält die folgenden Abschnitte:

### Zusammenfassung

- Scan-Datum und -Dauer
- Netzwerkumfang (Subnetz, verwendetes Profil)
- Gesamtzahl entdeckter Geräte
- Zusammenfassung der wichtigsten Ergebnisse (offene Hochrisiko-Ports, nicht identifizierte Geräte)

### Geräte-Inventar

- Vollständige Liste der entdeckten Geräte
- IP-Adresse, MAC-Adresse, Hostname
- Gerätetyp und Hersteller
- Betriebssystem (wenn erkannt)

### Port- und Dienstanalyse

- Offene Ports pro Gerät
- Laufende Dienste und Versionen
- Dienst-Risikoklassifizierung (Niedrig / Mittel / Hoch / Kritisch)

### Sicherheitsergebnisse

- Geräte mit Hochrisiko-offenen Ports (z. B. Telnet, FTP, SMB)
- Unverschlüsselte Dienste erkannt
- Standard- oder bekannt anfällige Dienst-Versionen
- CVE-Referenzen für erkannte Dienst-Versionen (wenn CVE-Datenbank verfügbar)

### Netzwerktopologie

- Textbasierte Zusammenfassung des Netzwerklayouts
- Geräteverteilung nach Typ (Server, Arbeitsstationen, Netzwerkgeräte, IoT)

### Anhang

- Vollständige Port-Scan-Details pro Host
- Rohe Dienst-Banner
- Scan-Konfiguration und Profil-Einstellungen

## Berichtsanpassung

Vor der Erstellung können Sie den Bericht anpassen:

| Option | Beschreibung |
|---|---|
| Firmenname | Erscheint in der Kopfzeile und auf der Titelseite |
| Berichtstitel | Benutzerdefinierter Titel (Standard: „Netzwerk-Sicherheitsaudit-Bericht") |
| Logo | Firmenlogo für die Titelseite hochladen |
| Abschnitte einschließen | Einzelne Abschnitte ein-/ausschalten |
| Vertraulichkeitskennzeichnung | Vertraulich / Intern / Öffentlich |
| Sprache | Bericht in jeder der 11 unterstützten Sprachen erstellen |

## Berichte teilen

Nach der Erstellung können Sie das PDF teilen über:

- **E-Mail** — tippen Sie auf Teilen und wählen Sie Ihre E-Mail-App
- **Cloud-Speicher** — in Google Drive, OneDrive usw. speichern
- **QR-Code** — QR-Code generieren, der auf den lokal gehosteten Bericht verlinkt (nützlich für die Übergabe an einen Kollegen im selben Netzwerk)
- **Direktübertragung** — Android Nearby Share-Funktion nutzen

## Schrift- und Unicode-Unterstützung

Berichte verwenden die NotoSans-Schriftfamilie, um die korrekte Darstellung zu gewährleisten von:
- Lateinischen Zeichen (EN, DE, FR, ES, NL usw.)
- Kyrillischen Zeichen (RU)
- Türkischen Sonderzeichen (TR)
- Skandinavischen Zeichen (SV, NO, DA)
- Polnischen Zeichen (PL)

Alle 11 unterstützten Sprachen werden in generierten PDFs korrekt dargestellt.

## Berichtsspeicherung

Erstellte Berichte werden lokal auf dem Gerät gespeichert:

- Standardspeicherort: interner App-Speicher
- Berichte können in externen Speicher oder die Cloud exportiert werden
- Alte Berichte können unter **Berichte > Verlauf** verwaltet werden
- Berichte verfallen nicht und bleiben verfügbar, bis sie manuell gelöscht werden

## FAQ

**F: Kann ich einen Bericht aus Probe-Scanergebnissen erstellen?**
A: Ja. Wenn Sie mit einer Probe verbunden sind, können Sie Berichte sowohl aus lokalen Scanergebnissen als auch aus Probe-Scandaten erstellen. Probe-Berichte können zusätzliche Daten wie IDS-Warnungen und Schwachstellenergebnisse enthalten.

**F: Wie groß darf das Netzwerk maximal für einen Bericht sein?**
A: Berichte wurden mit Netzwerken von bis zu 1.000 Geräten getestet. Größere Netzwerke können länger für die Erstellung benötigen, es gibt aber kein festes Limit.

**F: Kann ich automatische Berichte planen?**
A: Geplante Berichterstattung ist im Probe-Dashboard verfügbar. Konfigurieren Sie Berichtszeitpläne unter **Einstellungen > Berichte > Zeitplan**.

**F: Das PDF zeigt unleserlichen Text. Wie behebe ich das?**
A: Dies tritt typischerweise auf, wenn das PDF auf einem Gerät ohne NotoSans-Schriftunterstützung angezeigt wird. Öffnen Sie das PDF in Google Chrome, Adobe Acrobat oder einem anderen modernen PDF-Reader, der eingebettete Schriften unterstützt.

Für weitere Hilfe kontaktieren Sie [support@netreconapp.com](mailto:support@netreconapp.com).
