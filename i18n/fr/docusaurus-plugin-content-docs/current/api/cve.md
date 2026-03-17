---
sidebar_position: 6
title: Intelligence CVE
---

# API d'intelligence CVE

Interroger les données CVE (Common Vulnerabilities and Exposures) correspondant à vos appareils et services découverts.

## Obtenir les appareils affectés

```
GET /api/v1/cve/affected?page=1&per_page=25
```

### Paramètres de requête

| Paramètre | Type | Description |
|---|---|---|
| `severity` | string | Filtrer : `critical`, `high`, `medium`, `low` |
| `cvss_min` | float | Score CVSS minimum (0.0 - 10.0) |
| `site_id` | string | Filtrer par site |
| `device_id` | string | Filtrer par appareil spécifique |
| `search` | string | Rechercher par identifiant CVE ou description |

Réponse :
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

## Rechercher des CVE

```
GET /api/v1/cve/search?q=apache+log4j&cvss_min=7.0
```

## Obtenir les détails d'un CVE

```
GET /api/v1/cve/{cve_id}
```

Renvoie les détails complets du CVE incluant le mapping MITRE ATT&CK, la liste des CPE affectés et les recommandations de remédiation.

## Statistiques CVE

```
GET /api/v1/cve/stats
```

Réponse :
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

## Mettre à jour la base de données CVE

```
POST /api/v1/cve/update
```

Déclenche une mise à jour manuelle de la base de données CVE locale à partir des flux NVD. La base de données se met à jour automatiquement toutes les 6 heures.

## Informations sur la base de données CVE

```
GET /api/v1/cve/db-info
```

Réponse :
```json
{
  "total_entries": 245000,
  "last_update": "2026-03-15T06:00:00Z",
  "update_source": "NVD",
  "next_scheduled_update": "2026-03-15T12:00:00Z"
}
```
