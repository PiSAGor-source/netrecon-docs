---
sidebar_position: 3
title: Scan
---

# API de scan

L'API de scan vous permet de démarrer, surveiller et récupérer les résultats des scans réseau.

## Démarrer un scan

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

### Profils de scan

| Profil | Description | Ports | Timeout |
|---|---|---|---|
| `quick` | Top 100 ports, pas de profilage | 100 | 30s |
| `normal` | Top 1000 ports + profilage des appareils | 1000 | 120s |
| `deep` | Tous les 65535 ports + profilage complet + correspondance CVE | 65535 | 600s |
| `stealth` | Scan SYN, faible débit, évasion IDS | 1000 | 300s |
| `custom` | Liste de ports personnalisée (voir le champ `ports`) | défini par l'utilisateur | défini par l'utilisateur |

### Profil personnalisé

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

Réponse :
```json
{
  "id": "scan-uuid",
  "status": "running",
  "target": "192.168.1.0/24",
  "profile": "normal",
  "started_at": "2026-03-15T10:30:00Z"
}
```

## Obtenir le statut du scan

```
GET /api/v1/scans/{scan_id}
```

Réponse :
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

### Valeurs de statut du scan

| Statut | Description |
|---|---|
| `queued` | En attente de démarrage |
| `running` | Scan en cours |
| `completed` | Terminé avec succès |
| `failed` | Une erreur s'est produite |
| `cancelled` | Annulé par l'utilisateur |

## Obtenir les résultats du scan

```
GET /api/v1/scans/{scan_id}/result
```

Réponse :
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

## Arrêter un scan

```
POST /api/v1/scans/{scan_id}/stop
```

## Lister les scans

```
GET /api/v1/scans?page=1&per_page=25&status=completed
```

## WebSocket : événements en temps réel

Connectez-vous à `wss://api.netreconapp.com/ws/scans/{scan_id}` pour les mises à jour en temps réel :

```json
{"event": "host_found", "data": {"ip": "192.168.1.5", "mac": "AA:BB:CC:11:22:33"}}
{"event": "port_found", "data": {"ip": "192.168.1.5", "port": 80, "service": "HTTP"}}
{"event": "scan_complete", "data": {"devices_found": 24, "duration": 95}}
```
