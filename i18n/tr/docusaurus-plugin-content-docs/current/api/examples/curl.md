---
sidebar_position: 2
title: cURL Örnekleri
---

# cURL API Örnekleri

Tüm örnekler API anahtarınızı veya jetonunuzu ayarladığınızı varsayar:

```bash
# Seçenek A: API Anahtarı
export NR_KEY="nr_live_xxxxxxxxxxxx"
export NR_AUTH="-H 'X-API-Key: $NR_KEY'"

# Seçenek B: JWT Jetonu
export NR_TOKEN="eyJhbGciOi..."
export NR_AUTH="-H 'Authorization: Bearer $NR_TOKEN'"

export NR_BASE="https://api.netreconapp.com/api/v1"
```

## Kimlik Doğrulama

### Giriş

```bash
curl -X POST "$NR_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@company.com",
    "password": "your-password"
  }'
```

### 2FA ile Giriş

```bash
curl -X POST "$NR_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@company.com",
    "password": "your-password",
    "totp_code": "123456"
  }'
```

## Tarama

### Tarama Başlatma

```bash
curl -X POST "$NR_BASE/scans/start" \
  -H "X-API-Key: $NR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "target": "192.168.1.0/24",
    "profile": "normal"
  }'
```

### Tarama Durumunu Kontrol Etme

```bash
curl "$NR_BASE/scans/SCAN_ID" \
  -H "X-API-Key: $NR_KEY"
```

### Tarama Sonuçlarını Alma

```bash
curl "$NR_BASE/scans/SCAN_ID/result" \
  -H "X-API-Key: $NR_KEY"
```

### Taramayı Durdurma

```bash
curl -X POST "$NR_BASE/scans/SCAN_ID/stop" \
  -H "X-API-Key: $NR_KEY"
```

## Cihazlar

### Tüm Cihazları Listeleme

```bash
curl "$NR_BASE/devices" \
  -H "X-API-Key: $NR_KEY"
```

### Siteye Göre Filtreleme

```bash
curl "$NR_BASE/devices?site_id=SITE_UUID&is_online=true" \
  -H "X-API-Key: $NR_KEY"
```

### Cihaz Detaylarını Alma

```bash
curl "$NR_BASE/devices/DEVICE_ID" \
  -H "X-API-Key: $NR_KEY"
```

### Cihaz Portlarını Alma

```bash
curl "$NR_BASE/devices/DEVICE_ID/ports" \
  -H "X-API-Key: $NR_KEY"
```

## Uyarılar

### Açık Uyarıları Listeleme

```bash
curl "$NR_BASE/alerts?status=open&severity=high" \
  -H "X-API-Key: $NR_KEY"
```

### Uyarıyı Onaylama

```bash
curl -X POST "$NR_BASE/alerts/ALERT_ID/acknowledge" \
  -H "X-API-Key: $NR_KEY"
```

### Uyarıyı Çözümleme

```bash
curl -X POST "$NR_BASE/alerts/ALERT_ID/resolve" \
  -H "X-API-Key: $NR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"resolution_note": "Firewall rule updated"}'
```

## CVE İstihbaratı

### Etkilenen Cihazları Alma

```bash
curl "$NR_BASE/cve/affected?cvss_min=7.0" \
  -H "X-API-Key: $NR_KEY"
```

### CVE Arama

```bash
curl "$NR_BASE/cve/search?q=apache+log4j" \
  -H "X-API-Key: $NR_KEY"
```

## API Anahtarı Yönetimi

### API Anahtarı Oluşturma

```bash
curl -X POST "$NR_BASE/api-keys" \
  -H "X-API-Key: $NR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Monitoring Script",
    "permissions": ["scans_read", "devices_read", "alerts_read"],
    "expires_in_days": 90
  }'
```

### API Anahtarlarını Listeleme

```bash
curl "$NR_BASE/api-keys" \
  -H "X-API-Key: $NR_KEY"
```

### API Anahtarını İptal Etme

```bash
curl -X DELETE "$NR_BASE/api-keys/KEY_UUID" \
  -H "X-API-Key: $NR_KEY"
```

## IDS

### IDS Uyarılarını Alma

```bash
curl "$NR_BASE/ids/alerts" \
  -H "X-API-Key: $NR_KEY"
```

### IDS'yi Başlatma

```bash
curl -X POST "$NR_BASE/ids/start" \
  -H "X-API-Key: $NR_KEY"
```

## Yedekleme

### Yedeklemeleri Listeleme

```bash
curl "$NR_BASE/backup/list" \
  -H "X-API-Key: $NR_KEY"
```

### Yedekleme Çalıştırma

```bash
curl -X POST "$NR_BASE/backup/run" \
  -H "X-API-Key: $NR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"type": "full"}'
```

## Sayfalama

### Sonuçlarda Gezinme

```bash
# Sayfa 1
curl "$NR_BASE/devices?page=1&per_page=50" \
  -H "X-API-Key: $NR_KEY"

# Sayfa 2
curl "$NR_BASE/devices?page=2&per_page=50" \
  -H "X-API-Key: $NR_KEY"
```

## Faydalı Tarifler

### Tüm Cihazları JSON Olarak Dışa Aktarma

```bash
curl -s "$NR_BASE/devices?per_page=1000" \
  -H "X-API-Key: $NR_KEY" | jq '.data' > devices.json
```

### Önem Seviyesine Göre Açık Uyarı Sayısı

```bash
curl -s "$NR_BASE/alerts?status=open&per_page=1" \
  -H "X-API-Key: $NR_KEY" | jq '.meta.total'
```

### Yeni Uyarıları İzleme (yoklama)

```bash
while true; do
  curl -s "$NR_BASE/alerts?status=open&since=$(date -u -d '5 minutes ago' +%Y-%m-%dT%H:%M:%SZ)" \
    -H "X-API-Key: $NR_KEY" | jq '.data[] | "\(.severity): \(.title)"'
  sleep 300
done
```
