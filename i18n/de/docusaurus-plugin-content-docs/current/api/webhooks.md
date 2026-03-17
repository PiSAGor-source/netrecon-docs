---
sidebar_position: 7
title: Webhooks
---

# Webhooks

NetRecon kann Echtzeit-Benachrichtigungen an Ihre Endpunkte senden, wenn Ereignisse eintreten. Konfigurieren Sie Webhooks unter **Einstellungen > Integrationen** oder über die API.

## Webhook konfigurieren

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

## Ereignistypen

| Ereignis | Beschreibung |
|---|---|
| `alert.created` | Neue Warnung generiert |
| `alert.resolved` | Warnung behoben |
| `scan.started` | Scan gestartet |
| `scan.completed` | Scan abgeschlossen |
| `scan.failed` | Scan-Fehler |
| `device.discovered` | Neues Gerät gefunden |
| `device.offline` | Gerät offline gegangen |
| `ids.alert` | IDS-Regel ausgelöst |
| `honeypot.hit` | Honeypot-Interaktion |
| `rogue.detected` | Rogue-DHCP/ARP erkannt |
| `cve.matched` | Neue CVE einem Gerät zugeordnet |
| `backup.completed` | Backup abgeschlossen |
| `backup.failed` | Backup-Fehler |
| `anomaly.detected` | ML-Anomalie erkannt |

## Payload-Format

Alle Webhook-Payloads folgen dieser Struktur:

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

## Signaturverifizierung

Jede Webhook-Anfrage enthält eine HMAC-SHA256-Signatur im `X-NetRecon-Signature`-Header:

```
X-NetRecon-Signature: sha256=a1b2c3d4e5f6...
```

### Python-Verifizierungsbeispiel

```python
import hmac
import hashlib

def verify_webhook(payload: bytes, signature: str, secret: str) -> bool:
    expected = "sha256=" + hmac.new(
        secret.encode(), payload, hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature)
```

### Node.js-Verifizierungsbeispiel

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

## Wiederholungsrichtlinie

Fehlgeschlagene Webhook-Zustellungen werden mit exponentiellem Backoff wiederholt:

| Versuch | Verzögerung |
|---|---|
| 1 | Sofort |
| 2 | 30 Sekunden |
| 3 | 2 Minuten |
| 4 | 10 Minuten |
| 5 | 1 Stunde |

Nach 5 fehlgeschlagenen Versuchen wird der Webhook als `failing` markiert und eine E-Mail-Benachrichtigung an den Kontoinhaber gesendet.

## Webhook testen

```
POST /api/v1/integrations/webhooks/{webhook_id}/test
```

Sendet einen Test-Payload, um zu überprüfen, ob Ihr Endpunkt erreichbar ist und Ereignisse korrekt verarbeitet.

## Webhooks auflisten

```
GET /api/v1/integrations/webhooks
```

## Webhook löschen

```
DELETE /api/v1/integrations/webhooks/{webhook_id}
```

## Webhook-Zustellungsprotokoll

```
GET /api/v1/integrations/webhooks/{webhook_id}/deliveries?page=1&per_page=25
```

Gibt kürzliche Zustellungsversuche mit Statuscodes und Antwortzeiten zurück.
