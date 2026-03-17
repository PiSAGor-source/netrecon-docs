---
sidebar_position: 2
title: Importar desde Escaneo
description: Importar automáticamente IPs descubiertas de resultados de escaneo a IPAM
---

# Importar desde Escaneo

IPAM puede importar automáticamente dispositivos descubiertos de los resultados de escaneo, eliminando la entrada manual de datos y asegurando que su inventario de IP se mantenga actualizado.

## Requisitos Previos

- Al menos un escaneo de red completado con resultados
- La subred destino definida en IPAM (o disposición para crear una durante la importación)
- Rol de Analista, Operador, Administrador o Super Administrador

## Cómo Funciona la Importación

Cuando importa resultados de escaneo a IPAM:

1. Cada dirección IP descubierta se verifica contra los registros existentes de IPAM
2. Las IPs nuevas se crean con estado "Asignada"
3. Las IPs existentes se actualizan con la dirección MAC, nombre de host y marca de tiempo "Última Vez Visto" más recientes
4. Los conflictos (ej., dirección MAC cambió para una IP) se marcan para revisión
5. Un reporte resumen muestra qué se importó y qué necesita atención

## Importación Paso a Paso

### Paso 1: Abrir el Diálogo de Importación

**Desde IPAM:**
1. Navegue a **IPAM > Subredes**
2. Seleccione la subred destino
3. Haga clic en **Importar desde Escaneo**

**Desde Resultados de Escaneo:**
1. Navegue a **Escaneo > Resultados**
2. Seleccione un escaneo completado
3. Haga clic en **Exportar a IPAM**

### Paso 2: Seleccionar el Escaneo

Elija qué resultados de escaneo importar:

| Opción | Descripción |
|---|---|
| Escaneo más reciente | Importar del escaneo más reciente |
| Escaneo específico | Elegir un escaneo por fecha/hora |
| Todos los escaneos (fusionar) | Combinar resultados de múltiples escaneos |

### Paso 3: Revisar Vista Previa de Importación

Antes de importar, revise la tabla de vista previa:

| Columna | Descripción |
|---|---|
| Dirección IP | La IP descubierta |
| Dirección MAC | MAC asociada |
| Nombre de Host | Nombre de host descubierto |
| Acción | Nuevo / Actualizar / Conflicto |
| Detalles | Qué cambiará |

- **Nuevo** — esta IP no existe en IPAM y será creada
- **Actualizar** — esta IP existe y será actualizada con nuevos datos
- **Conflicto** — esta IP tiene datos en conflicto (ver Resolución de Conflictos más abajo)

### Paso 4: Resolver Conflictos

Los conflictos ocurren cuando:

- **Discrepancia de dirección MAC** — la IP existe en IPAM con una dirección MAC diferente a la encontrada en el escaneo
- **MAC duplicada** — la misma dirección MAC aparece en múltiples IPs
- **Conflicto de estado** — la IP está marcada como "Reservada" en IPAM pero se encontró activa en el escaneo

Para cada conflicto, elija una resolución:

| Resolución | Acción |
|---|---|
| **Mantener IPAM** | Ignorar los datos del escaneo, mantener el registro existente de IPAM |
| **Usar Escaneo** | Sobrescribir datos de IPAM con resultados del escaneo |
| **Marcar para Revisión** | Importar los datos pero marcarlos como "Necesita Revisión" |

### Paso 5: Importar

1. Después de resolver todos los conflictos, haga clic en **Importar**
2. Una barra de progreso muestra el estado de la importación
3. Al completar, se muestra un resumen:
   - IPs creadas
   - IPs actualizadas
   - Conflictos resueltos
   - Errores (si los hay)

## Importación Automática

Configure la importación automática después de cada escaneo:

1. Navegue a **IPAM > Configuración > Importación Automática**
2. Habilite **Importar automáticamente resultados de escaneo**
3. Configure las opciones:

| Opción | Predeterminado | Descripción |
|---|---|---|
| Crear nuevas IPs | Sí | Crear automáticamente nuevos registros de IP |
| Actualizar existentes | Sí | Actualizar registros existentes con datos frescos |
| Manejo de conflictos | Marcar para Revisión | Qué hacer con los conflictos |
| Auto-crear subred | No | Crear subred en IPAM si no existe |

4. Haga clic en **Guardar**

Con la importación automática habilitada, IPAM se mantiene sincronizado con sus datos de escaneo sin intervención manual.

## Importar desde CSV

También puede importar datos de IP desde fuentes externas:

1. Navegue a **IPAM > Importar > CSV**
2. Descargue la plantilla CSV
3. Complete sus datos siguiendo el formato de la plantilla:

```csv
ip_address,mac_address,hostname,status,owner,notes
192.168.1.10,AA:BB:CC:DD:EE:01,fileserver,Assigned,IT Dept,Primary NAS
192.168.1.11,AA:BB:CC:DD:EE:02,printer-01,Assigned,Office,2nd floor
192.168.1.20,,reserved-ip,Reserved,IT Dept,Future use
```

4. Suba el CSV y revise la vista previa
5. Resuelva cualquier conflicto
6. Haga clic en **Importar**

## Enriquecimiento de Datos

Durante la importación, IPAM enriquece automáticamente los datos:

| Campo | Fuente |
|---|---|
| Fabricante | Búsqueda en base de datos OUI desde dirección MAC |
| Tipo de Dispositivo | Datos de perfilado del motor de escaneo |
| Puertos Abiertos | Resultados de escaneo de puertos |
| Servicios | Resultados de detección de servicios |
| Última Vez Visto | Marca de tiempo del escaneo |

## Preguntas Frecuentes

**P: ¿La importación sobrescribirá mis notas manuales y asignaciones de propietario?**
R: No. La importación solo actualiza campos técnicos (MAC, nombre de host, Última Vez Visto). Los campos personalizados como Propietario, Notas y Estado se preservan a menos que elija explícitamente "Usar Escaneo" para un conflicto.

**P: ¿Puedo deshacer una importación?**
R: Sí. Cada importación crea una instantánea. Navegue a **IPAM > Historial de Importaciones** y haga clic en **Revertir** en la importación que desea deshacer.

**P: ¿Qué pasa con las IPs que estaban en IPAM pero no se encontraron en el escaneo?**
R: Permanecen sin cambios. Un dispositivo que no aparece en un escaneo no significa que haya desaparecido — puede estar apagado o en una VLAN diferente. Use el reporte "IP Obsoleta" (**IPAM > Reportes > IPs Obsoletas**) para encontrar IPs que no han sido vistas durante un período configurable.

**P: ¿Puedo importar desde múltiples subredes a la vez?**
R: Sí. Si su escaneo cubre múltiples subredes, la importación distribuirá las IPs a las subredes IPAM correctas basándose en sus direcciones. Las subredes deben existir previamente en IPAM (o habilite "Auto-crear subred" en la configuración de importación automática).

Para ayuda adicional, contacte a [support@netreconapp.com](mailto:support@netreconapp.com).
