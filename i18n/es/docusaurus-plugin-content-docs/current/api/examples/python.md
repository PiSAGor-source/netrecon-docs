---
sidebar_position: 1
title: Ejemplos Python
---

# Ejemplos de API con Python

## Instalación

```bash
pip install requests
```

## Autenticación

### Usando una Clave de API

```python
import requests

API_KEY = "nr_live_xxxxxxxxxxxx"
BASE = "https://api.netreconapp.com/api/v1"
headers = {"X-API-Key": API_KEY}
```

### Usando JWT

```python
import requests

BASE = "https://api.netreconapp.com/api/v1"

# Inicio de sesión
auth = requests.post(f"{BASE}/auth/login", json={
    "email": "user@company.com",
    "password": "su-contraseña"
}).json()

headers = {"Authorization": f"Bearer {auth['access_token']}"}
```

## Iniciar un Escaneo

```python
import requests
import time

API_KEY = "nr_live_xxxxxxxxxxxx"
BASE = "https://api.netreconapp.com/api/v1"
headers = {"X-API-Key": API_KEY}

# Iniciar escaneo
scan = requests.post(f"{BASE}/scans/start", headers=headers, json={
    "target": "192.168.1.0/24",
    "profile": "normal"
}).json()

print(f"Escaneo iniciado: {scan['id']}")

# Esperar finalización
while True:
    status = requests.get(f"{BASE}/scans/{scan['id']}", headers=headers).json()
    print(f"Progreso: {status['progress_percent']}%")
    if status["status"] in ("completed", "failed"):
        break
    time.sleep(10)

# Obtener resultados
result = requests.get(f"{BASE}/scans/{scan['id']}/result", headers=headers).json()
print(f"Dispositivos encontrados: {result['devices_found']}")
```

## Listar Dispositivos

```python
devices = requests.get(f"{BASE}/devices", headers=headers).json()
for d in devices["data"]:
    print(f"{d['ip']} - {d['hostname']} - {d['vendor']}")
```

## Obtener Coincidencias CVE

```python
affected = requests.get(f"{BASE}/cve/affected", headers=headers).json()
for match in affected["data"]:
    print(f"{match['cve_id']} (CVSS {match['cvss_score']}) -> {match['device_ip']}")
```

## Gestionar Alertas

```python
# Obtener alertas abiertas altas/críticas
alerts = requests.get(f"{BASE}/alerts", headers=headers, params={
    "status": "open",
    "severity": "high"
}).json()

for a in alerts["data"]:
    print(f"[{a['severity'].upper()}] {a['title']}")

# Confirmar una alerta
requests.post(f"{BASE}/alerts/{alerts['data'][0]['id']}/acknowledge", headers=headers)
```

## Eventos en Tiempo Real por WebSocket

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

## Crear una Clave de API

```python
new_key = requests.post(f"{BASE}/api-keys", headers=headers, json={
    "name": "Pipeline CI/CD",
    "permissions": ["scans_read", "scans_write", "devices_read"],
    "expires_in_days": 90
}).json()

print(f"Clave: {new_key['key']}")  # Guárdela — se muestra solo una vez!
print(f"ID: {new_key['id']}")
```

## Exportar Dispositivos a CSV

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

print(f"Exportados {len(devices['data'])} dispositivos a devices.csv")
```

## Manejo de Errores

```python
import requests

def api_request(method, path, **kwargs):
    """Realizar una solicitud de API con manejo de errores."""
    url = f"{BASE}{path}"
    resp = requests.request(method, url, headers=headers, **kwargs)

    if resp.status_code == 429:
        retry_after = int(resp.headers.get("Retry-After", 60))
        print(f"Límite de tasa alcanzado. Reintentar después de {retry_after}s")
        time.sleep(retry_after)
        return api_request(method, path, **kwargs)

    resp.raise_for_status()
    return resp.json()

# Uso
devices = api_request("GET", "/devices")
```
