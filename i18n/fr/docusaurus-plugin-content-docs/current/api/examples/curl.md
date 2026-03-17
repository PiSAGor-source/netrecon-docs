---
sidebar_position: 2
title: Exemples cURL
---

# Exemples d'API cURL

Tous les exemples supposent que vous avez défini votre clé API ou jeton :

```bash
# Option A : Clé API
export NR_KEY="nr_live_xxxxxxxxxxxx"
export NR_AUTH="-H 'X-API-Key: $NR_KEY'"

# Option B : Jeton JWT
export NR_TOKEN="eyJhbGciOi..."
export NR_AUTH="-H 'Authorization: Bearer $NR_TOKEN'"

export NR_BASE="https://api.netreconapp.com/api/v1"
```

## Authentification

### Connexion

```bash
curl -X POST "$NR_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@company.com",
    "password": "your-password"
  }'
```

### Connexion avec 2FA

```bash
curl -X POST "$NR_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@company.com",
    "password": "your-password",
    "totp_code": "123456"
  }'
```

## Scan

### Démarrer un scan

```bash
curl -X POST "$NR_BASE/scans/start" \
  -H "X-API-Key: $NR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "target": "192.168.1.0/24",
    "profile": "normal"
  }'
```

### Vérifier le statut du scan

```bash
curl "$NR_BASE/scans/SCAN_ID" \
  -H "X-API-Key: $NR_KEY"
```

### Obtenir les résultats du scan

```bash
curl "$NR_BASE/scans/SCAN_ID/result" \
  -H "X-API-Key: $NR_KEY"
```

### Arrêter un scan

```bash
curl -X POST "$NR_BASE/scans/SCAN_ID/stop" \
  -H "X-API-Key: $NR_KEY"
```

## Appareils

### Lister tous les appareils

```bash
curl "$NR_BASE/devices" \
  -H "X-API-Key: $NR_KEY"
```

### Filtrer par site

```bash
curl "$NR_BASE/devices?site_id=SITE_UUID&is_online=true" \
  -H "X-API-Key: $NR_KEY"
```

### Obtenir les détails d'un appareil

```bash
curl "$NR_BASE/devices/DEVICE_ID" \
  -H "X-API-Key: $NR_KEY"
```

### Obtenir les ports d'un appareil

```bash
curl "$NR_BASE/devices/DEVICE_ID/ports" \
  -H "X-API-Key: $NR_KEY"
```

## Alertes

### Lister les alertes ouvertes

```bash
curl "$NR_BASE/alerts?status=open&severity=high" \
  -H "X-API-Key: $NR_KEY"
```

### Accuser réception d'une alerte

```bash
curl -X POST "$NR_BASE/alerts/ALERT_ID/acknowledge" \
  -H "X-API-Key: $NR_KEY"
```

### Résoudre une alerte

```bash
curl -X POST "$NR_BASE/alerts/ALERT_ID/resolve" \
  -H "X-API-Key: $NR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"resolution_note": "Firewall rule updated"}'
```

## Intelligence CVE

### Obtenir les appareils affectés

```bash
curl "$NR_BASE/cve/affected?cvss_min=7.0" \
  -H "X-API-Key: $NR_KEY"
```

### Rechercher des CVE

```bash
curl "$NR_BASE/cve/search?q=apache+log4j" \
  -H "X-API-Key: $NR_KEY"
```

## Gestion des clés API

### Créer une clé API

```bash
curl -X POST "$NR_BASE/api-keys" \
  -H "X-API-Key: $NR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Monitoring Script",
    "permissions": ["scans_read", "devices_read", "alerts_read"],
    "expires_in_days": 90
  }'
```

### Lister les clés API

```bash
curl "$NR_BASE/api-keys" \
  -H "X-API-Key: $NR_KEY"
```

### Révoquer une clé API

```bash
curl -X DELETE "$NR_BASE/api-keys/KEY_UUID" \
  -H "X-API-Key: $NR_KEY"
```

## IDS

### Obtenir les alertes IDS

```bash
curl "$NR_BASE/ids/alerts" \
  -H "X-API-Key: $NR_KEY"
```

### Démarrer l'IDS

```bash
curl -X POST "$NR_BASE/ids/start" \
  -H "X-API-Key: $NR_KEY"
```

## Sauvegarde

### Lister les sauvegardes

```bash
curl "$NR_BASE/backup/list" \
  -H "X-API-Key: $NR_KEY"
```

### Lancer une sauvegarde

```bash
curl -X POST "$NR_BASE/backup/run" \
  -H "X-API-Key: $NR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"type": "full"}'
```

## Pagination

### Parcourir les résultats

```bash
# Page 1
curl "$NR_BASE/devices?page=1&per_page=50" \
  -H "X-API-Key: $NR_KEY"

# Page 2
curl "$NR_BASE/devices?page=2&per_page=50" \
  -H "X-API-Key: $NR_KEY"
```

## Recettes utiles

### Exporter tous les appareils en JSON

```bash
curl -s "$NR_BASE/devices?per_page=1000" \
  -H "X-API-Key: $NR_KEY" | jq '.data' > devices.json
```

### Compter les alertes ouvertes par sévérité

```bash
curl -s "$NR_BASE/alerts?status=open&per_page=1" \
  -H "X-API-Key: $NR_KEY" | jq '.meta.total'
```

### Surveiller les nouvelles alertes (polling)

```bash
while true; do
  curl -s "$NR_BASE/alerts?status=open&since=$(date -u -d '5 minutes ago' +%Y-%m-%dT%H:%M:%SZ)" \
    -H "X-API-Key: $NR_KEY" | jq '.data[] | "\(.severity): \(.title)"'
  sleep 300
done
```
