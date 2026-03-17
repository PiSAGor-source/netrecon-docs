---
sidebar_position: 3
title: Seri Mod
description: Seri konsol kablosu aracılığıyla ağ cihazlarına bağlanma
---

# Seri Mod

Seri mod, USB-seri konsol kablosu kullanarak ağ cihazlarına bağlanmanıza olanak tanır. Bu, ilk cihaz kurulumu, parola kurtarma ve SSH kullanılamadığında bant dışı yönetim için gereklidir.

## Ön Koşullar

- USB-seri konsol kablosu (RJ45-USB veya DB9-USB)
- USB kablosu prob'un USB portuna bağlı
- Ağ cihazının konsol portuna fiziksel erişim
- Hedef cihaz için doğru baud hızı

## Desteklenen Konsol Kablosu Türleri

| Kablo Türü | Konnektör | Yaygın Kullanım |
|---|---|---|
| RJ45-USB | RJ45 konsol portu | Cisco, Juniper, Aruba |
| DB9-USB | DB9 seri port | Eski anahtarlar, endüstriyel cihazlar |
| USB-C/USB-A - RJ45 | RJ45 konsol portu | Modern konsol kabloları |
| USB-C - USB-C | USB-C konsol portu | Bazı yeni cihazlar |

### Önerilen Yonga Setleri

Güvenilir seri iletişim için şu yonga setlerine sahip kablolar kullanın:
- **FTDI FT232R** — en uyumlu, önerilen
- **Prolific PL2303** — yaygın olarak bulunur
- **Silicon Labs CP210x** — iyi uyumluluk

Sahte FTDI kablolarından kaçının, güvenilir şekilde çalışmayabilirler.

## Seri Bağlantı Kurma

### Adım 1: Kabloyu Bağlama

1. Konsol kablosunun USB ucunu prob'un USB portuna bağlayın
2. RJ45/DB9 ucunu ağ cihazının konsol portuna bağlayın
3. Kablonun prob tarafından algılandığını doğrulayın

### Adım 2: Cihazı Ekleme

1. **CMod > Cihazlar** bölümüne gidin
2. **Cihaz Ekle**'ye tıklayın
3. Bağlantı türü olarak **Seri**'yi seçin
4. Seri parametrelerini yapılandırın:

| Alan | Açıklama | Varsayılan |
|---|---|---|
| Ad | Kolay tanınabilir cihaz adı | — |
| Seri Port | Algılanan USB seri cihaz | `/dev/ttyUSB0` |
| Baud Hızı | İletişim hızı | 9600 |
| Veri Bitleri | Veri bit sayısı | 8 |
| Eşlik | Eşlik denetimi | Yok |
| Dur Bitleri | Dur bit sayısı | 1 |
| Akış Kontrolü | Donanım/yazılım akış kontrolü | Yok |
| Cihaz Türü | Üretici/İS (şablon eşleştirme için) | — |

5. **Kaydet ve Test Et**'e tıklayın

### Adım 3: Terminal Açma

1. CMod cihaz listesinde cihaza tıklayın
2. **Terminal**'e tıklayın
3. Tarayıcınızda etkileşimli bir seri terminal açılır
4. Cihaz konsolunu uyandırmak için **Enter**'a basın

## Baud Hızı Referansı

Üreticiye göre yaygın baud hızları:

| Üretici / Cihaz | Varsayılan Baud Hızı |
|---|---|
| Cisco IOS / IOS-XE | 9600 |
| Cisco NX-OS | 9600 |
| Juniper Junos | 9600 |
| HP/Aruba ProCurve | 9600 |
| MikroTik RouterOS | 115200 |
| Fortinet FortiOS | 9600 |
| Palo Alto PAN-OS | 9600 |
| Ubiquiti EdgeOS | 115200 |
| Linux (genel) | 115200 |

:::tip
Terminalde bozuk metin görüyorsanız, baud hızı büyük olasılıkla yanlıştır. Yaygın hızları deneyin: 9600, 19200, 38400, 57600, 115200.
:::

## Seri İletişim Ayarları

### Standart 8N1 Yapılandırması

Çoğu ağ cihazı "8N1" standardını kullanır:
- **8** veri biti
- **N** (yok) eşlik
- **1** dur biti

Bu, CMod'daki varsayılandır ve cihazların büyük çoğunluğuyla çalışır.

### Akış Kontrolü

| Tür | Ne Zaman Kullanılır |
|---|---|
| Yok | Varsayılan; çoğu cihaz için çalışır |
| Donanım (RTS/CTS) | Bazı endüstriyel ve eski cihazlar tarafından gereklidir |
| Yazılım (XON/XOFF) | Nadiren kullanılır; bazı eski terminal sunucuları |

## Seri Port Algılama

USB seri kablo bağlandığında CMod otomatik olarak algılar:

1. **CMod > Cihazlar > Cihaz Ekle > Seri** bölümüne gidin
2. **Seri Port** açılır listesi algılanan tüm USB seri cihazları listeler
3. Birden fazla kablo bağlıysa her biri ayrı bir port olarak görünür (örn. `/dev/ttyUSB0`, `/dev/ttyUSB1`)

Hiçbir port algılanmıyorsa:
- Kablonun tam olarak takıldığını doğrulayın
- Prob üzerinde farklı bir USB port deneyin
- Prob'un sistem günlüğünde USB cihaz algılama hatalarını kontrol edin

## Kullanım Senaryoları

### İlk Cihaz Kurulumu
IP adresi yapılandırılmamış yeni kutudan çıkan bir anahtar veya yönlendiriciyi yapılandırırken:
1. Seri konsol aracılığıyla bağlanın
2. İlk yapılandırmayı tamamlayın (yönetim IP'si atayın, SSH'ı etkinleştirin)
3. Devam eden yönetim için SSH moduna geçin

### Parola Kurtarma
Bir cihaza erişim kilitlendiğinde:
1. Seri konsol aracılığıyla bağlanın
2. Üreticinin parola kurtarma prosedürünü izleyin
3. Parolayı sıfırlayın ve erişimi yeniden kazanın

### Bant Dışı Yönetim
Bir cihazın yönetim arayüzüne ulaşılamadığında:
1. Seri konsol aracılığıyla bağlanın
2. Sorunu teşhis edin (arayüz kapalı, yönlendirme sorunu vb.)
3. Düzeltici yapılandırmayı uygulayın

### Donanım Yazılımı Yükseltmeleri
Bazı cihazlar donanım yazılımı yükseltmeleri sırasında konsol erişimi gerektirir:
1. Seri konsol aracılığıyla bağlanın
2. Yükseltme sürecini gerçek zamanlı izleyin
3. Yükseltme hatayla karşılaşırsa müdahale edin

## Sorun Giderme

### Terminalde çıktı yok
- Konsolu uyandırmak için birkaç kez **Enter**'a basın
- Baud hızının cihazın yapılandırmasıyla eşleştiğini doğrulayın
- Konsol kablosunu ters çevirmeyi deneyin (bazı kablolar farklı bağlıdır)
- Kablonun USB sürücüsünün yüklendiğinden emin olun (prob sistem günlüklerini kontrol edin)

### Bozuk metin
- Baud hızı yanlış; önce 9600, sonra 115200 deneyin
- Veri bitleri, eşlik ve dur bitleri ayarlarını kontrol edin
- Farklı bir konsol kablosu deneyin

### Seri portta "izin reddedildi"
- CMod hizmeti `/dev/ttyUSB*` cihazlarına erişim gerektirir
- Bu, NetRecon OS kurulumu sırasında otomatik olarak yapılandırılır
- Özel kurulum kullanıyorsanız, CMod hizmet kullanıcısını `dialout` grubuna ekleyin

### Aralıklı bağlantı kopmaları
- USB kablosu gevşek olabilir; sağlam bir bağlantı sağlayın
- Bazı uzun USB kablolar sinyal bozulmasına neden olur; 3 metreden kısa kablo kullanın
- USB hub'lar sorun çıkarabilir; doğrudan prob'un USB portuna bağlayın

## SSS

**S: Seri modu Admin Connect aracılığıyla uzaktan kullanabilir miyim?**
C: Evet. Seri terminal, Cloudflare Tunnel aracılığıyla erişilebilen web kontrol paneli üzerinden erişilebilir. Uzaktan aynı etkileşimli terminal deneyimini elde edersiniz.

**S: Prob aynı anda kaç seri bağlantı destekleyebilir?**
C: USB port başına bir seri bağlantı. Çoğu prob donanımı 2-4 USB portu destekler. Ek bağlantılar için güçlendirilmiş bir USB hub kullanın, ancak doğrudan bağlantılar daha güvenilirdir.

**S: Seri konsol komutlarını otomatikleştirebilir miyim?**
C: Evet. Komut şablonları, SSH'da olduğu gibi seri bağlantılarla da çalışır. Parola kurtarma veya ilk kurulum gibi tekrarlanan seri görevler için şablonlar oluşturabilirsiniz.

Ek yardım için [support@netreconapp.com](mailto:support@netreconapp.com) adresine başvurun.
