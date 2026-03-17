---
sidebar_position: 1
title: Schnellstart
description: Starten Sie mit NetRecon Cloud in wenigen Minuten
---

# Cloud-Schnellstart

NetRecon Cloud ist der schnellste Weg, um loszulegen. Kein Server-Setup, kein Docker — einfach registrieren, eine Probe bereitstellen und Ihr Netzwerk entdecken.

## Schritt 1: Konto erstellen

1. Gehen Sie zu [app.netreconapp.com](https://app.netreconapp.com) und klicken Sie auf **Registrieren**
2. Geben Sie Ihre E-Mail-Adresse, Ihren Firmennamen und ein Passwort ein
3. Bestätigen Sie Ihre E-Mail-Adresse
4. Melden Sie sich im NetRecon Dashboard an

## Schritt 2: Ersten Standort hinzufügen

1. Navigieren Sie im Dashboard zu **Standorte** in der Seitenleiste
2. Klicken Sie auf **Standort hinzufügen**
3. Geben Sie einen Namen und eine Adresse für den Standort ein (z. B. „Hauptbüro — Istanbul")
4. Speichern Sie den Standort

## Schritt 3: Probe bereitstellen

Jeder Standort benötigt mindestens eine Probe für Netzwerkerkennung und Überwachung.

### Option A: NetRecon OS (Empfohlen)

1. Gehen Sie zu **Standorte → [Ihr Standort] → Probes → Probe hinzufügen**
2. Wählen Sie **NetRecon OS** und laden Sie das Image für Ihre Hardware herunter
3. Flashen Sie das Image auf eine SD-Karte oder SSD mit [balenaEtcher](https://etcher.balena.io/)
4. Verbinden Sie die Probe per Ethernet mit Ihrem Netzwerk
5. Schalten Sie sie ein — die Probe verbindet sich automatisch über Cloudflare Tunnel mit Ihrem Cloud-Konto

### Option B: Docker auf bestehendem Server

```bash
# Probe-Container herunterladen und starten
docker run -d \
  --name netrecon-probe \
  --network host \
  --restart unless-stopped \
  -e ENROLLMENT_TOKEN="your-token-from-dashboard" \
  netrecon/probe:latest
```

Holen Sie sich den Enrollment-Token unter **Standorte → [Ihr Standort] → Probes → Probe hinzufügen → Docker**.

### Option C: Virtuelle Maschine

1. Laden Sie die OVA-Datei aus dem Dashboard herunter
2. Importieren Sie sie in VMware, Proxmox oder Hyper-V
3. Konfigurieren Sie die VM mit **Bridged Networking** (erforderlich für Layer-2-Scanning)
4. Starten Sie die VM — sie erscheint automatisch in Ihrem Dashboard

## Schritt 4: Scanning starten

Sobald die Probe online ist:

1. Gehen Sie zu **Standorte → [Ihr Standort] → Geräte**
2. Klicken Sie auf **Jetzt scannen** oder warten Sie auf die automatische Erkennung (alle 15 Minuten)
3. Erkannte Geräte erscheinen im Geräte-Inventar

## Schritt 5: Mobile App installieren

Laden Sie **NetRecon Scanner** aus dem Google Play Store für Netzwerk-Scanning unterwegs herunter:

- Scannen Sie jedes Netzwerk, mit dem Ihr Telefon verbunden ist
- Ergebnisse werden automatisch mit Ihrem Cloud-Dashboard synchronisiert
- Weitere Details finden Sie unter [Scanner-Übersicht](../scanner/overview)

## Was kommt als Nächstes?

- **Agents bereitstellen** auf Endgeräten für tiefere Einblicke → [Agent-Installation](../agents/overview)
- **Benachrichtigungen einrichten** für neue Geräte, Schwachstellen oder Ausfallzeiten
- **Integrationen konfigurieren** mit Ihren bestehenden Tools (LDAP, SIEM, Jira, ServiceNow)
- **Team einladen** über **Einstellungen → Teamverwaltung**

## Cloud vs Self-Hosted

| Funktion | Cloud | Self-Hosted |
|---|---|---|
| Serververwaltung | Von NetRecon verwaltet | Sie verwalten |
| Datenstandort | NetRecon Cloud (EU) | Ihre Infrastruktur |
| Updates | Automatisch | Manuell (docker pull) |
| Cloudflare Tunnel | Inklusive | Eigene Konfiguration |
| Preismodell | Abonnement | Lizenzschlüssel |

Brauchen Sie stattdessen Self-Hosted? Siehe die [Installationsanleitung](../self-hosting/installation).

Für Hilfe kontaktieren Sie [support@netreconapp.com](mailto:support@netreconapp.com).
