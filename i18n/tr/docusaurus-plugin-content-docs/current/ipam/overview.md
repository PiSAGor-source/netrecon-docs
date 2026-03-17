---
sidebar_position: 1
title: IPAM Genel Bakış
description: Alt ağ takibi ve kullanım izleme ile IP Adres Yönetimi
---

# IPAM — IP Adres Yönetimi

NetRecon IPAM, merkezi IP adresi takibi ve alt ağ yönetimi sağlar. Alt ağ kullanımını izleyin, IP atamalarını takip edin ve ağ adres alanınızın doğru bir envanterini tutun.

## Temel Özellikler

- **Alt Ağ Yönetimi** — tam CIDR gösterimi desteğiyle alt ağları tanımlayın ve düzenleyin
- **IP Takibi** — durum ve meta verilerle bireysel IP atamalarını takip edin
- **Kullanım İzleme** — gerçek zamanlı alt ağ kullanım yüzdeleri ve uyarılar
- **Tarama Entegrasyonu** — keşfedilen IP'leri doğrudan tarama sonuçlarından içe aktarın
- **Çakışma Tespiti** — yinelenen IP adreslerini ve örtüşen alt ağları belirleyin
- **OUI Senkronizasyonu** — MAC adreslerini otomatik olarak üretici verileriyle ilişkilendirin
- **Geçmiş** — IP atama değişikliklerini zaman içinde takip edin
- **Dışa Aktarma** — IP verilerini CSV veya JSON olarak dışa aktarın

## Mimari

IPAM, prob üzerinde PostgreSQL arka ucuyla özel bir hizmet olarak çalışır (port 8009):

```
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│  Dashboard   │  HTTP  │    IPAM      │  SQL   │  PostgreSQL  │
│  (Browser)   ├────────►  Service     ├────────►  Database    │
│              │        │   :8009      │        │              │
└──────────────┘        └──────┬───────┘        └──────────────┘
                               │
                        ┌──────▼───────┐
                        │ Scan Engine  │
                        │ (IP import)  │
                        └──────────────┘
```

## Kavramlar

### Alt Ağlar

Alt ağ, CIDR gösterimi ile tanımlanan bir IP adresi aralığını temsil eder (örn. `192.168.1.0/24`). Her alt ağ şunlara sahiptir:

| Alan | Açıklama |
|---|---|
| CIDR | CIDR gösteriminde ağ adresi |
| Ad | Kolay tanınabilir ad (örn. "Ofis LAN") |
| VLAN | İlişkili VLAN ID (isteğe bağlı) |
| Ağ Geçidi | Varsayılan ağ geçidi IP'si |
| DNS | Bu alt ağ için DNS sunucuları |
| Açıklama | Serbest metin açıklaması |
| Konum | Fiziksel veya mantıksal konum |

### IP Adresleri

Alt ağ içindeki her IP adresi şunlarla takip edilebilir:

| Alan | Açıklama |
|---|---|
| IP Adresi | IPv4 veya IPv6 adresi |
| Durum | Kullanılabilir, Atanmış, Ayrılmış, DHCP |
| Ana Bilgisayar Adı | Cihaz ana bilgisayar adı |
| MAC Adresi | İlişkili MAC adresi |
| Üretici | OUI veritabanından otomatik doldurulur |
| Sahip | Atanmış kullanıcı veya departman |
| Son Görülme | Son ağ etkinliği zaman damgası |
| Notlar | Serbest metin notları |

### Kullanım

Alt ağ kullanımı şu şekilde hesaplanır:

```
Kullanım = (Atanmış + Ayrılmış + DHCP) / Toplam Kullanılabilir IP * 100%
```

Kullanım bir eşiği aştığında uyarılar yapılandırılabilir (varsayılan: %80).

## Başlangıç

### Adım 1: Alt Ağ Oluşturma

1. Prob kontrol panelinde **IPAM > Alt Ağlar** bölümüne gidin
2. **Alt Ağ Ekle**'ye tıklayın
3. CIDR'yi girin (örn. `10.0.1.0/24`)
4. İsteğe bağlı alanları doldurun (ad, VLAN, ağ geçidi vb.)
5. **Kaydet**'e tıklayın

### Adım 2: Taramadan IP'leri İçe Aktarma

IPAM'ı doldurmanın en hızlı yolu tamamlanmış bir taramadan içe aktarmaktır:

1. **IPAM > Alt Ağlar** bölümüne gidin
2. Alt ağınızı seçin
3. **Taramadan İçe Aktar**'a tıklayın
4. İçe aktarılacak tarama sonucunu seçin
5. İçe aktarılacak IP'leri gözden geçirin
6. **İçe Aktar**'a tıklayın

Ayrıntılı talimatlar için [Taramadan İçe Aktarma](./import-from-scan.md) sayfasına bakın.

### Adım 3: IP Atamalarını Yönetme

1. IP adreslerini görüntülemek için bir alt ağa tıklayın
2. Detaylarını görüntülemek/düzenlemek için bir IP'ye tıklayın
3. Durumu değiştirin, not ekleyin, bir sahibe atayın
4. **Kaydet**'e tıklayın

### Adım 4: Kullanımı İzleme

1. **IPAM > Kontrol Paneli** bölümüne gidin
2. Alt ağ kullanım grafiklerini görüntüleyin
3. Yüksek kullanım uyarılarını **IPAM > Ayarlar > Uyarılar** altından yapılandırın

## Alt Ağ Organizasyonu

Alt ağlar hiyerarşik olarak düzenlenebilir:

```
10.0.0.0/16          (Kurumsal Ağ)
├── 10.0.1.0/24      (Merkez - Ofis LAN)
├── 10.0.2.0/24      (Merkez - Sunucu VLAN)
├── 10.0.3.0/24      (Merkez - Wi-Fi)
├── 10.0.10.0/24     (Şube 1 - Ofis)
├── 10.0.11.0/24     (Şube 1 - Sunucular)
└── 10.0.20.0/24     (Şube 2 - Ofis)
```

Üst/alt ilişkiler CIDR kapsama göre otomatik olarak kurulur.

## IPv6 Desteği

IPAM hem IPv4 hem de IPv6 adreslerini destekler:
- IPv6 alt ağları için tam CIDR gösterimi
- IPv4 ile aynı alanlarla IPv6 adres takibi
- Çift yığın cihazlar her iki adresi birbirine bağlı olarak gösterir

## SSS

**S: Bir CSV dosyasından alt ağları içe aktarabilir miyim?**
C: Evet. **IPAM > İçe Aktar** bölümüne gidin ve şu sütunlarla bir CSV dosyası yükleyin: CIDR, Ad, VLAN, Ağ Geçidi, Açıklama. İçe aktarma sayfasında indirilebilir bir şablon CSV mevcuttur.

**S: Kullanım verileri ne sıklıkla güncellenir?**
C: Kullanım, bir IP durumu her değiştiğinde ve zamanlanmış olarak (varsayılan olarak her 5 dakikada) yeniden hesaplanır.

**S: IPAM, DHCP sunucularıyla entegre oluyor mu?**
C: IPAM, dinamik olarak atanan IP'leri takip etmek için DHCP kira verilerini içe aktarabilir. DHCP sunucu bağlantısını **IPAM > Ayarlar > DHCP Entegrasyonu** altından yapılandırın.

**S: Birden fazla kullanıcı IPAM verilerini aynı anda düzenleyebilir mi?**
C: Evet. IPAM, çakışmaları önlemek için iyimser kilitleme kullanır. İki kullanıcı aynı IP adresini düzenlerse, ikinci kaydetme birleştirme veya üzerine yazma seçeneğiyle bir çakışma uyarısı gösterecektir.

Ek yardım için [support@netreconapp.com](mailto:support@netreconapp.com) adresine başvurun.
