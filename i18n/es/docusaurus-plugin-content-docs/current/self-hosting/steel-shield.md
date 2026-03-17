---
sidebar_position: 3
title: Steel Shield
description: Funciones de fortalecimiento de seguridad para despliegues autoalojados
---

# Steel Shield

Steel Shield es el marco de fortalecimiento de seguridad de NetRecon. Proporciona múltiples capas de protección para despliegues autoalojados, asegurando la integridad y autenticidad de todos los componentes de la plataforma.

## Descripción General

Steel Shield incluye cuatro mecanismos de seguridad principales:

| Característica | Propósito |
|---|---|
| **Integridad de Binarios** | Verificar que los ejecutables no hayan sido alterados |
| **Fijación de Certificados** | Prevenir ataques de intermediario en la comunicación de API |
| **Respuesta a Manipulación** | Detectar y responder a modificaciones no autorizadas |
| **Protección en Tiempo de Ejecución** | Proteger contra manipulación de memoria y depuración |

## Verificación de Integridad de Binarios

Cada binario de NetRecon (backend de sonda, agentes, servicios) está firmado digitalmente. Al iniciar, cada componente verifica su propia integridad.

### Cómo Funciona

1. Durante la compilación, cada binario se firma con una clave privada mantenida por NetRecon
2. La firma se incrusta en los metadatos del binario
3. Al iniciar, el binario calcula un hash SHA-256 de sí mismo
4. El hash se verifica contra la firma incrustada
5. Si la verificación falla, el binario se niega a iniciar y registra una alerta

### Verificación Manual

Verifique la integridad de un binario manualmente:

```bash
# Verificar el backend de la sonda
netrecon-verify /usr/local/bin/netrecon-probe

# Verificar un agente
netrecon-verify /usr/local/bin/netrecon-agent

# Salida esperada:
# Binary: /usr/local/bin/netrecon-probe
# SHA-256: a1b2c3d4e5f6...
# Signature: VALID
# Signed by: NetRecon Build System
# Signed at: 2026-03-15T10:00:00Z
```

### Verificación de Imágenes Docker

Las imágenes Docker se firman usando Docker Content Trust (DCT):

```bash
# Habilitar la confianza de contenido
export DOCKER_CONTENT_TRUST=1

# Descargar con verificación de firma
docker pull netrecon/api-gateway:latest
```

## Fijación de Certificados

La fijación de certificados asegura que los componentes de NetRecon solo se comuniquen con servidores legítimos, previniendo la interceptación incluso si una autoridad certificadora está comprometida.

### Conexiones Fijadas

| Conexión | Tipo de Fijación |
|---|---|
| Agente a Sonda | Fijación de clave pública |
| Admin Connect a Sonda | Huella digital de certificado |
| Sonda a Update Server | Fijación de clave pública |
| Sonda a License Server | Huella digital de certificado |

### Cómo Funciona

1. El hash esperado de la clave pública del certificado se incrusta en cada binario del cliente
2. Al establecer una conexión TLS, el cliente extrae la clave pública del servidor
3. El cliente calcula un hash SHA-256 de la clave pública
4. Si el hash no coincide con el valor fijado, la conexión se rechaza
5. La validación fallida del pin genera una alerta de seguridad

### Rotación de Pins

Cuando se rotan los certificados:

1. Los nuevos pins se distribuyen a través del update server antes del cambio de certificado
2. Tanto los pins antiguos como los nuevos son válidos durante el período de transición
3. Después de la transición, los pins antiguos se eliminan en la siguiente actualización

Para despliegues autoalojados, actualice los pins en la configuración:

```yaml
# /etc/netrecon/security.yaml
certificate_pins:
  api_gateway:
    - "sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="  # Actual
    - "sha256/BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB="  # Respaldo
```

## Respuesta a Manipulación

Steel Shield monitorea archivos y configuraciones críticas para detectar cambios no autorizados.

### Elementos Monitoreados

| Elemento | Frecuencia de Verificación | Respuesta |
|---|---|---|
| Archivos binarios | Al inicio + cada 1 hora | Alerta + apagado opcional |
| Archivos de configuración | Cada 5 minutos | Alerta + revertir a respaldo |
| Integridad de base de datos | Cada 15 minutos | Alerta + verificación de consistencia |
| Certificados TLS | Cada 5 minutos | Alerta si cambian |
| Paquetes del sistema | Diariamente | Alerta si hay cambios inesperados |

### Acciones de Respuesta

Cuando se detecta manipulación, Steel Shield puede:

1. **Registrar** — registrar el evento en el registro de auditoría de seguridad
2. **Alertar** — enviar una notificación a través de los canales configurados
3. **Revertir** — restaurar el archivo manipulado desde un respaldo conocido
4. **Aislar** — restringir el acceso de red solo a gestión
5. **Apagar** — detener el servicio para prevenir mayor compromiso

Configure el nivel de respuesta:

```yaml
# /etc/netrecon/security.yaml
tamper_response:
  level: "alert_and_revert"  # Opciones: log, alert, alert_and_revert, isolate, shutdown
  notify_email: "security@yourcompany.com"
```

### Base de Datos de Integridad de Archivos

Steel Shield mantiene una base de datos de hashes de todos los archivos protegidos:

```bash
# Inicializar la base de datos de integridad
netrecon-shield init

# Verificar integridad manualmente
netrecon-shield verify

# Salida esperada:
# Checked 47 files
# Status: ALL INTACT
# Last verified: 2026-03-15T14:30:00Z
```

## Protección en Tiempo de Ejecución

### Anti-Depuración

En modo producción, los binarios de NetRecon incluyen medidas anti-depuración:
- Detección de depuradores adjuntos (ptrace en Linux, IsDebuggerPresent en Windows)
- Verificaciones de tiempo para ejecución paso a paso
- Cuando se detecta depuración en producción, el proceso termina de forma controlada

:::info
La anti-depuración está deshabilitada en compilaciones de desarrollo para permitir flujos de trabajo de depuración normales.
:::

### Protección de Memoria

- Los datos sensibles (tokens, claves, contraseñas) se almacenan en regiones de memoria protegidas
- La memoria se pone a cero después del uso para prevenir exposición de datos residuales
- En Linux, se usa `mlock` para prevenir que las páginas sensibles se intercambien al disco

## Configuración

### Habilitar Steel Shield

Steel Shield está habilitado por defecto en despliegues de producción. Configúrelo en:

```yaml
# /etc/netrecon/security.yaml
steel_shield:
  enabled: true
  binary_integrity: true
  certificate_pinning: true
  tamper_response: true
  runtime_protection: true
  integrity_check_interval: 3600  # segundos
  tamper_check_interval: 300      # segundos
```

### Deshabilitar para Desarrollo

Para entornos de desarrollo y pruebas:

```yaml
steel_shield:
  enabled: false
```

O deshabilite funciones específicas:

```yaml
steel_shield:
  enabled: true
  binary_integrity: false   # Omitir verificación de hash durante desarrollo
  runtime_protection: false  # Permitir la conexión de depuradores
```

## Registro de Auditoría

Todos los eventos de Steel Shield se registran en el registro de auditoría de seguridad:

```bash
# Ver eventos de seguridad recientes
netrecon-shield audit --last 24h

# Exportar registro de auditoría
netrecon-shield audit --export csv --output security-audit.csv
```

Las entradas del registro de auditoría incluyen:
- Marca de tiempo
- Tipo de evento (integrity_check, pin_validation, tamper_detected, etc.)
- Componente afectado
- Resultado (aprobado/fallido)
- Acción tomada
- Detalles adicionales

## Consideraciones para Autoalojamiento

Al autoalojar, tenga en cuenta:

1. **Certificados personalizados**: Si usa su propia CA, actualice la configuración de fijación de certificados después del despliegue
2. **Actualizaciones de binarios**: Después de actualizar binarios, ejecute `netrecon-shield init` para reconstruir la base de datos de integridad
3. **Respalde la base de datos de integridad**: Incluya `/etc/netrecon/integrity.db` en su rutina de respaldos
4. **Monitoree las alertas**: Configure notificaciones por correo electrónico o webhook para alertas de manipulación

## Preguntas Frecuentes

**P: ¿Puede Steel Shield causar falsos positivos?**
R: Los falsos positivos son raros pero pueden ocurrir después de actualizaciones del sistema que modifiquen bibliotecas compartidas. Ejecute `netrecon-shield init` después de actualizaciones del sistema para refrescar la base de datos de integridad.

**P: ¿Steel Shield afecta el rendimiento?**
R: El impacto en el rendimiento es mínimo. Las verificaciones de integridad se ejecutan en un hilo en segundo plano y típicamente se completan en menos de 1 segundo.

**P: ¿Puedo integrar las alertas de Steel Shield con mi SIEM?**
R: Sí. Configure la salida syslog en la configuración de seguridad para reenviar eventos a su SIEM. Steel Shield soporta formatos de salida syslog (RFC 5424) y JSON.

**P: ¿Es Steel Shield obligatorio para despliegues en producción?**
R: Steel Shield es fuertemente recomendado pero no estrictamente obligatorio. Puede deshabilitarlo, pero hacerlo elimina protecciones de seguridad importantes.

Para ayuda adicional, contacte a [support@netreconapp.com](mailto:support@netreconapp.com).
