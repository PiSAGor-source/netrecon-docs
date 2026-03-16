---
sidebar_position: 1
title: Self-Hosting Overview
description: Run the NetRecon platform on your own infrastructure
---

# Self-Hosting

NetRecon can be fully self-hosted on your own infrastructure, giving you complete control over your data, security, and deployment.

## Why Self-Host?

| Benefit | Description |
|---|---|
| **Data Sovereignty** | All scan results, configurations, and logs remain on your servers |
| **Compliance** | Meet regulatory requirements that mandate on-premises data storage |
| **Network Isolation** | Run in air-gapped environments with no internet dependency |
| **Custom Integration** | Direct database access for custom reporting and integration |
| **Cost Control** | No per-probe licensing for the server infrastructure |

## Architecture

A self-hosted NetRecon deployment consists of multiple microservices running in Docker containers:

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

## Service Overview

| Service | Port | Purpose |
|---|---|---|
| API Gateway | 8000 | Central API routing, authentication |
| Vault Server | 8001 | Secrets management, credential storage |
| License Server | 8002 | License validation and management |
| Email Service | 8003 | Email notifications and alerts |
| Notification Service | 8004 | Push notifications, webhooks |
| Update Server | 8005 | Probe and agent update distribution |
| Agent Registry | 8006 | Agent enrollment and management |
| Warranty Service | 8007 | Hardware warranty tracking |
| CMod Service | 8008 | Network device configuration management |
| IPAM Service | 8009 | IP address management |

## Deployment Options

### Docker Compose (Recommended)

The simplest way to deploy all services. Suitable for small to medium deployments.

See [Installation Guide](./installation.md) for step-by-step instructions.

### Kubernetes

For large-scale deployments requiring high availability and horizontal scaling. Helm charts are available for each service.

### Single Binary

For minimal deployments, a single binary packages all services. Suitable for testing or very small environments.

## System Requirements

| Requirement | Minimum | Recommended |
|---|---|---|
| OS | Ubuntu 22.04 / Debian 12 | Ubuntu 24.04 LTS |
| CPU | 2 cores | 4+ cores |
| RAM | 4 GB | 8 GB |
| Disk | 40 GB | 100 GB SSD |
| Docker | v24.0+ | Latest stable |
| Docker Compose | v2.20+ | Latest stable |

## Networking

| Port | Protocol | Purpose |
|---|---|---|
| 443 | HTTPS | Web dashboard and API (via reverse proxy) |
| 80 | HTTP | Redirect to HTTPS |
| 5432 | TCP | PostgreSQL (internal, not exposed) |
| 6379 | TCP | Redis (internal, not exposed) |

Only ports 80 and 443 need to be exposed externally. All internal service ports are accessible only within the Docker network.

## Data Storage

| Data | Storage | Backup |
|---|---|---|
| PostgreSQL database | Docker volume | pg_dump daily |
| Configuration files | Bind mount | File backup |
| Uploaded files | Docker volume | File backup |
| Logs | Docker volume | Log rotation |
| TLS certificates | Bind mount | Secure backup |

## Security

Self-hosted deployments include all security features:

- TLS encryption for all external communication
- JWT-based authentication
- Role-based access control
- Audit logging
- Steel Shield integrity verification (see [Steel Shield](./steel-shield.md))

## FAQ

**Q: Can I run self-hosted without Docker?**
A: Docker Compose is the recommended and supported deployment method. Running services directly on the host is possible but not officially supported.

**Q: How do probes connect to a self-hosted server?**
A: Configure probes to point to your server's URL instead of the default Cloudflare Tunnel endpoint. Update the `server_url` in the probe configuration.

**Q: Is there a web dashboard included?**
A: Yes. The API Gateway serves the web dashboard at the root URL. Access it via your configured domain (e.g., `https://netrecon.yourcompany.com`).

**Q: Can I run this in an air-gapped environment?**
A: Yes. Pre-download the Docker images and transfer them to your air-gapped server. License validation can be configured for offline mode.

For additional help, contact [support@netreconapp.com](mailto:support@netreconapp.com).
