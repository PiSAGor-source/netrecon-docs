---
sidebar_position: 3
title: macOS Ajanı
description: macOS'a NetRecon ajanını kurma ve dağıtma
---

# macOS Ajanı

Sürekli izleme ve envanter raporlama için macOS uç noktalarına NetRecon ajanını kurun.

## Ön Koşullar

- macOS 12 (Monterey) veya üstü
- Yönetici ayrıcalıkları (kurulum için)
- Prob'a ağ bağlantısı (doğrudan veya Cloudflare Tunnel aracılığıyla)
- Prob kontrol panelinden bir kayıt jetonu

## Manuel Kurulum

### Adım 1: PKG'yi İndirin

`netrecon-agent-macos-universal.pkg` dosyasını prob kontrol panelinden indirin:
1. Prob kontrol paneline giriş yapın
2. **Ajanlar > İndirmeler** bölümüne gidin
3. **macOS (PKG)**'ya tıklayın

Paket, hem Intel (x86_64) hem de Apple Silicon (arm64) destekleyen evrensel bir ikili dosyadır.

### Adım 2: Yükleyiciyi Çalıştırın

1. İndirilen PKG dosyasına çift tıklayın
2. Kurulum sihirbazını takip edin
3. İstendiğinde şunları girin:
   - **Sunucu URL'si**: prob'unuzun URL'si
   - **Kayıt Jetonu**: prob kontrol panelinden jetonu yapıştırın
4. İstendiğinde macOS yönetici parolanızı girin
5. **Kur**'a tıklayın ve tamamlanmasını bekleyin

Ajan `/Library/NetRecon/Agent/` dizinine kurulur ve bir launchd hizmeti olarak kaydedilir.

### Adım 3: Kurulumu Doğrulayın

Terminal'i açın:

```bash
sudo launchctl list | grep netrecon
```

Çıktıda `com.netrecon.agent` görmelisiniz. Prob kontrol panelindeki **Ajanlar** bölümünde kaydı kontrol edin.

## Komut Satırı Kurulumu

Betikli kurulum için:

```bash
sudo installer -pkg netrecon-agent-macos-universal.pkg -target /

# Ajanı yapılandırın
sudo /Library/NetRecon/Agent/netrecon-agent configure \
  --server-url "https://probe.netreconapp.com" \
  --enrollment-token "your-token-here"

# Ajanı başlatın
sudo launchctl load /Library/LaunchDaemons/com.netrecon.agent.plist
```

## Jamf ile Dağıtım

Jamf Pro kullanarak ajanı büyük ölçekte dağıtın.

### Adım 1: Paketi Yükleyin

1. Jamf Pro'ya giriş yapın
2. **Ayarlar > Bilgisayar Yönetimi > Paketler** bölümüne gidin
3. **Yeni**'ye tıklayın
4. `netrecon-agent-macos-universal.pkg` dosyasını yükleyin
5. Paketi kaydedin

### Adım 2: İlke Oluşturun

1. **Bilgisayarlar > İlkeler** bölümüne gidin
2. **Yeni**'ye tıklayın
3. İlkeyi yapılandırın:
   - **Genel**: "NetRecon Agent Dağıtımı" olarak adlandırın
   - **Paketler**: NetRecon agent PKG'yi ekleyin, **Kur** olarak ayarlayın
   - **Betikler**: Bir kurulum sonrası betiği ekleyin (aşağıya bakın)
   - **Kapsam**: İstediğiniz bilgisayar gruplarını hedefleyin
   - **Tetikleyici**: **Kayıt Tamamlandı** ve/veya **Tekrarlanan Kontrol** olarak ayarlayın

### Kurulum Sonrası Betiği

```bash
#!/bin/bash
/Library/NetRecon/Agent/netrecon-agent configure \
  --server-url "https://probe.netreconapp.com" \
  --enrollment-token "your-fleet-token"

launchctl load /Library/LaunchDaemons/com.netrecon.agent.plist
```

### Adım 3: Dağıtın

1. İlkeyi kaydedin
2. **Bilgisayarlar > İlke Günlükleri**'nden dağıtımı izleyin

## MDM ile Dağıtım

PKG dağıtımını destekleyen herhangi bir MDM çözümü aracılığıyla dağıtın.

### Yapılandırma Profili

Ajanı önceden yapılandırmak için bir yapılandırma profili oluşturun:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>PayloadContent</key>
  <array>
    <dict>
      <key>PayloadType</key>
      <string>com.netrecon.agent</string>
      <key>ServerURL</key>
      <string>https://probe.netreconapp.com</string>
      <key>EnrollmentToken</key>
      <string>your-fleet-token</string>
      <key>HeartbeatInterval</key>
      <integer>30</integer>
      <key>ReportInterval</key>
      <integer>900</integer>
    </dict>
  </array>
  <key>PayloadDisplayName</key>
  <string>NetRecon Agent Configuration</string>
  <key>PayloadIdentifier</key>
  <string>com.netrecon.agent.config</string>
  <key>PayloadType</key>
  <string>Configuration</string>
  <key>PayloadVersion</key>
  <integer>1</integer>
</dict>
</plist>
```

Bu profili PKG paketiyle birlikte MDM'iniz aracılığıyla dağıtın.

## macOS İzinleri

Ajan aşağıdaki macOS izinlerini gerektirebilir:

| İzin | Amaç | Nasıl Verilir |
|---|---|---|
| Tam Disk Erişimi | Kurulu yazılım listesini okuma | Sistem Ayarları > Gizlilik ve Güvenlik |
| Ağ Erişimi | Prob'a veri gönderme | Otomatik olarak verilir |

MDM ile yönetilen dağıtımlar için PPPC (Gizlilik Tercihleri İlke Kontrolü) profili aracılığıyla Tam Disk Erişimi verin:

```xml
<key>Services</key>
<dict>
  <key>SystemPolicyAllFiles</key>
  <array>
    <dict>
      <key>Identifier</key>
      <string>com.netrecon.agent</string>
      <key>IdentifierType</key>
      <string>bundleID</string>
      <key>Allowed</key>
      <true/>
    </dict>
  </array>
</dict>
```

## Ajan Yönetimi

### Yapılandırma Dosyası

```
/Library/NetRecon/Agent/config.yaml
```

```yaml
server_url: "https://probe.netreconapp.com"
heartbeat_interval: 30
report_interval: 900
log_level: "info"
log_file: "/Library/NetRecon/Agent/logs/agent.log"
```

### Hizmet Komutları

```bash
# Ajanı durdurun
sudo launchctl unload /Library/LaunchDaemons/com.netrecon.agent.plist

# Ajanı başlatın
sudo launchctl load /Library/LaunchDaemons/com.netrecon.agent.plist

# Durumu kontrol edin
sudo launchctl list | grep netrecon
```

### Kaldırma

```bash
# Hizmeti durdurun
sudo launchctl unload /Library/LaunchDaemons/com.netrecon.agent.plist

# Dosyaları kaldırın
sudo rm -rf /Library/NetRecon/Agent/
sudo rm /Library/LaunchDaemons/com.netrecon.agent.plist

# Kayıtları kaldırın
sudo pkgutil --forget com.netrecon.agent
```

## Sorun Giderme

### Kurulumdan sonra ajan başlamıyor
- Sistem günlüğünü kontrol edin: `log show --predicate 'subsystem == "com.netrecon.agent"' --last 5m`
- plist dosyasının var olduğunu doğrulayın: `ls -la /Library/LaunchDaemons/com.netrecon.agent.plist`
- Ajan ikili dosyasındaki dosya izinlerini kontrol edin

### Günlükte izin reddedildi hataları
- Yukarıda açıklandığı gibi Tam Disk Erişimi verin
- MDM için PPPC profilini ajanı kurmadan önce dağıtın

### Ajan prob'a bağlanamıyor
- Sunucu URL'sini doğrulayın: `curl -I https://probe.netreconapp.com/api/health`
- macOS güvenlik duvarının giden bağlantıları engelleyip engellemediğini kontrol edin
- Kayıt jetonunun geçerli olduğunu doğrulayın

## SSS

**S: Ajan Apple Silicon'u yerel olarak destekler mi?**
C: Evet. PKG, hem Intel hem de Apple Silicon Mac'lerde yerel olarak çalışan evrensel bir ikili dosyadır.

**S: Ajan macOS sanal makinelerde çalışır mı?**
C: Evet, ajan VMware Fusion, Parallels ve UTM sanal makinelerinde çalışır.

**S: macOS Gatekeeper kurulumu engeller mi?**
C: PKG, Apple tarafından imzalanmış ve noter onaylıdır. Manuel kurulumda Gatekeeper engellerse, PKG'ya sağ tıklayın ve uyarıyı atlamak için **Aç**'ı seçin.

Ek yardım için [support@netreconapp.com](mailto:support@netreconapp.com) adresine başvurun.
