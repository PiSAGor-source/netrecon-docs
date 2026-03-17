---
sidebar_position: 1
title: Przeglad wlasnego hostingu
description: Uruchom platforme NetRecon na wlasnej infrastrukturze
---

# Wlasny hosting

NetRecon moze byc w pelni hostowany na wlasnej infrastrukturze, dajac Ci pelna kontrole nad danymi, bezpieczenstwem i wdrozeniem.

## Dlaczego wlasny hosting?

| Korzysci | Opis |
|---|---|
| **Suwerennosc danych** | Wszystkie wyniki skanowania, konfiguracje i logi pozostaja na Twoich serwerach |
| **Zgodnosc z regulacjami** | Spelnianie wymagan prawnych nakazujacych lokalne przechowywanie danych |
| **Izolacja sieciowa** | Praca w srodowiskach bez dostepu do internetu |
| **Niestandardowa integracja** | Bezposredni dostep do bazy danych dla niestandardowych raportow i integracji |
| **Kontrola kosztow** | Brak licencjonowania per sonda dla infrastruktury serwerowej |

## Architektura

Wdrozenie NetRecon na wlasnym serwerze sklada sie z wielu mikrouslug dzialajacych w kontenerach Docker:

```
┌────────────────────────────────────────────────────────┐
│                    Host Docker                         │
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

## Przeglad uslug

| Usluga | Port | Przeznaczenie |
|---|---|---|
| API Gateway | 8000 | Centralne trasowanie API, uwierzytelnianie |
| Vault Server | 8001 | Zarzadzanie sekretami, przechowywanie danych logowania |
| License Server | 8002 | Walidacja i zarzadzanie licencjami |
| Email Service | 8003 | Powiadomienia e-mail i alerty |
| Notification Service | 8004 | Powiadomienia push, webhooki |
| Update Server | 8005 | Dystrybucja aktualizacji sond i agentow |
| Agent Registry | 8006 | Rejestracja i zarzadzanie agentami |
| Warranty Service | 8007 | Sledzenie gwarancji sprzetowej |
| CMod Service | 8008 | Zarzadzanie konfiguracjami urzadzen sieciowych |
| IPAM Service | 8009 | Zarzadzanie adresami IP |

## Opcje wdrozenia

### Docker Compose (zalecane)

Najprostszy sposob wdrozenia wszystkich uslug. Odpowiedni dla malych i srednich wdrozen.

Zobacz [Poradnik instalacji](./installation.md), aby uzyskac instrukcje krok po kroku.

### Kubernetes

Dla wdrozen na duza skale wymagajacych wysokiej dostepnosci i skalowania poziomego. Wykresy Helm sa dostepne dla kazdej uslugi.

### Pojedynczy plik binarny

Dla minimalnych wdrozen, pojedynczy plik binarny zawiera wszystkie uslugi. Odpowiedni do testow lub bardzo malych srodowisk.

## Wymagania systemowe

| Wymaganie | Minimum | Zalecane |
|---|---|---|
| System operacyjny | Ubuntu 22.04 / Debian 12 | Ubuntu 24.04 LTS |
| CPU | 2 rdzenie | 4+ rdzeni |
| RAM | 4 GB | 8 GB |
| Dysk | 40 GB | 100 GB SSD |
| Docker | v24.0+ | Najnowsza stabilna |
| Docker Compose | v2.20+ | Najnowsza stabilna |

## Siec

| Port | Protokol | Przeznaczenie |
|---|---|---|
| 443 | HTTPS | Panel webowy i API (przez reverse proxy) |
| 80 | HTTP | Przekierowanie na HTTPS |
| 5432 | TCP | PostgreSQL (wewnetrzny, nieeksponowany) |
| 6379 | TCP | Redis (wewnetrzny, nieeksponowany) |

Tylko porty 80 i 443 musza byc eksponowane na zewnatrz. Wszystkie wewnetrzne porty uslug sa dostepne tylko w obrebie sieci Docker.

## Przechowywanie danych

| Dane | Magazyn | Kopia zapasowa |
|---|---|---|
| Baza danych PostgreSQL | Wolumin Docker | pg_dump codziennie |
| Pliki konfiguracyjne | Bind mount | Kopia plikow |
| Przeslane pliki | Wolumin Docker | Kopia plikow |
| Logi | Wolumin Docker | Rotacja logow |
| Certyfikaty TLS | Bind mount | Bezpieczna kopia |

## Bezpieczenstwo

Wdrozenia na wlasnym serwerze zawieraja wszystkie funkcje bezpieczenstwa:

- Szyfrowanie TLS dla calej komunikacji zewnetrznej
- Uwierzytelnianie oparte na JWT
- Kontrola dostepu oparta na rolach
- Logowanie audytowe
- Weryfikacja integralnosci Steel Shield (zobacz [Steel Shield](./steel-shield.md))

## FAQ

**P: Czy moge uruchomic wlasny hosting bez Dockera?**
O: Docker Compose jest zalecaną i wspieraną metodą wdrozenia. Uruchamianie uslug bezposrednio na hoscie jest mozliwe, ale nie jest oficjalnie wspierane.

**P: Jak sondy lacza sie z serwerem wlasnym?**
O: Skonfiguruj sondy tak, aby wskazywaly na adres URL Twojego serwera zamiast domyslnego Cloudflare Tunnel. Zaktualizuj `server_url` w konfiguracji sondy.

**P: Czy panel webowy jest dolaczony?**
O: Tak. API Gateway serwuje panel webowy pod glownym adresem URL. Uzyskaj dostep przez skonfigurowana domene (np. `https://netrecon.twojafirma.com`).

**P: Czy moge uruchomic to w srodowisku odizolowanym od internetu?**
O: Tak. Pobierz wcześniej obrazy Docker i przenies je na serwer bez dostepu do internetu. Walidacja licencji moze byc skonfigurowana w trybie offline.

Aby uzyskac dodatkowa pomoc, skontaktuj sie z [support@netreconapp.com](mailto:support@netreconapp.com).
