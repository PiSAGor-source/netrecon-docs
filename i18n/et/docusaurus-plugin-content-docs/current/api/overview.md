---
sidebar_position: 1
title: API ülevaade
description: REST API ülevaade — baas-URL, autentimine, piirangud ja konventsioonid
---

# API ülevaade

NetRecon pakub REST API-t väliste tööriistadega integreerimiseks, kohandatud juhtpaneelide ehitamiseks ja võrguturbe tööprotsesside automatiseerimiseks. Kõik mikroteenused on kättesaadavad ühe API Gateway kaudu.

Täieliku lõpp-punktide loendi jaoks kategooriate kaupa vaadake [Lõpp-punktide viidet](./endpoints.md).

## Baas-URL

Kõik API päringud käivad läbi API Gateway:

```
https://probe.netreconapp.com/api/
```

Isehallatavate juurutuste jaoks järgib baas-URL mustrit:

```
https://netrecon.yourcompany.com/api/
```

Gateway tegeleb autentimise, piirangute, RBAC jõustamise ja päringute suunamise sobivasse taustateenusesse.

## Autentimine

Kõik API lõpp-punktid (välja arvatud `/api/health` ja `/health`) nõuavad JWT Bearer tõendit.

### Tõendi hankimine

```bash
curl -X POST https://probe.netreconapp.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your-password"
  }'
```

Vastus:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "expires_in": 86400
}
```

### Tõendi kasutamine

Lisage tõend `Authorization` päisesse igale päringule:

```bash
curl https://probe.netreconapp.com/api/devices \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

### Tõendi värskendamine

Tõendid aeguvad vaikimisi 24 tunni pärast (konfigureeritav juurutuse kohta). Värskendage enne aegumist:

```bash
curl -X POST https://probe.netreconapp.com/api/auth/refresh \
  -H "Authorization: Bearer <current-token>"
```

### API võtmed

Teenuselt-teenusele suhtlus ja automatiseerimisskriptid saavad kasutada pikaajalisi API võtmeid JWT tõendite alternatiivina. Võtmed kasutavad vormingut `nr_live_`, millele järgneb 48 kuueteistkümnendsüsteemi märki.

```bash
curl https://api.netreconapp.com/api/v1/devices \
  -H "X-API-Key: nr_live_a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6"
```

Igal võtmel on detailsed õiguste ulatused. Konfigureerige neid juhtpaneelil menüüs **Seaded > API võtmed**. Täielikke üksikasju vaadake [Autentimisest](./authentication.md).

## Piirangud

API päringuid piiratakse autentimistõendi kohta. Gateway tagastab iga päringuga vastuse päised `X-RateLimit-Limit` ja `X-RateLimit-Remaining`.

| Tase | Päringuid minutis | Plahvatuslik |
|---|---|---|
| Standard | 60 | 10 |
| Administraator | 120 | 20 |
| Teenus (agent) | 300 | 50 |

Kui piirang on ületatud, tagastab API HTTP `429 Too Many Requests` koos `Retry-After` päisega, mis näitab ootamise sekundite arvu.

## Päringu ja vastuse konventsioonid

### Sisutüüp

Kõik päringu ja vastuse kehad kasutavad `application/json`, kui pole teisiti märgitud (nt CSV ekspordi lõpp-punktid tagastavad `text/csv`, failide allalaadimised tagastavad `application/octet-stream`).

### Lehekülgjaotus

Loendi lõpp-punktid on lehekülgedeks jaotatud vaikimisi lehe suurusega 100 kirjet. Kontrollige lehekülgjaotust päringupärameetritega:

```
GET /api/devices?page=2&per_page=50
```

### Veavormaat

Kõik vead järgivad ühtset JSON-struktuuri:

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token",
    "details": null
  }
}
```

### Levinud veakoodid

| HTTP olek | Kood | Kirjeldus |
|---|---|---|
| 400 | `BAD_REQUEST` | Vigased päringu parameetrid |
| 401 | `UNAUTHORIZED` | Puuduv või kehtetu tõend |
| 403 | `FORBIDDEN` | Ebapiisavad õigused (RBAC) |
| 404 | `NOT_FOUND` | Ressurssi ei leitud |
| 409 | `CONFLICT` | Ressursi konflikt (duplikaat, aktiivne seanss olemas jne) |
| 429 | `RATE_LIMITED` | Liiga palju päringuid |
| 500 | `INTERNAL_ERROR` | Serveri viga |
| 502 | `BAD_GATEWAY` | Ülemine teenus kättesaamatu |
| 503 | `SERVICE_UNAVAILABLE` | Teenus pole valmis |

## WebSocket API

Ühenduge WebSocket lõpp-punktiga reaalajas sündmuste jaoks:

```
wss://probe.netreconapp.com/ws/events?token=<jwt-token>
```

### Sündmuse vorming

```json
{
  "event": "host_found",
  "timestamp": "2026-03-15T14:30:00Z",
  "data": {
    "ip": "192.168.1.100",
    "mac": "AA:BB:CC:DD:EE:FF",
    "hostname": "workstation-01"
  }
}
```

### Sündmuse tüübid

| Sündmus | Kirjeldus |
|---|---|
| `host_found` | Uus seade avastatud |
| `port_found` | Seadmel tuvastatud avatud port |
| `scan_complete` | Võrgu skannimine lõpetatud |
| `neighbor_discovered` | CDP/LLDP naaber leitud |
| `config_changed` | Seadme konfiguratsioon muutunud |
| `baseline_diff_alert` | Võrgu baasjoonest kõrvalekalle tuvastatud |
| `ids_alert` | IDS reegel käivitunud |
| `honeypot_hit` | Meepoti interaktsioon tuvastatud |
| `rogue_detected` | Võlts-DHCP või ARP tegevus |
| `pcap_ready` | PCAP fail allalaadimiseks valmis |
| `vuln_found` | Haavatavus avastatud |
| `dns_threat` | DNS oht blokeeritud |
| `probe_health_alert` | Sondi ressursi lävi ületatud |
| `error` | Veasündmus |

## Interaktiivne API dokumentatsioon

Iga taustateenusele on Swagger/OpenAPI dokumentatsioon:

| Teenus | Dokumentatsiooni URL |
|---|---|
| API Gateway | `/api/docs` |
| Vault Server | `/api/vault/docs` |
| License Server | `/api/license/docs` |
| Agent Registry | `/api/agents/docs` |
| CMod Service | `/api/cmod/docs` |
| IPAM Service | `/api/ipam/docs` |
| Diplomat Service | `/api/diplomat/docs` |
| Ühendatud (kõik teenused) | `/api/v1/docs/openapi.json` |

## SDK ja integratsiooni näited

Üksikasjalikke näiteid koos täielike koodinäidistega vaadake:

- [Python näited](./examples/python.md)
- [cURL näited](./examples/curl.md)
- [PowerShell näited](./examples/powershell.md)
- [Postman Collection](./examples/postman) — imporditav kogum kõigi lõpp-punktidega

### Kiirstart (cURL)

```bash
# Loetlege kõik seadmed
curl -H "Authorization: Bearer $TOKEN" \
  https://api.netreconapp.com/api/v1/devices

# Käivitage skannimine
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"target": "192.168.1.0/24", "profile": "normal"}' \
  https://api.netreconapp.com/api/v1/scans/start

# Hankige viimase 24 tunni IDS hoiatused
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.netreconapp.com/api/v1/alerts?source=ids&since=24h"
```

### Kiirstart (Python)

```python
import requests

BASE_URL = "https://api.netreconapp.com/api/v1"
headers = {"X-API-Key": "nr_live_your_api_key_here"}

# Hankige seadmed
devices = requests.get(f"{BASE_URL}/devices", headers=headers)
for device in devices.json()["data"]:
    print(f"{device['ip']} - {device['hostname']} - {device['device_type']}")
```

## API versioonid

Praegune API on v1 (sondi lõpp-punktide jaoks kaudne, mikroteenuste lõpp-punktide jaoks otsene `/api/v1/`). Kui tulevad murdvad muudatused, avaldatakse uus versiooni tee (`/api/v2/`), samas kui `/api/` jätkab v1 teenindamist.

## Tugi

API-ga seotud küsimuste või probleemide korral võtke ühendust [support@netreconapp.com](mailto:support@netreconapp.com).
