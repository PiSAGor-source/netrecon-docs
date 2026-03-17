---
sidebar_position: 2
title: Ağ Arayüzleri
description: Kurulum sihirbazında NIC rol atama ve sürücü kurtarma
---

# Ağ Arayüzleri

Kurulum sihirbazının Ağ Arayüzleri adımı, prob'unuzdaki tüm Ethernet portlarını algılar ve her birine bir rol atamanıza olanak tanır. Doğru arayüz ataması, güvenilir tarama ve yönetim erişimi için kritik öneme sahiptir.

## Ön Koşullar

- Sihirbazı başlatmadan önce en az bir Ethernet kablosunun bağlı olması
- Çoklu NIC kurulumları için, hangi portun nereye bağlandığını bilmek amacıyla takılmadan önce kablolarınızı etiketleyin

## Arayüz Algılama

Sihirbazın 4. adımına ulaştığınızda sistem mevcut tüm ağ arayüzlerini tarar ve şunları görüntüler:

- **Arayüz adı** (örn. `eth0`, `eth1`, `enp1s0`)
- **MAC adresi**
- **Bağlantı durumu** (bağlı / bağlı değil)
- **Hız** (örn. 1 Gbps, 2.5 Gbps)
- **Sürücü** (örn. `r8169`, `r8152`)

## Arayüz Rolleri

Algılanan her arayüze aşağıdaki rollerden biri atanabilir:

### Tarama

Ağ keşfi için birincil rol. Bu arayüz ARP istekleri gönderir, port taramaları yapar ve trafik yakalar. İzlemek istediğiniz ağ segmentine bağlı olmalıdır.

**En iyi uygulama:** Pasif izleme için anahtarınızdaki bir erişim portuna veya SPAN/ayna portuna bağlayın.

### Yönetim

Prob kontrol paneline erişim, uzaktan bağlantılar ve sistem güncellemeleri için kullanılır. Bu arayüzün güvenilir bağlantıya sahip olması gerekir.

**En iyi uygulama:** Adresi değişmesin diye yönetim arayüzüne statik IP atayın.

### Bağlantı

İnternet ağ geçidinize bağlı arayüz. Cloudflare Tunnel, sistem güncellemeleri ve harici bağlantı için kullanılır. Birçok kurulumda yönetim ve bağlantı rolleri aynı arayüzü paylaşabilir.

### Kullanılmıyor

"Kullanılmıyor" olarak ayarlanan arayüzler devre dışı bırakılır ve herhangi bir ağ etkinliğine katılmaz.

## Rol Atama Örnekleri

### Orange Pi R2S (2 port)

```
eth0 (2.5G) → Tarama     — hedef ağ anahtarına bağlı
eth1 (1G)   → Yönetim    — yönetici VLAN'ınıza bağlı
```

### Raspberry Pi 4 (1 dahili port + USB adaptör)

```
eth0        → Tarama     — dahili port, hedef ağa bağlı
eth1 (USB)  → Yönetim    — USB Ethernet adaptörü, yönetici ağına bağlı
```

### x86_64 Mini PC (4 port)

```
eth0  → Tarama     — hedef VLAN 1'e bağlı
eth1  → Tarama     — hedef VLAN 2'ye bağlı
eth2  → Yönetim    — yönetici ağına bağlı
eth3  → Bağlantı   — internet ağ geçidine bağlı
```

## Sürücü Kurtarma

Bir arayüz algılandı ancak "Sürücü Yok" veya "Sürücü Hatası" gösteriyorsa, sihirbaz bir sürücü kurtarma özelliği içerir:

1. Sihirbaz, uyumlu sürücüler için yerleşik sürücü veritabanını kontrol eder
2. Eşleşme bulunursa, yüklemek için **Sürücü Yükle**'ye tıklayın
3. Sürücü kurulumundan sonra arayüz tam detaylarla görünecektir
4. Eşleşen sürücü bulunamazsa, sihirbazı tamamladıktan sonra manuel olarak yüklemeniz gerekebilir

:::tip
En yaygın sürücü sorunu Realtek USB Ethernet adaptörlerinde (`r8152`) oluşur. NetRecon OS, en popüler adaptörler için sürücüleri kutudan çıktığı haliyle içerir.
:::

## Arayüz Tanımlama

Hangi fiziksel portun hangi arayüz adına karşılık geldiğinden emin değilseniz:

1. Sihirbazda arayüzün yanındaki **Tanımla** butonuna tıklayın
2. Prob, o porttaki bağlantı LED'ini 10 saniye boyunca yanıp söndürecektir
3. Hangi portun yanıp söndüğünü görmek için prob cihazınıza bakın

Alternatif olarak, kabloları tek tek takıp çıkarabilir ve sihirbazda bağlantı durumunun değişimini gözlemleyebilirsiniz.

## VLAN Desteği

Ağınız VLAN kullanıyorsa, herhangi bir arayüzde VLAN etiketleme yapılandırabilirsiniz:

1. Arayüzü seçin
2. **VLAN Etiketleme**'yi etkinleştirin
3. VLAN ID'sini girin (1-4094)
4. Prob, o VLAN için sanal bir arayüz oluşturacaktır (örn. `eth0.100`)

Bu, bir trunk porta bağlı tek bir fiziksel arayüzden birden fazla VLAN'ı taramak için kullanışlıdır.

## SSS

**S: Bir arayüze birden fazla rol atayabilir miyim?**
C: Tekli Arayüz modunda tarama ve yönetim rolleri tek bir portu paylaşır. Diğer modlarda her arayüzün tek bir özel rolü olmalıdır.

**S: USB Ethernet adaptörüm algılanmıyor. Ne yapmalıyım?**
C: Farklı bir USB port deneyin. Adaptör hala algılanmıyorsa uyumlu olmayabilir. Desteklenen yonga setleri: Realtek RTL8153, RTL8152, ASIX AX88179 ve Intel I225.

**S: Sihirbazdan sonra arayüz rollerini değiştirebilir miyim?**
C: Evet. Arayüz rollerini istediğiniz zaman yeniden atamak için prob kontrol panelinde **Ayarlar > Ağ** bölümüne gidin.

Ek yardım için [support@netreconapp.com](mailto:support@netreconapp.com) adresine başvurun.
