---
sidebar_position: 1
title: Inicio Rápido
description: Comience con NetRecon Cloud en minutos
---

# Inicio Rápido en la Nube

NetRecon Cloud es la forma más rápida de comenzar. Sin configuración de servidor, sin Docker — solo regístrese, despliegue una sonda y comience a descubrir su red.

## Paso 1: Cree Su Cuenta

1. Vaya a [app.netreconapp.com](https://app.netreconapp.com) y haga clic en **Registrarse**
2. Ingrese su correo electrónico, nombre de empresa y contraseña
3. Verifique su dirección de correo electrónico
4. Inicie sesión en el Dashboard de NetRecon

## Paso 2: Agregue Su Primer Sitio

1. En el Dashboard, navegue a **Sitios** en la barra lateral
2. Haga clic en **Agregar Sitio**
3. Ingrese un nombre y dirección para el sitio (ej., "Oficina Principal — Estambul")
4. Guarde el sitio

## Paso 3: Despliegue una Sonda

Cada sitio necesita al menos una sonda para el descubrimiento y monitoreo de red.

### Opción A: NetRecon OS (Recomendado)

1. Vaya a **Sitios → [Su Sitio] → Sondas → Agregar Sonda**
2. Seleccione **NetRecon OS** y descargue la imagen para su hardware
3. Grabe la imagen en una tarjeta SD o SSD usando [balenaEtcher](https://etcher.balena.io/)
4. Conecte la sonda a su red mediante Ethernet
5. Encienda — la sonda se conectará automáticamente a su cuenta en la nube mediante Cloudflare Tunnel

### Opción B: Docker en Servidor Existente

```bash
# Descargue y ejecute el contenedor de la sonda
docker run -d \
  --name netrecon-probe \
  --network host \
  --restart unless-stopped \
  -e ENROLLMENT_TOKEN="su-token-del-dashboard" \
  netrecon/probe:latest
```

Obtenga el token de inscripción desde **Sitios → [Su Sitio] → Sondas → Agregar Sonda → Docker**.

### Opción C: Máquina Virtual

1. Descargue el archivo OVA desde el Dashboard
2. Importe en VMware, Proxmox o Hyper-V
3. Configure la VM con **red en modo puente** (requerido para escaneo de Capa 2)
4. Inicie la VM — aparecerá en su Dashboard automáticamente

## Paso 4: Comience a Escanear

Una vez que la sonda esté en línea:

1. Vaya a **Sitios → [Su Sitio] → Dispositivos**
2. Haga clic en **Escanear Ahora** o espere el descubrimiento automático (se ejecuta cada 15 minutos)
3. Los dispositivos descubiertos aparecerán en el inventario de dispositivos

## Paso 5: Instale la Aplicación Móvil

Descargue **NetRecon Scanner** desde Google Play Store para escaneo de redes en movimiento:

- Escanee cualquier red a la que su teléfono esté conectado
- Los resultados se sincronizan automáticamente con su dashboard en la nube
- Consulte [Descripción General del Scanner](../scanner/overview) para más detalles

## ¿Qué Sigue?

- **Despliegue agentes** en endpoints para mayor visibilidad → [Instalación de Agentes](../agents/overview)
- **Configure alertas** para nuevos dispositivos, vulnerabilidades o tiempo de inactividad
- **Configure integraciones** con sus herramientas existentes (LDAP, SIEM, Jira, ServiceNow)
- **Invite a su equipo** mediante **Configuración → Gestión de Equipo**

## Nube vs Autoalojado

| Característica | Nube | Autoalojado |
|---|---|---|
| Gestión de servidor | Gestionado por NetRecon | Usted gestiona |
| Ubicación de datos | NetRecon Cloud (UE) | Su infraestructura |
| Actualizaciones | Automáticas | Manual (docker pull) |
| Cloudflare Tunnel | Incluido | Usted lo configura |
| Precios | Suscripción | Clave de licencia |

¿Necesita autoalojado en su lugar? Consulte la [Guía de Instalación](../self-hosting/installation).

Para ayuda, contacte a [support@netreconapp.com](mailto:support@netreconapp.com).
