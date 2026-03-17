---
sidebar_position: 6
title: Inteligencia CVE
---

# API de Inteligencia CVE

Consulte datos CVE (Vulnerabilidades y Exposiciones Comunes) relacionados con sus dispositivos y servicios descubiertos.

## Obtener Dispositivos Afectados

```
GET /api/v1/cve/affected?page=1&per_page=25
```

### Parámetros de Consulta

| Parámetro | Tipo | Descripción |
|---|---|---|
| `severity` | string | Filtrar: `critical`, `high`, `medium`, `low` |
| `cvss_min` | float | Puntuación CVSS mínima (0.0 - 10.0) |
| `site_id` | string | Filtrar por sitio |
| `device_id` | string | Filtrar por dispositivo específico |
| `search` | string | Buscar ID de CVE o descripción |

Respuesta:
```json
{
  "data": [
    {
      "cve_id": "CVE-2024-3094",
      "description": "Puerta trasera en xz-utils 5.6.0-5.6.1 permite ejecución remota de código",
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

## Buscar CVEs

```
GET /api/v1/cve/search?q=apache+log4j&cvss_min=7.0
```

## Obtener Detalles de CVE

```
GET /api/v1/cve/{cve_id}
```

Devuelve detalles completos del CVE incluyendo mapeo MITRE ATT&CK, lista de CPE afectados y guía de remediación.

## Estadísticas de CVE

```
GET /api/v1/cve/stats
```

Respuesta:
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

## Actualizar Base de Datos CVE

```
POST /api/v1/cve/update
```

Activa una actualización manual de la base de datos CVE local desde fuentes NVD. La base de datos se actualiza automáticamente cada 6 horas.

## Información de la Base de Datos CVE

```
GET /api/v1/cve/db-info
```

Respuesta:
```json
{
  "total_entries": 245000,
  "last_update": "2026-03-15T06:00:00Z",
  "update_source": "NVD",
  "next_scheduled_update": "2026-03-15T12:00:00Z"
}
```
