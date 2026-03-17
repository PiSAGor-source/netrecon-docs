---
sidebar_position: 2
title: Modo SSH
description: Conéctese a dispositivos de red vía SSH para gestión de configuración
---

# Modo SSH

El modo SSH le permite conectarse a dispositivos de red a través de la red utilizando el protocolo SSH. Este es el método de conexión más común para gestionar switches, routers, firewalls y servidores.

## Requisitos Previos

- El dispositivo destino tiene SSH habilitado
- El probe tiene conectividad de red a la IP de gestión del dispositivo
- Credenciales SSH válidas (usuario/contraseña o clave SSH)
- El puerto SSH del dispositivo es accesible (por defecto: 22)

## Configuración de una Conexión SSH

### Paso 1: Agregar el Dispositivo

1. Navegue a **CMod > Dispositivos**
2. Haga clic en **Agregar Dispositivo**
3. Complete los detalles de conexión:

| Campo | Descripción | Ejemplo |
|---|---|---|
| Nombre | Nombre descriptivo del dispositivo | Core-SW-01 |
| Dirección IP | IP de gestión | 192.168.1.1 |
| Puerto | Puerto SSH | 22 |
| Tipo de Dispositivo | Fabricante/SO | Cisco IOS |
| Usuario | Usuario SSH | admin |
| Autenticación | Contraseña o Clave SSH | Contraseña |
| Contraseña | Contraseña SSH | (cifrada) |

4. Haga clic en **Guardar y Probar**

### Paso 2: Probar Conectividad

Al hacer clic en **Guardar y Probar**, CMod:
1. Intentará una conexión TCP a la IP y puerto especificados
2. Realizará el intercambio de claves SSH
3. Se autenticará con las credenciales proporcionadas
4. Ejecutará un comando básico (ej., `show version`) para verificar que la sesión funciona
5. Mostrará el resultado y marcará el dispositivo como "Conectado" o reportará un error

### Paso 3: Abrir Terminal

1. Haga clic en el dispositivo en la lista de dispositivos de CMod
2. Haga clic en **Terminal**
3. Se abre una terminal SSH interactiva en su navegador vía WebSocket
4. Puede escribir comandos como si estuviera conectado directamente al dispositivo

## Autenticación con Clave SSH

Para autenticación basada en clave:

1. Al agregar un dispositivo, seleccione **Clave SSH** como método de autenticación
2. Pegue su clave privada (formato PEM) en el campo de clave
3. Opcionalmente proporcione una frase de contraseña de clave
4. La clave pública debe estar ya instalada en el dispositivo destino

:::tip
La autenticación con clave SSH es más segura y se recomienda para entornos de producción. También permite operaciones desatendidas como respaldos de configuración programados.
:::

## Configuración de Conexión

### Configuración de Tiempos de Espera

| Configuración | Predeterminado | Rango |
|---|---|---|
| Tiempo de espera de conexión | 10 segundos | 5-60 segundos |
| Tiempo de espera de comando | 30 segundos | 10-300 segundos |
| Tiempo de espera por inactividad | 15 minutos | 5-60 minutos |
| Intervalo de keep-alive | 30 segundos | 10-120 segundos |

Configure estos valores en **CMod > Configuración > SSH**.

### Opciones SSH

| Opción | Predeterminado | Descripción |
|---|---|---|
| Verificación estricta de clave de host | Deshabilitada | Verificar la clave de host SSH del dispositivo |
| Cifrados preferidos | Auto | Anular el orden de negociación de cifrado |
| Tipo de terminal | xterm-256color | Tipo de emulación de terminal |
| Tamaño de terminal | 80x24 | Columnas x Filas |

## Ejecución de Comandos

### Terminal Interactiva

La terminal WebSocket proporciona una sesión interactiva en tiempo real:
- Soporte completo de colores ANSI
- Autocompletado con tabulador (enviado al dispositivo)
- Historial de comandos (flechas arriba/abajo)
- Soporte de copiar/pegar
- Grabación de sesión (opcional)

### Plantillas de Comandos

Ejecute secuencias de comandos predefinidas:

1. Seleccione el dispositivo
2. Haga clic en **Ejecutar Plantilla**
3. Elija una plantilla
4. Si la plantilla tiene variables, complete los valores
5. Haga clic en **Ejecutar**

Ejemplo de plantilla con variables:

```
configure terminal
interface {{interface}}
description {{description}}
switchport mode access
switchport access vlan {{vlan_id}}
no shutdown
end
write memory
```

### Ejecución Masiva

Ejecute el mismo comando o plantilla en múltiples dispositivos:

1. Navegue a **CMod > Operaciones Masivas**
2. Seleccione los dispositivos destino (casillas de verificación)
3. Elija una plantilla o ingrese un comando
4. Haga clic en **Ejecutar en Seleccionados**
5. Los resultados se muestran por dispositivo en una vista con pestañas

## Respaldo de Configuración vía SSH

CMod puede respaldar automáticamente las configuraciones de dispositivos:

1. Navegue a **CMod > Programación de Respaldos**
2. Haga clic en **Agregar Programación**
3. Seleccione los dispositivos a respaldar
4. Configure la programación (diario, semanal o cron personalizado)
5. Elija la plantilla de comando de respaldo (ej., "Mostrar Configuración Activa")
6. Haga clic en **Guardar**

Las configuraciones respaldadas se almacenan en el probe e incluyen:
- Marca de tiempo
- Nombre de host del dispositivo
- Diferencias de configuración respecto al respaldo anterior
- Texto completo de la configuración

## Solución de Problemas

### Conexión rechazada
- Verifique que SSH esté habilitado en el dispositivo destino
- Confirme que la dirección IP y el puerto sean correctos
- Compruebe que ningún firewall esté bloqueando la conexión entre el probe y el dispositivo

### Autenticación fallida
- Verifique que el usuario y contraseña/clave sean correctos
- Algunos dispositivos bloquean después de múltiples intentos fallidos; espere e intente de nuevo
- Compruebe si el dispositivo requiere una versión específica del protocolo SSH (SSHv2)

### Terminal colgada o sin respuesta
- El dispositivo puede estar esperando que un comando termine; presione Ctrl+C
- Verifique la configuración de tiempo de espera de comando
- Verifique que el intervalo de keep-alive esté configurado

### Comandos producen salida inesperada
- Asegúrese de que el tipo de dispositivo correcto esté seleccionado; diferentes fabricantes usan diferente sintaxis de comandos
- Algunos comandos requieren modo de privilegio elevado (ej., `enable` en Cisco)

## Preguntas Frecuentes

**P: ¿Puedo usar hosts de salto SSH / hosts bastión?**
R: Actualmente no. CMod se conecta directamente desde el probe al dispositivo destino. Asegúrese de que el probe tenga enrutamiento a todos los dispositivos gestionados.

**P: ¿Se registran las sesiones SSH?**
R: Sí. Todos los comandos ejecutados a través de CMod se registran en el rastro de auditoría con el nombre de usuario, marca de tiempo, dispositivo y texto del comando.

**P: ¿Puedo subir archivos a un dispositivo vía SSH?**
R: La transferencia de archivos SCP/SFTP está planificada para una versión futura. Actualmente, CMod solo soporta interacción por línea de comandos.

Para ayuda adicional, contacte a [support@netreconapp.com](mailto:support@netreconapp.com).
