---
sidebar_position: 6
title: CVE luure
---

# CVE luure API

Pärige CVE (Common Vulnerabilities and Exposures) andmeid, mis on sobitatud teie avastatud seadmete ja teenustega.

## Hangi mõjutatud seadmed

```
GET /api/v1/cve/affected?page=1&per_page=25
```

### Päringupärameetrid

| Parameeter | Tüüp | Kirjeldus |
|---|---|---|
| `severity` | string | Filter: `critical`, `high`, `medium`, `low` |
| `cvss_min` | float | Minimaalne CVSS skoor (0.0 - 10.0) |
| `site_id` | string | Filtreeri asukoha järgi |
| `device_id` | string | Filtreeri konkreetse seadme järgi |
| `search` | string | Otsi CVE ID-d või kirjeldust |

Vastus:
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

## Otsi CVE-sid

```
GET /api/v1/cve/search?q=apache+log4j&cvss_min=7.0
```

## Hangi CVE üksikasjad

```
GET /api/v1/cve/{cve_id}
```

Tagastab täielikud CVE üksikasjad, sealhulgas MITRE ATT&CK kaardistuse, mõjutatud CPE loendi ja leevendusjuhised.

## CVE statistika

```
GET /api/v1/cve/stats
```

Vastus:
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

## Uuenda CVE andmebaasi

```
POST /api/v1/cve/update
```

Käivitab kohaliku CVE andmebaasi käsitsi uuendamise NVD voogudest. Andmebaas uueneb automaatselt iga 6 tunni järel.

## CVE andmebaasi info

```
GET /api/v1/cve/db-info
```

Vastus:
```json
{
  "total_entries": 245000,
  "last_update": "2026-03-15T06:00:00Z",
  "update_source": "NVD",
  "next_scheduled_update": "2026-03-15T12:00:00Z"
}
```
