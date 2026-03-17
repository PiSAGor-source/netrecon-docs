---
sidebar_position: 1
title: Admin Connect Genel Bakış
description: NetRecon prob filosu yönetimi için mobil yönetim uygulaması
---

# Admin Connect

Admin Connect, NetRecon prob filonuzu kontrol etmek ve izlemek için mobil yönetim uygulamasıdır. Güvenli uzaktan erişim için Cloudflare Tunnel aracılığıyla prob'lara her yerden bağlanır.

## Temel Özellikler

- **Filo Yönetimi** — tek bir uygulamadan birden fazla prob'u yönetin
- **Uzaktan İzleme** — prob sağlığını, tarama sonuçlarını ve uyarıları gerçek zamanlı görüntüleyin
- **IDS Uyarıları** — Suricata IDS uyarılarını alın ve inceleyin
- **Zafiyet Taraması** — Nuclei zafiyet taramalarını tetikleyin ve inceleyin
- **PCAP Yakalama** — paket yakalamasını uzaktan başlatma/durdurma
- **Bal Küpü İzleme** — bal küpü isabetlerini ve saldırgan davranışını izleyin
- **Sahte Cihaz Tespiti** — sahte DHCP/ARP etkinliği için uyarılar alın
- **Ağ İzleyici** — ağınızdaki gecikme ve paket kaybını takip edin
- **WireGuard VPN** — prob'lara VPN bağlantılarını yönetin
- **Destek Talebi Entegrasyonu** — destek talepleri oluşturun ve yönetin
- **SSO/2FA** — tek oturum açma ve iki faktörlü kimlik doğrulama ile kurumsal kimlik doğrulama
- **Rol Tabanlı Erişim** — kullanıcı rolü başına ayrıntılı izinler

## Nasıl Çalışır

Admin Connect'in kendi tarama motoru **yoktur**. Tamamen NetRecon prob'ları için uzaktan yönetim arayüzüdür.

```
┌──────────────┐       HTTPS/WSS        ┌─────────────────┐
│ Admin Connect├───────────────────────►│ Cloudflare Tunnel│
│   (Mobil)    │   (via Cloudflare)      │                 │
└──────────────┘                         └────────┬────────┘
                                                  │
                                         ┌────────▼────────┐
                                         │  NetRecon Probe  │
                                         │  (REST + WS API) │
                                         └─────────────────┘
```

Admin Connect ile prob arasındaki tüm iletişim şu yollarla şifrelenir:
- REST API çağrıları için **HTTPS**
- Gerçek zamanlı olaylar için **WebSocket Secure (WSS)**
- Karşılıklı sertifika kimlik doğrulaması için **mTLS**

## Başlarken

1. Google Play Store'dan Admin Connect'i kurun (paket: `com.netreconapp.connect`)
2. Uygulamayı açın ve hesabınızı oluşturun veya SSO ile giriş yapın
3. Şu yöntemlerden biriyle bir prob ekleyin:
   - **QR Kodu** — prob'un kurulum sihirbazından veya kontrol panelinden QR kodunu tarayın
   - **Manuel** — prob'un tünel URL'sini ve kimlik doğrulama jetonunu girin
4. Prob, filo kontrol panelinizde görünecektir

Ayrıntılı kurulum talimatları için [Kayıt](./enrollment.md) sayfasına bakın.

## Gerçek Zamanlı Olaylar

Admin Connect, her prob'a kalıcı bir WebSocket bağlantısı sürdürür. Şunlar için anında bildirimler alırsınız:

| Olay | Açıklama |
|---|---|
| `ids_alert` | Suricata IDS bir kural tetikledi |
| `honeypot_hit` | Bir saldırgan bal küpüyle etkileşime geçti |
| `rogue_detected` | Sahte DHCP veya ARP aldatması tespit edildi |
| `vuln_found` | Zafiyet taraması bir sonuç buldu |
| `host_found` | Ağda yeni cihaz keşfedildi |
| `baseline_diff_alert` | Ağ temel çizgisi sapması tespit edildi |
| `probe_health_alert` | Prob işlemci, bellek veya disk eşiği aşıldı |
| `pcap_ready` | PCAP yakalama dosyası indirmeye hazır |
| `dns_threat` | DNS çukuru bir tehdidi engelledi |

## Desteklenen İşlemler

Admin Connect'ten uzaktan şunları yapabilirsiniz:

- Ağ taramalarını başlatma/durdurma
- Tarama sonuçlarını görüntüleme ve dışa aktarma
- PCAP yakalamayı başlatma/durdurma ve dosyaları indirme
- IDS izlemeyi etkinleştirme/devre dışı bırakma
- Zafiyet taramalarını tetikleme
- Bal küpünü yapılandırma ve yönetme
- Sahte DHCP/ARP tespitini ayarlama
- DNS çukuru kurallarını yapılandırma
- WireGuard VPN bağlantılarını yönetme
- Yedekleme anlık görüntüsü oluşturma
- Yedekten geri yükleme
- Sistem sağlığını ve kaynak kullanımını görüntüleme
- Kullanıcı hesaplarını ve rolleri yönetme

## SSS

**S: Admin Connect internet olmadan çalışabilir mi?**
C: Admin Connect, prob'a Cloudflare Tunnel aracılığıyla ulaşmak için internet erişimi gerektirir. Yerel ağ erişimi için doğrudan prob'un web kontrol panelini kullanın.

**S: Kaç prob yönetebilirim?**
C: Prob sayısında bir sınır yoktur. Admin Connect, kurumsal ölçekli filo yönetimini destekler.

**S: Admin Connect iOS için mevcut mu?**
C: iOS sürümü planlanmaktadır. Şu anda Admin Connect, Android için mevcuttur.

Ek yardım için [support@netreconapp.com](mailto:support@netreconapp.com) adresine başvurun.
