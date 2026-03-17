---
sidebar_position: 2
title: Ejemplos cURL
---

# Ejemplos de API con cURL

Todos los ejemplos asumen que ha configurado su clave de API o token:

```bash
# Opción A: Clave de API
export NR_KEY="nr_live_xxxxxxxxxxxx"
export NR_AUTH="-H 'X-API-Key: $NR_KEY'"

# Opción B: Token JWT
export NR_TOKEN="eyJhbGciOi..."
export NR_AUTH="-H 'Authorization: Bearer $NR_TOKEN'"

export NR_BASE="https://api.netreconapp.com/api/v1"
```

## Autenticación

### Inicio de Sesión

```bash
curl -X POST "$NR_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@company.com",
    "password": "su-contraseña"
  }'
```

### Inicio de Sesión con 2FA

```bash
curl -X POST "$NR_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@company.com",
    "password": "su-contraseña",
    "totp_code": "123456"
  }'
```

## Escaneo

### Iniciar un Escaneo

```bash
curl -X POST "$NR_BASE/scans/start" \
  -H "X-API-Key: $NR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "target": "192.168.1.0/24",
    "profile": "normal"
  }'
```

### Verificar Estado del Escaneo

```bash
curl "$NR_BASE/scans/SCAN_ID" \
  -H "X-API-Key: $NR_KEY"
```

### Obtener Resultados del Escaneo

```bash
curl "$NR_BASE/scans/SCAN_ID/result" \
  -H "X-API-Key: $NR_KEY"
```

### Detener un Escaneo

```bash
curl -X POST "$NR_BASE/scans/SCAN_ID/stop" \
  -H "X-API-Key: $NR_KEY"
```

## Dispositivos

### Listar Todos los Dispositivos

```bash
curl "$NR_BASE/devices" \
  -H "X-API-Key: $NR_KEY"
```

### Filtrar por Sitio

```bash
curl "$NR_BASE/devices?site_id=SITE_UUID&is_online=true" \
  -H "X-API-Key: $NR_KEY"
```

### Obtener Detalles del Dispositivo

```bash
curl "$NR_BASE/devices/DEVICE_ID" \
  -H "X-API-Key: $NR_KEY"
```

### Obtener Puertos del Dispositivo

```bash
curl "$NR_BASE/devices/DEVICE_ID/ports" \
  -H "X-API-Key: $NR_KEY"
```

## Alertas

### Listar Alertas Abiertas

```bash
curl "$NR_BASE/alerts?status=open&severity=high" \
  -H "X-API-Key: $NR_KEY"
```

### Confirmar una Alerta

```bash
curl -X POST "$NR_BASE/alerts/ALERT_ID/acknowledge" \
  -H "X-API-Key: $NR_KEY"
```

### Resolver una Alerta

```bash
curl -X POST "$NR_BASE/alerts/ALERT_ID/resolve" \
  -H "X-API-Key: $NR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"resolution_note": "Regla de firewall actualizada"}'
```

## Inteligencia CVE

### Obtener Dispositivos Afectados

```bash
curl "$NR_BASE/cve/affected?cvss_min=7.0" \
  -H "X-API-Key: $NR_KEY"
```

### Buscar CVEs

```bash
curl "$NR_BASE/cve/search?q=apache+log4j" \
  -H "X-API-Key: $NR_KEY"
```

## Gestión de Claves de API

### Crear una Clave de API

```bash
curl -X POST "$NR_BASE/api-keys" \
  -H "X-API-Key: $NR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Script de Monitoreo",
    "permissions": ["scans_read", "devices_read", "alerts_read"],
    "expires_in_days": 90
  }'
```

### Listar Claves de API

```bash
curl "$NR_BASE/api-keys" \
  -H "X-API-Key: $NR_KEY"
```

### Revocar una Clave de API

```bash
curl -X DELETE "$NR_BASE/api-keys/KEY_UUID" \
  -H "X-API-Key: $NR_KEY"
```

## IDS

### Obtener Alertas IDS

```bash
curl "$NR_BASE/ids/alerts" \
  -H "X-API-Key: $NR_KEY"
```

### Iniciar IDS

```bash
curl -X POST "$NR_BASE/ids/start" \
  -H "X-API-Key: $NR_KEY"
```

## Respaldos

### Listar Respaldos

```bash
curl "$NR_BASE/backup/list" \
  -H "X-API-Key: $NR_KEY"
```

### Ejecutar un Respaldo

```bash
curl -X POST "$NR_BASE/backup/run" \
  -H "X-API-Key: $NR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"type": "full"}'
```

## Paginación

### Navegar por los Resultados

```bash
# Página 1
curl "$NR_BASE/devices?page=1&per_page=50" \
  -H "X-API-Key: $NR_KEY"

# Página 2
curl "$NR_BASE/devices?page=2&per_page=50" \
  -H "X-API-Key: $NR_KEY"
```

## Recetas Útiles

### Exportar Todos los Dispositivos como JSON

```bash
curl -s "$NR_BASE/devices?per_page=1000" \
  -H "X-API-Key: $NR_KEY" | jq '.data' > devices.json
```

### Contar Alertas Abiertas por Severidad

```bash
curl -s "$NR_BASE/alerts?status=open&per_page=1" \
  -H "X-API-Key: $NR_KEY" | jq '.meta.total'
```

### Vigilar Nuevas Alertas (polling)

```bash
while true; do
  curl -s "$NR_BASE/alerts?status=open&since=$(date -u -d '5 minutes ago' +%Y-%m-%dT%H:%M:%SZ)" \
    -H "X-API-Key: $NR_KEY" | jq '.data[] | "\(.severity): \(.title)"'
  sleep 300
done
```
