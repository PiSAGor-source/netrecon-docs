---
sidebar_position: 1
title: Descripción General de CMod
description: Gestión de configuración de dispositivos de red vía SSH y consola serial
---

# CMod — Gestión de Configuración

CMod (Módulo de Configuración) le permite gestionar las configuraciones de dispositivos de red directamente desde el panel de NetRecon. Conéctese a switches, routers, firewalls y otros dispositivos de red vía SSH o consola serial para ejecutar comandos, aplicar plantillas y rastrear cambios de configuración.

## Características Principales

- **Conexiones SSH** — conéctese a cualquier dispositivo de red por SSH
- **Consola Serial** — conéctese a dispositivos mediante adaptador USB a serial para acceso fuera de banda
- **Plantillas de Comandos** — plantillas de comandos predefinidas y personalizadas para operaciones comunes
- **Operaciones Masivas** — ejecute comandos en múltiples dispositivos simultáneamente
- **Terminal en Tiempo Real** — terminal interactiva basada en WebSocket en su navegador
- **Respaldo de Configuración** — guarde configuraciones activas automáticamente
- **Seguimiento de Cambios** — seguimiento basado en diferencias de los cambios de configuración a lo largo del tiempo

## Arquitectura

CMod se ejecuta como un servicio dedicado en el probe (puerto 8008) y se conecta a los dispositivos de red en su nombre:

```
┌──────────┐    WebSocket     ┌──────────┐    SSH/Serial    ┌──────────────┐
│ Dashboard ├─────────────────► CMod     ├──────────────────► Network      │
│ (Browser) │                 │ Service  │                  │ Device       │
└──────────┘                  │ :8008    │                  │ (Switch/     │
                              └──────────┘                  │  Router/FW)  │
                                                            └──────────────┘
```

## Dispositivos Compatibles

CMod es compatible con cualquier dispositivo que acepte conexiones SSH o consola serial. Probado y optimizado para:

| Fabricante | Tipos de Dispositivo | SSH | Serial |
|---|---|---|---|
| Cisco | IOS, IOS-XE, NX-OS, ASA | Sí | Sí |
| Juniper | Junos | Sí | Sí |
| HP/Aruba | ProCurve, ArubaOS-Switch, ArubaOS-CX | Sí | Sí |
| MikroTik | RouterOS | Sí | Sí |
| Ubiquiti | EdgeOS, UniFi | Sí | No |
| Fortinet | FortiOS | Sí | Sí |
| Palo Alto | PAN-OS | Sí | Sí |
| Linux | Cualquier sistema con SSH habilitado | Sí | Sí |

## Primeros Pasos

### Paso 1: Agregar un Dispositivo

1. Navegue a **CMod > Dispositivos** en el panel del probe
2. Haga clic en **Agregar Dispositivo**
3. Ingrese los detalles del dispositivo:
   - **Nombre**: un identificador descriptivo (ej., "Switch Principal 1")
   - **Dirección IP**: la IP de gestión del dispositivo
   - **Tipo de Dispositivo**: seleccione de la lista de fabricantes
   - **Tipo de Conexión**: SSH o Serial
4. Ingrese las credenciales (almacenadas cifradas en la base de datos local del probe)
5. Haga clic en **Guardar y Probar** para verificar la conectividad

### Paso 2: Conectarse a un Dispositivo

1. Haga clic en un dispositivo en la lista de dispositivos de CMod
2. Seleccione **Terminal** para una sesión interactiva, o **Ejecutar Plantilla** para un conjunto de comandos predefinido
3. La terminal se abre en su navegador con una conexión en vivo al dispositivo

### Paso 3: Aplicar una Plantilla

1. Seleccione un dispositivo y haga clic en **Ejecutar Plantilla**
2. Elija una plantilla de la biblioteca (ej., "Mostrar Configuración Activa", "Mostrar Interfaces")
3. Revise los comandos que se ejecutarán
4. Haga clic en **Ejecutar**
5. Vea la salida en tiempo real

Consulte [Modo SSH](./ssh-mode.md) y [Modo Serial](./serial-mode.md) para guías detalladas de conexión.

## Plantillas de Comandos

Las plantillas son conjuntos reutilizables de comandos organizados por tipo de dispositivo:

### Plantillas Integradas

| Plantilla | Cisco IOS | Junos | ArubaOS | FortiOS |
|---|---|---|---|---|
| Mostrar configuración activa | `show run` | `show config` | `show run` | `show full-config` |
| Mostrar interfaces | `show ip int brief` | `show int terse` | `show int brief` | `get system interface` |
| Mostrar tabla de enrutamiento | `show ip route` | `show route` | `show ip route` | `get router info routing` |
| Mostrar tabla ARP | `show arp` | `show arp` | `show arp` | `get system arp` |
| Mostrar tabla MAC | `show mac add` | `show eth-switch table` | `show mac-address` | `get system arp` |
| Guardar configuración | `write memory` | `commit` | `write memory` | `execute backup config` |

### Plantillas Personalizadas

Cree sus propias plantillas:

1. Navegue a **CMod > Plantillas**
2. Haga clic en **Crear Plantilla**
3. Seleccione el tipo de dispositivo destino
4. Ingrese la secuencia de comandos (un comando por línea)
5. Agregue variables para valores dinámicos (ej., `{{interface}}`, `{{vlan_id}}`)
6. Guarde la plantilla

## Preguntas Frecuentes

**P: ¿Las credenciales de los dispositivos se almacenan de forma segura?**
R: Sí. Todas las credenciales se cifran en reposo en la base de datos SQLite local del probe usando cifrado AES-256. Las credenciales nunca se transmiten en texto plano.

**P: ¿Puedo usar CMod sin un probe?**
R: No. CMod se ejecuta como un servicio en el hardware del probe. Requiere que el probe esté en la misma red que los dispositivos destino (o tenga enrutamiento hacia ellos).

**P: ¿CMod soporta SNMP?**
R: CMod se enfoca en la gestión basada en CLI (SSH y serial). El monitoreo SNMP es manejado por el motor de monitoreo de red del probe.

Para ayuda adicional, contacte a [support@netreconapp.com](mailto:support@netreconapp.com).
