---
sidebar_position: 1
title: Scanner Overview
description: NetRecon Scanner app — standalone Android network scanner
---

# NetRecon Scanner

NetRecon Scanner is a standalone Android network security auditing tool. It runs independently on your Android device without requiring a probe, making it ideal for field work, quick assessments, and on-the-go network reconnaissance.

## Key Features

- **ARP Discovery** — find all devices on the local network using ARP requests
- **Port Scanning** — scan TCP ports to find open services on discovered hosts
- **Service Detection** — identify running services and their versions via banner grabbing
- **Device Profiling** — classify devices by combining OUI lookup, open ports, and service signatures
- **WiFi Heatmap** — visualize wireless signal strength across physical locations
- **PDF Reports** — generate professional security audit reports
- **SSH Terminal** — connect to devices directly from the app
- **CVE Intelligence** — offline CVE database for vulnerability lookup
- **Attack Surface Map** — visual representation of the network's exposure
- **Passive Monitor** — continuous background monitoring for new devices
- **11 Languages** — full localization support

## Operating Modes

NetRecon Scanner supports three operating modes, depending on your device's capabilities:

### Standard Mode
Works on any Android device without special permissions. Uses standard Android networking APIs for discovery and scanning.

### Shizuku Mode
Leverages the [Shizuku](https://shizuku.rikka.app/) service for elevated network access without root. Enables faster ARP scanning and raw socket access.

### Root Mode
Full access to all network capabilities. Enables the fastest scanning speed, promiscuous mode capture, and advanced features like ARP spoofing detection.

| Feature | Standard | Shizuku | Root |
|---|---|---|---|
| ARP discovery | Slow | Fast | Fastest |
| Port scanning | Yes | Yes | Yes |
| Raw sockets | No | Yes | Yes |
| PCAP capture | No | Limited | Full |
| Passive monitoring | Limited | Yes | Yes |

## Scan Types

### ARP Discovery
Sends ARP requests to every IP in the target subnet to identify live hosts. This is the fastest and most reliable method for discovering devices on a local network.

### TCP Port Scan
Connects to specified TCP ports on each discovered host. Supports configurable port ranges and concurrent connection limits.

### Service Detection
After finding open ports, the scanner sends protocol-specific probes to identify the running service. Recognizes hundreds of common services including HTTP, SSH, FTP, SMB, RDP, databases, and more.

### Device Profiling
Combines multiple data sources to identify what a device is:
- MAC address OUI (manufacturer) lookup
- Open port fingerprint matching
- Service banner analysis
- mDNS/SSDP service announcements

## Probe Integration

While the Scanner works independently, it can also connect to a NetRecon Probe for enhanced capabilities:

- View probe scan results alongside local scans
- Trigger remote scans from the app
- Access IDS alerts and vulnerability data from the probe
- Combine local and probe data in reports

To connect to a probe, go to **Settings > Probe Connection** and enter the probe's IP address or scan the QR code from the probe dashboard.

## Performance

The scanner is optimized for mobile devices:
- Maximum 40 concurrent socket connections (adaptive based on battery level)
- CPU-intensive profiling runs in a dedicated isolate to keep the UI responsive
- OUI database is lazy-loaded with an LRU cache (500 entries)
- Battery-aware scanning reduces concurrency when battery is low

## FAQ

**Q: Does the Scanner require internet access?**
A: No. All scanning features work offline. Internet is only needed for the initial CVE database download and updates.

**Q: Can I scan networks I am not connected to?**
A: The Scanner can only discover devices on the network your Android device is currently connected to via Wi-Fi. To scan remote networks, use a probe.

**Q: How accurate is device profiling?**
A: Device profiling correctly identifies the device type in approximately 85-90% of cases. Accuracy improves when more ports and services are detected (use the Standard or Deep scan profile).

For additional help, contact [support@netreconapp.com](mailto:support@netreconapp.com).
