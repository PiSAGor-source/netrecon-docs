---
sidebar_position: 4
title: Dispositivos
---

# API de Dispositivos

Gestione dispositivos de red descubiertos, sus propiedades y relaciones.

## Listar Dispositivos

```
GET /api/v1/devices?page=1&per_page=25
```

### Parámetros de Consulta

| Parámetro | Tipo | Descripción |
|---|---|---|
| `site_id` | string | Filtrar por sitio |
| `is_online` | boolean | Filtrar por estado en línea |
| `vendor` | string | Filtrar por nombre de fabricante |
| `os` | string | Filtrar por SO |
| `search` | string | Buscar nombre de host, IP o MAC |
| `sort` | string | Ordenar por: `ip`, `hostname`, `last_seen`, `vendor` |

Respuesta:
```json
{
  "data": [
    {
      "id": "device-uuid",
      "ip": "192.168.1.10",
      "mac": "AA:BB:CC:DD:EE:FF",
      "hostname": "workstation-01",
      "vendor": "Dell Inc.",
      "os_guess": "Windows 11",
      "device_type": "workstation",
      "is_online": true,
      "first_seen": "2026-01-15T08:30:00Z",
      "last_seen": "2026-03-15T10:30:00Z",
      "site_id": "site-uuid",
      "open_ports": [22, 80, 443, 3389],
      "tags": ["production", "finance-dept"]
    }
  ],
  "meta": {"page": 1, "per_page": 25, "total": 142}
}
```

## Obtener Detalles del Dispositivo

```
GET /api/v1/devices/{device_id}
```

Devuelve el perfil completo del dispositivo incluyendo detalles de puertos, servicios, coincidencias CVE e historial.

## Crear Dispositivo (Manual)

```
POST /api/v1/devices
Content-Type: application/json

{
  "ip": "10.0.0.50",
  "mac": "11:22:33:44:55:66",
  "hostname": "server-db-01",
  "device_type": "server",
  "site_id": "site-uuid",
  "tags": ["database", "production"]
}
```

## Actualizar Dispositivo

```
PUT /api/v1/devices/{device_id}
Content-Type: application/json

{
  "hostname": "server-db-01-renamed",
  "tags": ["database", "production", "critical"]
}
```

## Eliminar Dispositivo

```
DELETE /api/v1/devices/{device_id}
```

## Obtener Puertos del Dispositivo

```
GET /api/v1/devices/{device_id}/ports
```

Respuesta:
```json
{
  "data": [
    {
      "port": 443,
      "protocol": "tcp",
      "state": "open",
      "service": "HTTPS",
      "version": "nginx/1.24.0",
      "banner": "Server: nginx/1.24.0",
      "last_scanned": "2026-03-15T10:30:00Z"
    }
  ]
}
```

## Tipos de Dispositivo

| Tipo | Descripción |
|---|---|
| `workstation` | Escritorio/portátil |
| `server` | Servidor |
| `router` | Router |
| `switch` | Switch de red |
| `firewall` | Firewall |
| `printer` | Impresora |
| `camera` | Cámara IP |
| `phone` | Teléfono VoIP |
| `iot` | Dispositivo IoT |
| `access_point` | Punto de acceso inalámbrico |
| `unknown` | Sin clasificar |
