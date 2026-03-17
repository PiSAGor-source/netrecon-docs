---
sidebar_position: 3
title: Gereksinimler
description: NetRecon için donanım, yazılım ve ağ gereksinimleri
---

# Gereksinimler

Bu sayfa, tüm NetRecon bileşenleri için minimum ve önerilen gereksinimleri detaylandırır.

## Prob Donanımı

### Desteklenen Platformlar

| Cihaz | Destek Seviyesi | Notlar |
|---|---|---|
| Orange Pi R2S (8 GB) | Birincil | Çift Ethernet, kompakt form faktörü |
| Raspberry Pi 4 (4/8 GB) | Birincil | Yaygın olarak bulunabilir, iyi performans |
| Raspberry Pi 5 (4/8 GB) | Birincil | En iyi ARM performansı |
| x86_64 Mini PC (Intel N100+) | Birincil | En iyi genel performans, birden fazla NIC |
| Diğer ARM64 SBC'ler | Gelişmiş | Manuel yapılandırma gerektirebilir |
| Sanal Makineler (VMware/Proxmox/Hyper-V) | Desteklenir | Köprü ağı gereklidir |

### Donanım Özellikleri

| Gereksinim | Minimum | Önerilen |
|---|---|---|
| Mimari | ARM64 veya x86_64 | ARM64 dört çekirdekli veya x86_64 |
| İşlemci çekirdekleri | 2 | 4+ |
| Bellek | 4 GB | 8 GB |
| Depolama | 16 GB (eMMC/SD/SSD) | 32 GB SSD |
| Ethernet portları | 1 | 2+ (köprü/TAP modu için) |
| USB | Gerekli değil | Seri konsol adaptörü için USB-A |
| Güç | 5V/3A (SBC) | PoE veya barrel jack |

### Depolama Hususları

- **16 GB** temel tarama ve izleme için yeterlidir
- PCAP yakalama, IDS günlüğü veya zafiyet taraması etkinleştirirseniz **32 GB+** önerilir
- PCAP dosyaları yoğun ağlarda hızla büyüyebilir; uzun süreli yakalama için harici depolama düşünün
- SQLite veritabanı, optimum yazma performansı için WAL modunu kullanır

## NetRecon Scanner Uygulaması (Android)

| Gereksinim | Detaylar |
|---|---|
| Android sürümü | 8.0 (API 26) veya üstü |
| Bellek | Minimum 2 GB |
| Depolama | Uygulama + veriler için 100 MB |
| Ağ | Hedef ağa bağlı Wi-Fi |
| Root erişimi | İsteğe bağlı (gelişmiş tarama modlarını etkinleştirir) |
| Shizuku | İsteğe bağlı (root olmadan bazı özellikleri etkinleştirir) |

## Admin Connect Uygulaması

| Gereksinim | Detaylar |
|---|---|
| Android sürümü | 8.0 (API 26) veya üstü |
| Bellek | Minimum 2 GB |
| Depolama | Uygulama + veriler için 80 MB |
| Ağ | İnternet bağlantısı (Cloudflare Tunnel üzerinden bağlanır) |

## Kendi Sunucunuzda Barındırma

| Gereksinim | Minimum | Önerilen |
|---|---|---|
| İşletim Sistemi | Ubuntu 22.04 LTS / Debian 12 | Ubuntu 24.04 LTS |
| İşlemci | 2 çekirdek | 4+ çekirdek |
| Bellek | 4 GB | 8 GB |
| Depolama | 40 GB | 100 GB SSD |
| Docker | v24.0+ | En son kararlı sürüm |
| Docker Compose | v2.20+ | En son kararlı sürüm |

Windows Server, Docker Desktop veya WSL2 ile de desteklenir.

## Ağ Gereksinimleri

### Prob Ağ Erişimi

| Yön | Port | Protokol | Amaç |
|---|---|---|---|
| Prob -> LAN | ARP | Katman 2 | Ana bilgisayar keşfi |
| Prob -> LAN | TCP (çeşitli) | Katman 4 | Port taraması |
| Prob -> LAN | UDP 5353 | mDNS | Hizmet keşfi |
| Prob -> İnternet | TCP 443 | HTTPS | Cloudflare Tunnel, güncellemeler |
| LAN -> Prob | TCP 3000 | HTTPS | Web kontrol paneli |
| LAN -> Prob | TCP 8080 | HTTP | Kurulum sihirbazı (yalnızca ilk açılış) |

### Güvenlik Duvarı Hususları

- Prob, Cloudflare Tunnel kullanılırken internetten **herhangi bir gelen port gerektirmez**
- Prob, tünel bağlantısı ve sistem güncellemeleri için **giden HTTPS (443)** erişimine ihtiyaç duyar
- Yerel ağ taraması için prob, hedef cihazlarla aynı Katman 2 segmentinde olmalıdır (veya bir SPAN/mirror port kullanın)

### Cloudflare Tunnel

Prob'a uzaktan erişim Cloudflare Tunnel aracılığıyla sağlanır. Bunun için gereklidir:
- Prob'da aktif bir internet bağlantısı
- Giden TCP 443 erişimi (gelen port gerekmez)
- Bir Cloudflare hesabı (ücretsiz plan yeterlidir)

## Tarayıcı Gereksinimleri (Web Kontrol Paneli)

| Tarayıcı | Minimum Sürüm |
|---|---|
| Google Chrome | 90+ |
| Mozilla Firefox | 90+ |
| Microsoft Edge | 90+ |
| Safari | 15+ |

JavaScript etkinleştirilmiş olmalıdır.

## SSS

**S: Prob'u Raspberry Pi 3'te çalıştırabilir miyim?**
C: Raspberry Pi 3'te yalnızca 1 GB RAM bulunur ve bu, minimum gereksinimin altındadır. Temel tarama için çalışabilir ancak desteklenmez.

**S: Prob internet erişimine ihtiyaç duyar mı?**
C: İnternet erişimi yalnızca Cloudflare Tunnel (uzaktan erişim) ve sistem güncellemeleri için gereklidir. Tüm tarama işlevleri internetsiz çalışır.

**S: Tarama için USB Wi-Fi adaptörü kullanabilir miyim?**
C: Wi-Fi ile tarama desteklenmez. Prob, güvenilir ve eksiksiz ağ keşfi için kablolu Ethernet gerektirir.

Ek yardım için [support@netreconapp.com](mailto:support@netreconapp.com) adresine başvurun.
