---
sidebar_position: 1
title: Instalación
description: Instale NetRecon OS en su hardware de sonda
---

# Instalación de NetRecon OS

Esta guía le lleva paso a paso por la instalación de NetRecon OS en su hardware de sonda. El proceso toma aproximadamente 15 minutos desde la descarga hasta una sonda completamente funcional.

## Requisitos Previos

- Un dispositivo de hardware compatible (consulte [Requisitos](./requirements.md))
- Una tarjeta microSD (16 GB mínimo, 32 GB recomendado) o unidad USB
- Una herramienta de escritura de imágenes como [balenaEtcher](https://etcher.balena.io/) o Raspberry Pi Imager
- Una computadora para descargar y escribir la imagen
- Cable Ethernet conectado a su red

## Paso 1: Descargar la Imagen

Descargue la imagen apropiada para su hardware desde el portal de clientes de NetRecon:

| Hardware | Archivo de Imagen | Arquitectura |
|---|---|---|
| Orange Pi R2S | `netrecon-os-arm64.img.xz` | ARM64 |
| Raspberry Pi 4/5 | `netrecon-os-arm64.img.xz` | ARM64 |
| Mini PC x86_64 | `netrecon-os-amd64.iso` | x86_64 |

:::tip
Verifique el checksum de la descarga contra el valor mostrado en el portal para asegurar la integridad del archivo.
:::

## Paso 2: Escribir la Imagen

### Para dispositivos ARM64 (Orange Pi, Raspberry Pi)

1. Inserte su tarjeta microSD en su computadora
2. Abra balenaEtcher
3. Seleccione el archivo `.img.xz` descargado (no es necesario extraerlo)
4. Seleccione su tarjeta microSD como destino
5. Haga clic en **Flash** y espere a que se complete

### Para dispositivos x86_64

1. Inserte una unidad USB en su computadora
2. Abra balenaEtcher
3. Seleccione el archivo `.iso` descargado
4. Seleccione su unidad USB como destino
5. Haga clic en **Flash** y espere a que se complete
6. Arranque el mini PC desde la unidad USB y siga el instalador en pantalla

## Paso 3: Primer Arranque

1. Inserte la tarjeta microSD (o unidad interna para x86_64) en su dispositivo de sonda
2. Conecte al menos un cable Ethernet a su red
3. Encienda el dispositivo
4. Espere aproximadamente 60 segundos para que el sistema se inicialice

La sonda obtendrá una dirección IP a través de DHCP en su primer arranque.

## Paso 4: Ejecutar el Asistente de Configuración

1. Desde cualquier dispositivo en la misma red, abra un navegador web
2. Navegue a `http://<ip-de-la-sonda>:8080`
3. El Asistente de Configuración le guiará a través de la configuración inicial

El asistente le ayudará a configurar:
- Credenciales de la cuenta de administrador
- Roles de interfaz de red
- Modo de escaneo de red
- Conexión Cloudflare Tunnel
- Configuración de seguridad

Consulte [Descripción General del Asistente de Configuración](../setup-wizard/overview.md) para documentación detallada del asistente.

## Paso 5: Conectar Sus Aplicaciones

Una vez completado el asistente:

- **NetRecon Scanner**: Puede descubrir la sonda vía mDNS en la red local
- **Admin Connect**: Escanee el código QR mostrado en el asistente, o conéctese mediante `https://probe.netreconapp.com`

## Requisitos de Hardware

| Requisito | Mínimo | Recomendado |
|---|---|---|
| CPU | ARM64 o x86_64 | ARM64 quad-core o x86_64 |
| RAM | 4 GB | 8 GB |
| Almacenamiento | 16 GB | 32 GB |
| Ethernet | 1 puerto | 2+ puertos |
| Red | DHCP disponible | IP estática preferida |

## Resolución de Problemas

### No puede encontrar la sonda en la red

- Asegúrese de que el cable Ethernet esté correctamente conectado y el LED de enlace esté activo
- Revise la tabla de arrendamientos DHCP de su router para un nuevo dispositivo llamado `netrecon`
- Intente conectar un monitor y teclado para ver la dirección IP de la sonda en la consola

### El asistente no carga

- Verifique que está accediendo al puerto 8080: `http://<ip-de-la-sonda>:8080`
- El servicio del asistente inicia aproximadamente 60 segundos después del arranque
- Compruebe que su computadora esté en la misma red/VLAN que la sonda

### La imagen no se puede escribir

- Intente con una tarjeta microSD diferente; algunas tarjetas tienen problemas de compatibilidad
- Descargue nuevamente la imagen y verifique el checksum
- Pruebe con una herramienta de escritura de imágenes alternativa

## Preguntas Frecuentes

**P: ¿Puedo instalar NetRecon OS en una máquina virtual?**
R: Sí, el ISO x86_64 puede instalarse en VMware, Proxmox o Hyper-V. Asigne al menos 4 GB de RAM y asegúrese de que la VM tenga un adaptador de red en modo puente.

**P: ¿Cómo actualizo NetRecon OS después de la instalación?**
R: Las actualizaciones se entregan a través de la aplicación Admin Connect o mediante el dashboard web de la sonda en **Configuración > Actualización del Sistema**.

**P: ¿Puedo usar Wi-Fi en lugar de Ethernet?**
R: La sonda requiere al menos una conexión Ethernet por cable para un escaneo de red confiable. Wi-Fi no está soportado como interfaz de escaneo principal.

Para ayuda adicional, contacte a [support@netreconapp.com](mailto:support@netreconapp.com).
