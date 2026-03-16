---
sidebar_position: 6
title: CVE Intelligence
---

# CVE Intelligence API

Query CVE (Common Vulnerabilities and Exposures) data matched against your discovered devices and services.

## Get Affected Devices

```
GET /api/v1/cve/affected?page=1&per_page=25
```

### Query Parameters

| Parameter | Type | Description |
|---|---|---|
| `severity` | string | Filter: `critical`, `high`, `medium`, `low` |
| `cvss_min` | float | Minimum CVSS score (0.0 - 10.0) |
| `site_id` | string | Filter by site |
| `device_id` | string | Filter by specific device |
| `search` | string | Search CVE ID or description |

Response:
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

## Search CVEs

```
GET /api/v1/cve/search?q=apache+log4j&cvss_min=7.0
```

## Get CVE Details

```
GET /api/v1/cve/{cve_id}
```

Returns full CVE details including MITRE ATT&CK mapping, affected CPE list, and remediation guidance.

## CVE Statistics

```
GET /api/v1/cve/stats
```

Response:
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

## Update CVE Database

```
POST /api/v1/cve/update
```

Triggers a manual update of the local CVE database from NVD feeds. The database updates automatically every 6 hours.

## CVE Database Info

```
GET /api/v1/cve/db-info
```

Response:
```json
{
  "total_entries": 245000,
  "last_update": "2026-03-15T06:00:00Z",
  "update_source": "NVD",
  "next_scheduled_update": "2026-03-15T12:00:00Z"
}
```
