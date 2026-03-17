---
sidebar_position: 2
title: Hızlı Başlangıç
description: Kutudan çıkarıp ilk ağ taramanıza 10 dakikada ulaşın
---

# Hızlı Başlangıç Kılavuzu

Sıfırdan ilk ağ taramanıza 10 dakikadan kısa sürede ulaşın. Bu kılavuz, NetRecon OS imajını depolama cihazınıza yazdığınızı varsayar.

## İhtiyacınız Olanlar

- NetRecon OS kurulu bir prob cihazı (bkz. [Kurulum](./installation.md))
- Ağınıza bağlı bir Ethernet kablosu
- Aynı ağdaki bir akıllı telefon veya bilgisayar
- NetRecon Scanner uygulaması (isteğe bağlı, mobil tarama için)

## 0-2. Dakika: Prob'u Başlatın

1. Hazırlanmış microSD kartı takın veya dahili depolamadan başlatın
2. Ethernet kablosunu ağ anahtarınıza veya yönlendiricinize bağlayın
3. Cihazı açın
4. Yeşil durum LED'inin sabit yanmasını bekleyin (yaklaşık 60 saniye)

## 2-5. Dakika: Kurulum Sihirbazını Tamamlayın

1. Yönlendiricinizin DHCP tablosundan prob'unuzun IP adresini bulun veya konsol çıktısını kontrol edin
2. Tarayıcınızda `http://<prob-ip>:8080` adresini açın
3. Bu temel sihirbaz adımlarını tamamlayın:
   - **Yönetici parolası belirleyin** — güçlü bir parola seçin
   - **Ağ arayüzlerini atayın** — tarama ağınıza bağlı portu seçin
   - **Tarama modunu seçin** — temel kurulum için "Tek Arayüz" seçin
   - **Cloudflare Tunnel yapılandırın** (isteğe bağlı) — `https://probe.netreconapp.com` üzerinden uzaktan erişimi etkinleştirir
4. **Kurulumu Tamamla**'ya tıklayın

## 5-7. Dakika: Prob Kontrol Panelini Doğrulayın

1. Sihirbaz tamamlandıktan sonra `http://<prob-ip>:3000` adresine gidin
2. Oluşturduğunuz yönetici bilgileriyle giriş yapın
3. Kontrol panelinde şunları doğrulayın:
   - Sistem sağlığı: İşlemci, bellek, depolama kullanımı
   - Ağ arayüzleri: en az bir arayüz "tarama" rolünde
   - Hizmetler: çekirdek hizmetler yeşil durumda olmalı

## 7-10. Dakika: İlk Taramanızı Çalıştırın

### Seçenek A: Prob Kontrol Panelinden

1. **Tarama > Taramayı Başlat** bölümüne gidin
2. Hedef alt ağı seçin (tarama arayüzünüzden otomatik tespit edilir)
3. **Hızlı** tarama profilini seçin
4. **Başlat**'a tıklayın
5. Cihazların kontrol panelinde gerçek zamanlı olarak belirmesini izleyin

### Seçenek B: NetRecon Scanner Uygulamasından

1. Android cihazınızda NetRecon Scanner uygulamasını açın
2. Aynı ağdaysanız uygulama prob'u mDNS aracılığıyla tespit edecektir
3. Alternatif olarak, **Ayarlar > Prob Bağlantısı**'na gidin ve prob IP'sini girin
4. Ana ekranda **Tara**'ya dokunun
5. Ağınızı seçin ve **Taramayı Başlat**'a dokunun

## Tarama Sırasında Ne Olur

1. **ARP Keşfi** — prob, alt ağdaki tüm aktif ana bilgisayarları bulmak için ARP istekleri gönderir
2. **Port Taraması** — keşfedilen her ana bilgisayar açık TCP portları için taranır
3. **Hizmet Tespiti** — açık portlar, çalışan hizmet ve sürümü belirlemek için araştırılır
4. **Cihaz Profilleme** — prob, cihaz türünü belirlemek için MAC adresi OUI araması, açık portlar ve hizmet banner'larını birleştirir

## Sonraki Adımlar

İlk taramanızı tamamladığınıza göre şu özellikleri keşfedin:

- [Tarama Profilleri](../scanner/scan-profiles.md) — tarama derinliğini ve hızını özelleştirin
- [Raporlar](../scanner/reports.md) — tarama sonuçlarınızdan PDF raporları oluşturun
- [Admin Connect](../admin-connect/overview.md) — uzaktan yönetimi ayarlayın
- [Ajan Dağıtımı](../agents/overview.md) — uç noktalarınıza ajan dağıtın

## SSS

**S: Tarama beklenenden daha az cihaz buldu. Neden?**
C: Prob'un doğru VLAN/alt ağda olduğundan emin olun. Güvenlik duvarları veya istemci tarafı güvenlik duvarları ARP yanıtlarını engelleyebilir. Daha kapsamlı keşif için **Hızlı** yerine **Standart** profili çalıştırmayı deneyin.

**S: Birden fazla alt ağ tarayabilir miyim?**
C: Evet. Prob kontrol panelindeki **Ayarlar > Tarama Hedefleri** bölümünden ek alt ağlar yapılandırın. Çoklu alt ağ taraması, uygun yönlendirme veya birden fazla ağ arayüzü gerektirir.

**S: Bir tarama ne kadar sürer?**
C: Bir /24 alt ağın Hızlı taraması genellikle 2 dakikadan kısa sürede tamamlanır. Standart 5-10 dakika sürer. Derin taramalar, ana bilgisayar ve taranan port sayısına bağlı olarak 15-30 dakika sürebilir.

Ek yardım için [support@netreconapp.com](mailto:support@netreconapp.com) adresine başvurun.
