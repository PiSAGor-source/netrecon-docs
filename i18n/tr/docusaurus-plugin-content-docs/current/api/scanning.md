---
sidebar_position: 3
title: Tarama
---

# Tarama API'si

Tarama API'si ağ taramalarını başlatmanıza, izlemenize ve sonuçlarını almanıza olanak tanır.

## Tarama Başlatma

```
POST /api/v1/scans/start
Content-Type: application/json
Authorization: Bearer <token>

{
  "target": "192.168.1.0/24",
  "profile": "normal",
  "site_id": "optional-site-uuid"
}
```

### Tarama Profilleri

| Profil | Açıklama | Portlar | Zaman Aşımı |
|---|---|---|---|
| `quick` | İlk 100 port, profilleme yok | 100 | 30s |
| `normal` | İlk 1000 port + cihaz profilleme | 1000 | 120s |
| `deep` | Tüm 65535 port + tam profilleme + CVE eşleştirme | 65535 | 600s |
| `stealth` | SYN taraması, düşük hız, IDS atlatma | 1000 | 300s |
| `custom` | Özel port listesi (`ports` alanına bakın) | kullanıcı tanımlı | kullanıcı tanımlı |

### Özel Profil

```json
{
  "target": "10.0.0.0/16",
  "profile": "custom",
  "ports": [22, 80, 443, 3389, 8080, 8443],
  "timeout_ms": 5000,
  "max_concurrent": 20,
  "enable_profiling": true,
  "enable_cve_match": false
}
```

Yanıt:
```json
{
  "id": "scan-uuid",
  "status": "running",
  "target": "192.168.1.0/24",
  "profile": "normal",
  "started_at": "2026-03-15T10:30:00Z"
}
```

## Tarama Durumunu Alma

```
GET /api/v1/scans/{scan_id}
```

Yanıt:
```json
{
  "id": "scan-uuid",
  "status": "running",
  "progress_percent": 45,
  "hosts_found": 12,
  "ports_found": 37,
  "started_at": "2026-03-15T10:30:00Z",
  "estimated_completion": "2026-03-15T10:32:15Z"
}
```

### Tarama Durumu Değerleri

| Durum | Açıklama |
|---|---|
| `queued` | Başlamayı bekliyor |
| `running` | Aktif olarak taranıyor |
| `completed` | Başarıyla tamamlandı |
| `failed` | Hata oluştu |
| `cancelled` | Kullanıcı tarafından iptal edildi |

## Tarama Sonuçlarını Alma

```
GET /api/v1/scans/{scan_id}/result
```

Yanıt:
```json
{
  "id": "scan-uuid",
  "status": "completed",
  "devices_found": 24,
  "open_ports_total": 87,
  "duration_seconds": 95,
  "devices": [
    {
      "ip": "192.168.1.1",
      "mac": "AA:BB:CC:DD:EE:FF",
      "hostname": "gateway.local",
      "vendor": "Cisco Systems",
      "os_guess": "IOS 15.x",
      "ports": [
        {"port": 22, "protocol": "tcp", "state": "open", "service": "SSH"},
        {"port": 443, "protocol": "tcp", "state": "open", "service": "HTTPS"}
      ]
    }
  ]
}
```

## Taramayı Durdurma

```
POST /api/v1/scans/{scan_id}/stop
```

## Taramaları Listeleme

```
GET /api/v1/scans?page=1&per_page=25&status=completed
```

## WebSocket: Gerçek Zamanlı Olaylar

Gerçek zamanlı güncellemeler için `wss://api.netreconapp.com/ws/scans/{scan_id}` adresine bağlanın:

```json
{"event": "host_found", "data": {"ip": "192.168.1.5", "mac": "AA:BB:CC:11:22:33"}}
{"event": "port_found", "data": {"ip": "192.168.1.5", "port": 80, "service": "HTTP"}}
{"event": "scan_complete", "data": {"devices_found": 24, "duration": 95}}
```
