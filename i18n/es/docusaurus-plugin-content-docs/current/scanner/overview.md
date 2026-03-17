---
sidebar_position: 1
title: Descripción General del Scanner
description: Aplicación NetRecon Scanner — escáner de red independiente para Android
---

# NetRecon Scanner

NetRecon Scanner es una herramienta independiente de auditoría de seguridad de red para Android. Funciona de manera independiente en su dispositivo Android sin requerir una sonda, lo que la hace ideal para trabajo de campo, evaluaciones rápidas y reconocimiento de red en movimiento.

## Características Principales

- **Descubrimiento ARP** — encuentre todos los dispositivos en la red local usando solicitudes ARP
- **Escaneo de Puertos** — escanee puertos TCP para encontrar servicios abiertos en los hosts descubiertos
- **Detección de Servicios** — identifique servicios en ejecución y sus versiones mediante captura de banners
- **Perfilado de Dispositivos** — clasifique dispositivos combinando búsqueda OUI, puertos abiertos y firmas de servicios
- **Mapa de Calor WiFi** — visualice la intensidad de señal inalámbrica en ubicaciones físicas
- **Reportes PDF** — genere reportes profesionales de auditoría de seguridad
- **Terminal SSH** — conéctese a dispositivos directamente desde la aplicación
- **Inteligencia CVE** — base de datos CVE sin conexión para consulta de vulnerabilidades
- **Mapa de Superficie de Ataque** — representación visual de la exposición de la red
- **Monitor Pasivo** — monitoreo continuo en segundo plano para nuevos dispositivos
- **11 Idiomas** — soporte completo de localización

## Modos de Operación

NetRecon Scanner soporta tres modos de operación, dependiendo de las capacidades de su dispositivo:

### Modo Estándar
Funciona en cualquier dispositivo Android sin permisos especiales. Usa APIs de red estándar de Android para descubrimiento y escaneo.

### Modo Shizuku
Aprovecha el servicio [Shizuku](https://shizuku.rikka.app/) para acceso de red elevado sin root. Habilita escaneo ARP más rápido y acceso a sockets crudos.

### Modo Root
Acceso completo a todas las capacidades de red. Habilita la velocidad de escaneo más rápida, captura en modo promiscuo y funciones avanzadas como detección de ARP spoofing.

| Característica | Estándar | Shizuku | Root |
|---|---|---|---|
| Descubrimiento ARP | Lento | Rápido | Más rápido |
| Escaneo de puertos | Sí | Sí | Sí |
| Sockets crudos | No | Sí | Sí |
| Captura PCAP | No | Limitada | Completa |
| Monitoreo pasivo | Limitado | Sí | Sí |

## Tipos de Escaneo

### Descubrimiento ARP
Envía solicitudes ARP a cada IP en la subred objetivo para identificar hosts activos. Este es el método más rápido y confiable para descubrir dispositivos en una red local.

### Escaneo de Puertos TCP
Se conecta a puertos TCP especificados en cada host descubierto. Soporta rangos de puertos configurables y límites de conexiones concurrentes.

### Detección de Servicios
Después de encontrar puertos abiertos, el escáner envía sondas específicas de protocolo para identificar el servicio en ejecución. Reconoce cientos de servicios comunes incluyendo HTTP, SSH, FTP, SMB, RDP, bases de datos y más.

### Perfilado de Dispositivos
Combina múltiples fuentes de datos para identificar qué es un dispositivo:
- Búsqueda OUI (fabricante) de dirección MAC
- Coincidencia de huella digital de puertos abiertos
- Análisis de banners de servicios
- Anuncios de servicios mDNS/SSDP

## Integración con la Sonda

Aunque el Scanner funciona de forma independiente, también puede conectarse a una NetRecon Probe para capacidades mejoradas:

- Ver resultados de escaneo de la sonda junto con los escaneos locales
- Activar escaneos remotos desde la aplicación
- Acceder a alertas IDS y datos de vulnerabilidades de la sonda
- Combinar datos locales y de la sonda en reportes

Para conectarse a una sonda, vaya a **Configuración > Conexión de Sonda** e ingrese la dirección IP de la sonda o escanee el código QR del dashboard de la sonda.

## Rendimiento

El escáner está optimizado para dispositivos móviles:
- Máximo 40 conexiones de socket concurrentes (adaptativo según el nivel de batería)
- El perfilado intensivo en CPU se ejecuta en un isolate dedicado para mantener la UI responsiva
- La base de datos OUI se carga de forma diferida con una caché LRU (500 entradas)
- Escaneo con reconocimiento de batería que reduce la concurrencia cuando la batería está baja

## Preguntas Frecuentes

**P: ¿El Scanner requiere acceso a internet?**
R: No. Todas las funciones de escaneo funcionan sin conexión. Internet solo se necesita para la descarga inicial de la base de datos CVE y sus actualizaciones.

**P: ¿Puedo escanear redes a las que no estoy conectado?**
R: El Scanner solo puede descubrir dispositivos en la red a la que su dispositivo Android está actualmente conectado vía Wi-Fi. Para escanear redes remotas, use una sonda.

**P: ¿Qué tan preciso es el perfilado de dispositivos?**
R: El perfilado de dispositivos identifica correctamente el tipo de dispositivo en aproximadamente el 85-90% de los casos. La precisión mejora cuando se detectan más puertos y servicios (use el perfil de escaneo Estándar o Profundo).

Para ayuda adicional, contacte a [support@netreconapp.com](mailto:support@netreconapp.com).
