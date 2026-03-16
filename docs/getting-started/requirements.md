---
sidebar_position: 3
title: Requirements
description: Hardware, software, and network requirements for NetRecon
---

# Requirements

This page details the minimum and recommended requirements for all NetRecon components.

## Probe Hardware

### Supported Platforms

| Device | Support Level | Notes |
|---|---|---|
| Orange Pi R2S (8 GB) | Primary | Dual Ethernet, compact form factor |
| Raspberry Pi 4 (4/8 GB) | Primary | Widely available, good performance |
| Raspberry Pi 5 (4/8 GB) | Primary | Best ARM performance |
| x86_64 Mini PC (Intel N100+) | Primary | Best overall performance, multiple NICs |
| Other ARM64 SBCs | Advanced | May require manual configuration |
| Virtual Machines (VMware/Proxmox/Hyper-V) | Supported | Bridged networking required |

### Hardware Specifications

| Requirement | Minimum | Recommended |
|---|---|---|
| Architecture | ARM64 or x86_64 | ARM64 quad-core or x86_64 |
| CPU cores | 2 | 4+ |
| RAM | 4 GB | 8 GB |
| Storage | 16 GB (eMMC/SD/SSD) | 32 GB SSD |
| Ethernet ports | 1 | 2+ (for bridge/TAP mode) |
| USB | Not required | USB-A for serial console adapter |
| Power | 5V/3A (SBC) | PoE or barrel jack |

### Storage Considerations

- **16 GB** is sufficient for basic scanning and monitoring
- **32 GB+** is recommended if you enable PCAP capture, IDS logging, or vulnerability scanning
- PCAP files can grow rapidly on busy networks; consider external storage for long-term capture
- SQLite database uses WAL mode for optimal write performance

## NetRecon Scanner App (Android)

| Requirement | Details |
|---|---|
| Android version | 8.0 (API 26) or higher |
| RAM | 2 GB minimum |
| Storage | 100 MB for app + data |
| Network | Wi-Fi connected to the target network |
| Root access | Optional (enables advanced scanning modes) |
| Shizuku | Optional (enables some features without root) |

## Admin Connect App

| Requirement | Details |
|---|---|
| Android version | 8.0 (API 26) or higher |
| RAM | 2 GB minimum |
| Storage | 80 MB for app + data |
| Network | Internet connection (connects via Cloudflare Tunnel) |

## Self-Hosted Server

| Requirement | Minimum | Recommended |
|---|---|---|
| OS | Ubuntu 22.04 LTS / Debian 12 | Ubuntu 24.04 LTS |
| CPU | 2 cores | 4+ cores |
| RAM | 4 GB | 8 GB |
| Storage | 40 GB | 100 GB SSD |
| Docker | v24.0+ | Latest stable |
| Docker Compose | v2.20+ | Latest stable |

Windows Server is also supported with Docker Desktop or WSL2.

## Network Requirements

### Probe Network Access

| Direction | Port | Protocol | Purpose |
|---|---|---|---|
| Probe -> LAN | ARP | Layer 2 | Host discovery |
| Probe -> LAN | TCP (various) | Layer 4 | Port scanning |
| Probe -> LAN | UDP 5353 | mDNS | Service discovery |
| Probe -> Internet | TCP 443 | HTTPS | Cloudflare Tunnel, updates |
| LAN -> Probe | TCP 3000 | HTTPS | Web dashboard |
| LAN -> Probe | TCP 8080 | HTTP | Setup wizard (first boot only) |

### Firewall Considerations

- The probe **does not require any inbound ports** from the internet when using Cloudflare Tunnel
- The probe needs **outbound HTTPS (443)** for tunnel connectivity and system updates
- For local network scanning, the probe must be on the same Layer 2 segment as the target devices (or use a SPAN/mirror port)

### Cloudflare Tunnel

Remote access to the probe is provided through Cloudflare Tunnel. This requires:
- An active internet connection on the probe
- Outbound TCP 443 access (no inbound ports needed)
- A Cloudflare account (free tier is sufficient)

## Browser Requirements (Web Dashboard)

| Browser | Minimum Version |
|---|---|
| Google Chrome | 90+ |
| Mozilla Firefox | 90+ |
| Microsoft Edge | 90+ |
| Safari | 15+ |

JavaScript must be enabled.

## FAQ

**Q: Can I run the probe on a Raspberry Pi 3?**
A: The Raspberry Pi 3 has only 1 GB of RAM, which is below the minimum requirement. It may work for basic scanning but is not supported.

**Q: Does the probe need internet access?**
A: Internet access is required only for Cloudflare Tunnel (remote access) and system updates. All scanning functionality works without internet.

**Q: Can I use a USB Wi-Fi adapter for scanning?**
A: Wi-Fi scanning is not supported. The probe requires wired Ethernet for reliable and complete network discovery.

For additional help, contact [support@netreconapp.com](mailto:support@netreconapp.com).
