---
sidebar_position: 4
title: Agent Linux
description: Installer et déployer l'agent NetRecon sous Linux
---

# Agent Linux

Installez l'agent NetRecon sur les terminaux Linux pour une surveillance continue et un rapport d'inventaire.

## Prérequis

- Ubuntu 20.04+ / Debian 11+ / RHEL 8+ / Fedora 36+ (ou compatible)
- Accès root ou sudo (pour l'installation)
- Connectivité réseau vers la sonde (directe ou via Cloudflare Tunnel)
- Un jeton d'inscription depuis le tableau de bord de la sonde
- systemd (pour la gestion du service)

## Installation manuelle

### Debian/Ubuntu (DEB)

#### Étape 1 : Télécharger le package

```bash
# Télécharger depuis le tableau de bord de la sonde, ou utiliser curl :
curl -O https://probe.netreconapp.com/downloads/netrecon-agent-linux-amd64.deb
```

Pour les systèmes ARM64 :
```bash
curl -O https://probe.netreconapp.com/downloads/netrecon-agent-linux-arm64.deb
```

#### Étape 2 : Installer

```bash
sudo dpkg -i netrecon-agent-linux-amd64.deb
```

#### Étape 3 : Configurer et démarrer

```bash
sudo netrecon-agent configure \
  --server-url "https://probe.netreconapp.com" \
  --enrollment-token "your-token-here"

sudo systemctl enable --now netrecon-agent
```

### RHEL/Fedora (RPM)

#### Étape 1 : Télécharger le package

```bash
curl -O https://probe.netreconapp.com/downloads/netrecon-agent-linux-amd64.rpm
```

#### Étape 2 : Installer

```bash
sudo rpm -i netrecon-agent-linux-amd64.rpm
# ou avec dnf :
sudo dnf install ./netrecon-agent-linux-amd64.rpm
```

#### Étape 3 : Configurer et démarrer

```bash
sudo netrecon-agent configure \
  --server-url "https://probe.netreconapp.com" \
  --enrollment-token "your-token-here"

sudo systemctl enable --now netrecon-agent
```

## Assistant de configuration CLI

L'agent inclut un assistant de configuration interactif pour la configuration manuelle :

```bash
sudo netrecon-agent setup
```

L'assistant demande :
1. **Server URL** — l'URL HTTPS de la sonde
2. **Enrollment Token** — collez votre jeton
3. **Heartbeat Interval** — fréquence des vérifications (par défaut : 30s)
4. **Report Interval** — fréquence d'envoi des données complètes (par défaut : 15m)
5. **Log Level** — debug, info, warn, error (par défaut : info)

Après avoir terminé l'assistant, l'agent démarre automatiquement.

## Déploiement automatisé

### Script d'installation en une ligne

Pour un déploiement rapide sur plusieurs serveurs :

```bash
curl -fsSL https://probe.netreconapp.com/install-agent.sh | sudo bash -s -- \
  --server-url "https://probe.netreconapp.com" \
  --enrollment-token "your-fleet-token"
```

Le script :
1. Détecte la distribution Linux et l'architecture
2. Télécharge le package approprié (DEB ou RPM)
3. Installe le package
4. Configure l'agent avec les paramètres fournis
5. Démarre le service

### Playbook Ansible

Pour la gestion de configuration à grande échelle :

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

### Script shell pour plusieurs serveurs

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

## Gestion de l'agent

### Fichier de configuration

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

### Commandes de service

```bash
# Vérifier le statut
sudo systemctl status netrecon-agent

# Arrêter
sudo systemctl stop netrecon-agent

# Démarrer
sudo systemctl start netrecon-agent

# Redémarrer
sudo systemctl restart netrecon-agent

# Voir les journaux
sudo journalctl -u netrecon-agent -f
```

### Désinstallation

Debian/Ubuntu :
```bash
sudo systemctl stop netrecon-agent
sudo apt remove netrecon-agent
```

RHEL/Fedora :
```bash
sudo systemctl stop netrecon-agent
sudo dnf remove netrecon-agent
```

## Configuration SELinux

Sur les systèmes RHEL/Fedora avec SELinux en mode enforcing, l'agent a besoin d'un module de politique :

```bash
# Le package de l'agent inclut une politique SELinux, mais si nécessaire :
sudo semanage fcontext -a -t bin_t '/usr/local/bin/netrecon-agent'
sudo restorecon -v /usr/local/bin/netrecon-agent
```

Si SELinux bloque l'accès réseau :
```bash
sudo setsebool -P netrecon_agent_can_network_connect 1
```

## Configuration du pare-feu

L'agent ne nécessite que le **HTTPS sortant (port 443)**. Aucune règle entrante n'est nécessaire.

```bash
# UFW (Ubuntu)
sudo ufw allow out 443/tcp

# firewalld (RHEL/Fedora)
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## Résolution de problèmes

### L'agent ne démarre pas
```bash
# Vérifier le statut du service
sudo systemctl status netrecon-agent

# Vérifier les journaux
sudo journalctl -u netrecon-agent --no-pager -n 50

# Vérifier la syntaxe du fichier de configuration
netrecon-agent validate-config
```

### Permission refusée
- Assurez-vous que le binaire de l'agent a la permission d'exécution : `ls -la /usr/local/bin/netrecon-agent`
- Vérifiez les refus SELinux : `sudo ausearch -m AVC -ts recent`

### Connexion refusée
- Testez la connectivité : `curl -I https://probe.netreconapp.com/api/health`
- Vérifiez la résolution DNS : `dig probe.netreconapp.com`
- Vérifiez qu'aucun proxy n'interfère ; définissez `no_proxy` si nécessaire

## FAQ

**Q : L'agent fonctionne-t-il sur Alpine Linux ou d'autres distributions basées sur musl ?**
R : L'agent est compilé avec glibc. Alpine Linux et les autres distributions basées sur musl ne sont pas actuellement supportées.

**Q : Puis-je exécuter l'agent dans un conteneur Docker ?**
R : Bien que techniquement possible, l'agent est conçu pour surveiller le système hôte. L'exécuter dans un conteneur limite sa capacité à collecter les données au niveau de l'hôte. Installez-le directement sur l'hôte.

**Q : L'agent prend-il en charge ARM (32 bits) ?**
R : L'agent Linux est disponible pour amd64 (x86_64) et arm64 (aarch64). L'ARM 32 bits n'est pas supporté.

Pour obtenir de l'aide supplémentaire, contactez [support@netreconapp.com](mailto:support@netreconapp.com).
