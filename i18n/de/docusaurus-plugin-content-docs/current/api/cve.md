---
sidebar_position: 6
title: CVE Intelligence
---

# CVE Intelligence API

CVE-Daten (Common Vulnerabilities and Exposures) abfragen, die gegen Ihre entdeckten Geräte und Dienste abgeglichen wurden.

## Betroffene Geräte abrufen

```
GET /api/v1/cve/affected?page=1&per_page=25
```

### Query-Parameter

| Parameter | Typ | Beschreibung |
|---|---|---|
| `severity` | string | Filter: `critical`, `high`, `medium`, `low` |
| `cvss_min` | float | Mindest-CVSS-Score (0.0 - 10.0) |
| `site_id` | string | Nach Standort filtern |
| `device_id` | string | Nach bestimmtem Gerät filtern |
| `search` | string | CVE-ID oder Beschreibung suchen |

Antwort:
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

## CVEs suchen

```
GET /api/v1/cve/search?q=apache+log4j&cvss_min=7.0
```

## CVE-Details abrufen

```
GET /api/v1/cve/{cve_id}
```

Gibt vollständige CVE-Details zurück, einschließlich MITRE ATT&CK-Zuordnung, betroffener CPE-Liste und Behebungshinweisen.

## CVE-Statistiken

```
GET /api/v1/cve/stats
```

Antwort:
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

## CVE-Datenbank aktualisieren

```
POST /api/v1/cve/update
```

Löst eine manuelle Aktualisierung der lokalen CVE-Datenbank aus den NVD-Feeds aus. Die Datenbank aktualisiert sich automatisch alle 6 Stunden.

## CVE-Datenbank-Info

```
GET /api/v1/cve/db-info
```

Antwort:
```json
{
  "total_entries": 245000,
  "last_update": "2026-03-15T06:00:00Z",
  "update_source": "NVD",
  "next_scheduled_update": "2026-03-15T12:00:00Z"
}
```
