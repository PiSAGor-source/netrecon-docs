---
sidebar_position: 4
title: Linux agent
description: Installige ja juurutage NetReconi agent Linuxis
---

# Linux agent

Installige NetReconi agent Linuxi lõppseadmetele pidevaks jälgimiseks ja inventuuri raporteerimiseks.

## Eeltingimused

- Ubuntu 20.04+ / Debian 11+ / RHEL 8+ / Fedora 36+ (või ühilduv)
- Root- või sudo-juurdepääs (paigaldamiseks)
- Võrguühendus sondiga (otse või Cloudflare Tunneli kaudu)
- Registreerimistõend sondi juhtpaneelilt
- systemd (teenuse haldamiseks)

## Käsitsi paigaldamine

### Debian/Ubuntu (DEB)

#### 1. samm: laadige pakett alla

```bash
# Laadige alla sondi juhtpaneelilt või kasutage curl-i:
curl -O https://probe.netreconapp.com/downloads/netrecon-agent-linux-amd64.deb
```

ARM64 süsteemide jaoks:
```bash
curl -O https://probe.netreconapp.com/downloads/netrecon-agent-linux-arm64.deb
```

#### 2. samm: installige

```bash
sudo dpkg -i netrecon-agent-linux-amd64.deb
```

#### 3. samm: konfigureerige ja käivitage

```bash
sudo netrecon-agent configure \
  --server-url "https://probe.netreconapp.com" \
  --enrollment-token "your-token-here"

sudo systemctl enable --now netrecon-agent
```

### RHEL/Fedora (RPM)

#### 1. samm: laadige pakett alla

```bash
curl -O https://probe.netreconapp.com/downloads/netrecon-agent-linux-amd64.rpm
```

#### 2. samm: installige

```bash
sudo rpm -i netrecon-agent-linux-amd64.rpm
# või dnf-iga:
sudo dnf install ./netrecon-agent-linux-amd64.rpm
```

#### 3. samm: konfigureerige ja käivitage

```bash
sudo netrecon-agent configure \
  --server-url "https://probe.netreconapp.com" \
  --enrollment-token "your-token-here"

sudo systemctl enable --now netrecon-agent
```

## CLI seadistusviisard

Agent sisaldab interaktiivset seadistusviisardit käsitsi konfigureerimiseks:

```bash
sudo netrecon-agent setup
```

Viisard küsib:
1. **Serveri URL** — sondi HTTPS URL
2. **Registreerimistõend** — kleepige oma tõend
3. **Südamelöögi intervall** — registreerimise sagedus (vaikimisi: 30s)
4. **Raporti intervall** — täisandmete üleslaadimise sagedus (vaikimisi: 15m)
5. **Logimise tase** — debug, info, warn, error (vaikimisi: info)

Pärast viisardi lõpuleviimist käivitub agent automaatselt.

## Automatiseeritud juurutamine

### Üherealise installimise skript

Kiireks juurutamiseks mitmel serveril:

```bash
curl -fsSL https://probe.netreconapp.com/install-agent.sh | sudo bash -s -- \
  --server-url "https://probe.netreconapp.com" \
  --enrollment-token "your-fleet-token"
```

Skript:
1. Tuvastab Linuxi distributsiooni ja arhitektuuri
2. Laadib alla sobiva paketi (DEB või RPM)
3. Installib paketi
4. Konfigureerib agendi antud parameetritega
5. Käivitab teenuse

### Ansible Playbook

Konfiguratsioonihalduseks mastaabis:

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

### Kestskript mitme serveri jaoks

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

## Agendi haldamine

### Konfiguratsioonifail

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

### Teenuse käsud

```bash
# Kontrollige olekut
sudo systemctl status netrecon-agent

# Peatage
sudo systemctl stop netrecon-agent

# Käivitage
sudo systemctl start netrecon-agent

# Taaskäivitage
sudo systemctl restart netrecon-agent

# Vaadake logisid
sudo journalctl -u netrecon-agent -f
```

### Eemaldamine

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

## SELinuxi konfiguratsioon

RHEL/Fedora süsteemides, kus SELinux on jõustatud, vajab agent poliitikamoodulit:

```bash
# Agendi pakett sisaldab SELinuxi poliitikat, kuid vajadusel:
sudo semanage fcontext -a -t bin_t '/usr/local/bin/netrecon-agent'
sudo restorecon -v /usr/local/bin/netrecon-agent
```

Kui SELinux blokeerib võrgujuurdepääsu:
```bash
sudo setsebool -P netrecon_agent_can_network_connect 1
```

## Tulemüüri konfiguratsioon

Agent vajab ainult **väljaminevat HTTPS-i (port 443)**. Sissetulevaid reegleid pole vaja.

```bash
# UFW (Ubuntu)
sudo ufw allow out 443/tcp

# firewalld (RHEL/Fedora)
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## Veaotsing

### Agent ei käivitu
```bash
# Kontrollige teenuse olekut
sudo systemctl status netrecon-agent

# Kontrollige logisid
sudo journalctl -u netrecon-agent --no-pager -n 50

# Kontrollige konfiguratsioonifaili süntaksit
netrecon-agent validate-config
```

### Õiguste keelamine
- Veenduge, et agendi binaaril on käivitamisõigus: `ls -la /usr/local/bin/netrecon-agent`
- Kontrollige SELinuxi keeldumisi: `sudo ausearch -m AVC -ts recent`

### Ühendus keelduti
- Testige ühenduvust: `curl -I https://probe.netreconapp.com/api/health`
- Kontrollige DNS-i lahendamist: `dig probe.netreconapp.com`
- Kontrollige, et proksi ei sega; seadistage vajadusel `no_proxy`

## KKK

**K: Kas agent töötab Alpine Linuxis või teistes musl-põhistes distributsioonides?**
V: Agent on kompileeritud glibc vastu. Alpine Linux ja teised musl-põhised distributsioonid pole hetkel toetatud.

**K: Kas ma saan agenti käitada Docker konteineris?**
V: Kuigi see on tehniliselt võimalik, on agent mõeldud hostsüsteemi jälgimiseks. Konteineris käitamine piirab selle võimet koguda hosti tasemel andmeid. Installige otse hosti.

**K: Kas agent toetab ARM-i (32-bitist)?**
V: Linux agent on saadaval amd64 (x86_64) ja arm64 (aarch64) jaoks. 32-bitine ARM pole toetatud.

Lisaabi saamiseks võtke ühendust [support@netreconapp.com](mailto:support@netreconapp.com).
