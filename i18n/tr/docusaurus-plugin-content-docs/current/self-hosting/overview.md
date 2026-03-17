---
sidebar_position: 1
title: Kendi Sunucunuzda Barındırma Genel Bakış
description: NetRecon platformunu kendi altyapınızda çalıştırın
---

# Kendi Sunucunuzda Barındırma

NetRecon, kendi altyapınızda tamamen barındırılabilir; verileriniz, güvenliğiniz ve dağıtımınız üzerinde tam kontrol sağlar.

## Neden Kendi Sunucunuzda Barındırmalısınız?

| Avantaj | Açıklama |
|---|---|
| **Veri Egemenliği** | Tüm tarama sonuçları, yapılandırmalar ve günlükler sunucularınızda kalır |
| **Uyumluluk** | Şirket içi veri depolama gerektiren düzenleyici gereksinimleri karşılayın |
| **Ağ İzolasyonu** | İnternet bağımlılığı olmadan izole ortamlarda çalıştırın |
| **Özel Entegrasyon** | Özel raporlama ve entegrasyon için doğrudan veritabanı erişimi |
| **Maliyet Kontrolü** | Sunucu altyapısı için prob başına lisanslama yok |

## Mimari

Kendi sunucunuzda barındırılan bir NetRecon dağıtımı, Docker konteynerlerinde çalışan birden fazla mikro hizmetten oluşur:

```
┌────────────────────────────────────────────────────────┐
│                    Docker Host                         │
│                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │ API Gateway  │  │ Vault Server │  │  License     ││
│  │   :8000      │  │   :8001      │  │  Server :8002││
│  └──────────────┘  └──────────────┘  └──────────────┘│
│                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │ Email        │  │ Notification │  │  Update      ││
│  │ Service :8003│  │ Service :8004│  │  Server :8005││
│  └──────────────┘  └──────────────┘  └──────────────┘│
│                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │ Agent        │  │ Warranty     │  │  CMod        ││
│  │ Registry:8006│  │ Service :8007│  │  Service:8008││
│  └──────────────┘  └──────────────┘  └──────────────┘│
│                                                        │
│  ┌──────────────┐  ┌──────────────┐                   │
│  │ IPAM         │  │ PostgreSQL   │                   │
│  │ Service :8009│  │   :5432      │                   │
│  └──────────────┘  └──────────────┘                   │
│                                                        │
│  ┌──────────────┐  ┌──────────────┐                   │
│  │ Redis        │  │ Nginx        │                   │
│  │   :6379      │  │ Reverse Proxy│                   │
│  └──────────────┘  └──────────────┘                   │
└────────────────────────────────────────────────────────┘
```

## Hizmet Genel Bakışı

| Hizmet | Port | Amaç |
|---|---|---|
| API Gateway | 8000 | Merkezi API yönlendirme, kimlik doğrulama |
| Vault Server | 8001 | Gizli bilgi yönetimi, kimlik bilgisi depolama |
| License Server | 8002 | Lisans doğrulama ve yönetimi |
| Email Service | 8003 | E-posta bildirimleri ve uyarılar |
| Notification Service | 8004 | Anlık bildirimler, webhook'lar |
| Update Server | 8005 | Prob ve ajan güncelleme dağıtımı |
| Agent Registry | 8006 | Ajan kaydı ve yönetimi |
| Warranty Service | 8007 | Donanım garanti takibi |
| CMod Service | 8008 | Ağ cihazı yapılandırma yönetimi |
| IPAM Service | 8009 | IP adres yönetimi |

## Dağıtım Seçenekleri

### Docker Compose (Önerilen)

Tüm hizmetleri dağıtmanın en basit yolu. Küçük ve orta ölçekli dağıtımlar için uygundur.

Adım adım talimatlar için [Kurulum Kılavuzu](./installation.md)'na bakın.

### Kubernetes

Yüksek erişilebilirlik ve yatay ölçekleme gerektiren büyük ölçekli dağıtımlar için. Her hizmet için Helm chart'ları mevcuttur.

### Tek İkili Dosya

Minimal dağıtımlar için tüm hizmetleri tek bir ikili dosyada paketler. Test veya çok küçük ortamlar için uygundur.

## Sistem Gereksinimleri

| Gereksinim | Minimum | Önerilen |
|---|---|---|
| İşletim Sistemi | Ubuntu 22.04 / Debian 12 | Ubuntu 24.04 LTS |
| İşlemci | 2 çekirdek | 4+ çekirdek |
| Bellek | 4 GB | 8 GB |
| Disk | 40 GB | 100 GB SSD |
| Docker | v24.0+ | En son kararlı sürüm |
| Docker Compose | v2.20+ | En son kararlı sürüm |

## Ağ

| Port | Protokol | Amaç |
|---|---|---|
| 443 | HTTPS | Web kontrol paneli ve API (ters proxy üzerinden) |
| 80 | HTTP | HTTPS'e yönlendirme |
| 5432 | TCP | PostgreSQL (dahili, dışarıya açık değil) |
| 6379 | TCP | Redis (dahili, dışarıya açık değil) |

Harici olarak yalnızca 80 ve 443 portlarının açılması gerekir. Tüm dahili hizmet portlarına yalnızca Docker ağı içinden erişilebilir.

## Veri Depolama

| Veri | Depolama | Yedekleme |
|---|---|---|
| PostgreSQL veritabanı | Docker volume | Günlük pg_dump |
| Yapılandırma dosyaları | Bind mount | Dosya yedekleme |
| Yüklenen dosyalar | Docker volume | Dosya yedekleme |
| Günlükler | Docker volume | Günlük rotasyonu |
| TLS sertifikaları | Bind mount | Güvenli yedekleme |

## Güvenlik

Kendi sunucunuzda barındırılan dağıtımlar tüm güvenlik özelliklerini içerir:

- Tüm harici iletişim için TLS şifreleme
- JWT tabanlı kimlik doğrulama
- Rol tabanlı erişim kontrolü
- Denetim günlüğü
- Steel Shield bütünlük doğrulaması (bkz. [Steel Shield](./steel-shield.md))

## SSS

**S: Docker olmadan kendi sunucumda çalıştırabilir miyim?**
C: Docker Compose, önerilen ve desteklenen dağıtım yöntemidir. Hizmetleri doğrudan ana bilgisayarda çalıştırmak mümkündür ancak resmi olarak desteklenmez.

**S: Prob'lar kendi sunucumdaki sunucuya nasıl bağlanır?**
C: Prob'ları varsayılan Cloudflare Tunnel uç noktası yerine sunucunuzun URL'sine yönlendirecek şekilde yapılandırın. Prob yapılandırmasındaki `server_url` değerini güncelleyin.

**S: Web kontrol paneli dahil mi?**
C: Evet. API Gateway, web kontrol panelini kök URL'de sunar. Yapılandırılmış alan adınız üzerinden erişin (örn. `https://netrecon.yourcompany.com`).

**S: Bunu izole bir ortamda çalıştırabilir miyim?**
C: Evet. Docker imajlarını önceden indirin ve izole sunucunuza aktarın. Lisans doğrulama, çevrimdışı mod için yapılandırılabilir.

Ek yardım için [support@netreconapp.com](mailto:support@netreconapp.com) adresine başvurun.
