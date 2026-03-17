---
sidebar_position: 2
title: Registrierung
description: Probes per QR-Code oder manueller Einrichtung in Admin Connect registrieren
---

# Probe-Registrierung

Die Registrierung ist der Vorgang, eine Probe mit Ihrer Admin Connect App zu verbinden. Nach der Registrierung können Sie die Probe von überall aus ferngesteuert überwachen und verwalten.

## Voraussetzungen

- Admin Connect App auf Ihrem Android-Gerät installiert
- Eine NetRecon Probe, die den Setup-Assistenten abgeschlossen hat
- Internetzugang auf sowohl der Probe als auch Ihrem Mobilgerät

## Methode 1: QR-Code-Registrierung

Die QR-Code-Registrierung ist die schnellste und zuverlässigste Methode. Der QR-Code enthält die Verbindungsdaten und den Authentifizierungstoken der Probe in einem verschlüsselten Format.

### Schritt 1: QR-Code anzeigen

Der QR-Code ist an zwei Stellen verfügbar:

**Während des Setup-Assistenten:**
Am Ende des Assistenten (Schritt 11) wird ein QR-Code auf dem Zusammenfassungsbildschirm angezeigt.

**Vom Probe-Dashboard:**
1. Melden Sie sich im Probe-Dashboard an unter `https://<probe-ip>:3000`
2. Navigieren Sie zu **Einstellungen > Fernzugriff**
3. Klicken Sie auf **Registrierungs-QR-Code generieren**
4. Ein QR-Code wird auf dem Bildschirm angezeigt

### Schritt 2: QR-Code scannen

1. Öffnen Sie Admin Connect
2. Tippen Sie auf die **+**-Schaltfläche, um eine neue Probe hinzuzufügen
3. Wählen Sie **QR-Code scannen**
4. Richten Sie Ihre Kamera auf den QR-Code, der auf der Probe angezeigt wird
5. Die App analysiert automatisch die Verbindungsdaten

### Schritt 3: Überprüfen und verbinden

1. Überprüfen Sie die in der App angezeigten Probe-Details (Hostname, IP, Tunnel-URL)
2. Tippen Sie auf **Verbinden**
3. Die App stellt eine sichere Verbindung zur Probe her
4. Nach der Verbindung erscheint die Probe in Ihrem Flotten-Dashboard

### QR-Code-Inhalt

Der QR-Code kodiert einen JSON-Payload mit:

```json
{
  "hostname": "netrecon-hq",
  "tunnel_url": "https://probe.netreconapp.com",
  "token": "<enrollment-token>",
  "fingerprint": "<certificate-fingerprint>",
  "version": "2.2.0"
}
```

Der Registrierungstoken ist ein Einmaltoken, der nach 24 Stunden abläuft.

## Methode 2: Manuelle Registrierung

Verwenden Sie die manuelle Registrierung, wenn Sie keinen physischen Zugriff auf die Probe haben, um einen QR-Code zu scannen.

### Schritt 1: Verbindungsdaten beschaffen

Sie benötigen Folgendes von Ihrem Probe-Administrator:
- **Tunnel-URL**: typischerweise `https://probe.netreconapp.com` oder eine benutzerdefinierte Domain
- **Registrierungstoken**: eine 32-stellige alphanumerische Zeichenkette
- **Zertifikats-Fingerabdruck** (optional): zur Zertifikat-Pinning-Verifizierung

### Schritt 2: Details in Admin Connect eingeben

1. Öffnen Sie Admin Connect
2. Tippen Sie auf die **+**-Schaltfläche, um eine neue Probe hinzuzufügen
3. Wählen Sie **Manuelle Einrichtung**
4. Geben Sie die erforderlichen Felder ein:
   - **Probe-Name**: ein freundlicher Name zur Identifikation
   - **Tunnel-URL**: die HTTPS-URL für die Probe
   - **Registrierungstoken**: fügen Sie den von Ihrem Administrator bereitgestellten Token ein
5. Tippen Sie auf **Verbinden**

### Schritt 3: Verbindung überprüfen

1. Die App versucht, eine Verbindung herzustellen und sich zu authentifizieren
2. Bei Erfolg werden die Probe-Details angezeigt
3. Tippen Sie auf **Zur Flotte hinzufügen**, um zu bestätigen

## Enterprise-Registrierung

Für groß angelegte Bereitstellungen unterstützt Admin Connect die Massenregistrierung:

### MDM Managed Configuration

Registrierungseinstellungen über Ihre MDM-Lösung bereitstellen:

```xml
<managedAppConfiguration>
  <key>probe_url</key>
  <value>https://probe.netreconapp.com</value>
  <key>enrollment_token</key>
  <value>your-enrollment-token</value>
  <key>auto_enroll</key>
  <value>true</value>
</managedAppConfiguration>
```

### Flotten-Registrierungstoken

Einen wiederverwendbaren Flotten-Registrierungstoken vom Probe-Dashboard generieren:

1. Navigieren Sie zu **Einstellungen > Fernzugriff > Flotten-Registrierung**
2. Klicken Sie auf **Flotten-Token generieren**
3. Legen Sie ein Ablaufdatum und eine maximale Registrierungsanzahl fest
4. Verteilen Sie den Token an Ihr Team

Flotten-Tokens können von mehreren Admin Connect-Instanzen verwendet werden, um dieselbe Probe zu registrieren.

## Registrierte Probes verwalten

### Registrierte Probes anzeigen

Alle registrierten Probes erscheinen auf dem Admin Connect-Startbildschirm. Jede Probe zeigt:
- Verbindungsstatus (online/offline)
- Zuletzt gesehen-Zeitstempel
- Zustandszusammenfassung (CPU, RAM, Speicher)
- Aktive Warnungsanzahl

### Probe entfernen

1. Halten Sie die Probe in der Flottenliste lange gedrückt
2. Wählen Sie **Probe entfernen**
3. Bestätigen Sie die Entfernung

Dies entfernt die Probe nur aus Ihrer App. Die Probe selbst wird nicht beeinflusst.

### Erneute Registrierung

Wenn Sie eine Probe erneut registrieren müssen (z. B. nach einer Token-Rotation):
1. Entfernen Sie die Probe aus Admin Connect
2. Generieren Sie einen neuen Registrierungs-QR-Code oder -Token auf der Probe
3. Registrieren Sie sich erneut mit einer der oben genannten Methoden

## Fehlerbehebung

### QR-Code-Scan fehlgeschlagen
- Stellen Sie ausreichende Beleuchtung sicher und halten Sie die Kamera ruhig
- Versuchen Sie, die Bildschirmhelligkeit des Geräts zu erhöhen, das den QR-Code anzeigt
- Wenn die Kamera nicht fokussieren kann, versuchen Sie, näher oder weiter vom Bildschirm entfernt zu sein

### Verbindungs-Timeout
- Überprüfen Sie, ob die Probe Internetzugang hat und der Cloudflare Tunnel aktiv ist
- Prüfen Sie, ob keine Firewall ausgehendes HTTPS (Port 443) auf Ihrem Mobilgerät blockiert
- Versuchen Sie, zwischen WLAN und Mobilfunkdaten zu wechseln

### Token abgelaufen
- Registrierungstokens laufen nach 24 Stunden ab
- Generieren Sie einen neuen QR-Code oder Token vom Probe-Dashboard

## FAQ

**F: Können mehrere Benutzer dieselbe Probe registrieren?**
A: Ja. Jeder Benutzer registriert sich unabhängig und erhält seine eigene Sitzung. Der Zugriff wird durch die jedem Benutzer zugewiesene Rolle gesteuert (siehe [RBAC](./rbac.md)).

**F: Funktioniert die Registrierung über ein lokales Netzwerk ohne Internet?**
A: Die manuelle Registrierung kann über ein lokales Netzwerk funktionieren, indem Sie die lokale IP-Adresse der Probe anstelle der Tunnel-URL verwenden. Die QR-Registrierung funktioniert ebenfalls lokal.

**F: Wie rotiere ich Registrierungstokens?**
A: Navigieren Sie zu **Einstellungen > Fernzugriff** im Probe-Dashboard und klicken Sie auf **Token rotieren**. Dies macht alle vorherigen Tokens ungültig.

Für weitere Hilfe kontaktieren Sie [support@netreconapp.com](mailto:support@netreconapp.com).
