---
slug: /
sidebar_position: 1
title: NetRecon'a Başlangıç
description: MSP'ler ve BT ekipleri için ağ istihbarat platformu
---

# NetRecon'a Başlangıç

NetRecon, MSP'ler ve BT ekipleri için tasarlanmış bir ağ istihbarat platformudur. Otomatik ağ keşfi, cihaz envanteri, zafiyet taraması, yapılandırma yönetimi ve gerçek zamanlı izleme sunar — tümüne merkezi bir kontrol paneli, mobil uygulamalar ve REST API üzerinden erişilebilir.

## Dağıtım Yönteminizi Seçin

<div className="row" style={{marginTop: '1.5rem'}}>

<div className="col col--6" style={{marginBottom: '1rem'}}>

### Kendi Sunucunuzda (Self-Hosted)

NetRecon'u Docker Compose kullanarak kendi altyapınıza dağıtın. Verileriniz üzerinde tam kontrol, harici bağımlılık yok.

- [Sistem Gereksinimleri](self-hosting/requirements)
- [Kurulum Kılavuzu](self-hosting/installation)
- [Yapılandırma Referansı](self-hosting/configuration)

**En uygun:** Katı veri egemenliği gereksinimleri olan kuruluşlar, izole ağlar veya mevcut sunucu altyapısı olanlar için.

</div>

<div className="col col--6" style={{marginBottom: '1rem'}}>

### Bulut (SaaS)

NetRecon Cloud ile anında başlayın. Sunucu kurulumu gerekmez — sadece prob'ları dağıtın ve taramaya başlayın.

- [Hızlı Başlangıç Kılavuzu](cloud/quickstart)

**En uygun:** Sunucu altyapısı yönetmeden hızlıca çalışmaya başlamak isteyen ekipler için.

</div>

</div>

## Platform Bileşenleri

| Bileşen | Açıklama |
|---|---|
| **Kontrol Paneli** | Tüm NetRecon özellikleri için web tabanlı yönetim paneli |
| **NetRecon Scanner** | Mobil ağ taraması için Android uygulaması ([Daha fazla bilgi](scanner/overview)) |
| **Admin Connect** | Uzaktan yönetim için Android yönetim uygulaması ([Daha fazla bilgi](admin-connect/overview)) |
| **Ajanlar** | Windows, macOS ve Linux uç noktaları için hafif ajanlar ([Kurulum](agents/overview)) |
| **Prob'lar** | Sürekli izleme için donanım veya VM tabanlı ağ sensörleri |
| **API** | Otomasyon ve entegrasyon için RESTful API ([API Referansı](api/overview)) |

## Yardıma mı İhtiyacınız Var?

- Kenar çubuğunu kullanarak dokümantasyona göz atın
- Entegrasyon detayları için [API Referansı](api/overview)'nı inceleyin
- Yardım için [support@netreconapp.com](mailto:support@netreconapp.com) adresine başvurun
