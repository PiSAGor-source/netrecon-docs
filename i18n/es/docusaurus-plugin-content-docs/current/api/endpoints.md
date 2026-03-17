---
sidebar_position: 2
title: Referencia de Endpoints
description: Referencia completa de endpoints de API agrupados por servicio y categoría
---

# Referencia de Endpoints

Esta página lista todos los endpoints de la API REST en la plataforma NetRecon, agrupados por categoría de servicio. Todos los endpoints requieren autenticación con token JWT Bearer a menos que se indique lo contrario. Consulte la [Descripción General de la API](./overview.md) para detalles de autenticación y limitación de tasa.

**URL Base:** `https://probe.netreconapp.com/api/`

---

## Endpoints de la Sonda

Servidos por el backend Go ejecutándose en el dispositivo sonda (Orange Pi R2S, Raspberry Pi o mini PC x86_64).

### Estado de Salud

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/api/health` | No | Verificación de salud de la sonda. Devuelve `{"status": "ok", "version": "1.0.0"}`. |

### Escaneo

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/scan/discover` | Iniciar descubrimiento de hosts ARP en la subred configurada. |
| `POST` | `/api/scan/ports` | Iniciar escaneo de puertos contra hosts descubiertos. |
| `GET` | `/api/scan/status` | Obtener estado actual del escaneo (inactivo, ejecutando, completado). |

### Dispositivos

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/devices` | Listar todos los dispositivos descubiertos. Soporta paginación (`?page=&per_page=`). |
| `GET` | `/api/devices/:mac` | Obtener detalles de un solo dispositivo por dirección MAC. |
| `PUT` | `/api/devices/:mac/note` | Actualizar la nota del usuario en un dispositivo. Cuerpo: `{"note": "..."}`. |

### Línea Base

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/baseline` | Listar todas las líneas base de red guardadas. |
| `POST` | `/api/baseline` | Crear una nueva instantánea de línea base desde la lista actual de dispositivos. |
| `GET` | `/api/baseline/:id/diff` | Comparar una línea base con el estado actual de la red. |

### Vecinos (CDP/LLDP)

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/neighbors` | Listar vecinos CDP/LLDP descubiertos. |
| `POST` | `/api/neighbors/start` | Iniciar el listener de descubrimiento de vecinos. |

### Respaldo de Configuración (local de la sonda)

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/config/targets` | Listar dispositivos objetivo de respaldo configurados. |
| `POST` | `/api/config/targets` | Agregar un nuevo dispositivo objetivo de respaldo. |
| `POST` | `/api/config/targets/:id/check` | Activar una verificación inmediata de configuración para un objetivo. |

### Captura PCAP

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/pcap/start` | Iniciar captura de paquetes. Cuerpo: `{"interface": "eth0", "filter": "tcp port 80"}`. |
| `POST` | `/api/pcap/stop` | Detener la captura de paquetes en ejecución. |
| `GET` | `/api/pcap/files` | Listar archivos de captura PCAP disponibles. |
| `GET` | `/api/pcap/download/:id` | Descargar un archivo PCAP por ID. Devuelve `application/octet-stream`. |

### IDS (Suricata)

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/ids/status` | Obtener estado del servicio IDS (ejecutando, detenido, conteo de reglas). |
| `POST` | `/api/ids/start` | Iniciar monitoreo de Suricata IDS. |
| `POST` | `/api/ids/stop` | Detener monitoreo IDS. |
| `GET` | `/api/ids/alerts` | Listar alertas IDS. Soporta filtro temporal `?since=24h`. |

### Escaneo de Vulnerabilidades (Nuclei)

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/vuln/scan` | Iniciar escaneo de vulnerabilidades contra objetivos especificados. |
| `POST` | `/api/vuln/stop` | Detener el escaneo de vulnerabilidades en ejecución. |
| `GET` | `/api/vuln/results` | Obtener resultados del escaneo de vulnerabilidades. |
| `GET` | `/api/vuln/status` | Obtener estado del escáner de vulnerabilidades. |

### Honeypot

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/honeypot/status` | Obtener estado del servicio honeypot. |
| `POST` | `/api/honeypot/start` | Iniciar el servicio honeypot. |
| `POST` | `/api/honeypot/stop` | Detener el servicio honeypot. |
| `GET` | `/api/honeypot/hits` | Listar eventos de interacción con el honeypot. |

### Detección Rogue

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/rogue/status` | Obtener estado del servicio de detección rogue. |
| `POST` | `/api/rogue/start` | Iniciar detección de DHCP/ARP rogue. |
| `POST` | `/api/rogue/stop` | Detener detección rogue. |
| `GET` | `/api/rogue/alerts` | Listar alertas de DHCP rogue y ARP spoofing. |

### Monitor de Red

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/monitor/targets` | Agregar un objetivo de monitoreo (IP o nombre de host). |
| `GET` | `/api/monitor/targets` | Listar objetivos de monitoreo configurados. |
| `POST` | `/api/monitor/start` | Iniciar monitoreo de red. |
| `POST` | `/api/monitor/stop` | Detener monitoreo de red. |
| `GET` | `/api/monitor/latency` | Obtener mediciones de latencia para objetivos monitoreados. |
| `GET` | `/api/monitor/packetloss` | Obtener datos de pérdida de paquetes para objetivos monitoreados. |
| `GET` | `/api/monitor/status` | Obtener estado del servicio de monitoreo. |

### VPN (WireGuard)

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/vpn/setup` | Configurar parámetros de WireGuard VPN. |
| `GET` | `/api/vpn/status` | Obtener estado de la conexión VPN. |
| `POST` | `/api/vpn/start` | Iniciar el túnel VPN. |
| `POST` | `/api/vpn/stop` | Detener el túnel VPN. |
| `GET` | `/api/vpn/config` | Descargar la configuración de WireGuard. |

### Sinkhole DNS

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/dns/status` | Obtener estado del servicio de sinkhole DNS. |
| `POST` | `/api/dns/start` | Iniciar el sinkhole DNS. |
| `POST` | `/api/dns/stop` | Detener el sinkhole DNS. |
| `GET` | `/api/dns/threats` | Listar entradas de amenazas DNS bloqueadas. |

### Salud del Sistema

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/system/health` | Salud detallada del sistema (CPU, RAM, disco, temperatura). |
| `GET` | `/api/system/history` | Puntos de datos históricos de salud del sistema. |
| `GET` | `/api/system/alerts` | Listar alertas de umbral de salud del sistema. |
| `POST` | `/api/system/thresholds` | Configurar umbrales de alerta de salud (% CPU, % RAM, % disco). |

### Respaldo y Restauración

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/backup/create` | Crear un respaldo completo de la sonda (configuración + base de datos). |
| `GET` | `/api/backup/list` | Listar archivos de respaldo disponibles. |
| `GET` | `/api/backup/download/:id` | Descargar un archivo de respaldo. Devuelve `application/octet-stream`. |
| `POST` | `/api/backup/restore` | Restaurar la sonda desde un archivo de respaldo. |

### Tickets

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/ticketing/config` | Obtener configuración actual de integración de tickets. |
| `POST` | `/api/ticketing/config` | Establecer configuración de tickets (ServiceNow, Jira, URL de webhook). |
| `POST` | `/api/ticketing/test` | Enviar un ticket de prueba para validar la integración. |
| `POST` | `/api/ticketing/create` | Crear un ticket desde una alerta o evento. |
| `GET` | `/api/ticketing/history` | Listar tickets creados anteriormente. |

### WebSocket

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/ws/events` | Conexión WebSocket para eventos en tiempo real de la sonda. Pase el token vía consulta: `?token=<jwt>`. |

#### Tipos de Evento WebSocket

| Evento | Descripción |
|---|---|
| `host_found` | Nuevo dispositivo descubierto |
| `port_found` | Puerto abierto detectado en un dispositivo |
| `scan_complete` | Escaneo de red finalizado |
| `neighbor_discovered` | Vecino CDP/LLDP encontrado |
| `config_changed` | Configuración de dispositivo cambiada |
| `baseline_diff_alert` | Desviación de línea base de red detectada |
| `ids_alert` | Regla IDS activada |
| `honeypot_hit` | Interacción con honeypot detectada |
| `rogue_detected` | Actividad DHCP o ARP rogue |
| `pcap_ready` | Archivo PCAP listo para descarga |
| `vuln_found` | Vulnerabilidad descubierta |
| `dns_threat` | Amenaza DNS bloqueada |
| `probe_health_alert` | Umbral de recursos de la sonda excedido |
| `error` | Evento de error |

---

## Endpoints del API Gateway

Servidos por el API Gateway FastAPI (puerto 8000). Maneja autenticación, gestión de usuarios, RBAC y enrutamiento proxy a servicios backend.

### Autenticación

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/auth/login` | Autenticar con usuario/contraseña, recibir un token JWT. |
| `POST` | `/api/auth/refresh` | Renovar un token JWT que está por expirar. |

### Usuarios

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/users` | Listar usuarios en la organización. |
| `POST` | `/api/users` | Crear una nueva cuenta de usuario. |
| `GET` | `/api/users/:id` | Obtener detalles del usuario. |
| `PUT` | `/api/users/:id` | Actualizar un usuario. |
| `DELETE` | `/api/users/:id` | Eliminar un usuario. |

### RBAC (Control de Acceso Basado en Roles)

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/rbac/roles` | Listar todos los roles definidos. |
| `POST` | `/api/rbac/roles` | Crear un rol personalizado con permisos específicos. |
| `PUT` | `/api/rbac/roles/:id` | Actualizar permisos de un rol. |
| `DELETE` | `/api/rbac/roles/:id` | Eliminar un rol. |
| `GET` | `/api/rbac/permissions` | Listar todos los permisos disponibles. |

### Claves de API

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/keys` | Listar claves de API para la organización. |
| `POST` | `/api/keys` | Crear una nueva clave de API de larga duración. |
| `DELETE` | `/api/keys/:id` | Revocar una clave de API. |

### Lista de IPs Permitidas

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/ip-allowlist` | Listar rangos de IP permitidos. |
| `POST` | `/api/ip-allowlist` | Agregar una IP o rango CIDR a la lista de permitidos. |
| `DELETE` | `/api/ip-allowlist/:id` | Eliminar un rango de IP de la lista de permitidos. |

### Monitoreo (Proxy Prometheus)

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/monitoring/metrics` | Proxy al endpoint de métricas de Prometheus. |
| `GET` | `/api/monitoring/query` | Proxy de consulta PromQL a Prometheus. |

### Oxidized (Proxy de Respaldo de Configuración)

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/oxidized/nodes` | Listar nodos de red gestionados por Oxidized. |
| `GET` | `/api/oxidized/nodes/:name` | Obtener historial de configuración para un nodo. |
| `POST` | `/api/oxidized/nodes` | Agregar un nodo a la gestión de Oxidized. |

### Configuración de Vault

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/vault/config` | Obtener configuración de integración de vault. |
| `POST` | `/api/vault/config` | Actualizar configuración de integración de vault. |

---

## Endpoints del Servicio IPAM

Servicio de Gestión de Direcciones IP (puerto 8009). Todas las rutas están prefijadas con `/api/v1/ipam`.

### Prefijos (Subredes)

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/v1/ipam/prefixes` | Listar todos los prefijos/subredes gestionados. |
| `POST` | `/api/v1/ipam/prefixes` | Crear un nuevo prefijo. Cuerpo: `prefix` (notación CIDR), `description`, `site`, `status`, opcional `vlan_id`. |
| `GET` | `/api/v1/ipam/prefixes/:id` | Obtener un solo prefijo con porcentaje de utilización recalculado. |
| `PUT` | `/api/v1/ipam/prefixes/:id` | Actualizar un prefijo. |
| `DELETE` | `/api/v1/ipam/prefixes/:id` | Eliminar un prefijo. Devuelve `204 No Content`. |
| `GET` | `/api/v1/ipam/prefixes/:id/available` | Listar IPs no asignadas en el prefijo. Limitado a 256 resultados. |
| `POST` | `/api/v1/ipam/prefixes/:id/next-available` | Asignar la siguiente IP libre en el prefijo. Devuelve el nuevo registro de dirección. |

### Direcciones

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/v1/ipam/addresses` | Listar direcciones. Filtros: `?prefix_id=`, `?status=`, `?vendor=`, `?search=`. Máximo 1000 resultados. |
| `POST` | `/api/v1/ipam/addresses` | Crear un nuevo registro de dirección IP. |
| `GET` | `/api/v1/ipam/addresses/:id` | Obtener una sola dirección por UUID. |
| `PUT` | `/api/v1/ipam/addresses/:id` | Actualizar un registro de dirección. |
| `DELETE` | `/api/v1/ipam/addresses/:id` | Eliminar un registro de dirección. Devuelve `204 No Content`. |
| `POST` | `/api/v1/ipam/addresses/bulk-import` | Upsert masivo de direcciones por IP. Los registros existentes se actualizan, los nuevos se crean. |

### VLANs

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/v1/ipam/vlans` | Listar todas las VLANs, ordenadas por ID de VLAN. |
| `POST` | `/api/v1/ipam/vlans` | Crear un nuevo registro de VLAN. Cuerpo: `vlan_id`, `name`, `description`, `status`. |
| `PUT` | `/api/v1/ipam/vlans/:id` | Actualizar una VLAN. |
| `DELETE` | `/api/v1/ipam/vlans/:id` | Eliminar una VLAN. Devuelve `204 No Content`. |

### Analíticas

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/v1/ipam/stats` | Estadísticas generales de IPAM: total de prefijos, total de direcciones, utilización promedio, conteo de conflictos. |
| `GET` | `/api/v1/ipam/utilization` | Desglose de utilización por prefijo con conteos de direcciones. |
| `GET` | `/api/v1/ipam/conflicts` | Encontrar asignaciones en conflicto (MACs duplicadas con diferentes IPs). |

### Importación / Exportación

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/v1/ipam/import/scan` | Importar dispositivos desde un payload de escaneo NetRecon. Upsert por IP con coincidencia automática de prefijos. |
| `GET` | `/api/v1/ipam/export/csv` | Exportar todas las direcciones como CSV. Devuelve `text/csv` con encabezado `Content-Disposition`. |
| `GET` | `/api/v1/ipam/export/json` | Exportar todos los datos IPAM (prefijos, direcciones, VLANs) como JSON. |

---

## Endpoints del Servicio CMod

Gestión de Configuración bajo Demanda (puerto 8008). Proporciona acceso SSH y consola serial a dispositivos de red. Todas las rutas están prefijadas con `/api/v1/cmod`.

### Sesiones

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/v1/cmod/connect` | Abrir una nueva sesión SSH o serial. Cuerpo: `host`, `device_type`, `username`, `password`, opcionales `port`, `serial_port`. Devuelve información de sesión con `session_id`. |
| `POST` | `/api/v1/cmod/disconnect` | Cerrar una sesión. Consulta: `?session_id=`. |
| `GET` | `/api/v1/cmod/sessions` | Listar todas las sesiones activas. |
| `GET` | `/api/v1/cmod/sessions/:session_id` | Obtener detalles de la sesión y registro completo de comandos. |
| `DELETE` | `/api/v1/cmod/sessions/:session_id` | Terminar una sesión. |

### Comandos

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/v1/cmod/send-command` | Enviar un solo comando. Cuerpo: `session_id`, `command`, opcionales `expect_string`, `read_timeout`. |
| `POST` | `/api/v1/cmod/send-batch` | Enviar múltiples comandos secuencialmente. Cuerpo: `session_id`, `commands[]`, opcional `delay_factor`. |

### Operaciones de Configuración

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/v1/cmod/backup` | Obtener la configuración en ejecución de un dispositivo. Selecciona automáticamente el comando correcto por fabricante (Cisco IOS/NX-OS/XR, Huawei, Juniper, Arista, HP). |
| `POST` | `/api/v1/cmod/rollback` | Enviar un fragmento de configuración al dispositivo en modo de configuración. Cuerpo: `session_id`, `config` (cadena multilínea). |

### Plantillas

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/v1/cmod/templates` | Listar plantillas de comandos. Filtros: `?vendor=cisco_ios`, `?category=backup`. Plantillas pre-cargadas para Cisco IOS, Huawei y Juniper JunOS. |
| `POST` | `/api/v1/cmod/templates` | Crear una plantilla de comandos personalizada. Cuerpo: `name`, `vendor`, `category`, `commands[]`, `description`. |

---

## Endpoints del Agent Registry

Servicio de gestión de agentes (puerto 8006). Maneja inscripción, heartbeats, inventario y despliegue para agentes Windows, macOS y Linux.

### Ciclo de Vida del Agente

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/agents/enroll` | Inscribir un nuevo agente usando un token de despliegue. Cuerpo: `deployment_token`, `hostname`, `os_type`, `os_version`, `arch`, `agent_version`. |
| `POST` | `/agents/heartbeat` | Heartbeat del agente. Encabezados: `X-Agent-ID`, `X-Session-Key`. |
| `POST` | `/agents/inventory` | Enviar inventario de hardware/software. Encabezados: `X-Agent-ID`, `X-Session-Key`. |
| `GET` | `/agents` | Listar todos los agentes en la organización. Encabezado: `X-Org-ID`. |
| `GET` | `/agents/:agent_id` | Obtener detalles completos del agente incluyendo especificaciones de hardware y estado de garantía. |
| `DELETE` | `/agents/:agent_id` | Eliminar un agente del registro. |

### Tokens de Despliegue

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/agents/tokens` | Crear un token de despliegue. Encabezados: `X-Org-ID`, `X-User-ID`. Cuerpo: `expires_in_hours`, `max_uses`, `label`, opcionales `site_id`, `metadata`. Devuelve cadena del token y comandos de instalación específicos por plataforma. |
| `GET` | `/agents/tokens` | Listar tokens de despliegue para la organización. Encabezado: `X-Org-ID`. |
| `DELETE` | `/agents/tokens/:token_id` | Revocar un token de despliegue. |

### Generador de Paquetes de Despliegue

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/agents/deploy/generate` | Generar artefactos de despliegue específicos por plataforma. Cuerpo: `platform` (windows, linux, macos, ios, android), `method` (msi, powershell, sccm, intune, gpo, pkg, brew, jamf, mdm, deb, rpm, bash, docker, qr, email, mdm_app, managed_play), `role`. Devuelve token de inscripción, comandos de instalación, scripts o contenido de manifiesto. |
| `GET` | `/agents/deploy/quota` | Obtener uso de cuota de dispositivos para la organización. Encabezado: `X-Org-ID`. |
| `GET` | `/agents/deploy/platforms` | Listar todas las plataformas soportadas y sus métodos de despliegue disponibles. No requiere autenticación. |

### Conexión Remota

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/agents/:agent_id/remote/request` | Solicitar una nueva sesión remota (RDP, SSH, VNC, ADB) a un agente inscrito. Encabezado: `X-User-ID`. Cuerpo: `session_type`, opcionales `credential_id`, `timeout_hours`. |
| `GET` | `/agents/:agent_id/remote/status` | Obtener estado de preparación remota (estado en línea, IP Headscale, tipos de sesión disponibles). |
| `POST` | `/agents/:agent_id/remote/end` | Finalizar la sesión remota activa de un agente. Encabezado: `X-User-ID`. |
| `GET` | `/remote/sessions` | Listar sesiones remotas para la organización. Encabezado: `X-Org-ID`. Consulta: `?active_only=true` (predeterminado). |
| `POST` | `/agents/:agent_id/remote/ready` | Callback del agente cuando el servicio remoto está preparado. Encabezados: `X-Agent-ID`, `X-Session-Key`. |
| `POST` | `/remote/cleanup` | Expirar sesiones remotas obsoletas. Destinado para uso interno de programador/cron. |

---

## Endpoints del Servicio Diplomat

Servicio de clasificación de correo electrónico y análisis de registros (puerto 8010). Todas las rutas están prefijadas con `/api/v1/diplomat`.

### Clasificación

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/v1/diplomat/classify` | Clasificar texto de entrada (ticket, alerta, correo) en una categoría y nivel de prioridad. |
| `POST` | `/api/v1/diplomat/summarize` | Generar un resumen del texto proporcionado. |
| `POST` | `/api/v1/diplomat/translate` | Traducir texto a un idioma objetivo especificado. |
| `POST` | `/api/v1/diplomat/analyze-log` | Analizar un fragmento de registro y extraer eventos clave, errores y patrones. |

### Pipeline de Correo Electrónico

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/v1/diplomat/emails/stats` | Obtener estadísticas de procesamiento de correo (recibidos, clasificados, respondidos). |
| `GET` | `/api/v1/diplomat/emails/recent` | Listar correos procesados recientemente. |

### Salud

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/api/v1/diplomat/health` | No | Verificación de salud del servicio Diplomat. |

---

## Endpoints de Salud de Servicios

Cada microservicio expone un endpoint `/health` para monitoreo interno y verificaciones de balanceador de carga.

| Servicio | URL | Puerto |
|---|---|---|
| API Gateway | `/health` | 8000 |
| Vault Server | `/health` | 8001 |
| License Server | `/health` | 8002 |
| Email Service | `/health` | 8003 |
| Notification Service | `/health` | 8004 |
| Update Server | `/health` | 8005 |
| Agent Registry | `/health` | 8006 |
| Warranty Service | `/health` | 8007 |
| CMod Service | `/health` | 8008 |
| IPAM Service | `/health` | 8009 |
| Diplomat Service | `/health` | 8010 |

---

## Soporte

Para preguntas o problemas relacionados con la API, contacte a [support@netreconapp.com](mailto:support@netreconapp.com).
