---
sidebar_position: 3
title: Network Modes
description: Understanding Single, Dual Scan, Bridge, and TAP network modes
---

# Network Modes

NetRecon supports four network modes that determine how the probe connects to and monitors your network. Choosing the right mode depends on your hardware, network topology, and monitoring goals.

## Prerequisites

- At least one Ethernet interface detected and assigned a role
- Understanding of your network topology (switch configuration, VLANs, etc.)

## Mode Comparison

| Feature | Single | Dual Scan | Bridge | TAP |
|---|---|---|---|---|
| Minimum NICs | 1 | 2 | 2 | 2 |
| Active scanning | Yes | Yes | Yes | No |
| Passive monitoring | Limited | Limited | Yes | Yes |
| Network disruption | None | None | Minimal | None |
| Inline deployment | No | No | Yes | No |
| Best for | Small networks | Segmented networks | Full visibility | Production networks |

## Single Interface Mode

The simplest configuration. One Ethernet port handles everything: scanning, management, and internet access.

```
┌─────────────────────────────────────────┐
│              Network Switch             │
│                                         │
│  Port 1    Port 2    Port 3    Port 4   │
│    │         │         │         │      │
│    │         │         │         │      │
└────┼─────────┼─────────┼─────────┼──────┘
     │         │         │         │
   Probe    PC/Server  PC/Server  Router
  (eth0)
```

**How it works:**
- The probe connects to a regular switch port
- ARP discovery and port scanning go out through the same interface
- Management dashboard and remote access also use this interface

**When to use:**
- You have a single-NIC device (e.g., Raspberry Pi with no USB adapter)
- Small networks (< 50 devices)
- Quick deployment where simplicity is preferred

**Limitations:**
- Scanning traffic shares bandwidth with management traffic
- Cannot see traffic between other devices (only traffic to/from the probe)

## Dual Scan Mode

Two separate interfaces: one dedicated to scanning and one for management/uplink.

```
┌─────────────────────────────────────────┐
│            Target Network Switch        │
│  Port 1    Port 2    Port 3    Port 4   │
│    │         │         │         │      │
└────┼─────────┼─────────┼─────────┼──────┘
     │         │         │         │
   Probe    PC/Server  PC/Server  │
  (eth0)                          │
                                  │
┌──────────────────────────────────┼──────┐
│         Management Switch        │      │
│  Port 1         Port 2         Port 3   │
│    │               │             │      │
└────┼───────────────┼─────────────┼──────┘
     │               │             │
   Probe          Admin PC       Router
  (eth1)
```

**How it works:**
- `eth0` (Scan) connects to the target network for discovery and scanning
- `eth1` (Management) connects to your admin network for dashboard access

**When to use:**
- You want to isolate scan traffic from management traffic
- The target network and management network are on different subnets/VLANs
- Orange Pi R2S or any dual-NIC device

**Advantages:**
- Clean separation of scan and management traffic
- Management interface remains responsive during heavy scans
- Can scan a network you do not want management traffic on

## Bridge Mode

The probe sits inline between two network segments, forwarding traffic transparently while inspecting all packets that pass through.

```
                    ┌──────────┐
                    │  Probe   │
                    │          │
                    │ eth0  eth1│
                    └──┬────┬──┘
                       │    │
          ┌────────────┘    └────────────┐
          │                              │
┌─────────┼──────────┐    ┌─────────────┼─────┐
│   Switch A         │    │       Switch B     │
│   (Upstream)       │    │    (Downstream)    │
│                    │    │                    │
│  Servers / Router  │    │   Workstations     │
└────────────────────┘    └────────────────────┘
```

**How it works:**
- The probe bridges `eth0` and `eth1` at Layer 2
- All traffic between the two segments passes through the probe
- The probe inspects every packet without being a routing hop
- Active scanning can also be performed from the bridge interfaces

**When to use:**
- You need full traffic visibility (IDS, PCAP capture)
- You want to monitor traffic between network segments
- Deploying between a core switch and an access switch

**Considerations:**
- The probe becomes a single point of failure for the bridged path
- NetRecon includes fail-open capability: if the probe loses power, traffic continues to flow via hardware bypass (on supported devices)
- Adds minimal latency (< 1ms on typical hardware)

## TAP Mode

The probe receives a copy of network traffic from a TAP device or switch SPAN/mirror port. It operates in a completely passive manner.

```
┌─────────────────────────────────────────┐
│              Network Switch             │
│                                         │
│  Port 1    Port 2    SPAN Port          │
│    │         │         │                │
└────┼─────────┼─────────┼────────────────┘
     │         │         │
   Server    Server    Probe
                      (eth0 — monitor)

                      (eth1 — management,
                       connected to admin network)
```

**How it works:**
- The switch sends a copy of traffic to its SPAN/mirror port
- The probe's scan interface receives this mirrored traffic in promiscuous mode
- No packets are injected back into the network from the scan interface
- A separate management interface provides dashboard access

**When to use:**
- Production networks where injecting scan traffic is not acceptable
- Compliance environments requiring passive-only monitoring
- When you want IDS and traffic analysis without active scanning

**Configuring your switch:**
- On Cisco: `monitor session 1 source vlan 10` / `monitor session 1 destination interface Gi0/24`
- On HP/Aruba: `mirror-port <port>`
- On Juniper: `set forwarding-options port-mirroring input ingress interface <source>`

**Limitations:**
- Cannot perform active scanning (ARP discovery, port scanning) from the TAP interface
- Device discovery relies entirely on observed traffic
- You may miss devices that are idle and not generating traffic during the observation period

## Changing Modes After Setup

You can change the network mode at any time from the probe dashboard:

1. Navigate to **Settings > Network**
2. Select a new mode
3. Reassign interface roles if needed
4. Click **Apply**

:::warning
Changing network modes will briefly interrupt probe services. Plan mode changes during a maintenance window.
:::

## FAQ

**Q: Which mode do you recommend for a first-time setup?**
A: Start with **Single Interface** mode for simplicity. You can upgrade to Dual Scan or Bridge mode later as your needs evolve.

**Q: Can I combine TAP mode with active scanning?**
A: Yes, if you have three or more interfaces. Assign one to TAP (passive), one to active scanning, and one to management.

**Q: Does Bridge mode affect network performance?**
A: The probe adds less than 1ms of latency in bridge mode. On the Orange Pi R2S with 2.5G ports, throughput remains at line rate for typical enterprise traffic loads.

For additional help, contact [support@netreconapp.com](mailto:support@netreconapp.com).
