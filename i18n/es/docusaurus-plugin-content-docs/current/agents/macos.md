---
sidebar_position: 3
title: Agente macOS
description: Instale y despliegue el agente NetRecon en macOS
---

# Agente macOS

Instale el agente NetRecon en endpoints macOS para monitoreo continuo y reportes de inventario.

## Requisitos Previos

- macOS 12 (Monterey) o posterior
- Privilegios de administrador (para la instalación)
- Conectividad de red a la sonda (directa o vía Cloudflare Tunnel)
- Un token de inscripción del dashboard de la sonda

## Instalación Manual

### Paso 1: Descargar el PKG

Descargue `netrecon-agent-macos-universal.pkg` desde el dashboard de la sonda:
1. Inicie sesión en el dashboard de la sonda
2. Navegue a **Agentes > Descargas**
3. Haga clic en **macOS (PKG)**

El paquete es un binario universal que soporta tanto Intel (x86_64) como Apple Silicon (arm64).

### Paso 2: Ejecutar el Instalador

1. Haga doble clic en el archivo PKG descargado
2. Siga el asistente de instalación
3. Cuando se le solicite, ingrese:
   - **URL del Servidor**: la URL de su sonda
   - **Token de Inscripción**: pegue el token del dashboard de la sonda
4. Ingrese su contraseña de administrador de macOS cuando se le solicite
5. Haga clic en **Instalar** y espere a que se complete

El agente se instala en `/Library/NetRecon/Agent/` y se registra como un servicio launchd.

### Paso 3: Verificar la Instalación

Abra Terminal:

```bash
sudo launchctl list | grep netrecon
```

Debería ver `com.netrecon.agent` en la salida. Verifique la inscripción en el dashboard de la sonda bajo **Agentes**.

## Instalación por Línea de Comandos

Para instalación por script:

```bash
sudo installer -pkg netrecon-agent-macos-universal.pkg -target /

# Configurar el agente
sudo /Library/NetRecon/Agent/netrecon-agent configure \
  --server-url "https://probe.netreconapp.com" \
  --enrollment-token "su-token-aquí"

# Iniciar el agente
sudo launchctl load /Library/LaunchDaemons/com.netrecon.agent.plist
```

## Despliegue Jamf

Despliegue el agente a escala usando Jamf Pro.

### Paso 1: Subir el Paquete

1. Inicie sesión en Jamf Pro
2. Navegue a **Configuración > Gestión de Computadoras > Paquetes**
3. Haga clic en **Nuevo**
4. Suba `netrecon-agent-macos-universal.pkg`
5. Guarde el paquete

### Paso 2: Crear una Política

1. Navegue a **Computadoras > Políticas**
2. Haga clic en **Nuevo**
3. Configure la política:
   - **General**: Nómbrela "Despliegue de Agente NetRecon"
   - **Paquetes**: Agregue el PKG del agente NetRecon, establezca en **Instalar**
   - **Scripts**: Agregue un script post-instalación (ver abajo)
   - **Alcance**: Dirija a los grupos de computadoras deseados
   - **Activador**: Establezca en **Inscripción Completa** y/o **Check-in Recurrente**

### Script Post-Instalación

```bash
#!/bin/bash
/Library/NetRecon/Agent/netrecon-agent configure \
  --server-url "https://probe.netreconapp.com" \
  --enrollment-token "su-token-de-flota"

launchctl load /Library/LaunchDaemons/com.netrecon.agent.plist
```

### Paso 3: Desplegar

1. Guarde la política
2. Monitoree el despliegue en **Computadoras > Registros de Políticas**

## Despliegue MDM

Despliegue a través de cualquier solución MDM que soporte distribución de PKG.

### Perfil de Configuración

Cree un perfil de configuración para preconfigurar el agente:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>PayloadContent</key>
  <array>
    <dict>
      <key>PayloadType</key>
      <string>com.netrecon.agent</string>
      <key>ServerURL</key>
      <string>https://probe.netreconapp.com</string>
      <key>EnrollmentToken</key>
      <string>su-token-de-flota</string>
      <key>HeartbeatInterval</key>
      <integer>30</integer>
      <key>ReportInterval</key>
      <integer>900</integer>
    </dict>
  </array>
  <key>PayloadDisplayName</key>
  <string>Configuración del Agente NetRecon</string>
  <key>PayloadIdentifier</key>
  <string>com.netrecon.agent.config</string>
  <key>PayloadType</key>
  <string>Configuration</string>
  <key>PayloadVersion</key>
  <integer>1</integer>
</dict>
</plist>
```

Despliegue este perfil junto con el paquete PKG a través de su MDM.

## Permisos de macOS

El agente puede requerir los siguientes permisos de macOS:

| Permiso | Propósito | Cómo Otorgar |
|---|---|---|
| Acceso Completo al Disco | Leer la lista de software instalado | Configuración del Sistema > Privacidad y Seguridad |
| Acceso a Red | Enviar datos a la sonda | Otorgado automáticamente |

Para despliegues gestionados por MDM, otorgue Acceso Completo al Disco mediante un perfil PPPC (Control de Políticas de Preferencias de Privacidad):

```xml
<key>Services</key>
<dict>
  <key>SystemPolicyAllFiles</key>
  <array>
    <dict>
      <key>Identifier</key>
      <string>com.netrecon.agent</string>
      <key>IdentifierType</key>
      <string>bundleID</string>
      <key>Allowed</key>
      <true/>
    </dict>
  </array>
</dict>
```

## Gestión del Agente

### Archivo de Configuración

```
/Library/NetRecon/Agent/config.yaml
```

```yaml
server_url: "https://probe.netreconapp.com"
heartbeat_interval: 30
report_interval: 900
log_level: "info"
log_file: "/Library/NetRecon/Agent/logs/agent.log"
```

### Comandos del Servicio

```bash
# Detener el agente
sudo launchctl unload /Library/LaunchDaemons/com.netrecon.agent.plist

# Iniciar el agente
sudo launchctl load /Library/LaunchDaemons/com.netrecon.agent.plist

# Verificar estado
sudo launchctl list | grep netrecon
```

### Desinstalación

```bash
# Detener el servicio
sudo launchctl unload /Library/LaunchDaemons/com.netrecon.agent.plist

# Eliminar archivos
sudo rm -rf /Library/NetRecon/Agent/
sudo rm /Library/LaunchDaemons/com.netrecon.agent.plist

# Eliminar recibos
sudo pkgutil --forget com.netrecon.agent
```

## Resolución de Problemas

### El agente no inicia después de la instalación
- Revise el registro del sistema: `log show --predicate 'subsystem == "com.netrecon.agent"' --last 5m`
- Verifique que el plist exista: `ls -la /Library/LaunchDaemons/com.netrecon.agent.plist`
- Revise los permisos del archivo del binario del agente

### Errores de permiso denegado en el registro
- Otorgue Acceso Completo al Disco como se describe arriba
- Para MDM, despliegue el perfil PPPC antes de instalar el agente

### El agente no se conecta a la sonda
- Verifique la URL del servidor: `curl -I https://probe.netreconapp.com/api/health`
- Compruebe si el firewall de macOS está bloqueando conexiones salientes
- Verifique que el token de inscripción sea válido

## Preguntas Frecuentes

**P: ¿El agente soporta Apple Silicon de forma nativa?**
R: Sí. El PKG es un binario universal que se ejecuta de forma nativa tanto en Macs Intel como Apple Silicon.

**P: ¿El agente funciona en máquinas virtuales macOS?**
R: Sí, el agente funciona en máquinas virtuales VMware Fusion, Parallels y UTM.

**P: ¿Gatekeeper de macOS bloqueará la instalación?**
R: El PKG está firmado y notarizado por Apple. Si instala manualmente y Gatekeeper lo bloquea, haga clic derecho en el PKG y seleccione **Abrir** para omitir la advertencia.

Para ayuda adicional, contacte a [support@netreconapp.com](mailto:support@netreconapp.com).
