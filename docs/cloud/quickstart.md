---
sidebar_position: 1
title: Quick Start
description: Get started with NetRecon Cloud in minutes
---

# Cloud Quick Start

NetRecon Cloud is the fastest way to get started. No server setup, no Docker — just sign up, deploy a probe, and start discovering your network.

## Step 1: Create Your Account

1. Go to [app.netreconapp.com](https://app.netreconapp.com) and click **Sign Up**
2. Enter your email, company name, and password
3. Verify your email address
4. Log in to the NetRecon Dashboard

## Step 2: Add Your First Site

1. In the Dashboard, navigate to **Sites** in the sidebar
2. Click **Add Site**
3. Enter a name and address for the site (e.g., "Main Office — Istanbul")
4. Save the site

## Step 3: Deploy a Probe

Each site needs at least one probe for network discovery and monitoring.

### Option A: NetRecon OS (Recommended)

1. Go to **Sites → [Your Site] → Probes → Add Probe**
2. Select **NetRecon OS** and download the image for your hardware
3. Flash the image to an SD card or SSD using [balenaEtcher](https://etcher.balena.io/)
4. Connect the probe to your network via Ethernet
5. Power on — the probe will automatically connect to your cloud account via Cloudflare Tunnel

### Option B: Docker on Existing Server

```bash
# Pull and run the probe container
docker run -d \
  --name netrecon-probe \
  --network host \
  --restart unless-stopped \
  -e ENROLLMENT_TOKEN="your-token-from-dashboard" \
  netrecon/probe:latest
```

Get the enrollment token from **Sites → [Your Site] → Probes → Add Probe → Docker**.

### Option C: Virtual Machine

1. Download the OVA file from the Dashboard
2. Import into VMware, Proxmox, or Hyper-V
3. Configure the VM with **bridged networking** (required for Layer 2 scanning)
4. Start the VM — it will appear in your Dashboard automatically

## Step 4: Start Scanning

Once the probe is online:

1. Go to **Sites → [Your Site] → Devices**
2. Click **Scan Now** or wait for the automatic discovery (runs every 15 minutes)
3. Discovered devices will appear in the device inventory

## Step 5: Install the Mobile App

Download **NetRecon Scanner** from the Google Play Store for on-the-go network scanning:

- Scan any network your phone is connected to
- Results sync automatically to your cloud dashboard
- See [Scanner Overview](../scanner/overview) for details

## What's Next?

- **Deploy agents** on endpoints for deeper visibility → [Agent Installation](../agents/overview)
- **Set up alerts** for new devices, vulnerabilities, or downtime
- **Configure integrations** with your existing tools (LDAP, SIEM, Jira, ServiceNow)
- **Invite your team** via **Settings → Team Management**

## Cloud vs Self-Hosted

| Feature | Cloud | Self-Hosted |
|---|---|---|
| Server management | Managed by NetRecon | You manage |
| Data location | NetRecon Cloud (EU) | Your infrastructure |
| Updates | Automatic | Manual (docker pull) |
| Cloudflare Tunnel | Included | You configure |
| Pricing | Subscription | License key |

Need self-hosted instead? See the [Installation Guide](../self-hosting/installation).

For help, contact [support@netreconapp.com](mailto:support@netreconapp.com).
