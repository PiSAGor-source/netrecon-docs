---
sidebar_position: 1
title: Setup Wizard Overview
description: Complete guide to the NetRecon OS first-boot setup wizard
---

# Setup Wizard Overview

The Setup Wizard runs automatically on the first boot of NetRecon OS. It guides you through all essential configuration steps to get your probe operational. The wizard is accessible via a web browser at `http://<probe-ip>:8080`.

## Prerequisites

- NetRecon OS successfully booted on your probe hardware
- At least one Ethernet cable connected to your network
- A computer or smartphone on the same network to access the wizard

## Wizard Steps

The setup wizard consists of 11 steps, completed sequentially:

| Step | Name | Description |
|---|---|---|
| 1 | **Welcome** | Language selection and license agreement |
| 2 | **Admin Account** | Create the administrator username and password |
| 3 | **Hostname** | Set the probe's hostname on the network |
| 4 | **Network Interfaces** | Detect and assign roles to Ethernet ports |
| 5 | **Network Mode** | Choose scanning topology (Single, Dual, Bridge, TAP) |
| 6 | **IP Configuration** | Set static IP or DHCP for each interface |
| 7 | **DNS & NTP** | Configure DNS servers and time synchronization |
| 8 | **Cloudflare Tunnel** | Set up remote access tunnel (optional) |
| 9 | **Security Settings** | Configure TLS certificates, 2FA, and session timeout |
| 10 | **Initial Scan Target** | Define the first subnet to scan |
| 11 | **Summary & Apply** | Review all settings and apply configuration |

## Step Details

### Step 1: Welcome

Select your preferred language from the 11 supported languages. Accept the license agreement to proceed.

### Step 2: Admin Account

Create the administrator account that will be used to log into the probe dashboard and API. Choose a strong password — this account has full system access.

### Step 3: Hostname

Set a meaningful hostname for the probe (e.g., `netrecon-hq` or `probe-branch-01`). This hostname will be broadcast via mDNS for local discovery.

### Step 4: Network Interfaces

The wizard detects all available Ethernet ports and displays their link status. You assign a role to each interface:

- **Scan** — the interface used for network discovery and scanning
- **Management** — the interface used for dashboard access and remote management
- **Uplink** — the interface connected to your internet gateway
- **Unused** — disabled interfaces

See [Network Interfaces](./network-interfaces.md) for detailed guidance.

### Step 5: Network Mode

Choose how the probe connects to your network:

- **Single Interface** — scan and management on one port
- **Dual Scan** — separate scan and management interfaces
- **Bridge** — transparent inline mode between two ports
- **TAP** — passive monitoring via a network TAP or SPAN port

See [Network Modes](./network-modes.md) for detailed guidance.

### Step 6: IP Configuration

For each active interface, choose between DHCP and static IP configuration. Static IP is recommended for the management interface so the probe's address does not change.

### Step 7: DNS & NTP

Configure upstream DNS servers (defaults to Cloudflare 1.1.1.1 and Google 8.8.8.8). NTP is configured to ensure accurate timestamps for logs and scan results.

### Step 8: Cloudflare Tunnel

Optionally configure a Cloudflare Tunnel for secure remote access. You will need:
- A Cloudflare account
- A tunnel token (generated from the Cloudflare Zero Trust dashboard)

This step can be skipped and configured later from the probe dashboard.

### Step 9: Security Settings

- **TLS Certificate** — generate a self-signed certificate or provide your own
- **Two-Factor Authentication** — enable TOTP-based 2FA for the admin account
- **Session Timeout** — configure how long dashboard sessions remain active

### Step 10: Initial Scan Target

Define the first subnet the probe will scan. The wizard auto-detects the subnet from the scan interface's IP configuration and suggests it as the default target.

### Step 11: Summary & Apply

Review all configured settings. Click **Apply** to finalize the configuration. The probe will:

1. Apply network configuration
2. Generate TLS certificates
3. Start all services
4. Begin the initial network scan (if configured)
5. Redirect you to the probe dashboard

:::info
The wizard runs only once. After completion, the firstboot service is disabled. To re-run the wizard, use the **Factory Reset** option in the probe dashboard under **Settings > System**.
:::

## After the Wizard

Once the wizard completes:

- Access the probe dashboard at `https://<probe-ip>:3000`
- If Cloudflare Tunnel was configured, access remotely at `https://probe.netreconapp.com`
- Connect the NetRecon Scanner or Admin Connect app to the probe

## FAQ

**Q: Can I go back to a previous step?**
A: Yes, the wizard has a back button on every step. Your previously entered values are preserved.

**Q: What if I need to change settings after the wizard?**
A: All settings configured in the wizard can be changed later from the probe dashboard under **Settings**.

**Q: The wizard shows no network interfaces. What do I do?**
A: Ensure your Ethernet cables are connected and the link LEDs are active. If using a USB Ethernet adapter, it may require manual driver installation. See [Network Interfaces](./network-interfaces.md) for driver recovery information.

For additional help, contact [support@netreconapp.com](mailto:support@netreconapp.com).
