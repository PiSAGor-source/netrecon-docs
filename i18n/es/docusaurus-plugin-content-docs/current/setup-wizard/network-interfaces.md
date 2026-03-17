---
sidebar_position: 2
title: Interfaces de Red
description: Asignación de roles de NIC y recuperación de controladores en el asistente de configuración
---

# Interfaces de Red

El paso de Interfaces de Red del asistente de configuración detecta todos los puertos Ethernet de su probe y le permite asignar un rol a cada uno. La asignación correcta de interfaces es crítica para un escaneo confiable y acceso de gestión.

## Requisitos Previos

- Al menos un cable Ethernet conectado antes de iniciar el asistente
- Para configuraciones con múltiples NIC, etiquete sus cables antes de conectarlos para saber qué puerto se conecta a dónde

## Detección de Interfaces

Cuando llega al Paso 4 del asistente, el sistema escanea todas las interfaces de red disponibles y muestra:

- **Nombre de interfaz** (ej., `eth0`, `eth1`, `enp1s0`)
- **Dirección MAC**
- **Estado de enlace** (conectado / desconectado)
- **Velocidad** (ej., 1 Gbps, 2.5 Gbps)
- **Controlador** (ej., `r8169`, `r8152`)

## Roles de Interfaz

A cada interfaz detectada se le puede asignar uno de los siguientes roles:

### Escaneo

El rol principal para descubrimiento de red. Esta interfaz envía solicitudes ARP, realiza escaneos de puertos y captura tráfico. Debe estar conectada al segmento de red que desea monitorear.

**Mejor práctica:** Conéctese a un puerto de acceso en su switch o un puerto SPAN/espejo para monitoreo pasivo.

### Gestión

Usada para acceder al panel del probe, recibir conexiones remotas y actualizaciones del sistema. Esta interfaz debe tener conectividad confiable.

**Mejor práctica:** Asigne una IP estática a la interfaz de gestión para que su dirección no cambie.

### Enlace Ascendente

La interfaz conectada a su gateway de internet. Usada para Cloudflare Tunnel, actualizaciones del sistema y conectividad externa. En muchas configuraciones, los roles de gestión y enlace ascendente pueden compartir la misma interfaz.

### Sin Uso

Las interfaces configuradas como "Sin Uso" se deshabilitan y no participarán en ninguna actividad de red.

## Ejemplos de Asignación de Roles

### Orange Pi R2S (2 puertos)

```
eth0 (2.5G) → Escaneo    — conectado al switch de la red objetivo
eth1 (1G)   → Gestión    — conectado a su VLAN de administración
```

### Raspberry Pi 4 (1 puerto integrado + adaptador USB)

```
eth0        → Escaneo    — puerto integrado, conectado a la red objetivo
eth1 (USB)  → Gestión    — adaptador Ethernet USB, conectado a red de administración
```

### Mini PC x86_64 (4 puertos)

```
eth0  → Escaneo           — conectado a VLAN objetivo 1
eth1  → Escaneo           — conectado a VLAN objetivo 2
eth2  → Gestión           — conectado a red de administración
eth3  → Enlace Ascendente — conectado al gateway de internet
```

## Recuperación de Controladores

Si una interfaz es detectada pero muestra "Sin Controlador" o "Error de Controlador", el asistente incluye una función de recuperación de controladores:

1. El asistente verifica su base de datos integrada de controladores en busca de controladores compatibles
2. Si se encuentra una coincidencia, haga clic en **Instalar Controlador** para cargarlo
3. Después de la instalación del controlador, la interfaz aparecerá con todos los detalles
4. Si no se encuentra un controlador compatible, puede necesitar instalarlo manualmente después de completar el asistente

:::tip
El problema de controlador más común ocurre con adaptadores Ethernet USB Realtek (`r8152`). NetRecon OS incluye controladores para los adaptadores más populares de forma predeterminada.
:::

## Identificación de Interfaces

Si no está seguro de qué puerto físico corresponde a qué nombre de interfaz:

1. Haga clic en el botón **Identificar** junto a una interfaz en el asistente
2. El probe hará parpadear el LED de enlace en ese puerto durante 10 segundos
3. Mire su dispositivo probe para ver qué puerto está parpadeando

Alternativamente, puede conectar/desconectar cables uno a la vez y observar el cambio de estado de enlace en el asistente.

## Soporte de VLAN

Si su red usa VLANs, puede configurar etiquetado VLAN en cualquier interfaz:

1. Seleccione la interfaz
2. Habilite **Etiquetado VLAN**
3. Ingrese el ID de VLAN (1-4094)
4. El probe creará una interfaz virtual (ej., `eth0.100`) para esa VLAN

Esto es útil para escanear múltiples VLANs desde una sola interfaz física conectada a un puerto troncal.

## Preguntas Frecuentes

**P: ¿Puedo asignar múltiples roles a una interfaz?**
R: En modo de Interfaz Simple, los roles de escaneo y gestión comparten un puerto. En otros modos, cada interfaz debe tener un único rol dedicado.

**P: Mi adaptador Ethernet USB no es detectado. ¿Qué hago?**
R: Pruebe un puerto USB diferente. Si el adaptador aún no es detectado, puede no ser compatible. Los chipsets soportados incluyen Realtek RTL8153, RTL8152, ASIX AX88179 e Intel I225.

**P: ¿Puedo cambiar los roles de interfaz después del asistente?**
R: Sí. Vaya a **Configuración > Red** en el panel del probe para reasignar roles de interfaz en cualquier momento.

Para ayuda adicional, contacte a [support@netreconapp.com](mailto:support@netreconapp.com).
