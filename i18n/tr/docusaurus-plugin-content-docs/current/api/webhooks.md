---
sidebar_position: 7
title: Webhook'lar
---

# Webhook'lar

NetRecon, olaylar meydana geldiğinde uç noktalarınıza gerçek zamanlı bildirimler gönderebilir. Webhook'ları **Ayarlar > Entegrasyonlar** bölümünden veya API aracılığıyla yapılandırın.

## Webhook Yapılandırma

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

## Olay Türleri

| Olay | Açıklama |
|---|---|
| `alert.created` | Yeni uyarı oluşturuldu |
| `alert.resolved` | Uyarı çözümlendi |
| `scan.started` | Tarama başlatıldı |
| `scan.completed` | Tarama tamamlandı |
| `scan.failed` | Tarama hatası |
| `device.discovered` | Yeni cihaz bulundu |
| `device.offline` | Cihaz çevrimdışı oldu |
| `ids.alert` | IDS kuralı tetiklendi |
| `honeypot.hit` | Bal küpü etkileşimi |
| `rogue.detected` | Sahte DHCP/ARP tespit edildi |
| `cve.matched` | Bir cihazla yeni CVE eşleşti |
| `backup.completed` | Yedekleme tamamlandı |
| `backup.failed` | Yedekleme hatası |
| `anomaly.detected` | ML anomalisi tespit edildi |

## Yük Formatı

Tüm webhook yükleri bu yapıyı izler:

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

## İmza Doğrulama

Her webhook isteği, `X-NetRecon-Signature` başlığında bir HMAC-SHA256 imzası içerir:

```
X-NetRecon-Signature: sha256=a1b2c3d4e5f6...
```

### Python Doğrulama Örneği

```python
import hmac
import hashlib

def verify_webhook(payload: bytes, signature: str, secret: str) -> bool:
    expected = "sha256=" + hmac.new(
        secret.encode(), payload, hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature)
```

### Node.js Doğrulama Örneği

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

## Yeniden Deneme Politikası

Başarısız webhook teslimatları üstel geri çekilme ile yeniden denenir:

| Deneme | Gecikme |
|---|---|
| 1 | Hemen |
| 2 | 30 saniye |
| 3 | 2 dakika |
| 4 | 10 dakika |
| 5 | 1 saat |

5 başarısız denemeden sonra webhook `failing` olarak işaretlenir ve hesap sahibine e-posta bildirimi gönderilir.

## Webhook Test Etme

```
POST /api/v1/integrations/webhooks/{webhook_id}/test
```

Uç noktanızın erişilebilir olduğunu ve olayları doğru şekilde işlediğini doğrulamak için bir test yükü gönderir.

## Webhook'ları Listeleme

```
GET /api/v1/integrations/webhooks
```

## Webhook Silme

```
DELETE /api/v1/integrations/webhooks/{webhook_id}
```

## Webhook Teslimat Günlüğü

```
GET /api/v1/integrations/webhooks/{webhook_id}/deliveries?page=1&per_page=25
```

Durum kodları ve yanıt süreleriyle birlikte son teslimat denemelerini döndürür.
