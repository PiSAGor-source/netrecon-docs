---
sidebar_position: 2
title: Taramadan İçe Aktarma
description: Tarama sonuçlarından keşfedilen IP'leri otomatik olarak IPAM'a aktarma
---

# Taramadan İçe Aktarma

IPAM, tarama sonuçlarından keşfedilen cihazları otomatik olarak içe aktarabilir, manuel veri girişini ortadan kaldırır ve IP envanterinizin güncel kalmasını sağlar.

## Ön Koşullar

- Sonuçları olan en az bir tamamlanmış ağ taraması
- Hedef alt ağın IPAM'da tanımlanmış olması (veya içe aktarma sırasında oluşturma isteği)
- Analist, Operatör, Yönetici veya Süper Yönetici rolü

## İçe Aktarma Nasıl Çalışır

Tarama sonuçlarını IPAM'a içe aktardığınızda:

1. Keşfedilen her IP adresi mevcut IPAM kayıtlarıyla karşılaştırılır
2. Yeni IP'ler "Atanmış" durumuyla oluşturulur
3. Mevcut IP'ler en son MAC adresi, ana bilgisayar adı ve "Son Görülme" zaman damgası ile güncellenir
4. Çakışmalar (örn. bir IP için MAC adresi değişmiş) inceleme için işaretlenir
5. Bir özet rapor neyin içe aktarıldığını ve neyin dikkat gerektirdiğini gösterir

## Adım Adım İçe Aktarma

### Adım 1: İçe Aktarma Penceresini Açma

**IPAM'dan:**
1. **IPAM > Alt Ağlar** bölümüne gidin
2. Hedef alt ağı seçin
3. **Taramadan İçe Aktar**'a tıklayın

**Tarama Sonuçlarından:**
1. **Tarama > Sonuçlar** bölümüne gidin
2. Tamamlanmış bir tarama seçin
3. **IPAM'a Aktar**'a tıklayın

### Adım 2: Taramayı Seçme

Hangi tarama sonuçlarının içe aktarılacağını seçin:

| Seçenek | Açıklama |
|---|---|
| Son tarama | En son taramadan içe aktar |
| Belirli tarama | Tarih/saate göre bir tarama seçin |
| Tüm taramalar (birleştir) | Birden fazla taramanın sonuçlarını birleştirin |

### Adım 3: İçe Aktarma Önizlemesini İnceleme

İçe aktarmadan önce önizleme tablosunu inceleyin:

| Sütun | Açıklama |
|---|---|
| IP Adresi | Keşfedilen IP |
| MAC Adresi | İlişkili MAC |
| Ana Bilgisayar Adı | Keşfedilen ana bilgisayar adı |
| Eylem | Yeni / Güncelle / Çakışma |
| Detaylar | Ne değişecek |

- **Yeni** — bu IP IPAM'da mevcut değil ve oluşturulacak
- **Güncelle** — bu IP mevcut ve yeni verilerle güncellenecek
- **Çakışma** — bu IP'de çakışan veriler var (aşağıdaki Çakışma Çözümüne bakın)

### Adım 4: Çakışmaları Çözme

Çakışmalar şu durumlarda oluşur:

- **MAC adresi uyuşmazlığı** — IP, IPAM'da taramanın bulduğundan farklı bir MAC adresiyle mevcut
- **Yinelenen MAC** — aynı MAC adresi birden fazla IP'de görünüyor
- **Durum çakışması** — IP, IPAM'da "Ayrılmış" olarak işaretli ancak taramada aktif olarak bulundu

Her çakışma için bir çözüm seçin:

| Çözüm | Eylem |
|---|---|
| **IPAM'ı Koru** | Tarama verilerini yoksay, mevcut IPAM kaydını koru |
| **Taramayı Kullan** | IPAM verilerini tarama sonuçlarıyla üzerine yaz |
| **İnceleme İçin İşaretle** | Verileri içe aktar ancak "İnceleme Gerekli" olarak işaretle |

### Adım 5: İçe Aktarma

1. Tüm çakışmaları çözümledikten sonra **İçe Aktar**'a tıklayın
2. İlerleme çubuğu içe aktarma durumunu gösterir
3. Tamamlandığında bir özet görüntülenir:
   - Oluşturulan IP'ler
   - Güncellenen IP'ler
   - Çözümlenen çakışmalar
   - Hatalar (varsa)

## Otomatik İçe Aktarma

Her taramadan sonra otomatik içe aktarmayı yapılandırın:

1. **IPAM > Ayarlar > Otomatik İçe Aktarma** bölümüne gidin
2. **Tarama sonuçlarını otomatik içe aktar**'ı etkinleştirin
3. Seçenekleri yapılandırın:

| Seçenek | Varsayılan | Açıklama |
|---|---|---|
| Yeni IP'ler oluştur | Evet | Otomatik olarak yeni IP kayıtları oluştur |
| Mevcut olanları güncelle | Evet | Mevcut kayıtları güncel verilerle güncelle |
| Çakışma yönetimi | İnceleme İçin İşaretle | Çakışmalarla ne yapılacağı |
| Alt ağ otomatik oluşturma | Hayır | IPAM'da yoksa alt ağ oluştur |

4. **Kaydet**'e tıklayın

Otomatik içe aktarma etkinleştirildiğinde, IPAM manuel müdahale olmadan tarama verilerinizle senkronize kalır.

## CSV'den İçe Aktarma

Harici kaynaklardan da IP verilerini içe aktarabilirsiniz:

1. **IPAM > İçe Aktar > CSV** bölümüne gidin
2. CSV şablonunu indirin
3. Şablon formatını takip ederek verilerinizi doldurun:

```csv
ip_address,mac_address,hostname,status,owner,notes
192.168.1.10,AA:BB:CC:DD:EE:01,fileserver,Assigned,IT Dept,Primary NAS
192.168.1.11,AA:BB:CC:DD:EE:02,printer-01,Assigned,Office,2nd floor
192.168.1.20,,reserved-ip,Reserved,IT Dept,Future use
```

4. CSV'yi yükleyin ve önizlemeyi inceleyin
5. Çakışmaları çözümleyin
6. **İçe Aktar**'a tıklayın

## Veri Zenginleştirme

İçe aktarma sırasında IPAM verileri otomatik olarak zenginleştirir:

| Alan | Kaynak |
|---|---|
| Üretici | MAC adresinden OUI veritabanı sorgusu |
| Cihaz Türü | Tarama motoru profilleme verileri |
| Açık Portlar | Port tarama sonuçları |
| Hizmetler | Hizmet tespit sonuçları |
| Son Görülme | Tarama zaman damgası |

## SSS

**S: İçe aktarma manuel notlarımı ve sahip atamalarımı üzerine yazar mı?**
C: Hayır. İçe aktarma yalnızca teknik alanları (MAC, ana bilgisayar adı, Son Görülme) günceller. Sahip, Notlar ve Durum gibi özel alanlar, bir çakışma için açıkça "Taramayı Kullan"ı seçmediğiniz sürece korunur.

**S: İçe aktarmayı geri alabilir miyim?**
C: Evet. Her içe aktarma bir anlık görüntü oluşturur. **IPAM > İçe Aktarma Geçmişi** bölümüne gidin ve geri almak istediğiniz içe aktarmada **Geri Al**'a tıklayın.

**S: IPAM'da olan ancak taramada bulunamayan IP'lere ne olur?**
C: Değişmeden kalırlar. Bir cihazın taramada görünmemesi, gittiği anlamına gelmez — kapalı olabilir veya farklı bir VLAN'da olabilir. Yapılandırılabilir bir süre boyunca görülmeyen IP'leri bulmak için "Eski IP" raporunu (**IPAM > Raporlar > Eski IP'ler**) kullanın.

**S: Birden fazla alt ağdan aynı anda içe aktarabilir miyim?**
C: Evet. Taramanız birden fazla alt ağı kapsıyorsa, içe aktarma IP'leri adreslerine göre doğru IPAM alt ağlarına dağıtacaktır. Alt ağlar IPAM'da zaten mevcut olmalıdır (veya otomatik içe aktarma ayarlarında "Alt ağ otomatik oluşturma"yı etkinleştirin).

Ek yardım için [support@netreconapp.com](mailto:support@netreconapp.com) adresine başvurun.
