---
sidebar_position: 1
title: Descripción General de IPAM
description: Gestión de Direcciones IP con seguimiento de subredes y monitoreo de utilización
---

# IPAM — Gestión de Direcciones IP

NetRecon IPAM proporciona seguimiento centralizado de direcciones IP y gestión de subredes. Monitoree la utilización de subredes, rastree asignaciones de IP y mantenga un inventario preciso del espacio de direcciones de su red.

## Características Principales

- **Gestión de Subredes** — defina y organice subredes con soporte completo de notación CIDR
- **Seguimiento de IP** — rastree asignaciones individuales de IP con estado y metadatos
- **Monitoreo de Utilización** — porcentajes de utilización de subredes en tiempo real y alertas
- **Integración con Escaneos** — importe IPs descubiertas directamente desde los resultados de escaneo
- **Detección de Conflictos** — identifique direcciones IP duplicadas y subredes superpuestas
- **Sincronización OUI** — asocie automáticamente direcciones MAC con datos del fabricante
- **Historial** — rastree cambios en asignaciones de IP a lo largo del tiempo
- **Exportación** — exporte datos IP como CSV o JSON

## Arquitectura

IPAM se ejecuta como un servicio dedicado en el probe (puerto 8009) con un backend PostgreSQL:

```
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│  Dashboard   │  HTTP  │    IPAM      │  SQL   │  PostgreSQL  │
│  (Browser)   ├────────►  Service     ├────────►  Database    │
│              │        │   :8009      │        │              │
└──────────────┘        └──────┬───────┘        └──────────────┘
                               │
                        ┌──────▼───────┐
                        │ Scan Engine  │
                        │ (IP import)  │
                        └──────────────┘
```

## Conceptos

### Subredes

Una subred representa un rango de direcciones IP definido por notación CIDR (ej., `192.168.1.0/24`). Cada subred tiene:

| Campo | Descripción |
|---|---|
| CIDR | Dirección de red en notación CIDR |
| Nombre | Nombre descriptivo (ej., "LAN de Oficina") |
| VLAN | ID de VLAN asociado (opcional) |
| Gateway | IP del gateway predeterminado |
| DNS | Servidores DNS para esta subred |
| Descripción | Descripción de texto libre |
| Ubicación | Ubicación física o lógica |

### Direcciones IP

Cada dirección IP dentro de una subred puede ser rastreada con:

| Campo | Descripción |
|---|---|
| Dirección IP | La dirección IPv4 o IPv6 |
| Estado | Disponible, Asignada, Reservada, DHCP |
| Nombre de Host | Nombre de host del dispositivo |
| Dirección MAC | Dirección MAC asociada |
| Fabricante | Autocompletado desde la base de datos OUI |
| Propietario | Usuario o departamento asignado |
| Última Vez Visto | Marca de tiempo de la última actividad de red |
| Notas | Notas de texto libre |

### Utilización

La utilización de subred se calcula como:

```
Utilización = (Asignadas + Reservadas + DHCP) / Total de IPs Utilizables * 100%
```

Se pueden configurar alertas cuando la utilización supera un umbral (predeterminado: 80%).

## Primeros Pasos

### Paso 1: Crear una Subred

1. Navegue a **IPAM > Subredes** en el panel del probe
2. Haga clic en **Agregar Subred**
3. Ingrese el CIDR (ej., `10.0.1.0/24`)
4. Complete los campos opcionales (nombre, VLAN, gateway, etc.)
5. Haga clic en **Guardar**

### Paso 2: Importar IPs desde Escaneo

La forma más rápida de poblar IPAM es importar desde un escaneo completado:

1. Navegue a **IPAM > Subredes**
2. Seleccione su subred
3. Haga clic en **Importar desde Escaneo**
4. Seleccione el resultado de escaneo desde el cual importar
5. Revise las IPs que se importarán
6. Haga clic en **Importar**

Consulte [Importar desde Escaneo](./import-from-scan.md) para instrucciones detalladas.

### Paso 3: Gestionar Asignaciones de IP

1. Haga clic en una subred para ver sus direcciones IP
2. Haga clic en una IP para ver/editar sus detalles
3. Cambie el estado, agregue notas, asigne a un propietario
4. Haga clic en **Guardar**

### Paso 4: Monitorear Utilización

1. Navegue a **IPAM > Panel**
2. Vea los gráficos de utilización de subredes
3. Configure alertas para alta utilización en **IPAM > Configuración > Alertas**

## Organización de Subredes

Las subredes pueden organizarse jerárquicamente:

```
10.0.0.0/16          (Red Corporativa)
├── 10.0.1.0/24      (Sede - LAN de Oficina)
├── 10.0.2.0/24      (Sede - VLAN de Servidores)
├── 10.0.3.0/24      (Sede - Wi-Fi)
├── 10.0.10.0/24     (Sucursal 1 - Oficina)
├── 10.0.11.0/24     (Sucursal 1 - Servidores)
└── 10.0.20.0/24     (Sucursal 2 - Oficina)
```

Las relaciones padre/hijo se establecen automáticamente basándose en la contención CIDR.

## Soporte IPv6

IPAM soporta tanto direcciones IPv4 como IPv6:
- Notación CIDR completa para subredes IPv6
- Seguimiento de direcciones IPv6 con los mismos campos que IPv4
- Los dispositivos de doble pila muestran ambas direcciones vinculadas

## Preguntas Frecuentes

**P: ¿Puedo importar subredes desde un archivo CSV?**
R: Sí. Navegue a **IPAM > Importar** y suba un archivo CSV con las columnas: CIDR, Nombre, VLAN, Gateway, Descripción. Una plantilla CSV está disponible para descargar en la página de importación.

**P: ¿Con qué frecuencia se actualizan los datos de utilización?**
R: La utilización se recalcula cada vez que cambia el estado de una IP y de forma programada (cada 5 minutos por defecto).

**P: ¿IPAM se integra con servidores DHCP?**
R: IPAM puede importar datos de arrendamientos DHCP para rastrear IPs asignadas dinámicamente. Configure la conexión del servidor DHCP en **IPAM > Configuración > Integración DHCP**.

**P: ¿Pueden múltiples usuarios editar datos de IPAM simultáneamente?**
R: Sí. IPAM usa bloqueo optimista para prevenir conflictos. Si dos usuarios editan la misma dirección IP, el segundo guardado mostrará una advertencia de conflicto con la opción de fusionar o sobrescribir.

Para ayuda adicional, contacte a [support@netreconapp.com](mailto:support@netreconapp.com).
