---
sidebar_position: 1
title: API Genel Bakış
description: REST API genel bakışı — temel URL, kimlik doğrulama, hız sınırları ve kurallar
---

# API Genel Bakış

NetRecon, harici araçlarla entegrasyon, özel kontrol panelleri oluşturma ve ağ güvenliği iş akışlarını otomatikleştirme için bir REST API sunar. Tüm mikro hizmetlere tek bir API Gateway üzerinden erişilebilir.

Her kategoriye göre gruplandırılmış tüm uç noktaların tam listesi için [Uç Nokta Referansı](./endpoints.md) sayfasına bakın.

## Temel URL

Tüm API istekleri API Gateway üzerinden geçer:

```
https://probe.netreconapp.com/api/
```

Kendi sunucunuzda barındırılan dağıtımlar için temel URL şu kalıbı izler:

```
https://netrecon.yourcompany.com/api/
```

Gateway; kimlik doğrulama, hız sınırlama, RBAC uygulama ve istek yönlendirmeyi uygun arka uç hizmetine yönetir.

## Kimlik Doğrulama

Tüm API uç noktaları (`/api/health` ve `/health` hariç) JWT Bearer jetonu gerektirir.

### Jeton Alma

```bash
curl -X POST https://probe.netreconapp.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your-password"
  }'
```

Yanıt:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "expires_in": 86400
}
```

### Jetonu Kullanma

Her istekte `Authorization` başlığına jetonu ekleyin:

```bash
curl https://probe.netreconapp.com/api/devices \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

### Jeton Yenileme

Jetonlar varsayılan olarak 24 saat sonra sona erer (dağıtıma göre yapılandırılabilir). Süre dolmadan önce yenileyin:

```bash
curl -X POST https://probe.netreconapp.com/api/auth/refresh \
  -H "Authorization: Bearer <current-token>"
```

### API Anahtarları

Hizmetler arası iletişim ve otomasyon betikleri, JWT jetonlarına alternatif olarak uzun ömürlü API anahtarları kullanabilir. Anahtarlar `nr_live_` ile başlayıp 48 onaltılık karakter formatını kullanır.

```bash
curl https://api.netreconapp.com/api/v1/devices \
  -H "X-API-Key: nr_live_a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6"
```

Her anahtarın ayrıntılı izin kapsamları vardır. Kontrol panelindeki **Ayarlar > API Anahtarları** bölümünden yapılandırın. Tüm detaylar için [Kimlik Doğrulama](./authentication.md) sayfasına bakın.

## Hız Sınırlama

API istekleri kimlik doğrulama jetonu başına hız sınırına tabidir. Gateway, her istekte `X-RateLimit-Limit` ve `X-RateLimit-Remaining` yanıt başlıklarını döndürür.

| Katman | Dakika başına istek | Ani artış |
|---|---|---|
| Standart | 60 | 10 |
| Yönetici | 120 | 20 |
| Hizmet (ajan) | 300 | 50 |

Sınır aşıldığında API, kaç saniye beklenileceğini gösteren `Retry-After` başlığıyla HTTP `429 Too Many Requests` döndürür.

## İstek ve Yanıt Kuralları

### İçerik Türü

Aksi belirtilmedikçe tüm istek ve yanıt gövdeleri `application/json` kullanır (örn. CSV dışa aktarma uç noktaları `text/csv`, dosya indirmeleri `application/octet-stream` döndürür).

### Sayfalama

Liste uç noktaları varsayılan olarak 100 öğelik sayfa boyutuyla sayfalandırılır. Sayfalamayı sorgu parametreleriyle kontrol edin:

```
GET /api/devices?page=2&per_page=50
```

### Hata Formatı

Tüm hatalar tutarlı bir JSON yapısını izler:

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token",
    "details": null
  }
}
```

### Yaygın Hata Kodları

| HTTP Durumu | Kod | Açıklama |
|---|---|---|
| 400 | `BAD_REQUEST` | Geçersiz istek parametreleri |
| 401 | `UNAUTHORIZED` | Eksik veya geçersiz jeton |
| 403 | `FORBIDDEN` | Yetersiz izinler (RBAC) |
| 404 | `NOT_FOUND` | Kaynak bulunamadı |
| 409 | `CONFLICT` | Kaynak çakışması (tekrar, aktif oturum mevcut, vb.) |
| 429 | `RATE_LIMITED` | Çok fazla istek |
| 500 | `INTERNAL_ERROR` | Sunucu hatası |
| 502 | `BAD_GATEWAY` | Üst akış hizmetine ulaşılamıyor |
| 503 | `SERVICE_UNAVAILABLE` | Hizmet hazır değil |

## WebSocket API

Gerçek zamanlı olaylar için WebSocket uç noktasına bağlanın:

```
wss://probe.netreconapp.com/ws/events?token=<jwt-token>
```

### Olay Formatı

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

### Olay Türleri

| Olay | Açıklama |
|---|---|
| `host_found` | Yeni cihaz keşfedildi |
| `port_found` | Cihazda açık port tespit edildi |
| `scan_complete` | Ağ taraması tamamlandı |
| `neighbor_discovered` | CDP/LLDP komşusu bulundu |
| `config_changed` | Cihaz yapılandırması değişti |
| `baseline_diff_alert` | Ağ temel çizgisi sapması tespit edildi |
| `ids_alert` | IDS kuralı tetiklendi |
| `honeypot_hit` | Bal küpü etkileşimi tespit edildi |
| `rogue_detected` | Sahte DHCP veya ARP etkinliği |
| `pcap_ready` | PCAP dosyası indirmeye hazır |
| `vuln_found` | Zafiyet keşfedildi |
| `dns_threat` | DNS tehdidi engellendi |
| `probe_health_alert` | Prob kaynak eşiği aşıldı |
| `error` | Hata olayı |

## Etkileşimli API Dokümantasyonu

Her arka uç hizmeti Swagger/OpenAPI dokümantasyonu sunar:

| Hizmet | Dokümantasyon URL'si |
|---|---|
| API Gateway | `/api/docs` |
| Vault Server | `/api/vault/docs` |
| License Server | `/api/license/docs` |
| Agent Registry | `/api/agents/docs` |
| CMod Service | `/api/cmod/docs` |
| IPAM Service | `/api/ipam/docs` |
| Diplomat Service | `/api/diplomat/docs` |
| Birleştirilmiş (tüm hizmetler) | `/api/v1/docs/openapi.json` |

## SDK ve Entegrasyon Örnekleri

Tam kod örnekleriyle detaylı örnekler için bakın:

- [Python Örnekleri](./examples/python.md)
- [cURL Örnekleri](./examples/curl.md)
- [PowerShell Örnekleri](./examples/powershell.md)
- [Postman Koleksiyonu](./examples/postman) — tüm uç noktaları içeren içe aktarılabilir koleksiyon

### Hızlı Başlangıç (cURL)

```bash
# Tüm cihazları listele
curl -H "Authorization: Bearer $TOKEN" \
  https://api.netreconapp.com/api/v1/devices

# Tarama başlat
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"target": "192.168.1.0/24", "profile": "normal"}' \
  https://api.netreconapp.com/api/v1/scans/start

# Son 24 saatin IDS uyarılarını al
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.netreconapp.com/api/v1/alerts?source=ids&since=24h"
```

### Hızlı Başlangıç (Python)

```python
import requests

BASE_URL = "https://api.netreconapp.com/api/v1"
headers = {"X-API-Key": "nr_live_your_api_key_here"}

# Cihazları al
devices = requests.get(f"{BASE_URL}/devices", headers=headers)
for device in devices.json()["data"]:
    print(f"{device['ip']} - {device['hostname']} - {device['device_type']}")
```

## API Sürümleme

Mevcut API v1'dir (prob uç noktaları için örtük, mikro hizmet uç noktaları için açık `/api/v1/`). Kırıcı değişiklikler tanıtıldığında, `/api/` v1'i sunmaya devam ederken yeni bir sürüm yolu (`/api/v2/`) yayınlanacaktır.

## Destek

API ile ilgili sorular veya sorunlar için [support@netreconapp.com](mailto:support@netreconapp.com) adresine başvurun.
