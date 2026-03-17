---
sidebar_position: 3
title: Requisitos
description: Requisitos de hardware, software y red para NetRecon
---

# Requisitos

Esta página detalla los requisitos mínimos y recomendados para todos los componentes de NetRecon.

## Hardware de la Sonda

### Plataformas Compatibles

| Dispositivo | Nivel de Soporte | Notas |
|---|---|---|
| Orange Pi R2S (8 GB) | Principal | Ethernet dual, factor de forma compacto |
| Raspberry Pi 4 (4/8 GB) | Principal | Ampliamente disponible, buen rendimiento |
| Raspberry Pi 5 (4/8 GB) | Principal | Mejor rendimiento ARM |
| Mini PC x86_64 (Intel N100+) | Principal | Mejor rendimiento general, múltiples NICs |
| Otros SBCs ARM64 | Avanzado | Puede requerir configuración manual |
| Máquinas Virtuales (VMware/Proxmox/Hyper-V) | Soportado | Red en modo puente requerida |

### Especificaciones de Hardware

| Requisito | Mínimo | Recomendado |
|---|---|---|
| Arquitectura | ARM64 o x86_64 | ARM64 quad-core o x86_64 |
| Núcleos de CPU | 2 | 4+ |
| RAM | 4 GB | 8 GB |
| Almacenamiento | 16 GB (eMMC/SD/SSD) | 32 GB SSD |
| Puertos Ethernet | 1 | 2+ (para modo puente/TAP) |
| USB | No requerido | USB-A para adaptador de consola serial |
| Alimentación | 5V/3A (SBC) | PoE o conector de barril |

### Consideraciones de Almacenamiento

- **16 GB** es suficiente para escaneo y monitoreo básico
- **32 GB+** se recomienda si habilita captura PCAP, registro de IDS o escaneo de vulnerabilidades
- Los archivos PCAP pueden crecer rápidamente en redes con mucho tráfico; considere almacenamiento externo para captura a largo plazo
- La base de datos SQLite usa modo WAL para rendimiento óptimo de escritura

## Aplicación NetRecon Scanner (Android)

| Requisito | Detalles |
|---|---|
| Versión de Android | 8.0 (API 26) o superior |
| RAM | 2 GB mínimo |
| Almacenamiento | 100 MB para la aplicación + datos |
| Red | Wi-Fi conectado a la red objetivo |
| Acceso root | Opcional (habilita modos de escaneo avanzados) |
| Shizuku | Opcional (habilita algunas funciones sin root) |

## Aplicación Admin Connect

| Requisito | Detalles |
|---|---|
| Versión de Android | 8.0 (API 26) o superior |
| RAM | 2 GB mínimo |
| Almacenamiento | 80 MB para la aplicación + datos |
| Red | Conexión a internet (se conecta vía Cloudflare Tunnel) |

## Servidor Autoalojado

| Requisito | Mínimo | Recomendado |
|---|---|---|
| SO | Ubuntu 22.04 LTS / Debian 12 | Ubuntu 24.04 LTS |
| CPU | 2 núcleos | 4+ núcleos |
| RAM | 4 GB | 8 GB |
| Almacenamiento | 40 GB | 100 GB SSD |
| Docker | v24.0+ | Última versión estable |
| Docker Compose | v2.20+ | Última versión estable |

Windows Server también está soportado con Docker Desktop o WSL2.

## Requisitos de Red

### Acceso de Red de la Sonda

| Dirección | Puerto | Protocolo | Propósito |
|---|---|---|---|
| Sonda -> LAN | ARP | Capa 2 | Descubrimiento de hosts |
| Sonda -> LAN | TCP (varios) | Capa 4 | Escaneo de puertos |
| Sonda -> LAN | UDP 5353 | mDNS | Descubrimiento de servicios |
| Sonda -> Internet | TCP 443 | HTTPS | Cloudflare Tunnel, actualizaciones |
| LAN -> Sonda | TCP 3000 | HTTPS | Dashboard web |
| LAN -> Sonda | TCP 8080 | HTTP | Asistente de configuración (solo primer arranque) |

### Consideraciones de Firewall

- La sonda **no requiere ningún puerto de entrada** desde internet cuando usa Cloudflare Tunnel
- La sonda necesita **HTTPS saliente (443)** para conectividad del túnel y actualizaciones del sistema
- Para escaneo de red local, la sonda debe estar en el mismo segmento de Capa 2 que los dispositivos objetivo (o use un puerto SPAN/mirror)

### Cloudflare Tunnel

El acceso remoto a la sonda se proporciona a través de Cloudflare Tunnel. Esto requiere:
- Una conexión a internet activa en la sonda
- Acceso TCP 443 saliente (no se necesitan puertos de entrada)
- Una cuenta de Cloudflare (el nivel gratuito es suficiente)

## Requisitos del Navegador (Dashboard Web)

| Navegador | Versión Mínima |
|---|---|
| Google Chrome | 90+ |
| Mozilla Firefox | 90+ |
| Microsoft Edge | 90+ |
| Safari | 15+ |

JavaScript debe estar habilitado.

## Preguntas Frecuentes

**P: ¿Puedo ejecutar la sonda en un Raspberry Pi 3?**
R: El Raspberry Pi 3 tiene solo 1 GB de RAM, que está por debajo del requisito mínimo. Puede funcionar para escaneo básico pero no está soportado.

**P: ¿La sonda necesita acceso a internet?**
R: El acceso a internet se requiere solo para Cloudflare Tunnel (acceso remoto) y actualizaciones del sistema. Toda la funcionalidad de escaneo funciona sin internet.

**P: ¿Puedo usar un adaptador Wi-Fi USB para escaneo?**
R: El escaneo por Wi-Fi no está soportado. La sonda requiere Ethernet por cable para un descubrimiento de red confiable y completo.

Para ayuda adicional, contacte a [support@netreconapp.com](mailto:support@netreconapp.com).
