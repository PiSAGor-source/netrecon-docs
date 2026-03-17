---
sidebar_position: 2
title: Tarama Profilleri
description: Profillerle tarama derinliğini ve hızını yapılandırın
---

# Tarama Profilleri

Tarama profilleri, tarama hızı ve kapsamlılık arasındaki dengeyi kontrol etmenizi sağlar. NetRecon dört yerleşik profil içerir ve belirli kullanım durumları için özel profiller oluşturabilirsiniz.

## Yerleşik Profiller

### Hızlı

Minimum port taraması ile hızlı ana bilgisayar keşfi için tasarlanmış en hızlı profil.

| Ayar | Değer |
|---|---|
| ARP keşfi | Evet |
| Port aralığı | En popüler 100 port |
| Hizmet tespiti | Temel (yalnızca yaygın hizmetler) |
| Cihaz profilleme | OUI + port parmak izi |
| Tahmini süre (/24) | 1-2 dakika |

**En uygun:** Hızlı envanter kontrolü, cihazın çevrimiçi olduğunu doğrulama, ilk keşif.

### Standart

Aşırı tarama süresi olmadan iyi kapsam sağlayan dengeli bir profil.

| Ayar | Değer |
|---|---|
| ARP keşfi | Evet |
| Port aralığı | En popüler 1.000 port |
| Hizmet tespiti | Tam banner yakalama |
| Cihaz profilleme | Tam (OUI + portlar + banner'lar) |
| Tahmini süre (/24) | 5-10 dakika |

**En uygun:** Düzenli ağ denetimleri, rutin güvenlik değerlendirmeleri, genel amaçlı tarama.

### Derin

Tüm yaygın portları kontrol eden ve kapsamlı hizmet analizi yapan detaylı tarama.

| Ayar | Değer |
|---|---|
| ARP keşfi | Evet |
| Port aralığı | 1-10.000 |
| Hizmet tespiti | Tam banner yakalama + sürüm tespiti |
| Cihaz profilleme | CVE çapraz referansı ile tam |
| Tahmini süre (/24) | 15-30 dakika |

**En uygun:** Kapsamlı güvenlik denetimleri, uyumluluk kontrolleri, detaylı ağ dokümantasyonu.

### Özel

Her tarama parametresi üzerinde tam kontrol ile kendi profilinizi oluşturun.

## Özel Profil Oluşturma

1. NetRecon Scanner uygulamasını açın
2. **Tarama > Profiller** bölümüne gidin
3. **Yeni Profil Oluştur**'a dokunun
4. Aşağıdaki parametreleri yapılandırın:

### Keşif Ayarları

| Parametre | Seçenekler | Varsayılan |
|---|---|---|
| Keşif yöntemi | ARP / Ping / Her ikisi | ARP |
| Alt ağ | Otomatik tespit / Manuel CIDR | Otomatik tespit |
| Hariç tutulan IP'ler | Virgülle ayrılmış liste | Yok |

### Port Tarama Ayarları

| Parametre | Seçenekler | Varsayılan |
|---|---|---|
| Port aralığı | İlk 100 / İlk 1000 / 1-10000 / 1-65535 / Özel | İlk 1000 |
| Özel portlar | Virgülle ayrılmış (örn. 22,80,443,8080) | — |
| Tarama tekniği | TCP Connect / SYN (yalnızca root) | TCP Connect |
| Port başına zaman aşımı | 500ms - 10.000ms | 2.000ms |
| Maksimum eşzamanlı | 5 - 40 | 20 |

### Hizmet Tespiti Ayarları

| Parametre | Seçenekler | Varsayılan |
|---|---|---|
| Banner yakalama | Kapalı / Temel / Tam | Temel |
| Sürüm tespiti | Evet / Hayır | Hayır |
| SSL/TLS bilgisi | Evet / Hayır | Hayır |

### Performans Ayarları

| Parametre | Seçenekler | Varsayılan |
|---|---|---|
| Pil duyarlı | Evet / Hayır | Evet |
| Maksimum eşzamanlı soket | 5 - 40 | 20 |
| Ana bilgisayarlar arası tarama gecikmesi | 0ms - 1.000ms | 0ms |

5. **Profili Kaydet**'e dokunun

## Profil Yönetimi

### Profilleri Dışa ve İçe Aktarma

Profiller cihazlar arasında paylaşılabilir:

1. **Tarama > Profiller** bölümüne gidin
2. Bir profile uzun basın
3. QR kodu veya JSON dosyası oluşturmak için **Dışa Aktar**'ı seçin
4. Alıcı cihazda **Profil İçe Aktar**'a dokunun ve QR kodunu tarayın veya dosyayı seçin

### Varsayılan Profil Ayarlama

1. **Tarama > Profiller** bölümüne gidin
2. İstediğiniz profile uzun basın
3. **Varsayılan Olarak Ayarla**'yı seçin

Varsayılan profil, profil seçmeden ana **Tara** düğmesine dokunduğunuzda kullanılır.

## Prob Profilleri

Bir prob'a bağlandığınızda ek profil seçenekleri kullanılabilir:

| Ayar | Açıklama |
|---|---|
| IDS izleme | Tarama sırasında Suricata IDS'i etkinleştir |
| Zafiyet taraması | Keşfedilen hizmetlerde Nuclei zafiyet kontrolleri çalıştır |
| PCAP yakalama | Sonraki analiz için tarama sırasında paketleri kaydet |
| Pasif keşif | Pasif olarak gözlemlenen cihazları sonuçlara dahil et |

Bu seçenekler yalnızca Tarayıcı uygulaması bir prob'a bağlıyken kullanılabilir.

## SSS

**S: Derin profil neden bu kadar uzun sürüyor?**
C: Derin profil, tam hizmet tespiti ile ana bilgisayar başına 10.000'e kadar port tarar. 100'den fazla aktif ana bilgisayarı olan bir /24 alt ağ için bu, milyonlarca bağlantı denemesi anlamına gelir. Rutin kontroller için Standart profili kullanmayı ve Derin profili hedefli değerlendirmeler için ayırmayı düşünün.

**S: 65.535 portun tamamını tarayabilir miyim?**
C: Evet, port aralığı "1-65535" olarak ayarlanmış bir Özel profil oluşturarak. Bu, tarama süresini önemli ölçüde artırır. Tek bir ana bilgisayar için tam port taraması yaklaşık 5-10 dakika sürer; tam bir /24 alt ağ için birkaç saat sürebilir.

**S: Pil duyarlı mod tarama sonuçlarını etkiler mi?**
C: Pil duyarlı mod, pil %30'un altına düştüğünde eşzamanlı bağlantı sayısını azaltır; bu taramayı yavaşlatır ancak herhangi bir hedefi veya portu atlamaz. Sonuçlar aynıdır; yalnızca tamamlanma süresi değişir.

Ek yardım için [support@netreconapp.com](mailto:support@netreconapp.com) adresine başvurun.
