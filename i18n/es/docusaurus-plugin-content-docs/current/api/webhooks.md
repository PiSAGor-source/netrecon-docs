---
sidebar_position: 7
title: Webhooks
---

# Webhooks

NetRecon puede enviar notificaciones en tiempo real a sus endpoints cuando ocurren eventos. Configure webhooks desde **Configuración > Integraciones** o vía la API.

## Configurar un Webhook

```
POST /api/v1/integrations/webhooks
Content-Type: application/json

{
  "url": "https://your-server.com/webhook",
  "secret": "su-secreto-hmac",
  "events": ["alert.created", "scan.completed", "device.discovered"],
  "active": true
}
```

## Tipos de Evento

| Evento | Descripción |
|---|---|
| `alert.created` | Nueva alerta generada |
| `alert.resolved` | Alerta resuelta |
| `scan.started` | Escaneo iniciado |
| `scan.completed` | Escaneo finalizado |
| `scan.failed` | Error de escaneo |
| `device.discovered` | Nuevo dispositivo encontrado |
| `device.offline` | Dispositivo se desconectó |
| `ids.alert` | Regla IDS activada |
| `honeypot.hit` | Interacción con honeypot |
| `rogue.detected` | DHCP/ARP rogue detectado |
| `cve.matched` | Nuevo CVE coincide con un dispositivo |
| `backup.completed` | Respaldo finalizado |
| `backup.failed` | Error de respaldo |
| `anomaly.detected` | Anomalía ML detectada |

## Formato del Payload

Todos los payloads de webhook siguen esta estructura:

```json
{
  "id": "event-uuid",
  "event": "alert.created",
  "timestamp": "2026-03-15T10:30:00Z",
  "tenant_id": "tenant-uuid",
  "data": {
    "alert_id": "alert-uuid",
    "title": "Nuevo puerto abierto detectado",
    "severity": "high",
    "device_ip": "192.168.1.10"
  }
}
```

## Verificación de Firma

Cada solicitud de webhook incluye una firma HMAC-SHA256 en el encabezado `X-NetRecon-Signature`:

```
X-NetRecon-Signature: sha256=a1b2c3d4e5f6...
```

### Ejemplo de Verificación en Python

```python
import hmac
import hashlib

def verify_webhook(payload: bytes, signature: str, secret: str) -> bool:
    expected = "sha256=" + hmac.new(
        secret.encode(), payload, hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature)
```

### Ejemplo de Verificación en Node.js

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const expected = 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
```

## Política de Reintentos

Las entregas de webhook fallidas se reintentan con retroceso exponencial:

| Intento | Retardo |
|---|---|
| 1 | Inmediato |
| 2 | 30 segundos |
| 3 | 2 minutos |
| 4 | 10 minutos |
| 5 | 1 hora |

Después de 5 intentos fallidos, el webhook se marca como `fallando` y se envía una notificación por correo electrónico al propietario de la cuenta.

## Probar un Webhook

```
POST /api/v1/integrations/webhooks/{webhook_id}/test
```

Envía un payload de prueba para verificar que su endpoint sea accesible y procese los eventos correctamente.

## Listar Webhooks

```
GET /api/v1/integrations/webhooks
```

## Eliminar un Webhook

```
DELETE /api/v1/integrations/webhooks/{webhook_id}
```

## Registro de Entregas de Webhook

```
GET /api/v1/integrations/webhooks/{webhook_id}/deliveries?page=1&per_page=25
```

Devuelve los intentos de entrega recientes con códigos de estado y tiempos de respuesta.
