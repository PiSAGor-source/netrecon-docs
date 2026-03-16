---
sidebar_position: 1
title: CMod Overview
description: Network device configuration management via SSH and serial console
---

# CMod — Configuration Management

CMod (Configuration Module) enables you to manage network device configurations directly from the NetRecon dashboard. Connect to switches, routers, firewalls, and other network devices via SSH or serial console to execute commands, apply templates, and track configuration changes.

## Key Features

- **SSH Connections** — connect to any network device over SSH
- **Serial Console** — connect to devices via USB-to-serial adapter for out-of-band access
- **Command Templates** — pre-built and custom command templates for common operations
- **Bulk Operations** — execute commands across multiple devices simultaneously
- **Real-Time Terminal** — interactive WebSocket-based terminal in your browser
- **Configuration Backup** — save running configurations automatically
- **Change Tracking** — diff-based tracking of configuration changes over time

## Architecture

CMod runs as a dedicated service on the probe (port 8008) and connects to network devices on your behalf:

```
┌──────────┐    WebSocket     ┌──────────┐    SSH/Serial    ┌──────────────┐
│ Dashboard ├─────────────────► CMod     ├──────────────────► Network      │
│ (Browser) │                 │ Service  │                  │ Device       │
└──────────┘                  │ :8008    │                  │ (Switch/     │
                              └──────────┘                  │  Router/FW)  │
                                                            └──────────────┘
```

## Supported Devices

CMod supports any device that accepts SSH or serial console connections. Tested and optimized for:

| Vendor | Device Types | SSH | Serial |
|---|---|---|---|
| Cisco | IOS, IOS-XE, NX-OS, ASA | Yes | Yes |
| Juniper | Junos | Yes | Yes |
| HP/Aruba | ProCurve, ArubaOS-Switch, ArubaOS-CX | Yes | Yes |
| MikroTik | RouterOS | Yes | Yes |
| Ubiquiti | EdgeOS, UniFi | Yes | No |
| Fortinet | FortiOS | Yes | Yes |
| Palo Alto | PAN-OS | Yes | Yes |
| Linux | Any SSH-enabled system | Yes | Yes |

## Getting Started

### Step 1: Add a Device

1. Navigate to **CMod > Devices** in the probe dashboard
2. Click **Add Device**
3. Enter the device details:
   - **Name**: a friendly identifier (e.g., "Core Switch 1")
   - **IP Address**: the management IP of the device
   - **Device Type**: select from the vendor list
   - **Connection Type**: SSH or Serial
4. Enter credentials (stored encrypted in the probe's local database)
5. Click **Save & Test** to verify connectivity

### Step 2: Connect to a Device

1. Click on a device in the CMod device list
2. Select **Terminal** for an interactive session, or **Run Template** for a predefined command set
3. The terminal opens in your browser with a live connection to the device

### Step 3: Apply a Template

1. Select a device and click **Run Template**
2. Choose a template from the library (e.g., "Show Running Config", "Show Interfaces")
3. Review the commands that will be executed
4. Click **Execute**
5. View the output in real-time

See [SSH Mode](./ssh-mode.md) and [Serial Mode](./serial-mode.md) for detailed connection guides.

## Command Templates

Templates are reusable sets of commands organized by device type:

### Built-in Templates

| Template | Cisco IOS | Junos | ArubaOS | FortiOS |
|---|---|---|---|---|
| Show running config | `show run` | `show config` | `show run` | `show full-config` |
| Show interfaces | `show ip int brief` | `show int terse` | `show int brief` | `get system interface` |
| Show routing table | `show ip route` | `show route` | `show ip route` | `get router info routing` |
| Show ARP table | `show arp` | `show arp` | `show arp` | `get system arp` |
| Show MAC table | `show mac add` | `show eth-switch table` | `show mac-address` | `get system arp` |
| Save config | `write memory` | `commit` | `write memory` | `execute backup config` |

### Custom Templates

Create your own templates:

1. Navigate to **CMod > Templates**
2. Click **Create Template**
3. Select the target device type
4. Enter the command sequence (one command per line)
5. Add variables for dynamic values (e.g., `{{interface}}`, `{{vlan_id}}`)
6. Save the template

## FAQ

**Q: Are device credentials stored securely?**
A: Yes. All credentials are encrypted at rest in the probe's local SQLite database using AES-256 encryption. Credentials are never transmitted in plaintext.

**Q: Can I use CMod without a probe?**
A: No. CMod runs as a service on the probe hardware. It requires the probe to be on the same network as the target devices (or have routing to them).

**Q: Does CMod support SNMP?**
A: CMod focuses on CLI-based management (SSH and serial). SNMP monitoring is handled by the probe's network monitoring engine.

For additional help, contact [support@netreconapp.com](mailto:support@netreconapp.com).
