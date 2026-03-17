---
sidebar_position: 2
title: Inscripción
description: Inscriba sondas en Admin Connect mediante código QR o configuración manual
---

# Inscripción de Sondas

La inscripción es el proceso de conectar una sonda a su aplicación Admin Connect. Una vez inscrita, puede monitorear y gestionar la sonda de forma remota desde cualquier lugar.

## Requisitos Previos

- Aplicación Admin Connect instalada en su dispositivo Android
- Una NetRecon Probe que haya completado el asistente de configuración
- Acceso a internet tanto en la sonda como en su dispositivo móvil

## Método 1: Inscripción por Código QR

La inscripción por código QR es el método más rápido y confiable. El código QR contiene los detalles de conexión de la sonda y el token de autenticación en formato cifrado.

### Paso 1: Mostrar el Código QR

El código QR está disponible en dos lugares:

**Durante el Asistente de Configuración:**
Al final del asistente (Paso 11), se muestra un código QR en la pantalla de resumen.

**Desde el Dashboard de la Sonda:**
1. Inicie sesión en el dashboard de la sonda en `https://<ip-de-la-sonda>:3000`
2. Navegue a **Configuración > Acceso Remoto**
3. Haga clic en **Generar Código QR de Inscripción**
4. Se mostrará un código QR en pantalla

### Paso 2: Escanear el Código QR

1. Abra Admin Connect
2. Toque el botón **+** para agregar una nueva sonda
3. Seleccione **Escanear Código QR**
4. Apunte su cámara al código QR mostrado en la sonda
5. La aplicación analizará automáticamente los detalles de conexión

### Paso 3: Verificar y Conectar

1. Revise los detalles de la sonda mostrados en la aplicación (nombre de host, IP, URL del túnel)
2. Toque **Conectar**
3. La aplicación establecerá una conexión segura con la sonda
4. Una vez conectada, la sonda aparece en su dashboard de flota

### Contenido del Código QR

El código QR codifica un payload JSON que contiene:

```json
{
  "hostname": "netrecon-hq",
  "tunnel_url": "https://probe.netreconapp.com",
  "token": "<token-de-inscripción>",
  "fingerprint": "<huella-digital-del-certificado>",
  "version": "2.2.0"
}
```

El token de inscripción es de un solo uso y expira después de 24 horas.

## Método 2: Inscripción Manual

Use la inscripción manual cuando no puede acceder físicamente a la sonda para escanear un código QR.

### Paso 1: Obtener los Detalles de Conexión

Necesitará lo siguiente de su administrador de sonda:
- **URL del Túnel**: típicamente `https://probe.netreconapp.com` o un dominio personalizado
- **Token de Inscripción**: una cadena alfanumérica de 32 caracteres
- **Huella Digital del Certificado** (opcional): para verificación de fijación de certificados

### Paso 2: Ingresar los Detalles en Admin Connect

1. Abra Admin Connect
2. Toque el botón **+** para agregar una nueva sonda
3. Seleccione **Configuración Manual**
4. Ingrese los campos requeridos:
   - **Nombre de la Sonda**: un nombre descriptivo para identificación
   - **URL del Túnel**: la URL HTTPS de la sonda
   - **Token de Inscripción**: pegue el token proporcionado por su administrador
5. Toque **Conectar**

### Paso 3: Verificar la Conexión

1. La aplicación intentará conectar y autenticar
2. Si tiene éxito, se mostrarán los detalles de la sonda
3. Toque **Agregar a la Flota** para confirmar

## Inscripción Empresarial

Para despliegues a gran escala, Admin Connect soporta inscripción masiva:

### Configuración Gestionada por MDM

Despliegue la configuración de inscripción a través de su solución MDM:

```xml
<managedAppConfiguration>
  <key>probe_url</key>
  <value>https://probe.netreconapp.com</value>
  <key>enrollment_token</key>
  <value>su-token-de-inscripción</value>
  <key>auto_enroll</key>
  <value>true</value>
</managedAppConfiguration>
```

### Token de Inscripción de Flota

Genere un token de inscripción reutilizable desde el dashboard de la sonda:

1. Navegue a **Configuración > Acceso Remoto > Inscripción de Flota**
2. Haga clic en **Generar Token de Flota**
3. Establezca una fecha de expiración y un número máximo de inscripciones
4. Distribuya el token a su equipo

Los tokens de flota pueden ser utilizados por múltiples instancias de Admin Connect para inscribir la misma sonda.

## Gestionar Sondas Inscritas

### Ver Sondas Inscritas

Todas las sondas inscritas aparecen en la pantalla principal de Admin Connect. Cada sonda muestra:
- Estado de conexión (en línea/fuera de línea)
- Marca de tiempo de última actividad
- Resumen de estado (CPU, RAM, disco)
- Conteo de alertas activas

### Eliminar una Sonda

1. Mantenga presionada la sonda en la lista de flota
2. Seleccione **Eliminar Sonda**
3. Confirme la eliminación

Esto elimina la sonda solo de su aplicación. La sonda en sí no se ve afectada.

### Re-inscripción

Si necesita re-inscribir una sonda (ej., después de una rotación de tokens):
1. Elimine la sonda de Admin Connect
2. Genere un nuevo código QR o token de inscripción en la sonda
3. Re-inscriba usando cualquiera de los métodos anteriores

## Resolución de Problemas

### El escaneo del código QR falla
- Asegúrese de tener iluminación adecuada y mantenga la cámara firme
- Intente aumentar el brillo de pantalla en el dispositivo que muestra el código QR
- Si la cámara no puede enfocar, intente acercarse o alejarse de la pantalla

### Tiempo de espera de conexión
- Verifique que la sonda tenga acceso a internet y que Cloudflare Tunnel esté activo
- Compruebe que ningún firewall esté bloqueando HTTPS saliente (puerto 443) en su dispositivo móvil
- Intente cambiar entre Wi-Fi y datos móviles

### Token expirado
- Los tokens de inscripción expiran después de 24 horas
- Genere un nuevo código QR o token desde el dashboard de la sonda

## Preguntas Frecuentes

**P: ¿Múltiples usuarios pueden inscribir la misma sonda?**
R: Sí. Cada usuario se inscribe de forma independiente y recibe su propia sesión. El acceso se controla por el rol asignado a cada usuario (consulte [RBAC](./rbac.md)).

**P: ¿La inscripción funciona en red local sin internet?**
R: La inscripción manual puede funcionar en red local usando la dirección IP local de la sonda en lugar de la URL del túnel. La inscripción por QR también funciona localmente.

**P: ¿Cómo roto los tokens de inscripción?**
R: Navegue a **Configuración > Acceso Remoto** en el dashboard de la sonda y haga clic en **Rotar Token**. Esto invalida todos los tokens anteriores.

Para ayuda adicional, contacte a [support@netreconapp.com](mailto:support@netreconapp.com).
