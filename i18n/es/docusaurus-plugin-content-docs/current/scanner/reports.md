---
sidebar_position: 3
title: Reportes
description: Genere y personalice reportes PDF de auditoría de seguridad
---

# Reportes

NetRecon Scanner genera reportes PDF profesionales a partir de sus resultados de escaneo. Los reportes están diseñados para auditorías de seguridad, documentación de cumplimiento y entregables para clientes.

## Requisitos Previos

- Al menos un escaneo completado con resultados
- Almacenamiento suficiente en el dispositivo para la generación de PDF (típicamente 1-5 MB por reporte)

## Generar un Reporte

1. Complete un escaneo de red
2. Desde la pantalla de resultados del escaneo, toque el botón **Reporte** en la esquina superior derecha
3. Seleccione el tipo de reporte y personalice las opciones
4. Toque **Generar PDF**
5. El reporte se guardará y puede compartirse mediante cualquier método de compartir de Android

## Contenido del Reporte

Un reporte estándar incluye las siguientes secciones:

### Resumen Ejecutivo
- Fecha y duración del escaneo
- Alcance de la red (subred, perfil utilizado)
- Total de dispositivos descubiertos
- Resumen de hallazgos clave (puertos de alto riesgo abiertos, dispositivos no identificados)

### Inventario de Dispositivos
- Lista completa de dispositivos descubiertos
- Dirección IP, dirección MAC, nombre de host
- Tipo de dispositivo y fabricante
- Sistema operativo (cuando se detecta)

### Análisis de Puertos y Servicios
- Puertos abiertos por dispositivo
- Servicios en ejecución y versiones
- Clasificación de riesgo del servicio (Bajo / Medio / Alto / Crítico)

### Hallazgos de Seguridad
- Dispositivos con puertos abiertos de alto riesgo (ej., Telnet, FTP, SMB)
- Servicios no cifrados detectados
- Versiones de servicio predeterminadas o con vulnerabilidades conocidas
- Referencias CVE para versiones de servicios detectadas (cuando la base de datos CVE está disponible)

### Topología de Red
- Resumen en texto del diseño de la red
- Distribución de dispositivos por tipo (servidores, estaciones de trabajo, dispositivos de red, IoT)

### Apéndice
- Detalles completos de escaneo de puertos por host
- Banners de servicios sin procesar
- Configuración del escaneo y ajustes del perfil

## Personalización del Reporte

Antes de generar, puede personalizar el reporte:

| Opción | Descripción |
|---|---|
| Nombre de empresa | Aparece en el encabezado y la portada |
| Título del reporte | Título personalizado (predeterminado: "Reporte de Auditoría de Seguridad de Red") |
| Logo | Suba un logo de empresa para la portada |
| Incluir secciones | Active/desactive secciones individuales |
| Etiqueta de sensibilidad | Confidencial / Interno / Público |
| Idioma | Genere el reporte en cualquiera de los 11 idiomas soportados |

## Compartir Reportes

Después de la generación, comparta el PDF mediante:

- **Correo electrónico** — toque Compartir y seleccione su aplicación de correo
- **Almacenamiento en la nube** — guarde en Google Drive, OneDrive, etc.
- **Código QR** — genere un código QR que enlace al reporte alojado localmente (útil para entregar a un colega en la misma red)
- **Transferencia directa** — use la función de compartir cercano de Android

## Soporte de Fuentes y Unicode

Los reportes usan la familia de fuentes NotoSans para asegurar la representación correcta de:
- Caracteres latinos (EN, DE, FR, ES, NL, etc.)
- Caracteres cirílicos (RU)
- Caracteres especiales turcos (TR)
- Caracteres escandinavos (SV, NO, DA)
- Caracteres polacos (PL)

Los 11 idiomas soportados se representan correctamente en los PDFs generados.

## Almacenamiento de Reportes

Los reportes generados se almacenan localmente en el dispositivo:

- Ubicación predeterminada: almacenamiento interno de la aplicación
- Los reportes pueden exportarse al almacenamiento externo o la nube
- Los reportes antiguos pueden gestionarse desde **Reportes > Historial**
- Los reportes no expiran y permanecen disponibles hasta que se eliminen manualmente

## Preguntas Frecuentes

**P: ¿Puedo generar un reporte a partir de los resultados de escaneo de la sonda?**
R: Sí. Cuando está conectado a una sonda, puede generar reportes tanto de los resultados de escaneo locales como de los datos de la sonda. Los reportes de la sonda pueden incluir datos adicionales como alertas IDS y hallazgos de vulnerabilidades.

**P: ¿Cuál es el tamaño máximo de red para un reporte?**
R: Los reportes han sido probados con redes de hasta 1,000 dispositivos. Redes más grandes pueden tardar más en generarse pero no hay un límite estricto.

**P: ¿Puedo programar reportes automáticos?**
R: La generación programada de reportes está disponible en el dashboard de la sonda. Configure programaciones de reportes en **Configuración > Reportes > Programación**.

**P: El PDF muestra texto ilegible. ¿Cómo lo soluciono?**
R: Esto típicamente ocurre cuando se visualiza en un dispositivo sin soporte de fuente NotoSans. Abra el PDF en Google Chrome, Adobe Acrobat o cualquier lector de PDF moderno que soporte fuentes incrustadas.

Para ayuda adicional, contacte a [support@netreconapp.com](mailto:support@netreconapp.com).
