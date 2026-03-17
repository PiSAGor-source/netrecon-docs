---
sidebar_position: 2
title: Windows Ajanı
description: Windows'a NetRecon ajanını kurma ve dağıtma
---

# Windows Ajanı

Sürekli izleme ve envanter raporlama için Windows uç noktalarına NetRecon ajanını kurun.

## Ön Koşullar

- Windows 10 veya üstü / Windows Server 2016 veya üstü
- Yerel yönetici ayrıcalıkları (kurulum için)
- Prob'a ağ bağlantısı (doğrudan veya Cloudflare Tunnel aracılığıyla)
- Prob kontrol panelinden bir kayıt jetonu

## Manuel Kurulum

### Adım 1: MSI'ı İndirin

`netrecon-agent-windows-x64.msi` dosyasını prob kontrol panelinden indirin:
1. Prob kontrol paneline giriş yapın
2. **Ajanlar > İndirmeler** bölümüne gidin
3. **Windows (MSI)**'a tıklayın

### Adım 2: Yükleyiciyi Çalıştırın

1. İndirilen MSI dosyasına çift tıklayın
2. Karşılama ekranında **İleri**'ye tıklayın
3. Yapılandırma detaylarını girin:
   - **Sunucu URL'si**: prob'unuzun URL'si (örn. `https://probe.netreconapp.com`)
   - **Kayıt Jetonu**: prob kontrol panelinden jetonu yapıştırın
4. **Kur**'a tıklayın
5. Kurulum tamamlandığında **Bitir**'e tıklayın

Ajan `C:\Program Files\NetRecon\Agent\` dizinine kurulur ve `NetReconAgent` adında bir Windows hizmeti olarak kaydedilir.

### Adım 3: Kurulumu Doğrulayın

Yönetici olarak bir Komut İstemi açın:

```powershell
sc query NetReconAgent
```

Hizmet `STATE: RUNNING` göstermelidir.

Prob kontrol panelindeki **Ajanlar** bölümünde kayıt durumunu kontrol edin — yeni uç nokta 30 saniye içinde görünmelidir.

## Sessiz Kurulum

Betikli veya katılımsız kurulum için:

```powershell
msiexec /i netrecon-agent-windows-x64.msi /quiet /norestart SERVER_URL="https://probe.netreconapp.com" ENROLLMENT_TOKEN="your-token-here"
```

## SCCM ile Dağıtım

Microsoft SCCM (System Center Configuration Manager) kullanarak ajanı binlerce Windows uç noktasına dağıtın.

### Adım 1: Paketi Oluşturun

1. SCCM Konsolunu açın
2. **Yazılım Kitaplığı > Uygulama Yönetimi > Uygulamalar** bölümüne gidin
3. **Uygulama Oluştur**'a tıklayın
4. **Windows Installer (MSI dosyası)**'nı seçin ve MSI'a göz atın
5. Aşağıdaki kurulum komutuyla sihirbazı tamamlayın:

```
msiexec /i netrecon-agent-windows-x64.msi /quiet /norestart SERVER_URL="https://probe.netreconapp.com" ENROLLMENT_TOKEN="your-fleet-token"
```

### Adım 2: Algılama Kuralını Yapılandırın

Algılama kuralını ayarlayın:
- **Tür**: Dosya sistemi
- **Yol**: `C:\Program Files\NetRecon\Agent\`
- **Dosya**: `netrecon-agent.exe`
- **Özellik**: Dosya mevcut

### Adım 3: Dağıtın

1. Uygulamaya sağ tıklayın ve **Dağıt**'ı seçin
2. Hedef cihaz koleksiyonunuzu seçin
3. Dağıtım amacını **Gerekli** olarak ayarlayın
4. Zamanlamayı yapılandırın
5. Sihirbazı **İleri**'ye tıklayarak tamamlayın ve dağıtın

## Intune ile Dağıtım

Bulut yönetimli uç noktalar için Microsoft Intune aracılığıyla dağıtın.

### Adım 1: Paketi Hazırlayın

1. [Intune Win32 Content Prep Tool](https://github.com/Microsoft/Microsoft-Win32-Content-Prep-Tool) kullanarak MSI'ı `.intunewin` paketine dönüştürün:

```powershell
IntuneWinAppUtil.exe -c .\source -s netrecon-agent-windows-x64.msi -o .\output
```

### Adım 2: Intune'da Uygulamayı Oluşturun

1. **Microsoft Intune Yönetim Merkezi > Uygulamalar > Windows** bölümüne gidin
2. **Ekle > Windows uygulaması (Win32)**'ya tıklayın
3. `.intunewin` dosyasını yükleyin
4. Yapılandırın:
   - **Kurulum komutu**: `msiexec /i netrecon-agent-windows-x64.msi /quiet /norestart SERVER_URL="https://probe.netreconapp.com" ENROLLMENT_TOKEN="your-fleet-token"`
   - **Kaldırma komutu**: `msiexec /x {product-code} /quiet`
   - **Algılama kuralı**: `C:\Program Files\NetRecon\Agent\netrecon-agent.exe` konumunda dosya mevcut

### Adım 3: Atayın

1. Bir cihaz grubuna veya tüm cihazlara atayın
2. Otomatik dağıtım için **Gerekli** olarak ayarlayın
3. Intune portalında dağıtım durumunu izleyin

## GPO ile Dağıtım

Active Directory ortamları için Grup İlkesi kullanarak dağıtın.

### Adım 1: Paylaşımı Hazırlayın

1. MSI'ı tüm hedef makineler tarafından erişilebilir bir ağ paylaşımına kopyalayın:
   ```
   \\fileserver\software\netrecon\netrecon-agent-windows-x64.msi
   ```
2. Paylaşımın **Domain Computers** için Okuma izinlerine sahip olduğundan emin olun

### Adım 2: GPO'yu Oluşturun

1. **Grup İlkesi Yönetim Konsolu**'nu açın
2. Hedef OU'ya bağlı yeni bir GPO oluşturun
3. **Bilgisayar Yapılandırması > İlkeler > Yazılım Ayarları > Yazılım Yükleme** bölümüne gidin
4. Sağ tıklayın ve **Yeni > Paket**'i seçin
5. Ağ paylaşımındaki MSI'a göz atın
6. **Atanmış** dağıtım yöntemini seçin

### Adım 3: Parametreleri Yapılandırın

GPO yazılım yükleme doğrudan MSI özelliklerini desteklemediğinden, bir dönüşüm dosyası (MST) oluşturun veya bunun yerine bir başlangıç betiği kullanın:

`\\fileserver\scripts\install-netrecon-agent.bat` konumunda bir başlangıç betiği oluşturun:

```batch
@echo off
if not exist "C:\Program Files\NetRecon\Agent\netrecon-agent.exe" (
    msiexec /i "\\fileserver\software\netrecon\netrecon-agent-windows-x64.msi" /quiet /norestart SERVER_URL="https://probe.netreconapp.com" ENROLLMENT_TOKEN="your-fleet-token"
)
```

Bu betiği **Bilgisayar Yapılandırması > İlkeler > Windows Ayarları > Betikler > Başlangıç** altına atayın.

## Ajan Yönetimi

### Yapılandırma Dosyası

Ajan yapılandırması şurada saklanır:
```
C:\Program Files\NetRecon\Agent\config.yaml
```

```yaml
server_url: "https://probe.netreconapp.com"
heartbeat_interval: 30
report_interval: 900
log_level: "info"
log_file: "C:\\Program Files\\NetRecon\\Agent\\logs\\agent.log"
```

### Hizmet Komutları

```powershell
# Ajanı durdurun
net stop NetReconAgent

# Ajanı başlatın
net start NetReconAgent

# Ajanı yeniden başlatın
net stop NetReconAgent && net start NetReconAgent
```

### Kaldırma

Denetim Masası üzerinden:
1. **Ayarlar > Uygulamalar > Yüklü Uygulamalar** bölümünü açın
2. "NetRecon Agent" bulun
3. **Kaldır**'a tıklayın

Komut satırı üzerinden:
```powershell
msiexec /x netrecon-agent-windows-x64.msi /quiet
```

## Sorun Giderme

### Ajan kontrol panelinde görünmüyor
- Hizmetin çalıştığını doğrulayın: `sc query NetReconAgent`
- Ajan günlüğünü kontrol edin: `C:\Program Files\NetRecon\Agent\logs\agent.log`
- SERVER_URL'nin doğru ve erişilebilir olduğunu doğrulayın
- Kayıt jetonunun geçerli ve süresinin dolmamış olduğundan emin olun

### Hizmet başlatılamıyor
- **Uygulama** günlüğü altında Windows Olay Görüntüleyicisi'nde hataları kontrol edin
- config.yaml dosyasının geçerli YAML olduğunu doğrulayın
- 443 giden portunun bir güvenlik duvarı tarafından engellenmediğinden emin olun

### Yüksek kaynak kullanımı
- Hızlı yeniden denemelere neden olan hatalar için günlüğü kontrol edin
- Heartbeat ve rapor aralıklarının çok düşük ayarlanmadığını doğrulayın
- Birikmiş durumu temizlemek için hizmeti yeniden başlatın

## SSS

**S: Ajan Windows ARM'da (örn. Surface Pro X) çalışır mı?**
C: Şu anda ajan yalnızca x64 mimarisini destekler. ARM64 desteği planlanmaktadır.

**S: Ajanı diğer izleme ajanlarının yanına kurabilir miyim?**
C: Evet. NetRecon ajanı, diğer izleme araçlarıyla çakışma olmadan birlikte çalışacak şekilde tasarlanmıştır.

**S: Ajan Windows güncellemeleri ve yeniden başlatmalardan sonra çalışmaya devam eder mi?**
C: Evet. Ajan, otomatik başlatma olarak ayarlanmış bir Windows hizmeti olarak çalışır, bu nedenle her yeniden başlatmadan sonra tekrar başlar.

Ek yardım için [support@netreconapp.com](mailto:support@netreconapp.com) adresine başvurun.
