---
sidebar_position: 1
title: Agents Overview
description: Deploy lightweight monitoring agents to endpoints
---

# Agent Deployment

NetRecon agents are lightweight monitoring programs installed on endpoints (workstations, servers, laptops) that report back to the probe. Agents provide endpoint-level visibility that network scanning alone cannot achieve.

## What Agents Do

- **Heartbeat Monitoring** — regular check-in to confirm the endpoint is online
- **Software Inventory** — report installed software and versions
- **Open Port Reporting** — report locally listening ports from the endpoint's perspective
- **Network Interface Data** — report all NICs, IPs, MAC addresses, and link status
- **OS Information** — report operating system, version, and patch level
- **Hardware Information** — CPU, RAM, disk, serial number
- **Security Posture** — firewall status, antivirus status, encryption status

## Supported Platforms

| Platform | Package Format | Minimum Version |
|---|---|---|
| Windows | MSI installer | Windows 10 / Server 2016 |
| macOS | PKG installer | macOS 12 (Monterey) |
| Linux (Debian/Ubuntu) | DEB package | Ubuntu 20.04 / Debian 11 |
| Linux (RHEL/Fedora) | RPM package | RHEL 8 / Fedora 36 |

## Architecture

```
┌───────────────┐     HTTPS      ┌─────────────────┐
│   Endpoint    │  (heartbeat +  │   Agent         │
│   (Agent)     ├────────────────►  Registry       │
│               │   data upload) │   :8006         │
└───────────────┘                └────────┬────────┘
                                         │
                                ┌────────▼────────┐
                                │  Probe Dashboard │
                                │  (Agent view)    │
                                └─────────────────┘
```

Agents communicate with the Agent Registry service (port 8006) on the probe:
- **Heartbeat**: every 30 seconds (configurable)
- **Full report**: every 15 minutes (configurable)
- **Protocol**: HTTPS with JWT authentication
- **Payload**: JSON, gzip compressed

## Deployment Methods

### Manual Installation
Download and install the agent package directly on each endpoint. Best for small deployments or testing.

- [Windows Agent](./windows.md)
- [macOS Agent](./macos.md)
- [Linux Agent](./linux.md)

### Enterprise Deployment
For large-scale rollout, deploy agents using your existing management tools:

| Tool | Platform | Guide |
|---|---|---|
| SCCM | Windows | [Windows Agent](./windows.md#sccm-deployment) |
| Microsoft Intune | Windows | [Windows Agent](./windows.md#intune-deployment) |
| Group Policy (GPO) | Windows | [Windows Agent](./windows.md#gpo-deployment) |
| Jamf Pro | macOS | [macOS Agent](./macos.md#jamf-deployment) |
| Generic MDM | macOS | [macOS Agent](./macos.md#mdm-deployment) |
| CLI / Ansible | Linux | [Linux Agent](./linux.md#automated-deployment) |

### QR Code Enrollment

For BYOD or field deployment:
1. Generate a QR code from the probe dashboard (**Agents > Enrollment**)
2. The user scans the QR code on their device
3. The agent downloads and installs with pre-configured settings

## Agent Configuration

After installation, agents are configured via a local configuration file or remotely through the probe dashboard:

| Setting | Default | Description |
|---|---|---|
| `server_url` | — | Probe URL or Cloudflare Tunnel URL |
| `enrollment_token` | — | One-time enrollment token |
| `heartbeat_interval` | 30s | How often the agent checks in |
| `report_interval` | 15m | How often full data is uploaded |
| `log_level` | info | Logging verbosity |

## Agent Lifecycle

1. **Installation** — agent package is installed on the endpoint
2. **Enrollment** — agent registers with the probe using an enrollment token
3. **Active** — agent sends regular heartbeats and reports
4. **Stale** — agent has missed heartbeats beyond the timeout threshold (default: 90 seconds)
5. **Offline** — agent has not checked in for an extended period
6. **Decommissioned** — agent is removed from the fleet

## Dashboard Integration

Enrolled agents appear in the probe dashboard under **Agents**:

- **Agent List** — all enrolled agents with status indicators
- **Agent Detail** — full endpoint data for a selected agent
- **Alerts** — notifications for stale/offline agents or security posture changes
- **Groups** — organize agents into logical groups (by department, location, etc.)

## Security

- All agent-to-probe communication is encrypted via TLS
- Agents authenticate using JWT tokens issued during enrollment
- Enrollment tokens are single-use and expire after a configurable period
- Agent binaries are signed for integrity verification
- No inbound connections are required on the endpoint

## FAQ

**Q: How much bandwidth does an agent use?**
A: Heartbeats are approximately 200 bytes each (every 30 seconds). Full reports are typically 2-10 KB compressed (every 15 minutes). Total bandwidth is negligible even on slow connections.

**Q: Does the agent require admin/root privileges?**
A: The agent runs as a system service and requires elevated privileges for installation. After installation, it runs under a dedicated service account with minimal permissions.

**Q: Can I uninstall the agent remotely?**
A: Yes. From the probe dashboard, select an agent and click **Uninstall**. The agent will remove itself on the next heartbeat.

**Q: Does the agent affect endpoint performance?**
A: The agent is designed to be lightweight. It typically uses less than 20 MB of RAM and negligible CPU. Data collection runs at low priority to avoid impacting user experience.

For additional help, contact [support@netreconapp.com](mailto:support@netreconapp.com).
