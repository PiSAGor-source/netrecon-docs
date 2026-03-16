---
sidebar_position: 3
title: macOS Agent
description: Install and deploy the NetRecon agent on macOS
---

# macOS Agent

Install the NetRecon agent on macOS endpoints for continuous monitoring and inventory reporting.

## Prerequisites

- macOS 12 (Monterey) or later
- Administrator privileges (for installation)
- Network connectivity to the probe (direct or via Cloudflare Tunnel)
- An enrollment token from the probe dashboard

## Manual Installation

### Step 1: Download the PKG

Download `netrecon-agent-macos-universal.pkg` from the probe dashboard:
1. Log into the probe dashboard
2. Navigate to **Agents > Downloads**
3. Click **macOS (PKG)**

The package is a universal binary supporting both Intel (x86_64) and Apple Silicon (arm64).

### Step 2: Run the Installer

1. Double-click the downloaded PKG file
2. Follow the installation wizard
3. When prompted, enter:
   - **Server URL**: your probe's URL
   - **Enrollment Token**: paste the token from the probe dashboard
4. Enter your macOS admin password when prompted
5. Click **Install** and wait for completion

The agent installs to `/Library/NetRecon/Agent/` and registers as a launchd service.

### Step 3: Verify Installation

Open Terminal:

```bash
sudo launchctl list | grep netrecon
```

You should see `com.netrecon.agent` in the output. Check enrollment in the probe dashboard under **Agents**.

## Command-Line Installation

For scripted installation:

```bash
sudo installer -pkg netrecon-agent-macos-universal.pkg -target /

# Configure the agent
sudo /Library/NetRecon/Agent/netrecon-agent configure \
  --server-url "https://probe.netreconapp.com" \
  --enrollment-token "your-token-here"

# Start the agent
sudo launchctl load /Library/LaunchDaemons/com.netrecon.agent.plist
```

## Jamf Deployment

Deploy the agent at scale using Jamf Pro.

### Step 1: Upload the Package

1. Log into Jamf Pro
2. Navigate to **Settings > Computer Management > Packages**
3. Click **New**
4. Upload `netrecon-agent-macos-universal.pkg`
5. Save the package

### Step 2: Create a Policy

1. Navigate to **Computers > Policies**
2. Click **New**
3. Configure the policy:
   - **General**: Name it "NetRecon Agent Deployment"
   - **Packages**: Add the NetRecon agent PKG, set to **Install**
   - **Scripts**: Add a post-install script (see below)
   - **Scope**: Target your desired computer groups
   - **Trigger**: Set to **Enrollment Complete** and/or **Recurring Check-in**

### Post-Install Script

```bash
#!/bin/bash
/Library/NetRecon/Agent/netrecon-agent configure \
  --server-url "https://probe.netreconapp.com" \
  --enrollment-token "your-fleet-token"

launchctl load /Library/LaunchDaemons/com.netrecon.agent.plist
```

### Step 3: Deploy

1. Save the policy
2. Monitor deployment in **Computers > Policy Logs**

## MDM Deployment

Deploy via any MDM solution that supports PKG distribution.

### Configuration Profile

Create a configuration profile to pre-configure the agent:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>PayloadContent</key>
  <array>
    <dict>
      <key>PayloadType</key>
      <string>com.netrecon.agent</string>
      <key>ServerURL</key>
      <string>https://probe.netreconapp.com</string>
      <key>EnrollmentToken</key>
      <string>your-fleet-token</string>
      <key>HeartbeatInterval</key>
      <integer>30</integer>
      <key>ReportInterval</key>
      <integer>900</integer>
    </dict>
  </array>
  <key>PayloadDisplayName</key>
  <string>NetRecon Agent Configuration</string>
  <key>PayloadIdentifier</key>
  <string>com.netrecon.agent.config</string>
  <key>PayloadType</key>
  <string>Configuration</string>
  <key>PayloadVersion</key>
  <integer>1</integer>
</dict>
</plist>
```

Deploy this profile alongside the PKG package through your MDM.

## macOS Permissions

The agent may require the following macOS permissions:

| Permission | Purpose | How to Grant |
|---|---|---|
| Full Disk Access | Read installed software list | System Settings > Privacy & Security |
| Network Access | Send data to probe | Granted automatically |

For MDM-managed deployments, grant Full Disk Access via a PPPC (Privacy Preferences Policy Control) profile:

```xml
<key>Services</key>
<dict>
  <key>SystemPolicyAllFiles</key>
  <array>
    <dict>
      <key>Identifier</key>
      <string>com.netrecon.agent</string>
      <key>IdentifierType</key>
      <string>bundleID</string>
      <key>Allowed</key>
      <true/>
    </dict>
  </array>
</dict>
```

## Agent Management

### Configuration File

```
/Library/NetRecon/Agent/config.yaml
```

```yaml
server_url: "https://probe.netreconapp.com"
heartbeat_interval: 30
report_interval: 900
log_level: "info"
log_file: "/Library/NetRecon/Agent/logs/agent.log"
```

### Service Commands

```bash
# Stop the agent
sudo launchctl unload /Library/LaunchDaemons/com.netrecon.agent.plist

# Start the agent
sudo launchctl load /Library/LaunchDaemons/com.netrecon.agent.plist

# Check status
sudo launchctl list | grep netrecon
```

### Uninstallation

```bash
# Stop the service
sudo launchctl unload /Library/LaunchDaemons/com.netrecon.agent.plist

# Remove files
sudo rm -rf /Library/NetRecon/Agent/
sudo rm /Library/LaunchDaemons/com.netrecon.agent.plist

# Remove receipts
sudo pkgutil --forget com.netrecon.agent
```

## Troubleshooting

### Agent not starting after install
- Check system log: `log show --predicate 'subsystem == "com.netrecon.agent"' --last 5m`
- Verify the plist exists: `ls -la /Library/LaunchDaemons/com.netrecon.agent.plist`
- Check file permissions on the agent binary

### Permission denied errors in log
- Grant Full Disk Access as described above
- For MDM, deploy the PPPC profile before installing the agent

### Agent not connecting to probe
- Verify the server URL: `curl -I https://probe.netreconapp.com/api/health`
- Check if macOS firewall is blocking outbound connections
- Verify the enrollment token is valid

## FAQ

**Q: Does the agent support Apple Silicon natively?**
A: Yes. The PKG is a universal binary that runs natively on both Intel and Apple Silicon Macs.

**Q: Does the agent work on macOS virtual machines?**
A: Yes, the agent works in VMware Fusion, Parallels, and UTM virtual machines.

**Q: Will macOS Gatekeeper block the installation?**
A: The PKG is signed and notarized by Apple. If installing manually and Gatekeeper blocks it, right-click the PKG and select **Open** to bypass the warning.

For additional help, contact [support@netreconapp.com](mailto:support@netreconapp.com).
