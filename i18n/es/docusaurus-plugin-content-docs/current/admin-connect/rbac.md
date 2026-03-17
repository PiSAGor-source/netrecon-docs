---
sidebar_position: 3
title: Control de Acceso Basado en Roles
description: Configure roles y permisos de usuario en Admin Connect
---

# Control de Acceso Basado en Roles (RBAC)

NetRecon utiliza control de acceso basado en roles para gestionar lo que cada usuario puede ver y hacer. Los roles se definen en la sonda y se aplican tanto en el dashboard web como en la aplicación Admin Connect.

## Requisitos Previos

- Acceso de nivel administrador al dashboard de la sonda
- Al menos una sonda inscrita en Admin Connect

## Cómo Funciona RBAC

A cada cuenta de usuario se le asigna un rol. Los roles contienen un conjunto de permisos que controlan el acceso a las funciones. Cuando un usuario inicia sesión a través de Admin Connect o el dashboard web, el sistema verifica su rol antes de permitir cualquier acción.

```
Usuario → Rol → Permisos → Acceso Concedido / Denegado
```

Los permisos se aplican tanto a nivel de interfaz (ocultando funciones no disponibles) como a nivel de API (rechazando solicitudes no autorizadas).

## Roles Predefinidos

NetRecon incluye cinco roles predefinidos:

| Rol | Descripción | Usuario Típico |
|---|---|---|
| **Super Admin** | Acceso completo a todas las funciones y configuraciones | Propietario de la plataforma |
| **Admin** | Acceso completo excepto gestión de roles y configuración del sistema | Gerente de TI |
| **Analista** | Ver resultados de escaneo, alertas, reportes; no puede modificar configuraciones | Analista de seguridad |
| **Operador** | Iniciar/detener escaneos y servicios; ver resultados | Técnico de NOC |
| **Visor** | Acceso de solo lectura a dashboards y reportes | Ejecutivo, auditor |

## Matriz de Permisos

| Permiso | Super Admin | Admin | Analista | Operador | Visor |
|---|---|---|---|---|---|
| Ver dashboard | Sí | Sí | Sí | Sí | Sí |
| Ver resultados de escaneo | Sí | Sí | Sí | Sí | Sí |
| Iniciar/detener escaneos | Sí | Sí | No | Sí | No |
| Ver alertas IDS | Sí | Sí | Sí | Sí | Sí |
| Gestionar reglas IDS | Sí | Sí | No | No | No |
| Iniciar/detener PCAP | Sí | Sí | No | Sí | No |
| Descargar archivos PCAP | Sí | Sí | Sí | No | No |
| Ejecutar escaneos de vulnerabilidades | Sí | Sí | No | Sí | No |
| Ver resultados de vulnerabilidades | Sí | Sí | Sí | Sí | Sí |
| Gestionar honeypot | Sí | Sí | No | No | No |
| Gestionar VPN | Sí | Sí | No | No | No |
| Configurar sinkhole DNS | Sí | Sí | No | No | No |
| Generar reportes | Sí | Sí | Sí | Sí | No |
| Gestionar usuarios | Sí | Sí | No | No | No |
| Gestionar roles | Sí | No | No | No | No |
| Configuración del sistema | Sí | No | No | No | No |
| Respaldo/restauración | Sí | Sí | No | No | No |
| Ver registro de auditoría | Sí | Sí | Sí | No | No |
| Tickets | Sí | Sí | Sí | Sí | No |
| Gestión de flota | Sí | Sí | No | No | No |

## Gestionar Usuarios

### Crear un Usuario

1. Inicie sesión en el dashboard de la sonda como Super Admin o Admin
2. Navegue a **Configuración > Usuarios**
3. Haga clic en **Agregar Usuario**
4. Complete los detalles del usuario:
   - Nombre de usuario
   - Dirección de correo electrónico
   - Contraseña (o enviar enlace de invitación)
   - Rol (seleccione de los roles predefinidos)
5. Haga clic en **Crear**

### Editar el Rol de un Usuario

1. Navegue a **Configuración > Usuarios**
2. Haga clic en el usuario que desea modificar
3. Cambie el menú desplegable de **Rol**
4. Haga clic en **Guardar**

### Desactivar un Usuario

1. Navegue a **Configuración > Usuarios**
2. Haga clic en el usuario
3. Cambie **Activo** a desactivado
4. Haga clic en **Guardar**

Los usuarios desactivados no pueden iniciar sesión pero su historial de auditoría se preserva.

## Roles Personalizados

Los Super Admins pueden crear roles personalizados con permisos granulares:

1. Navegue a **Configuración > Roles**
2. Haga clic en **Crear Rol**
3. Ingrese un nombre y descripción del rol
4. Active/desactive permisos individuales
5. Haga clic en **Guardar**

Los roles personalizados aparecen junto a los roles predefinidos al asignar usuarios.

## Autenticación de Dos Factores

2FA puede aplicarse por rol:

1. Navegue a **Configuración > Roles**
2. Seleccione un rol
3. Habilite **Requerir 2FA**
4. Haga clic en **Guardar**

Los usuarios con ese rol deberán configurar 2FA basado en TOTP en su próximo inicio de sesión.

## Gestión de Sesiones

Configure políticas de sesión por rol:

| Configuración | Descripción | Predeterminado |
|---|---|---|
| Tiempo de espera de sesión | Cierre automático por inactividad | 30 minutos |
| Máximo de sesiones concurrentes | Máximo de inicios de sesión simultáneos | 3 |
| Restricción de IP | Limitar inicio de sesión a rangos de IP específicos | Deshabilitado |

Configure estos bajo **Configuración > Roles > [Nombre del Rol] > Política de Sesión**.

## Registro de Auditoría

Todas las acciones relevantes de permisos se registran:

- Eventos de inicio/cierre de sesión de usuarios
- Cambios de roles
- Modificaciones de permisos
- Intentos de acceso fallidos
- Cambios de configuración

Vea el registro de auditoría en **Configuración > Registro de Auditoría**. Los registros se retienen por 90 días de forma predeterminada.

## Preguntas Frecuentes

**P: ¿Puedo modificar los roles predefinidos?**
R: No. Los roles predefinidos son de solo lectura para asegurar una línea base consistente. Cree un rol personalizado si necesita permisos diferentes.

**P: ¿Qué sucede si elimino un rol que tiene usuarios asignados?**
R: Debe reasignar todos los usuarios a un rol diferente antes de eliminar un rol personalizado. El sistema impedirá la eliminación si aún hay usuarios asignados.

**P: ¿Los roles se sincronizan entre múltiples sondas?**
R: Los roles se definen por sonda. Si gestiona múltiples sondas, necesita configurar roles en cada una. Una actualización futura soportará gestión centralizada de roles.

**P: ¿Puedo restringir un usuario a subredes o dispositivos específicos?**
R: Actualmente, los roles controlan el acceso a funciones, no el acceso a nivel de datos. Las restricciones a nivel de subred están en la hoja de ruta.

Para ayuda adicional, contacte a [support@netreconapp.com](mailto:support@netreconapp.com).
