---
sidebar_position: 1
title: API Overview
description: REST API overview — base URL, authentication, rate limits, and conventions
---

# API Overview

NetRecon exposes a REST API for integrating with external tools, building custom dashboards, and automating network security workflows. All microservices are accessible through a single API Gateway.

For a complete list of every endpoint grouped by category, see the [Endpoint Reference](./endpoints.md).

## Base URL

All API requests go through the API Gateway:

```
https://probe.netreconapp.com/api/
```

For self-hosted deployments, the base URL follows the pattern:

```
https://netrecon.yourcompany.com/api/
```

The gateway handles authentication, rate limiting, RBAC enforcement, and request routing to the appropriate backend service.

## Authentication

All API endpoints (except `/api/health` and `/health`) require a JWT Bearer token.

### Obtaining a Token

```bash
curl -X POST https://probe.netreconapp.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your-password"
  }'
```

Response:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "expires_in": 86400
}
```

### Using the Token

Include the token in the `Authorization` header on every request:

```bash
curl https://probe.netreconapp.com/api/devices \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

### Token Refresh

Tokens expire after 24 hours by default (configurable per deployment). Refresh before expiration:

```bash
curl -X POST https://probe.netreconapp.com/api/auth/refresh \
  -H "Authorization: Bearer <current-token>"
```

### API Keys

Service-to-service communication and automation scripts can use long-lived API keys as an alternative to JWT tokens. Keys use the format `nr_live_` followed by 48 hex characters.

```bash
curl https://api.netreconapp.com/api/v1/devices \
  -H "X-API-Key: nr_live_a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6"
```

Each key has granular permission scopes. Configure them in the dashboard under **Settings > API Keys**. See [Authentication](./authentication.md) for full details.

## Rate Limiting

API requests are rate-limited per authentication token. The gateway returns `X-RateLimit-Limit` and `X-RateLimit-Remaining` response headers on every request.

| Tier | Requests per minute | Burst |
|---|---|---|
| Standard | 60 | 10 |
| Admin | 120 | 20 |
| Service (agent) | 300 | 50 |

When the limit is exceeded, the API returns HTTP `429 Too Many Requests` with a `Retry-After` header indicating how many seconds to wait.

## Request and Response Conventions

### Content Type

All request and response bodies use `application/json` unless otherwise noted (e.g., CSV export endpoints return `text/csv`, file downloads return `application/octet-stream`).

### Pagination

List endpoints are paginated with a default page size of 100 items. Control pagination with query parameters:

```
GET /api/devices?page=2&per_page=50
```

### Error Format

All errors follow a consistent JSON structure:

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token",
    "details": null
  }
}
```

### Common Error Codes

| HTTP Status | Code | Description |
|---|---|---|
| 400 | `BAD_REQUEST` | Invalid request parameters |
| 401 | `UNAUTHORIZED` | Missing or invalid token |
| 403 | `FORBIDDEN` | Insufficient permissions (RBAC) |
| 404 | `NOT_FOUND` | Resource not found |
| 409 | `CONFLICT` | Resource conflict (duplicate, active session exists, etc.) |
| 429 | `RATE_LIMITED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Server error |
| 502 | `BAD_GATEWAY` | Upstream service unreachable |
| 503 | `SERVICE_UNAVAILABLE` | Service not ready |

## WebSocket API

Connect to the WebSocket endpoint for real-time events:

```
wss://probe.netreconapp.com/ws/events?token=<jwt-token>
```

### Event Format

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

### Event Types

| Event | Description |
|---|---|
| `host_found` | New device discovered |
| `port_found` | Open port detected on a device |
| `scan_complete` | Network scan finished |
| `neighbor_discovered` | CDP/LLDP neighbor found |
| `config_changed` | Device configuration changed |
| `baseline_diff_alert` | Network baseline deviation detected |
| `ids_alert` | IDS rule triggered |
| `honeypot_hit` | Honeypot interaction detected |
| `rogue_detected` | Rogue DHCP or ARP activity |
| `pcap_ready` | PCAP file ready for download |
| `vuln_found` | Vulnerability discovered |
| `dns_threat` | DNS threat blocked |
| `probe_health_alert` | Probe resource threshold exceeded |
| `error` | Error event |

## Interactive API Documentation

Each backend service exposes Swagger/OpenAPI documentation:

| Service | Documentation URL |
|---|---|
| API Gateway | `/api/docs` |
| Vault Server | `/api/vault/docs` |
| License Server | `/api/license/docs` |
| Agent Registry | `/api/agents/docs` |
| CMod Service | `/api/cmod/docs` |
| IPAM Service | `/api/ipam/docs` |
| Diplomat Service | `/api/diplomat/docs` |
| Merged (all services) | `/api/v1/docs/openapi.json` |

## SDK and Integration Examples

For detailed examples with complete code samples, see:

- [Python Examples](./examples/python.md)
- [cURL Examples](./examples/curl.md)
- [PowerShell Examples](./examples/powershell.md)
- [Postman Collection](./examples/postman) — importable collection with all endpoints

### Quick Start (cURL)

```bash
# List all devices
curl -H "Authorization: Bearer $TOKEN" \
  https://api.netreconapp.com/api/v1/devices

# Start a scan
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"target": "192.168.1.0/24", "profile": "normal"}' \
  https://api.netreconapp.com/api/v1/scans/start

# Get IDS alerts from the last 24 hours
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.netreconapp.com/api/v1/alerts?source=ids&since=24h"
```

### Quick Start (Python)

```python
import requests

BASE_URL = "https://api.netreconapp.com/api/v1"
headers = {"X-API-Key": "nr_live_your_api_key_here"}

# Get devices
devices = requests.get(f"{BASE_URL}/devices", headers=headers)
for device in devices.json()["data"]:
    print(f"{device['ip']} - {device['hostname']} - {device['device_type']}")
```

## API Versioning

The current API is v1 (implicit for probe endpoints, explicit `/api/v1/` for microservice endpoints). When breaking changes are introduced, a new version path (`/api/v2/`) will be published while `/api/` continues to serve v1.

## Support

For API-related questions or issues, contact [support@netreconapp.com](mailto:support@netreconapp.com).
