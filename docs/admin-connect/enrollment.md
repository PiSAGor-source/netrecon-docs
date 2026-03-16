---
sidebar_position: 2
title: Enrollment
description: Enroll probes into Admin Connect via QR code or manual setup
---

# Probe Enrollment

Enrollment is the process of connecting a probe to your Admin Connect app. Once enrolled, you can monitor and manage the probe remotely from anywhere.

## Prerequisites

- Admin Connect app installed on your Android device
- A NetRecon Probe that has completed the setup wizard
- Internet access on both the probe and your mobile device

## Method 1: QR Code Enrollment

QR code enrollment is the fastest and most reliable method. The QR code contains the probe's connection details and authentication token in an encrypted format.

### Step 1: Display the QR Code

The QR code is available in two places:

**During Setup Wizard:**
At the end of the wizard (Step 11), a QR code is displayed on the summary screen.

**From the Probe Dashboard:**
1. Log into the probe dashboard at `https://<probe-ip>:3000`
2. Navigate to **Settings > Remote Access**
3. Click **Generate Enrollment QR Code**
4. A QR code will be displayed on screen

### Step 2: Scan the QR Code

1. Open Admin Connect
2. Tap the **+** button to add a new probe
3. Select **Scan QR Code**
4. Point your camera at the QR code displayed on the probe
5. The app will automatically parse the connection details

### Step 3: Verify and Connect

1. Review the probe details shown in the app (hostname, IP, tunnel URL)
2. Tap **Connect**
3. The app will establish a secure connection to the probe
4. Once connected, the probe appears in your fleet dashboard

### QR Code Contents

The QR code encodes a JSON payload containing:

```json
{
  "hostname": "netrecon-hq",
  "tunnel_url": "https://probe.netreconapp.com",
  "token": "<enrollment-token>",
  "fingerprint": "<certificate-fingerprint>",
  "version": "2.2.0"
}
```

The enrollment token is a one-time use token that expires after 24 hours.

## Method 2: Manual Enrollment

Use manual enrollment when you cannot physically access the probe to scan a QR code.

### Step 1: Obtain Connection Details

You will need the following from your probe administrator:
- **Tunnel URL**: typically `https://probe.netreconapp.com` or a custom domain
- **Enrollment Token**: a 32-character alphanumeric string
- **Certificate Fingerprint** (optional): for certificate pinning verification

### Step 2: Enter Details in Admin Connect

1. Open Admin Connect
2. Tap the **+** button to add a new probe
3. Select **Manual Setup**
4. Enter the required fields:
   - **Probe Name**: a friendly name for identification
   - **Tunnel URL**: the HTTPS URL for the probe
   - **Enrollment Token**: paste the token provided by your administrator
5. Tap **Connect**

### Step 3: Verify Connection

1. The app will attempt to connect and authenticate
2. If successful, the probe details will be displayed
3. Tap **Add to Fleet** to confirm

## Enterprise Enrollment

For large-scale deployments, Admin Connect supports bulk enrollment:

### MDM Managed Configuration

Deploy enrollment settings via your MDM solution:

```xml
<managedAppConfiguration>
  <key>probe_url</key>
  <value>https://probe.netreconapp.com</value>
  <key>enrollment_token</key>
  <value>your-enrollment-token</value>
  <key>auto_enroll</key>
  <value>true</value>
</managedAppConfiguration>
```

### Fleet Enrollment Token

Generate a reusable fleet enrollment token from the probe dashboard:

1. Navigate to **Settings > Remote Access > Fleet Enrollment**
2. Click **Generate Fleet Token**
3. Set an expiration date and maximum enrollment count
4. Distribute the token to your team

Fleet tokens can be used by multiple Admin Connect instances to enroll the same probe.

## Managing Enrolled Probes

### Viewing Enrolled Probes

All enrolled probes appear in the Admin Connect home screen. Each probe shows:
- Connection status (online/offline)
- Last seen timestamp
- Health summary (CPU, RAM, disk)
- Active alert count

### Removing a Probe

1. Long-press the probe in the fleet list
2. Select **Remove Probe**
3. Confirm the removal

This removes the probe from your app only. The probe itself is not affected.

### Re-enrollment

If you need to re-enroll a probe (e.g., after a token rotation):
1. Remove the probe from Admin Connect
2. Generate a new enrollment QR code or token on the probe
3. Re-enroll using either method above

## Troubleshooting

### QR code scan fails
- Ensure adequate lighting and hold the camera steady
- Try increasing screen brightness on the device displaying the QR code
- If the camera cannot focus, try moving closer or further from the screen

### Connection timeout
- Verify the probe has internet access and the Cloudflare Tunnel is active
- Check that no firewall is blocking outbound HTTPS (port 443) on your mobile device
- Try switching between Wi-Fi and mobile data

### Token expired
- Enrollment tokens expire after 24 hours
- Generate a new QR code or token from the probe dashboard

## FAQ

**Q: Can multiple users enroll the same probe?**
A: Yes. Each user enrolls independently and receives their own session. Access is controlled by the role assigned to each user (see [RBAC](./rbac.md)).

**Q: Does enrollment work over a local network without internet?**
A: Manual enrollment can work over a local network by using the probe's local IP address instead of the tunnel URL. QR enrollment also works locally.

**Q: How do I rotate enrollment tokens?**
A: Navigate to **Settings > Remote Access** on the probe dashboard and click **Rotate Token**. This invalidates all previous tokens.

For additional help, contact [support@netreconapp.com](mailto:support@netreconapp.com).
