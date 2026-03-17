---
sidebar_position: 4
title: Geräte
---

# Geräte-API

Entdeckte Netzwerkgeräte, ihre Eigenschaften und Beziehungen verwalten.

## Geräte auflisten

```
GET /api/v1/devices?page=1&per_page=25
```

### Query-Parameter

| Parameter | Typ | Beschreibung |
|---|---|---|
| `site_id` | string | Nach Standort filtern |
| `is_online` | boolean | Nach Online-Status filtern |
| `vendor` | string | Nach Herstellername filtern |
| `os` | string | Nach Betriebssystem filtern |
| `search` | string | Hostname, IP oder MAC suchen |
| `sort` | string | Sortieren nach: `ip`, `hostname`, `last_seen`, `vendor` |

Antwort:
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

## Gerätedetails abrufen

```
GET /api/v1/devices/{device_id}
```

Gibt das vollständige Geräteprofil einschließlich Port-Details, Services, CVE-Übereinstimmungen und Verlauf zurück.

## Gerät erstellen (manuell)

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

## Gerät aktualisieren

```
PUT /api/v1/devices/{device_id}
Content-Type: application/json

{
  "hostname": "server-db-01-renamed",
  "tags": ["database", "production", "critical"]
}
```

## Gerät löschen

```
DELETE /api/v1/devices/{device_id}
```

## Geräte-Ports abrufen

```
GET /api/v1/devices/{device_id}/ports
```

Antwort:
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

## Gerätetypen

| Typ | Beschreibung |
|---|---|
| `workstation` | Desktop/Laptop |
| `server` | Server |
| `router` | Router |
| `switch` | Netzwerk-Switch |
| `firewall` | Firewall |
| `printer` | Drucker |
| `camera` | IP-Kamera |
| `phone` | VoIP-Telefon |
| `iot` | IoT-Gerät |
| `access_point` | WLAN-Zugangspunkt |
| `unknown` | Nicht klassifiziert |
