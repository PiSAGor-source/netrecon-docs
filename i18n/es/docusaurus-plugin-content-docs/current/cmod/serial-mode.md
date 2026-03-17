---
sidebar_position: 3
title: Modo Serial
description: Conéctese a dispositivos de red mediante cable de consola serial
---

# Modo Serial

El modo serial le permite conectarse a dispositivos de red utilizando un cable de consola USB a serial. Esto es esencial para la configuración inicial del dispositivo, recuperación de contraseña y gestión fuera de banda cuando SSH no está disponible.

## Requisitos Previos

- Un cable de consola USB a serial (RJ45 a USB o DB9 a USB)
- El cable USB conectado al puerto USB del probe
- Acceso físico al puerto de consola del dispositivo de red
- La velocidad de baudios correcta para el dispositivo destino

## Tipos de Cable de Consola Compatibles

| Tipo de Cable | Conector | Uso Común |
|---|---|---|
| RJ45 a USB | Puerto de consola RJ45 | Cisco, Juniper, Aruba |
| DB9 a USB | Puerto serial DB9 | Switches antiguos, dispositivos industriales |
| USB-C/USB-A a RJ45 | Puerto de consola RJ45 | Cables de consola modernos |
| USB-C a USB-C | Puerto de consola USB-C | Algunos dispositivos nuevos |

### Chipsets Recomendados

Para una comunicación serial confiable, use cables con estos chipsets:
- **FTDI FT232R** — más compatible, recomendado
- **Prolific PL2303** — ampliamente disponible
- **Silicon Labs CP210x** — buena compatibilidad

Evite cables FTDI falsificados, ya que pueden no funcionar de manera confiable.

## Configuración de una Conexión Serial

### Paso 1: Conectar el Cable

1. Conecte el extremo USB del cable de consola al puerto USB del probe
2. Conecte el extremo RJ45/DB9 al puerto de consola del dispositivo de red
3. Verifique que el cable sea detectado por el probe

### Paso 2: Agregar el Dispositivo

1. Navegue a **CMod > Dispositivos**
2. Haga clic en **Agregar Dispositivo**
3. Seleccione **Serial** como tipo de conexión
4. Configure los parámetros seriales:

| Campo | Descripción | Predeterminado |
|---|---|---|
| Nombre | Nombre descriptivo del dispositivo | — |
| Puerto Serial | Dispositivo serial USB detectado | `/dev/ttyUSB0` |
| Velocidad de Baudios | Velocidad de comunicación | 9600 |
| Bits de Datos | Número de bits de datos | 8 |
| Paridad | Verificación de paridad | Ninguna |
| Bits de Parada | Número de bits de parada | 1 |
| Control de Flujo | Control de flujo por hardware/software | Ninguno |
| Tipo de Dispositivo | Fabricante/SO (para coincidencia de plantillas) | — |

5. Haga clic en **Guardar y Probar**

### Paso 3: Abrir Terminal

1. Haga clic en el dispositivo en la lista de dispositivos de CMod
2. Haga clic en **Terminal**
3. Se abre una terminal serial interactiva en su navegador
4. Presione **Enter** para activar la consola del dispositivo

## Referencia de Velocidad de Baudios

Velocidades de baudios comunes por fabricante:

| Fabricante / Dispositivo | Velocidad de Baudios Predeterminada |
|---|---|
| Cisco IOS / IOS-XE | 9600 |
| Cisco NX-OS | 9600 |
| Juniper Junos | 9600 |
| HP/Aruba ProCurve | 9600 |
| MikroTik RouterOS | 115200 |
| Fortinet FortiOS | 9600 |
| Palo Alto PAN-OS | 9600 |
| Ubiquiti EdgeOS | 115200 |
| Linux (genérico) | 115200 |

:::tip
Si ve texto ilegible en la terminal, la velocidad de baudios probablemente es incorrecta. Pruebe las velocidades comunes: 9600, 19200, 38400, 57600, 115200.
:::

## Configuración de Comunicación Serial

### Configuración Estándar 8N1

La mayoría de los dispositivos de red usan el estándar "8N1":
- **8** bits de datos
- **N** (sin) paridad
- **1** bit de parada

Esta es la configuración predeterminada en CMod y debería funcionar con la gran mayoría de dispositivos.

### Control de Flujo

| Tipo | Cuándo Usar |
|---|---|
| Ninguno | Predeterminado; funciona para la mayoría de dispositivos |
| Hardware (RTS/CTS) | Requerido por algunos dispositivos industriales y antiguos |
| Software (XON/XOFF) | Raramente usado; algunos servidores de terminal legacy |

## Detección de Puertos Seriales

Cuando se conecta un cable serial USB, CMod lo detecta automáticamente:

1. Navegue a **CMod > Dispositivos > Agregar Dispositivo > Serial**
2. El menú desplegable de **Puerto Serial** lista todos los dispositivos seriales USB detectados
3. Si hay múltiples cables conectados, cada uno aparece como un puerto separado (ej., `/dev/ttyUSB0`, `/dev/ttyUSB1`)

Si no se detectan puertos:
- Verifique que el cable esté completamente insertado
- Pruebe un puerto USB diferente en el probe
- Revise el registro del sistema del probe en busca de errores de detección de dispositivos USB

## Casos de Uso

### Configuración Inicial del Dispositivo
Al configurar un switch o router nuevo de fábrica que no tiene dirección IP configurada:
1. Conéctese vía consola serial
2. Complete la configuración inicial (asignar IP de gestión, habilitar SSH)
3. Cambie al modo SSH para gestión continua

### Recuperación de Contraseña
Cuando está bloqueado fuera de un dispositivo:
1. Conéctese vía consola serial
2. Siga el procedimiento de recuperación de contraseña del fabricante
3. Restablezca la contraseña y recupere el acceso

### Gestión Fuera de Banda
Cuando la interfaz de gestión de un dispositivo es inalcanzable:
1. Conéctese vía consola serial
2. Diagnostique el problema (interfaz caída, problema de enrutamiento, etc.)
3. Aplique la configuración correctiva

### Actualizaciones de Firmware
Algunos dispositivos requieren acceso por consola durante actualizaciones de firmware:
1. Conéctese vía consola serial
2. Monitoree el proceso de actualización en tiempo real
3. Intervenga si la actualización encuentra errores

## Solución de Problemas

### Sin salida en la terminal
- Presione **Enter** varias veces para activar la consola
- Verifique que la velocidad de baudios coincida con la configuración del dispositivo
- Intente invertir el cable de consola (algunos cables tienen diferente cableado)
- Asegúrese de que el controlador USB del cable esté cargado (revise los registros del sistema del probe)

### Texto ilegible
- La velocidad de baudios es incorrecta; pruebe 9600 primero, luego 115200
- Verifique la configuración de bits de datos, paridad y bits de parada
- Pruebe un cable de consola diferente

### "Permiso denegado" en puerto serial
- El servicio CMod requiere acceso a los dispositivos `/dev/ttyUSB*`
- Esto se configura automáticamente durante la instalación de NetRecon OS
- Si usa una instalación personalizada, agregue el usuario del servicio CMod al grupo `dialout`

### Desconexiones intermitentes
- El cable USB puede estar suelto; asegure una conexión firme
- Algunos cables USB largos causan degradación de señal; use un cable de menos de 3 metros
- Los hubs USB pueden causar problemas; conéctese directamente al puerto USB del probe

## Preguntas Frecuentes

**P: ¿Puedo usar el modo serial remotamente vía Admin Connect?**
R: Sí. La terminal serial es accesible a través del panel web, que es alcanzable vía Cloudflare Tunnel. Obtiene la misma experiencia de terminal interactiva de forma remota.

**P: ¿Cuántas conexiones seriales puede manejar el probe simultáneamente?**
R: Una conexión serial por puerto USB. La mayoría del hardware de probe soporta 2-4 puertos USB. Use un hub USB con alimentación para conexiones adicionales, aunque las conexiones directas son más confiables.

**P: ¿Puedo automatizar comandos de consola serial?**
R: Sí. Las plantillas de comandos funcionan con conexiones seriales igual que con SSH. Puede crear plantillas para tareas seriales repetitivas como recuperación de contraseña o configuración inicial.

Para ayuda adicional, contacte a [support@netreconapp.com](mailto:support@netreconapp.com).
