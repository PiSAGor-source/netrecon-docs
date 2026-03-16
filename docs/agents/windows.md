---
sidebar_position: 2
title: Windows Agent
description: Install and deploy the NetRecon agent on Windows
---

# Windows Agent

Install the NetRecon agent on Windows endpoints for continuous monitoring and inventory reporting.

## Prerequisites

- Windows 10 or later / Windows Server 2016 or later
- Local administrator privileges (for installation)
- Network connectivity to the probe (direct or via Cloudflare Tunnel)
- An enrollment token from the probe dashboard

## Manual Installation

### Step 1: Download the MSI

Download `netrecon-agent-windows-x64.msi` from the probe dashboard:
1. Log into the probe dashboard
2. Navigate to **Agents > Downloads**
3. Click **Windows (MSI)**

### Step 2: Run the Installer

1. Double-click the downloaded MSI file
2. Click **Next** on the welcome screen
3. Enter the configuration details:
   - **Server URL**: your probe's URL (e.g., `https://probe.netreconapp.com`)
   - **Enrollment Token**: paste the token from the probe dashboard
4. Click **Install**
5. Click **Finish** when the installation completes

The agent installs to `C:\Program Files\NetRecon\Agent\` and registers as a Windows service named `NetReconAgent`.

### Step 3: Verify Installation

Open a Command Prompt as Administrator:

```powershell
sc query NetReconAgent
```

The service should show `STATE: RUNNING`.

Check enrollment status in the probe dashboard under **Agents** — the new endpoint should appear within 30 seconds.

## Silent Installation

For scripted or unattended installation:

```powershell
msiexec /i netrecon-agent-windows-x64.msi /quiet /norestart SERVER_URL="https://probe.netreconapp.com" ENROLLMENT_TOKEN="your-token-here"
```

## SCCM Deployment

Deploy the agent to thousands of Windows endpoints using Microsoft SCCM (System Center Configuration Manager).

### Step 1: Create the Package

1. Open the SCCM Console
2. Navigate to **Software Library > Application Management > Applications**
3. Click **Create Application**
4. Select **Windows Installer (MSI file)** and browse to the MSI
5. Complete the wizard with the following install command:

```
msiexec /i netrecon-agent-windows-x64.msi /quiet /norestart SERVER_URL="https://probe.netreconapp.com" ENROLLMENT_TOKEN="your-fleet-token"
```

### Step 2: Configure Detection

Set the detection rule:
- **Type**: File system
- **Path**: `C:\Program Files\NetRecon\Agent\`
- **File**: `netrecon-agent.exe`
- **Property**: File exists

### Step 3: Deploy

1. Right-click the application and select **Deploy**
2. Choose your target device collection
3. Set the deployment purpose to **Required**
4. Configure the schedule
5. Click **Next** through the wizard and deploy

## Intune Deployment

Deploy via Microsoft Intune for cloud-managed endpoints.

### Step 1: Prepare the Package

1. Convert the MSI to an `.intunewin` package using the [Intune Win32 Content Prep Tool](https://github.com/Microsoft/Microsoft-Win32-Content-Prep-Tool):

```powershell
IntuneWinAppUtil.exe -c .\source -s netrecon-agent-windows-x64.msi -o .\output
```

### Step 2: Create the App in Intune

1. Go to **Microsoft Intune Admin Center > Apps > Windows**
2. Click **Add > Windows app (Win32)**
3. Upload the `.intunewin` file
4. Configure:
   - **Install command**: `msiexec /i netrecon-agent-windows-x64.msi /quiet /norestart SERVER_URL="https://probe.netreconapp.com" ENROLLMENT_TOKEN="your-fleet-token"`
   - **Uninstall command**: `msiexec /x {product-code} /quiet`
   - **Detection rule**: File exists at `C:\Program Files\NetRecon\Agent\netrecon-agent.exe`

### Step 3: Assign

1. Assign to a device group or all devices
2. Set as **Required** for automatic deployment
3. Monitor deployment status in the Intune portal

## GPO Deployment

Deploy using Group Policy for Active Directory environments.

### Step 1: Prepare the Share

1. Copy the MSI to a network share accessible by all target machines:
   ```
   \\fileserver\software\netrecon\netrecon-agent-windows-x64.msi
   ```
2. Ensure the share has Read permissions for **Domain Computers**

### Step 2: Create the GPO

1. Open **Group Policy Management Console**
2. Create a new GPO linked to the target OU
3. Navigate to **Computer Configuration > Policies > Software Settings > Software Installation**
4. Right-click and select **New > Package**
5. Browse to the MSI on the network share
6. Select **Assigned** deployment method

### Step 3: Configure Parameters

Since GPO software installation does not support MSI properties directly, create a transform file (MST) or use a startup script instead:

Create a startup script at `\\fileserver\scripts\install-netrecon-agent.bat`:

```batch
@echo off
if not exist "C:\Program Files\NetRecon\Agent\netrecon-agent.exe" (
    msiexec /i "\\fileserver\software\netrecon\netrecon-agent-windows-x64.msi" /quiet /norestart SERVER_URL="https://probe.netreconapp.com" ENROLLMENT_TOKEN="your-fleet-token"
)
```

Assign this script under **Computer Configuration > Policies > Windows Settings > Scripts > Startup**.

## Agent Management

### Configuration File

The agent configuration is stored at:
```
C:\Program Files\NetRecon\Agent\config.yaml
```

```yaml
server_url: "https://probe.netreconapp.com"
heartbeat_interval: 30
report_interval: 900
log_level: "info"
log_file: "C:\\Program Files\\NetRecon\\Agent\\logs\\agent.log"
```

### Service Commands

```powershell
# Stop the agent
net stop NetReconAgent

# Start the agent
net start NetReconAgent

# Restart the agent
net stop NetReconAgent && net start NetReconAgent
```

### Uninstallation

Via Control Panel:
1. Open **Settings > Apps > Installed Apps**
2. Find "NetRecon Agent"
3. Click **Uninstall**

Via command line:
```powershell
msiexec /x netrecon-agent-windows-x64.msi /quiet
```

## Troubleshooting

### Agent not appearing in dashboard
- Verify the service is running: `sc query NetReconAgent`
- Check the agent log: `C:\Program Files\NetRecon\Agent\logs\agent.log`
- Verify the SERVER_URL is correct and reachable
- Ensure the enrollment token is valid and has not expired

### Service fails to start
- Check Windows Event Viewer for errors under **Application** log
- Verify the config.yaml file is valid YAML
- Ensure port 443 outbound is not blocked by a firewall

### High resource usage
- Check the log for errors causing rapid retries
- Verify the heartbeat and report intervals are not set too low
- Restart the service to clear any accumulated state

## FAQ

**Q: Does the agent work on Windows ARM (e.g., Surface Pro X)?**
A: Currently, the agent supports x64 architecture only. ARM64 support is planned.

**Q: Can I install the agent alongside other monitoring agents?**
A: Yes. The NetRecon agent is designed to coexist with other monitoring tools without conflicts.

**Q: Does the agent survive Windows updates and reboots?**
A: Yes. The agent runs as a Windows service set to automatic start, so it restarts after any reboot.

For additional help, contact [support@netreconapp.com](mailto:support@netreconapp.com).
