---
sidebar_position: 2
title: Network Interfaces
description: NIC role assignment and driver recovery in the setup wizard
---

# Network Interfaces

The Network Interfaces step of the setup wizard detects all Ethernet ports on your probe and lets you assign a role to each one. Proper interface assignment is critical for reliable scanning and management access.

## Prerequisites

- At least one Ethernet cable connected before starting the wizard
- For multi-NIC setups, label your cables before plugging them in so you know which port connects where

## Interface Detection

When you reach Step 4 of the wizard, the system scans for all available network interfaces and displays:

- **Interface name** (e.g., `eth0`, `eth1`, `enp1s0`)
- **MAC address**
- **Link status** (connected / disconnected)
- **Speed** (e.g., 1 Gbps, 2.5 Gbps)
- **Driver** (e.g., `r8169`, `r8152`)

## Interface Roles

Each detected interface can be assigned one of the following roles:

### Scan

The primary role for network discovery. This interface sends ARP requests, performs port scans, and captures traffic. It should be connected to the network segment you want to monitor.

**Best practice:** Connect to an access port on your switch or a SPAN/mirror port for passive monitoring.

### Management

Used for accessing the probe dashboard, receiving remote connections, and system updates. This interface should have reliable connectivity.

**Best practice:** Assign a static IP to the management interface so its address does not change.

### Uplink

The interface connected to your internet gateway. Used for Cloudflare Tunnel, system updates, and external connectivity. In many setups, the management and uplink roles can share the same interface.

### Unused

Interfaces set to "Unused" are disabled and will not participate in any network activity.

## Role Assignment Examples

### Orange Pi R2S (2 ports)

```
eth0 (2.5G) → Scan       — connected to target network switch
eth1 (1G)   → Management  — connected to your admin VLAN
```

### Raspberry Pi 4 (1 built-in port + USB adapter)

```
eth0        → Scan       — built-in port, connected to target network
eth1 (USB)  → Management — USB Ethernet adapter, connected to admin network
```

### x86_64 Mini PC (4 ports)

```
eth0  → Scan        — connected to target VLAN 1
eth1  → Scan        — connected to target VLAN 2
eth2  → Management  — connected to admin network
eth3  → Uplink      — connected to internet gateway
```

## Driver Recovery

If an interface is detected but shows "No Driver" or "Driver Error," the wizard includes a driver recovery feature:

1. The wizard checks its built-in driver database for compatible drivers
2. If a match is found, click **Install Driver** to load it
3. After driver installation, the interface will appear with full details
4. If no matching driver is found, you may need to install it manually after completing the wizard

:::tip
The most common driver issue occurs with Realtek USB Ethernet adapters (`r8152`). NetRecon OS includes drivers for the most popular adapters out of the box.
:::

## Interface Identification

If you are unsure which physical port corresponds to which interface name:

1. Click the **Identify** button next to an interface in the wizard
2. The probe will blink the link LED on that port for 10 seconds
3. Look at your probe device to see which port is blinking

Alternatively, you can plug/unplug cables one at a time and observe the link status change in the wizard.

## VLAN Support

If your network uses VLANs, you can configure VLAN tagging on any interface:

1. Select the interface
2. Enable **VLAN Tagging**
3. Enter the VLAN ID (1-4094)
4. The probe will create a virtual interface (e.g., `eth0.100`) for that VLAN

This is useful for scanning multiple VLANs from a single physical interface connected to a trunk port.

## FAQ

**Q: Can I assign multiple roles to one interface?**
A: In Single Interface mode, the scan and management roles share one port. In other modes, each interface should have a single dedicated role.

**Q: My USB Ethernet adapter is not detected. What do I do?**
A: Try a different USB port. If the adapter is still not detected, it may not be compatible. Supported chipsets include Realtek RTL8153, RTL8152, ASIX AX88179, and Intel I225.

**Q: Can I change interface roles after the wizard?**
A: Yes. Go to **Settings > Network** in the probe dashboard to reassign interface roles at any time.

For additional help, contact [support@netreconapp.com](mailto:support@netreconapp.com).
