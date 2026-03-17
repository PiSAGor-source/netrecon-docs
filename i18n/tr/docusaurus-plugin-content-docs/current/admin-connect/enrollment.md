---
sidebar_position: 2
title: Kayıt
description: Prob'ları QR kodu veya manuel kurulum ile Admin Connect'e kaydedin
---

# Prob Kaydı

Kayıt, bir prob'u Admin Connect uygulamanıza bağlama işlemidir. Kaydedildikten sonra prob'u her yerden uzaktan izleyebilir ve yönetebilirsiniz.

## Ön Koşullar

- Android cihazınızda Admin Connect uygulaması kurulu
- Kurulum sihirbazını tamamlamış bir NetRecon Prob
- Hem prob'da hem de mobil cihazınızda internet erişimi

## Yöntem 1: QR Kodu ile Kayıt

QR kodu ile kayıt, en hızlı ve güvenilir yöntemdir. QR kodu, prob'un bağlantı detaylarını ve kimlik doğrulama jetonunu şifreli biçimde içerir.

### Adım 1: QR Kodunu Görüntüleyin

QR kodu iki yerde bulunur:

**Kurulum Sihirbazı Sırasında:**
Sihirbazın sonunda (Adım 11), özet ekranında bir QR kodu görüntülenir.

**Prob Kontrol Panelinden:**
1. `https://<prob-ip>:3000` adresinden prob kontrol paneline giriş yapın
2. **Ayarlar > Uzaktan Erişim** bölümüne gidin
3. **Kayıt QR Kodu Oluştur**'a tıklayın
4. Ekranda bir QR kodu görüntülenecektir

### Adım 2: QR Kodunu Tarayın

1. Admin Connect'i açın
2. Yeni bir prob eklemek için **+** düğmesine dokunun
3. **QR Kodu Tara**'yı seçin
4. Kameranızı prob'da görüntülenen QR koduna doğrultun
5. Uygulama bağlantı detaylarını otomatik olarak ayrıştıracaktır

### Adım 3: Doğrulayın ve Bağlanın

1. Uygulamada gösterilen prob detaylarını (ana bilgisayar adı, IP, tünel URL) inceleyin
2. **Bağlan**'a dokunun
3. Uygulama prob'a güvenli bir bağlantı kuracaktır
4. Bağlandığında, prob filo kontrol panelinizde görünür

### QR Kodu İçerikleri

QR kodu, şunları içeren bir JSON verisi kodlar:

```json
{
  "hostname": "netrecon-hq",
  "tunnel_url": "https://probe.netreconapp.com",
  "token": "<enrollment-token>",
  "fingerprint": "<certificate-fingerprint>",
  "version": "2.2.0"
}
```

Kayıt jetonu tek kullanımlıktır ve 24 saat sonra süresi dolar.

## Yöntem 2: Manuel Kayıt

QR kodunu taramak için prob'a fiziksel erişiminiz olmadığında manuel kaydı kullanın.

### Adım 1: Bağlantı Detaylarını Edinin

Prob yöneticinizden şunlara ihtiyacınız olacak:
- **Tünel URL'si**: genellikle `https://probe.netreconapp.com` veya özel bir alan adı
- **Kayıt Jetonu**: 32 karakterlik alfanümerik bir dize
- **Sertifika Parmak İzi** (isteğe bağlı): sertifika sabitleme doğrulaması için

### Adım 2: Admin Connect'e Detayları Girin

1. Admin Connect'i açın
2. Yeni bir prob eklemek için **+** düğmesine dokunun
3. **Manuel Kurulum**'u seçin
4. Gerekli alanları doldurun:
   - **Prob Adı**: tanımlama için kolay bir ad
   - **Tünel URL'si**: prob'un HTTPS URL'si
   - **Kayıt Jetonu**: yöneticiniz tarafından sağlanan jetonu yapıştırın
5. **Bağlan**'a dokunun

### Adım 3: Bağlantıyı Doğrulayın

1. Uygulama bağlanmaya ve kimlik doğrulamaya çalışacaktır
2. Başarılı olursa prob detayları görüntülenecektir
3. Onaylamak için **Filoya Ekle**'ye dokunun

## Kurumsal Kayıt

Büyük ölçekli dağıtımlar için Admin Connect toplu kaydı destekler:

### MDM ile Yönetilen Yapılandırma

Kayıt ayarlarını MDM çözümünüz aracılığıyla dağıtın:

```xml
<managedAppConfiguration>
  <key>probe_url</key>
  <value>https://probe.netreconapp.com</value>
  <key>enrollment_token</key>
  <value>your-enrollment-token</value>
  <key>auto_enroll</key>
  <value>true</value>
</managedAppConfiguration>
```

### Filo Kayıt Jetonu

Prob kontrol panelinden tekrar kullanılabilir filo kayıt jetonu oluşturun:

1. **Ayarlar > Uzaktan Erişim > Filo Kaydı** bölümüne gidin
2. **Filo Jetonu Oluştur**'a tıklayın
3. Bir son kullanma tarihi ve maksimum kayıt sayısı belirleyin
4. Jetonu ekibinize dağıtın

Filo jetonları, birden fazla Admin Connect örneği tarafından aynı prob'u kaydetmek için kullanılabilir.

## Kayıtlı Prob'ları Yönetme

### Kayıtlı Prob'ları Görüntüleme

Tüm kayıtlı prob'lar Admin Connect ana ekranında görünür. Her prob şunları gösterir:
- Bağlantı durumu (çevrimiçi/çevrimdışı)
- Son görülme zaman damgası
- Sağlık özeti (işlemci, bellek, disk)
- Aktif uyarı sayısı

### Bir Prob'u Kaldırma

1. Filo listesinde prob'a uzun basın
2. **Prob'u Kaldır**'ı seçin
3. Kaldırmayı onaylayın

Bu, prob'u yalnızca uygulamanızdan kaldırır. Prob'un kendisi etkilenmez.

### Yeniden Kayıt

Bir prob'u yeniden kaydetmeniz gerekirse (örn. jeton rotasyonundan sonra):
1. Prob'u Admin Connect'ten kaldırın
2. Prob'da yeni bir kayıt QR kodu veya jeton oluşturun
3. Yukarıdaki yöntemlerden birini kullanarak yeniden kaydedin

## Sorun Giderme

### QR kodu taraması başarısız oluyor
- Yeterli aydınlatma sağlayın ve kamerayı sabit tutun
- QR kodunu görüntüleyen cihazda ekran parlaklığını artırmayı deneyin
- Kamera odaklanamazsa ekrana yaklaşmayı veya uzaklaşmayı deneyin

### Bağlantı zaman aşımı
- Prob'un internet erişimi olduğunu ve Cloudflare Tunnel'ın aktif olduğunu doğrulayın
- Mobil cihazınızda giden HTTPS'i (port 443) engelleyen bir güvenlik duvarı olmadığını kontrol edin
- Wi-Fi ile mobil veri arasında geçiş yapmayı deneyin

### Jeton süresi dolmuş
- Kayıt jetonları 24 saat sonra sona erer
- Prob kontrol panelinden yeni bir QR kodu veya jeton oluşturun

## SSS

**S: Birden fazla kullanıcı aynı prob'u kaydedebilir mi?**
C: Evet. Her kullanıcı bağımsız olarak kaydolur ve kendi oturumunu alır. Erişim, her kullanıcıya atanan role göre kontrol edilir (bkz. [RBAC](./rbac.md)).

**S: Kayıt internet olmadan yerel ağ üzerinden çalışır mı?**
C: Manuel kayıt, tünel URL'si yerine prob'un yerel IP adresini kullanarak yerel ağ üzerinden çalışabilir. QR ile kayıt da yerel olarak çalışır.

**S: Kayıt jetonlarını nasıl döndürürüm?**
C: Prob kontrol panelindeki **Ayarlar > Uzaktan Erişim** bölümüne gidin ve **Jeton Döndür**'e tıklayın. Bu, önceki tüm jetonları geçersiz kılar.

Ek yardım için [support@netreconapp.com](mailto:support@netreconapp.com) adresine başvurun.
