---
sidebar_position: 3
title: Steel Shield
description: Kendi sunucunuzda barındırılan dağıtımlar için güvenlik sertleştirme özellikleri
---

# Steel Shield

Steel Shield, NetRecon'un güvenlik sertleştirme çerçevesidir. Kendi sunucunuzda barındırılan dağıtımlar için birden fazla koruma katmanı sağlayarak tüm platform bileşenlerinin bütünlüğünü ve özgünlüğünü garanti eder.

## Genel Bakış

Steel Shield dört temel güvenlik mekanizması içerir:

| Özellik | Amaç |
|---|---|
| **İkili Dosya Bütünlüğü** | Çalıştırılabilir dosyaların değiştirilmediğini doğrulama |
| **Sertifika Sabitleme** | API iletişiminde ortadaki adam saldırılarını önleme |
| **Müdahale Yanıtı** | Yetkisiz değişiklikleri tespit etme ve yanıt verme |
| **Çalışma Zamanı Koruması** | Bellek manipülasyonu ve hata ayıklamaya karşı koruma |

## İkili Dosya Bütünlük Doğrulaması

Her NetRecon ikili dosyası (prob arka ucu, ajanlar, hizmetler) dijital olarak imzalanmıştır. Başlangıçta her bileşen kendi bütünlüğünü doğrular.

### Nasıl Çalışır

1. Derleme sırasında her ikili dosya, NetRecon tarafından tutulan bir özel anahtar ile imzalanır
2. İmza, ikili dosyanın meta verilerine gömülür
3. Başlangıçta ikili dosya kendisinin SHA-256 hash'ini hesaplar
4. Hash, gömülü imzayla karşılaştırılarak doğrulanır
5. Doğrulama başarısız olursa ikili dosya başlamayı reddeder ve bir uyarı kaydeder

### Manuel Doğrulama

Bir ikili dosyanın bütünlüğünü manuel olarak doğrulayın:

```bash
# Prob arka ucunu doğrulayın
netrecon-verify /usr/local/bin/netrecon-probe

# Bir ajanı doğrulayın
netrecon-verify /usr/local/bin/netrecon-agent

# Beklenen çıktı:
# Binary: /usr/local/bin/netrecon-probe
# SHA-256: a1b2c3d4e5f6...
# Signature: VALID
# Signed by: NetRecon Build System
# Signed at: 2026-03-15T10:00:00Z
```

### Docker İmaj Doğrulaması

Docker imajları Docker Content Trust (DCT) kullanılarak imzalanır:

```bash
# Content trust'ı etkinleştirin
export DOCKER_CONTENT_TRUST=1

# İmza doğrulamasıyla çekin
docker pull netrecon/api-gateway:latest
```

## Sertifika Sabitleme

Sertifika sabitleme, NetRecon bileşenlerinin yalnızca meşru sunucularla iletişim kurmasını sağlar; bir sertifika otoritesi tehlikeye girse bile müdahaleyi önler.

### Sabitlenmiş Bağlantılar

| Bağlantı | Sabitleme Türü |
|---|---|
| Ajan - Prob | Açık anahtar sabitleme |
| Admin Connect - Prob | Sertifika parmak izi |
| Prob - Update Server | Açık anahtar sabitleme |
| Prob - License Server | Sertifika parmak izi |

### Nasıl Çalışır

1. Beklenen sertifika açık anahtar hash'i her istemci ikili dosyasına gömülür
2. TLS bağlantısı kurulurken istemci, sunucunun açık anahtarını çıkarır
3. İstemci, açık anahtarın SHA-256 hash'ini hesaplar
4. Hash sabitlenmiş değerle eşleşmezse bağlantı reddedilir
5. Başarısız sabitleme doğrulaması bir güvenlik uyarısı tetikler

### Sabitleme Rotasyonu

Sertifikalar yenilendiğinde:

1. Yeni sabitlemeler, sertifika değişikliğinden önce güncelleme sunucusu aracılığıyla dağıtılır
2. Geçiş süresi boyunca hem eski hem yeni sabitlemeler geçerlidir
3. Geçişten sonra eski sabitlemeler bir sonraki güncellemede kaldırılır

Kendi sunucunuzda barındırılan dağıtımlar için yapılandırmadaki sabitlemeleri güncelleyin:

```yaml
# /etc/netrecon/security.yaml
certificate_pins:
  api_gateway:
    - "sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="  # Current
    - "sha256/BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB="  # Backup
```

## Müdahale Yanıtı

Steel Shield, kritik dosyaları ve yapılandırmaları yetkisiz değişiklikler açısından izler.

### İzlenen Öğeler

| Öğe | Kontrol Sıklığı | Yanıt |
|---|---|---|
| İkili dosyalar | Başlangıçta + her 1 saatte | Uyarı + isteğe bağlı kapatma |
| Yapılandırma dosyaları | Her 5 dakikada | Uyarı + yedekten geri yükleme |
| Veritabanı bütünlüğü | Her 15 dakikada | Uyarı + tutarlılık kontrolü |
| TLS sertifikaları | Her 5 dakikada | Değişirse uyarı |
| Sistem paketleri | Günlük | Beklenmeyen değişikliklerde uyarı |

### Yanıt Eylemleri

Müdahale tespit edildiğinde Steel Shield şunları yapabilir:

1. **Kaydet** — olayı güvenlik denetim günlüğüne kaydet
2. **Uyar** — yapılandırılmış kanallar aracılığıyla bildirim gönder
3. **Geri Yükle** — değiştirilen dosyayı bilinen iyi bir yedekten geri yükle
4. **İzole Et** — ağ erişimini yalnızca yönetimle sınırla
5. **Kapat** — daha fazla tehlikeyi önlemek için hizmeti durdur

Yanıt seviyesini yapılandırın:

```yaml
# /etc/netrecon/security.yaml
tamper_response:
  level: "alert_and_revert"  # Options: log, alert, alert_and_revert, isolate, shutdown
  notify_email: "security@yourcompany.com"
```

### Dosya Bütünlük Veritabanı

Steel Shield, korunan tüm dosyaların hash veritabanını tutar:

```bash
# Bütünlük veritabanını başlatın
netrecon-shield init

# Bütünlüğü manuel olarak kontrol edin
netrecon-shield verify

# Beklenen çıktı:
# Checked 47 files
# Status: ALL INTACT
# Last verified: 2026-03-15T14:30:00Z
```

## Çalışma Zamanı Koruması

### Hata Ayıklama Önleme

Üretim modunda NetRecon ikili dosyaları hata ayıklama önleme tedbirleri içerir:
- Bağlı hata ayıklayıcıların tespiti (Linux'ta ptrace, Windows'ta IsDebuggerPresent)
- Adım adım çalıştırma için zamanlama kontrolleri
- Üretimde hata ayıklama tespit edildiğinde süreç düzgün bir şekilde sonlanır

:::info
Hata ayıklama önleme, normal hata ayıklama iş akışlarına izin vermek için geliştirme yapılarında devre dışıdır.
:::

### Bellek Koruması

- Hassas veriler (jetonlar, anahtarlar, parolalar) korumalı bellek bölgelerinde saklanır
- Kullanımdan sonra bellek sıfırlanarak kalan veri açığa çıkmasını önler
- Linux'ta `mlock`, hassas sayfaların diske taşınmasını önlemek için kullanılır

## Yapılandırma

### Steel Shield'ı Etkinleştirme

Steel Shield, üretim dağıtımlarında varsayılan olarak etkindir. Şurada yapılandırın:

```yaml
# /etc/netrecon/security.yaml
steel_shield:
  enabled: true
  binary_integrity: true
  certificate_pinning: true
  tamper_response: true
  runtime_protection: true
  integrity_check_interval: 3600  # seconds
  tamper_check_interval: 300      # seconds
```

### Geliştirme İçin Devre Dışı Bırakma

Geliştirme ve test ortamları için:

```yaml
steel_shield:
  enabled: false
```

Veya belirli özellikleri devre dışı bırakın:

```yaml
steel_shield:
  enabled: true
  binary_integrity: false   # Skip hash verification during dev
  runtime_protection: false  # Allow debugger attachment
```

## Denetim İzi

Tüm Steel Shield olayları güvenlik denetim günlüğüne kaydedilir:

```bash
# Son güvenlik olaylarını görüntüleyin
netrecon-shield audit --last 24h

# Denetim günlüğünü dışa aktarın
netrecon-shield audit --export csv --output security-audit.csv
```

Denetim günlüğü girişleri şunları içerir:
- Zaman damgası
- Olay türü (integrity_check, pin_validation, tamper_detected, vb.)
- Etkilenen bileşen
- Sonuç (başarılı/başarısız)
- Alınan eylem
- Ek detaylar

## Kendi Sunucunuzda Barındırma Hususları

Kendi sunucunuzda barındırırken şunları göz önünde bulundurun:

1. **Özel sertifikalar**: Kendi sertifika otoritenizi kullanıyorsanız, dağıtım sonrasında sertifika sabitleme yapılandırmasını güncelleyin
2. **İkili dosya güncellemeleri**: İkili dosyaları güncelledikten sonra bütünlük veritabanını yeniden oluşturmak için `netrecon-shield init` komutunu çalıştırın
3. **Bütünlük veritabanını yedekleyin**: `/etc/netrecon/integrity.db` dosyasını yedekleme rutininize dahil edin
4. **Uyarıları izleyin**: Müdahale uyarıları için e-posta veya webhook bildirimlerini yapılandırın

## SSS

**S: Steel Shield yanlış pozitif sonuç üretebilir mi?**
C: Yanlış pozitifler nadirdir ancak paylaşılan kitaplıkları değiştiren sistem güncellemelerinden sonra oluşabilir. Bütünlük veritabanını yenilemek için sistem güncellemelerinden sonra `netrecon-shield init` komutunu çalıştırın.

**S: Steel Shield performansı etkiler mi?**
C: Performans etkisi minimumdur. Bütünlük kontrolleri arka plan iş parçacığında çalışır ve genellikle 1 saniyeden kısa sürede tamamlanır.

**S: Steel Shield uyarılarını SIEM'imle entegre edebilir miyim?**
C: Evet. Olayları SIEM'inize iletmek için güvenlik yapılandırmasında syslog çıktısını yapılandırın. Steel Shield, syslog (RFC 5424) ve JSON çıktı formatlarını destekler.

**S: Steel Shield üretim dağıtımları için zorunlu mu?**
C: Steel Shield şiddetle tavsiye edilir ancak kesinlikle zorunlu değildir. Devre dışı bırakabilirsiniz, ancak bunu yapmak önemli güvenlik korumalarını kaldırır.

Ek yardım için [support@netreconapp.com](mailto:support@netreconapp.com) adresine başvurun.
