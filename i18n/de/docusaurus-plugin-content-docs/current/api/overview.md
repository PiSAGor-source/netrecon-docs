---
sidebar_position: 1
title: API-Übersicht
description: REST API-Übersicht — Basis-URL, Authentifizierung, Rate-Limits und Konventionen
---

# API-Übersicht

NetRecon stellt eine REST API zur Integration mit externen Tools, zum Aufbau benutzerdefinierter Dashboards und zur Automatisierung von Netzwerksicherheits-Workflows bereit. Alle Microservices sind über ein einzelnes API Gateway erreichbar.

Für eine vollständige Liste aller Endpunkte nach Kategorie gruppiert, siehe die [Endpunkt-Referenz](./endpoints.md).

## Basis-URL

Alle API-Anfragen gehen über das API Gateway:

```
https://probe.netreconapp.com/api/
```

Für Self-Hosted-Bereitstellungen folgt die Basis-URL dem Muster:

```
https://netrecon.yourcompany.com/api/
```

Das Gateway übernimmt Authentifizierung, Rate-Limiting, RBAC-Durchsetzung und Request-Routing an den entsprechenden Backend-Service.

## Authentifizierung

Alle API-Endpunkte (außer `/api/health` und `/health`) erfordern einen JWT Bearer-Token.

### Token erhalten

```bash
curl -X POST https://probe.netreconapp.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your-password"
  }'
```

Antwort:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "expires_in": 86400
}
```

### Token verwenden

Fügen Sie den Token im `Authorization`-Header bei jeder Anfrage ein:

```bash
curl https://probe.netreconapp.com/api/devices \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

### Token erneuern

Tokens laufen standardmäßig nach 24 Stunden ab (pro Bereitstellung konfigurierbar). Erneuern Sie vor dem Ablauf:

```bash
curl -X POST https://probe.netreconapp.com/api/auth/refresh \
  -H "Authorization: Bearer <current-token>"
```

### API-Schlüssel

Service-zu-Service-Kommunikation und Automatisierungsskripte können langlebige API-Schlüssel als Alternative zu JWT-Tokens verwenden. Schlüssel verwenden das Format `nr_live_` gefolgt von 48 Hex-Zeichen.

```bash
curl https://api.netreconapp.com/api/v1/devices \
  -H "X-API-Key: nr_live_a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6"
```

Jeder Schlüssel hat granulare Berechtigungsbereiche. Konfigurieren Sie diese im Dashboard unter **Einstellungen > API-Schlüssel**. Siehe [Authentifizierung](./authentication.md) für vollständige Details.

## Rate-Limiting

API-Anfragen sind pro Authentifizierungstoken begrenzt. Das Gateway gibt die Response-Header `X-RateLimit-Limit` und `X-RateLimit-Remaining` bei jeder Anfrage zurück.

| Stufe | Anfragen pro Minute | Burst |
|---|---|---|
| Standard | 60 | 10 |
| Admin | 120 | 20 |
| Service (Agent) | 300 | 50 |

Bei Überschreitung des Limits gibt die API HTTP `429 Too Many Requests` mit einem `Retry-After`-Header zurück, der angibt, wie viele Sekunden gewartet werden soll.

## Anfrage- und Antwort-Konventionen

### Content Type

Alle Anfrage- und Antwortkörper verwenden `application/json`, sofern nicht anders angegeben (z. B. CSV-Export-Endpunkte geben `text/csv` zurück, Datei-Downloads geben `application/octet-stream` zurück).

### Paginierung

Listen-Endpunkte sind mit einer Standardseitengröße von 100 Elementen paginiert. Steuern Sie die Paginierung mit Query-Parametern:

```
GET /api/devices?page=2&per_page=50
```

### Fehlerformat

Alle Fehler folgen einer konsistenten JSON-Struktur:

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token",
    "details": null
  }
}
```

### Häufige Fehlercodes

| HTTP-Status | Code | Beschreibung |
|---|---|---|
| 400 | `BAD_REQUEST` | Ungültige Anfrageparameter |
| 401 | `UNAUTHORIZED` | Fehlender oder ungültiger Token |
| 403 | `FORBIDDEN` | Unzureichende Berechtigungen (RBAC) |
| 404 | `NOT_FOUND` | Ressource nicht gefunden |
| 409 | `CONFLICT` | Ressourcenkonflikt (Duplikat, aktive Sitzung existiert usw.) |
| 429 | `RATE_LIMITED` | Zu viele Anfragen |
| 500 | `INTERNAL_ERROR` | Serverfehler |
| 502 | `BAD_GATEWAY` | Upstream-Service nicht erreichbar |
| 503 | `SERVICE_UNAVAILABLE` | Service nicht bereit |

## WebSocket API

Verbinden Sie sich mit dem WebSocket-Endpunkt für Echtzeit-Ereignisse:

```
wss://probe.netreconapp.com/ws/events?token=<jwt-token>
```

### Ereignisformat

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

### Ereignistypen

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

## Interaktive API-Dokumentation

Jeder Backend-Service stellt Swagger/OpenAPI-Dokumentation bereit:

| Service | Dokumentations-URL |
|---|---|
| API Gateway | `/api/docs` |
| Vault Server | `/api/vault/docs` |
| License Server | `/api/license/docs` |
| Agent Registry | `/api/agents/docs` |
| CMod Service | `/api/cmod/docs` |
| IPAM Service | `/api/ipam/docs` |
| Diplomat Service | `/api/diplomat/docs` |
| Zusammengeführt (alle Services) | `/api/v1/docs/openapi.json` |

## SDK und Integrationsbeispiele

Für detaillierte Beispiele mit vollständigen Code-Samples, siehe:

- [Python-Beispiele](./examples/python.md)
- [cURL-Beispiele](./examples/curl.md)
- [PowerShell-Beispiele](./examples/powershell.md)
- [Postman Collection](./examples/postman) — importierbare Sammlung mit allen Endpunkten

### Schnellstart (cURL)

```bash
# Alle Geräte auflisten
curl -H "Authorization: Bearer $TOKEN" \
  https://api.netreconapp.com/api/v1/devices

# Scan starten
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"target": "192.168.1.0/24", "profile": "normal"}' \
  https://api.netreconapp.com/api/v1/scans/start

# IDS-Warnungen der letzten 24 Stunden abrufen
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.netreconapp.com/api/v1/alerts?source=ids&since=24h"
```

### Schnellstart (Python)

```python
import requests

BASE_URL = "https://api.netreconapp.com/api/v1"
headers = {"X-API-Key": "nr_live_your_api_key_here"}

# Geräte abrufen
devices = requests.get(f"{BASE_URL}/devices", headers=headers)
for device in devices.json()["data"]:
    print(f"{device['ip']} - {device['hostname']} - {device['device_type']}")
```

## API-Versionierung

Die aktuelle API ist v1 (implizit für Probe-Endpunkte, explizit `/api/v1/` für Microservice-Endpunkte). Wenn Breaking Changes eingeführt werden, wird ein neuer Versionspfad (`/api/v2/`) veröffentlicht, während `/api/` weiterhin v1 bereitstellt.

## Support

Für API-bezogene Fragen oder Probleme kontaktieren Sie [support@netreconapp.com](mailto:support@netreconapp.com).
