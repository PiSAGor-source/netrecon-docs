# NetRecon OS — Supported Hardware

## Primary Supported Devices (Fully Tested)

| Device | Architecture | RAM | Ports | Status |
|--------|-------------|-----|-------|--------|
| Orange Pi R2S 8GB | ARM64 | 8 GB | 2x 2.5G + 2x 1G | Primary |
| Raspberry Pi 4 (4GB) | ARM64 | 4 GB | 1x 1G + USB NIC | Supported |
| Raspberry Pi 4 (8GB) | ARM64 | 8 GB | 1x 1G + USB NIC | Supported |
| Raspberry Pi 5 (4GB) | ARM64 | 4 GB | 1x 1G + USB NIC | Supported |
| Raspberry Pi 5 (8GB) | ARM64 | 8 GB | 1x 1G + USB NIC | Supported |
| x86_64 Mini PC (N100) | AMD64 | 8+ GB | 2x 2.5G (typical) | Supported |

## Minimum Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| Architecture | ARM64 or x86_64 | ARM64 or x86_64 |
| RAM | 4 GB | 8 GB |
| Storage | 16 GB (eMMC/SD/SSD) | 32 GB SSD |
| Ethernet Ports | 1 (limited mode) | 2+ (full monitoring) |
| Kernel | Linux 5.15+ | Linux 6.1+ |
| Base OS | Ubuntu 22.04+ compatible | Ubuntu 24.04 LTS |

## Service RAM Usage

| Service | RAM Usage | Required |
|---------|-----------|----------|
| Core (ARP, Port Scan) | ~256 MB | Yes |
| IDS/IPS (Suricata) | ~512 MB | Optional |
| Vulnerability Scanner (Nuclei) | ~256 MB | Optional |
| Honeypot | ~128 MB | Optional |
| WireGuard VPN | ~64 MB | Optional |
| DNS Sinkhole | ~128 MB | Optional |
| PCAP Capture | ~256 MB | Optional |
| **Total (all enabled)** | **~1.6 GB** | - |

> Note: 4 GB devices should disable PCAP and limit concurrent scans.
> 8 GB devices can run all services simultaneously.

## Installation

1. Download the appropriate image:
   - ARM64 (Orange Pi / RPi): `netrecon-os-X.Y.Z-arm64.img.xz`
   - x86_64 (Mini PC): `netrecon-os-X.Y.Z-amd64.iso`

2. Write the image:
   - ARM64: `xzcat netrecon-os-*.img.xz | sudo dd of=/dev/sdX bs=4M status=progress`
   - x86_64: Boot from USB with the ISO

3. First boot:
   - Connect Ethernet to your network
   - Navigate to `http://<device-ip>:8080` for the setup wizard
   - Follow the 6-step wizard to configure your probe

4. Connect:
   - Install NetRecon Connect on your Android device
   - Scan the QR code shown at the end of the wizard
   - Or manually enter the probe URL and auth token

## Networking Recommendations

### Two-Port Setup (Recommended)
- Port 1 (WAN): Connected to uplink switch/router via trunk/mirror port
- Port 2 (MGMT): Management network for Connect app access

### Single-Port Setup
- Port 1: Both monitoring and management on same network
- Limitation: Cannot monitor traffic on other VLANs without SPAN/mirror

### Port Mirroring
For full network visibility, configure your switch to mirror traffic:
- Cisco: `monitor session 1 source vlan 1 - 100`
- HP/Aruba: `mirror-port <port> both`
- Ubiquiti: Settings > Switch > Port Mirroring

## Tested USB Network Adapters

| Adapter | Chipset | Speed | Status |
|---------|---------|-------|--------|
| TP-Link UE300 | RTL8153 | 1 Gbps | Works |
| StarTech USB31000S | AX88179 | 1 Gbps | Works |
| Plugable USB-C 2.5G | RTL8156 | 2.5 Gbps | Works |
| Intel AX210 WiFi | AX210 | WiFi 6E | Monitoring only |

## Troubleshooting

### Device not booting
- Ensure the image matches your architecture (arm64 vs amd64)
- ARM64: Try a different SD card (Class 10 / A2 recommended)
- x86_64: Disable Secure Boot in BIOS

### No network connectivity
- Check cable connections and link lights
- Verify DHCP is available on your network
- For static IP: access via serial console or direct HDMI

### High memory usage
- Disable non-essential services via the Settings page
- Reduce concurrent scan limits in probe configuration
- 4 GB devices: disable PCAP and Suricata IDS
