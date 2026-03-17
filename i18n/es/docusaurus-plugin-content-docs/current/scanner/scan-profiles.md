---
sidebar_position: 2
title: Perfiles de Escaneo
description: Configure la profundidad y velocidad del escaneo con perfiles
---

# Perfiles de Escaneo

Los perfiles de escaneo le permiten controlar el balance entre velocidad y profundidad del escaneo. NetRecon incluye cuatro perfiles integrados, y puede crear perfiles personalizados para casos de uso específicos.

## Perfiles Integrados

### Rápido

El perfil más rápido, diseñado para descubrimiento rápido de hosts con escaneo de puertos mínimo.

| Configuración | Valor |
|---|---|
| Descubrimiento ARP | Sí |
| Rango de puertos | Top 100 puertos |
| Detección de servicios | Básica (solo servicios comunes) |
| Perfilado de dispositivos | OUI + huella digital de puertos |
| Tiempo estimado (/24) | 1-2 minutos |

**Ideal para:** Verificación rápida de inventario, confirmar que un dispositivo está en línea, reconocimiento inicial.

### Estándar

Un perfil equilibrado que proporciona buena cobertura sin tiempo de escaneo excesivo.

| Configuración | Valor |
|---|---|
| Descubrimiento ARP | Sí |
| Rango de puertos | Top 1,000 puertos |
| Detección de servicios | Captura completa de banners |
| Perfilado de dispositivos | Completo (OUI + puertos + banners) |
| Tiempo estimado (/24) | 5-10 minutos |

**Ideal para:** Auditorías de red regulares, evaluaciones de seguridad rutinarias, escaneo de propósito general.

### Profundo

Escaneo exhaustivo que verifica todos los puertos comunes y realiza un análisis de servicios detallado.

| Configuración | Valor |
|---|---|
| Descubrimiento ARP | Sí |
| Rango de puertos | 1-10,000 |
| Detección de servicios | Captura completa de banners + detección de versiones |
| Perfilado de dispositivos | Completo con referencia cruzada CVE |
| Tiempo estimado (/24) | 15-30 minutos |

**Ideal para:** Auditorías de seguridad exhaustivas, verificaciones de cumplimiento, documentación detallada de red.

### Personalizado

Cree su propio perfil con control total sobre cada parámetro de escaneo.

## Crear un Perfil Personalizado

1. Abra la aplicación NetRecon Scanner
2. Navegue a **Escaneo > Perfiles**
3. Toque **Crear Nuevo Perfil**
4. Configure los siguientes parámetros:

### Configuración de Descubrimiento

| Parámetro | Opciones | Predeterminado |
|---|---|---|
| Método de descubrimiento | ARP / Ping / Ambos | ARP |
| Subred | Auto-detectar / CIDR manual | Auto-detectar |
| Excluir IPs | Lista separada por comas | Ninguna |

### Configuración de Escaneo de Puertos

| Parámetro | Opciones | Predeterminado |
|---|---|---|
| Rango de puertos | Top 100 / Top 1000 / 1-10000 / 1-65535 / Personalizado | Top 1000 |
| Puertos personalizados | Separados por comas (ej., 22,80,443,8080) | — |
| Técnica de escaneo | TCP Connect / SYN (solo root) | TCP Connect |
| Timeout por puerto | 500ms - 10,000ms | 2,000ms |
| Máximo concurrente | 5 - 40 | 20 |

### Configuración de Detección de Servicios

| Parámetro | Opciones | Predeterminado |
|---|---|---|
| Captura de banners | Desactivado / Básico / Completo | Básico |
| Detección de versiones | Sí / No | No |
| Información SSL/TLS | Sí / No | No |

### Configuración de Rendimiento

| Parámetro | Opciones | Predeterminado |
|---|---|---|
| Reconocimiento de batería | Sí / No | Sí |
| Máximo de sockets concurrentes | 5 - 40 | 20 |
| Retardo entre hosts | 0ms - 1,000ms | 0ms |

5. Toque **Guardar Perfil**

## Gestión de Perfiles

### Exportar e Importar Perfiles

Los perfiles pueden compartirse entre dispositivos:

1. Vaya a **Escaneo > Perfiles**
2. Mantenga presionado un perfil
3. Seleccione **Exportar** para generar un código QR o archivo JSON
4. En el dispositivo receptor, toque **Importar Perfil** y escanee el código QR o seleccione el archivo

### Establecer un Perfil Predeterminado

1. Vaya a **Escaneo > Perfiles**
2. Mantenga presionado el perfil deseado
3. Seleccione **Establecer como Predeterminado**

El perfil predeterminado se usa cuando toca el botón principal de **Escanear** sin seleccionar un perfil.

## Perfiles de Sonda

Cuando está conectado a una sonda, hay opciones de perfil adicionales disponibles:

| Configuración | Descripción |
|---|---|
| Monitoreo IDS | Habilitar Suricata IDS durante el escaneo |
| Escaneo de vulnerabilidades | Ejecutar verificaciones de vulnerabilidades Nuclei en los servicios descubiertos |
| Captura PCAP | Registrar paquetes durante el escaneo para análisis posterior |
| Descubrimiento pasivo | Incluir dispositivos observados pasivamente en los resultados |

Estas opciones solo están disponibles cuando la aplicación Scanner está conectada a una sonda.

## Preguntas Frecuentes

**P: ¿Por qué el perfil Profundo tarda tanto?**
R: El perfil Profundo escanea hasta 10,000 puertos por host con detección completa de servicios. Para una subred /24 con más de 100 hosts activos, esto significa millones de intentos de conexión. Considere usar el perfil Estándar para verificaciones rutinarias y reserve el Profundo para evaluaciones dirigidas.

**P: ¿Puedo escanear todos los 65,535 puertos?**
R: Sí, creando un perfil Personalizado con el rango de puertos establecido a "1-65535". Tenga en cuenta que esto aumenta significativamente el tiempo de escaneo. Para un solo host, un escaneo completo de puertos tarda aproximadamente 5-10 minutos; para una subred /24 completa, podría tomar varias horas.

**P: ¿El modo de reconocimiento de batería afecta los resultados del escaneo?**
R: El modo de reconocimiento de batería reduce el número de conexiones concurrentes cuando la batería está por debajo del 30%, lo que ralentiza el escaneo pero no omite ningún objetivo ni puerto. Los resultados son idénticos; solo cambia el tiempo de finalización.

Para ayuda adicional, contacte a [support@netreconapp.com](mailto:support@netreconapp.com).
