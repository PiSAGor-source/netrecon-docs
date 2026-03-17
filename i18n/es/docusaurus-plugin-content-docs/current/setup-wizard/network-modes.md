---
sidebar_position: 3
title: Modos de Red
description: Comprender los modos de red Simple, Escaneo Dual, Puente y TAP
---

# Modos de Red

NetRecon soporta cuatro modos de red que determinan cómo el probe se conecta a y monitorea su red. Elegir el modo correcto depende de su hardware, topología de red y objetivos de monitoreo.

## Requisitos Previos

- Al menos una interfaz Ethernet detectada y con un rol asignado
- Comprensión de su topología de red (configuración de switches, VLANs, etc.)

## Comparación de Modos

| Característica | Simple | Escaneo Dual | Puente | TAP |
|---|---|---|---|---|
| NICs mínimas | 1 | 2 | 2 | 2 |
| Escaneo activo | Sí | Sí | Sí | No |
| Monitoreo pasivo | Limitado | Limitado | Sí | Sí |
| Interrupción de red | Ninguna | Ninguna | Mínima | Ninguna |
| Despliegue en línea | No | No | Sí | No |
| Ideal para | Redes pequeñas | Redes segmentadas | Visibilidad completa | Redes de producción |

## Modo de Interfaz Simple

La configuración más sencilla. Un puerto Ethernet maneja todo: escaneo, gestión y acceso a internet.

```
┌─────────────────────────────────────────┐
│              Network Switch             │
│                                         │
│  Port 1    Port 2    Port 3    Port 4   │
│    │         │         │         │      │
│    │         │         │         │      │
└────┼─────────┼─────────┼─────────┼──────┘
     │         │         │         │
   Probe    PC/Server  PC/Server  Router
  (eth0)
```

**Cómo funciona:**
- El probe se conecta a un puerto regular del switch
- El descubrimiento ARP y el escaneo de puertos salen por la misma interfaz
- El panel de gestión y el acceso remoto también usan esta interfaz

**Cuándo usar:**
- Tiene un dispositivo con una sola NIC (ej., Raspberry Pi sin adaptador USB)
- Redes pequeñas (< 50 dispositivos)
- Despliegue rápido donde se prefiere la simplicidad

**Limitaciones:**
- El tráfico de escaneo comparte ancho de banda con el tráfico de gestión
- No puede ver tráfico entre otros dispositivos (solo tráfico hacia/desde el probe)

## Modo de Escaneo Dual

Dos interfaces separadas: una dedicada al escaneo y otra para gestión/enlace ascendente.

```
┌─────────────────────────────────────────┐
│            Target Network Switch        │
│  Port 1    Port 2    Port 3    Port 4   │
│    │         │         │         │      │
└────┼─────────┼─────────┼─────────┼──────┘
     │         │         │         │
   Probe    PC/Server  PC/Server  │
  (eth0)                          │
                                  │
┌──────────────────────────────────┼──────┐
│         Management Switch        │      │
│  Port 1         Port 2         Port 3   │
│    │               │             │      │
└────┼───────────────┼─────────────┼──────┘
     │               │             │
   Probe          Admin PC       Router
  (eth1)
```

**Cómo funciona:**
- `eth0` (Escaneo) se conecta a la red objetivo para descubrimiento y escaneo
- `eth1` (Gestión) se conecta a su red de administración para acceso al panel

**Cuándo usar:**
- Desea aislar el tráfico de escaneo del tráfico de gestión
- La red objetivo y la red de gestión están en diferentes subredes/VLANs
- Orange Pi R2S o cualquier dispositivo con doble NIC

**Ventajas:**
- Separación limpia del tráfico de escaneo y gestión
- La interfaz de gestión permanece responsive durante escaneos pesados
- Puede escanear una red en la que no quiere tráfico de gestión

## Modo Puente

El probe se sitúa en línea entre dos segmentos de red, reenviando tráfico de forma transparente mientras inspecciona todos los paquetes que pasan a través.

```
                    ┌──────────┐
                    │  Probe   │
                    │          │
                    │ eth0  eth1│
                    └──┬────┬──┘
                       │    │
          ┌────────────┘    └────────────┐
          │                              │
┌─────────┼──────────┐    ┌─────────────┼─────┐
│   Switch A         │    │       Switch B     │
│   (Upstream)       │    │    (Downstream)    │
│                    │    │                    │
│  Servers / Router  │    │   Workstations     │
└────────────────────┘    └────────────────────┘
```

**Cómo funciona:**
- El probe puentea `eth0` y `eth1` en Capa 2
- Todo el tráfico entre los dos segmentos pasa a través del probe
- El probe inspecciona cada paquete sin ser un salto de enrutamiento
- El escaneo activo también puede realizarse desde las interfaces del puente

**Cuándo usar:**
- Necesita visibilidad completa del tráfico (IDS, captura PCAP)
- Quiere monitorear tráfico entre segmentos de red
- Desplegando entre un switch de núcleo y un switch de acceso

**Consideraciones:**
- El probe se convierte en un punto único de fallo para la ruta puenteada
- NetRecon incluye capacidad de fallo abierto: si el probe pierde alimentación, el tráfico continúa fluyendo vía bypass de hardware (en dispositivos soportados)
- Agrega latencia mínima (< 1ms en hardware típico)

## Modo TAP

El probe recibe una copia del tráfico de red desde un dispositivo TAP o puerto SPAN/espejo del switch. Opera de manera completamente pasiva.

```
┌─────────────────────────────────────────┐
│              Network Switch             │
│                                         │
│  Port 1    Port 2    SPAN Port          │
│    │         │         │                │
└────┼─────────┼─────────┼────────────────┘
     │         │         │
   Server    Server    Probe
                      (eth0 — monitor)

                      (eth1 — gestión,
                       conectado a red de administración)
```

**Cómo funciona:**
- El switch envía una copia del tráfico a su puerto SPAN/espejo
- La interfaz de escaneo del probe recibe este tráfico espejado en modo promiscuo
- No se inyectan paquetes de vuelta a la red desde la interfaz de escaneo
- Una interfaz de gestión separada proporciona acceso al panel

**Cuándo usar:**
- Redes de producción donde inyectar tráfico de escaneo no es aceptable
- Entornos de cumplimiento que requieren monitoreo solo pasivo
- Cuando desea IDS y análisis de tráfico sin escaneo activo

**Configuración de su switch:**
- En Cisco: `monitor session 1 source vlan 10` / `monitor session 1 destination interface Gi0/24`
- En HP/Aruba: `mirror-port <port>`
- En Juniper: `set forwarding-options port-mirroring input ingress interface <source>`

**Limitaciones:**
- No puede realizar escaneo activo (descubrimiento ARP, escaneo de puertos) desde la interfaz TAP
- El descubrimiento de dispositivos depende enteramente del tráfico observado
- Puede perderse dispositivos que están inactivos y no generan tráfico durante el período de observación

## Cambiar Modos Después de la Configuración

Puede cambiar el modo de red en cualquier momento desde el panel del probe:

1. Navegue a **Configuración > Red**
2. Seleccione un nuevo modo
3. Reasigne roles de interfaz si es necesario
4. Haga clic en **Aplicar**

:::warning
Cambiar modos de red interrumpirá brevemente los servicios del probe. Planifique los cambios de modo durante una ventana de mantenimiento.
:::

## Preguntas Frecuentes

**P: ¿Qué modo recomienda para una primera configuración?**
R: Comience con el modo de **Interfaz Simple** por simplicidad. Puede actualizar al modo Escaneo Dual o Puente más adelante según evolucionen sus necesidades.

**P: ¿Puedo combinar el modo TAP con escaneo activo?**
R: Sí, si tiene tres o más interfaces. Asigne una a TAP (pasivo), una a escaneo activo y una a gestión.

**P: ¿El modo Puente afecta el rendimiento de la red?**
R: El probe agrega menos de 1ms de latencia en modo puente. En el Orange Pi R2S con puertos de 2.5G, el throughput se mantiene a velocidad de línea para cargas de tráfico empresarial típicas.

Para ayuda adicional, contacte a [support@netreconapp.com](mailto:support@netreconapp.com).
