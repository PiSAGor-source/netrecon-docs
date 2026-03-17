---
sidebar_position: 3
title: Rol Tabanlı Erişim Kontrolü
description: Admin Connect'te kullanıcı rolleri ve izinleri yapılandırma
---

# Rol Tabanlı Erişim Kontrolü (RBAC)

NetRecon, her kullanıcının neler görebileceğini ve yapabileceğini yönetmek için rol tabanlı erişim kontrolü kullanır. Roller prob üzerinde tanımlanır ve hem web kontrol paneli hem de Admin Connect uygulamasında uygulanır.

## Ön Koşullar

- Prob kontrol paneline yönetici düzeyinde erişim
- Admin Connect'e kayıtlı en az bir prob

## RBAC Nasıl Çalışır

Her kullanıcı hesabına bir rol atanır. Roller, özelliklere erişimi kontrol eden bir dizi izin içerir. Bir kullanıcı Admin Connect veya web kontrol paneli üzerinden giriş yaptığında, sistem herhangi bir eyleme izin vermeden önce rolünü kontrol eder.

```
Kullanıcı → Rol → İzinler → Erişim Verildi / Reddedildi
```

İzinler hem kullanıcı arayüzü düzeyinde (kullanılamayan özellikleri gizleme) hem de API düzeyinde (yetkisiz istekleri reddetme) uygulanır.

## Önceden Tanımlı Roller

NetRecon beş önceden tanımlı rol içerir:

| Rol | Açıklama | Tipik Kullanıcı |
|---|---|---|
| **Süper Yönetici** | Tüm özellik ve ayarlara tam erişim | Platform sahibi |
| **Yönetici** | Rol yönetimi ve sistem ayarları hariç tam erişim | BT yöneticisi |
| **Analist** | Tarama sonuçları, uyarılar, raporları görüntüleme; ayarları değiştiremez | Güvenlik analisti |
| **Operatör** | Taramaları ve hizmetleri başlatma/durdurma; sonuçları görüntüleme | NOC teknisyeni |
| **Görüntüleyici** | Kontrol panelleri ve raporlara salt okunur erişim | Yönetici, denetçi |

## İzin Matrisi

| İzin | Süper Yönetici | Yönetici | Analist | Operatör | Görüntüleyici |
|---|---|---|---|---|---|
| Kontrol panelini görüntüleme | Evet | Evet | Evet | Evet | Evet |
| Tarama sonuçlarını görüntüleme | Evet | Evet | Evet | Evet | Evet |
| Taramaları başlatma/durdurma | Evet | Evet | Hayır | Evet | Hayır |
| IDS uyarılarını görüntüleme | Evet | Evet | Evet | Evet | Evet |
| IDS kurallarını yönetme | Evet | Evet | Hayır | Hayır | Hayır |
| PCAP başlatma/durdurma | Evet | Evet | Hayır | Evet | Hayır |
| PCAP dosyalarını indirme | Evet | Evet | Evet | Hayır | Hayır |
| Zafiyet taraması çalıştırma | Evet | Evet | Hayır | Evet | Hayır |
| Zafiyet sonuçlarını görüntüleme | Evet | Evet | Evet | Evet | Evet |
| Bal küpünü yönetme | Evet | Evet | Hayır | Hayır | Hayır |
| VPN yönetme | Evet | Evet | Hayır | Hayır | Hayır |
| DNS çukurunu yapılandırma | Evet | Evet | Hayır | Hayır | Hayır |
| Rapor oluşturma | Evet | Evet | Evet | Evet | Hayır |
| Kullanıcıları yönetme | Evet | Evet | Hayır | Hayır | Hayır |
| Rolleri yönetme | Evet | Hayır | Hayır | Hayır | Hayır |
| Sistem ayarları | Evet | Hayır | Hayır | Hayır | Hayır |
| Yedekleme/geri yükleme | Evet | Evet | Hayır | Hayır | Hayır |
| Denetim günlüğünü görüntüleme | Evet | Evet | Evet | Hayır | Hayır |
| Destek talebi | Evet | Evet | Evet | Evet | Hayır |
| Filo yönetimi | Evet | Evet | Hayır | Hayır | Hayır |

## Kullanıcıları Yönetme

### Kullanıcı Oluşturma

1. Süper Yönetici veya Yönetici olarak prob kontrol paneline giriş yapın
2. **Ayarlar > Kullanıcılar** bölümüne gidin
3. **Kullanıcı Ekle**'ye tıklayın
4. Kullanıcı detaylarını doldurun:
   - Kullanıcı adı
   - E-posta adresi
   - Parola (veya davet bağlantısı gönderin)
   - Rol (önceden tanımlı rollerden seçin)
5. **Oluştur**'a tıklayın

### Kullanıcının Rolünü Düzenleme

1. **Ayarlar > Kullanıcılar** bölümüne gidin
2. Değiştirmek istediğiniz kullanıcıya tıklayın
3. **Rol** açılır menüsünü değiştirin
4. **Kaydet**'e tıklayın

### Kullanıcıyı Devre Dışı Bırakma

1. **Ayarlar > Kullanıcılar** bölümüne gidin
2. Kullanıcıya tıklayın
3. **Aktif** seçeneğini kapalı konuma getirin
4. **Kaydet**'e tıklayın

Devre dışı bırakılan kullanıcılar giriş yapamaz ancak denetim geçmişleri korunur.

## Özel Roller

Süper Yöneticiler ayrıntılı izinlerle özel roller oluşturabilir:

1. **Ayarlar > Roller** bölümüne gidin
2. **Rol Oluştur**'a tıklayın
3. Bir rol adı ve açıklama girin
4. Bireysel izinleri açma/kapama
5. **Kaydet**'e tıklayın

Özel roller, kullanıcılara atanırken önceden tanımlı rollerin yanında görünür.

## İki Faktörlü Kimlik Doğrulama

2FA, rol başına zorunlu tutulabilir:

1. **Ayarlar > Roller** bölümüne gidin
2. Bir rol seçin
3. **2FA Zorunlu** seçeneğini etkinleştirin
4. **Kaydet**'e tıklayın

Bu role sahip kullanıcılar, bir sonraki girişlerinde TOTP tabanlı 2FA kurmak zorunda kalacaktır.

## Oturum Yönetimi

Rol başına oturum politikalarını yapılandırın:

| Ayar | Açıklama | Varsayılan |
|---|---|---|
| Oturum zaman aşımı | Etkinlik dışı kalma sonrası otomatik çıkış | 30 dakika |
| Maksimum eşzamanlı oturum | Maksimum eşzamanlı giriş sayısı | 3 |
| IP kısıtlaması | Girişi belirli IP aralıklarıyla sınırlama | Devre dışı |

Bunları **Ayarlar > Roller > [Rol Adı] > Oturum Politikası** altında yapılandırın.

## Denetim Günlüğü

Tüm izin ile ilgili eylemler kaydedilir:

- Kullanıcı giriş/çıkış olayları
- Rol değişiklikleri
- İzin değişiklikleri
- Başarısız erişim girişimleri
- Yapılandırma değişiklikleri

Denetim günlüğünü **Ayarlar > Denetim Günlüğü** bölümünden görüntüleyin. Günlükler varsayılan olarak 90 gün saklanır.

## SSS

**S: Önceden tanımlı rolleri değiştirebilir miyim?**
C: Hayır. Önceden tanımlı roller, tutarlı bir temel sağlamak için salt okunurdur. Farklı izinlere ihtiyacınız varsa özel bir rol oluşturun.

**S: Kullanıcıları atanmış bir rolü silersem ne olur?**
C: Özel bir rolü silmeden önce tüm kullanıcıları farklı bir role atamanız gerekir. Kullanıcılar hala atanmışsa sistem silmeyi engelleyecektir.

**S: Roller birden fazla prob arasında senkronize edilir mi?**
C: Roller prob başına tanımlanır. Birden fazla prob yönetiyorsanız rolleri her birinde yapılandırmanız gerekir. Merkezi rol yönetimi gelecekteki bir güncellemeyle desteklenecektir.

**S: Bir kullanıcıyı belirli alt ağlar veya cihazlarla sınırlandırabilir miyim?**
C: Şu anda roller özellik erişimini kontrol eder, veri düzeyinde erişimi değil. Alt ağ düzeyinde kısıtlamalar yol haritasındadır.

Ek yardım için [support@netreconapp.com](mailto:support@netreconapp.com) adresine başvurun.
