---
sidebar_position: 1
title: Admin Connect Overview
description: Mobile management app for NetRecon probe fleet administration
---

# Admin Connect

Admin Connect is the mobile management app for controlling and monitoring your NetRecon probe fleet. It connects to probes via Cloudflare Tunnel for secure remote access from anywhere.

## Key Features

- **Fleet Management** — manage multiple probes from a single app
- **Remote Monitoring** — view probe health, scan results, and alerts in real-time
- **IDS Alerts** — receive and review Suricata IDS alerts
- **Vulnerability Scanning** — trigger and review Nuclei vulnerability scans
- **PCAP Capture** — start/stop packet capture remotely
- **Honeypot Monitoring** — monitor honeypot hits and attacker behavior
- **Rogue Detection** — receive alerts for rogue DHCP/ARP activity
- **Network Monitor** — track latency and packet loss across your network
- **WireGuard VPN** — manage VPN connections to probes
- **Ticketing Integration** — create and manage support tickets
- **SSO/2FA** — enterprise authentication with single sign-on and two-factor authentication
- **Role-Based Access** — granular permissions per user role

## How It Works

Admin Connect does **not** have its own scan engine. It is purely a remote management interface for NetRecon probes.

```
┌──────────────┐       HTTPS/WSS        ┌─────────────────┐
│ Admin Connect├───────────────────────►│ Cloudflare Tunnel│
│   (Mobile)   │   (via Cloudflare)      │                 │
└──────────────┘                         └────────┬────────┘
                                                  │
                                         ┌────────▼────────┐
                                         │  NetRecon Probe  │
                                         │  (REST + WS API) │
                                         └─────────────────┘
```

All communication between Admin Connect and the probe is encrypted via:
- **HTTPS** for REST API calls
- **WebSocket Secure (WSS)** for real-time events
- **mTLS** for mutual certificate authentication

## Getting Started

1. Install Admin Connect from the Google Play Store (package: `com.netreconapp.connect`)
2. Open the app and create your account or sign in with SSO
3. Add a probe using one of these methods:
   - **QR Code** — scan the QR code from the probe's setup wizard or dashboard
   - **Manual** — enter the probe's tunnel URL and authentication token
4. The probe will appear in your fleet dashboard

See [Enrollment](./enrollment.md) for detailed setup instructions.

## Real-Time Events

Admin Connect maintains a persistent WebSocket connection to each probe. You receive instant notifications for:

| Event | Description |
|---|---|
| `ids_alert` | Suricata IDS triggered a rule |
| `honeypot_hit` | An attacker interacted with the honeypot |
| `rogue_detected` | Rogue DHCP or ARP spoofing detected |
| `vuln_found` | Vulnerability scan found a result |
| `host_found` | New device discovered on the network |
| `baseline_diff_alert` | Network baseline deviation detected |
| `probe_health_alert` | Probe CPU, RAM, or disk threshold exceeded |
| `pcap_ready` | PCAP capture file ready for download |
| `dns_threat` | DNS sinkhole blocked a threat |

## Supported Actions

From Admin Connect, you can remotely:

- Start/stop network scans
- View and export scan results
- Start/stop PCAP capture and download files
- Enable/disable IDS monitoring
- Trigger vulnerability scans
- Configure and manage the honeypot
- Set up rogue DHCP/ARP detection
- Configure DNS sinkhole rules
- Manage WireGuard VPN connections
- Create backup snapshots
- Restore from backup
- View system health and resource usage
- Manage user accounts and roles

## FAQ

**Q: Can Admin Connect work without internet?**
A: Admin Connect requires internet access to reach the probe via Cloudflare Tunnel. For local network access, use the probe's web dashboard directly.

**Q: How many probes can I manage?**
A: There is no limit on the number of probes. Admin Connect supports enterprise-scale fleet management.

**Q: Is Admin Connect available for iOS?**
A: An iOS version is planned. Currently, Admin Connect is available for Android.

For additional help, contact [support@netreconapp.com](mailto:support@netreconapp.com).
