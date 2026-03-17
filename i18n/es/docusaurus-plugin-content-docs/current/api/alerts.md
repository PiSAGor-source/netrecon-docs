---
sidebar_position: 5
title: Alertas
---

# API de Alertas

Monitoree y gestione alertas de seguridad de escaneos, IDS, honeypots y detección de anomalías.

## Listar Alertas

```
GET /api/v1/alerts?page=1&per_page=25
```

### Parámetros de Consulta

| Parámetro | Tipo | Descripción |
|---|---|---|
| `severity` | string | Filtrar: `critical`, `high`, `medium`, `low`, `info` |
| `status` | string | Filtrar: `open`, `acknowledged`, `resolved` |
| `site_id` | string | Filtrar por sitio |
| `source` | string | Filtrar: `scan`, `ids`, `honeypot`, `rogue`, `anomaly` |
| `since` | datetime | Alertas después de esta marca de tiempo |

Respuesta:
```json
{
  "data": [
    {
      "id": "alert-uuid",
      "title": "Nuevo puerto abierto detectado en 192.168.1.10",
      "description": "Se encontró el puerto 3389 (RDP) abierto en workstation-01",
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

## Obtener Detalles de la Alerta

```
GET /api/v1/alerts/{alert_id}
```

## Confirmar Alerta

```
POST /api/v1/alerts/{alert_id}/acknowledge
```

Respuesta:
```json
{
  "id": "alert-uuid",
  "status": "acknowledged",
  "acknowledged_at": "2026-03-15T10:35:00Z",
  "acknowledged_by": "user@company.com"
}
```

## Resolver Alerta

```
POST /api/v1/alerts/{alert_id}/resolve
Content-Type: application/json

{
  "resolution_note": "Puerto cerrado después de actualización de regla de firewall"
}
```

## Niveles de Severidad de Alertas

| Severidad | Descripción | Ejemplo |
|---|---|---|
| `critical` | Acción inmediata requerida | Exploit activo detectado |
| `high` | Riesgo significativo | RDP expuesto a la red |
| `medium` | Riesgo moderado | Versión de servicio desactualizada |
| `low` | Preocupación menor | Nuevo dispositivo en la red |
| `info` | Informativo | Escaneo completado |

## Fuentes de Alertas

| Fuente | Descripción |
|---|---|
| `scan` | Escaneo de puertos / descubrimiento de dispositivos |
| `ids` | Alertas de Suricata IDS |
| `honeypot` | Interacción con honeypot |
| `rogue` | Detección de DHCP/ARP rogue |
| `anomaly` | Detección de anomalías por ML |
| `baseline` | Alerta de desviación de línea base |
| `dns` | Amenaza de sinkhole DNS |

## WebSocket: Alertas en Tiempo Real

Conéctese a `wss://api.netreconapp.com/ws/alerts` para notificaciones de alertas en vivo:

```json
{"event": "ids_alert", "data": {"rule": "ET SCAN Nmap", "src": "10.0.0.5", "severity": "high"}}
{"event": "honeypot_hit", "data": {"port": 22, "src": "10.0.0.99", "action": "login_attempt"}}
{"event": "rogue_detected", "data": {"type": "dhcp", "mac": "AA:BB:CC:DD:EE:FF"}}
```
