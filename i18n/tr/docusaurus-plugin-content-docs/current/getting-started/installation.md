---
sidebar_position: 1
title: Kurulum
description: NetRecon OS'u prob donanımınıza kurun
---

# NetRecon OS Kurulumu

Bu kılavuz, NetRecon OS'u prob donanımınıza kurma adımlarını açıklar. İndirmeden tamamen çalışan bir prob'a kadar yaklaşık 15 dakika sürer.

## Ön Koşullar

- Desteklenen bir donanım cihazı (bkz. [Gereksinimler](./requirements.md))
- Bir microSD kart (minimum 16 GB, 32 GB önerilir) veya USB sürücü
- [balenaEtcher](https://etcher.balena.io/) veya Raspberry Pi Imager gibi bir imaj yazma aracı
- İmajı indirip yazmak için bir bilgisayar
- Ağınıza bağlı bir Ethernet kablosu

## Adım 1: İmajı İndirin

Donanımınıza uygun imajı NetRecon müşteri portalından indirin:

| Donanım | İmaj Dosyası | Mimari |
|---|---|---|
| Orange Pi R2S | `netrecon-os-arm64.img.xz` | ARM64 |
| Raspberry Pi 4/5 | `netrecon-os-arm64.img.xz` | ARM64 |
| x86_64 Mini PC | `netrecon-os-amd64.iso` | x86_64 |

:::tip
Dosya bütünlüğünü sağlamak için indirme sağlama toplamını portalda gösterilen değerle karşılaştırarak doğrulayın.
:::

## Adım 2: İmajı Yazın

### ARM64 cihazlar için (Orange Pi, Raspberry Pi)

1. microSD kartınızı bilgisayarınıza takın
2. balenaEtcher'ı açın
3. İndirilen `.img.xz` dosyasını seçin (çıkarmaya gerek yok)
4. Hedef olarak microSD kartınızı seçin
5. **Flash**'a tıklayın ve tamamlanmasını bekleyin

### x86_64 cihazlar için

1. Bilgisayarınıza bir USB sürücü takın
2. balenaEtcher'ı açın
3. İndirilen `.iso` dosyasını seçin
4. Hedef olarak USB sürücünüzü seçin
5. **Flash**'a tıklayın ve tamamlanmasını bekleyin
6. Mini PC'yi USB sürücüden başlatın ve ekrandaki yükleyiciyi takip edin

## Adım 3: İlk Açılış

1. microSD kartı (veya x86_64 için dahili sürücüyü) prob cihazınıza takın
2. En az bir Ethernet kablosunu ağınıza bağlayın
3. Cihazı açın
4. Sistemin başlatılması için yaklaşık 60 saniye bekleyin

Prob, ilk açılışta DHCP aracılığıyla bir IP adresi alacaktır.

## Adım 4: Kurulum Sihirbazını Çalıştırın

1. Aynı ağdaki herhangi bir cihazdan bir web tarayıcı açın
2. `http://<prob-ip>:8080` adresine gidin
3. Kurulum Sihirbazı ilk yapılandırma boyunca size rehberlik edecektir

Sihirbaz şunları yapılandırmanıza yardımcı olur:
- Yönetici hesap bilgileri
- Ağ arayüzü rolleri
- Ağ tarama modu
- Cloudflare Tunnel bağlantısı
- Güvenlik ayarları

Ayrıntılı sihirbaz dokümantasyonu için [Kurulum Sihirbazı Genel Bakış](../setup-wizard/overview.md) sayfasına bakın.

## Adım 5: Uygulamalarınızı Bağlayın

Sihirbaz tamamlandığında:

- **NetRecon Scanner**: Yerel ağda prob'u mDNS aracılığıyla keşfedebilir
- **Admin Connect**: Sihirbazda görüntülenen QR kodunu tarayın veya `https://probe.netreconapp.com` üzerinden bağlanın

## Donanım Gereksinimleri

| Gereksinim | Minimum | Önerilen |
|---|---|---|
| İşlemci | ARM64 veya x86_64 | ARM64 dört çekirdekli veya x86_64 |
| Bellek | 4 GB | 8 GB |
| Depolama | 16 GB | 32 GB |
| Ethernet | 1 port | 2+ port |
| Ağ | DHCP mevcut | Statik IP tercih edilir |

## Sorun Giderme

### Prob ağda bulunamıyor

- Ethernet kablosunun düzgün bağlandığından ve bağlantı LED'inin aktif olduğundan emin olun
- Yönlendiricinizin DHCP kiralama tablosunda `netrecon` adlı yeni bir cihaz olup olmadığını kontrol edin
- Prob'un IP adresini konsolda görmek için bir monitör ve klavye bağlamayı deneyin

### Sihirbaz yüklenmiyor

- 8080 portuna eriştiğinizi doğrulayın: `http://<prob-ip>:8080`
- Sihirbaz hizmeti açılıştan yaklaşık 60 saniye sonra başlar
- Bilgisayarınızın prob ile aynı ağda/VLAN'da olduğunu kontrol edin

### İmaj yazılamıyor

- Farklı bir microSD kart deneyin; bazı kartlarda uyumluluk sorunları olabilir
- İmajı tekrar indirin ve sağlama toplamını doğrulayın
- Alternatif bir imaj yazma aracı deneyin

## SSS

**S: NetRecon OS'u sanal makineye kurabilir miyim?**
C: Evet, x86_64 ISO'su VMware, Proxmox veya Hyper-V'ye kurulabilir. En az 4 GB RAM ayırın ve VM'nin köprü ağ bağdaştırıcısına sahip olduğundan emin olun.

**S: Kurulumdan sonra NetRecon OS'u nasıl güncellerim?**
C: Güncellemeler Admin Connect uygulaması veya prob'un web kontrol panelindeki **Ayarlar > Sistem Güncellemesi** bölümünden sağlanır.

**S: Ethernet yerine Wi-Fi kullanabilir miyim?**
C: Prob, güvenilir ağ taraması için en az bir kablolu Ethernet bağlantısı gerektirir. Wi-Fi, birincil tarama arayüzü olarak desteklenmez.

Ek yardım için [support@netreconapp.com](mailto:support@netreconapp.com) adresine başvurun.
