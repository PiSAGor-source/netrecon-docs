---
sidebar_position: 1
title: Ajanlar Genel Bakış
description: Uç noktalara hafif izleme ajanları dağıtma
---

# Ajan Dağıtımı

NetRecon ajanları, prob'a rapor veren uç noktalara (iş istasyonları, sunucular, dizüstü bilgisayarlar) kurulan hafif izleme programlarıdır. Ajanlar, ağ taramasının tek başına sağlayamayacağı uç nokta düzeyinde görünürlük sağlar.

## Ajanlar Ne Yapar

- **Heartbeat İzleme** — uç noktanın çevrimiçi olduğunu doğrulamak için düzenli kontrol
- **Yazılım Envanteri** — kurulu yazılımları ve sürümlerini raporlama
- **Açık Port Raporlama** — uç noktanın perspektifinden yerel olarak dinleyen portları raporlama
- **Ağ Arayüzü Verisi** — tüm NIC'leri, IP'leri, MAC adreslerini ve bağlantı durumunu raporlama
- **İşletim Sistemi Bilgisi** — işletim sistemi, sürümü ve yama seviyesini raporlama
- **Donanım Bilgisi** — işlemci, bellek, disk, seri numarası
- **Güvenlik Duruşu** — güvenlik duvarı durumu, antivirüs durumu, şifreleme durumu

## Desteklenen Platformlar

| Platform | Paket Formatı | Minimum Sürüm |
|---|---|---|
| Windows | MSI yükleyici | Windows 10 / Server 2016 |
| macOS | PKG yükleyici | macOS 12 (Monterey) |
| Linux (Debian/Ubuntu) | DEB paketi | Ubuntu 20.04 / Debian 11 |
| Linux (RHEL/Fedora) | RPM paketi | RHEL 8 / Fedora 36 |

## Mimari

```
┌───────────────┐     HTTPS      ┌─────────────────┐
│   Uç Nokta    │  (heartbeat +  │   Agent         │
│   (Ajan)      ├────────────────►  Registry       │
│               │   veri yükleme)│   :8006         │
└───────────────┘                └────────┬────────┘
                                         │
                                ┌────────▼────────┐
                                │  Prob Kontrol    │
                                │  Paneli          │
                                │  (Ajan görünümü) │
                                └─────────────────┘
```

Ajanlar, prob üzerindeki Agent Registry hizmeti (port 8006) ile iletişim kurar:
- **Heartbeat**: her 30 saniyede bir (yapılandırılabilir)
- **Tam rapor**: her 15 dakikada bir (yapılandırılabilir)
- **Protokol**: JWT kimlik doğrulaması ile HTTPS
- **Veri**: JSON, gzip sıkıştırmalı

## Dağıtım Yöntemleri

### Manuel Kurulum
Ajan paketini her uç noktaya doğrudan indirin ve kurun. Küçük dağıtımlar veya testler için en uygun.

- [Windows Ajanı](./windows.md)
- [macOS Ajanı](./macos.md)
- [Linux Ajanı](./linux.md)

### Kurumsal Dağıtım
Büyük ölçekli yayılım için ajanları mevcut yönetim araçlarınızı kullanarak dağıtın:

| Araç | Platform | Kılavuz |
|---|---|---|
| SCCM | Windows | [Windows Ajanı](./windows.md#sccm-deployment) |
| Microsoft Intune | Windows | [Windows Ajanı](./windows.md#intune-deployment) |
| Grup İlkesi (GPO) | Windows | [Windows Ajanı](./windows.md#gpo-deployment) |
| Jamf Pro | macOS | [macOS Ajanı](./macos.md#jamf-deployment) |
| Genel MDM | macOS | [macOS Ajanı](./macos.md#mdm-deployment) |
| CLI / Ansible | Linux | [Linux Ajanı](./linux.md#automated-deployment) |

### QR Kodu ile Kayıt

BYOD veya saha dağıtımı için:
1. Prob kontrol panelinden (**Ajanlar > Kayıt**) bir QR kodu oluşturun
2. Kullanıcı cihazında QR kodunu tarar
3. Ajan, önceden yapılandırılmış ayarlarla indirilir ve kurulur

## Ajan Yapılandırması

Kurulum sonrasında ajanlar yerel yapılandırma dosyası veya prob kontrol paneli aracılığıyla uzaktan yapılandırılır:

| Ayar | Varsayılan | Açıklama |
|---|---|---|
| `server_url` | — | Prob URL'si veya Cloudflare Tunnel URL'si |
| `enrollment_token` | — | Tek kullanımlık kayıt jetonu |
| `heartbeat_interval` | 30s | Ajanın ne sıklıkta kontrol yaptığı |
| `report_interval` | 15m | Tam verinin ne sıklıkta yüklendiği |
| `log_level` | info | Günlük ayrıntı düzeyi |

## Ajan Yaşam Döngüsü

1. **Kurulum** — ajan paketi uç noktaya kurulur
2. **Kayıt** — ajan, bir kayıt jetonu kullanarak prob'a kaydolur
3. **Aktif** — ajan düzenli heartbeat'ler ve raporlar gönderir
4. **Bayat** — ajan, zaman aşımı eşiğini (varsayılan: 90 saniye) aşan heartbeat'leri kaçırmıştır
5. **Çevrimdışı** — ajan uzun süre kontrol yapmamıştır
6. **Hizmet Dışı** — ajan filodan kaldırılmıştır

## Kontrol Paneli Entegrasyonu

Kayıtlı ajanlar prob kontrol panelindeki **Ajanlar** bölümünde görünür:

- **Ajan Listesi** — durum göstergeleriyle tüm kayıtlı ajanlar
- **Ajan Detayı** — seçilen ajan için tam uç nokta verileri
- **Uyarılar** — bayat/çevrimdışı ajanlar veya güvenlik duruşu değişiklikleri için bildirimler
- **Gruplar** — ajanları mantıksal gruplara düzenleme (departmana, konuma göre, vb.)

## Güvenlik

- Tüm ajan-prob iletişimi TLS ile şifrelenir
- Ajanlar kayıt sırasında verilen JWT jetonları ile kimlik doğrulama yapar
- Kayıt jetonları tek kullanımlıktır ve yapılandırılabilir bir süre sonra sona erer
- Ajan ikili dosyaları bütünlük doğrulaması için imzalanmıştır
- Uç noktada gelen bağlantı gerekmez

## SSS

**S: Bir ajan ne kadar bant genişliği kullanır?**
C: Heartbeat'ler yaklaşık 200 bayttır (her 30 saniyede). Tam raporlar genellikle 2-10 KB sıkıştırılmıştır (her 15 dakikada). Toplam bant genişliği yavaş bağlantılarda bile ihmal edilebilir düzeydedir.

**S: Ajan yönetici/root ayrıcalıkları gerektirir mi?**
C: Ajan bir sistem hizmeti olarak çalışır ve kurulum için yükseltilmiş ayrıcalıklar gerektirir. Kurulumdan sonra minimum izinlerle özel bir hizmet hesabı altında çalışır.

**S: Ajanı uzaktan kaldırabilir miyim?**
C: Evet. Prob kontrol panelinden bir ajan seçin ve **Kaldır**'a tıklayın. Ajan bir sonraki heartbeat'te kendini kaldıracaktır.

**S: Ajan uç nokta performansını etkiler mi?**
C: Ajan hafif olacak şekilde tasarlanmıştır. Genellikle 20 MB'den az bellek ve ihmal edilebilir düzeyde işlemci kullanır. Veri toplama, kullanıcı deneyimini etkilememek için düşük öncelikle çalışır.

Ek yardım için [support@netreconapp.com](mailto:support@netreconapp.com) adresine başvurun.
