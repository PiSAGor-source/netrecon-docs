---
sidebar_position: 1
title: Kurulum Sihirbazı Genel Bakış
description: NetRecon OS ilk önyükleme kurulum sihirbazı için kapsamlı kılavuz
---

# Kurulum Sihirbazı Genel Bakış

Kurulum Sihirbazı, NetRecon OS'un ilk önyüklemesinde otomatik olarak çalışır. Prob'unuzun çalışır hale gelmesi için tüm temel yapılandırma adımlarında size rehberlik eder. Sihirbaza `http://<probe-ip>:8080` adresinden bir web tarayıcısı aracılığıyla erişilebilir.

## Ön Koşullar

- NetRecon OS'un prob donanımınızda başarıyla önyüklemesi
- Ağınıza bağlı en az bir Ethernet kablosu
- Sihirbaza erişmek için aynı ağda bir bilgisayar veya akıllı telefon

## Sihirbaz Adımları

Kurulum sihirbazı sıralı olarak tamamlanan 11 adımdan oluşur:

| Adım | Ad | Açıklama |
|---|---|---|
| 1 | **Hoş Geldiniz** | Dil seçimi ve lisans sözleşmesi |
| 2 | **Yönetici Hesabı** | Yönetici kullanıcı adı ve parolası oluşturma |
| 3 | **Ana Bilgisayar Adı** | Prob'un ağdaki ana bilgisayar adını belirleme |
| 4 | **Ağ Arayüzleri** | Ethernet portlarını algılama ve rol atama |
| 5 | **Ağ Modu** | Tarama topolojisini seçme (Tekli, Çift, Köprü, TAP) |
| 6 | **IP Yapılandırması** | Her arayüz için statik IP veya DHCP ayarlama |
| 7 | **DNS ve NTP** | DNS sunucuları ve zaman senkronizasyonu yapılandırma |
| 8 | **Cloudflare Tunnel** | Uzaktan erişim tüneli kurma (isteğe bağlı) |
| 9 | **Güvenlik Ayarları** | TLS sertifikaları, 2FA ve oturum zaman aşımı yapılandırma |
| 10 | **İlk Tarama Hedefi** | Taranacak ilk alt ağı tanımlama |
| 11 | **Özet ve Uygula** | Tüm ayarları gözden geçirme ve yapılandırmayı uygulama |

## Adım Detayları

### Adım 1: Hoş Geldiniz

Desteklenen 11 dilden tercih ettiğiniz dili seçin. Devam etmek için lisans sözleşmesini kabul edin.

### Adım 2: Yönetici Hesabı

Prob kontrol paneline ve API'ye giriş yapmak için kullanılacak yönetici hesabını oluşturun. Güçlü bir parola seçin — bu hesap tam sistem erişimine sahiptir.

### Adım 3: Ana Bilgisayar Adı

Prob için anlamlı bir ana bilgisayar adı belirleyin (örn. `netrecon-hq` veya `probe-branch-01`). Bu ana bilgisayar adı yerel keşif için mDNS aracılığıyla yayınlanacaktır.

### Adım 4: Ağ Arayüzleri

Sihirbaz mevcut tüm Ethernet portlarını algılar ve bağlantı durumlarını görüntüler. Her arayüze bir rol atarsınız:

- **Tarama** — ağ keşfi ve tarama için kullanılan arayüz
- **Yönetim** — kontrol paneli erişimi ve uzaktan yönetim için kullanılan arayüz
- **Bağlantı** — internet ağ geçidinize bağlı arayüz
- **Kullanılmıyor** — devre dışı bırakılmış arayüzler

Ayrıntılı rehberlik için [Ağ Arayüzleri](./network-interfaces.md) sayfasına bakın.

### Adım 5: Ağ Modu

Prob'un ağınıza nasıl bağlanacağını seçin:

- **Tekli Arayüz** — tek bir portta tarama ve yönetim
- **Çift Tarama** — ayrı tarama ve yönetim arayüzleri
- **Köprü** — iki port arasında şeffaf çevrimiçi mod
- **TAP** — ağ TAP veya SPAN portu aracılığıyla pasif izleme

Ayrıntılı rehberlik için [Ağ Modları](./network-modes.md) sayfasına bakın.

### Adım 6: IP Yapılandırması

Her aktif arayüz için DHCP veya statik IP yapılandırması arasında seçim yapın. Prob'un adresi değişmesin diye yönetim arayüzü için statik IP önerilir.

### Adım 7: DNS ve NTP

Üst DNS sunucularını yapılandırın (varsayılan olarak Cloudflare 1.1.1.1 ve Google 8.8.8.8). NTP, günlükler ve tarama sonuçları için doğru zaman damgaları sağlamak üzere yapılandırılır.

### Adım 8: Cloudflare Tunnel

Güvenli uzaktan erişim için isteğe bağlı olarak bir Cloudflare Tunnel yapılandırın. Şunlara ihtiyacınız olacak:
- Bir Cloudflare hesabı
- Bir tünel jetonu (Cloudflare Zero Trust kontrol panelinden oluşturulur)

Bu adım atlanabilir ve daha sonra prob kontrol panelinden yapılandırılabilir.

### Adım 9: Güvenlik Ayarları

- **TLS Sertifikası** — kendinden imzalı sertifika oluşturun veya kendi sertifikanızı sağlayın
- **İki Faktörlü Kimlik Doğrulama** — yönetici hesabı için TOTP tabanlı 2FA'yı etkinleştirin
- **Oturum Zaman Aşımı** — kontrol paneli oturumlarının ne kadar süre aktif kalacağını yapılandırın

### Adım 10: İlk Tarama Hedefi

Prob'un tarayacağı ilk alt ağı tanımlayın. Sihirbaz, tarama arayüzünün IP yapılandırmasından alt ağı otomatik algılar ve varsayılan hedef olarak önerir.

### Adım 11: Özet ve Uygula

Yapılandırılan tüm ayarları gözden geçirin. Yapılandırmayı sonlandırmak için **Uygula**'ya tıklayın. Prob şunları yapacak:

1. Ağ yapılandırmasını uygulama
2. TLS sertifikalarını oluşturma
3. Tüm hizmetleri başlatma
4. İlk ağ taramasını başlatma (yapılandırılmışsa)
5. Sizi prob kontrol paneline yönlendirme

:::info
Sihirbaz yalnızca bir kez çalışır. Tamamlandıktan sonra firstboot hizmeti devre dışı bırakılır. Sihirbazı yeniden çalıştırmak için prob kontrol panelinde **Ayarlar > Sistem** altındaki **Fabrika Sıfırlaması** seçeneğini kullanın.
:::

## Sihirbaz Sonrası

Sihirbaz tamamlandığında:

- Prob kontrol paneline `https://<probe-ip>:3000` adresinden erişin
- Cloudflare Tunnel yapılandırılmışsa `https://probe.netreconapp.com` adresinden uzaktan erişin
- NetRecon Scanner veya Admin Connect uygulamasını prob'a bağlayın

## SSS

**S: Önceki bir adıma geri dönebilir miyim?**
C: Evet, sihirbazın her adımında geri butonu vardır. Daha önce girdiğiniz değerler korunur.

**S: Sihirbazdan sonra ayarları değiştirmem gerekirse ne yapmalıyım?**
C: Sihirbazda yapılandırılan tüm ayarlar daha sonra prob kontrol panelinde **Ayarlar** altından değiştirilebilir.

**S: Sihirbaz hiçbir ağ arayüzü göstermiyor. Ne yapmalıyım?**
C: Ethernet kablolarınızın bağlı olduğundan ve bağlantı LED'lerinin aktif olduğundan emin olun. USB Ethernet adaptörü kullanıyorsanız, manuel sürücü kurulumu gerekebilir. Sürücü kurtarma bilgisi için [Ağ Arayüzleri](./network-interfaces.md) sayfasına bakın.

Ek yardım için [support@netreconapp.com](mailto:support@netreconapp.com) adresine başvurun.
