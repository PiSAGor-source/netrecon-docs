---
sidebar_position: 1
title: Descripción General de Agentes
description: Despliegue agentes de monitoreo ligeros en los endpoints
---

# Despliegue de Agentes

Los agentes de NetRecon son programas de monitoreo ligeros instalados en endpoints (estaciones de trabajo, servidores, portátiles) que reportan a la sonda. Los agentes proporcionan visibilidad a nivel de endpoint que el escaneo de red por sí solo no puede lograr.

## Qué Hacen los Agentes

- **Monitoreo de Heartbeat** — verificación regular para confirmar que el endpoint está en línea
- **Inventario de Software** — reportar software instalado y versiones
- **Reporte de Puertos Abiertos** — reportar puertos localmente en escucha desde la perspectiva del endpoint
- **Datos de Interfaz de Red** — reportar todas las NICs, IPs, direcciones MAC y estado del enlace
- **Información del SO** — reportar sistema operativo, versión y nivel de parche
- **Información de Hardware** — CPU, RAM, disco, número de serie
- **Postura de Seguridad** — estado del firewall, estado del antivirus, estado del cifrado

## Plataformas Soportadas

| Plataforma | Formato de Paquete | Versión Mínima |
|---|---|---|
| Windows | Instalador MSI | Windows 10 / Server 2016 |
| macOS | Instalador PKG | macOS 12 (Monterey) |
| Linux (Debian/Ubuntu) | Paquete DEB | Ubuntu 20.04 / Debian 11 |
| Linux (RHEL/Fedora) | Paquete RPM | RHEL 8 / Fedora 36 |

## Arquitectura

```
┌───────────────┐     HTTPS      ┌─────────────────┐
│   Endpoint    │  (heartbeat +  │   Agent         │
│   (Agente)    ├────────────────►  Registry       │
│               │   carga datos) │   :8006         │
└───────────────┘                └────────┬────────┘
                                         │
                                ┌────────▼────────┐
                                │  Dashboard Sonda │
                                │  (Vista agentes) │
                                └─────────────────┘
```

Los agentes se comunican con el servicio Agent Registry (puerto 8006) en la sonda:
- **Heartbeat**: cada 30 segundos (configurable)
- **Reporte completo**: cada 15 minutos (configurable)
- **Protocolo**: HTTPS con autenticación JWT
- **Payload**: JSON, comprimido con gzip

## Métodos de Despliegue

### Instalación Manual
Descargue e instale el paquete del agente directamente en cada endpoint. Ideal para despliegues pequeños o pruebas.

- [Agente Windows](./windows.md)
- [Agente macOS](./macos.md)
- [Agente Linux](./linux.md)

### Despliegue Empresarial
Para implementación a gran escala, despliegue agentes usando sus herramientas de gestión existentes:

| Herramienta | Plataforma | Guía |
|---|---|---|
| SCCM | Windows | [Agente Windows](./windows.md#sccm-deployment) |
| Microsoft Intune | Windows | [Agente Windows](./windows.md#intune-deployment) |
| Group Policy (GPO) | Windows | [Agente Windows](./windows.md#gpo-deployment) |
| Jamf Pro | macOS | [Agente macOS](./macos.md#jamf-deployment) |
| MDM Genérico | macOS | [Agente macOS](./macos.md#mdm-deployment) |
| CLI / Ansible | Linux | [Agente Linux](./linux.md#automated-deployment) |

### Inscripción por Código QR

Para BYOD o despliegue en campo:
1. Genere un código QR desde el dashboard de la sonda (**Agentes > Inscripción**)
2. El usuario escanea el código QR en su dispositivo
3. El agente se descarga e instala con la configuración preconfigurada

## Configuración del Agente

Después de la instalación, los agentes se configuran mediante un archivo de configuración local o de forma remota a través del dashboard de la sonda:

| Configuración | Predeterminado | Descripción |
|---|---|---|
| `server_url` | — | URL de la sonda o URL de Cloudflare Tunnel |
| `enrollment_token` | — | Token de inscripción de un solo uso |
| `heartbeat_interval` | 30s | Frecuencia de verificación del agente |
| `report_interval` | 15m | Frecuencia de carga completa de datos |
| `log_level` | info | Nivel de detalle del registro |

## Ciclo de Vida del Agente

1. **Instalación** — el paquete del agente se instala en el endpoint
2. **Inscripción** — el agente se registra con la sonda usando un token de inscripción
3. **Activo** — el agente envía heartbeats y reportes regulares
4. **Inactivo** — el agente ha perdido heartbeats más allá del umbral de tiempo de espera (predeterminado: 90 segundos)
5. **Desconectado** — el agente no se ha comunicado durante un período extendido
6. **Dado de baja** — el agente se elimina de la flota

## Integración con el Dashboard

Los agentes inscritos aparecen en el dashboard de la sonda bajo **Agentes**:

- **Lista de Agentes** — todos los agentes inscritos con indicadores de estado
- **Detalle del Agente** — datos completos del endpoint para un agente seleccionado
- **Alertas** — notificaciones para agentes inactivos/desconectados o cambios en la postura de seguridad
- **Grupos** — organice agentes en grupos lógicos (por departamento, ubicación, etc.)

## Seguridad

- Toda la comunicación agente-sonda está cifrada mediante TLS
- Los agentes se autentican usando tokens JWT emitidos durante la inscripción
- Los tokens de inscripción son de un solo uso y expiran después de un período configurable
- Los binarios del agente están firmados para verificación de integridad
- No se requieren conexiones entrantes en el endpoint

## Preguntas Frecuentes

**P: ¿Cuánto ancho de banda usa un agente?**
R: Los heartbeats son aproximadamente 200 bytes cada uno (cada 30 segundos). Los reportes completos son típicamente 2-10 KB comprimidos (cada 15 minutos). El ancho de banda total es insignificante incluso en conexiones lentas.

**P: ¿El agente requiere privilegios de administrador/root?**
R: El agente se ejecuta como un servicio del sistema y requiere privilegios elevados para la instalación. Después de la instalación, se ejecuta bajo una cuenta de servicio dedicada con permisos mínimos.

**P: ¿Puedo desinstalar el agente de forma remota?**
R: Sí. Desde el dashboard de la sonda, seleccione un agente y haga clic en **Desinstalar**. El agente se eliminará a sí mismo en el próximo heartbeat.

**P: ¿El agente afecta el rendimiento del endpoint?**
R: El agente está diseñado para ser ligero. Típicamente usa menos de 20 MB de RAM y CPU insignificante. La recopilación de datos se ejecuta con prioridad baja para evitar impactar la experiencia del usuario.

Para ayuda adicional, contacte a [support@netreconapp.com](mailto:support@netreconapp.com).
