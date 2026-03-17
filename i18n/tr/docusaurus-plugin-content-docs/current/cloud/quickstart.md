---
sidebar_position: 1
title: Hızlı Başlangıç
description: NetRecon Cloud ile dakikalar içinde başlayın
---

# Bulut Hızlı Başlangıç

NetRecon Cloud, başlamanın en hızlı yoludur. Sunucu kurulumu yok, Docker yok — sadece kaydolun, bir prob dağıtın ve ağınızı keşfetmeye başlayın.

## Adım 1: Hesabınızı Oluşturun

1. [app.netreconapp.com](https://app.netreconapp.com) adresine gidin ve **Kaydol**'a tıklayın
2. E-posta adresinizi, şirket adınızı ve parolanızı girin
3. E-posta adresinizi doğrulayın
4. NetRecon Kontrol Paneli'ne giriş yapın

## Adım 2: İlk Sitenizi Ekleyin

1. Kontrol Paneli'nde kenar çubuğundaki **Siteler**'e gidin
2. **Site Ekle**'ye tıklayın
3. Site için bir ad ve adres girin (örn. "Ana Ofis — İstanbul")
4. Siteyi kaydedin

## Adım 3: Bir Prob Dağıtın

Her site, ağ keşfi ve izleme için en az bir prob'a ihtiyaç duyar.

### Seçenek A: NetRecon OS (Önerilen)

1. **Siteler → [Siteniz] → Prob'lar → Prob Ekle** bölümüne gidin
2. **NetRecon OS**'u seçin ve donanımınız için imajı indirin
3. İmajı [balenaEtcher](https://etcher.balena.io/) kullanarak bir SD karta veya SSD'ye yazın
4. Prob'u Ethernet kablosuyla ağınıza bağlayın
5. Cihazı açın — prob, Cloudflare Tunnel aracılığıyla bulut hesabınıza otomatik olarak bağlanacaktır

### Seçenek B: Mevcut Sunucuda Docker

```bash
# Prob konteynerini çekin ve çalıştırın
docker run -d \
  --name netrecon-probe \
  --network host \
  --restart unless-stopped \
  -e ENROLLMENT_TOKEN="your-token-from-dashboard" \
  netrecon/probe:latest
```

Kayıt jetonunu **Siteler → [Siteniz] → Prob'lar → Prob Ekle → Docker** bölümünden alın.

### Seçenek C: Sanal Makine

1. Kontrol Paneli'nden OVA dosyasını indirin
2. VMware, Proxmox veya Hyper-V'ye aktarın
3. VM'i **köprü ağı** ile yapılandırın (Katman 2 taraması için gereklidir)
4. VM'i başlatın — Kontrol Paneli'nde otomatik olarak görünecektir

## Adım 4: Taramaya Başlayın

Prob çevrimiçi olduğunda:

1. **Siteler → [Siteniz] → Cihazlar** bölümüne gidin
2. **Şimdi Tara**'ya tıklayın veya otomatik keşfi bekleyin (her 15 dakikada bir çalışır)
3. Keşfedilen cihazlar cihaz envanterinde görünecektir

## Adım 5: Mobil Uygulamayı Kurun

Mobil ağ taraması için Google Play Store'dan **NetRecon Scanner**'ı indirin:

- Telefonunuzun bağlı olduğu herhangi bir ağı tarayın
- Sonuçlar otomatik olarak bulut kontrol panelinize senkronize edilir
- Detaylar için [Tarayıcı Genel Bakış](../scanner/overview) sayfasına bakın

## Sırada Ne Var?

- Daha derin görünürlük için uç noktalara **ajan dağıtın** → [Ajan Kurulumu](../agents/overview)
- Yeni cihazlar, zafiyetler veya kesintiler için **uyarılar ayarlayın**
- Mevcut araçlarınızla (LDAP, SIEM, Jira, ServiceNow) **entegrasyonları yapılandırın**
- **Ekibinizi davet edin**: **Ayarlar → Ekip Yönetimi**

## Bulut ve Kendi Sunucunuz Karşılaştırması

| Özellik | Bulut | Kendi Sunucunuz |
|---|---|---|
| Sunucu yönetimi | NetRecon tarafından yönetilir | Siz yönetirsiniz |
| Veri konumu | NetRecon Cloud (AB) | Sizin altyapınız |
| Güncellemeler | Otomatik | Manuel (docker pull) |
| Cloudflare Tunnel | Dahil | Siz yapılandırırsınız |
| Fiyatlandırma | Abonelik | Lisans anahtarı |

Kendi sunucunuzda mı tercih ediyorsunuz? [Kurulum Kılavuzu](../self-hosting/installation)'na bakın.

Yardım için [support@netreconapp.com](mailto:support@netreconapp.com) adresine başvurun.
