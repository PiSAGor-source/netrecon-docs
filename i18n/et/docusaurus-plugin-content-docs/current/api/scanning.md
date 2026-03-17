---
sidebar_position: 3
title: Skannimine
---

# Skannimise API

Skannimise API võimaldab käivitada, jälgida ja hankida tulemusi võrgu skannimistest.

## Käivitage skannimine

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

### Skannimisprofiilid

| Profiil | Kirjeldus | Pordid | Ajalõpp |
|---|---|---|---|
| `quick` | Top 100 porti, ilma profileerimiseta | 100 | 30s |
| `normal` | Top 1000 porti + seadme profileerimine | 1000 | 120s |
| `deep` | Kõik 65535 porti + täielik profileerimine + CVE sobitamine | 65535 | 600s |
| `stealth` | SYN skannimine, madal kiirus, IDS-i vältimine | 1000 | 300s |
| `custom` | Kohandatud pordiliste (vaadake välja `ports`) | kasutaja määratud | kasutaja määratud |

### Kohandatud profiil

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

Vastus:
```json
{
  "id": "scan-uuid",
  "status": "running",
  "target": "192.168.1.0/24",
  "profile": "normal",
  "started_at": "2026-03-15T10:30:00Z"
}
```

## Hangi skannimise olek

```
GET /api/v1/scans/{scan_id}
```

Vastus:
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

### Skannimise oleku väärtused

| Olek | Kirjeldus |
|---|---|
| `queued` | Ootab käivitamist |
| `running` | Aktiivselt skannimine |
| `completed` | Edukalt lõpetatud |
| `failed` | Tekkis viga |
| `cancelled` | Kasutaja tühistatud |

## Hangi skannimistulemused

```
GET /api/v1/scans/{scan_id}/result
```

Vastus:
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

## Peatage skannimine

```
POST /api/v1/scans/{scan_id}/stop
```

## Loetlege skannimised

```
GET /api/v1/scans?page=1&per_page=25&status=completed
```

## WebSocket: reaalajas sündmused

Ühenduge `wss://api.netreconapp.com/ws/scans/{scan_id}` reaalajas uuenduste jaoks:

```json
{"event": "host_found", "data": {"ip": "192.168.1.5", "mac": "AA:BB:CC:11:22:33"}}
{"event": "port_found", "data": {"ip": "192.168.1.5", "port": 80, "service": "HTTP"}}
{"event": "scan_complete", "data": {"devices_found": 24, "duration": 95}}
```
