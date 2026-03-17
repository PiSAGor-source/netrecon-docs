---
sidebar_position: 7
title: Veebikonksud
---

# Veebikonksud

NetRecon saab saata reaalajas teavitusi teie lõpp-punktidele sündmuste toimumisel. Konfigureerige veebikonksud menüüst **Seaded > Integratsioonid** või API kaudu.

## Konfigureerige veebikonks

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

## Sündmuse tüübid

| Sündmus | Kirjeldus |
|---|---|
| `alert.created` | Uus hoiatus genereeritud |
| `alert.resolved` | Hoiatus lahendatud |
| `scan.started` | Skannimine käivitatud |
| `scan.completed` | Skannimine lõpetatud |
| `scan.failed` | Skannimise viga |
| `device.discovered` | Uus seade leitud |
| `device.offline` | Seade läks võrguühenduseta |
| `ids.alert` | IDS reegel käivitunud |
| `honeypot.hit` | Meepoti interaktsioon |
| `rogue.detected` | Võlts-DHCP/ARP tuvastatud |
| `cve.matched` | Uus CVE sobitatud seadmega |
| `backup.completed` | Varundamine lõpetatud |
| `backup.failed` | Varundamise viga |
| `anomaly.detected` | ML anomaalia tuvastatud |

## Koormuse vorming

Kõik veebikonksu koormused järgivad seda struktuuri:

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

## Allkirja kontrollimine

Iga veebikonksu päring sisaldab HMAC-SHA256 allkirja `X-NetRecon-Signature` päises:

```
X-NetRecon-Signature: sha256=a1b2c3d4e5f6...
```

### Python kontrollimise näide

```python
import hmac
import hashlib

def verify_webhook(payload: bytes, signature: str, secret: str) -> bool:
    expected = "sha256=" + hmac.new(
        secret.encode(), payload, hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature)
```

### Node.js kontrollimise näide

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

## Korduskatsete poliitika

Ebaõnnestunud veebikonksu edastamisi proovitakse uuesti eksponentsiaalse viivitusega:

| Katse | Viivitus |
|---|---|
| 1 | Koheselt |
| 2 | 30 sekundit |
| 3 | 2 minutit |
| 4 | 10 minutit |
| 5 | 1 tund |

Pärast 5 ebaõnnestunud katset märgitakse veebikonks `failing` olekusse ja konto omanikule saadetakse e-posti teavitus.

## Testige veebikonksu

```
POST /api/v1/integrations/webhooks/{webhook_id}/test
```

Saadab testkoormuse kontrollimaks, et teie lõpp-punkt on kättesaadav ja töötleb sündmusi korrektselt.

## Loetlege veebikonksud

```
GET /api/v1/integrations/webhooks
```

## Kustutage veebikonks

```
DELETE /api/v1/integrations/webhooks/{webhook_id}
```

## Veebikonksu edastamise logi

```
GET /api/v1/integrations/webhooks/{webhook_id}/deliveries?page=1&per_page=25
```

Tagastab hiljutised edastamiskatsed olekukoodide ja vastamise aegadega.
