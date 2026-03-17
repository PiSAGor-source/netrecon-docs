---
sidebar_position: 7
title: Webhooks
---

# Webhooks

NetRecon peut envoyer des notifications en temps réel à vos points de terminaison lorsque des événements se produisent. Configurez les webhooks depuis **Settings > Integrations** ou via l'API.

## Configurer un webhook

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

## Types d'événements

| Événement | Description |
|---|---|
| `alert.created` | Nouvelle alerte générée |
| `alert.resolved` | Alerte résolue |
| `scan.started` | Scan démarré |
| `scan.completed` | Scan terminé |
| `scan.failed` | Erreur de scan |
| `device.discovered` | Nouvel appareil trouvé |
| `device.offline` | Appareil passé hors ligne |
| `ids.alert` | Règle IDS déclenchée |
| `honeypot.hit` | Interaction avec le honeypot |
| `rogue.detected` | DHCP/ARP rogue détecté |
| `cve.matched` | Nouveau CVE correspondant à un appareil |
| `backup.completed` | Sauvegarde terminée |
| `backup.failed` | Erreur de sauvegarde |
| `anomaly.detected` | Anomalie ML détectée |

## Format du payload

Tous les payloads webhook suivent cette structure :

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

## Vérification de signature

Chaque requête webhook inclut une signature HMAC-SHA256 dans l'en-tête `X-NetRecon-Signature` :

```
X-NetRecon-Signature: sha256=a1b2c3d4e5f6...
```

### Exemple de vérification en Python

```python
import hmac
import hashlib

def verify_webhook(payload: bytes, signature: str, secret: str) -> bool:
    expected = "sha256=" + hmac.new(
        secret.encode(), payload, hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature)
```

### Exemple de vérification en Node.js

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

## Politique de réessai

Les livraisons de webhook échouées sont réessayées avec un backoff exponentiel :

| Tentative | Délai |
|---|---|
| 1 | Immédiat |
| 2 | 30 secondes |
| 3 | 2 minutes |
| 4 | 10 minutes |
| 5 | 1 heure |

Après 5 tentatives échouées, le webhook est marqué comme `failing` et une notification par e-mail est envoyée au propriétaire du compte.

## Tester un webhook

```
POST /api/v1/integrations/webhooks/{webhook_id}/test
```

Envoie un payload de test pour vérifier que votre point de terminaison est accessible et traite correctement les événements.

## Lister les webhooks

```
GET /api/v1/integrations/webhooks
```

## Supprimer un webhook

```
DELETE /api/v1/integrations/webhooks/{webhook_id}
```

## Journal de livraison des webhooks

```
GET /api/v1/integrations/webhooks/{webhook_id}/deliveries?page=1&per_page=25
```

Renvoie les tentatives de livraison récentes avec les codes de statut et les temps de réponse.
