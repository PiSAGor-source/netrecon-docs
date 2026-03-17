---
sidebar_position: 2
title: Inicio Rápido
description: Desde el desempaque hasta su primer escaneo de red en 10 minutos
---

# Guía de Inicio Rápido

Pase de cero a su primer escaneo de red en menos de 10 minutos. Esta guía asume que ya ha escrito la imagen de NetRecon OS en su dispositivo de almacenamiento.

## Lo Que Necesitará

- Un dispositivo de sonda con NetRecon OS instalado (consulte [Instalación](./installation.md))
- Un cable Ethernet conectado a su red
- Un teléfono inteligente o computadora en la misma red
- La aplicación NetRecon Scanner (opcional, para escaneo móvil)

## Minutos 0-2: Arrancar la Sonda

1. Inserte la tarjeta microSD preparada o arranque desde el almacenamiento interno
2. Conecte el cable Ethernet a su switch o router de red
3. Encienda el dispositivo
4. Espere a que el LED de estado verde quede fijo (aproximadamente 60 segundos)

## Minutos 2-5: Completar el Asistente de Configuración

1. Encuentre la dirección IP de su sonda en la tabla DHCP de su router, o verifique la salida de consola
2. Abra `http://<ip-de-la-sonda>:8080` en su navegador
3. Complete estos pasos esenciales del asistente:
   - **Establecer contraseña de administrador** — elija una contraseña segura
   - **Asignar interfaces de red** — seleccione qué puerto se conecta a su red de escaneo
   - **Elegir modo de escaneo** — seleccione "Interfaz Única" para una configuración básica
   - **Configurar Cloudflare Tunnel** (opcional) — habilita acceso remoto vía `https://probe.netreconapp.com`
4. Haga clic en **Finalizar Configuración**

## Minutos 5-7: Verificar el Dashboard de la Sonda

1. Después de que el asistente se complete, navegue a `http://<ip-de-la-sonda>:3000`
2. Inicie sesión con las credenciales de administrador que creó
3. Verifique que el dashboard muestre:
   - Estado del sistema: uso de CPU, RAM, almacenamiento
   - Interfaces de red: al menos una interfaz en rol "escaneo"
   - Servicios: los servicios principales deben mostrar estado verde

## Minutos 7-10: Ejecutar Su Primer Escaneo

### Opción A: Desde el Dashboard de la Sonda

1. Navegue a **Escaneo > Iniciar Escaneo**
2. Seleccione la subred objetivo (auto-detectada desde su interfaz de escaneo)
3. Elija el perfil de escaneo **Rápido**
4. Haga clic en **Iniciar**
5. Observe cómo aparecen los dispositivos en tiempo real en el dashboard

### Opción B: Desde la Aplicación NetRecon Scanner

1. Abra la aplicación NetRecon Scanner en su dispositivo Android
2. La aplicación detectará la sonda vía mDNS si está en la misma red
3. Alternativamente, vaya a **Configuración > Conexión de Sonda** e ingrese la IP de la sonda
4. Toque **Escanear** en la pantalla principal
5. Seleccione su red y toque **Iniciar Escaneo**

## Qué Sucede Durante un Escaneo

1. **Descubrimiento ARP** — la sonda envía solicitudes ARP para encontrar todos los hosts activos en la subred
2. **Escaneo de Puertos** — cada host descubierto se escanea en busca de puertos TCP abiertos
3. **Detección de Servicios** — los puertos abiertos se sondean para identificar el servicio en ejecución y su versión
4. **Perfilado de Dispositivos** — la sonda combina la búsqueda OUI de dirección MAC, puertos abiertos y banners de servicios para identificar el tipo de dispositivo

## Próximos Pasos

Ahora que ha completado su primer escaneo, explore estas funciones:

- [Perfiles de Escaneo](../scanner/scan-profiles.md) — personalice la profundidad y velocidad del escaneo
- [Reportes](../scanner/reports.md) — genere reportes PDF de sus resultados de escaneo
- [Admin Connect](../admin-connect/overview.md) — configure la gestión remota
- [Despliegue de Agentes](../agents/overview.md) — despliegue agentes en sus endpoints

## Preguntas Frecuentes

**P: El escaneo encontró menos dispositivos de lo esperado. ¿Por qué?**
R: Asegúrese de que la sonda esté en la VLAN/subred correcta. Los firewalls o firewalls del lado del cliente pueden bloquear las respuestas ARP. Intente ejecutar un perfil **Estándar** en lugar de **Rápido** para un descubrimiento más exhaustivo.

**P: ¿Puedo escanear múltiples subredes?**
R: Sí. Configure subredes adicionales en el dashboard de la sonda en **Configuración > Objetivos de Escaneo**. El escaneo multi-subred requiere enrutamiento apropiado o múltiples interfaces de red.

**P: ¿Cuánto tarda un escaneo?**
R: Un escaneo Rápido de una subred /24 típicamente se completa en menos de 2 minutos. Estándar tarda 5-10 minutos. Los escaneos Profundos pueden tomar 15-30 minutos dependiendo del número de hosts y puertos escaneados.

Para ayuda adicional, contacte a [support@netreconapp.com](mailto:support@netreconapp.com).
