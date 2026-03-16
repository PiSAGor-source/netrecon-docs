---
sidebar_position: 2
title: SSH Mode
description: Connect to network devices via SSH for configuration management
---

# SSH Mode

SSH mode allows you to connect to network devices over the network using the SSH protocol. This is the most common connection method for managing switches, routers, firewalls, and servers.

## Prerequisites

- The target device has SSH enabled
- The probe has network connectivity to the device's management IP
- Valid SSH credentials (username/password or SSH key)
- The device's SSH port is reachable (default: 22)

## Setting Up an SSH Connection

### Step 1: Add the Device

1. Navigate to **CMod > Devices**
2. Click **Add Device**
3. Fill in the connection details:

| Field | Description | Example |
|---|---|---|
| Name | Friendly device name | Core-SW-01 |
| IP Address | Management IP | 192.168.1.1 |
| Port | SSH port | 22 |
| Device Type | Vendor/OS | Cisco IOS |
| Username | SSH username | admin |
| Authentication | Password or SSH Key | Password |
| Password | SSH password | (encrypted) |

4. Click **Save & Test**

### Step 2: Test Connectivity

When you click **Save & Test**, CMod will:
1. Attempt a TCP connection to the specified IP and port
2. Perform SSH key exchange
3. Authenticate with the provided credentials
4. Execute a basic command (e.g., `show version`) to verify the session works
5. Display the result and mark the device as "Connected" or report an error

### Step 3: Open Terminal

1. Click the device in the CMod device list
2. Click **Terminal**
3. An interactive SSH terminal opens in your browser via WebSocket
4. You can type commands as if you were connected directly to the device

## SSH Key Authentication

For key-based authentication:

1. When adding a device, select **SSH Key** as the authentication method
2. Paste your private key (PEM format) into the key field
3. Optionally provide a key passphrase
4. The public key must already be installed on the target device

:::tip
SSH key authentication is more secure and recommended for production environments. It also enables unattended operations like scheduled configuration backups.
:::

## Connection Settings

### Timeout Configuration

| Setting | Default | Range |
|---|---|---|
| Connection timeout | 10 seconds | 5-60 seconds |
| Command timeout | 30 seconds | 10-300 seconds |
| Idle timeout | 15 minutes | 5-60 minutes |
| Keep-alive interval | 30 seconds | 10-120 seconds |

Configure these under **CMod > Settings > SSH**.

### SSH Options

| Option | Default | Description |
|---|---|---|
| Strict host key checking | Disabled | Verify the device's SSH host key |
| Preferred ciphers | Auto | Override the cipher negotiation order |
| Terminal type | xterm-256color | Terminal emulation type |
| Terminal size | 80x24 | Columns x Rows |

## Running Commands

### Interactive Terminal

The WebSocket terminal provides a real-time interactive session:
- Full ANSI color support
- Tab completion (passed through to the device)
- Command history (up/down arrows)
- Copy/paste support
- Session recording (optional)

### Command Templates

Execute predefined command sequences:

1. Select the device
2. Click **Run Template**
3. Choose a template
4. If the template has variables, fill in the values
5. Click **Execute**

Example template with variables:

```
configure terminal
interface {{interface}}
description {{description}}
switchport mode access
switchport access vlan {{vlan_id}}
no shutdown
end
write memory
```

### Bulk Execution

Run the same command or template across multiple devices:

1. Navigate to **CMod > Bulk Operations**
2. Select target devices (checkboxes)
3. Choose a template or enter a command
4. Click **Execute on Selected**
5. Results are displayed per device in a tabbed view

## Configuration Backup via SSH

CMod can automatically back up device configurations:

1. Navigate to **CMod > Backup Schedule**
2. Click **Add Schedule**
3. Select the devices to back up
4. Set the schedule (daily, weekly, or custom cron)
5. Choose the backup command template (e.g., "Show Running Config")
6. Click **Save**

Backed-up configurations are stored on the probe and include:
- Timestamp
- Device hostname
- Configuration diff from previous backup
- Full configuration text

## Troubleshooting

### Connection refused
- Verify SSH is enabled on the target device
- Confirm the IP address and port are correct
- Check that no firewall is blocking the connection between the probe and device

### Authentication failed
- Verify the username and password/key are correct
- Some devices lock out after multiple failed attempts; wait and try again
- Check if the device requires a specific SSH protocol version (SSHv2)

### Terminal hangs or is unresponsive
- The device may be waiting for a command to complete; press Ctrl+C
- Check the command timeout setting
- Verify the keep-alive interval is configured

### Commands produce unexpected output
- Ensure the correct device type is selected; different vendors use different command syntax
- Some commands require elevated privilege mode (e.g., `enable` on Cisco)

## FAQ

**Q: Can I use SSH jump hosts / bastion hosts?**
A: Not currently. CMod connects directly from the probe to the target device. Ensure the probe has routing to all managed devices.

**Q: Are SSH sessions logged?**
A: Yes. All commands executed through CMod are logged in the audit trail with the username, timestamp, device, and command text.

**Q: Can I upload files to a device via SSH?**
A: SCP/SFTP file transfer is planned for a future release. Currently, CMod supports command-line interaction only.

For additional help, contact [support@netreconapp.com](mailto:support@netreconapp.com).
