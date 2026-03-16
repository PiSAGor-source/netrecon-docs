---
sidebar_position: 3
title: Scanning
---

# Scanning API

The scanning API lets you start, monitor, and retrieve results from network scans.

## Start a Scan

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

### Scan Profiles

| Profile | Description | Ports | Timeout |
|---|---|---|---|
| `quick` | Top 100 ports, no profiling | 100 | 30s |
| `normal` | Top 1000 ports + device profiling | 1000 | 120s |
| `deep` | All 65535 ports + full profiling + CVE match | 65535 | 600s |
| `stealth` | SYN scan, low rate, IDS evasion | 1000 | 300s |
| `custom` | Custom port list (see `ports` field) | user-defined | user-defined |

### Custom Profile

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

Response:
```json
{
  "id": "scan-uuid",
  "status": "running",
  "target": "192.168.1.0/24",
  "profile": "normal",
  "started_at": "2026-03-15T10:30:00Z"
}
```

## Get Scan Status

```
GET /api/v1/scans/{scan_id}
```

Response:
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

### Scan Status Values

| Status | Description |
|---|---|
| `queued` | Waiting to start |
| `running` | Actively scanning |
| `completed` | Finished successfully |
| `failed` | Error occurred |
| `cancelled` | Cancelled by user |

## Get Scan Results

```
GET /api/v1/scans/{scan_id}/result
```

Response:
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

## Stop a Scan

```
POST /api/v1/scans/{scan_id}/stop
```

## List Scans

```
GET /api/v1/scans?page=1&per_page=25&status=completed
```

## WebSocket: Real-time Events

Connect to `wss://api.netreconapp.com/ws/scans/{scan_id}` for real-time updates:

```json
{"event": "host_found", "data": {"ip": "192.168.1.5", "mac": "AA:BB:CC:11:22:33"}}
{"event": "port_found", "data": {"ip": "192.168.1.5", "port": 80, "service": "HTTP"}}
{"event": "scan_complete", "data": {"devices_found": 24, "duration": 95}}
```
