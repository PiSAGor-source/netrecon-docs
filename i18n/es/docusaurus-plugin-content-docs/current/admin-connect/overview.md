---
sidebar_position: 1
title: Descripción General de Admin Connect
description: Aplicación móvil de gestión para la administración de la flota de sondas NetRecon
---

# Admin Connect

Admin Connect es la aplicación móvil de gestión para controlar y monitorear su flota de sondas NetRecon. Se conecta a las sondas a través de Cloudflare Tunnel para acceso remoto seguro desde cualquier lugar.

## Características Principales

- **Gestión de Flota** — gestione múltiples sondas desde una sola aplicación
- **Monitoreo Remoto** — vea el estado de la sonda, resultados de escaneo y alertas en tiempo real
- **Alertas IDS** — reciba y revise alertas de Suricata IDS
- **Escaneo de Vulnerabilidades** — active y revise escaneos de vulnerabilidades Nuclei
- **Captura PCAP** — inicie/detenga la captura de paquetes de forma remota
- **Monitoreo de Honeypot** — monitoree interacciones con el honeypot y comportamiento de atacantes
- **Detección de Rogue** — reciba alertas de actividad DHCP/ARP rogue
- **Monitor de Red** — rastree latencia y pérdida de paquetes en su red
- **WireGuard VPN** — gestione conexiones VPN a las sondas
- **Integración de Tickets** — cree y gestione tickets de soporte
- **SSO/2FA** — autenticación empresarial con inicio de sesión único y autenticación de dos factores
- **Acceso Basado en Roles** — permisos granulares por rol de usuario

## Cómo Funciona

Admin Connect **no** tiene su propio motor de escaneo. Es puramente una interfaz de gestión remota para las sondas NetRecon.

```
┌──────────────┐       HTTPS/WSS        ┌─────────────────┐
│ Admin Connect├───────────────────────►│ Cloudflare Tunnel│
│   (Móvil)    │   (vía Cloudflare)      │                 │
└──────────────┘                         └────────┬────────┘
                                                  │
                                         ┌────────▼────────┐
                                         │  NetRecon Probe  │
                                         │  (REST + WS API) │
                                         └─────────────────┘
```

Toda la comunicación entre Admin Connect y la sonda está cifrada mediante:
- **HTTPS** para llamadas API REST
- **WebSocket Secure (WSS)** para eventos en tiempo real
- **mTLS** para autenticación mutua de certificados

## Primeros Pasos

1. Instale Admin Connect desde Google Play Store (paquete: `com.netreconapp.connect`)
2. Abra la aplicación y cree su cuenta o inicie sesión con SSO
3. Agregue una sonda usando uno de estos métodos:
   - **Código QR** — escanee el código QR del asistente de configuración o dashboard de la sonda
   - **Manual** — ingrese la URL del túnel de la sonda y el token de autenticación
4. La sonda aparecerá en su dashboard de flota

Consulte [Inscripción](./enrollment.md) para instrucciones detalladas de configuración.

## Eventos en Tiempo Real

Admin Connect mantiene una conexión WebSocket persistente con cada sonda. Recibe notificaciones instantáneas para:

| Evento | Descripción |
|---|---|
| `ids_alert` | Suricata IDS activó una regla |
| `honeypot_hit` | Un atacante interactuó con el honeypot |
| `rogue_detected` | DHCP rogue o ARP spoofing detectado |
| `vuln_found` | El escaneo de vulnerabilidades encontró un resultado |
| `host_found` | Nuevo dispositivo descubierto en la red |
| `baseline_diff_alert` | Desviación de la línea base de red detectada |
| `probe_health_alert` | Umbral de CPU, RAM o disco de la sonda excedido |
| `pcap_ready` | Archivo de captura PCAP listo para descarga |
| `dns_threat` | Sinkhole DNS bloqueó una amenaza |

## Acciones Soportadas

Desde Admin Connect, puede remotamente:

- Iniciar/detener escaneos de red
- Ver y exportar resultados de escaneo
- Iniciar/detener captura PCAP y descargar archivos
- Habilitar/deshabilitar monitoreo IDS
- Activar escaneos de vulnerabilidades
- Configurar y gestionar el honeypot
- Configurar detección de DHCP/ARP rogue
- Configurar reglas de sinkhole DNS
- Gestionar conexiones WireGuard VPN
- Crear instantáneas de respaldo
- Restaurar desde respaldo
- Ver estado del sistema y uso de recursos
- Gestionar cuentas de usuario y roles

## Preguntas Frecuentes

**P: ¿Admin Connect puede funcionar sin internet?**
R: Admin Connect requiere acceso a internet para comunicarse con la sonda vía Cloudflare Tunnel. Para acceso en red local, use el dashboard web de la sonda directamente.

**P: ¿Cuántas sondas puedo gestionar?**
R: No hay límite en el número de sondas. Admin Connect soporta gestión de flota a escala empresarial.

**P: ¿Admin Connect está disponible para iOS?**
R: Una versión para iOS está planificada. Actualmente, Admin Connect está disponible para Android.

Para ayuda adicional, contacte a [support@netreconapp.com](mailto:support@netreconapp.com).
