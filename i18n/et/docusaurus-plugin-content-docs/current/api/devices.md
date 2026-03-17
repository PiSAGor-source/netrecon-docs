---
sidebar_position: 4
title: Seadmed
---

# Seadmete API

Hallake avastatud võrguseadmeid, nende omadusi ja suhteid.

## Loetlege seadmed

```
GET /api/v1/devices?page=1&per_page=25
```

### Päringupärameetrid

| Parameeter | Tüüp | Kirjeldus |
|---|---|---|
| `site_id` | string | Filtreeri asukoha järgi |
| `is_online` | boolean | Filtreeri võrgusoleku järgi |
| `vendor` | string | Filtreeri tootja nime järgi |
| `os` | string | Filtreeri OS-i järgi |
| `search` | string | Otsi hostinime, IP-d või MAC-i |
| `sort` | string | Sorteeri: `ip`, `hostname`, `last_seen`, `vendor` |

Vastus:
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

## Hangi seadme üksikasjad

```
GET /api/v1/devices/{device_id}
```

Tagastab seadme täieliku profiili, sealhulgas portide üksikasjad, teenused, CVE vasted ja ajaloo.

## Loo seade (käsitsi)

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

## Uuenda seadet

```
PUT /api/v1/devices/{device_id}
Content-Type: application/json

{
  "hostname": "server-db-01-renamed",
  "tags": ["database", "production", "critical"]
}
```

## Kustuta seade

```
DELETE /api/v1/devices/{device_id}
```

## Hangi seadme pordid

```
GET /api/v1/devices/{device_id}/ports
```

Vastus:
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

## Seadme tüübid

| Tüüp | Kirjeldus |
|---|---|
| `workstation` | Lauaarvuti/sülearvuti |
| `server` | Server |
| `router` | Ruuter |
| `switch` | Võrgulüliti |
| `firewall` | Tulemüür |
| `printer` | Printer |
| `camera` | IP-kaamera |
| `phone` | VoIP telefon |
| `iot` | IoT-seade |
| `access_point` | Traadita pääsupunkt |
| `unknown` | Klassifitseerimata |
