---
sidebar_position: 2
title: Quick Start
description: From unboxing to your first network scan in 10 minutes
---

# Quick Start Guide

Get from zero to your first network scan in under 10 minutes. This guide assumes you have already written the NetRecon OS image to your storage device.

## What You Will Need

- A probe device with NetRecon OS installed (see [Installation](./installation.md))
- An Ethernet cable connected to your network
- A smartphone or computer on the same network
- The NetRecon Scanner app (optional, for mobile scanning)

## Minutes 0-2: Boot the Probe

1. Insert the prepared microSD card or boot from internal storage
2. Connect the Ethernet cable to your network switch or router
3. Power on the device
4. Wait for the green status LED to become solid (approximately 60 seconds)

## Minutes 2-5: Complete the Setup Wizard

1. Find your probe's IP address from your router's DHCP table, or check the console output
2. Open `http://<probe-ip>:8080` in your browser
3. Complete these essential wizard steps:
   - **Set admin password** — choose a strong password
   - **Assign network interfaces** — select which port connects to your scan network
   - **Choose scan mode** — select "Single Interface" for a basic setup
   - **Configure Cloudflare Tunnel** (optional) — enables remote access via `https://probe.netreconapp.com`
4. Click **Finish Setup**

## Minutes 5-7: Verify the Probe Dashboard

1. After the wizard completes, navigate to `http://<probe-ip>:3000`
2. Log in with the admin credentials you created
3. Verify the dashboard shows:
   - System health: CPU, RAM, storage usage
   - Network interfaces: at least one interface in "scan" role
   - Services: core services should show green status

## Minutes 7-10: Run Your First Scan

### Option A: From the Probe Dashboard

1. Navigate to **Scan > Start Scan**
2. Select the target subnet (auto-detected from your scan interface)
3. Choose the **Quick** scan profile
4. Click **Start**
5. Watch devices appear in real-time on the dashboard

### Option B: From the NetRecon Scanner App

1. Open the NetRecon Scanner app on your Android device
2. The app will detect the probe via mDNS if you are on the same network
3. Alternatively, go to **Settings > Probe Connection** and enter the probe IP
4. Tap **Scan** on the home screen
5. Select your network and tap **Start Scan**

## What Happens During a Scan

1. **ARP Discovery** — the probe sends ARP requests to find all live hosts on the subnet
2. **Port Scanning** — each discovered host is scanned for open TCP ports
3. **Service Detection** — open ports are probed to identify the running service and version
4. **Device Profiling** — the probe combines MAC address OUI lookup, open ports, and service banners to identify the device type

## Next Steps

Now that you have completed your first scan, explore these features:

- [Scan Profiles](../scanner/scan-profiles.md) — customize scan depth and speed
- [Reports](../scanner/reports.md) — generate PDF reports of your scan results
- [Admin Connect](../admin-connect/overview.md) — set up remote management
- [Agent Deployment](../agents/overview.md) — deploy agents to your endpoints

## FAQ

**Q: The scan found fewer devices than expected. Why?**
A: Ensure the probe is on the correct VLAN/subnet. Firewalls or client-side firewalls may block ARP responses. Try running a **Standard** profile instead of **Quick** for more thorough discovery.

**Q: Can I scan multiple subnets?**
A: Yes. Configure additional subnets in the probe dashboard under **Settings > Scan Targets**. Multi-subnet scanning requires appropriate routing or multiple network interfaces.

**Q: How long does a scan take?**
A: A Quick scan of a /24 subnet typically completes in under 2 minutes. Standard takes 5-10 minutes. Deep scans may take 15-30 minutes depending on the number of hosts and ports scanned.

For additional help, contact [support@netreconapp.com](mailto:support@netreconapp.com).
