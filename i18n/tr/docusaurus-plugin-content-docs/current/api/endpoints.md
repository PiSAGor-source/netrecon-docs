---
sidebar_position: 2
title: Uç Nokta Referansı
description: Hizmet ve kategoriye göre gruplandırılmış tam API uç nokta referansı
---

# Uç Nokta Referansı

Bu sayfa, NetRecon platformundaki her REST API uç noktasını hizmet kategorisine göre gruplandırarak listeler. Aksi belirtilmedikçe tüm uç noktalar JWT Bearer jeton kimlik doğrulaması gerektirir. Kimlik doğrulama ve hız sınırlama detayları için [API Genel Bakış](./overview.md) sayfasına bakın.

**Temel URL:** `https://probe.netreconapp.com/api/`

---

## Prob Uç Noktaları

Prob cihazında (Orange Pi R2S, Raspberry Pi veya x86_64 mini PC) çalışan Go arka ucu tarafından sunulur.

### Sağlık Kontrolü

| Yöntem | Yol | Kimlik Doğrulama | Açıklama |
|---|---|---|---|
| `GET` | `/api/health` | Hayır | Prob sağlık kontrolü. `{"status": "ok", "version": "1.0.0"}` döndürür. |

### Tarama

| Yöntem | Yol | Açıklama |
|---|---|---|
| `POST` | `/api/scan/discover` | Yapılandırılmış alt ağda ARP ana bilgisayar keşfini başlatır. |
| `POST` | `/api/scan/ports` | Keşfedilen ana bilgisayarlara karşı port taraması başlatır. |
| `GET` | `/api/scan/status` | Mevcut tarama durumunu alır (idle, running, complete). |

### Cihazlar

| Yöntem | Yol | Açıklama |
|---|---|---|
| `GET` | `/api/devices` | Keşfedilen tüm cihazları listeler. Sayfalamayı destekler (`?page=&per_page=`). |
| `GET` | `/api/devices/:mac` | MAC adresine göre tek cihazın detaylarını alır. |
| `PUT` | `/api/devices/:mac/note` | Cihazdaki kullanıcı notunu günceller. Gövde: `{"note": "..."}`. |

### Temel Çizgi

| Yöntem | Yol | Açıklama |
|---|---|---|
| `GET` | `/api/baseline` | Kaydedilmiş tüm ağ temel çizgilerini listeler. |
| `POST` | `/api/baseline` | Mevcut cihaz listesinden yeni bir temel çizgi anlık görüntüsü oluşturur. |
| `GET` | `/api/baseline/:id/diff` | Bir temel çizgiyi mevcut ağ durumuyla karşılaştırır. |

### Komşular (CDP/LLDP)

| Yöntem | Yol | Açıklama |
|---|---|---|
| `GET` | `/api/neighbors` | Keşfedilen CDP/LLDP komşularını listeler. |
| `POST` | `/api/neighbors/start` | Komşu keşif dinleyicisini başlatır. |

### Yapılandırma Yedeği (Prob-yerel)

| Yöntem | Yol | Açıklama |
|---|---|---|
| `GET` | `/api/config/targets` | Yapılandırılmış yedekleme hedef cihazlarını listeler. |
| `POST` | `/api/config/targets` | Yeni bir yedekleme hedef cihazı ekler. |
| `POST` | `/api/config/targets/:id/check` | Bir hedef için anında yapılandırma kontrolü tetikler. |

### PCAP Yakalama

| Yöntem | Yol | Açıklama |
|---|---|---|
| `POST` | `/api/pcap/start` | Paket yakalamayı başlatır. Gövde: `{"interface": "eth0", "filter": "tcp port 80"}`. |
| `POST` | `/api/pcap/stop` | Çalışan paket yakalamayı durdurur. |
| `GET` | `/api/pcap/files` | Mevcut PCAP yakalama dosyalarını listeler. |
| `GET` | `/api/pcap/download/:id` | ID'ye göre PCAP dosyası indirir. `application/octet-stream` döndürür. |

### IDS (Suricata)

| Yöntem | Yol | Açıklama |
|---|---|---|
| `GET` | `/api/ids/status` | IDS hizmet durumunu alır (çalışıyor, durdurulmuş, kural sayısı). |
| `POST` | `/api/ids/start` | Suricata IDS izlemeyi başlatır. |
| `POST` | `/api/ids/stop` | IDS izlemeyi durdurur. |
| `GET` | `/api/ids/alerts` | IDS uyarılarını listeler. `?since=24h` zaman filtresini destekler. |

### Zafiyet Taraması (Nuclei)

| Yöntem | Yol | Açıklama |
|---|---|---|
| `POST` | `/api/vuln/scan` | Belirtilen hedeflere karşı zafiyet taraması başlatır. |
| `POST` | `/api/vuln/stop` | Çalışan zafiyet taramasını durdurur. |
| `GET` | `/api/vuln/results` | Zafiyet tarama sonuçlarını alır. |
| `GET` | `/api/vuln/status` | Zafiyet tarayıcı durumunu alır. |

### Bal Küpü

| Yöntem | Yol | Açıklama |
|---|---|---|
| `GET` | `/api/honeypot/status` | Bal küpü hizmet durumunu alır. |
| `POST` | `/api/honeypot/start` | Bal küpü hizmetini başlatır. |
| `POST` | `/api/honeypot/stop` | Bal küpü hizmetini durdurur. |
| `GET` | `/api/honeypot/hits` | Bal küpü etkileşim olaylarını listeler. |

### Sahte Cihaz Tespiti

| Yöntem | Yol | Açıklama |
|---|---|---|
| `GET` | `/api/rogue/status` | Sahte cihaz tespit hizmet durumunu alır. |
| `POST` | `/api/rogue/start` | Sahte DHCP/ARP tespitini başlatır. |
| `POST` | `/api/rogue/stop` | Sahte cihaz tespitini durdurur. |
| `GET` | `/api/rogue/alerts` | Sahte DHCP ve ARP aldatma uyarılarını listeler. |

### Ağ İzleyici

| Yöntem | Yol | Açıklama |
|---|---|---|
| `POST` | `/api/monitor/targets` | Bir izleme hedefi ekler (IP veya ana bilgisayar adı). |
| `GET` | `/api/monitor/targets` | Yapılandırılmış izleme hedeflerini listeler. |
| `POST` | `/api/monitor/start` | Ağ izlemeyi başlatır. |
| `POST` | `/api/monitor/stop` | Ağ izlemeyi durdurur. |
| `GET` | `/api/monitor/latency` | İzlenen hedefler için gecikme ölçümlerini alır. |
| `GET` | `/api/monitor/packetloss` | İzlenen hedefler için paket kaybı verilerini alır. |
| `GET` | `/api/monitor/status` | İzleyici hizmet durumunu alır. |

### VPN (WireGuard)

| Yöntem | Yol | Açıklama |
|---|---|---|
| `POST` | `/api/vpn/setup` | WireGuard VPN parametrelerini yapılandırır. |
| `GET` | `/api/vpn/status` | VPN bağlantı durumunu alır. |
| `POST` | `/api/vpn/start` | VPN tünelini başlatır. |
| `POST` | `/api/vpn/stop` | VPN tünelini durdurur. |
| `GET` | `/api/vpn/config` | WireGuard yapılandırmasını indirir. |

### DNS Çukuru

| Yöntem | Yol | Açıklama |
|---|---|---|
| `GET` | `/api/dns/status` | DNS çukuru hizmet durumunu alır. |
| `POST` | `/api/dns/start` | DNS çukurunu başlatır. |
| `POST` | `/api/dns/stop` | DNS çukurunu durdurur. |
| `GET` | `/api/dns/threats` | Engellenen DNS tehdit girişlerini listeler. |

### Sistem Sağlığı

| Yöntem | Yol | Açıklama |
|---|---|---|
| `GET` | `/api/system/health` | Detaylı sistem sağlığı (işlemci, bellek, disk, sıcaklık). |
| `GET` | `/api/system/history` | Geçmiş sistem sağlık veri noktaları. |
| `GET` | `/api/system/alerts` | Sistem sağlık eşik uyarılarını listeler. |
| `POST` | `/api/system/thresholds` | Sağlık uyarı eşiklerini yapılandırır (işlemci %, bellek %, disk %). |

### Yedekleme ve Geri Yükleme

| Yöntem | Yol | Açıklama |
|---|---|---|
| `POST` | `/api/backup/create` | Tam prob yedeği oluşturur (yapılandırma + veritabanı). |
| `GET` | `/api/backup/list` | Mevcut yedekleme dosyalarını listeler. |
| `GET` | `/api/backup/download/:id` | Bir yedekleme arşivini indirir. `application/octet-stream` döndürür. |
| `POST` | `/api/backup/restore` | Prob'u bir yedekleme dosyasından geri yükler. |

### Destek Talebi

| Yöntem | Yol | Açıklama |
|---|---|---|
| `GET` | `/api/ticketing/config` | Mevcut destek talebi entegrasyon yapılandırmasını alır. |
| `POST` | `/api/ticketing/config` | Destek talebi yapılandırmasını ayarlar (ServiceNow, Jira, webhook URL). |
| `POST` | `/api/ticketing/test` | Entegrasyonu doğrulamak için test talebi gönderir. |
| `POST` | `/api/ticketing/create` | Bir uyarı veya olaydan talep oluşturur. |
| `GET` | `/api/ticketing/history` | Daha önce oluşturulan talepleri listeler. |

### WebSocket

| Yöntem | Yol | Açıklama |
|---|---|---|
| `GET` | `/ws/events` | Gerçek zamanlı prob olayları için WebSocket bağlantısı. Jetonu sorgu ile iletin: `?token=<jwt>`. |

#### WebSocket Olay Türleri

| Olay | Açıklama |
|---|---|
| `host_found` | Yeni cihaz keşfedildi |
| `port_found` | Cihazda açık port tespit edildi |
| `scan_complete` | Ağ taraması tamamlandı |
| `neighbor_discovered` | CDP/LLDP komşusu bulundu |
| `config_changed` | Cihaz yapılandırması değişti |
| `baseline_diff_alert` | Ağ temel çizgisi sapması tespit edildi |
| `ids_alert` | IDS kuralı tetiklendi |
| `honeypot_hit` | Bal küpü etkileşimi tespit edildi |
| `rogue_detected` | Sahte DHCP veya ARP etkinliği |
| `pcap_ready` | PCAP dosyası indirmeye hazır |
| `vuln_found` | Zafiyet keşfedildi |
| `dns_threat` | DNS tehdidi engellendi |
| `probe_health_alert` | Prob kaynak eşiği aşıldı |
| `error` | Hata olayı |

---

## API Gateway Uç Noktaları

FastAPI API Gateway (port 8000) tarafından sunulur. Kimlik doğrulama, kullanıcı yönetimi, RBAC ve arka uç hizmetlerine proxy yönlendirme işlemlerini yönetir.

### Kimlik Doğrulama

| Yöntem | Yol | Açıklama |
|---|---|---|
| `POST` | `/api/auth/login` | Kullanıcı adı/parola ile kimlik doğrulama, JWT jetonu alma. |
| `POST` | `/api/auth/refresh` | Süresi dolmak üzere olan JWT jetonunu yenileme. |

### Kullanıcılar

| Yöntem | Yol | Açıklama |
|---|---|---|
| `GET` | `/api/users` | Kuruluştaki kullanıcıları listeleme. |
| `POST` | `/api/users` | Yeni kullanıcı hesabı oluşturma. |
| `GET` | `/api/users/:id` | Kullanıcı detaylarını alma. |
| `PUT` | `/api/users/:id` | Kullanıcı güncelleme. |
| `DELETE` | `/api/users/:id` | Kullanıcı silme. |

### RBAC (Rol Tabanlı Erişim Kontrolü)

| Yöntem | Yol | Açıklama |
|---|---|---|
| `GET` | `/api/rbac/roles` | Tanımlı tüm rolleri listeleme. |
| `POST` | `/api/rbac/roles` | Belirli izinlerle özel rol oluşturma. |
| `PUT` | `/api/rbac/roles/:id` | Rol izinlerini güncelleme. |
| `DELETE` | `/api/rbac/roles/:id` | Rol silme. |
| `GET` | `/api/rbac/permissions` | Mevcut tüm izinleri listeleme. |

### API Anahtarları

| Yöntem | Yol | Açıklama |
|---|---|---|
| `GET` | `/api/keys` | Kuruluşun API anahtarlarını listeleme. |
| `POST` | `/api/keys` | Yeni uzun ömürlü API anahtarı oluşturma. |
| `DELETE` | `/api/keys/:id` | API anahtarını iptal etme. |

### IP İzin Listesi

| Yöntem | Yol | Açıklama |
|---|---|---|
| `GET` | `/api/ip-allowlist` | İzin verilen IP aralıklarını listeleme. |
| `POST` | `/api/ip-allowlist` | İzin listesine IP veya CIDR aralığı ekleme. |
| `DELETE` | `/api/ip-allowlist/:id` | İzin listesinden IP aralığı kaldırma. |

### İzleme (Prometheus Proxy)

| Yöntem | Yol | Açıklama |
|---|---|---|
| `GET` | `/api/monitoring/metrics` | Prometheus metrik uç noktasına proxy. |
| `GET` | `/api/monitoring/query` | Prometheus'a PromQL sorgusu proxy'leme. |

### Oxidized (Yapılandırma Yedeği Proxy)

| Yöntem | Yol | Açıklama |
|---|---|---|
| `GET` | `/api/oxidized/nodes` | Oxidized tarafından yönetilen ağ düğümlerini listeleme. |
| `GET` | `/api/oxidized/nodes/:name` | Bir düğümün yapılandırma geçmişini alma. |
| `POST` | `/api/oxidized/nodes` | Oxidized yönetimine düğüm ekleme. |

### Vault Yapılandırması

| Yöntem | Yol | Açıklama |
|---|---|---|
| `GET` | `/api/vault/config` | Vault entegrasyon ayarlarını alma. |
| `POST` | `/api/vault/config` | Vault entegrasyon ayarlarını güncelleme. |

---

## IPAM Hizmet Uç Noktaları

IP Adres Yönetimi hizmeti (port 8009). Tüm yollar `/api/v1/ipam` ön ekine sahiptir.

### Ön Ekler (Alt Ağlar)

| Yöntem | Yol | Açıklama |
|---|---|---|
| `GET` | `/api/v1/ipam/prefixes` | Yönetilen tüm ön ekleri/alt ağları listeleme. |
| `POST` | `/api/v1/ipam/prefixes` | Yeni ön ek oluşturma. Gövde: `prefix` (CIDR notasyonu), `description`, `site`, `status`, isteğe bağlı `vlan_id`. |
| `GET` | `/api/v1/ipam/prefixes/:id` | Yeniden hesaplanmış kullanım yüzdesiyle tek ön ek alma. |
| `PUT` | `/api/v1/ipam/prefixes/:id` | Ön ek güncelleme. |
| `DELETE` | `/api/v1/ipam/prefixes/:id` | Ön ek silme. `204 No Content` döndürür. |
| `GET` | `/api/v1/ipam/prefixes/:id/available` | Ön ekteki atanmamış IP'leri listeleme. 256 sonuçla sınırlıdır. |
| `POST` | `/api/v1/ipam/prefixes/:id/next-available` | Ön ekteki bir sonraki boş IP'yi atama. Yeni adres kaydını döndürür. |

### Adresler

| Yöntem | Yol | Açıklama |
|---|---|---|
| `GET` | `/api/v1/ipam/addresses` | Adresleri listeleme. Filtreler: `?prefix_id=`, `?status=`, `?vendor=`, `?search=`. Maks 1000 sonuç. |
| `POST` | `/api/v1/ipam/addresses` | Yeni IP adresi kaydı oluşturma. |
| `GET` | `/api/v1/ipam/addresses/:id` | UUID ile tek adres alma. |
| `PUT` | `/api/v1/ipam/addresses/:id` | Adres kaydını güncelleme. |
| `DELETE` | `/api/v1/ipam/addresses/:id` | Adres kaydını silme. `204 No Content` döndürür. |
| `POST` | `/api/v1/ipam/addresses/bulk-import` | IP'ye göre toplu upsert. Mevcut kayıtlar güncellenir, yenileri oluşturulur. |

### VLAN'lar

| Yöntem | Yol | Açıklama |
|---|---|---|
| `GET` | `/api/v1/ipam/vlans` | Tüm VLAN'ları VLAN ID'sine göre sıralı listeleme. |
| `POST` | `/api/v1/ipam/vlans` | Yeni VLAN kaydı oluşturma. Gövde: `vlan_id`, `name`, `description`, `status`. |
| `PUT` | `/api/v1/ipam/vlans/:id` | VLAN güncelleme. |
| `DELETE` | `/api/v1/ipam/vlans/:id` | VLAN silme. `204 No Content` döndürür. |

### Analitik

| Yöntem | Yol | Açıklama |
|---|---|---|
| `GET` | `/api/v1/ipam/stats` | Genel IPAM istatistikleri: toplam ön ek, toplam adres, ortalama kullanım, çakışma sayısı. |
| `GET` | `/api/v1/ipam/utilization` | Adres sayılarıyla ön ek başına kullanım dökümü. |
| `GET` | `/api/v1/ipam/conflicts` | Çakışan atamaları bulma (farklı IP'lere sahip tekrar MAC'ler). |

### İçe/Dışa Aktarma

| Yöntem | Yol | Açıklama |
|---|---|---|
| `POST` | `/api/v1/ipam/import/scan` | NetRecon tarama verisinden cihaz içe aktarma. Otomatik ön ek eşlemesiyle IP'ye göre upsert. |
| `GET` | `/api/v1/ipam/export/csv` | Tüm adresleri CSV olarak dışa aktarma. `Content-Disposition` başlığıyla `text/csv` döndürür. |
| `GET` | `/api/v1/ipam/export/json` | Tüm IPAM verilerini (ön ekler, adresler, VLAN'lar) JSON olarak dışa aktarma. |

---

## CMod Hizmet Uç Noktaları

İsteğe Bağlı Yapılandırma Yönetimi (port 8008). Ağ cihazlarına SSH ve seri konsol erişimi sağlar. Tüm yollar `/api/v1/cmod` ön ekine sahiptir.

### Oturumlar

| Yöntem | Yol | Açıklama |
|---|---|---|
| `POST` | `/api/v1/cmod/connect` | Yeni SSH veya seri oturum açma. Gövde: `host`, `device_type`, `username`, `password`, isteğe bağlı `port`, `serial_port`. `session_id` içeren oturum bilgisi döndürür. |
| `POST` | `/api/v1/cmod/disconnect` | Oturumu kapatma. Sorgu: `?session_id=`. |
| `GET` | `/api/v1/cmod/sessions` | Tüm aktif oturumları listeleme. |
| `GET` | `/api/v1/cmod/sessions/:session_id` | Oturum detayları ve tam komut günlüğünü alma. |
| `DELETE` | `/api/v1/cmod/sessions/:session_id` | Oturumu sonlandırma. |

### Komutlar

| Yöntem | Yol | Açıklama |
|---|---|---|
| `POST` | `/api/v1/cmod/send-command` | Tek komut gönderme. Gövde: `session_id`, `command`, isteğe bağlı `expect_string`, `read_timeout`. |
| `POST` | `/api/v1/cmod/send-batch` | Birden fazla komutu sırayla gönderme. Gövde: `session_id`, `commands[]`, isteğe bağlı `delay_factor`. |

### Yapılandırma İşlemleri

| Yöntem | Yol | Açıklama |
|---|---|---|
| `POST` | `/api/v1/cmod/backup` | Cihazdan çalışan yapılandırmayı alma. Üreticiye göre doğru komutu otomatik seçer (Cisco IOS/NX-OS/XR, Huawei, Juniper, Arista, HP). |
| `POST` | `/api/v1/cmod/rollback` | Yapılandırma modunda cihaza yapılandırma parçası gönderme. Gövde: `session_id`, `config` (çok satırlı dize). |

### Şablonlar

| Yöntem | Yol | Açıklama |
|---|---|---|
| `GET` | `/api/v1/cmod/templates` | Komut şablonlarını listeleme. Filtreler: `?vendor=cisco_ios`, `?category=backup`. Cisco IOS, Huawei ve Juniper JunOS için önceden oluşturulmuş şablonlar. |
| `POST` | `/api/v1/cmod/templates` | Özel komut şablonu oluşturma. Gövde: `name`, `vendor`, `category`, `commands[]`, `description`. |

---

## Agent Registry Uç Noktaları

Ajan yönetim hizmeti (port 8006). Windows, macOS ve Linux ajanları için kayıt, heartbeat, envanter ve dağıtımı yönetir.

### Ajan Yaşam Döngüsü

| Yöntem | Yol | Açıklama |
|---|---|---|
| `POST` | `/agents/enroll` | Dağıtım jetonu ile yeni ajan kaydetme. Gövde: `deployment_token`, `hostname`, `os_type`, `os_version`, `arch`, `agent_version`. |
| `POST` | `/agents/heartbeat` | Ajan heartbeat. Başlıklar: `X-Agent-ID`, `X-Session-Key`. |
| `POST` | `/agents/inventory` | Donanım/yazılım envanteri gönderme. Başlıklar: `X-Agent-ID`, `X-Session-Key`. |
| `GET` | `/agents` | Kuruluştaki tüm ajanları listeleme. Başlık: `X-Org-ID`. |
| `GET` | `/agents/:agent_id` | Donanım özellikleri ve garanti durumu dahil tam ajan detayları. |
| `DELETE` | `/agents/:agent_id` | Ajanı kayıt defterinden kaldırma. |

### Dağıtım Jetonları

| Yöntem | Yol | Açıklama |
|---|---|---|
| `POST` | `/agents/tokens` | Dağıtım jetonu oluşturma. Başlıklar: `X-Org-ID`, `X-User-ID`. Gövde: `expires_in_hours`, `max_uses`, `label`, isteğe bağlı `site_id`, `metadata`. Jeton dizesi ve platforma özel kurulum komutları döndürür. |
| `GET` | `/agents/tokens` | Kuruluşun dağıtım jetonlarını listeleme. Başlık: `X-Org-ID`. |
| `DELETE` | `/agents/tokens/:token_id` | Dağıtım jetonunu iptal etme. |

### Dağıtım Paketi Üreteci

| Yöntem | Yol | Açıklama |
|---|---|---|
| `POST` | `/agents/deploy/generate` | Platforma özel dağıtım araçları oluşturma. Gövde: `platform` (windows, linux, macos, ios, android), `method` (msi, powershell, sccm, intune, gpo, pkg, brew, jamf, mdm, deb, rpm, bash, docker, qr, email, mdm_app, managed_play), `role`. Kayıt jetonu, kurulum komutları, betikler veya manifest içeriği döndürür. |
| `GET` | `/agents/deploy/quota` | Kuruluşun cihaz kota kullanımını alma. Başlık: `X-Org-ID`. |
| `GET` | `/agents/deploy/platforms` | Desteklenen tüm platformları ve kullanılabilir dağıtım yöntemlerini listeleme. Kimlik doğrulama gerekmez. |

### Uzaktan Bağlantı

| Yöntem | Yol | Açıklama |
|---|---|---|
| `POST` | `/agents/:agent_id/remote/request` | Kayıtlı bir ajana yeni uzak oturum (RDP, SSH, VNC, ADB) isteği. Başlık: `X-User-ID`. Gövde: `session_type`, isteğe bağlı `credential_id`, `timeout_hours`. |
| `GET` | `/agents/:agent_id/remote/status` | Uzak hazırlık durumunu alma (çevrimiçi durum, Headscale IP, kullanılabilir oturum türleri). |
| `POST` | `/agents/:agent_id/remote/end` | Ajan için aktif uzak oturumu sonlandırma. Başlık: `X-User-ID`. |
| `GET` | `/remote/sessions` | Kuruluşun uzak oturumlarını listeleme. Başlık: `X-Org-ID`. Sorgu: `?active_only=true` (varsayılan). |
| `POST` | `/agents/:agent_id/remote/ready` | Uzak hizmet hazır olduğunda ajan geri çağrısı. Başlıklar: `X-Agent-ID`, `X-Session-Key`. |
| `POST` | `/remote/cleanup` | Bayat uzak oturumları sonlandırma. Dahili zamanlayıcı/cron kullanımı içindir. |

---

## Diplomat Hizmet Uç Noktaları

E-posta sınıflandırma ve günlük analiz hizmeti (port 8010). Tüm yollar `/api/v1/diplomat` ön ekine sahiptir.

### Sınıflandırma

| Yöntem | Yol | Açıklama |
|---|---|---|
| `POST` | `/api/v1/diplomat/classify` | Giriş metnini (talep, uyarı, e-posta) bir kategori ve öncelik düzeyine sınıflandırma. |
| `POST` | `/api/v1/diplomat/summarize` | Sağlanan metnin özetini oluşturma. |
| `POST` | `/api/v1/diplomat/translate` | Metni belirtilen hedef dile çevirme. |
| `POST` | `/api/v1/diplomat/analyze-log` | Günlük parçasını analiz ederek temel olayları, hataları ve kalıpları çıkarma. |

### E-posta İşlem Hattı

| Yöntem | Yol | Açıklama |
|---|---|---|
| `GET` | `/api/v1/diplomat/emails/stats` | E-posta işleme istatistiklerini alma (alınan, sınıflandırılan, yanıtlanan sayılar). |
| `GET` | `/api/v1/diplomat/emails/recent` | Son işlenen e-postaları listeleme. |

### Sağlık

| Yöntem | Yol | Kimlik Doğrulama | Açıklama |
|---|---|---|---|
| `GET` | `/api/v1/diplomat/health` | Hayır | Diplomat hizmet sağlık kontrolü. |

---

## Hizmet Sağlık Uç Noktaları

Her mikro hizmet, dahili izleme ve yük dengeleyici kontrolleri için bir `/health` uç noktası sunar.

| Hizmet | URL | Port |
|---|---|---|
| API Gateway | `/health` | 8000 |
| Vault Server | `/health` | 8001 |
| License Server | `/health` | 8002 |
| Email Service | `/health` | 8003 |
| Notification Service | `/health` | 8004 |
| Update Server | `/health` | 8005 |
| Agent Registry | `/health` | 8006 |
| Warranty Service | `/health` | 8007 |
| CMod Service | `/health` | 8008 |
| IPAM Service | `/health` | 8009 |
| Diplomat Service | `/health` | 8010 |

---

## Destek

API ile ilgili sorular veya sorunlar için [support@netreconapp.com](mailto:support@netreconapp.com) adresine başvurun.
