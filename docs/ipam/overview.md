---
sidebar_position: 1
title: IPAM Overview
description: IP Address Management with subnet tracking and utilization monitoring
---

# IPAM — IP Address Management

NetRecon IPAM provides centralized IP address tracking and subnet management. Monitor subnet utilization, track IP assignments, and maintain an accurate inventory of your network address space.

## Key Features

- **Subnet Management** — define and organize subnets with full CIDR notation support
- **IP Tracking** — track individual IP assignments with status and metadata
- **Utilization Monitoring** — real-time subnet utilization percentages and alerts
- **Scan Integration** — import discovered IPs directly from scan results
- **Conflict Detection** — identify duplicate IP addresses and overlapping subnets
- **OUI Sync** — automatically associate MAC addresses with manufacturer data
- **History** — track IP assignment changes over time
- **Export** — export IP data as CSV or JSON

## Architecture

IPAM runs as a dedicated service on the probe (port 8009) with a PostgreSQL backend:

```
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│  Dashboard   │  HTTP  │    IPAM      │  SQL   │  PostgreSQL  │
│  (Browser)   ├────────►  Service     ├────────►  Database    │
│              │        │   :8009      │        │              │
└──────────────┘        └──────┬───────┘        └──────────────┘
                               │
                        ┌──────▼───────┐
                        │ Scan Engine  │
                        │ (IP import)  │
                        └──────────────┘
```

## Concepts

### Subnets

A subnet represents a range of IP addresses defined by CIDR notation (e.g., `192.168.1.0/24`). Each subnet has:

| Field | Description |
|---|---|
| CIDR | Network address in CIDR notation |
| Name | Friendly name (e.g., "Office LAN") |
| VLAN | Associated VLAN ID (optional) |
| Gateway | Default gateway IP |
| DNS | DNS servers for this subnet |
| Description | Free-text description |
| Location | Physical or logical location |

### IP Addresses

Each IP address within a subnet can be tracked with:

| Field | Description |
|---|---|
| IP Address | The IPv4 or IPv6 address |
| Status | Available, Assigned, Reserved, DHCP |
| Hostname | Device hostname |
| MAC Address | Associated MAC address |
| Manufacturer | Auto-populated from OUI database |
| Owner | Assigned user or department |
| Last Seen | Timestamp of last network activity |
| Notes | Free-text notes |

### Utilization

Subnet utilization is calculated as:

```
Utilization = (Assigned + Reserved + DHCP) / Total Usable IPs * 100%
```

Alerts can be configured when utilization exceeds a threshold (default: 80%).

## Getting Started

### Step 1: Create a Subnet

1. Navigate to **IPAM > Subnets** in the probe dashboard
2. Click **Add Subnet**
3. Enter the CIDR (e.g., `10.0.1.0/24`)
4. Fill in the optional fields (name, VLAN, gateway, etc.)
5. Click **Save**

### Step 2: Import IPs from Scan

The fastest way to populate IPAM is to import from a completed scan:

1. Navigate to **IPAM > Subnets**
2. Select your subnet
3. Click **Import from Scan**
4. Select the scan result to import from
5. Review the IPs that will be imported
6. Click **Import**

See [Import from Scan](./import-from-scan.md) for detailed instructions.

### Step 3: Manage IP Assignments

1. Click on a subnet to view its IP addresses
2. Click on an IP to view/edit its details
3. Change status, add notes, assign to an owner
4. Click **Save**

### Step 4: Monitor Utilization

1. Navigate to **IPAM > Dashboard**
2. View subnet utilization charts
3. Configure alerts for high utilization under **IPAM > Settings > Alerts**

## Subnet Organization

Subnets can be organized hierarchically:

```
10.0.0.0/16          (Corporate Network)
├── 10.0.1.0/24      (HQ - Office LAN)
├── 10.0.2.0/24      (HQ - Server VLAN)
├── 10.0.3.0/24      (HQ - Wi-Fi)
├── 10.0.10.0/24     (Branch 1 - Office)
├── 10.0.11.0/24     (Branch 1 - Servers)
└── 10.0.20.0/24     (Branch 2 - Office)
```

Parent/child relationships are established automatically based on CIDR containment.

## IPv6 Support

IPAM supports both IPv4 and IPv6 addresses:
- Full CIDR notation for IPv6 subnets
- IPv6 address tracking with the same fields as IPv4
- Dual-stack devices show both addresses linked together

## FAQ

**Q: Can I import subnets from a CSV file?**
A: Yes. Navigate to **IPAM > Import** and upload a CSV file with columns: CIDR, Name, VLAN, Gateway, Description. A template CSV is available for download on the import page.

**Q: How often is utilization data updated?**
A: Utilization is recalculated every time an IP status changes and on a scheduled basis (every 5 minutes by default).

**Q: Does IPAM integrate with DHCP servers?**
A: IPAM can import DHCP lease data to track dynamically assigned IPs. Configure the DHCP server connection under **IPAM > Settings > DHCP Integration**.

**Q: Can multiple users edit IPAM data simultaneously?**
A: Yes. IPAM uses optimistic locking to prevent conflicts. If two users edit the same IP address, the second save will show a conflict warning with the option to merge or overwrite.

For additional help, contact [support@netreconapp.com](mailto:support@netreconapp.com).
