---
sidebar_position: 2
title: cURL-Beispiele
---

# cURL API-Beispiele

Alle Beispiele setzen voraus, dass Sie Ihren API-Schlüssel oder Token gesetzt haben:

```bash
# Option A: API Key
export NR_KEY="nr_live_xxxxxxxxxxxx"
export NR_AUTH="-H 'X-API-Key: $NR_KEY'"

# Option B: JWT Token
export NR_TOKEN="eyJhbGciOi..."
export NR_AUTH="-H 'Authorization: Bearer $NR_TOKEN'"

export NR_BASE="https://api.netreconapp.com/api/v1"
```

## Authentifizierung

### Anmeldung

```bash
curl -X POST "$NR_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@company.com",
    "password": "your-password"
  }'
```

### Anmeldung mit 2FA

```bash
curl -X POST "$NR_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@company.com",
    "password": "your-password",
    "totp_code": "123456"
  }'
```

## Scanning

### Scan starten

```bash
curl -X POST "$NR_BASE/scans/start" \
  -H "X-API-Key: $NR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "target": "192.168.1.0/24",
    "profile": "normal"
  }'
```

### Scan-Status prüfen

```bash
curl "$NR_BASE/scans/SCAN_ID" \
  -H "X-API-Key: $NR_KEY"
```

### Scanergebnisse abrufen

```bash
curl "$NR_BASE/scans/SCAN_ID/result" \
  -H "X-API-Key: $NR_KEY"
```

### Scan stoppen

```bash
curl -X POST "$NR_BASE/scans/SCAN_ID/stop" \
  -H "X-API-Key: $NR_KEY"
```

## Geräte

### Alle Geräte auflisten

```bash
curl "$NR_BASE/devices" \
  -H "X-API-Key: $NR_KEY"
```

### Nach Standort filtern

```bash
curl "$NR_BASE/devices?site_id=SITE_UUID&is_online=true" \
  -H "X-API-Key: $NR_KEY"
```

### Gerätedetails abrufen

```bash
curl "$NR_BASE/devices/DEVICE_ID" \
  -H "X-API-Key: $NR_KEY"
```

### Geräte-Ports abrufen

```bash
curl "$NR_BASE/devices/DEVICE_ID/ports" \
  -H "X-API-Key: $NR_KEY"
```

## Warnungen

### Offene Warnungen auflisten

```bash
curl "$NR_BASE/alerts?status=open&severity=high" \
  -H "X-API-Key: $NR_KEY"
```

### Warnung bestätigen

```bash
curl -X POST "$NR_BASE/alerts/ALERT_ID/acknowledge" \
  -H "X-API-Key: $NR_KEY"
```

### Warnung beheben

```bash
curl -X POST "$NR_BASE/alerts/ALERT_ID/resolve" \
  -H "X-API-Key: $NR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"resolution_note": "Firewall rule updated"}'
```

## CVE Intelligence

### Betroffene Geräte abrufen

```bash
curl "$NR_BASE/cve/affected?cvss_min=7.0" \
  -H "X-API-Key: $NR_KEY"
```

### CVEs suchen

```bash
curl "$NR_BASE/cve/search?q=apache+log4j" \
  -H "X-API-Key: $NR_KEY"
```

## API-Schlüssel-Verwaltung

### API-Schlüssel erstellen

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

### API-Schlüssel auflisten

```bash
curl "$NR_BASE/api-keys" \
  -H "X-API-Key: $NR_KEY"
```

### API-Schlüssel widerrufen

```bash
curl -X DELETE "$NR_BASE/api-keys/KEY_UUID" \
  -H "X-API-Key: $NR_KEY"
```

## IDS

### IDS-Warnungen abrufen

```bash
curl "$NR_BASE/ids/alerts" \
  -H "X-API-Key: $NR_KEY"
```

### IDS starten

```bash
curl -X POST "$NR_BASE/ids/start" \
  -H "X-API-Key: $NR_KEY"
```

## Backup

### Backups auflisten

```bash
curl "$NR_BASE/backup/list" \
  -H "X-API-Key: $NR_KEY"
```

### Backup ausführen

```bash
curl -X POST "$NR_BASE/backup/run" \
  -H "X-API-Key: $NR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"type": "full"}'
```

## Paginierung

### Durch Ergebnisse blättern

```bash
# Seite 1
curl "$NR_BASE/devices?page=1&per_page=50" \
  -H "X-API-Key: $NR_KEY"

# Seite 2
curl "$NR_BASE/devices?page=2&per_page=50" \
  -H "X-API-Key: $NR_KEY"
```

## Nützliche Rezepte

### Alle Geräte als JSON exportieren

```bash
curl -s "$NR_BASE/devices?per_page=1000" \
  -H "X-API-Key: $NR_KEY" | jq '.data' > devices.json
```

### Offene Warnungen nach Schweregrad zählen

```bash
curl -s "$NR_BASE/alerts?status=open&per_page=1" \
  -H "X-API-Key: $NR_KEY" | jq '.meta.total'
```

### Auf neue Warnungen überwachen (Polling)

```bash
while true; do
  curl -s "$NR_BASE/alerts?status=open&since=$(date -u -d '5 minutes ago' +%Y-%m-%dT%H:%M:%SZ)" \
    -H "X-API-Key: $NR_KEY" | jq '.data[] | "\(.severity): \(.title)"'
  sleep 300
done
```
