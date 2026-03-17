---
sidebar_position: 2
title: Endpunkt-Referenz
description: Vollständige API-Endpunkt-Referenz gruppiert nach Service und Kategorie
---

# Endpunkt-Referenz

Diese Seite listet jeden REST API-Endpunkt der NetRecon-Plattform auf, gruppiert nach Service-Kategorie. Alle Endpunkte erfordern JWT Bearer-Token-Authentifizierung, sofern nicht anders angegeben. Siehe die [API-Übersicht](./overview.md) für Details zu Authentifizierung und Rate-Limiting.

**Basis-URL:** `https://probe.netreconapp.com/api/`

---

## Probe-Endpunkte

Bereitgestellt vom Go-Backend, das auf der Probe-Appliance läuft (Orange Pi R2S, Raspberry Pi oder x86_64 Mini PC).

### Zustandsprüfung

| Methode | Pfad | Auth | Beschreibung |
|---|---|---|---|
| `GET` | `/api/health` | Nein | Probe-Zustandsprüfung. Gibt `{"status": "ok", "version": "1.0.0"}` zurück. |

### Scanning

| Methode | Pfad | Beschreibung |
|---|---|---|
| `POST` | `/api/scan/discover` | ARP-Host-Erkennung im konfigurierten Subnetz starten. |
| `POST` | `/api/scan/ports` | Port-Scan gegen entdeckte Hosts starten. |
| `GET` | `/api/scan/status` | Aktuellen Scan-Status abrufen (idle, running, complete). |

### Geräte

| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/api/devices` | Alle entdeckten Geräte auflisten. Unterstützt Paginierung (`?page=&per_page=`). |
| `GET` | `/api/devices/:mac` | Details für ein einzelnes Gerät nach MAC-Adresse abrufen. |
| `PUT` | `/api/devices/:mac/note` | Benutzernotiz eines Geräts aktualisieren. Body: `{"note": "..."}`. |

### Baseline

| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/api/baseline` | Alle gespeicherten Netzwerk-Baselines auflisten. |
| `POST` | `/api/baseline` | Neuen Baseline-Snapshot aus der aktuellen Geräteliste erstellen. |
| `GET` | `/api/baseline/:id/diff` | Baseline mit dem aktuellen Netzwerkzustand vergleichen. |

### Nachbarn (CDP/LLDP)

| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/api/neighbors` | Entdeckte CDP/LLDP-Nachbarn auflisten. |
| `POST` | `/api/neighbors/start` | Nachbar-Erkennungs-Listener starten. |

### Konfigurations-Backup (Probe-lokal)

| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/api/config/targets` | Konfigurierte Backup-Zielgeräte auflisten. |
| `POST` | `/api/config/targets` | Neues Backup-Zielgerät hinzufügen. |
| `POST` | `/api/config/targets/:id/check` | Sofortige Konfigurationsprüfung für ein Ziel auslösen. |

### PCAP-Aufzeichnung

| Methode | Pfad | Beschreibung |
|---|---|---|
| `POST` | `/api/pcap/start` | Paketaufzeichnung starten. Body: `{"interface": "eth0", "filter": "tcp port 80"}`. |
| `POST` | `/api/pcap/stop` | Laufende Paketaufzeichnung stoppen. |
| `GET` | `/api/pcap/files` | Verfügbare PCAP-Aufzeichnungsdateien auflisten. |
| `GET` | `/api/pcap/download/:id` | PCAP-Datei nach ID herunterladen. Gibt `application/octet-stream` zurück. |

### IDS (Suricata)

| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/api/ids/status` | IDS-Service-Status abrufen (running, stopped, Regelanzahl). |
| `POST` | `/api/ids/start` | Suricata IDS-Überwachung starten. |
| `POST` | `/api/ids/stop` | IDS-Überwachung stoppen. |
| `GET` | `/api/ids/alerts` | IDS-Warnungen auflisten. Unterstützt `?since=24h` Zeitfilter. |

### Schwachstellen-Scanning (Nuclei)

| Methode | Pfad | Beschreibung |
|---|---|---|
| `POST` | `/api/vuln/scan` | Schwachstellen-Scan gegen angegebene Ziele starten. |
| `POST` | `/api/vuln/stop` | Laufenden Schwachstellen-Scan stoppen. |
| `GET` | `/api/vuln/results` | Schwachstellen-Scan-Ergebnisse abrufen. |
| `GET` | `/api/vuln/status` | Schwachstellen-Scanner-Status abrufen. |

### Honeypot

| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/api/honeypot/status` | Honeypot-Service-Status abrufen. |
| `POST` | `/api/honeypot/start` | Honeypot-Service starten. |
| `POST` | `/api/honeypot/stop` | Honeypot-Service stoppen. |
| `GET` | `/api/honeypot/hits` | Honeypot-Interaktionsereignisse auflisten. |

### Rogue-Erkennung

| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/api/rogue/status` | Rogue-Erkennungs-Service-Status abrufen. |
| `POST` | `/api/rogue/start` | Rogue-DHCP/ARP-Erkennung starten. |
| `POST` | `/api/rogue/stop` | Rogue-Erkennung stoppen. |
| `GET` | `/api/rogue/alerts` | Rogue-DHCP- und ARP-Spoofing-Warnungen auflisten. |

### Netzwerk-Monitor

| Methode | Pfad | Beschreibung |
|---|---|---|
| `POST` | `/api/monitor/targets` | Überwachungsziel hinzufügen (IP oder Hostname). |
| `GET` | `/api/monitor/targets` | Konfigurierte Überwachungsziele auflisten. |
| `POST` | `/api/monitor/start` | Netzwerküberwachung starten. |
| `POST` | `/api/monitor/stop` | Netzwerküberwachung stoppen. |
| `GET` | `/api/monitor/latency` | Latenzmessungen für überwachte Ziele abrufen. |
| `GET` | `/api/monitor/packetloss` | Paketverlustdaten für überwachte Ziele abrufen. |
| `GET` | `/api/monitor/status` | Monitor-Service-Status abrufen. |

### VPN (WireGuard)

| Methode | Pfad | Beschreibung |
|---|---|---|
| `POST` | `/api/vpn/setup` | WireGuard VPN-Parameter konfigurieren. |
| `GET` | `/api/vpn/status` | VPN-Verbindungsstatus abrufen. |
| `POST` | `/api/vpn/start` | VPN-Tunnel starten. |
| `POST` | `/api/vpn/stop` | VPN-Tunnel stoppen. |
| `GET` | `/api/vpn/config` | WireGuard-Konfiguration herunterladen. |

### DNS-Sinkhole

| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/api/dns/status` | DNS-Sinkhole-Service-Status abrufen. |
| `POST` | `/api/dns/start` | DNS-Sinkhole starten. |
| `POST` | `/api/dns/stop` | DNS-Sinkhole stoppen. |
| `GET` | `/api/dns/threats` | Blockierte DNS-Bedrohungseinträge auflisten. |

### Systemzustand

| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/api/system/health` | Detaillierter Systemzustand (CPU, RAM, Speicher, Temperatur). |
| `GET` | `/api/system/history` | Historische Systemzustandsdaten. |
| `GET` | `/api/system/alerts` | Systemzustands-Schwellenwert-Warnungen auflisten. |
| `POST` | `/api/system/thresholds` | Zustandswarnungs-Schwellenwerte konfigurieren (CPU %, RAM %, Speicher %). |

### Backup & Wiederherstellung

| Methode | Pfad | Beschreibung |
|---|---|---|
| `POST` | `/api/backup/create` | Vollständiges Probe-Backup erstellen (Konfiguration + Datenbank). |
| `GET` | `/api/backup/list` | Verfügbare Backup-Dateien auflisten. |
| `GET` | `/api/backup/download/:id` | Backup-Archiv herunterladen. Gibt `application/octet-stream` zurück. |
| `POST` | `/api/backup/restore` | Probe aus einer Backup-Datei wiederherstellen. |

### Ticketing

| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/api/ticketing/config` | Aktuelle Ticketing-Integrationskonfiguration abrufen. |
| `POST` | `/api/ticketing/config` | Ticketing-Konfiguration festlegen (ServiceNow, Jira, Webhook-URL). |
| `POST` | `/api/ticketing/test` | Test-Ticket zur Validierung der Integration senden. |
| `POST` | `/api/ticketing/create` | Ticket aus einer Warnung oder einem Ereignis erstellen. |
| `GET` | `/api/ticketing/history` | Zuvor erstellte Tickets auflisten. |

### WebSocket

| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/ws/events` | WebSocket-Verbindung für Echtzeit-Probe-Ereignisse. Token per Query übergeben: `?token=<jwt>`. |

#### WebSocket-Ereignistypen

| Ereignis | Beschreibung |
|---|---|
| `host_found` | Neues Gerät entdeckt |
| `port_found` | Offener Port auf einem Gerät erkannt |
| `scan_complete` | Netzwerk-Scan abgeschlossen |
| `neighbor_discovered` | CDP/LLDP-Nachbar gefunden |
| `config_changed` | Gerätekonfiguration geändert |
| `baseline_diff_alert` | Netzwerk-Baseline-Abweichung erkannt |
| `ids_alert` | IDS-Regel ausgelöst |
| `honeypot_hit` | Honeypot-Interaktion erkannt |
| `rogue_detected` | Nicht autorisierte DHCP- oder ARP-Aktivität |
| `pcap_ready` | PCAP-Datei zum Download bereit |
| `vuln_found` | Schwachstelle entdeckt |
| `dns_threat` | DNS-Bedrohung blockiert |
| `probe_health_alert` | Probe-Ressourcenschwellenwert überschritten |
| `error` | Fehlerereignis |

---

## API Gateway-Endpunkte

Bereitgestellt vom FastAPI API Gateway (Port 8000). Übernimmt Authentifizierung, Benutzerverwaltung, RBAC und Proxy-Routing zu Backend-Services.

### Authentifizierung

| Methode | Pfad | Beschreibung |
|---|---|---|
| `POST` | `/api/auth/login` | Mit Benutzername/Passwort authentifizieren, JWT-Token erhalten. |
| `POST` | `/api/auth/refresh` | Ablaufenden JWT-Token erneuern. |

### Benutzer

| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/api/users` | Benutzer der Organisation auflisten. |
| `POST` | `/api/users` | Neues Benutzerkonto erstellen. |
| `GET` | `/api/users/:id` | Benutzerdetails abrufen. |
| `PUT` | `/api/users/:id` | Benutzer aktualisieren. |
| `DELETE` | `/api/users/:id` | Benutzer löschen. |

### RBAC (Rollenbasierte Zugriffskontrolle)

| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/api/rbac/roles` | Alle definierten Rollen auflisten. |
| `POST` | `/api/rbac/roles` | Benutzerdefinierte Rolle mit spezifischen Berechtigungen erstellen. |
| `PUT` | `/api/rbac/roles/:id` | Rollenberechtigungen aktualisieren. |
| `DELETE` | `/api/rbac/roles/:id` | Rolle löschen. |
| `GET` | `/api/rbac/permissions` | Alle verfügbaren Berechtigungen auflisten. |

### API-Schlüssel

| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/api/keys` | API-Schlüssel der Organisation auflisten. |
| `POST` | `/api/keys` | Neuen langlebigen API-Schlüssel erstellen. |
| `DELETE` | `/api/keys/:id` | API-Schlüssel widerrufen. |

### IP-Allowlist

| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/api/ip-allowlist` | Erlaubte IP-Bereiche auflisten. |
| `POST` | `/api/ip-allowlist` | IP oder CIDR-Bereich zur Allowlist hinzufügen. |
| `DELETE` | `/api/ip-allowlist/:id` | IP-Bereich aus der Allowlist entfernen. |

### Überwachung (Prometheus Proxy)

| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/api/monitoring/metrics` | Proxy zum Prometheus-Metriken-Endpunkt. |
| `GET` | `/api/monitoring/query` | PromQL-Abfrage an Prometheus weiterleiten. |

### Oxidized (Config-Backup-Proxy)

| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/api/oxidized/nodes` | Von Oxidized verwaltete Netzwerkknoten auflisten. |
| `GET` | `/api/oxidized/nodes/:name` | Konfigurationsverlauf für einen Knoten abrufen. |
| `POST` | `/api/oxidized/nodes` | Knoten zur Oxidized-Verwaltung hinzufügen. |

### Vault-Konfiguration

| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/api/vault/config` | Vault-Integrationseinstellungen abrufen. |
| `POST` | `/api/vault/config` | Vault-Integrationseinstellungen aktualisieren. |

---

## IPAM Service-Endpunkte

IP-Adressverwaltungs-Service (Port 8009). Alle Pfade sind mit `/api/v1/ipam` präfixiert.

### Präfixe (Subnetze)

| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/api/v1/ipam/prefixes` | Alle verwalteten Präfixe/Subnetze auflisten. |
| `POST` | `/api/v1/ipam/prefixes` | Neues Präfix erstellen. Body: `prefix` (CIDR-Notation), `description`, `site`, `status`, optional `vlan_id`. |
| `GET` | `/api/v1/ipam/prefixes/:id` | Einzelnes Präfix mit neu berechnetem Auslastungsprozentsatz abrufen. |
| `PUT` | `/api/v1/ipam/prefixes/:id` | Präfix aktualisieren. |
| `DELETE` | `/api/v1/ipam/prefixes/:id` | Präfix löschen. Gibt `204 No Content` zurück. |
| `GET` | `/api/v1/ipam/prefixes/:id/available` | Nicht zugewiesene IPs im Präfix auflisten. Auf 256 Ergebnisse begrenzt. |
| `POST` | `/api/v1/ipam/prefixes/:id/next-available` | Nächste freie IP im Präfix zuweisen. Gibt den neuen Adresseintrag zurück. |

### Adressen

| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/api/v1/ipam/addresses` | Adressen auflisten. Filter: `?prefix_id=`, `?status=`, `?vendor=`, `?search=`. Max 1000 Ergebnisse. |
| `POST` | `/api/v1/ipam/addresses` | Neuen IP-Adresseintrag erstellen. |
| `GET` | `/api/v1/ipam/addresses/:id` | Einzelne Adresse nach UUID abrufen. |
| `PUT` | `/api/v1/ipam/addresses/:id` | Adresseintrag aktualisieren. |
| `DELETE` | `/api/v1/ipam/addresses/:id` | Adresseintrag löschen. Gibt `204 No Content` zurück. |
| `POST` | `/api/v1/ipam/addresses/bulk-import` | Massen-Upsert von Adressen nach IP. Bestehende Einträge werden aktualisiert, neue erstellt. |

### VLANs

| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/api/v1/ipam/vlans` | Alle VLANs auflisten, sortiert nach VLAN-ID. |
| `POST` | `/api/v1/ipam/vlans` | Neuen VLAN-Eintrag erstellen. Body: `vlan_id`, `name`, `description`, `status`. |
| `PUT` | `/api/v1/ipam/vlans/:id` | VLAN aktualisieren. |
| `DELETE` | `/api/v1/ipam/vlans/:id` | VLAN löschen. Gibt `204 No Content` zurück. |

### Analysen

| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/api/v1/ipam/stats` | Gesamt-IPAM-Statistiken: Gesamtpräfixe, Gesamtadressen, durchschnittliche Auslastung, Konfliktanzahl. |
| `GET` | `/api/v1/ipam/utilization` | Auslastungsaufschlüsselung pro Präfix mit Adressanzahlen. |
| `GET` | `/api/v1/ipam/conflicts` | Konfligierende Zuweisungen finden (doppelte MACs mit verschiedenen IPs). |

### Import / Export

| Methode | Pfad | Beschreibung |
|---|---|---|
| `POST` | `/api/v1/ipam/import/scan` | Geräte aus einem NetRecon-Scan-Payload importieren. Upsert nach IP mit automatischem Präfix-Abgleich. |
| `GET` | `/api/v1/ipam/export/csv` | Alle Adressen als CSV exportieren. Gibt `text/csv` mit `Content-Disposition`-Header zurück. |
| `GET` | `/api/v1/ipam/export/json` | Alle IPAM-Daten (Präfixe, Adressen, VLANs) als JSON exportieren. |

---

## CMod Service-Endpunkte

Configuration Management on Demand (Port 8008). Bietet SSH- und serielle Konsolenzugriff auf Netzwerkgeräte. Alle Pfade sind mit `/api/v1/cmod` präfixiert.

### Sitzungen

| Methode | Pfad | Beschreibung |
|---|---|---|
| `POST` | `/api/v1/cmod/connect` | Neue SSH- oder serielle Sitzung öffnen. Body: `host`, `device_type`, `username`, `password`, optional `port`, `serial_port`. Gibt Sitzungsinfo mit `session_id` zurück. |
| `POST` | `/api/v1/cmod/disconnect` | Sitzung schließen. Query: `?session_id=`. |
| `GET` | `/api/v1/cmod/sessions` | Alle aktiven Sitzungen auflisten. |
| `GET` | `/api/v1/cmod/sessions/:session_id` | Sitzungsdetails und vollständiges Befehlsprotokoll abrufen. |
| `DELETE` | `/api/v1/cmod/sessions/:session_id` | Sitzung beenden. |

### Befehle

| Methode | Pfad | Beschreibung |
|---|---|---|
| `POST` | `/api/v1/cmod/send-command` | Einzelnen Befehl senden. Body: `session_id`, `command`, optional `expect_string`, `read_timeout`. |
| `POST` | `/api/v1/cmod/send-batch` | Mehrere Befehle sequenziell senden. Body: `session_id`, `commands[]`, optional `delay_factor`. |

### Konfigurationsoperationen

| Methode | Pfad | Beschreibung |
|---|---|---|
| `POST` | `/api/v1/cmod/backup` | Laufende Konfiguration vom Gerät abrufen. Wählt automatisch den richtigen Befehl pro Hersteller (Cisco IOS/NX-OS/XR, Huawei, Juniper, Arista, HP). |
| `POST` | `/api/v1/cmod/rollback` | Konfigurationsausschnitt im Config-Modus auf das Gerät übertragen. Body: `session_id`, `config` (mehrzeiliger String). |

### Vorlagen

| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/api/v1/cmod/templates` | Befehlsvorlagen auflisten. Filter: `?vendor=cisco_ios`, `?category=backup`. Vorgefertigte Vorlagen für Cisco IOS, Huawei und Juniper JunOS. |
| `POST` | `/api/v1/cmod/templates` | Benutzerdefinierte Befehlsvorlage erstellen. Body: `name`, `vendor`, `category`, `commands[]`, `description`. |

---

## Agent Registry-Endpunkte

Agent-Verwaltungs-Service (Port 8006). Behandelt Registrierung, Heartbeats, Inventar und Bereitstellung für Windows-, macOS- und Linux-Agents.

### Agent-Lebenszyklus

| Methode | Pfad | Beschreibung |
|---|---|---|
| `POST` | `/agents/enroll` | Neuen Agent mit einem Deployment-Token registrieren. Body: `deployment_token`, `hostname`, `os_type`, `os_version`, `arch`, `agent_version`. |
| `POST` | `/agents/heartbeat` | Agent-Heartbeat. Headers: `X-Agent-ID`, `X-Session-Key`. |
| `POST` | `/agents/inventory` | Hardware-/Software-Inventar übermitteln. Headers: `X-Agent-ID`, `X-Session-Key`. |
| `GET` | `/agents` | Alle Agents der Organisation auflisten. Header: `X-Org-ID`. |
| `GET` | `/agents/:agent_id` | Vollständige Agent-Details einschließlich Hardware-Spezifikationen und Garantiestatus abrufen. |
| `DELETE` | `/agents/:agent_id` | Agent aus der Registry entfernen. |

### Deployment-Tokens

| Methode | Pfad | Beschreibung |
|---|---|---|
| `POST` | `/agents/tokens` | Deployment-Token erstellen. Headers: `X-Org-ID`, `X-User-ID`. Body: `expires_in_hours`, `max_uses`, `label`, optional `site_id`, `metadata`. Gibt Token-String und plattformspezifische Installationsbefehle zurück. |
| `GET` | `/agents/tokens` | Deployment-Tokens der Organisation auflisten. Header: `X-Org-ID`. |
| `DELETE` | `/agents/tokens/:token_id` | Deployment-Token widerrufen. |

### Deployment-Paket-Generator

| Methode | Pfad | Beschreibung |
|---|---|---|
| `POST` | `/agents/deploy/generate` | Plattformspezifische Deployment-Artefakte generieren. Body: `platform` (windows, linux, macos, ios, android), `method` (msi, powershell, sccm, intune, gpo, pkg, brew, jamf, mdm, deb, rpm, bash, docker, qr, email, mdm_app, managed_play), `role`. Gibt Registrierungstoken, Installationsbefehle, Skripte oder Manifest-Inhalt zurück. |
| `GET` | `/agents/deploy/quota` | Gerätekontingentnutzung der Organisation abrufen. Header: `X-Org-ID`. |
| `GET` | `/agents/deploy/platforms` | Alle unterstützten Plattformen und deren verfügbare Deployment-Methoden auflisten. Keine Authentifizierung erforderlich. |

### Fernverbindung

| Methode | Pfad | Beschreibung |
|---|---|---|
| `POST` | `/agents/:agent_id/remote/request` | Neue Fernsitzung (RDP, SSH, VNC, ADB) zu einem registrierten Agent anfordern. Header: `X-User-ID`. Body: `session_type`, optional `credential_id`, `timeout_hours`. |
| `GET` | `/agents/:agent_id/remote/status` | Fernbereitschaftsstatus abrufen (Online-Status, Headscale-IP, verfügbare Sitzungstypen). |
| `POST` | `/agents/:agent_id/remote/end` | Aktive Fernsitzung für einen Agent beenden. Header: `X-User-ID`. |
| `GET` | `/remote/sessions` | Fernsitzungen der Organisation auflisten. Header: `X-Org-ID`. Query: `?active_only=true` (Standard). |
| `POST` | `/agents/:agent_id/remote/ready` | Agent-Callback wenn Ferndienst vorbereitet ist. Headers: `X-Agent-ID`, `X-Session-Key`. |
| `POST` | `/remote/cleanup` | Veraltete Fernsitzungen ablaufen lassen. Für internen Scheduler/Cron vorgesehen. |

---

## Diplomat Service-Endpunkte

E-Mail-Klassifizierungs- und Log-Analyse-Service (Port 8010). Alle Pfade sind mit `/api/v1/diplomat` präfixiert.

### Klassifizierung

| Methode | Pfad | Beschreibung |
|---|---|---|
| `POST` | `/api/v1/diplomat/classify` | Eingabetext (Ticket, Warnung, E-Mail) in eine Kategorie und Prioritätsstufe klassifizieren. |
| `POST` | `/api/v1/diplomat/summarize` | Zusammenfassung des bereitgestellten Textes generieren. |
| `POST` | `/api/v1/diplomat/translate` | Text in eine angegebene Zielsprache übersetzen. |
| `POST` | `/api/v1/diplomat/analyze-log` | Log-Ausschnitt analysieren und wichtige Ereignisse, Fehler und Muster extrahieren. |

### E-Mail-Pipeline

| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/api/v1/diplomat/emails/stats` | E-Mail-Verarbeitungsstatistiken abrufen (empfangen, klassifiziert, beantwortet). |
| `GET` | `/api/v1/diplomat/emails/recent` | Kürzlich verarbeitete E-Mails auflisten. |

### Zustandsprüfung

| Methode | Pfad | Auth | Beschreibung |
|---|---|---|---|
| `GET` | `/api/v1/diplomat/health` | Nein | Diplomat-Service-Zustandsprüfung. |

---

## Service-Zustandsendpunkte

Jeder Microservice stellt einen `/health`-Endpunkt für interne Überwachung und Load-Balancer-Prüfungen bereit.

| Service | URL | Port |
|---|---|---|
| API Gateway | `/health` | 8000 |
| Vault Server | `/health` | 8001 |
| License Server | `/health` | 8002 |
| Email Service | `/health` | 8003 |
| Notification Service | `/health` | 8004 |
| Update Server | `/health` | 8005 |
| Agent Registry | `/health` | 8006 |
| Warranty Service | `/health` | 8007 |
| CMod Service | `/health` | 8008 |
| IPAM Service | `/health` | 8009 |
| Diplomat Service | `/health` | 8010 |

---

## Support

Für API-bezogene Fragen oder Probleme kontaktieren Sie [support@netreconapp.com](mailto:support@netreconapp.com).
