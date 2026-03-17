---
slug: /
sidebar_position: 1
title: Primeros Pasos con NetRecon
description: Plataforma de inteligencia de red para MSPs y equipos de TI
---

# Primeros Pasos con NetRecon

NetRecon es una plataforma de inteligencia de red diseñada para MSPs y equipos de TI. Proporciona descubrimiento automatizado de redes, inventario de dispositivos, escaneo de vulnerabilidades, gestión de configuraciones y monitoreo en tiempo real, todo accesible a través de un panel centralizado, aplicaciones móviles y API REST.

## Elija Su Despliegue

<div className="row" style={{marginTop: '1.5rem'}}>

<div className="col col--6" style={{marginBottom: '1rem'}}>

### Autoalojado

Despliegue NetRecon en su propia infraestructura usando Docker Compose. Control total sobre sus datos, sin dependencias externas.

- [Requisitos del Sistema](self-hosting/requirements)
- [Guía de Instalación](self-hosting/installation)
- [Referencia de Configuración](self-hosting/configuration)

**Ideal para:** Organizaciones con requisitos estrictos de soberanía de datos, redes aisladas o infraestructura de servidores existente.

</div>

<div className="col col--6" style={{marginBottom: '1rem'}}>

### Nube (SaaS)

Comience al instante con NetRecon Cloud. No requiere configuración de servidor — simplemente despliegue sondas y comience a escanear.

- [Guía de Inicio Rápido](cloud/quickstart)

**Ideal para:** Equipos que desean empezar rápidamente sin gestionar infraestructura de servidores.

</div>

</div>

## Componentes de la Plataforma

| Componente | Descripción |
|---|---|
| **Dashboard** | Panel de control web para todas las funciones de NetRecon |
| **NetRecon Scanner** | Aplicación Android para escaneo de redes en movimiento ([Más información](scanner/overview)) |
| **Admin Connect** | Aplicación Android de gestión para administración remota ([Más información](admin-connect/overview)) |
| **Agentes** | Agentes ligeros para endpoints Windows, macOS y Linux ([Instalación](agents/overview)) |
| **Sondas** | Sensores de red basados en hardware o VM para monitoreo continuo |
| **API** | API RESTful para automatización e integración ([Referencia de API](api/overview)) |

## ¿Necesita Ayuda?

- Explore la documentación usando la barra lateral
- Consulte la [Referencia de API](api/overview) para detalles de integración
- Contacte a [support@netreconapp.com](mailto:support@netreconapp.com) para asistencia
