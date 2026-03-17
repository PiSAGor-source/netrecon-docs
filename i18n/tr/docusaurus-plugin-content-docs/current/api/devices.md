---
sidebar_position: 4
title: Cihazlar
---

# Cihazlar API'si

Keşfedilen ağ cihazlarını, özelliklerini ve ilişkilerini yönetin.

## Cihazları Listeleme

```
GET /api/v1/devices?page=1&per_page=25
```

### Sorgu Parametreleri

| Parametre | Tür | Açıklama |
|---|---|---|
| `site_id` | string | Siteye göre filtrele |
| `is_online` | boolean | Çevrimiçi durumuna göre filtrele |
| `vendor` | string | Üretici adına göre filtrele |
| `os` | string | İşletim sistemine göre filtrele |
| `search` | string | Ana bilgisayar adı, IP veya MAC ara |
| `sort` | string | Sıralama: `ip`, `hostname`, `last_seen`, `vendor` |

Yanıt:
```json
{
  "data": [
    {
      "id": "device-uuid",
      "ip": "192.168.1.10",
      "mac": "AA:BB:CC:DD:EE:FF",
      "hostname": "workstation-01",
      "vendor": "Dell Inc.",
      "os_guess": "Windows 11",
      "device_type": "workstation",
      "is_online": true,
      "first_seen": "2026-01-15T08:30:00Z",
      "last_seen": "2026-03-15T10:30:00Z",
      "site_id": "site-uuid",
      "open_ports": [22, 80, 443, 3389],
      "tags": ["production", "finance-dept"]
    }
  ],
  "meta": {"page": 1, "per_page": 25, "total": 142}
}
```

## Cihaz Detaylarını Alma

```
GET /api/v1/devices/{device_id}
```

Port detayları, hizmetler, CVE eşleşmeleri ve geçmiş dahil tam cihaz profilini döndürür.

## Cihaz Oluşturma (Manuel)

```
POST /api/v1/devices
Content-Type: application/json

{
  "ip": "10.0.0.50",
  "mac": "11:22:33:44:55:66",
  "hostname": "server-db-01",
  "device_type": "server",
  "site_id": "site-uuid",
  "tags": ["database", "production"]
}
```

## Cihaz Güncelleme

```
PUT /api/v1/devices/{device_id}
Content-Type: application/json

{
  "hostname": "server-db-01-renamed",
  "tags": ["database", "production", "critical"]
}
```

## Cihaz Silme

```
DELETE /api/v1/devices/{device_id}
```

## Cihaz Portlarını Alma

```
GET /api/v1/devices/{device_id}/ports
```

Yanıt:
```json
{
  "data": [
    {
      "port": 443,
      "protocol": "tcp",
      "state": "open",
      "service": "HTTPS",
      "version": "nginx/1.24.0",
      "banner": "Server: nginx/1.24.0",
      "last_scanned": "2026-03-15T10:30:00Z"
    }
  ]
}
```

## Cihaz Türleri

| Tür | Açıklama |
|---|---|
| `workstation` | Masaüstü/dizüstü bilgisayar |
| `server` | Sunucu |
| `router` | Yönlendirici |
| `switch` | Ağ anahtarı |
| `firewall` | Güvenlik duvarı |
| `printer` | Yazıcı |
| `camera` | IP kamera |
| `phone` | VoIP telefon |
| `iot` | IoT cihazı |
| `access_point` | Kablosuz erişim noktası |
| `unknown` | Sınıflandırılmamış |
