---
sidebar_position: 2
title: Scan Profiles
description: Configure scan depth and speed with profiles
---

# Scan Profiles

Scan profiles let you control the balance between scan speed and thoroughness. NetRecon includes four built-in profiles, and you can create custom profiles for specific use cases.

## Built-in Profiles

### Quick

The fastest profile, designed for rapid host discovery with minimal port scanning.

| Setting | Value |
|---|---|
| ARP discovery | Yes |
| Port range | Top 100 ports |
| Service detection | Basic (common services only) |
| Device profiling | OUI + port fingerprint |
| Estimated time (/24) | 1-2 minutes |

**Best for:** Quick inventory check, verifying a device is online, initial reconnaissance.

### Standard

A balanced profile that provides good coverage without excessive scan time.

| Setting | Value |
|---|---|
| ARP discovery | Yes |
| Port range | Top 1,000 ports |
| Service detection | Full banner grabbing |
| Device profiling | Full (OUI + ports + banners) |
| Estimated time (/24) | 5-10 minutes |

**Best for:** Regular network audits, routine security assessments, general-purpose scanning.

### Deep

Comprehensive scanning that checks all common ports and performs thorough service analysis.

| Setting | Value |
|---|---|
| ARP discovery | Yes |
| Port range | 1-10,000 |
| Service detection | Full banner grabbing + version detection |
| Device profiling | Full with CVE cross-reference |
| Estimated time (/24) | 15-30 minutes |

**Best for:** Thorough security audits, compliance checks, detailed network documentation.

### Custom

Create your own profile with full control over every scanning parameter.

## Creating a Custom Profile

1. Open the NetRecon Scanner app
2. Navigate to **Scan > Profiles**
3. Tap **Create New Profile**
4. Configure the following parameters:

### Discovery Settings

| Parameter | Options | Default |
|---|---|---|
| Discovery method | ARP / Ping / Both | ARP |
| Subnet | Auto-detect / Manual CIDR | Auto-detect |
| Exclude IPs | Comma-separated list | None |

### Port Scan Settings

| Parameter | Options | Default |
|---|---|---|
| Port range | Top 100 / Top 1000 / 1-10000 / 1-65535 / Custom | Top 1000 |
| Custom ports | Comma-separated (e.g., 22,80,443,8080) | — |
| Scan technique | TCP Connect / SYN (root only) | TCP Connect |
| Timeout per port | 500ms - 10,000ms | 2,000ms |
| Max concurrent | 5 - 40 | 20 |

### Service Detection Settings

| Parameter | Options | Default |
|---|---|---|
| Banner grabbing | Off / Basic / Full | Basic |
| Version detection | Yes / No | No |
| SSL/TLS info | Yes / No | No |

### Performance Settings

| Parameter | Options | Default |
|---|---|---|
| Battery-aware | Yes / No | Yes |
| Max concurrent sockets | 5 - 40 | 20 |
| Scan delay between hosts | 0ms - 1,000ms | 0ms |

5. Tap **Save Profile**

## Profile Management

### Exporting and Importing Profiles

Profiles can be shared between devices:

1. Go to **Scan > Profiles**
2. Long-press a profile
3. Select **Export** to generate a QR code or JSON file
4. On the receiving device, tap **Import Profile** and scan the QR code or select the file

### Setting a Default Profile

1. Go to **Scan > Profiles**
2. Long-press the desired profile
3. Select **Set as Default**

The default profile is used when you tap the main **Scan** button without selecting a profile.

## Probe Profiles

When connected to a probe, additional profile options are available:

| Setting | Description |
|---|---|
| IDS monitoring | Enable Suricata IDS during scan |
| Vulnerability scan | Run Nuclei vulnerability checks on discovered services |
| PCAP capture | Record packets during the scan for later analysis |
| Passive discovery | Include passively observed devices in results |

These options are only available when the Scanner app is connected to a probe.

## FAQ

**Q: Why does the Deep profile take so long?**
A: The Deep profile scans up to 10,000 ports per host with full service detection. For a /24 subnet with 100+ active hosts, this means millions of connection attempts. Consider using the Standard profile for routine checks and reserving Deep for targeted assessments.

**Q: Can I scan all 65,535 ports?**
A: Yes, by creating a Custom profile with port range set to "1-65535." Be aware this significantly increases scan time. For a single host, a full port scan takes approximately 5-10 minutes; for an entire /24 subnet, it could take several hours.

**Q: Does battery-aware mode affect scan results?**
A: Battery-aware mode reduces the number of concurrent connections when battery is below 30%, which slows the scan but does not skip any targets or ports. Results are identical; only the completion time changes.

For additional help, contact [support@netreconapp.com](mailto:support@netreconapp.com).
