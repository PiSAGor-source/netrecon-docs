---
sidebar_position: 1
title: CMod Genel Bakış
description: SSH ve seri konsol aracılığıyla ağ cihazı yapılandırma yönetimi
---

# CMod — Yapılandırma Yönetimi

CMod (Configuration Module), ağ cihazı yapılandırmalarını doğrudan NetRecon kontrol panelinden yönetmenize olanak tanır. Anahtarlara, yönlendiricilere, güvenlik duvarlarına ve diğer ağ cihazlarına SSH veya seri konsol aracılığıyla bağlanarak komut çalıştırabilir, şablon uygulayabilir ve yapılandırma değişikliklerini takip edebilirsiniz.

## Temel Özellikler

- **SSH Bağlantıları** — herhangi bir ağ cihazına SSH üzerinden bağlanın
- **Seri Konsol** — bant dışı erişim için USB-seri adaptör aracılığıyla cihazlara bağlanın
- **Komut Şablonları** — yaygın işlemler için önceden oluşturulmuş ve özel komut şablonları
- **Toplu İşlemler** — birden fazla cihazda aynı anda komut çalıştırın
- **Gerçek Zamanlı Terminal** — tarayıcınızda etkileşimli WebSocket tabanlı terminal
- **Yapılandırma Yedekleme** — çalışan yapılandırmaları otomatik kaydedin
- **Değişiklik Takibi** — zaman içindeki yapılandırma değişikliklerinin fark tabanlı takibi

## Mimari

CMod, prob üzerinde özel bir hizmet olarak çalışır (port 8008) ve sizin adınıza ağ cihazlarına bağlanır:

```
┌──────────┐    WebSocket     ┌──────────┐    SSH/Serial    ┌──────────────┐
│ Dashboard ├─────────────────► CMod     ├──────────────────► Network      │
│ (Browser) │                 │ Service  │                  │ Device       │
└──────────┘                  │ :8008    │                  │ (Switch/     │
                              └──────────┘                  │  Router/FW)  │
                                                            └──────────────┘
```

## Desteklenen Cihazlar

CMod, SSH veya seri konsol bağlantısı kabul eden herhangi bir cihazı destekler. Test edilmiş ve optimize edilmiş cihazlar:

| Üretici | Cihaz Türleri | SSH | Seri |
|---|---|---|---|
| Cisco | IOS, IOS-XE, NX-OS, ASA | Evet | Evet |
| Juniper | Junos | Evet | Evet |
| HP/Aruba | ProCurve, ArubaOS-Switch, ArubaOS-CX | Evet | Evet |
| MikroTik | RouterOS | Evet | Evet |
| Ubiquiti | EdgeOS, UniFi | Evet | Hayır |
| Fortinet | FortiOS | Evet | Evet |
| Palo Alto | PAN-OS | Evet | Evet |
| Linux | SSH etkin herhangi bir sistem | Evet | Evet |

## Başlangıç

### Adım 1: Cihaz Ekleme

1. Prob kontrol panelinde **CMod > Cihazlar** bölümüne gidin
2. **Cihaz Ekle**'ye tıklayın
3. Cihaz detaylarını girin:
   - **Ad**: kolay tanınabilir bir isim (örn. "Çekirdek Anahtar 1")
   - **IP Adresi**: cihazın yönetim IP'si
   - **Cihaz Türü**: üretici listesinden seçin
   - **Bağlantı Türü**: SSH veya Seri
4. Kimlik bilgilerini girin (prob'un yerel veritabanında şifreli olarak saklanır)
5. Bağlantıyı doğrulamak için **Kaydet ve Test Et**'e tıklayın

### Adım 2: Cihaza Bağlanma

1. CMod cihaz listesinde bir cihaza tıklayın
2. Etkileşimli oturum için **Terminal**'i veya önceden tanımlanmış komut seti için **Şablon Çalıştır**'ı seçin
3. Terminal, cihaza canlı bağlantıyla tarayıcınızda açılır

### Adım 3: Şablon Uygulama

1. Bir cihaz seçin ve **Şablon Çalıştır**'a tıklayın
2. Kütüphaneden bir şablon seçin (örn. "Çalışan Yapılandırmayı Göster", "Arayüzleri Göster")
3. Çalıştırılacak komutları gözden geçirin
4. **Çalıştır**'a tıklayın
5. Çıktıyı gerçek zamanlı olarak görüntüleyin

Ayrıntılı bağlantı kılavuzları için [SSH Modu](./ssh-mode.md) ve [Seri Mod](./serial-mode.md) sayfalarına bakın.

## Komut Şablonları

Şablonlar, cihaz türüne göre düzenlenmiş yeniden kullanılabilir komut setleridir:

### Yerleşik Şablonlar

| Şablon | Cisco IOS | Junos | ArubaOS | FortiOS |
|---|---|---|---|---|
| Çalışan yapılandırmayı göster | `show run` | `show config` | `show run` | `show full-config` |
| Arayüzleri göster | `show ip int brief` | `show int terse` | `show int brief` | `get system interface` |
| Yönlendirme tablosunu göster | `show ip route` | `show route` | `show ip route` | `get router info routing` |
| ARP tablosunu göster | `show arp` | `show arp` | `show arp` | `get system arp` |
| MAC tablosunu göster | `show mac add` | `show eth-switch table` | `show mac-address` | `get system arp` |
| Yapılandırmayı kaydet | `write memory` | `commit` | `write memory` | `execute backup config` |

### Özel Şablonlar

Kendi şablonlarınızı oluşturun:

1. **CMod > Şablonlar** bölümüne gidin
2. **Şablon Oluştur**'a tıklayın
3. Hedef cihaz türünü seçin
4. Komut dizisini girin (her satıra bir komut)
5. Dinamik değerler için değişkenler ekleyin (örn. `{{interface}}`, `{{vlan_id}}`)
6. Şablonu kaydedin

## SSS

**S: Cihaz kimlik bilgileri güvenli bir şekilde saklanıyor mu?**
C: Evet. Tüm kimlik bilgileri, prob'un yerel SQLite veritabanında AES-256 şifreleme ile durağan halde şifrelenir. Kimlik bilgileri asla düz metin olarak iletilmez.

**S: CMod'u prob olmadan kullanabilir miyim?**
C: Hayır. CMod, prob donanımı üzerinde bir hizmet olarak çalışır. Prob'un hedef cihazlarla aynı ağda olması (veya onlara yönlendirmesinin bulunması) gerekir.

**S: CMod SNMP destekler mi?**
C: CMod, CLI tabanlı yönetime (SSH ve seri) odaklanır. SNMP izleme, prob'un ağ izleme motoru tarafından yönetilir.

Ek yardım için [support@netreconapp.com](mailto:support@netreconapp.com) adresine başvurun.
