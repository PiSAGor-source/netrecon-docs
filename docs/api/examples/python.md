---
sidebar_position: 1
title: Python Examples
---

# Python API Examples

## Install

```bash
pip install requests
```

## Authentication

### Using an API Key

```python
import requests

API_KEY = "nr_live_xxxxxxxxxxxx"
BASE = "https://api.netreconapp.com/api/v1"
headers = {"X-API-Key": API_KEY}
```

### Using JWT

```python
import requests

BASE = "https://api.netreconapp.com/api/v1"

# Login
auth = requests.post(f"{BASE}/auth/login", json={
    "email": "user@company.com",
    "password": "your-password"
}).json()

headers = {"Authorization": f"Bearer {auth['access_token']}"}
```

## Start a Scan

```python
import requests
import time

API_KEY = "nr_live_xxxxxxxxxxxx"
BASE = "https://api.netreconapp.com/api/v1"
headers = {"X-API-Key": API_KEY}

# Start scan
scan = requests.post(f"{BASE}/scans/start", headers=headers, json={
    "target": "192.168.1.0/24",
    "profile": "normal"
}).json()

print(f"Scan started: {scan['id']}")

# Wait for completion
while True:
    status = requests.get(f"{BASE}/scans/{scan['id']}", headers=headers).json()
    print(f"Progress: {status['progress_percent']}%")
    if status["status"] in ("completed", "failed"):
        break
    time.sleep(10)

# Get results
result = requests.get(f"{BASE}/scans/{scan['id']}/result", headers=headers).json()
print(f"Devices found: {result['devices_found']}")
```

## List Devices

```python
devices = requests.get(f"{BASE}/devices", headers=headers).json()
for d in devices["data"]:
    print(f"{d['ip']} - {d['hostname']} - {d['vendor']}")
```

## Get CVE Matches

```python
affected = requests.get(f"{BASE}/cve/affected", headers=headers).json()
for match in affected["data"]:
    print(f"{match['cve_id']} (CVSS {match['cvss_score']}) -> {match['device_ip']}")
```

## Manage Alerts

```python
# Get open high/critical alerts
alerts = requests.get(f"{BASE}/alerts", headers=headers, params={
    "status": "open",
    "severity": "high"
}).json()

for a in alerts["data"]:
    print(f"[{a['severity'].upper()}] {a['title']}")

# Acknowledge an alert
requests.post(f"{BASE}/alerts/{alerts['data'][0]['id']}/acknowledge", headers=headers)
```

## WebSocket Real-time Events

```python
import websocket
import json

def on_message(ws, message):
    event = json.loads(message)
    print(f"[{event['event']}] {event['data']}")

ws = websocket.WebSocketApp(
    f"wss://api.netreconapp.com/ws/events?token={auth['access_token']}",
    on_message=on_message
)
ws.run_forever()
```

## Create an API Key

```python
new_key = requests.post(f"{BASE}/api-keys", headers=headers, json={
    "name": "CI/CD Pipeline",
    "permissions": ["scans_read", "scans_write", "devices_read"],
    "expires_in_days": 90
}).json()

print(f"Key: {new_key['key']}")  # Save this — shown only once!
print(f"ID: {new_key['id']}")
```

## Export Devices to CSV

```python
import csv
import io

devices = requests.get(f"{BASE}/devices", headers=headers).json()

output = io.StringIO()
writer = csv.DictWriter(output, fieldnames=["ip", "hostname", "vendor", "os_guess", "is_online"])
writer.writeheader()
for d in devices["data"]:
    writer.writerow({k: d.get(k, "") for k in writer.fieldnames})

with open("devices.csv", "w") as f:
    f.write(output.getvalue())

print(f"Exported {len(devices['data'])} devices to devices.csv")
```

## Error Handling

```python
import requests

def api_request(method, path, **kwargs):
    """Make an API request with error handling."""
    url = f"{BASE}{path}"
    resp = requests.request(method, url, headers=headers, **kwargs)

    if resp.status_code == 429:
        retry_after = int(resp.headers.get("Retry-After", 60))
        print(f"Rate limited. Retry after {retry_after}s")
        time.sleep(retry_after)
        return api_request(method, path, **kwargs)

    resp.raise_for_status()
    return resp.json()

# Usage
devices = api_request("GET", "/devices")
```
