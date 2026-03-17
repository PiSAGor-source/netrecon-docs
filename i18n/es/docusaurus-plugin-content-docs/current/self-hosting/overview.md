---
sidebar_position: 1
title: Descripción General del Autoalojamiento
description: Ejecute la plataforma NetRecon en su propia infraestructura
---

# Autoalojamiento

NetRecon puede ser completamente autoalojado en su propia infraestructura, dándole control total sobre sus datos, seguridad y despliegue.

## ¿Por Qué Autoalojar?

| Beneficio | Descripción |
|---|---|
| **Soberanía de Datos** | Todos los resultados de escaneo, configuraciones y registros permanecen en sus servidores |
| **Cumplimiento** | Cumpla con requisitos regulatorios que exigen almacenamiento de datos local |
| **Aislamiento de Red** | Ejecute en entornos aislados sin dependencia de internet |
| **Integración Personalizada** | Acceso directo a la base de datos para reportes e integración personalizados |
| **Control de Costos** | Sin licenciamiento por sonda para la infraestructura del servidor |

## Arquitectura

Un despliegue autoalojado de NetRecon consiste en múltiples microservicios ejecutándose en contenedores Docker:

```
┌────────────────────────────────────────────────────────┐
│                    Docker Host                         │
│                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │ API Gateway  │  │ Vault Server │  │  License     ││
│  │   :8000      │  │   :8001      │  │  Server :8002││
│  └──────────────┘  └──────────────┘  └──────────────┘│
│                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │ Email        │  │ Notification │  │  Update      ││
│  │ Service :8003│  │ Service :8004│  │  Server :8005││
│  └──────────────┘  └──────────────┘  └──────────────┘│
│                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │ Agent        │  │ Warranty     │  │  CMod        ││
│  │ Registry:8006│  │ Service :8007│  │  Service:8008││
│  └──────────────┘  └──────────────┘  └──────────────┘│
│                                                        │
│  ┌──────────────┐  ┌──────────────┐                   │
│  │ IPAM         │  │ PostgreSQL   │                   │
│  │ Service :8009│  │   :5432      │                   │
│  └──────────────┘  └──────────────┘                   │
│                                                        │
│  ┌──────────────┐  ┌──────────────┐                   │
│  │ Redis        │  │ Nginx        │                   │
│  │   :6379      │  │ Reverse Proxy│                   │
│  └──────────────┘  └──────────────┘                   │
└────────────────────────────────────────────────────────┘
```

## Resumen de Servicios

| Servicio | Puerto | Propósito |
|---|---|---|
| API Gateway | 8000 | Enrutamiento central de API, autenticación |
| Vault Server | 8001 | Gestión de secretos, almacenamiento de credenciales |
| License Server | 8002 | Validación y gestión de licencias |
| Email Service | 8003 | Notificaciones y alertas por correo electrónico |
| Notification Service | 8004 | Notificaciones push, webhooks |
| Update Server | 8005 | Distribución de actualizaciones para sondas y agentes |
| Agent Registry | 8006 | Inscripción y gestión de agentes |
| Warranty Service | 8007 | Seguimiento de garantías de hardware |
| CMod Service | 8008 | Gestión de configuración de dispositivos de red |
| IPAM Service | 8009 | Gestión de direcciones IP |

## Opciones de Despliegue

### Docker Compose (Recomendado)

La forma más sencilla de desplegar todos los servicios. Adecuado para despliegues pequeños y medianos.

Consulte la [Guía de Instalación](./installation.md) para instrucciones paso a paso.

### Kubernetes

Para despliegues a gran escala que requieren alta disponibilidad y escalado horizontal. Hay Helm charts disponibles para cada servicio.

### Binario Único

Para despliegues mínimos, un binario único empaqueta todos los servicios. Adecuado para pruebas o entornos muy pequeños.

## Requisitos del Sistema

| Requisito | Mínimo | Recomendado |
|---|---|---|
| SO | Ubuntu 22.04 / Debian 12 | Ubuntu 24.04 LTS |
| CPU | 2 núcleos | 4+ núcleos |
| RAM | 4 GB | 8 GB |
| Disco | 40 GB | 100 GB SSD |
| Docker | v24.0+ | Última versión estable |
| Docker Compose | v2.20+ | Última versión estable |

## Red

| Puerto | Protocolo | Propósito |
|---|---|---|
| 443 | HTTPS | Dashboard web y API (vía proxy inverso) |
| 80 | HTTP | Redirección a HTTPS |
| 5432 | TCP | PostgreSQL (interno, no expuesto) |
| 6379 | TCP | Redis (interno, no expuesto) |

Solo los puertos 80 y 443 necesitan estar expuestos externamente. Todos los puertos internos de servicios son accesibles solo dentro de la red Docker.

## Almacenamiento de Datos

| Datos | Almacenamiento | Respaldo |
|---|---|---|
| Base de datos PostgreSQL | Volumen Docker | pg_dump diario |
| Archivos de configuración | Montaje de enlace | Respaldo de archivos |
| Archivos subidos | Volumen Docker | Respaldo de archivos |
| Registros | Volumen Docker | Rotación de registros |
| Certificados TLS | Montaje de enlace | Respaldo seguro |

## Seguridad

Los despliegues autoalojados incluyen todas las funciones de seguridad:

- Cifrado TLS para toda la comunicación externa
- Autenticación basada en JWT
- Control de acceso basado en roles
- Registro de auditoría
- Verificación de integridad Steel Shield (consulte [Steel Shield](./steel-shield.md))

## Preguntas Frecuentes

**P: ¿Puedo ejecutar el autoalojamiento sin Docker?**
R: Docker Compose es el método de despliegue recomendado y soportado. Ejecutar servicios directamente en el host es posible pero no está oficialmente soportado.

**P: ¿Cómo se conectan las sondas a un servidor autoalojado?**
R: Configure las sondas para apuntar a la URL de su servidor en lugar del endpoint predeterminado de Cloudflare Tunnel. Actualice el `server_url` en la configuración de la sonda.

**P: ¿Se incluye un dashboard web?**
R: Sí. El API Gateway sirve el dashboard web en la URL raíz. Acceda a él mediante su dominio configurado (ej., `https://netrecon.yourcompany.com`).

**P: ¿Puedo ejecutar esto en un entorno aislado?**
R: Sí. Descargue previamente las imágenes Docker y transfiéralas a su servidor aislado. La validación de licencias puede configurarse para modo sin conexión.

Para ayuda adicional, contacte a [support@netreconapp.com](mailto:support@netreconapp.com).
