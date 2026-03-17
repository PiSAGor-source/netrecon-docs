---
sidebar_position: 4
title: Linux Ajanı
description: Linux'a NetRecon ajanını kurma ve dağıtma
---

# Linux Ajanı

Sürekli izleme ve envanter raporlama için Linux uç noktalarına NetRecon ajanını kurun.

## Ön Koşullar

- Ubuntu 20.04+ / Debian 11+ / RHEL 8+ / Fedora 36+ (veya uyumlu)
- Root veya sudo erişimi (kurulum için)
- Prob'a ağ bağlantısı (doğrudan veya Cloudflare Tunnel aracılığıyla)
- Prob kontrol panelinden bir kayıt jetonu
- systemd (hizmet yönetimi için)

## Manuel Kurulum

### Debian/Ubuntu (DEB)

#### Adım 1: Paketi İndirin

```bash
# Prob kontrol panelinden indirin veya curl kullanın:
curl -O https://probe.netreconapp.com/downloads/netrecon-agent-linux-amd64.deb
```

ARM64 sistemler için:
```bash
curl -O https://probe.netreconapp.com/downloads/netrecon-agent-linux-arm64.deb
```

#### Adım 2: Kurun

```bash
sudo dpkg -i netrecon-agent-linux-amd64.deb
```

#### Adım 3: Yapılandırın ve Başlatın

```bash
sudo netrecon-agent configure \
  --server-url "https://probe.netreconapp.com" \
  --enrollment-token "your-token-here"

sudo systemctl enable --now netrecon-agent
```

### RHEL/Fedora (RPM)

#### Adım 1: Paketi İndirin

```bash
curl -O https://probe.netreconapp.com/downloads/netrecon-agent-linux-amd64.rpm
```

#### Adım 2: Kurun

```bash
sudo rpm -i netrecon-agent-linux-amd64.rpm
# veya dnf ile:
sudo dnf install ./netrecon-agent-linux-amd64.rpm
```

#### Adım 3: Yapılandırın ve Başlatın

```bash
sudo netrecon-agent configure \
  --server-url "https://probe.netreconapp.com" \
  --enrollment-token "your-token-here"

sudo systemctl enable --now netrecon-agent
```

## CLI Kurulum Sihirbazı

Ajan, manuel yapılandırma için etkileşimli bir kurulum sihirbazı içerir:

```bash
sudo netrecon-agent setup
```

Sihirbaz şunları sorar:
1. **Sunucu URL'si** — prob'un HTTPS URL'si
2. **Kayıt Jetonu** — jetonunuzu yapıştırın
3. **Heartbeat Aralığı** — kontrol sıklığı (varsayılan: 30s)
4. **Rapor Aralığı** — tam veri yükleme sıklığı (varsayılan: 15m)
5. **Günlük Seviyesi** — debug, info, warn, error (varsayılan: info)

Sihirbazı tamamladıktan sonra ajan otomatik olarak başlar.

## Otomatik Dağıtım

### Tek Satırlık Kurulum Betiği

Birden fazla sunucuya hızlı dağıtım için:

```bash
curl -fsSL https://probe.netreconapp.com/install-agent.sh | sudo bash -s -- \
  --server-url "https://probe.netreconapp.com" \
  --enrollment-token "your-fleet-token"
```

Betik:
1. Linux dağıtımını ve mimarisini tespit eder
2. Uygun paketi (DEB veya RPM) indirir
3. Paketi kurar
4. Sağlanan parametrelerle ajanı yapılandırır
5. Hizmeti başlatır

### Ansible Playbook

Ölçekli yapılandırma yönetimi için:

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

### Birden Fazla Sunucu İçin Kabuk Betiği

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

## Ajan Yönetimi

### Yapılandırma Dosyası

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

### Hizmet Komutları

```bash
# Durumu kontrol edin
sudo systemctl status netrecon-agent

# Durdurun
sudo systemctl stop netrecon-agent

# Başlatın
sudo systemctl start netrecon-agent

# Yeniden başlatın
sudo systemctl restart netrecon-agent

# Günlükleri görüntüleyin
sudo journalctl -u netrecon-agent -f
```

### Kaldırma

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

## SELinux Yapılandırması

SELinux zorlayıcı modda olan RHEL/Fedora sistemlerinde ajan bir ilke modülüne ihtiyaç duyar:

```bash
# Ajan paketi bir SELinux ilkesi içerir, ancak gerekirse:
sudo semanage fcontext -a -t bin_t '/usr/local/bin/netrecon-agent'
sudo restorecon -v /usr/local/bin/netrecon-agent
```

SELinux ağ erişimini engellerse:
```bash
sudo setsebool -P netrecon_agent_can_network_connect 1
```

## Güvenlik Duvarı Yapılandırması

Ajan yalnızca **giden HTTPS (port 443)** gerektirir. Gelen kural gerekmez.

```bash
# UFW (Ubuntu)
sudo ufw allow out 443/tcp

# firewalld (RHEL/Fedora)
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## Sorun Giderme

### Ajan başlamıyor
```bash
# Hizmet durumunu kontrol edin
sudo systemctl status netrecon-agent

# Günlükleri kontrol edin
sudo journalctl -u netrecon-agent --no-pager -n 50

# Yapılandırma dosyası söz dizimini doğrulayın
netrecon-agent validate-config
```

### İzin reddedildi
- Ajan ikili dosyasının çalıştırma iznine sahip olduğundan emin olun: `ls -la /usr/local/bin/netrecon-agent`
- SELinux reddlerini kontrol edin: `sudo ausearch -m AVC -ts recent`

### Bağlantı reddedildi
- Bağlantıyı test edin: `curl -I https://probe.netreconapp.com/api/health`
- DNS çözümlemeyi kontrol edin: `dig probe.netreconapp.com`
- Bir proxy'nin müdahale etmediğini doğrulayın; gerekirse `no_proxy` ayarlayın

## SSS

**S: Ajan Alpine Linux veya diğer musl tabanlı dağıtımlarda çalışır mı?**
C: Ajan glibc'ye karşı derlenmiştir. Alpine Linux ve diğer musl tabanlı dağıtımlar şu anda desteklenmemektedir.

**S: Ajanı bir Docker konteynerinde çalıştırabilir miyim?**
C: Teknik olarak mümkün olsa da ajan, ana bilgisayar sistemini izlemek için tasarlanmıştır. Bir konteynerde çalıştırmak, ana bilgisayar düzeyinde veri toplama yeteneğini sınırlar. Bunun yerine doğrudan ana bilgisayara kurun.

**S: Ajan ARM (32-bit) destekler mi?**
C: Linux ajanı amd64 (x86_64) ve arm64 (aarch64) için mevcuttur. 32-bit ARM desteklenmemektedir.

Ek yardım için [support@netreconapp.com](mailto:support@netreconapp.com) adresine başvurun.
