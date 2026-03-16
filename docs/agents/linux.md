---
sidebar_position: 4
title: Linux Agent
description: Install and deploy the NetRecon agent on Linux
---

# Linux Agent

Install the NetRecon agent on Linux endpoints for continuous monitoring and inventory reporting.

## Prerequisites

- Ubuntu 20.04+ / Debian 11+ / RHEL 8+ / Fedora 36+ (or compatible)
- Root or sudo access (for installation)
- Network connectivity to the probe (direct or via Cloudflare Tunnel)
- An enrollment token from the probe dashboard
- systemd (for service management)

## Manual Installation

### Debian/Ubuntu (DEB)

#### Step 1: Download the Package

```bash
# Download from the probe dashboard, or use curl:
curl -O https://probe.netreconapp.com/downloads/netrecon-agent-linux-amd64.deb
```

For ARM64 systems:
```bash
curl -O https://probe.netreconapp.com/downloads/netrecon-agent-linux-arm64.deb
```

#### Step 2: Install

```bash
sudo dpkg -i netrecon-agent-linux-amd64.deb
```

#### Step 3: Configure and Start

```bash
sudo netrecon-agent configure \
  --server-url "https://probe.netreconapp.com" \
  --enrollment-token "your-token-here"

sudo systemctl enable --now netrecon-agent
```

### RHEL/Fedora (RPM)

#### Step 1: Download the Package

```bash
curl -O https://probe.netreconapp.com/downloads/netrecon-agent-linux-amd64.rpm
```

#### Step 2: Install

```bash
sudo rpm -i netrecon-agent-linux-amd64.rpm
# or with dnf:
sudo dnf install ./netrecon-agent-linux-amd64.rpm
```

#### Step 3: Configure and Start

```bash
sudo netrecon-agent configure \
  --server-url "https://probe.netreconapp.com" \
  --enrollment-token "your-token-here"

sudo systemctl enable --now netrecon-agent
```

## CLI Setup Wizard

The agent includes an interactive setup wizard for manual configuration:

```bash
sudo netrecon-agent setup
```

The wizard prompts for:
1. **Server URL** — the probe's HTTPS URL
2. **Enrollment Token** — paste your token
3. **Heartbeat Interval** — frequency of check-ins (default: 30s)
4. **Report Interval** — frequency of full data upload (default: 15m)
5. **Log Level** — debug, info, warn, error (default: info)

After completing the wizard, the agent starts automatically.

## Automated Deployment

### One-Line Install Script

For quick deployment across multiple servers:

```bash
curl -fsSL https://probe.netreconapp.com/install-agent.sh | sudo bash -s -- \
  --server-url "https://probe.netreconapp.com" \
  --enrollment-token "your-fleet-token"
```

The script:
1. Detects the Linux distribution and architecture
2. Downloads the appropriate package (DEB or RPM)
3. Installs the package
4. Configures the agent with the provided parameters
5. Starts the service

### Ansible Playbook

For configuration management at scale:

```yaml
---
- name: Deploy NetRecon Agent
  hosts: all
  become: true
  vars:
    netrecon_server_url: "https://probe.netreconapp.com"
    netrecon_enrollment_token: "your-fleet-token"
    netrecon_agent_version: "2.2.0"

  tasks:
    - name: Download agent package (Debian)
      get_url:
        url: "{{ netrecon_server_url }}/downloads/netrecon-agent-linux-{{ ansible_architecture }}.deb"
        dest: /tmp/netrecon-agent.deb
      when: ansible_os_family == "Debian"

    - name: Install agent (Debian)
      apt:
        deb: /tmp/netrecon-agent.deb
      when: ansible_os_family == "Debian"

    - name: Download agent package (RedHat)
      get_url:
        url: "{{ netrecon_server_url }}/downloads/netrecon-agent-linux-{{ ansible_architecture }}.rpm"
        dest: /tmp/netrecon-agent.rpm
      when: ansible_os_family == "RedHat"

    - name: Install agent (RedHat)
      dnf:
        name: /tmp/netrecon-agent.rpm
        state: present
      when: ansible_os_family == "RedHat"

    - name: Configure agent
      command: >
        netrecon-agent configure
        --server-url "{{ netrecon_server_url }}"
        --enrollment-token "{{ netrecon_enrollment_token }}"

    - name: Enable and start agent
      systemd:
        name: netrecon-agent
        enabled: true
        state: started
```

### Shell Script for Multiple Servers

```bash
#!/bin/bash
SERVERS="server1.example.com server2.example.com server3.example.com"
TOKEN="your-fleet-token"
SERVER_URL="https://probe.netreconapp.com"

for server in $SERVERS; do
  echo "Deploying to $server..."
  ssh root@$server "curl -fsSL ${SERVER_URL}/install-agent.sh | bash -s -- --server-url ${SERVER_URL} --enrollment-token ${TOKEN}"
done
```

## Agent Management

### Configuration File

```
/etc/netrecon/agent.yaml
```

```yaml
server_url: "https://probe.netreconapp.com"
heartbeat_interval: 30
report_interval: 900
log_level: "info"
log_file: "/var/log/netrecon/agent.log"
```

### Service Commands

```bash
# Check status
sudo systemctl status netrecon-agent

# Stop
sudo systemctl stop netrecon-agent

# Start
sudo systemctl start netrecon-agent

# Restart
sudo systemctl restart netrecon-agent

# View logs
sudo journalctl -u netrecon-agent -f
```

### Uninstallation

Debian/Ubuntu:
```bash
sudo systemctl stop netrecon-agent
sudo apt remove netrecon-agent
```

RHEL/Fedora:
```bash
sudo systemctl stop netrecon-agent
sudo dnf remove netrecon-agent
```

## SELinux Configuration

On RHEL/Fedora systems with SELinux enforcing, the agent needs a policy module:

```bash
# The agent package includes an SELinux policy, but if needed:
sudo semanage fcontext -a -t bin_t '/usr/local/bin/netrecon-agent'
sudo restorecon -v /usr/local/bin/netrecon-agent
```

If SELinux blocks network access:
```bash
sudo setsebool -P netrecon_agent_can_network_connect 1
```

## Firewall Configuration

The agent only requires **outbound HTTPS (port 443)**. No inbound rules are needed.

```bash
# UFW (Ubuntu)
sudo ufw allow out 443/tcp

# firewalld (RHEL/Fedora)
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## Troubleshooting

### Agent not starting
```bash
# Check service status
sudo systemctl status netrecon-agent

# Check logs
sudo journalctl -u netrecon-agent --no-pager -n 50

# Verify config file syntax
netrecon-agent validate-config
```

### Permission denied
- Ensure the agent binary has execute permission: `ls -la /usr/local/bin/netrecon-agent`
- Check SELinux denials: `sudo ausearch -m AVC -ts recent`

### Connection refused
- Test connectivity: `curl -I https://probe.netreconapp.com/api/health`
- Check DNS resolution: `dig probe.netreconapp.com`
- Verify no proxy is interfering; set `no_proxy` if needed

## FAQ

**Q: Does the agent work on Alpine Linux or other musl-based distributions?**
A: The agent is compiled against glibc. Alpine Linux and other musl-based distributions are not currently supported.

**Q: Can I run the agent in a Docker container?**
A: While technically possible, the agent is designed to monitor the host system. Running it in a container limits its ability to gather host-level data. Install directly on the host instead.

**Q: Does the agent support ARM (32-bit)?**
A: The Linux agent is available for amd64 (x86_64) and arm64 (aarch64). 32-bit ARM is not supported.

For additional help, contact [support@netreconapp.com](mailto:support@netreconapp.com).
