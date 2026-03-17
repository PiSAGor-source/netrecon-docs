---
sidebar_position: 4
title: Agente Linux
description: Instale y despliegue el agente NetRecon en Linux
---

# Agente Linux

Instale el agente NetRecon en endpoints Linux para monitoreo continuo y reportes de inventario.

## Requisitos Previos

- Ubuntu 20.04+ / Debian 11+ / RHEL 8+ / Fedora 36+ (o compatible)
- Acceso root o sudo (para la instalación)
- Conectividad de red a la sonda (directa o vía Cloudflare Tunnel)
- Un token de inscripción del dashboard de la sonda
- systemd (para gestión del servicio)

## Instalación Manual

### Debian/Ubuntu (DEB)

#### Paso 1: Descargar el Paquete

```bash
# Descargar desde el dashboard de la sonda, o usar curl:
curl -O https://probe.netreconapp.com/downloads/netrecon-agent-linux-amd64.deb
```

Para sistemas ARM64:
```bash
curl -O https://probe.netreconapp.com/downloads/netrecon-agent-linux-arm64.deb
```

#### Paso 2: Instalar

```bash
sudo dpkg -i netrecon-agent-linux-amd64.deb
```

#### Paso 3: Configurar e Iniciar

```bash
sudo netrecon-agent configure \
  --server-url "https://probe.netreconapp.com" \
  --enrollment-token "su-token-aquí"

sudo systemctl enable --now netrecon-agent
```

### RHEL/Fedora (RPM)

#### Paso 1: Descargar el Paquete

```bash
curl -O https://probe.netreconapp.com/downloads/netrecon-agent-linux-amd64.rpm
```

#### Paso 2: Instalar

```bash
sudo rpm -i netrecon-agent-linux-amd64.rpm
# o con dnf:
sudo dnf install ./netrecon-agent-linux-amd64.rpm
```

#### Paso 3: Configurar e Iniciar

```bash
sudo netrecon-agent configure \
  --server-url "https://probe.netreconapp.com" \
  --enrollment-token "su-token-aquí"

sudo systemctl enable --now netrecon-agent
```

## Asistente de Configuración CLI

El agente incluye un asistente de configuración interactivo para configuración manual:

```bash
sudo netrecon-agent setup
```

El asistente solicita:
1. **URL del Servidor** — la URL HTTPS de la sonda
2. **Token de Inscripción** — pegue su token
3. **Intervalo de Heartbeat** — frecuencia de verificaciones (predeterminado: 30s)
4. **Intervalo de Reportes** — frecuencia de carga completa de datos (predeterminado: 15m)
5. **Nivel de Registro** — debug, info, warn, error (predeterminado: info)

Después de completar el asistente, el agente inicia automáticamente.

## Despliegue Automatizado

### Script de Instalación en Una Línea

Para despliegue rápido en múltiples servidores:

```bash
curl -fsSL https://probe.netreconapp.com/install-agent.sh | sudo bash -s -- \
  --server-url "https://probe.netreconapp.com" \
  --enrollment-token "su-token-de-flota"
```

El script:
1. Detecta la distribución Linux y la arquitectura
2. Descarga el paquete apropiado (DEB o RPM)
3. Instala el paquete
4. Configura el agente con los parámetros proporcionados
5. Inicia el servicio

### Playbook de Ansible

Para gestión de configuración a escala:

```yaml
---
- name: Desplegar Agente NetRecon
  hosts: all
  become: true
  vars:
    netrecon_server_url: "https://probe.netreconapp.com"
    netrecon_enrollment_token: "su-token-de-flota"
    netrecon_agent_version: "2.2.0"

  tasks:
    - name: Descargar paquete del agente (Debian)
      get_url:
        url: "{{ netrecon_server_url }}/downloads/netrecon-agent-linux-{{ ansible_architecture }}.deb"
        dest: /tmp/netrecon-agent.deb
      when: ansible_os_family == "Debian"

    - name: Instalar agente (Debian)
      apt:
        deb: /tmp/netrecon-agent.deb
      when: ansible_os_family == "Debian"

    - name: Descargar paquete del agente (RedHat)
      get_url:
        url: "{{ netrecon_server_url }}/downloads/netrecon-agent-linux-{{ ansible_architecture }}.rpm"
        dest: /tmp/netrecon-agent.rpm
      when: ansible_os_family == "RedHat"

    - name: Instalar agente (RedHat)
      dnf:
        name: /tmp/netrecon-agent.rpm
        state: present
      when: ansible_os_family == "RedHat"

    - name: Configurar agente
      command: >
        netrecon-agent configure
        --server-url "{{ netrecon_server_url }}"
        --enrollment-token "{{ netrecon_enrollment_token }}"

    - name: Habilitar e iniciar agente
      systemd:
        name: netrecon-agent
        enabled: true
        state: started
```

### Script Shell para Múltiples Servidores

```bash
#!/bin/bash
SERVERS="server1.example.com server2.example.com server3.example.com"
TOKEN="su-token-de-flota"
SERVER_URL="https://probe.netreconapp.com"

for server in $SERVERS; do
  echo "Desplegando en $server..."
  ssh root@$server "curl -fsSL ${SERVER_URL}/install-agent.sh | bash -s -- --server-url ${SERVER_URL} --enrollment-token ${TOKEN}"
done
```

## Gestión del Agente

### Archivo de Configuración

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

### Comandos del Servicio

```bash
# Verificar estado
sudo systemctl status netrecon-agent

# Detener
sudo systemctl stop netrecon-agent

# Iniciar
sudo systemctl start netrecon-agent

# Reiniciar
sudo systemctl restart netrecon-agent

# Ver registros
sudo journalctl -u netrecon-agent -f
```

### Desinstalación

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

## Configuración de SELinux

En sistemas RHEL/Fedora con SELinux en modo enforcing, el agente necesita un módulo de política:

```bash
# El paquete del agente incluye una política SELinux, pero si es necesario:
sudo semanage fcontext -a -t bin_t '/usr/local/bin/netrecon-agent'
sudo restorecon -v /usr/local/bin/netrecon-agent
```

Si SELinux bloquea el acceso a red:
```bash
sudo setsebool -P netrecon_agent_can_network_connect 1
```

## Configuración de Firewall

El agente solo requiere **HTTPS saliente (puerto 443)**. No se necesitan reglas de entrada.

```bash
# UFW (Ubuntu)
sudo ufw allow out 443/tcp

# firewalld (RHEL/Fedora)
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## Resolución de Problemas

### El agente no inicia
```bash
# Verificar estado del servicio
sudo systemctl status netrecon-agent

# Verificar registros
sudo journalctl -u netrecon-agent --no-pager -n 50

# Verificar sintaxis del archivo de configuración
netrecon-agent validate-config
```

### Permiso denegado
- Asegúrese de que el binario del agente tenga permiso de ejecución: `ls -la /usr/local/bin/netrecon-agent`
- Verifique denegaciones de SELinux: `sudo ausearch -m AVC -ts recent`

### Conexión rechazada
- Pruebe la conectividad: `curl -I https://probe.netreconapp.com/api/health`
- Verifique la resolución DNS: `dig probe.netreconapp.com`
- Verifique que ningún proxy esté interfiriendo; establezca `no_proxy` si es necesario

## Preguntas Frecuentes

**P: ¿El agente funciona en Alpine Linux u otras distribuciones basadas en musl?**
R: El agente está compilado contra glibc. Alpine Linux y otras distribuciones basadas en musl no están actualmente soportadas.

**P: ¿Puedo ejecutar el agente en un contenedor Docker?**
R: Aunque es técnicamente posible, el agente está diseñado para monitorear el sistema host. Ejecutarlo en un contenedor limita su capacidad de recopilar datos a nivel de host. Instale directamente en el host en su lugar.

**P: ¿El agente soporta ARM (32 bits)?**
R: El agente Linux está disponible para amd64 (x86_64) y arm64 (aarch64). ARM de 32 bits no está soportado.

Para ayuda adicional, contacte a [support@netreconapp.com](mailto:support@netreconapp.com).
