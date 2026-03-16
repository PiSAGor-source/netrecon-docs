---
sidebar_position: 1
title: Installation
description: Install NetRecon OS on your probe hardware
---

# NetRecon OS Installation

This guide walks you through installing NetRecon OS on your probe hardware. The process takes approximately 15 minutes from download to a fully running probe.

## Prerequisites

- A supported hardware device (see [Requirements](./requirements.md))
- A microSD card (16GB minimum, 32GB recommended) or USB drive
- An image writing tool such as [balenaEtcher](https://etcher.balena.io/) or Raspberry Pi Imager
- A computer to download and write the image
- Ethernet cable connected to your network

## Step 1: Download the Image

Download the appropriate image for your hardware from the NetRecon customer portal:

| Hardware | Image File | Architecture |
|---|---|---|
| Orange Pi R2S | `netrecon-os-arm64.img.xz` | ARM64 |
| Raspberry Pi 4/5 | `netrecon-os-arm64.img.xz` | ARM64 |
| x86_64 Mini PC | `netrecon-os-amd64.iso` | x86_64 |

:::tip
Verify the download checksum against the value shown on the portal to ensure file integrity.
:::

## Step 2: Write the Image

### For ARM64 devices (Orange Pi, Raspberry Pi)

1. Insert your microSD card into your computer
2. Open balenaEtcher
3. Select the downloaded `.img.xz` file (no need to extract)
4. Select your microSD card as the target
5. Click **Flash** and wait for completion

### For x86_64 devices

1. Insert a USB drive into your computer
2. Open balenaEtcher
3. Select the downloaded `.iso` file
4. Select your USB drive as the target
5. Click **Flash** and wait for completion
6. Boot the mini PC from the USB drive and follow the on-screen installer

## Step 3: First Boot

1. Insert the microSD card (or internal drive for x86_64) into your probe device
2. Connect at least one Ethernet cable to your network
3. Power on the device
4. Wait approximately 60 seconds for the system to initialize

The probe will obtain an IP address via DHCP on its first boot.

## Step 4: Run the Setup Wizard

1. From any device on the same network, open a web browser
2. Navigate to `http://<probe-ip>:8080`
3. The Setup Wizard will guide you through initial configuration

The wizard will help you configure:
- Admin account credentials
- Network interface roles
- Network scanning mode
- Cloudflare Tunnel connection
- Security settings

See [Setup Wizard Overview](../setup-wizard/overview.md) for detailed wizard documentation.

## Step 5: Connect Your Apps

Once the wizard is complete:

- **NetRecon Scanner**: Can discover the probe via mDNS on the local network
- **Admin Connect**: Scan the QR code displayed in the wizard, or connect via `https://probe.netreconapp.com`

## Hardware Requirements

| Requirement | Minimum | Recommended |
|---|---|---|
| CPU | ARM64 or x86_64 | ARM64 quad-core or x86_64 |
| RAM | 4 GB | 8 GB |
| Storage | 16 GB | 32 GB |
| Ethernet | 1 port | 2+ ports |
| Network | DHCP available | Static IP preferred |

## Troubleshooting

### Cannot find the probe on the network

- Ensure the Ethernet cable is properly connected and the link LED is active
- Check your router's DHCP lease table for a new device named `netrecon`
- Try connecting a monitor and keyboard to see the probe's IP address on the console

### Wizard does not load

- Verify you are accessing port 8080: `http://<probe-ip>:8080`
- The wizard service starts approximately 60 seconds after boot
- Check that your computer is on the same network/VLAN as the probe

### Image fails to write

- Try a different microSD card; some cards have compatibility issues
- Re-download the image and verify the checksum
- Try an alternative image writing tool

## FAQ

**Q: Can I install NetRecon OS on a virtual machine?**
A: Yes, the x86_64 ISO can be installed in VMware, Proxmox, or Hyper-V. Allocate at least 4 GB RAM and ensure the VM has a bridged network adapter.

**Q: How do I update NetRecon OS after installation?**
A: Updates are delivered through the Admin Connect app or via the probe's web dashboard under **Settings > System Update**.

**Q: Can I use Wi-Fi instead of Ethernet?**
A: The probe requires at least one wired Ethernet connection for reliable network scanning. Wi-Fi is not supported as a primary scan interface.

For additional help, contact [support@netreconapp.com](mailto:support@netreconapp.com).
