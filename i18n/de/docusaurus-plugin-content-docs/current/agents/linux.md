---
sidebar_position: 4
title: Linux Agent
description: NetRecon Agent auf Linux installieren und bereitstellen
---

# Linux Agent

Installieren Sie den NetRecon Agent auf Linux-Endgeräten für kontinuierliche Überwachung und Inventarberichte.

## Voraussetzungen

- Ubuntu 20.04+ / Debian 11+ / RHEL 8+ / Fedora 36+ (oder kompatibel)
- Root- oder sudo-Zugriff (für die Installation)
- Netzwerkverbindung zur Probe (direkt oder über Cloudflare Tunnel)
- Ein Registrierungstoken vom Probe-Dashboard
- systemd (für die Dienstverwaltung)

## Manuelle Installation

### Debian/Ubuntu (DEB)

#### Schritt 1: Paket herunterladen

```bash
# Vom Probe-Dashboard herunterladen oder curl verwenden:
curl -O https://probe.netreconapp.com/downloads/netrecon-agent-linux-amd64.deb
```

Für ARM64-Systeme:
```bash
curl -O https://probe.netreconapp.com/downloads/netrecon-agent-linux-arm64.deb
```

#### Schritt 2: Installieren

```bash
sudo dpkg -i netrecon-agent-linux-amd64.deb
```

#### Schritt 3: Konfigurieren und starten

```bash
sudo netrecon-agent configure \
  --server-url "https://probe.netreconapp.com" \
  --enrollment-token "your-token-here"

sudo systemctl enable --now netrecon-agent
```

### RHEL/Fedora (RPM)

#### Schritt 1: Paket herunterladen

```bash
curl -O https://probe.netreconapp.com/downloads/netrecon-agent-linux-amd64.rpm
```

#### Schritt 2: Installieren

```bash
sudo rpm -i netrecon-agent-linux-amd64.rpm
# oder mit dnf:
sudo dnf install ./netrecon-agent-linux-amd64.rpm
```

#### Schritt 3: Konfigurieren und starten

```bash
sudo netrecon-agent configure \
  --server-url "https://probe.netreconapp.com" \
  --enrollment-token "your-token-here"

sudo systemctl enable --now netrecon-agent
```

## CLI-Setup-Assistent

Der Agent enthält einen interaktiven Setup-Assistenten für die manuelle Konfiguration:

```bash
sudo netrecon-agent setup
```

Der Assistent fragt nach:
1. **Server-URL** — die HTTPS-URL der Probe
2. **Registrierungstoken** — fügen Sie Ihren Token ein
3. **Heartbeat-Intervall** — Häufigkeit der Check-ins (Standard: 30s)
4. **Berichtsintervall** — Häufigkeit des vollständigen Daten-Uploads (Standard: 15m)
5. **Log-Level** — debug, info, warn, error (Standard: info)

Nach Abschluss des Assistenten startet der Agent automatisch.

## Automatisierte Bereitstellung

### Einzeiler-Installationsskript

Für die schnelle Bereitstellung auf mehreren Servern:

```bash
curl -fsSL https://probe.netreconapp.com/install-agent.sh | sudo bash -s -- \
  --server-url "https://probe.netreconapp.com" \
  --enrollment-token "your-fleet-token"
```

Das Skript:
1. Erkennt die Linux-Distribution und Architektur
2. Lädt das passende Paket herunter (DEB oder RPM)
3. Installiert das Paket
4. Konfiguriert den Agent mit den bereitgestellten Parametern
5. Startet den Dienst

### Ansible Playbook

Für Konfigurationsmanagement im großen Maßstab:

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

### Shell-Skript für mehrere Server

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

## Agent-Verwaltung

### Konfigurationsdatei

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

### Dienst-Befehle

```bash
# Status prüfen
sudo systemctl status netrecon-agent

# Stoppen
sudo systemctl stop netrecon-agent

# Starten
sudo systemctl start netrecon-agent

# Neu starten
sudo systemctl restart netrecon-agent

# Protokolle anzeigen
sudo journalctl -u netrecon-agent -f
```

### Deinstallation

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

## SELinux-Konfiguration

Auf RHEL/Fedora-Systemen mit erzwingendem SELinux benötigt der Agent ein Policy-Modul:

```bash
# Das Agent-Paket enthält eine SELinux-Policy, aber falls nötig:
sudo semanage fcontext -a -t bin_t '/usr/local/bin/netrecon-agent'
sudo restorecon -v /usr/local/bin/netrecon-agent
```

Falls SELinux den Netzwerkzugriff blockiert:
```bash
sudo setsebool -P netrecon_agent_can_network_connect 1
```

## Firewall-Konfiguration

Der Agent benötigt nur **ausgehendes HTTPS (Port 443)**. Keine eingehenden Regeln erforderlich.

```bash
# UFW (Ubuntu)
sudo ufw allow out 443/tcp

# firewalld (RHEL/Fedora)
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## Fehlerbehebung

### Agent startet nicht
```bash
# Dienststatus prüfen
sudo systemctl status netrecon-agent

# Protokolle prüfen
sudo journalctl -u netrecon-agent --no-pager -n 50

# Konfigurationsdatei-Syntax überprüfen
netrecon-agent validate-config
```

### Zugriff verweigert
- Stellen Sie sicher, dass die Agent-Binärdatei Ausführungsberechtigung hat: `ls -la /usr/local/bin/netrecon-agent`
- SELinux-Verweigerungen prüfen: `sudo ausearch -m AVC -ts recent`

### Verbindung verweigert
- Konnektivität testen: `curl -I https://probe.netreconapp.com/api/health`
- DNS-Auflösung prüfen: `dig probe.netreconapp.com`
- Überprüfen, ob kein Proxy stört; ggf. `no_proxy` setzen

## FAQ

**F: Funktioniert der Agent auf Alpine Linux oder anderen musl-basierten Distributionen?**
A: Der Agent ist gegen glibc kompiliert. Alpine Linux und andere musl-basierte Distributionen werden derzeit nicht unterstützt.

**F: Kann ich den Agent in einem Docker-Container ausführen?**
A: Obwohl technisch möglich, ist der Agent dafür konzipiert, das Host-System zu überwachen. Die Ausführung in einem Container schränkt seine Fähigkeit ein, Host-Level-Daten zu sammeln. Installieren Sie ihn stattdessen direkt auf dem Host.

**F: Unterstützt der Agent ARM (32-Bit)?**
A: Der Linux Agent ist für amd64 (x86_64) und arm64 (aarch64) verfügbar. 32-Bit ARM wird nicht unterstützt.

Für weitere Hilfe kontaktieren Sie [support@netreconapp.com](mailto:support@netreconapp.com).
