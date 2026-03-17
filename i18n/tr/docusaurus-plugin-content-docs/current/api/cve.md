---
sidebar_position: 6
title: CVE İstihbaratı
---

# CVE İstihbaratı API'si

Keşfedilen cihazlarınız ve hizmetlerinizle eşleştirilen CVE (Common Vulnerabilities and Exposures) verilerini sorgulayın.

## Etkilenen Cihazları Alma

```
GET /api/v1/cve/affected?page=1&per_page=25
```

### Sorgu Parametreleri

| Parametre | Tür | Açıklama |
|---|---|---|
| `severity` | string | Filtre: `critical`, `high`, `medium`, `low` |
| `cvss_min` | float | Minimum CVSS puanı (0.0 - 10.0) |
| `site_id` | string | Siteye göre filtrele |
| `device_id` | string | Belirli bir cihaza göre filtrele |
| `search` | string | CVE ID veya açıklama ara |

Yanıt:
```json
{
  "data": [
    {
      "cve_id": "CVE-2024-3094",
      "description": "Backdoor in xz-utils 5.6.0-5.6.1 allows remote code execution",
      "cvss_score": 10.0,
      "severity": "critical",
      "published": "2024-03-29",
      "affected_devices": [
        {
          "device_id": "device-uuid",
          "ip": "192.168.1.15",
          "hostname": "server-web-01",
          "matched_service": "openssh/9.7",
          "matched_port": 22
        }
      ],
      "references": [
        "https://nvd.nist.gov/vuln/detail/CVE-2024-3094"
      ],
      "mitre_techniques": ["T1195.002"]
    }
  ],
  "meta": {"page": 1, "total": 7}
}
```

## CVE Arama

```
GET /api/v1/cve/search?q=apache+log4j&cvss_min=7.0
```

## CVE Detaylarını Alma

```
GET /api/v1/cve/{cve_id}
```

MITRE ATT&CK eşleştirmesi, etkilenen CPE listesi ve düzeltme rehberliği dahil tam CVE detaylarını döndürür.

## CVE İstatistikleri

```
GET /api/v1/cve/stats
```

Yanıt:
```json
{
  "total_matched": 42,
  "by_severity": {
    "critical": 3,
    "high": 12,
    "medium": 19,
    "low": 8
  },
  "affected_devices": 15,
  "last_db_update": "2026-03-15T06:00:00Z",
  "db_total_cves": 245000
}
```

## CVE Veritabanını Güncelleme

```
POST /api/v1/cve/update
```

NVD beslemelerinden yerel CVE veritabanının manuel güncellenmesini tetikler. Veritabanı her 6 saatte bir otomatik olarak güncellenir.

## CVE Veritabanı Bilgisi

```
GET /api/v1/cve/db-info
```

Yanıt:
```json
{
  "total_entries": 245000,
  "last_update": "2026-03-15T06:00:00Z",
  "update_source": "NVD",
  "next_scheduled_update": "2026-03-15T12:00:00Z"
}
```
