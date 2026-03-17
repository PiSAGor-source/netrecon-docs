---
sidebar_position: 1
title: Tarayıcı Genel Bakış
description: NetRecon Scanner uygulaması — bağımsız Android ağ tarayıcı
---

# NetRecon Scanner

NetRecon Scanner, bağımsız bir Android ağ güvenlik denetim aracıdır. Prob gerektirmeden Android cihazınızda bağımsız olarak çalışır; saha çalışması, hızlı değerlendirmeler ve mobil ağ keşfi için idealdir.

## Temel Özellikler

- **ARP Keşfi** — ARP istekleri kullanarak yerel ağdaki tüm cihazları bulma
- **Port Taraması** — keşfedilen ana bilgisayarlardaki açık hizmetleri bulmak için TCP portlarını tarama
- **Hizmet Tespiti** — banner yakalama yoluyla çalışan hizmetleri ve sürümlerini belirleme
- **Cihaz Profilleme** — OUI araması, açık portlar ve hizmet imzalarını birleştirerek cihazları sınıflandırma
- **WiFi Isı Haritası** — fiziksel konumlardaki kablosuz sinyal gücünü görselleştirme
- **PDF Raporları** — profesyonel güvenlik denetim raporları oluşturma
- **SSH Terminali** — uygulamadan doğrudan cihazlara bağlanma
- **CVE İstihbaratı** — zafiyet araması için çevrimdışı CVE veritabanı
- **Saldırı Yüzeyi Haritası** — ağın maruziyetinin görsel temsili
- **Pasif İzleme** — yeni cihazlar için sürekli arka plan izlemesi
- **11 Dil** — tam yerelleştirme desteği

## Çalışma Modları

NetRecon Scanner, cihazınızın yeteneklerine bağlı olarak üç çalışma modunu destekler:

### Standart Mod
Özel izinler olmadan herhangi bir Android cihazda çalışır. Keşif ve tarama için standart Android ağ API'lerini kullanır.

### Shizuku Modu
Root olmadan yükseltilmiş ağ erişimi için [Shizuku](https://shizuku.rikka.app/) hizmetinden yararlanır. Daha hızlı ARP taraması ve ham soket erişimi sağlar.

### Root Modu
Tüm ağ yeteneklerine tam erişim. En hızlı tarama hızını, karışık mod yakalamayı ve ARP aldatma tespiti gibi gelişmiş özellikleri etkinleştirir.

| Özellik | Standart | Shizuku | Root |
|---|---|---|---|
| ARP keşfi | Yavaş | Hızlı | En hızlı |
| Port taraması | Evet | Evet | Evet |
| Ham soketler | Hayır | Evet | Evet |
| PCAP yakalama | Hayır | Sınırlı | Tam |
| Pasif izleme | Sınırlı | Evet | Evet |

## Tarama Türleri

### ARP Keşfi
Canlı ana bilgisayarları belirlemek için hedef alt ağdaki her IP'ye ARP istekleri gönderir. Yerel ağdaki cihazları keşfetmenin en hızlı ve güvenilir yöntemidir.

### TCP Port Taraması
Keşfedilen her ana bilgisayardaki belirtilen TCP portlarına bağlanır. Yapılandırılabilir port aralıklarını ve eşzamanlı bağlantı sınırlarını destekler.

### Hizmet Tespiti
Açık portları bulduktan sonra tarayıcı, çalışan hizmeti belirlemek için protokole özel prob'lar gönderir. HTTP, SSH, FTP, SMB, RDP, veritabanları ve daha fazlası dahil yüzlerce yaygın hizmeti tanır.

### Cihaz Profilleme
Bir cihazın ne olduğunu belirlemek için birden fazla veri kaynağını birleştirir:
- MAC adresi OUI (üretici) araması
- Açık port parmak izi eşleştirme
- Hizmet banner analizi
- mDNS/SSDP hizmet duyuruları

## Prob Entegrasyonu

Tarayıcı bağımsız çalışsa da gelişmiş yetenekler için bir NetRecon Prob'a da bağlanabilir:

- Yerel taramalarla birlikte prob tarama sonuçlarını görüntüleme
- Uygulamadan uzaktan tarama tetikleme
- Prob'dan IDS uyarılarına ve zafiyet verilerine erişim
- Raporlarda yerel ve prob verilerini birleştirme

Bir prob'a bağlanmak için **Ayarlar > Prob Bağlantısı**'na gidin ve prob'un IP adresini girin veya prob kontrol panelinden QR kodunu tarayın.

## Performans

Tarayıcı, mobil cihazlar için optimize edilmiştir:
- Maksimum 40 eşzamanlı soket bağlantısı (pil seviyesine göre uyarlanır)
- İşlemci yoğun profilleme, kullanıcı arayüzünü duyarlı tutmak için ayrı bir izolatta çalışır
- OUI veritabanı, LRU önbelleğiyle (500 giriş) tembel yüklenir
- Pil duyarlı tarama, pil düşük olduğunda eşzamanlılığı azaltır

## SSS

**S: Tarayıcı internet erişimi gerektirir mi?**
C: Hayır. Tüm tarama özellikleri çevrimdışı çalışır. İnternet yalnızca ilk CVE veritabanı indirmesi ve güncellemeleri için gereklidir.

**S: Bağlı olmadığım ağları tarayabilir miyim?**
C: Tarayıcı yalnızca Android cihazınızın Wi-Fi aracılığıyla bağlı olduğu ağdaki cihazları keşfedebilir. Uzak ağları taramak için bir prob kullanın.

**S: Cihaz profilleme ne kadar doğru?**
C: Cihaz profilleme, vakaların yaklaşık %85-90'ında cihaz türünü doğru tanımlar. Daha fazla port ve hizmet tespit edildiğinde doğruluk artar (Standart veya Derin tarama profili kullanın).

Ek yardım için [support@netreconapp.com](mailto:support@netreconapp.com) adresine başvurun.
