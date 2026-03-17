---
sidebar_position: 3
title: Raporlar
description: PDF güvenlik denetim raporları oluşturma ve özelleştirme
---

# Raporlar

NetRecon Scanner, tarama sonuçlarınızdan profesyonel PDF raporları oluşturur. Raporlar güvenlik denetimleri, uyumluluk belgeleri ve müşteri teslimatları için tasarlanmıştır.

## Ön Koşullar

- Sonuçları olan en az bir tamamlanmış tarama
- PDF oluşturma için yeterli cihaz depolama alanı (genellikle rapor başına 1-5 MB)

## Rapor Oluşturma

1. Bir ağ taramasını tamamlayın
2. Tarama sonuçları ekranından sağ üst köşedeki **Rapor** düğmesine dokunun
3. Rapor türünü seçin ve seçenekleri özelleştirin
4. **PDF Oluştur**'a dokunun
5. Rapor kaydedilecek ve herhangi bir Android paylaşım yöntemiyle paylaşılabilir

## Rapor İçerikleri

Standart bir rapor aşağıdaki bölümleri içerir:

### Yönetici Özeti
- Tarama tarihi ve süresi
- Ağ kapsamı (alt ağ, kullanılan profil)
- Toplam keşfedilen cihaz sayısı
- Temel bulgular özeti (yüksek riskli açık portlar, tanımlanamayan cihazlar)

### Cihaz Envanteri
- Keşfedilen cihazların tam listesi
- IP adresi, MAC adresi, ana bilgisayar adı
- Cihaz türü ve üretici
- İşletim sistemi (tespit edildiğinde)

### Port ve Hizmet Analizi
- Cihaz başına açık portlar
- Çalışan hizmetler ve sürümleri
- Hizmet risk sınıflandırması (Düşük / Orta / Yüksek / Kritik)

### Güvenlik Bulguları
- Yüksek riskli açık portları olan cihazlar (örn. Telnet, FTP, SMB)
- Tespit edilen şifrelenmemiş hizmetler
- Varsayılan veya bilinen savunmasız hizmet sürümleri
- Tespit edilen hizmet sürümleri için CVE referansları (CVE veritabanı mevcut olduğunda)

### Ağ Topolojisi
- Ağ düzeninin metin tabanlı özeti
- Türe göre cihaz dağılımı (sunucular, iş istasyonları, ağ cihazları, IoT)

### Ek
- Ana bilgisayar başına tam port tarama detayları
- Ham hizmet banner'ları
- Tarama yapılandırması ve profil ayarları

## Rapor Özelleştirme

Oluşturmadan önce raporu özelleştirebilirsiniz:

| Seçenek | Açıklama |
|---|---|
| Şirket adı | Başlık ve kapak sayfasında görünür |
| Rapor başlığı | Özel başlık (varsayılan: "Ağ Güvenlik Denetim Raporu") |
| Logo | Kapak sayfası için şirket logosu yükleyin |
| Bölümleri dahil et | Bireysel bölümleri açma/kapama |
| Gizlilik etiketi | Gizli / Dahili / Herkese Açık |
| Dil | Desteklenen 11 dilden herhangi birinde rapor oluşturun |

## Raporları Paylaşma

Oluşturma sonrasında PDF'i şu yollarla paylaşın:

- **E-posta** — Paylaş'a dokunun ve e-posta uygulamanızı seçin
- **Bulut depolama** — Google Drive, OneDrive, vb.'ye kaydedin
- **QR kodu** — yerel olarak barındırılan rapora bağlanan bir QR kodu oluşturun (aynı ağdaki bir meslektaşınıza iletmek için kullanışlı)
- **Doğrudan aktarım** — Android'in yakın paylaşım özelliğini kullanın

## Yazı Tipi ve Unicode Desteği

Raporlar, aşağıdakilerin düzgün görüntülenmesini sağlamak için NotoSans yazı tipi ailesini kullanır:
- Latin karakterler (EN, DE, FR, ES, NL, vb.)
- Kiril karakterler (RU)
- Türkçe özel karakterler (TR)
- İskandinav karakterleri (SV, NO, DA)
- Lehçe karakterler (PL)

Desteklenen 11 dilin tümü, oluşturulan PDF'lerde doğru şekilde görüntülenir.

## Rapor Depolama

Oluşturulan raporlar cihazda yerel olarak saklanır:

- Varsayılan konum: uygulama dahili depolaması
- Raporlar harici depolamaya veya buluta aktarılabilir
- Eski raporlar **Raporlar > Geçmiş** bölümünden yönetilebilir
- Raporların süresi dolmaz ve manuel olarak silinene kadar kullanılabilir durumda kalır

## SSS

**S: Prob tarama sonuçlarından rapor oluşturabilir miyim?**
C: Evet. Bir prob'a bağlıyken hem yerel tarama sonuçlarından hem de prob tarama verilerinden rapor oluşturabilirsiniz. Prob raporları IDS uyarıları ve zafiyet bulguları gibi ek veriler içerebilir.

**S: Bir rapor için maksimum ağ boyutu nedir?**
C: Raporlar 1.000 cihaza kadar olan ağlarla test edilmiştir. Daha büyük ağlar oluşturma süresini uzatabilir ancak kesin bir sınır yoktur.

**S: Otomatik raporları planlayabilir miyim?**
C: Zamanlanmış raporlama prob kontrol panelinde mevcuttur. **Ayarlar > Raporlar > Zamanlama** bölümünden rapor zamanlamalarını yapılandırın.

**S: PDF bozuk metin gösteriyor. Nasıl düzeltirim?**
C: Bu genellikle NotoSans yazı tipi desteği olmayan bir cihazda görüntülendiğinde oluşur. PDF'i gömülü yazı tiplerini destekleyen Google Chrome, Adobe Acrobat veya herhangi bir modern PDF okuyucuda açın.

Ek yardım için [support@netreconapp.com](mailto:support@netreconapp.com) adresine başvurun.
