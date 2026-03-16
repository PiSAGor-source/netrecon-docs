---
sidebar_position: 4
title: Devices
---

# Devices API

Manage discovered network devices, their properties, and relationships.

## List Devices

```
GET /api/v1/devices?page=1&per_page=25
```

### Query Parameters

| Parameter | Type | Description |
|---|---|---|
| `site_id` | string | Filter by site |
| `is_online` | boolean | Filter by online status |
| `vendor` | string | Filter by vendor name |
| `os` | string | Filter by OS |
| `search` | string | Search hostname, IP, or MAC |
| `sort` | string | Sort by: `ip`, `hostname`, `last_seen`, `vendor` |

Response:
```json
{
  "data": [
    {
      "id": "device-uuid",
      "ip": "192.168.1.10",
      "mac": "AA:BB:CC:DD:EE:FF",
      "hostname": "workstation-01",
      "vendor": "Dell Inc.",
      "os_guess": "Windows 11",
      "device_type": "workstation",
      "is_online": true,
      "first_seen": "2026-01-15T08:30:00Z",
      "last_seen": "2026-03-15T10:30:00Z",
      "site_id": "site-uuid",
      "open_ports": [22, 80, 443, 3389],
      "tags": ["production", "finance-dept"]
    }
  ],
  "meta": {"page": 1, "per_page": 25, "total": 142}
}
```

## Get Device Details

```
GET /api/v1/devices/{device_id}
```

Returns full device profile including port details, services, CVE matches, and history.

## Create Device (Manual)

```
POST /api/v1/devices
Content-Type: application/json

{
  "ip": "10.0.0.50",
  "mac": "11:22:33:44:55:66",
  "hostname": "server-db-01",
  "device_type": "server",
  "site_id": "site-uuid",
  "tags": ["database", "production"]
}
```

## Update Device

```
PUT /api/v1/devices/{device_id}
Content-Type: application/json

{
  "hostname": "server-db-01-renamed",
  "tags": ["database", "production", "critical"]
}
```

## Delete Device

```
DELETE /api/v1/devices/{device_id}
```

## Get Device Ports

```
GET /api/v1/devices/{device_id}/ports
```

Response:
```json
{
  "data": [
    {
      "port": 443,
      "protocol": "tcp",
      "state": "open",
      "service": "HTTPS",
      "version": "nginx/1.24.0",
      "banner": "Server: nginx/1.24.0",
      "last_scanned": "2026-03-15T10:30:00Z"
    }
  ]
}
```

## Device Types

| Type | Description |
|---|---|
| `workstation` | Desktop/laptop |
| `server` | Server |
| `router` | Router |
| `switch` | Network switch |
| `firewall` | Firewall |
| `printer` | Printer |
| `camera` | IP camera |
| `phone` | VoIP phone |
| `iot` | IoT device |
| `access_point` | Wireless AP |
| `unknown` | Unclassified |
