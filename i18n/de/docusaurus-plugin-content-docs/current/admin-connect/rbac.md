---
sidebar_position: 3
title: Rollenbasierte Zugriffskontrolle
description: Benutzerrollen und Berechtigungen in Admin Connect konfigurieren
---

# Rollenbasierte Zugriffskontrolle (RBAC)

NetRecon verwendet rollenbasierte Zugriffskontrolle, um zu verwalten, was jeder Benutzer sehen und tun kann. Rollen werden auf der Probe definiert und sowohl im Web-Dashboard als auch in der Admin Connect App durchgesetzt.

## Voraussetzungen

- Admin-Zugriff auf das Probe-Dashboard
- Mindestens eine Probe in Admin Connect registriert

## Funktionsweise von RBAC

Jedem Benutzerkonto wird eine Rolle zugewiesen. Rollen enthalten eine Reihe von Berechtigungen, die den Zugriff auf Funktionen steuern. Wenn sich ein Benutzer über Admin Connect oder das Web-Dashboard anmeldet, prüft das System seine Rolle, bevor eine Aktion erlaubt wird.

```
Benutzer → Rolle → Berechtigungen → Zugriff gewährt / verweigert
```

Berechtigungen werden sowohl auf UI-Ebene (nicht verfügbare Funktionen ausblenden) als auch auf API-Ebene (nicht autorisierte Anfragen ablehnen) durchgesetzt.

## Vordefinierte Rollen

NetRecon enthält fünf vordefinierte Rollen:

| Rolle | Beschreibung | Typischer Benutzer |
|---|---|---|
| **Super Admin** | Voller Zugriff auf alle Funktionen und Einstellungen | Plattforminhaber |
| **Admin** | Voller Zugriff außer Rollenverwaltung und Systemeinstellungen | IT-Manager |
| **Analyst** | Scanergebnisse, Warnungen, Berichte anzeigen; keine Einstellungen ändern | Sicherheitsanalyst |
| **Operator** | Scans und Services starten/stoppen; Ergebnisse anzeigen | NOC-Techniker |
| **Betrachter** | Nur-Lese-Zugriff auf Dashboards und Berichte | Führungskraft, Auditor |

## Berechtigungsmatrix

| Berechtigung | Super Admin | Admin | Analyst | Operator | Betrachter |
|---|---|---|---|---|---|
| Dashboard anzeigen | Ja | Ja | Ja | Ja | Ja |
| Scanergebnisse anzeigen | Ja | Ja | Ja | Ja | Ja |
| Scans starten/stoppen | Ja | Ja | Nein | Ja | Nein |
| IDS-Warnungen anzeigen | Ja | Ja | Ja | Ja | Ja |
| IDS-Regeln verwalten | Ja | Ja | Nein | Nein | Nein |
| PCAP starten/stoppen | Ja | Ja | Nein | Ja | Nein |
| PCAP-Dateien herunterladen | Ja | Ja | Ja | Nein | Nein |
| Schwachstellen-Scans ausführen | Ja | Ja | Nein | Ja | Nein |
| Schwachstellenergebnisse anzeigen | Ja | Ja | Ja | Ja | Ja |
| Honeypot verwalten | Ja | Ja | Nein | Nein | Nein |
| VPN verwalten | Ja | Ja | Nein | Nein | Nein |
| DNS-Sinkhole konfigurieren | Ja | Ja | Nein | Nein | Nein |
| Berichte erstellen | Ja | Ja | Ja | Ja | Nein |
| Benutzer verwalten | Ja | Ja | Nein | Nein | Nein |
| Rollen verwalten | Ja | Nein | Nein | Nein | Nein |
| Systemeinstellungen | Ja | Nein | Nein | Nein | Nein |
| Backup/Wiederherstellung | Ja | Ja | Nein | Nein | Nein |
| Audit-Protokoll anzeigen | Ja | Ja | Ja | Nein | Nein |
| Ticketing | Ja | Ja | Ja | Ja | Nein |
| Flottenverwaltung | Ja | Ja | Nein | Nein | Nein |

## Benutzer verwalten

### Benutzer erstellen

1. Melden Sie sich im Probe-Dashboard als Super Admin oder Admin an
2. Navigieren Sie zu **Einstellungen > Benutzer**
3. Klicken Sie auf **Benutzer hinzufügen**
4. Füllen Sie die Benutzerdetails aus:
   - Benutzername
   - E-Mail-Adresse
   - Passwort (oder Einladungslink senden)
   - Rolle (aus vordefinierten Rollen auswählen)
5. Klicken Sie auf **Erstellen**

### Benutzerrolle bearbeiten

1. Navigieren Sie zu **Einstellungen > Benutzer**
2. Klicken Sie auf den Benutzer, den Sie ändern möchten
3. Ändern Sie das **Rolle**-Dropdown
4. Klicken Sie auf **Speichern**

### Benutzer deaktivieren

1. Navigieren Sie zu **Einstellungen > Benutzer**
2. Klicken Sie auf den Benutzer
3. Schalten Sie **Aktiv** auf aus
4. Klicken Sie auf **Speichern**

Deaktivierte Benutzer können sich nicht anmelden, aber ihr Audit-Verlauf wird beibehalten.

## Benutzerdefinierte Rollen

Super Admins können benutzerdefinierte Rollen mit granularen Berechtigungen erstellen:

1. Navigieren Sie zu **Einstellungen > Rollen**
2. Klicken Sie auf **Rolle erstellen**
3. Geben Sie einen Rollennamen und eine Beschreibung ein
4. Schalten Sie einzelne Berechtigungen ein/aus
5. Klicken Sie auf **Speichern**

Benutzerdefinierte Rollen erscheinen neben vordefinierten Rollen bei der Benutzerzuweisung.

## Zwei-Faktor-Authentifizierung

2FA kann pro Rolle erzwungen werden:

1. Navigieren Sie zu **Einstellungen > Rollen**
2. Wählen Sie eine Rolle
3. Aktivieren Sie **2FA erforderlich**
4. Klicken Sie auf **Speichern**

Benutzer mit dieser Rolle müssen bei der nächsten Anmeldung TOTP-basierte 2FA einrichten.

## Sitzungsverwaltung

Sitzungsrichtlinien pro Rolle konfigurieren:

| Einstellung | Beschreibung | Standard |
|---|---|---|
| Sitzungs-Timeout | Automatische Abmeldung nach Inaktivität | 30 Minuten |
| Max. gleichzeitige Sitzungen | Maximale gleichzeitige Anmeldungen | 3 |
| IP-Einschränkung | Anmeldung auf bestimmte IP-Bereiche beschränken | Deaktiviert |

Konfigurieren Sie diese unter **Einstellungen > Rollen > [Rollenname] > Sitzungsrichtlinie**.

## Audit-Protokoll

Alle berechtigungsrelevanten Aktionen werden protokolliert:

- Benutzer-An-/Abmeldeereignisse
- Rollenänderungen
- Berechtigungsänderungen
- Fehlgeschlagene Zugriffsversuche
- Konfigurationsänderungen

Sehen Sie das Audit-Protokoll unter **Einstellungen > Audit-Protokoll**. Protokolle werden standardmäßig 90 Tage aufbewahrt.

## FAQ

**F: Kann ich die vordefinierten Rollen ändern?**
A: Nein. Vordefinierte Rollen sind schreibgeschützt, um eine konsistente Grundlage zu gewährleisten. Erstellen Sie eine benutzerdefinierte Rolle, wenn Sie andere Berechtigungen benötigen.

**F: Was passiert, wenn ich eine Rolle lösche, der Benutzer zugewiesen sind?**
A: Sie müssen alle Benutzer einer anderen Rolle zuweisen, bevor Sie eine benutzerdefinierte Rolle löschen. Das System verhindert das Löschen, wenn noch Benutzer zugewiesen sind.

**F: Werden Rollen über mehrere Probes synchronisiert?**
A: Rollen werden pro Probe definiert. Wenn Sie mehrere Probes verwalten, müssen Sie Rollen auf jeder einzelnen konfigurieren. Ein zukünftiges Update wird zentralisierte Rollenverwaltung unterstützen.

**F: Kann ich einen Benutzer auf bestimmte Subnetze oder Geräte beschränken?**
A: Derzeit steuern Rollen den Funktionszugriff, nicht den Datenzugriff. Subnetz-Einschränkungen sind für die Zukunft geplant.

Für weitere Hilfe kontaktieren Sie [support@netreconapp.com](mailto:support@netreconapp.com).
