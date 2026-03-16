---
sidebar_position: 5
title: Alerts
---

# Alerts API

Monitor and manage security alerts from scans, IDS, honeypots, and anomaly detection.

## List Alerts

```
GET /api/v1/alerts?page=1&per_page=25
```

### Query Parameters

| Parameter | Type | Description |
|---|---|---|
| `severity` | string | Filter: `critical`, `high`, `medium`, `low`, `info` |
| `status` | string | Filter: `open`, `acknowledged`, `resolved` |
| `site_id` | string | Filter by site |
| `source` | string | Filter: `scan`, `ids`, `honeypot`, `rogue`, `anomaly` |
| `since` | datetime | Alerts after this timestamp |

Response:
```json
{
  "data": [
    {
      "id": "alert-uuid",
      "title": "New open port detected on 192.168.1.10",
      "description": "Port 3389 (RDP) was found open on workstation-01",
      "severity": "high",
      "status": "open",
      "source": "scan",
      "device_ip": "192.168.1.10",
      "site_id": "site-uuid",
      "created_at": "2026-03-15T10:30:00Z",
      "metadata": {
        "port": 3389,
        "service": "RDP",
        "previous_state": "closed"
      }
    }
  ],
  "meta": {"page": 1, "per_page": 25, "total": 18}
}
```

## Get Alert Details

```
GET /api/v1/alerts/{alert_id}
```

## Acknowledge Alert

```
POST /api/v1/alerts/{alert_id}/acknowledge
```

Response:
```json
{
  "id": "alert-uuid",
  "status": "acknowledged",
  "acknowledged_at": "2026-03-15T10:35:00Z",
  "acknowledged_by": "user@company.com"
}
```

## Resolve Alert

```
POST /api/v1/alerts/{alert_id}/resolve
Content-Type: application/json

{
  "resolution_note": "Port closed after firewall rule update"
}
```

## Alert Severity Levels

| Severity | Description | Example |
|---|---|---|
| `critical` | Immediate action required | Active exploit detected |
| `high` | Significant risk | RDP exposed to network |
| `medium` | Moderate risk | Outdated service version |
| `low` | Minor concern | New device on network |
| `info` | Informational | Scan completed |

## Alert Sources

| Source | Description |
|---|---|
| `scan` | Port scan / device discovery |
| `ids` | Suricata IDS alerts |
| `honeypot` | Honeypot interaction |
| `rogue` | Rogue DHCP/ARP detection |
| `anomaly` | ML anomaly detection |
| `baseline` | Baseline drift alert |
| `dns` | DNS sinkhole threat |

## WebSocket: Real-time Alerts

Connect to `wss://api.netreconapp.com/ws/alerts` for live alert notifications:

```json
{"event": "ids_alert", "data": {"rule": "ET SCAN Nmap", "src": "10.0.0.5", "severity": "high"}}
{"event": "honeypot_hit", "data": {"port": 22, "src": "10.0.0.99", "action": "login_attempt"}}
{"event": "rogue_detected", "data": {"type": "dhcp", "mac": "AA:BB:CC:DD:EE:FF"}}
```
