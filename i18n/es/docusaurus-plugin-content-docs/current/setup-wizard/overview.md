---
sidebar_position: 1
title: Descripción General del Asistente de Configuración
description: Guía completa del asistente de configuración de primer arranque de NetRecon OS
---

# Descripción General del Asistente de Configuración

El Asistente de Configuración se ejecuta automáticamente en el primer arranque de NetRecon OS. Le guía a través de todos los pasos de configuración esenciales para poner su probe operativo. El asistente es accesible vía navegador web en `http://<probe-ip>:8080`.

## Requisitos Previos

- NetRecon OS arrancado exitosamente en su hardware de probe
- Al menos un cable Ethernet conectado a su red
- Una computadora o smartphone en la misma red para acceder al asistente

## Pasos del Asistente

El asistente de configuración consta de 11 pasos, completados secuencialmente:

| Paso | Nombre | Descripción |
|---|---|---|
| 1 | **Bienvenida** | Selección de idioma y acuerdo de licencia |
| 2 | **Cuenta de Administrador** | Crear el nombre de usuario y contraseña del administrador |
| 3 | **Nombre de Host** | Establecer el nombre de host del probe en la red |
| 4 | **Interfaces de Red** | Detectar y asignar roles a los puertos Ethernet |
| 5 | **Modo de Red** | Elegir topología de escaneo (Simple, Dual, Puente, TAP) |
| 6 | **Configuración IP** | Establecer IP estática o DHCP para cada interfaz |
| 7 | **DNS y NTP** | Configurar servidores DNS y sincronización horaria |
| 8 | **Cloudflare Tunnel** | Configurar túnel de acceso remoto (opcional) |
| 9 | **Configuración de Seguridad** | Configurar certificados TLS, 2FA y tiempo de espera de sesión |
| 10 | **Objetivo de Escaneo Inicial** | Definir la primera subred a escanear |
| 11 | **Resumen y Aplicar** | Revisar todas las configuraciones y aplicar |

## Detalle de los Pasos

### Paso 1: Bienvenida

Seleccione su idioma preferido de los 11 idiomas soportados. Acepte el acuerdo de licencia para continuar.

### Paso 2: Cuenta de Administrador

Cree la cuenta de administrador que se usará para iniciar sesión en el panel del probe y la API. Elija una contraseña segura — esta cuenta tiene acceso completo al sistema.

### Paso 3: Nombre de Host

Establezca un nombre de host significativo para el probe (ej., `netrecon-hq` o `probe-branch-01`). Este nombre de host se transmitirá vía mDNS para descubrimiento local.

### Paso 4: Interfaces de Red

El asistente detecta todos los puertos Ethernet disponibles y muestra su estado de enlace. Usted asigna un rol a cada interfaz:

- **Escaneo** — la interfaz usada para descubrimiento de red y escaneo
- **Gestión** — la interfaz usada para acceso al panel y gestión remota
- **Enlace Ascendente** — la interfaz conectada a su gateway de internet
- **Sin Uso** — interfaces deshabilitadas

Consulte [Interfaces de Red](./network-interfaces.md) para orientación detallada.

### Paso 5: Modo de Red

Elija cómo el probe se conecta a su red:

- **Interfaz Simple** — escaneo y gestión en un solo puerto
- **Escaneo Dual** — interfaces separadas para escaneo y gestión
- **Puente** — modo en línea transparente entre dos puertos
- **TAP** — monitoreo pasivo vía TAP de red o puerto SPAN

Consulte [Modos de Red](./network-modes.md) para orientación detallada.

### Paso 6: Configuración IP

Para cada interfaz activa, elija entre DHCP y configuración de IP estática. Se recomienda IP estática para la interfaz de gestión para que la dirección del probe no cambie.

### Paso 7: DNS y NTP

Configure servidores DNS upstream (por defecto Cloudflare 1.1.1.1 y Google 8.8.8.8). NTP se configura para asegurar marcas de tiempo precisas para registros y resultados de escaneo.

### Paso 8: Cloudflare Tunnel

Opcionalmente configure un Cloudflare Tunnel para acceso remoto seguro. Necesitará:
- Una cuenta de Cloudflare
- Un token de túnel (generado desde el panel de Cloudflare Zero Trust)

Este paso puede omitirse y configurarse después desde el panel del probe.

### Paso 9: Configuración de Seguridad

- **Certificado TLS** — generar un certificado autofirmado o proporcionar el suyo
- **Autenticación de Dos Factores** — habilitar 2FA basado en TOTP para la cuenta de administrador
- **Tiempo de Espera de Sesión** — configurar cuánto tiempo permanecen activas las sesiones del panel

### Paso 10: Objetivo de Escaneo Inicial

Defina la primera subred que el probe escaneará. El asistente detecta automáticamente la subred desde la configuración IP de la interfaz de escaneo y la sugiere como objetivo predeterminado.

### Paso 11: Resumen y Aplicar

Revise todas las configuraciones realizadas. Haga clic en **Aplicar** para finalizar la configuración. El probe:

1. Aplicará la configuración de red
2. Generará certificados TLS
3. Iniciará todos los servicios
4. Comenzará el escaneo de red inicial (si se configuró)
5. Le redirigirá al panel del probe

:::info
El asistente se ejecuta solo una vez. Después de completarse, el servicio de primer arranque se deshabilita. Para volver a ejecutar el asistente, use la opción **Restablecimiento de Fábrica** en el panel del probe en **Configuración > Sistema**.
:::

## Después del Asistente

Una vez que el asistente se completa:

- Acceda al panel del probe en `https://<probe-ip>:3000`
- Si Cloudflare Tunnel fue configurado, acceda remotamente en `https://probe.netreconapp.com`
- Conecte la aplicación NetRecon Scanner o Admin Connect al probe

## Preguntas Frecuentes

**P: ¿Puedo volver a un paso anterior?**
R: Sí, el asistente tiene un botón de retroceso en cada paso. Sus valores previamente ingresados se preservan.

**P: ¿Qué pasa si necesito cambiar configuraciones después del asistente?**
R: Todas las configuraciones realizadas en el asistente pueden cambiarse después desde el panel del probe en **Configuración**.

**P: El asistente no muestra interfaces de red. ¿Qué hago?**
R: Asegúrese de que sus cables Ethernet estén conectados y los LEDs de enlace estén activos. Si usa un adaptador Ethernet USB, puede requerir instalación manual de controladores. Consulte [Interfaces de Red](./network-interfaces.md) para información de recuperación de controladores.

Para ayuda adicional, contacte a [support@netreconapp.com](mailto:support@netreconapp.com).
