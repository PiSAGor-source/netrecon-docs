---
sidebar_position: 5
title: Alertes
---

# API des alertes

Surveiller et gérer les alertes de sécurité provenant des scans, IDS, honeypots et de la détection d'anomalies.

## Lister les alertes

```
GET /api/v1/alerts?page=1&per_page=25
```

### Paramètres de requête

| Paramètre | Type | Description |
|---|---|---|
| `severity` | string | Filtrer : `critical`, `high`, `medium`, `low`, `info` |
| `status` | string | Filtrer : `open`, `acknowledged`, `resolved` |
| `site_id` | string | Filtrer par site |
| `source` | string | Filtrer : `scan`, `ids`, `honeypot`, `rogue`, `anomaly` |
| `since` | datetime | Alertes après cet horodatage |

Réponse :
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

## Obtenir les détails d'une alerte

```
GET /api/v1/alerts/{alert_id}
```

## Accuser réception d'une alerte

```
POST /api/v1/alerts/{alert_id}/acknowledge
```

Réponse :
```json
{
  "id": "alert-uuid",
  "status": "acknowledged",
  "acknowledged_at": "2026-03-15T10:35:00Z",
  "acknowledged_by": "user@company.com"
}
```

## Résoudre une alerte

```
POST /api/v1/alerts/{alert_id}/resolve
Content-Type: application/json

{
  "resolution_note": "Port closed after firewall rule update"
}
```

## Niveaux de sévérité des alertes

| Sévérité | Description | Exemple |
|---|---|---|
| `critical` | Action immédiate requise | Exploit actif détecté |
| `high` | Risque significatif | RDP exposé sur le réseau |
| `medium` | Risque modéré | Version de service obsolète |
| `low` | Préoccupation mineure | Nouvel appareil sur le réseau |
| `info` | Informationnel | Scan terminé |

## Sources d'alertes

| Source | Description |
|---|---|
| `scan` | Scan de ports / découverte d'appareils |
| `ids` | Alertes IDS Suricata |
| `honeypot` | Interaction avec le honeypot |
| `rogue` | Détection DHCP/ARP rogue |
| `anomaly` | Détection d'anomalies par ML |
| `baseline` | Alerte de dérive de ligne de base |
| `dns` | Menace sinkhole DNS |

## WebSocket : alertes en temps réel

Connectez-vous à `wss://api.netreconapp.com/ws/alerts` pour les notifications d'alertes en direct :

```json
{"event": "ids_alert", "data": {"rule": "ET SCAN Nmap", "src": "10.0.0.5", "severity": "high"}}
{"event": "honeypot_hit", "data": {"port": 22, "src": "10.0.0.99", "action": "login_attempt"}}
{"event": "rogue_detected", "data": {"type": "dhcp", "mac": "AA:BB:CC:DD:EE:FF"}}
```
