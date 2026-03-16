---
sidebar_position: 3
title: Serial Mode
description: Connect to network devices via serial console cable
---

# Serial Mode

Serial mode allows you to connect to network devices using a USB-to-serial console cable. This is essential for initial device setup, password recovery, and out-of-band management when SSH is not available.

## Prerequisites

- A USB-to-serial console cable (RJ45-to-USB or DB9-to-USB)
- The USB cable connected to the probe's USB port
- Physical access to the network device's console port
- The correct baud rate for the target device

## Supported Console Cable Types

| Cable Type | Connector | Common Use |
|---|---|---|
| RJ45-to-USB | RJ45 console port | Cisco, Juniper, Aruba |
| DB9-to-USB | DB9 serial port | Older switches, industrial devices |
| USB-C/USB-A to RJ45 | RJ45 console port | Modern console cables |
| USB-C to USB-C | USB-C console port | Some newer devices |

### Recommended Chipsets

For reliable serial communication, use cables with these chipsets:
- **FTDI FT232R** — most compatible, recommended
- **Prolific PL2303** — widely available
- **Silicon Labs CP210x** — good compatibility

Avoid counterfeit FTDI cables, as they may not work reliably.

## Setting Up a Serial Connection

### Step 1: Connect the Cable

1. Connect the USB end of the console cable to the probe's USB port
2. Connect the RJ45/DB9 end to the network device's console port
3. Verify the cable is detected by the probe

### Step 2: Add the Device

1. Navigate to **CMod > Devices**
2. Click **Add Device**
3. Select **Serial** as the connection type
4. Configure the serial parameters:

| Field | Description | Default |
|---|---|---|
| Name | Friendly device name | — |
| Serial Port | Detected USB serial device | `/dev/ttyUSB0` |
| Baud Rate | Communication speed | 9600 |
| Data Bits | Number of data bits | 8 |
| Parity | Parity checking | None |
| Stop Bits | Number of stop bits | 1 |
| Flow Control | Hardware/software flow control | None |
| Device Type | Vendor/OS (for template matching) | — |

5. Click **Save & Test**

### Step 3: Open Terminal

1. Click the device in the CMod device list
2. Click **Terminal**
3. An interactive serial terminal opens in your browser
4. Press **Enter** to wake the device console

## Baud Rate Reference

Common baud rates by vendor:

| Vendor / Device | Default Baud Rate |
|---|---|
| Cisco IOS / IOS-XE | 9600 |
| Cisco NX-OS | 9600 |
| Juniper Junos | 9600 |
| HP/Aruba ProCurve | 9600 |
| MikroTik RouterOS | 115200 |
| Fortinet FortiOS | 9600 |
| Palo Alto PAN-OS | 9600 |
| Ubiquiti EdgeOS | 115200 |
| Linux (generic) | 115200 |

:::tip
If you see garbled text in the terminal, the baud rate is likely incorrect. Try the common rates: 9600, 19200, 38400, 57600, 115200.
:::

## Serial Communication Settings

### Standard 8N1 Configuration

Most network devices use the "8N1" standard:
- **8** data bits
- **N** (no) parity
- **1** stop bit

This is the default in CMod and should work with the vast majority of devices.

### Flow Control

| Type | When to Use |
|---|---|
| None | Default; works for most devices |
| Hardware (RTS/CTS) | Required by some industrial and older devices |
| Software (XON/XOFF) | Rarely used; some legacy terminal servers |

## Serial Port Detection

When a USB serial cable is connected, CMod automatically detects it:

1. Navigate to **CMod > Devices > Add Device > Serial**
2. The **Serial Port** dropdown lists all detected USB serial devices
3. If multiple cables are connected, each appears as a separate port (e.g., `/dev/ttyUSB0`, `/dev/ttyUSB1`)

If no ports are detected:
- Verify the cable is fully inserted
- Try a different USB port on the probe
- Check the probe's system log for USB device detection errors

## Use Cases

### Initial Device Setup
When configuring a new-out-of-box switch or router that has no IP address configured:
1. Connect via serial console
2. Complete the initial configuration (assign management IP, enable SSH)
3. Switch to SSH mode for ongoing management

### Password Recovery
When locked out of a device:
1. Connect via serial console
2. Follow the vendor's password recovery procedure
3. Reset the password and regain access

### Out-of-Band Management
When a device's management interface is unreachable:
1. Connect via serial console
2. Diagnose the issue (interface down, routing problem, etc.)
3. Apply corrective configuration

### Firmware Upgrades
Some devices require console access during firmware upgrades:
1. Connect via serial console
2. Monitor the upgrade process in real-time
3. Intervene if the upgrade encounters errors

## Troubleshooting

### No output in terminal
- Press **Enter** several times to wake the console
- Verify the baud rate matches the device's configuration
- Try reversing the console cable (some cables are wired differently)
- Ensure the cable's USB driver is loaded (check probe system logs)

### Garbled text
- The baud rate is incorrect; try 9600 first, then 115200
- Check data bits, parity, and stop bits settings
- Try a different console cable

### "Permission denied" on serial port
- The CMod service requires access to `/dev/ttyUSB*` devices
- This is configured automatically during NetRecon OS setup
- If using a custom installation, add the CMod service user to the `dialout` group

### Intermittent disconnections
- The USB cable may be loose; ensure a firm connection
- Some long USB cables cause signal degradation; use a cable under 3 meters
- USB hubs can cause issues; connect directly to the probe's USB port

## FAQ

**Q: Can I use serial mode remotely via Admin Connect?**
A: Yes. The serial terminal is accessible through the web dashboard, which is reachable via Cloudflare Tunnel. You get the same interactive terminal experience remotely.

**Q: How many serial connections can the probe handle simultaneously?**
A: One serial connection per USB port. Most probe hardware supports 2-4 USB ports. Use a powered USB hub for additional connections, though direct connections are more reliable.

**Q: Can I automate serial console commands?**
A: Yes. Command templates work with serial connections just as they do with SSH. You can create templates for repetitive serial tasks like password recovery or initial setup.

For additional help, contact [support@netreconapp.com](mailto:support@netreconapp.com).
