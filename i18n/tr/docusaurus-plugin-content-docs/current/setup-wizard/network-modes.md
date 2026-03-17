---
sidebar_position: 3
title: Ağ Modları
description: Tekli, Çift Tarama, Köprü ve TAP ağ modlarını anlama
---

# Ağ Modları

NetRecon, prob'un ağınıza nasıl bağlanacağını ve ağınızı nasıl izleyeceğini belirleyen dört ağ modunu destekler. Doğru modu seçmek donanımınıza, ağ topolojinize ve izleme hedeflerinize bağlıdır.

## Ön Koşullar

- Algılanmış ve rolü atanmış en az bir Ethernet arayüzü
- Ağ topolojinizi anlama (anahtar yapılandırması, VLAN'lar vb.)

## Mod Karşılaştırması

| Özellik | Tekli | Çift Tarama | Köprü | TAP |
|---|---|---|---|---|
| Minimum NIC | 1 | 2 | 2 | 2 |
| Aktif tarama | Evet | Evet | Evet | Hayır |
| Pasif izleme | Sınırlı | Sınırlı | Evet | Evet |
| Ağ kesintisi | Yok | Yok | Minimal | Yok |
| Çevrimiçi dağıtım | Hayır | Hayır | Evet | Hayır |
| En uygun | Küçük ağlar | Segmentli ağlar | Tam görünürlük | Üretim ağları |

## Tekli Arayüz Modu

En basit yapılandırma. Tek bir Ethernet portu her şeyi yönetir: tarama, yönetim ve internet erişimi.

```
┌─────────────────────────────────────────┐
│              Network Switch             │
│                                         │
│  Port 1    Port 2    Port 3    Port 4   │
│    │         │         │         │      │
│    │         │         │         │      │
└────┼─────────┼─────────┼─────────┼──────┘
     │         │         │         │
   Probe    PC/Server  PC/Server  Router
  (eth0)
```

**Nasıl çalışır:**
- Prob, normal bir anahtar portuna bağlanır
- ARP keşfi ve port taraması aynı arayüz üzerinden yapılır
- Yönetim kontrol paneli ve uzaktan erişim de bu arayüzü kullanır

**Ne zaman kullanılır:**
- Tek NIC'li bir cihazınız varsa (örn. USB adaptörsüz Raspberry Pi)
- Küçük ağlar (< 50 cihaz)
- Basitliğin tercih edildiği hızlı dağıtımlar

**Sınırlamalar:**
- Tarama trafiği yönetim trafiğiyle bant genişliğini paylaşır
- Diğer cihazlar arasındaki trafiği göremezsiniz (yalnızca prob'a gelen/giden trafik)

## Çift Tarama Modu

İki ayrı arayüz: biri taramaya, diğeri yönetim/bağlantıya ayrılmış.

```
┌─────────────────────────────────────────┐
│            Target Network Switch        │
│  Port 1    Port 2    Port 3    Port 4   │
│    │         │         │         │      │
└────┼─────────┼─────────┼─────────┼──────┘
     │         │         │         │
   Probe    PC/Server  PC/Server  │
  (eth0)                          │
                                  │
┌──────────────────────────────────┼──────┐
│         Management Switch        │      │
│  Port 1         Port 2         Port 3   │
│    │               │             │      │
└────┼───────────────┼─────────────┼──────┘
     │               │             │
   Probe          Admin PC       Router
  (eth1)
```

**Nasıl çalışır:**
- `eth0` (Tarama), keşif ve tarama için hedef ağa bağlanır
- `eth1` (Yönetim), kontrol paneli erişimi için yönetici ağınıza bağlanır

**Ne zaman kullanılır:**
- Tarama trafiğini yönetim trafiğinden ayırmak istiyorsanız
- Hedef ağ ve yönetim ağı farklı alt ağlarda/VLAN'larda ise
- Orange Pi R2S veya herhangi bir çift NIC'li cihaz

**Avantajlar:**
- Tarama ve yönetim trafiğinin temiz ayrımı
- Yoğun taramalar sırasında yönetim arayüzü yanıt vermeye devam eder
- Yönetim trafiği istemediğiniz bir ağı tarayabilirsiniz

## Köprü Modu

Prob, iki ağ segmenti arasında çevrimiçi olarak oturur, trafiği şeffaf şekilde iletirken geçen tüm paketleri inceler.

```
                    ┌──────────┐
                    │  Probe   │
                    │          │
                    │ eth0  eth1│
                    └──┬────┬──┘
                       │    │
          ┌────────────┘    └────────────┐
          │                              │
┌─────────┼──────────┐    ┌─────────────┼─────┐
│   Switch A         │    │       Switch B     │
│   (Upstream)       │    │    (Downstream)    │
│                    │    │                    │
│  Servers / Router  │    │   Workstations     │
└────────────────────┘    └────────────────────┘
```

**Nasıl çalışır:**
- Prob, `eth0` ve `eth1` arasını Katman 2'de köprüler
- İki segment arasındaki tüm trafik prob üzerinden geçer
- Prob, yönlendirme noktası olmadan her paketi inceler
- Aktif tarama köprü arayüzlerinden de yapılabilir

**Ne zaman kullanılır:**
- Tam trafik görünürlüğüne ihtiyacınız varsa (IDS, PCAP yakalama)
- Ağ segmentleri arasındaki trafiği izlemek istiyorsanız
- Çekirdek anahtar ile erişim anahtarı arasına dağıtım

**Dikkat edilecekler:**
- Prob, köprülenen yol için tek hata noktası olur
- NetRecon, arıza durumunda açık geçiş özelliği içerir: prob güç kaybederse, trafik donanım bypass aracılığıyla akmaya devam eder (desteklenen cihazlarda)
- Minimum gecikme ekler (tipik donanımda < 1ms)

## TAP Modu

Prob, bir TAP cihazından veya anahtar SPAN/ayna portundan ağ trafiğinin bir kopyasını alır. Tamamen pasif şekilde çalışır.

```
┌─────────────────────────────────────────┐
│              Network Switch             │
│                                         │
│  Port 1    Port 2    SPAN Port          │
│    │         │         │                │
└────┼─────────┼─────────┼────────────────┘
     │         │         │
   Server    Server    Probe
                      (eth0 — monitor)

                      (eth1 — management,
                       connected to admin network)
```

**Nasıl çalışır:**
- Anahtar, trafiğin bir kopyasını SPAN/ayna portuna gönderir
- Prob'un tarama arayüzü bu yansıtılmış trafiği promiscuous modda alır
- Tarama arayüzünden ağa geri paket gönderilmez
- Ayrı bir yönetim arayüzü kontrol paneli erişimi sağlar

**Ne zaman kullanılır:**
- Tarama trafiği enjekte etmenin kabul edilemediği üretim ağları
- Yalnızca pasif izleme gerektiren uyumluluk ortamları
- Aktif tarama olmadan IDS ve trafik analizi istediğinizde

**Anahtarınızı yapılandırma:**
- Cisco'da: `monitor session 1 source vlan 10` / `monitor session 1 destination interface Gi0/24`
- HP/Aruba'da: `mirror-port <port>`
- Juniper'da: `set forwarding-options port-mirroring input ingress interface <source>`

**Sınırlamalar:**
- TAP arayüzünden aktif tarama (ARP keşfi, port taraması) yapılamaz
- Cihaz keşfi tamamen gözlemlenen trafiğe bağlıdır
- Gözlem süresi boyunca trafik üretmeyen boşta cihazları kaçırabilirsiniz

## Kurulumdan Sonra Mod Değiştirme

Ağ modunu istediğiniz zaman prob kontrol panelinden değiştirebilirsiniz:

1. **Ayarlar > Ağ** bölümüne gidin
2. Yeni bir mod seçin
3. Gerekirse arayüz rollerini yeniden atayın
4. **Uygula**'ya tıklayın

:::warning
Ağ modlarını değiştirmek prob hizmetlerini kısa süreliğine kesintiye uğratır. Mod değişikliklerini bakım penceresi sırasında planlayın.
:::

## SSS

**S: İlk kurulum için hangi modu önerirsiniz?**
C: Basitlik için **Tekli Arayüz** moduyla başlayın. İhtiyaçlarınız geliştikçe daha sonra Çift Tarama veya Köprü moduna yükseltebilirsiniz.

**S: TAP modunu aktif taramayla birleştirebilir miyim?**
C: Evet, üç veya daha fazla arayüzünüz varsa. Birini TAP'a (pasif), birini aktif taramaya ve birini yönetime atayın.

**S: Köprü modu ağ performansını etkiler mi?**
C: Prob, köprü modunda 1ms'den az gecikme ekler. 2.5G portlu Orange Pi R2S'de, tipik kurumsal trafik yükleri için aktarım hızı hat hızında kalır.

Ek yardım için [support@netreconapp.com](mailto:support@netreconapp.com) adresine başvurun.
