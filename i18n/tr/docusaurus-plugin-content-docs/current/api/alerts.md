---
sidebar_position: 5
title: Uyarılar
---

# Uyarılar API'si

Taramalar, IDS, bal küpleri ve anomali tespitinden gelen güvenlik uyarılarını izleyin ve yönetin.

## Uyarıları Listeleme

```
GET /api/v1/alerts?page=1&per_page=25
```

### Sorgu Parametreleri

| Parametre | Tür | Açıklama |
|---|---|---|
| `severity` | string | Filtre: `critical`, `high`, `medium`, `low`, `info` |
| `status` | string | Filtre: `open`, `acknowledged`, `resolved` |
| `site_id` | string | Siteye göre filtrele |
| `source` | string | Filtre: `scan`, `ids`, `honeypot`, `rogue`, `anomaly` |
| `since` | datetime | Bu zaman damgasından sonraki uyarılar |

Yanıt:
```json
{
  "data": [
    {
      "id": "alert-uuid",
      "title": "New open port detected on 192.168.1.10",
      "description": "Port 3389 (RDP) was found open on workstation-01",
      "severity": "high",
      "status": "open",
      "source": "scan",
      "device_ip": "192.168.1.10",
      "site_id": "site-uuid",
      "created_at": "2026-03-15T10:30:00Z",
      "metadata": {
        "port": 3389,
        "service": "RDP",
        "previous_state": "closed"
      }
    }
  ],
  "meta": {"page": 1, "per_page": 25, "total": 18}
}
```

## Uyarı Detaylarını Alma

```
GET /api/v1/alerts/{alert_id}
```

## Uyarıyı Onaylama

```
POST /api/v1/alerts/{alert_id}/acknowledge
```

Yanıt:
```json
{
  "id": "alert-uuid",
  "status": "acknowledged",
  "acknowledged_at": "2026-03-15T10:35:00Z",
  "acknowledged_by": "user@company.com"
}
```

## Uyarıyı Çözümleme

```
POST /api/v1/alerts/{alert_id}/resolve
Content-Type: application/json

{
  "resolution_note": "Port closed after firewall rule update"
}
```

## Uyarı Önem Seviyeleri

| Önem | Açıklama | Örnek |
|---|---|---|
| `critical` | Acil müdahale gerekli | Aktif saldırı tespit edildi |
| `high` | Önemli risk | RDP ağa açık |
| `medium` | Orta düzey risk | Güncel olmayan hizmet sürümü |
| `low` | Düşük endişe | Ağda yeni cihaz |
| `info` | Bilgilendirme | Tarama tamamlandı |

## Uyarı Kaynakları

| Kaynak | Açıklama |
|---|---|
| `scan` | Port taraması / cihaz keşfi |
| `ids` | Suricata IDS uyarıları |
| `honeypot` | Bal küpü etkileşimi |
| `rogue` | Sahte DHCP/ARP tespiti |
| `anomaly` | ML anomali tespiti |
| `baseline` | Temel çizgi sapma uyarısı |
| `dns` | DNS sinkhole tehdidi |

## WebSocket: Gerçek Zamanlı Uyarılar

Canlı uyarı bildirimleri için `wss://api.netreconapp.com/ws/alerts` adresine bağlanın:

```json
{"event": "ids_alert", "data": {"rule": "ET SCAN Nmap", "src": "10.0.0.5", "severity": "high"}}
{"event": "honeypot_hit", "data": {"port": 22, "src": "10.0.0.99", "action": "login_attempt"}}
{"event": "rogue_detected", "data": {"type": "dhcp", "mac": "AA:BB:CC:DD:EE:FF"}}
```
