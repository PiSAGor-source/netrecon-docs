---
sidebar_position: 2
title: Endpoint Reference
description: Complete API endpoint reference grouped by service and category
---

# Endpoint Reference

This page lists every REST API endpoint in the NetRecon platform, grouped by service category. All endpoints require JWT Bearer token authentication unless noted otherwise. See the [API Overview](./overview.md) for authentication and rate limiting details.

**Base URL:** `https://probe.netreconapp.com/api/`

---

## Probe Endpoints

Served by the Go backend running on the probe appliance (Orange Pi R2S, Raspberry Pi, or x86_64 mini PC).

### Health

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | No | Probe health check. Returns `{"status": "ok", "version": "1.0.0"}`. |

### Scanning

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/scan/discover` | Start ARP host discovery on the configured subnet. |
| `POST` | `/api/scan/ports` | Start a port scan against discovered hosts. |
| `GET` | `/api/scan/status` | Get current scan status (idle, running, complete). |

### Devices

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/devices` | List all discovered devices. Supports pagination (`?page=&per_page=`). |
| `GET` | `/api/devices/:mac` | Get details for a single device by MAC address. |
| `PUT` | `/api/devices/:mac/note` | Update the user note on a device. Body: `{"note": "..."}`. |

### Baseline

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/baseline` | List all saved network baselines. |
| `POST` | `/api/baseline` | Create a new baseline snapshot from the current device list. |
| `GET` | `/api/baseline/:id/diff` | Compare a baseline against the current network state. |

### Neighbors (CDP/LLDP)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/neighbors` | List discovered CDP/LLDP neighbors. |
| `POST` | `/api/neighbors/start` | Start the neighbor discovery listener. |

### Config Backup (Probe-local)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/config/targets` | List configured backup target devices. |
| `POST` | `/api/config/targets` | Add a new backup target device. |
| `POST` | `/api/config/targets/:id/check` | Trigger an immediate config check for a target. |

### PCAP Capture

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/pcap/start` | Start packet capture. Body: `{"interface": "eth0", "filter": "tcp port 80"}`. |
| `POST` | `/api/pcap/stop` | Stop the running packet capture. |
| `GET` | `/api/pcap/files` | List available PCAP capture files. |
| `GET` | `/api/pcap/download/:id` | Download a PCAP file by ID. Returns `application/octet-stream`. |

### IDS (Suricata)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/ids/status` | Get IDS service status (running, stopped, rule count). |
| `POST` | `/api/ids/start` | Start Suricata IDS monitoring. |
| `POST` | `/api/ids/stop` | Stop IDS monitoring. |
| `GET` | `/api/ids/alerts` | List IDS alerts. Supports `?since=24h` time filter. |

### Vulnerability Scanning (Nuclei)

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/vuln/scan` | Start a vulnerability scan against specified targets. |
| `POST` | `/api/vuln/stop` | Stop the running vulnerability scan. |
| `GET` | `/api/vuln/results` | Get vulnerability scan results. |
| `GET` | `/api/vuln/status` | Get vulnerability scanner status. |

### Honeypot

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/honeypot/status` | Get honeypot service status. |
| `POST` | `/api/honeypot/start` | Start the honeypot service. |
| `POST` | `/api/honeypot/stop` | Stop the honeypot service. |
| `GET` | `/api/honeypot/hits` | List honeypot interaction events. |

### Rogue Detection

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/rogue/status` | Get rogue detection service status. |
| `POST` | `/api/rogue/start` | Start rogue DHCP/ARP detection. |
| `POST` | `/api/rogue/stop` | Stop rogue detection. |
| `GET` | `/api/rogue/alerts` | List rogue DHCP and ARP spoofing alerts. |

### Network Monitor

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/monitor/targets` | Add a monitoring target (IP or hostname). |
| `GET` | `/api/monitor/targets` | List configured monitoring targets. |
| `POST` | `/api/monitor/start` | Start network monitoring. |
| `POST` | `/api/monitor/stop` | Stop network monitoring. |
| `GET` | `/api/monitor/latency` | Get latency measurements for monitored targets. |
| `GET` | `/api/monitor/packetloss` | Get packet loss data for monitored targets. |
| `GET` | `/api/monitor/status` | Get monitor service status. |

### VPN (WireGuard)

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/vpn/setup` | Configure WireGuard VPN parameters. |
| `GET` | `/api/vpn/status` | Get VPN connection status. |
| `POST` | `/api/vpn/start` | Start the VPN tunnel. |
| `POST` | `/api/vpn/stop` | Stop the VPN tunnel. |
| `GET` | `/api/vpn/config` | Download the WireGuard configuration. |

### DNS Sinkhole

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/dns/status` | Get DNS sinkhole service status. |
| `POST` | `/api/dns/start` | Start the DNS sinkhole. |
| `POST` | `/api/dns/stop` | Stop the DNS sinkhole. |
| `GET` | `/api/dns/threats` | List blocked DNS threat entries. |

### System Health

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/system/health` | Detailed system health (CPU, RAM, disk, temperature). |
| `GET` | `/api/system/history` | Historical system health data points. |
| `GET` | `/api/system/alerts` | List system health threshold alerts. |
| `POST` | `/api/system/thresholds` | Configure health alert thresholds (CPU %, RAM %, disk %). |

### Backup & Restore

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/backup/create` | Create a full probe backup (config + database). |
| `GET` | `/api/backup/list` | List available backup files. |
| `GET` | `/api/backup/download/:id` | Download a backup archive. Returns `application/octet-stream`. |
| `POST` | `/api/backup/restore` | Restore the probe from a backup file. |

### Ticketing

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/ticketing/config` | Get current ticketing integration configuration. |
| `POST` | `/api/ticketing/config` | Set ticketing configuration (ServiceNow, Jira, webhook URL). |
| `POST` | `/api/ticketing/test` | Send a test ticket to validate integration. |
| `POST` | `/api/ticketing/create` | Create a ticket from an alert or event. |
| `GET` | `/api/ticketing/history` | List previously created tickets. |

### WebSocket

| Method | Path | Description |
|---|---|---|
| `GET` | `/ws/events` | WebSocket connection for real-time probe events. Pass token via query: `?token=<jwt>`. |

#### WebSocket Event Types

| Event | Description |
|---|---|
| `host_found` | New device discovered |
| `port_found` | Open port detected on a device |
| `scan_complete` | Network scan finished |
| `neighbor_discovered` | CDP/LLDP neighbor found |
| `config_changed` | Device configuration changed |
| `baseline_diff_alert` | Network baseline deviation detected |
| `ids_alert` | IDS rule triggered |
| `honeypot_hit` | Honeypot interaction detected |
| `rogue_detected` | Rogue DHCP or ARP activity |
| `pcap_ready` | PCAP file ready for download |
| `vuln_found` | Vulnerability discovered |
| `dns_threat` | DNS threat blocked |
| `probe_health_alert` | Probe resource threshold exceeded |
| `error` | Error event |

---

## API Gateway Endpoints

Served by the FastAPI API Gateway (port 8000). Handles authentication, user management, RBAC, and proxy routing to backend services.

### Authentication

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate with username/password, receive a JWT token. |
| `POST` | `/api/auth/refresh` | Refresh an expiring JWT token. |

### Users

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/users` | List users in the organization. |
| `POST` | `/api/users` | Create a new user account. |
| `GET` | `/api/users/:id` | Get user details. |
| `PUT` | `/api/users/:id` | Update a user. |
| `DELETE` | `/api/users/:id` | Delete a user. |

### RBAC (Role-Based Access Control)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/rbac/roles` | List all defined roles. |
| `POST` | `/api/rbac/roles` | Create a custom role with specific permissions. |
| `PUT` | `/api/rbac/roles/:id` | Update role permissions. |
| `DELETE` | `/api/rbac/roles/:id` | Delete a role. |
| `GET` | `/api/rbac/permissions` | List all available permissions. |

### API Keys

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/keys` | List API keys for the organization. |
| `POST` | `/api/keys` | Create a new long-lived API key. |
| `DELETE` | `/api/keys/:id` | Revoke an API key. |

### IP Allowlist

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/ip-allowlist` | List allowed IP ranges. |
| `POST` | `/api/ip-allowlist` | Add an IP or CIDR range to the allowlist. |
| `DELETE` | `/api/ip-allowlist/:id` | Remove an IP range from the allowlist. |

### Monitoring (Prometheus Proxy)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/monitoring/metrics` | Proxy to Prometheus metrics endpoint. |
| `GET` | `/api/monitoring/query` | Proxy a PromQL query to Prometheus. |

### Oxidized (Config Backup Proxy)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/oxidized/nodes` | List Oxidized-managed network nodes. |
| `GET` | `/api/oxidized/nodes/:name` | Get configuration history for a node. |
| `POST` | `/api/oxidized/nodes` | Add a node to Oxidized management. |

### Vault Config

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/vault/config` | Get vault integration settings. |
| `POST` | `/api/vault/config` | Update vault integration settings. |

---

## IPAM Service Endpoints

IP Address Management service (port 8009). All paths are prefixed with `/api/v1/ipam`.

### Prefixes (Subnets)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/ipam/prefixes` | List all managed prefixes/subnets. |
| `POST` | `/api/v1/ipam/prefixes` | Create a new prefix. Body: `prefix` (CIDR notation), `description`, `site`, `status`, optional `vlan_id`. |
| `GET` | `/api/v1/ipam/prefixes/:id` | Get a single prefix with recalculated utilization percentage. |
| `PUT` | `/api/v1/ipam/prefixes/:id` | Update a prefix. |
| `DELETE` | `/api/v1/ipam/prefixes/:id` | Delete a prefix. Returns `204 No Content`. |
| `GET` | `/api/v1/ipam/prefixes/:id/available` | List unallocated IPs in the prefix. Capped at 256 results. |
| `POST` | `/api/v1/ipam/prefixes/:id/next-available` | Allocate the next free IP in the prefix. Returns the new address record. |

### Addresses

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/ipam/addresses` | List addresses. Filters: `?prefix_id=`, `?status=`, `?vendor=`, `?search=`. Max 1000 results. |
| `POST` | `/api/v1/ipam/addresses` | Create a new IP address record. |
| `GET` | `/api/v1/ipam/addresses/:id` | Get a single address by UUID. |
| `PUT` | `/api/v1/ipam/addresses/:id` | Update an address record. |
| `DELETE` | `/api/v1/ipam/addresses/:id` | Delete an address record. Returns `204 No Content`. |
| `POST` | `/api/v1/ipam/addresses/bulk-import` | Bulk upsert addresses by IP. Existing records are updated, new ones are created. |

### VLANs

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/ipam/vlans` | List all VLANs, ordered by VLAN ID. |
| `POST` | `/api/v1/ipam/vlans` | Create a new VLAN record. Body: `vlan_id`, `name`, `description`, `status`. |
| `PUT` | `/api/v1/ipam/vlans/:id` | Update a VLAN. |
| `DELETE` | `/api/v1/ipam/vlans/:id` | Delete a VLAN. Returns `204 No Content`. |

### Analytics

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/ipam/stats` | Overall IPAM statistics: total prefixes, total addresses, average utilization, conflict count. |
| `GET` | `/api/v1/ipam/utilization` | Per-prefix utilization breakdown with address counts. |
| `GET` | `/api/v1/ipam/conflicts` | Find conflicting assignments (duplicate MACs with different IPs). |

### Import / Export

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/v1/ipam/import/scan` | Import devices from a NetRecon scan payload. Upserts by IP with automatic prefix matching. |
| `GET` | `/api/v1/ipam/export/csv` | Export all addresses as CSV. Returns `text/csv` with `Content-Disposition` header. |
| `GET` | `/api/v1/ipam/export/json` | Export all IPAM data (prefixes, addresses, VLANs) as JSON. |

---

## CMod Service Endpoints

Configuration Management on Demand (port 8008). Provides SSH and serial console access to network devices. All paths are prefixed with `/api/v1/cmod`.

### Sessions

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/v1/cmod/connect` | Open a new SSH or serial session. Body: `host`, `device_type`, `username`, `password`, optional `port`, `serial_port`. Returns session info with `session_id`. |
| `POST` | `/api/v1/cmod/disconnect` | Close a session. Query: `?session_id=`. |
| `GET` | `/api/v1/cmod/sessions` | List all active sessions. |
| `GET` | `/api/v1/cmod/sessions/:session_id` | Get session details and full command log. |
| `DELETE` | `/api/v1/cmod/sessions/:session_id` | Terminate a session. |

### Commands

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/v1/cmod/send-command` | Send a single command. Body: `session_id`, `command`, optional `expect_string`, `read_timeout`. |
| `POST` | `/api/v1/cmod/send-batch` | Send multiple commands sequentially. Body: `session_id`, `commands[]`, optional `delay_factor`. |

### Config Operations

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/v1/cmod/backup` | Retrieve running config from a device. Auto-selects the correct command per vendor (Cisco IOS/NX-OS/XR, Huawei, Juniper, Arista, HP). |
| `POST` | `/api/v1/cmod/rollback` | Push a configuration snippet to the device in config mode. Body: `session_id`, `config` (multiline string). |

### Templates

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/cmod/templates` | List command templates. Filters: `?vendor=cisco_ios`, `?category=backup`. Pre-seeded templates for Cisco IOS, Huawei, and Juniper JunOS. |
| `POST` | `/api/v1/cmod/templates` | Create a custom command template. Body: `name`, `vendor`, `category`, `commands[]`, `description`. |

---

## Agent Registry Endpoints

Agent management service (port 8006). Handles enrollment, heartbeats, inventory, and deployment for Windows, macOS, and Linux agents.

### Agent Lifecycle

| Method | Path | Description |
|---|---|---|
| `POST` | `/agents/enroll` | Enroll a new agent using a deployment token. Body: `deployment_token`, `hostname`, `os_type`, `os_version`, `arch`, `agent_version`. |
| `POST` | `/agents/heartbeat` | Agent heartbeat. Headers: `X-Agent-ID`, `X-Session-Key`. |
| `POST` | `/agents/inventory` | Push hardware/software inventory. Headers: `X-Agent-ID`, `X-Session-Key`. |
| `GET` | `/agents` | List all agents in the organization. Header: `X-Org-ID`. |
| `GET` | `/agents/:agent_id` | Get full agent details including hardware specs and warranty status. |
| `DELETE` | `/agents/:agent_id` | Remove an agent from the registry. |

### Deployment Tokens

| Method | Path | Description |
|---|---|---|
| `POST` | `/agents/tokens` | Create a deployment token. Headers: `X-Org-ID`, `X-User-ID`. Body: `expires_in_hours`, `max_uses`, `label`, optional `site_id`, `metadata`. Returns token string and platform-specific install commands. |
| `GET` | `/agents/tokens` | List deployment tokens for the organization. Header: `X-Org-ID`. |
| `DELETE` | `/agents/tokens/:token_id` | Revoke a deployment token. |

### Deployment Package Generator

| Method | Path | Description |
|---|---|---|
| `POST` | `/agents/deploy/generate` | Generate platform-specific deployment artifacts. Body: `platform` (windows, linux, macos, ios, android), `method` (msi, powershell, sccm, intune, gpo, pkg, brew, jamf, mdm, deb, rpm, bash, docker, qr, email, mdm_app, managed_play), `role`. Returns enrollment token, install commands, scripts, or manifest content. |
| `GET` | `/agents/deploy/quota` | Get device quota usage for the organization. Header: `X-Org-ID`. |
| `GET` | `/agents/deploy/platforms` | List all supported platforms and their available deployment methods. No auth required. |

### Remote Connect

| Method | Path | Description |
|---|---|---|
| `POST` | `/agents/:agent_id/remote/request` | Request a new remote session (RDP, SSH, VNC, ADB) to an enrolled agent. Header: `X-User-ID`. Body: `session_type`, optional `credential_id`, `timeout_hours`. |
| `GET` | `/agents/:agent_id/remote/status` | Get remote-readiness status (online state, Headscale IP, available session types). |
| `POST` | `/agents/:agent_id/remote/end` | End the active remote session for an agent. Header: `X-User-ID`. |
| `GET` | `/remote/sessions` | List remote sessions for the organization. Header: `X-Org-ID`. Query: `?active_only=true` (default). |
| `POST` | `/agents/:agent_id/remote/ready` | Agent callback when remote service is prepared. Headers: `X-Agent-ID`, `X-Session-Key`. |
| `POST` | `/remote/cleanup` | Expire stale remote sessions. Intended for internal scheduler/cron use. |

---

## Diplomat Service Endpoints

Email classification and log analysis service (port 8010). All paths are prefixed with `/api/v1/diplomat`.

### Classification

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/v1/diplomat/classify` | Classify input text (ticket, alert, email) into a category and priority level. |
| `POST` | `/api/v1/diplomat/summarize` | Generate a summary of the provided text. |
| `POST` | `/api/v1/diplomat/translate` | Translate text to a specified target language. |
| `POST` | `/api/v1/diplomat/analyze-log` | Analyze a log snippet and extract key events, errors, and patterns. |

### Email Pipeline

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/diplomat/emails/stats` | Get email processing statistics (received, classified, responded counts). |
| `GET` | `/api/v1/diplomat/emails/recent` | List recently processed emails. |

### Health

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/diplomat/health` | No | Diplomat service health check. |

---

## Service Health Endpoints

Each microservice exposes a `/health` endpoint for internal monitoring and load balancer checks.

| Service | URL | Port |
|---|---|---|
| API Gateway | `/health` | 8000 |
| Vault Server | `/health` | 8001 |
| License Server | `/health` | 8002 |
| Email Service | `/health` | 8003 |
| Notification Service | `/health` | 8004 |
| Update Server | `/health` | 8005 |
| Agent Registry | `/health` | 8006 |
| Warranty Service | `/health` | 8007 |
| CMod Service | `/health` | 8008 |
| IPAM Service | `/health` | 8009 |
| Diplomat Service | `/health` | 8010 |

---

## Support

For API-related questions or issues, contact [support@netreconapp.com](mailto:support@netreconapp.com).
