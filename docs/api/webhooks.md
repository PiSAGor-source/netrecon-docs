---
sidebar_position: 7
title: Webhooks
---

# Webhooks

NetRecon can send real-time notifications to your endpoints when events occur. Configure webhooks from **Settings > Integrations** or via the API.

## Configure a Webhook

```
POST /api/v1/integrations/webhooks
Content-Type: application/json

{
  "url": "https://your-server.com/webhook",
  "secret": "your-hmac-secret",
  "events": ["alert.created", "scan.completed", "device.discovered"],
  "active": true
}
```

## Event Types

| Event | Description |
|---|---|
| `alert.created` | New alert generated |
| `alert.resolved` | Alert resolved |
| `scan.started` | Scan started |
| `scan.completed` | Scan finished |
| `scan.failed` | Scan error |
| `device.discovered` | New device found |
| `device.offline` | Device went offline |
| `ids.alert` | IDS rule triggered |
| `honeypot.hit` | Honeypot interaction |
| `rogue.detected` | Rogue DHCP/ARP detected |
| `cve.matched` | New CVE matched to a device |
| `backup.completed` | Backup finished |
| `backup.failed` | Backup error |
| `anomaly.detected` | ML anomaly detected |

## Payload Format

All webhook payloads follow this structure:

```json
{
  "id": "event-uuid",
  "event": "alert.created",
  "timestamp": "2026-03-15T10:30:00Z",
  "tenant_id": "tenant-uuid",
  "data": {
    "alert_id": "alert-uuid",
    "title": "New open port detected",
    "severity": "high",
    "device_ip": "192.168.1.10"
  }
}
```

## Signature Verification

Each webhook request includes an HMAC-SHA256 signature in the `X-NetRecon-Signature` header:

```
X-NetRecon-Signature: sha256=a1b2c3d4e5f6...
```

### Python Verification Example

```python
import hmac
import hashlib

def verify_webhook(payload: bytes, signature: str, secret: str) -> bool:
    expected = "sha256=" + hmac.new(
        secret.encode(), payload, hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature)
```

### Node.js Verification Example

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

## Retry Policy

Failed webhook deliveries are retried with exponential backoff:

| Attempt | Delay |
|---|---|
| 1 | Immediate |
| 2 | 30 seconds |
| 3 | 2 minutes |
| 4 | 10 minutes |
| 5 | 1 hour |

After 5 failed attempts, the webhook is marked as `failing` and an email notification is sent to the account owner.

## Test a Webhook

```
POST /api/v1/integrations/webhooks/{webhook_id}/test
```

Sends a test payload to verify your endpoint is reachable and correctly processing events.

## List Webhooks

```
GET /api/v1/integrations/webhooks
```

## Delete a Webhook

```
DELETE /api/v1/integrations/webhooks/{webhook_id}
```

## Webhook Delivery Log

```
GET /api/v1/integrations/webhooks/{webhook_id}/deliveries?page=1&per_page=25
```

Returns recent delivery attempts with status codes and response times.
