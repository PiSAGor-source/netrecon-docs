---
sidebar_position: 3
title: Scanning
---

# Scanning API

Die Scanning API ermöglicht es Ihnen, Netzwerk-Scans zu starten, zu überwachen und Ergebnisse abzurufen.

## Scan starten

```
POST /api/v1/scans/start
Content-Type: application/json
Authorization: Bearer <token>

{
  "target": "192.168.1.0/24",
  "profile": "normal",
  "site_id": "optional-site-uuid"
}
```

### Scan-Profile

| Profil | Beschreibung | Ports | Timeout |
|---|---|---|---|
| `quick` | Top 100 Ports, keine Profilierung | 100 | 30s |
| `normal` | Top 1000 Ports + Geräteprofilierung | 1000 | 120s |
| `deep` | Alle 65535 Ports + vollständige Profilierung + CVE-Abgleich | 65535 | 600s |
| `stealth` | SYN-Scan, niedrige Rate, IDS-Umgehung | 1000 | 300s |
| `custom` | Benutzerdefinierte Portliste (siehe `ports`-Feld) | benutzerdefiniert | benutzerdefiniert |

### Benutzerdefiniertes Profil

```json
{
  "target": "10.0.0.0/16",
  "profile": "custom",
  "ports": [22, 80, 443, 3389, 8080, 8443],
  "timeout_ms": 5000,
  "max_concurrent": 20,
  "enable_profiling": true,
  "enable_cve_match": false
}
```

Antwort:
```json
{
  "id": "scan-uuid",
  "status": "running",
  "target": "192.168.1.0/24",
  "profile": "normal",
  "started_at": "2026-03-15T10:30:00Z"
}
```

## Scan-Status abrufen

```
GET /api/v1/scans/{scan_id}
```

Antwort:
```json
{
  "id": "scan-uuid",
  "status": "running",
  "progress_percent": 45,
  "hosts_found": 12,
  "ports_found": 37,
  "started_at": "2026-03-15T10:30:00Z",
  "estimated_completion": "2026-03-15T10:32:15Z"
}
```

### Scan-Statuswerte

| Status | Beschreibung |
|---|---|
| `queued` | Wartet auf Start |
| `running` | Scannt aktiv |
| `completed` | Erfolgreich abgeschlossen |
| `failed` | Fehler aufgetreten |
| `cancelled` | Vom Benutzer abgebrochen |

## Scanergebnisse abrufen

```
GET /api/v1/scans/{scan_id}/result
```

Antwort:
```json
{
  "id": "scan-uuid",
  "status": "completed",
  "devices_found": 24,
  "open_ports_total": 87,
  "duration_seconds": 95,
  "devices": [
    {
      "ip": "192.168.1.1",
      "mac": "AA:BB:CC:DD:EE:FF",
      "hostname": "gateway.local",
      "vendor": "Cisco Systems",
      "os_guess": "IOS 15.x",
      "ports": [
        {"port": 22, "protocol": "tcp", "state": "open", "service": "SSH"},
        {"port": 443, "protocol": "tcp", "state": "open", "service": "HTTPS"}
      ]
    }
  ]
}
```

## Scan stoppen

```
POST /api/v1/scans/{scan_id}/stop
```

## Scans auflisten

```
GET /api/v1/scans?page=1&per_page=25&status=completed
```

## WebSocket: Echtzeit-Ereignisse

Verbinden Sie sich mit `wss://api.netreconapp.com/ws/scans/{scan_id}` für Echtzeit-Updates:

```json
{"event": "host_found", "data": {"ip": "192.168.1.5", "mac": "AA:BB:CC:11:22:33"}}
{"event": "port_found", "data": {"ip": "192.168.1.5", "port": 80, "service": "HTTP"}}
{"event": "scan_complete", "data": {"devices_found": 24, "duration": 95}}
```
