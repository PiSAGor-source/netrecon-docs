---
sidebar_position: 2
title: Agente Windows
description: Instale y despliegue el agente NetRecon en Windows
---

# Agente Windows

Instale el agente NetRecon en endpoints Windows para monitoreo continuo y reportes de inventario.

## Requisitos Previos

- Windows 10 o posterior / Windows Server 2016 o posterior
- Privilegios de administrador local (para la instalación)
- Conectividad de red a la sonda (directa o vía Cloudflare Tunnel)
- Un token de inscripción del dashboard de la sonda

## Instalación Manual

### Paso 1: Descargar el MSI

Descargue `netrecon-agent-windows-x64.msi` desde el dashboard de la sonda:
1. Inicie sesión en el dashboard de la sonda
2. Navegue a **Agentes > Descargas**
3. Haga clic en **Windows (MSI)**

### Paso 2: Ejecutar el Instalador

1. Haga doble clic en el archivo MSI descargado
2. Haga clic en **Siguiente** en la pantalla de bienvenida
3. Ingrese los detalles de configuración:
   - **URL del Servidor**: la URL de su sonda (ej., `https://probe.netreconapp.com`)
   - **Token de Inscripción**: pegue el token del dashboard de la sonda
4. Haga clic en **Instalar**
5. Haga clic en **Finalizar** cuando la instalación se complete

El agente se instala en `C:\Program Files\NetRecon\Agent\` y se registra como un servicio de Windows llamado `NetReconAgent`.

### Paso 3: Verificar la Instalación

Abra un Símbolo del Sistema como Administrador:

```powershell
sc query NetReconAgent
```

El servicio debería mostrar `STATE: RUNNING`.

Verifique el estado de inscripción en el dashboard de la sonda bajo **Agentes** — el nuevo endpoint debería aparecer dentro de 30 segundos.

## Instalación Silenciosa

Para instalación por script o desatendida:

```powershell
msiexec /i netrecon-agent-windows-x64.msi /quiet /norestart SERVER_URL="https://probe.netreconapp.com" ENROLLMENT_TOKEN="su-token-aquí"
```

## Despliegue SCCM

Despliegue el agente en miles de endpoints Windows usando Microsoft SCCM (System Center Configuration Manager).

### Paso 1: Crear el Paquete

1. Abra la Consola de SCCM
2. Navegue a **Biblioteca de Software > Gestión de Aplicaciones > Aplicaciones**
3. Haga clic en **Crear Aplicación**
4. Seleccione **Windows Installer (archivo MSI)** y busque el MSI
5. Complete el asistente con el siguiente comando de instalación:

```
msiexec /i netrecon-agent-windows-x64.msi /quiet /norestart SERVER_URL="https://probe.netreconapp.com" ENROLLMENT_TOKEN="su-token-de-flota"
```

### Paso 2: Configurar la Detección

Establezca la regla de detección:
- **Tipo**: Sistema de archivos
- **Ruta**: `C:\Program Files\NetRecon\Agent\`
- **Archivo**: `netrecon-agent.exe`
- **Propiedad**: El archivo existe

### Paso 3: Desplegar

1. Haga clic derecho en la aplicación y seleccione **Desplegar**
2. Elija su colección de dispositivos objetivo
3. Establezca el propósito del despliegue como **Requerido**
4. Configure la programación
5. Haga clic en **Siguiente** a través del asistente y despliegue

## Despliegue Intune

Despliegue vía Microsoft Intune para endpoints gestionados en la nube.

### Paso 1: Preparar el Paquete

1. Convierta el MSI a un paquete `.intunewin` usando la [herramienta de preparación de contenido Win32 de Intune](https://github.com/Microsoft/Microsoft-Win32-Content-Prep-Tool):

```powershell
IntuneWinAppUtil.exe -c .\source -s netrecon-agent-windows-x64.msi -o .\output
```

### Paso 2: Crear la Aplicación en Intune

1. Vaya a **Centro de Administración de Microsoft Intune > Aplicaciones > Windows**
2. Haga clic en **Agregar > Aplicación Windows (Win32)**
3. Suba el archivo `.intunewin`
4. Configure:
   - **Comando de instalación**: `msiexec /i netrecon-agent-windows-x64.msi /quiet /norestart SERVER_URL="https://probe.netreconapp.com" ENROLLMENT_TOKEN="su-token-de-flota"`
   - **Comando de desinstalación**: `msiexec /x {product-code} /quiet`
   - **Regla de detección**: El archivo existe en `C:\Program Files\NetRecon\Agent\netrecon-agent.exe`

### Paso 3: Asignar

1. Asigne a un grupo de dispositivos o todos los dispositivos
2. Establezca como **Requerido** para despliegue automático
3. Monitoree el estado del despliegue en el portal de Intune

## Despliegue GPO

Despliegue usando Group Policy para entornos de Active Directory.

### Paso 1: Preparar el Recurso Compartido

1. Copie el MSI a un recurso compartido de red accesible por todas las máquinas objetivo:
   ```
   \\fileserver\software\netrecon\netrecon-agent-windows-x64.msi
   ```
2. Asegúrese de que el recurso compartido tenga permisos de Lectura para **Equipos del Dominio**

### Paso 2: Crear el GPO

1. Abra la **Consola de Administración de Group Policy**
2. Cree un nuevo GPO vinculado a la OU objetivo
3. Navegue a **Configuración del Equipo > Directivas > Configuración de Software > Instalación de Software**
4. Haga clic derecho y seleccione **Nuevo > Paquete**
5. Busque el MSI en el recurso compartido de red
6. Seleccione el método de despliegue **Asignado**

### Paso 3: Configurar Parámetros

Dado que la instalación de software por GPO no soporta propiedades MSI directamente, cree un archivo de transformación (MST) o use un script de inicio en su lugar:

Cree un script de inicio en `\\fileserver\scripts\install-netrecon-agent.bat`:

```batch
@echo off
if not exist "C:\Program Files\NetRecon\Agent\netrecon-agent.exe" (
    msiexec /i "\\fileserver\software\netrecon\netrecon-agent-windows-x64.msi" /quiet /norestart SERVER_URL="https://probe.netreconapp.com" ENROLLMENT_TOKEN="su-token-de-flota"
)
```

Asigne este script en **Configuración del Equipo > Directivas > Configuración de Windows > Scripts > Inicio**.

## Gestión del Agente

### Archivo de Configuración

La configuración del agente se almacena en:
```
C:\Program Files\NetRecon\Agent\config.yaml
```

```yaml
server_url: "https://probe.netreconapp.com"
heartbeat_interval: 30
report_interval: 900
log_level: "info"
log_file: "C:\\Program Files\\NetRecon\\Agent\\logs\\agent.log"
```

### Comandos del Servicio

```powershell
# Detener el agente
net stop NetReconAgent

# Iniciar el agente
net start NetReconAgent

# Reiniciar el agente
net stop NetReconAgent && net start NetReconAgent
```

### Desinstalación

Vía Panel de Control:
1. Abra **Configuración > Aplicaciones > Aplicaciones instaladas**
2. Busque "NetRecon Agent"
3. Haga clic en **Desinstalar**

Vía línea de comandos:
```powershell
msiexec /x netrecon-agent-windows-x64.msi /quiet
```

## Resolución de Problemas

### El agente no aparece en el dashboard
- Verifique que el servicio esté ejecutándose: `sc query NetReconAgent`
- Revise el registro del agente: `C:\Program Files\NetRecon\Agent\logs\agent.log`
- Verifique que SERVER_URL sea correcta y accesible
- Asegúrese de que el token de inscripción sea válido y no haya expirado

### El servicio no inicia
- Revise el Visor de Eventos de Windows para errores bajo el registro de **Aplicación**
- Verifique que el archivo config.yaml sea YAML válido
- Asegúrese de que el puerto 443 saliente no esté bloqueado por un firewall

### Alto uso de recursos
- Revise el registro en busca de errores que causen reintentos rápidos
- Verifique que los intervalos de heartbeat y reporte no estén configurados demasiado bajos
- Reinicie el servicio para limpiar cualquier estado acumulado

## Preguntas Frecuentes

**P: ¿El agente funciona en Windows ARM (ej., Surface Pro X)?**
R: Actualmente, el agente soporta solo la arquitectura x64. El soporte para ARM64 está planificado.

**P: ¿Puedo instalar el agente junto con otros agentes de monitoreo?**
R: Sí. El agente NetRecon está diseñado para coexistir con otras herramientas de monitoreo sin conflictos.

**P: ¿El agente sobrevive a las actualizaciones y reinicios de Windows?**
R: Sí. El agente se ejecuta como un servicio de Windows configurado para inicio automático, por lo que se reinicia después de cualquier reinicio.

Para ayuda adicional, contacte a [support@netreconapp.com](mailto:support@netreconapp.com).
