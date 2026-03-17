---
sidebar_position: 1
title: Python-Beispiele
---

# Python API-Beispiele

## Installation

```bash
pip install requests
```

## Authentifizierung

### Mit API-Schlüssel

```python
import requests

API_KEY = "nr_live_xxxxxxxxxxxx"
BASE = "https://api.netreconapp.com/api/v1"
headers = {"X-API-Key": API_KEY}
```

### Mit JWT

```python
import requests

BASE = "https://api.netreconapp.com/api/v1"

# Anmeldung
auth = requests.post(f"{BASE}/auth/login", json={
    "email": "user@company.com",
    "password": "your-password"
}).json()

headers = {"Authorization": f"Bearer {auth['access_token']}"}
```

## Scan starten

```python
import requests
import time

API_KEY = "nr_live_xxxxxxxxxxxx"
BASE = "https://api.netreconapp.com/api/v1"
headers = {"X-API-Key": API_KEY}

# Scan starten
scan = requests.post(f"{BASE}/scans/start", headers=headers, json={
    "target": "192.168.1.0/24",
    "profile": "normal"
}).json()

print(f"Scan gestartet: {scan['id']}")

# Auf Abschluss warten
while True:
    status = requests.get(f"{BASE}/scans/{scan['id']}", headers=headers).json()
    print(f"Fortschritt: {status['progress_percent']}%")
    if status["status"] in ("completed", "failed"):
        break
    time.sleep(10)

# Ergebnisse abrufen
result = requests.get(f"{BASE}/scans/{scan['id']}/result", headers=headers).json()
print(f"Gefundene Geräte: {result['devices_found']}")
```

## Geräte auflisten

```python
devices = requests.get(f"{BASE}/devices", headers=headers).json()
for d in devices["data"]:
    print(f"{d['ip']} - {d['hostname']} - {d['vendor']}")
```

## CVE-Übereinstimmungen abrufen

```python
affected = requests.get(f"{BASE}/cve/affected", headers=headers).json()
for match in affected["data"]:
    print(f"{match['cve_id']} (CVSS {match['cvss_score']}) -> {match['device_ip']}")
```

## Warnungen verwalten

```python
# Offene hohe/kritische Warnungen abrufen
alerts = requests.get(f"{BASE}/alerts", headers=headers, params={
    "status": "open",
    "severity": "high"
}).json()

for a in alerts["data"]:
    print(f"[{a['severity'].upper()}] {a['title']}")

# Warnung bestätigen
requests.post(f"{BASE}/alerts/{alerts['data'][0]['id']}/acknowledge", headers=headers)
```

## WebSocket Echtzeit-Ereignisse

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

## API-Schlüssel erstellen

```python
new_key = requests.post(f"{BASE}/api-keys", headers=headers, json={
    "name": "CI/CD Pipeline",
    "permissions": ["scans_read", "scans_write", "devices_read"],
    "expires_in_days": 90
}).json()

print(f"Schlüssel: {new_key['key']}")  # Jetzt speichern — wird nur einmal angezeigt!
print(f"ID: {new_key['id']}")
```

## Geräte als CSV exportieren

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

print(f"{len(devices['data'])} Geräte nach devices.csv exportiert")
```

## Fehlerbehandlung

```python
import requests

def api_request(method, path, **kwargs):
    """API-Anfrage mit Fehlerbehandlung durchführen."""
    url = f"{BASE}{path}"
    resp = requests.request(method, url, headers=headers, **kwargs)

    if resp.status_code == 429:
        retry_after = int(resp.headers.get("Retry-After", 60))
        print(f"Rate-Limit erreicht. Wiederholung nach {retry_after}s")
        time.sleep(retry_after)
        return api_request(method, path, **kwargs)

    resp.raise_for_status()
    return resp.json()

# Verwendung
devices = api_request("GET", "/devices")
```
