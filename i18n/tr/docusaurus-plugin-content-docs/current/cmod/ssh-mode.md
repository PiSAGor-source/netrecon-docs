---
sidebar_position: 2
title: SSH Modu
description: Yapılandırma yönetimi için ağ cihazlarına SSH ile bağlanma
---

# SSH Modu

SSH modu, SSH protokolünü kullanarak ağ üzerinden ağ cihazlarına bağlanmanıza olanak tanır. Bu, anahtarları, yönlendiricileri, güvenlik duvarlarını ve sunucuları yönetmek için en yaygın bağlantı yöntemidir.

## Ön Koşullar

- Hedef cihazda SSH etkin olmalı
- Prob'un cihazın yönetim IP'sine ağ bağlantısı olmalı
- Geçerli SSH kimlik bilgileri (kullanıcı adı/parola veya SSH anahtarı)
- Cihazın SSH portuna erişilebilir olmalı (varsayılan: 22)

## SSH Bağlantısı Kurma

### Adım 1: Cihazı Ekleme

1. **CMod > Cihazlar** bölümüne gidin
2. **Cihaz Ekle**'ye tıklayın
3. Bağlantı detaylarını doldurun:

| Alan | Açıklama | Örnek |
|---|---|---|
| Ad | Kolay tanınabilir cihaz adı | Core-SW-01 |
| IP Adresi | Yönetim IP'si | 192.168.1.1 |
| Port | SSH portu | 22 |
| Cihaz Türü | Üretici/İS | Cisco IOS |
| Kullanıcı Adı | SSH kullanıcı adı | admin |
| Kimlik Doğrulama | Parola veya SSH Anahtarı | Parola |
| Parola | SSH parolası | (şifreli) |

4. **Kaydet ve Test Et**'e tıklayın

### Adım 2: Bağlantı Testi

**Kaydet ve Test Et**'e tıkladığınızda CMod şunları yapar:
1. Belirtilen IP ve porta TCP bağlantısı dener
2. SSH anahtar değişimi gerçekleştirir
3. Sağlanan kimlik bilgileriyle kimlik doğrulaması yapar
4. Oturumun çalıştığını doğrulamak için temel bir komut çalıştırır (örn. `show version`)
5. Sonucu görüntüler ve cihazı "Bağlı" olarak işaretler veya hata bildirir

### Adım 3: Terminal Açma

1. CMod cihaz listesinde cihaza tıklayın
2. **Terminal**'e tıklayın
3. WebSocket aracılığıyla tarayıcınızda etkileşimli bir SSH terminali açılır
4. Doğrudan cihaza bağlıymış gibi komut yazabilirsiniz

## SSH Anahtar Kimlik Doğrulaması

Anahtar tabanlı kimlik doğrulama için:

1. Cihaz eklerken kimlik doğrulama yöntemi olarak **SSH Anahtarı**'nı seçin
2. Özel anahtarınızı (PEM formatında) anahtar alanına yapıştırın
3. İsteğe bağlı olarak anahtar parolası sağlayın
4. Genel anahtar hedef cihazda zaten yüklü olmalıdır

:::tip
SSH anahtar kimlik doğrulaması daha güvenlidir ve üretim ortamları için önerilir. Ayrıca zamanlanmış yapılandırma yedeklemeleri gibi gözetimsiz işlemleri de mümkün kılar.
:::

## Bağlantı Ayarları

### Zaman Aşımı Yapılandırması

| Ayar | Varsayılan | Aralık |
|---|---|---|
| Bağlantı zaman aşımı | 10 saniye | 5-60 saniye |
| Komut zaman aşımı | 30 saniye | 10-300 saniye |
| Boşta kalma zaman aşımı | 15 dakika | 5-60 dakika |
| Canlı tutma aralığı | 30 saniye | 10-120 saniye |

Bunları **CMod > Ayarlar > SSH** altından yapılandırın.

### SSH Seçenekleri

| Seçenek | Varsayılan | Açıklama |
|---|---|---|
| Katı ana bilgisayar anahtarı denetimi | Devre dışı | Cihazın SSH ana bilgisayar anahtarını doğrulama |
| Tercih edilen şifreler | Otomatik | Şifre pazarlık sırasını geçersiz kılma |
| Terminal türü | xterm-256color | Terminal emülasyon türü |
| Terminal boyutu | 80x24 | Sütun x Satır |

## Komut Çalıştırma

### Etkileşimli Terminal

WebSocket terminali gerçek zamanlı etkileşimli bir oturum sağlar:
- Tam ANSI renk desteği
- Sekme tamamlama (cihaza iletilir)
- Komut geçmişi (yukarı/aşağı oklar)
- Kopyala/yapıştır desteği
- Oturum kaydı (isteğe bağlı)

### Komut Şablonları

Önceden tanımlanmış komut dizilerini çalıştırın:

1. Cihazı seçin
2. **Şablon Çalıştır**'a tıklayın
3. Bir şablon seçin
4. Şablonda değişkenler varsa değerleri doldurun
5. **Çalıştır**'a tıklayın

Değişkenli örnek şablon:

```
configure terminal
interface {{interface}}
description {{description}}
switchport mode access
switchport access vlan {{vlan_id}}
no shutdown
end
write memory
```

### Toplu Çalıştırma

Aynı komutu veya şablonu birden fazla cihazda çalıştırın:

1. **CMod > Toplu İşlemler** bölümüne gidin
2. Hedef cihazları seçin (onay kutuları)
3. Bir şablon seçin veya komut girin
4. **Seçililerde Çalıştır**'a tıklayın
5. Sonuçlar cihaz başına sekmeli görünümde gösterilir

## SSH ile Yapılandırma Yedekleme

CMod, cihaz yapılandırmalarını otomatik olarak yedekleyebilir:

1. **CMod > Yedekleme Programı** bölümüne gidin
2. **Program Ekle**'ye tıklayın
3. Yedeklenecek cihazları seçin
4. Programı ayarlayın (günlük, haftalık veya özel cron)
5. Yedekleme komut şablonunu seçin (örn. "Çalışan Yapılandırmayı Göster")
6. **Kaydet**'e tıklayın

Yedeklenen yapılandırmalar prob üzerinde saklanır ve şunları içerir:
- Zaman damgası
- Cihaz ana bilgisayar adı
- Önceki yedeklemeden yapılandırma farkı
- Tam yapılandırma metni

## Sorun Giderme

### Bağlantı reddedildi
- Hedef cihazda SSH'ın etkin olduğunu doğrulayın
- IP adresinin ve portun doğru olduğundan emin olun
- Prob ile cihaz arasındaki bağlantıyı engelleyen bir güvenlik duvarı olmadığını kontrol edin

### Kimlik doğrulama başarısız
- Kullanıcı adı ve parolanın/anahtarın doğru olduğunu doğrulayın
- Bazı cihazlar birden fazla başarısız denemeden sonra kilitlenir; bekleyip tekrar deneyin
- Cihazın belirli bir SSH protokol sürümü (SSHv2) gerektirip gerektirmediğini kontrol edin

### Terminal yanıt vermiyor veya donuyor
- Cihaz bir komutun tamamlanmasını bekliyor olabilir; Ctrl+C'ye basın
- Komut zaman aşımı ayarını kontrol edin
- Canlı tutma aralığının yapılandırıldığını doğrulayın

### Komutlar beklenmeyen çıktı üretiyor
- Doğru cihaz türünün seçildiğinden emin olun; farklı üreticiler farklı komut söz dizimi kullanır
- Bazı komutlar yükseltilmiş yetki modu gerektirir (örn. Cisco'da `enable`)

## SSS

**S: SSH atlama ana bilgisayarları / bastion ana bilgisayarları kullanabilir miyim?**
C: Şu anda desteklenmiyor. CMod, prob'dan hedef cihaza doğrudan bağlanır. Prob'un tüm yönetilen cihazlara yönlendirmesinin olduğundan emin olun.

**S: SSH oturumları günlüğe kaydediliyor mu?**
C: Evet. CMod aracılığıyla çalıştırılan tüm komutlar; kullanıcı adı, zaman damgası, cihaz ve komut metniyle birlikte denetim izinde günlüğe kaydedilir.

**S: SSH aracılığıyla cihaza dosya yükleyebilir miyim?**
C: SCP/SFTP dosya aktarımı gelecek bir sürüm için planlanmaktadır. Şu anda CMod yalnızca komut satırı etkileşimini destekler.

Ek yardım için [support@netreconapp.com](mailto:support@netreconapp.com) adresine başvurun.
