---
sidebar_position: 1
title: Présentation de l'API
description: Présentation de l'API REST — URL de base, authentification, limites de débit et conventions
---

# Présentation de l'API

NetRecon expose une API REST pour l'intégration avec des outils externes, la création de tableaux de bord personnalisés et l'automatisation des flux de travail de sécurité réseau. Tous les microservices sont accessibles via une seule API Gateway.

Pour une liste complète de chaque point de terminaison regroupé par catégorie, consultez la [Référence des points de terminaison](./endpoints.md).

## URL de base

Toutes les requêtes API passent par l'API Gateway :

```
https://probe.netreconapp.com/api/
```

Pour les déploiements auto-hébergés, l'URL de base suit le modèle :

```
https://netrecon.yourcompany.com/api/
```

La passerelle gère l'authentification, la limitation de débit, l'application du RBAC et le routage des requêtes vers le service backend approprié.

## Authentification

Tous les points de terminaison de l'API (sauf `/api/health` et `/health`) nécessitent un jeton JWT Bearer.

### Obtenir un jeton

```bash
curl -X POST https://probe.netreconapp.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your-password"
  }'
```

Réponse :

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "expires_in": 86400
}
```

### Utiliser le jeton

Incluez le jeton dans l'en-tête `Authorization` à chaque requête :

```bash
curl https://probe.netreconapp.com/api/devices \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

### Rafraîchir le jeton

Les jetons expirent après 24 heures par défaut (configurable par déploiement). Rafraîchissez avant l'expiration :

```bash
curl -X POST https://probe.netreconapp.com/api/auth/refresh \
  -H "Authorization: Bearer <current-token>"
```

### Clés API

La communication de service à service et les scripts d'automatisation peuvent utiliser des clés API longue durée comme alternative aux jetons JWT. Les clés utilisent le format `nr_live_` suivi de 48 caractères hexadécimaux.

```bash
curl https://api.netreconapp.com/api/v1/devices \
  -H "X-API-Key: nr_live_a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6"
```

Chaque clé a des portées de permission granulaires. Configurez-les dans le tableau de bord sous **Settings > API Keys**. Consultez [Authentification](./authentication.md) pour les détails complets.

## Limitation de débit

Les requêtes API sont limitées en débit par jeton d'authentification. La passerelle renvoie les en-têtes de réponse `X-RateLimit-Limit` et `X-RateLimit-Remaining` à chaque requête.

| Niveau | Requêtes par minute | Rafale |
|---|---|---|
| Standard | 60 | 10 |
| Admin | 120 | 20 |
| Service (agent) | 300 | 50 |

Lorsque la limite est dépassée, l'API renvoie HTTP `429 Too Many Requests` avec un en-tête `Retry-After` indiquant le nombre de secondes à attendre.

## Conventions de requête et réponse

### Type de contenu

Tous les corps de requête et réponse utilisent `application/json` sauf indication contraire (par ex., les points de terminaison d'export CSV renvoient `text/csv`, les téléchargements de fichiers renvoient `application/octet-stream`).

### Pagination

Les points de terminaison de liste sont paginés avec une taille de page par défaut de 100 éléments. Contrôlez la pagination avec les paramètres de requête :

```
GET /api/devices?page=2&per_page=50
```

### Format d'erreur

Toutes les erreurs suivent une structure JSON cohérente :

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token",
    "details": null
  }
}
```

### Codes d'erreur courants

| Statut HTTP | Code | Description |
|---|---|---|
| 400 | `BAD_REQUEST` | Paramètres de requête invalides |
| 401 | `UNAUTHORIZED` | Jeton manquant ou invalide |
| 403 | `FORBIDDEN` | Permissions insuffisantes (RBAC) |
| 404 | `NOT_FOUND` | Ressource non trouvée |
| 409 | `CONFLICT` | Conflit de ressource (doublon, session active existante, etc.) |
| 429 | `RATE_LIMITED` | Trop de requêtes |
| 500 | `INTERNAL_ERROR` | Erreur serveur |
| 502 | `BAD_GATEWAY` | Service amont inaccessible |
| 503 | `SERVICE_UNAVAILABLE` | Service non prêt |

## API WebSocket

Connectez-vous au point de terminaison WebSocket pour les événements en temps réel :

```
wss://probe.netreconapp.com/ws/events?token=<jwt-token>
```

### Format d'événement

```json
{
  "event": "host_found",
  "timestamp": "2026-03-15T14:30:00Z",
  "data": {
    "ip": "192.168.1.100",
    "mac": "AA:BB:CC:DD:EE:FF",
    "hostname": "workstation-01"
  }
}
```

### Types d'événements

| Événement | Description |
|---|---|
| `host_found` | Nouvel appareil découvert |
| `port_found` | Port ouvert détecté sur un appareil |
| `scan_complete` | Scan réseau terminé |
| `neighbor_discovered` | Voisin CDP/LLDP trouvé |
| `config_changed` | Configuration d'appareil modifiée |
| `baseline_diff_alert` | Déviation de la ligne de base réseau détectée |
| `ids_alert` | Règle IDS déclenchée |
| `honeypot_hit` | Interaction avec le honeypot détectée |
| `rogue_detected` | Activité DHCP ou ARP non autorisée |
| `pcap_ready` | Fichier PCAP prêt au téléchargement |
| `vuln_found` | Vulnérabilité découverte |
| `dns_threat` | Menace DNS bloquée |
| `probe_health_alert` | Seuil de ressource de la sonde dépassé |
| `error` | Événement d'erreur |

## Documentation API interactive

Chaque service backend expose une documentation Swagger/OpenAPI :

| Service | URL de documentation |
|---|---|
| API Gateway | `/api/docs` |
| Vault Server | `/api/vault/docs` |
| License Server | `/api/license/docs` |
| Agent Registry | `/api/agents/docs` |
| CMod Service | `/api/cmod/docs` |
| IPAM Service | `/api/ipam/docs` |
| Diplomat Service | `/api/diplomat/docs` |
| Fusionné (tous les services) | `/api/v1/docs/openapi.json` |

## SDK et exemples d'intégration

Pour des exemples détaillés avec des échantillons de code complets, consultez :

- [Exemples Python](./examples/python.md)
- [Exemples cURL](./examples/curl.md)
- [Exemples PowerShell](./examples/powershell.md)
- [Collection Postman](./examples/postman) — collection importable avec tous les points de terminaison

### Démarrage rapide (cURL)

```bash
# Lister tous les appareils
curl -H "Authorization: Bearer $TOKEN" \
  https://api.netreconapp.com/api/v1/devices

# Démarrer un scan
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"target": "192.168.1.0/24", "profile": "normal"}' \
  https://api.netreconapp.com/api/v1/scans/start

# Obtenir les alertes IDS des dernières 24 heures
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.netreconapp.com/api/v1/alerts?source=ids&since=24h"
```

### Démarrage rapide (Python)

```python
import requests

BASE_URL = "https://api.netreconapp.com/api/v1"
headers = {"X-API-Key": "nr_live_your_api_key_here"}

# Obtenir les appareils
devices = requests.get(f"{BASE_URL}/devices", headers=headers)
for device in devices.json()["data"]:
    print(f"{device['ip']} - {device['hostname']} - {device['device_type']}")
```

## Versionnement de l'API

L'API actuelle est en v1 (implicite pour les points de terminaison de sonde, explicite `/api/v1/` pour les points de terminaison de microservices). Lorsque des changements incompatibles sont introduits, un nouveau chemin de version (`/api/v2/`) sera publié tandis que `/api/` continuera à servir la v1.

## Support

Pour les questions ou problèmes liés à l'API, contactez [support@netreconapp.com](mailto:support@netreconapp.com).
