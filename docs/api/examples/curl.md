---
sidebar_position: 2
title: cURL Examples
---

# cURL API Examples

All examples assume you have set your API key or token:

```bash
# Option A: API Key
export NR_KEY="nr_live_xxxxxxxxxxxx"
export NR_AUTH="-H 'X-API-Key: $NR_KEY'"

# Option B: JWT Token
export NR_TOKEN="eyJhbGciOi..."
export NR_AUTH="-H 'Authorization: Bearer $NR_TOKEN'"

export NR_BASE="https://api.netreconapp.com/api/v1"
```

## Authentication

### Login

```bash
curl -X POST "$NR_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@company.com",
    "password": "your-password"
  }'
```

### Login with 2FA

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

### Start a Scan

```bash
curl -X POST "$NR_BASE/scans/start" \
  -H "X-API-Key: $NR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "target": "192.168.1.0/24",
    "profile": "normal"
  }'
```

### Check Scan Status

```bash
curl "$NR_BASE/scans/SCAN_ID" \
  -H "X-API-Key: $NR_KEY"
```

### Get Scan Results

```bash
curl "$NR_BASE/scans/SCAN_ID/result" \
  -H "X-API-Key: $NR_KEY"
```

### Stop a Scan

```bash
curl -X POST "$NR_BASE/scans/SCAN_ID/stop" \
  -H "X-API-Key: $NR_KEY"
```

## Devices

### List All Devices

```bash
curl "$NR_BASE/devices" \
  -H "X-API-Key: $NR_KEY"
```

### Filter by Site

```bash
curl "$NR_BASE/devices?site_id=SITE_UUID&is_online=true" \
  -H "X-API-Key: $NR_KEY"
```

### Get Device Details

```bash
curl "$NR_BASE/devices/DEVICE_ID" \
  -H "X-API-Key: $NR_KEY"
```

### Get Device Ports

```bash
curl "$NR_BASE/devices/DEVICE_ID/ports" \
  -H "X-API-Key: $NR_KEY"
```

## Alerts

### List Open Alerts

```bash
curl "$NR_BASE/alerts?status=open&severity=high" \
  -H "X-API-Key: $NR_KEY"
```

### Acknowledge an Alert

```bash
curl -X POST "$NR_BASE/alerts/ALERT_ID/acknowledge" \
  -H "X-API-Key: $NR_KEY"
```

### Resolve an Alert

```bash
curl -X POST "$NR_BASE/alerts/ALERT_ID/resolve" \
  -H "X-API-Key: $NR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"resolution_note": "Firewall rule updated"}'
```

## CVE Intelligence

### Get Affected Devices

```bash
curl "$NR_BASE/cve/affected?cvss_min=7.0" \
  -H "X-API-Key: $NR_KEY"
```

### Search CVEs

```bash
curl "$NR_BASE/cve/search?q=apache+log4j" \
  -H "X-API-Key: $NR_KEY"
```

## API Key Management

### Create an API Key

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

### List API Keys

```bash
curl "$NR_BASE/api-keys" \
  -H "X-API-Key: $NR_KEY"
```

### Revoke an API Key

```bash
curl -X DELETE "$NR_BASE/api-keys/KEY_UUID" \
  -H "X-API-Key: $NR_KEY"
```

## IDS

### Get IDS Alerts

```bash
curl "$NR_BASE/ids/alerts" \
  -H "X-API-Key: $NR_KEY"
```

### Start IDS

```bash
curl -X POST "$NR_BASE/ids/start" \
  -H "X-API-Key: $NR_KEY"
```

## Backup

### List Backups

```bash
curl "$NR_BASE/backup/list" \
  -H "X-API-Key: $NR_KEY"
```

### Run a Backup

```bash
curl -X POST "$NR_BASE/backup/run" \
  -H "X-API-Key: $NR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"type": "full"}'
```

## Pagination

### Page Through Results

```bash
# Page 1
curl "$NR_BASE/devices?page=1&per_page=50" \
  -H "X-API-Key: $NR_KEY"

# Page 2
curl "$NR_BASE/devices?page=2&per_page=50" \
  -H "X-API-Key: $NR_KEY"
```

## Useful Recipes

### Export All Devices as JSON

```bash
curl -s "$NR_BASE/devices?per_page=1000" \
  -H "X-API-Key: $NR_KEY" | jq '.data' > devices.json
```

### Count Open Alerts by Severity

```bash
curl -s "$NR_BASE/alerts?status=open&per_page=1" \
  -H "X-API-Key: $NR_KEY" | jq '.meta.total'
```

### Watch for New Alerts (polling)

```bash
while true; do
  curl -s "$NR_BASE/alerts?status=open&since=$(date -u -d '5 minutes ago' +%Y-%m-%dT%H:%M:%SZ)" \
    -H "X-API-Key: $NR_KEY" | jq '.data[] | "\(.severity): \(.title)"'
  sleep 300
done
```
