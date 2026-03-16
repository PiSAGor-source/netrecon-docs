---
sidebar_position: 3
title: Steel Shield
description: Security hardening features for self-hosted deployments
---

# Steel Shield

Steel Shield is NetRecon's security hardening framework. It provides multiple layers of protection for self-hosted deployments, ensuring the integrity and authenticity of all platform components.

## Overview

Steel Shield includes four core security mechanisms:

| Feature | Purpose |
|---|---|
| **Binary Integrity** | Verify that executables have not been tampered with |
| **Certificate Pinning** | Prevent man-in-the-middle attacks on API communication |
| **Tamper Response** | Detect and respond to unauthorized modifications |
| **Runtime Protection** | Guard against memory manipulation and debugging |

## Binary Integrity Verification

Every NetRecon binary (probe backend, agents, services) is digitally signed. On startup, each component verifies its own integrity.

### How It Works

1. During build, each binary is signed with a private key held by NetRecon
2. The signature is embedded in the binary metadata
3. On startup, the binary computes a SHA-256 hash of itself
4. The hash is verified against the embedded signature
5. If verification fails, the binary refuses to start and logs an alert

### Manual Verification

Verify a binary's integrity manually:

```bash
# Verify the probe backend
netrecon-verify /usr/local/bin/netrecon-probe

# Verify an agent
netrecon-verify /usr/local/bin/netrecon-agent

# Expected output:
# Binary: /usr/local/bin/netrecon-probe
# SHA-256: a1b2c3d4e5f6...
# Signature: VALID
# Signed by: NetRecon Build System
# Signed at: 2026-03-15T10:00:00Z
```

### Docker Image Verification

Docker images are signed using Docker Content Trust (DCT):

```bash
# Enable content trust
export DOCKER_CONTENT_TRUST=1

# Pull with signature verification
docker pull netrecon/api-gateway:latest
```

## Certificate Pinning

Certificate pinning ensures that NetRecon components only communicate with legitimate servers, preventing interception even if a certificate authority is compromised.

### Pinned Connections

| Connection | Pinning Type |
|---|---|
| Agent to Probe | Public key pin |
| Admin Connect to Probe | Certificate fingerprint |
| Probe to Update Server | Public key pin |
| Probe to License Server | Certificate fingerprint |

### How It Works

1. The expected certificate public key hash is embedded in each client binary
2. When establishing a TLS connection, the client extracts the server's public key
3. The client computes a SHA-256 hash of the public key
4. If the hash does not match the pinned value, the connection is rejected
5. Failed pin validation triggers a security alert

### Pin Rotation

When certificates are rotated:

1. New pins are distributed via the update server before the certificate change
2. Both old and new pins are valid during the transition period
3. After the transition, old pins are removed in the next update

For self-hosted deployments, update pins in the configuration:

```yaml
# /etc/netrecon/security.yaml
certificate_pins:
  api_gateway:
    - "sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="  # Current
    - "sha256/BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB="  # Backup
```

## Tamper Response

Steel Shield monitors critical files and configurations for unauthorized changes.

### Monitored Items

| Item | Check Frequency | Response |
|---|---|---|
| Binary files | On startup + every 1 hour | Alert + optional shutdown |
| Configuration files | Every 5 minutes | Alert + revert to backup |
| Database integrity | Every 15 minutes | Alert + consistency check |
| TLS certificates | Every 5 minutes | Alert if changed |
| System packages | Daily | Alert if unexpected changes |

### Response Actions

When tampering is detected, Steel Shield can:

1. **Log** — record the event in the security audit log
2. **Alert** — send a notification via configured channels
3. **Revert** — restore the tampered file from a known-good backup
4. **Isolate** — restrict network access to management-only
5. **Shutdown** — stop the service to prevent further compromise

Configure the response level:

```yaml
# /etc/netrecon/security.yaml
tamper_response:
  level: "alert_and_revert"  # Options: log, alert, alert_and_revert, isolate, shutdown
  notify_email: "security@yourcompany.com"
```

### File Integrity Database

Steel Shield maintains a hash database of all protected files:

```bash
# Initialize the integrity database
netrecon-shield init

# Check integrity manually
netrecon-shield verify

# Expected output:
# Checked 47 files
# Status: ALL INTACT
# Last verified: 2026-03-15T14:30:00Z
```

## Runtime Protection

### Anti-Debugging

In production mode, NetRecon binaries include anti-debugging measures:
- Detection of attached debuggers (ptrace on Linux, IsDebuggerPresent on Windows)
- Timing checks for single-step execution
- When debugging is detected in production, the process exits gracefully

:::info
Anti-debugging is disabled in development builds to allow normal debugging workflows.
:::

### Memory Protection

- Sensitive data (tokens, keys, passwords) is stored in protected memory regions
- Memory is zeroed after use to prevent remnant data exposure
- On Linux, `mlock` is used to prevent sensitive pages from being swapped to disk

## Configuration

### Enable Steel Shield

Steel Shield is enabled by default in production deployments. Configure it in:

```yaml
# /etc/netrecon/security.yaml
steel_shield:
  enabled: true
  binary_integrity: true
  certificate_pinning: true
  tamper_response: true
  runtime_protection: true
  integrity_check_interval: 3600  # seconds
  tamper_check_interval: 300      # seconds
```

### Disable for Development

For development and testing environments:

```yaml
steel_shield:
  enabled: false
```

Or disable specific features:

```yaml
steel_shield:
  enabled: true
  binary_integrity: false   # Skip hash verification during dev
  runtime_protection: false  # Allow debugger attachment
```

## Audit Trail

All Steel Shield events are logged to the security audit log:

```bash
# View recent security events
netrecon-shield audit --last 24h

# Export audit log
netrecon-shield audit --export csv --output security-audit.csv
```

Audit log entries include:
- Timestamp
- Event type (integrity_check, pin_validation, tamper_detected, etc.)
- Component affected
- Result (pass/fail)
- Action taken
- Additional details

## Self-Hosted Considerations

When self-hosting, keep in mind:

1. **Custom certificates**: If using your own CA, update the certificate pin configuration after deployment
2. **Binary updates**: After updating binaries, run `netrecon-shield init` to rebuild the integrity database
3. **Backup the integrity database**: Include `/etc/netrecon/integrity.db` in your backup routine
4. **Monitor alerts**: Configure email or webhook notifications for tamper alerts

## FAQ

**Q: Can Steel Shield cause false positives?**
A: False positives are rare but can occur after system updates that modify shared libraries. Run `netrecon-shield init` after system updates to refresh the integrity database.

**Q: Does Steel Shield affect performance?**
A: The performance impact is minimal. Integrity checks run in a background thread and typically complete in under 1 second.

**Q: Can I integrate Steel Shield alerts with my SIEM?**
A: Yes. Configure syslog output in the security configuration to forward events to your SIEM. Steel Shield supports syslog (RFC 5424) and JSON output formats.

**Q: Is Steel Shield required for production deployments?**
A: Steel Shield is strongly recommended but not strictly required. You can disable it, but doing so removes important security protections.

For additional help, contact [support@netreconapp.com](mailto:support@netreconapp.com).
