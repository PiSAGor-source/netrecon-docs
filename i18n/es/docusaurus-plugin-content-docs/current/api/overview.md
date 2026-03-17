---
sidebar_position: 1
title: Descripción General de la API
description: Descripción general de la API REST — URL base, autenticación, límites de tasa y convenciones
---

# Descripción General de la API

NetRecon expone una API REST para integración con herramientas externas, creación de dashboards personalizados y automatización de flujos de trabajo de seguridad de red. Todos los microservicios son accesibles a través de un único API Gateway.

Para una lista completa de cada endpoint agrupado por categoría, consulte la [Referencia de Endpoints](./endpoints.md).

## URL Base

Todas las solicitudes de API pasan a través del API Gateway:

```
https://probe.netreconapp.com/api/
```

Para despliegues autoalojados, la URL base sigue el patrón:

```
https://netrecon.yourcompany.com/api/
```

El gateway maneja la autenticación, limitación de tasa, aplicación de RBAC y enrutamiento de solicitudes al servicio backend apropiado.

## Autenticación

Todos los endpoints de API (excepto `/api/health` y `/health`) requieren un token JWT Bearer.

### Obtener un Token

```bash
curl -X POST https://probe.netreconapp.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "su-contraseña"
  }'
```

Respuesta:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "expires_in": 86400
}
```

### Usar el Token

Incluya el token en el encabezado `Authorization` en cada solicitud:

```bash
curl https://probe.netreconapp.com/api/devices \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

### Renovación del Token

Los tokens expiran después de 24 horas por defecto (configurable por despliegue). Renueve antes de la expiración:

```bash
curl -X POST https://probe.netreconapp.com/api/auth/refresh \
  -H "Authorization: Bearer <token-actual>"
```

### Claves de API

La comunicación servicio a servicio y los scripts de automatización pueden usar claves de API de larga duración como alternativa a los tokens JWT. Las claves usan el formato `nr_live_` seguido de 48 caracteres hexadecimales.

```bash
curl https://api.netreconapp.com/api/v1/devices \
  -H "X-API-Key: nr_live_a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6"
```

Cada clave tiene permisos granulares. Configúrelos en el dashboard bajo **Configuración > Claves de API**. Consulte [Autenticación](./authentication.md) para más detalles.

## Limitación de Tasa

Las solicitudes de API están limitadas por tasa por token de autenticación. El gateway devuelve los encabezados de respuesta `X-RateLimit-Limit` y `X-RateLimit-Remaining` en cada solicitud.

| Nivel | Solicitudes por minuto | Ráfaga |
|---|---|---|
| Estándar | 60 | 10 |
| Admin | 120 | 20 |
| Servicio (agente) | 300 | 50 |

Cuando se excede el límite, la API devuelve HTTP `429 Too Many Requests` con un encabezado `Retry-After` que indica cuántos segundos esperar.

## Convenciones de Solicitud y Respuesta

### Tipo de Contenido

Todos los cuerpos de solicitud y respuesta usan `application/json` a menos que se indique lo contrario (ej., endpoints de exportación CSV devuelven `text/csv`, descargas de archivos devuelven `application/octet-stream`).

### Paginación

Los endpoints de lista están paginados con un tamaño de página predeterminado de 100 elementos. Controle la paginación con parámetros de consulta:

```
GET /api/devices?page=2&per_page=50
```

### Formato de Error

Todos los errores siguen una estructura JSON consistente:

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Token inválido o expirado",
    "details": null
  }
}
```

### Códigos de Error Comunes

| Estado HTTP | Código | Descripción |
|---|---|---|
| 400 | `BAD_REQUEST` | Parámetros de solicitud inválidos |
| 401 | `UNAUTHORIZED` | Token faltante o inválido |
| 403 | `FORBIDDEN` | Permisos insuficientes (RBAC) |
| 404 | `NOT_FOUND` | Recurso no encontrado |
| 409 | `CONFLICT` | Conflicto de recurso (duplicado, sesión activa existente, etc.) |
| 429 | `RATE_LIMITED` | Demasiadas solicitudes |
| 500 | `INTERNAL_ERROR` | Error del servidor |
| 502 | `BAD_GATEWAY` | Servicio upstream inalcanzable |
| 503 | `SERVICE_UNAVAILABLE` | Servicio no disponible |

## API WebSocket

Conéctese al endpoint WebSocket para eventos en tiempo real:

```
wss://probe.netreconapp.com/ws/events?token=<token-jwt>
```

### Formato de Evento

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

### Tipos de Evento

| Evento | Descripción |
|---|---|
| `host_found` | Nuevo dispositivo descubierto |
| `port_found` | Puerto abierto detectado en un dispositivo |
| `scan_complete` | Escaneo de red finalizado |
| `neighbor_discovered` | Vecino CDP/LLDP encontrado |
| `config_changed` | Configuración de dispositivo cambiada |
| `baseline_diff_alert` | Desviación de línea base de red detectada |
| `ids_alert` | Regla IDS activada |
| `honeypot_hit` | Interacción con honeypot detectada |
| `rogue_detected` | Actividad DHCP o ARP rogue |
| `pcap_ready` | Archivo PCAP listo para descarga |
| `vuln_found` | Vulnerabilidad descubierta |
| `dns_threat` | Amenaza DNS bloqueada |
| `probe_health_alert` | Umbral de recursos de la sonda excedido |
| `error` | Evento de error |

## Documentación Interactiva de la API

Cada servicio backend expone documentación Swagger/OpenAPI:

| Servicio | URL de Documentación |
|---|---|
| API Gateway | `/api/docs` |
| Vault Server | `/api/vault/docs` |
| License Server | `/api/license/docs` |
| Agent Registry | `/api/agents/docs` |
| CMod Service | `/api/cmod/docs` |
| IPAM Service | `/api/ipam/docs` |
| Diplomat Service | `/api/diplomat/docs` |
| Combinado (todos los servicios) | `/api/v1/docs/openapi.json` |

## SDK y Ejemplos de Integración

Para ejemplos detallados con muestras de código completas, consulte:

- [Ejemplos en Python](./examples/python.md)
- [Ejemplos en cURL](./examples/curl.md)
- [Ejemplos en PowerShell](./examples/powershell.md)
- [Colección Postman](./examples/postman) — colección importable con todos los endpoints

### Inicio Rápido (cURL)

```bash
# Listar todos los dispositivos
curl -H "Authorization: Bearer $TOKEN" \
  https://api.netreconapp.com/api/v1/devices

# Iniciar un escaneo
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"target": "192.168.1.0/24", "profile": "normal"}' \
  https://api.netreconapp.com/api/v1/scans/start

# Obtener alertas IDS de las últimas 24 horas
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.netreconapp.com/api/v1/alerts?source=ids&since=24h"
```

### Inicio Rápido (Python)

```python
import requests

BASE_URL = "https://api.netreconapp.com/api/v1"
headers = {"X-API-Key": "nr_live_your_api_key_here"}

# Obtener dispositivos
devices = requests.get(f"{BASE_URL}/devices", headers=headers)
for device in devices.json()["data"]:
    print(f"{device['ip']} - {device['hostname']} - {device['device_type']}")
```

## Versionado de la API

La API actual es v1 (implícita para endpoints de sonda, explícita `/api/v1/` para endpoints de microservicios). Cuando se introduzcan cambios incompatibles, se publicará una nueva ruta de versión (`/api/v2/`) mientras `/api/` continúa sirviendo v1.

## Soporte

Para preguntas o problemas relacionados con la API, contacte a [support@netreconapp.com](mailto:support@netreconapp.com).
