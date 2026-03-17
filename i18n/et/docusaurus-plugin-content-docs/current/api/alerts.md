---
sidebar_position: 5
title: Hoiatused
---

# Hoiatuste API

Jälgige ja hallake turvahoiatusi skannimistest, IDS-ist, meepotist ja anomaaliate tuvastamisest.

## Loetlege hoiatused

```
GET /api/v1/alerts?page=1&per_page=25
```

### Päringupärameetrid

| Parameeter | Tüüp | Kirjeldus |
|---|---|---|
| `severity` | string | Filter: `critical`, `high`, `medium`, `low`, `info` |
| `status` | string | Filter: `open`, `acknowledged`, `resolved` |
| `site_id` | string | Filtreeri asukoha järgi |
| `source` | string | Filter: `scan`, `ids`, `honeypot`, `rogue`, `anomaly` |
| `since` | datetime | Hoiatused pärast seda ajatemplit |

Vastus:
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

## Hangi hoiatuse üksikasjad

```
GET /api/v1/alerts/{alert_id}
```

## Kinnita hoiatus

```
POST /api/v1/alerts/{alert_id}/acknowledge
```

Vastus:
```json
{
  "id": "alert-uuid",
  "status": "acknowledged",
  "acknowledged_at": "2026-03-15T10:35:00Z",
  "acknowledged_by": "user@company.com"
}
```

## Lahenda hoiatus

```
POST /api/v1/alerts/{alert_id}/resolve
Content-Type: application/json

{
  "resolution_note": "Port closed after firewall rule update"
}
```

## Hoiatuse tõsiduse tasemed

| Tõsidus | Kirjeldus | Näide |
|---|---|---|
| `critical` | Vajalik viivitamatu tegutsemine | Aktiivne exploit tuvastatud |
| `high` | Oluline risk | RDP avatud võrgule |
| `medium` | Mõõdukas risk | Aegunud teenuse versioon |
| `low` | Väike mure | Uus seade võrgus |
| `info` | Informatiivne | Skannimine lõpetatud |

## Hoiatuse allikad

| Allikas | Kirjeldus |
|---|---|
| `scan` | Pordi skannimine / seadme tuvastamine |
| `ids` | Suricata IDS hoiatused |
| `honeypot` | Meepoti interaktsioon |
| `rogue` | Võlts-DHCP/ARP tuvastamine |
| `anomaly` | ML anomaaliate tuvastamine |
| `baseline` | Baasjoonest triivi hoiatus |
| `dns` | DNS sinkhole oht |

## WebSocket: reaalajas hoiatused

Ühenduge `wss://api.netreconapp.com/ws/alerts` reaalajas hoiatusteavituste jaoks:

```json
{"event": "ids_alert", "data": {"rule": "ET SCAN Nmap", "src": "10.0.0.5", "severity": "high"}}
{"event": "honeypot_hit", "data": {"port": 22, "src": "10.0.0.99", "action": "login_attempt"}}
{"event": "rogue_detected", "data": {"type": "dhcp", "mac": "AA:BB:CC:DD:EE:FF"}}
```
