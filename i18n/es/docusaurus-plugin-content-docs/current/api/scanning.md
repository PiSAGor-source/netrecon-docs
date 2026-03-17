---
sidebar_position: 3
title: Escaneo
---

# API de Escaneo

La API de escaneo le permite iniciar, monitorear y obtener resultados de escaneos de red.

## Iniciar un Escaneo

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

### Perfiles de Escaneo

| Perfil | Descripción | Puertos | Timeout |
|---|---|---|---|
| `quick` | Top 100 puertos, sin perfilado | 100 | 30s |
| `normal` | Top 1000 puertos + perfilado de dispositivos | 1000 | 120s |
| `deep` | Los 65535 puertos + perfilado completo + coincidencia CVE | 65535 | 600s |
| `stealth` | Escaneo SYN, baja tasa, evasión de IDS | 1000 | 300s |
| `custom` | Lista de puertos personalizada (ver campo `ports`) | definido por usuario | definido por usuario |

### Perfil Personalizado

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

Respuesta:
```json
{
  "id": "scan-uuid",
  "status": "running",
  "target": "192.168.1.0/24",
  "profile": "normal",
  "started_at": "2026-03-15T10:30:00Z"
}
```

## Obtener Estado del Escaneo

```
GET /api/v1/scans/{scan_id}
```

Respuesta:
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

### Valores de Estado del Escaneo

| Estado | Descripción |
|---|---|
| `queued` | En espera para iniciar |
| `running` | Escaneando activamente |
| `completed` | Finalizado exitosamente |
| `failed` | Ocurrió un error |
| `cancelled` | Cancelado por el usuario |

## Obtener Resultados del Escaneo

```
GET /api/v1/scans/{scan_id}/result
```

Respuesta:
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

## Detener un Escaneo

```
POST /api/v1/scans/{scan_id}/stop
```

## Listar Escaneos

```
GET /api/v1/scans?page=1&per_page=25&status=completed
```

## WebSocket: Eventos en Tiempo Real

Conéctese a `wss://api.netreconapp.com/ws/scans/{scan_id}` para actualizaciones en tiempo real:

```json
{"event": "host_found", "data": {"ip": "192.168.1.5", "mac": "AA:BB:CC:11:22:33"}}
{"event": "port_found", "data": {"ip": "192.168.1.5", "port": 80, "service": "HTTP"}}
{"event": "scan_complete", "data": {"devices_found": 24, "duration": 95}}
```
