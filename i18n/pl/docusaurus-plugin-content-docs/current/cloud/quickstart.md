---
sidebar_position: 1
title: Szybki start
description: Zacznij korzystac z NetRecon Cloud w kilka minut
---

# Szybki start z chmura

NetRecon Cloud to najszybszy sposob na rozpoczecie pracy. Bez konfiguracji serwera, bez Dockera — wystarczy sie zarejestrowac, wdrozyc sonde i rozpoczac odkrywanie sieci.

## Krok 1: Utworz konto

1. Przejdz na [app.netreconapp.com](https://app.netreconapp.com) i kliknij **Zarejestruj sie**
2. Podaj adres e-mail, nazwe firmy i haslo
3. Zweryfikuj swoj adres e-mail
4. Zaloguj sie do panelu NetRecon

## Krok 2: Dodaj pierwsza lokalizacje

1. W panelu przejdz do **Lokalizacje** na pasku bocznym
2. Kliknij **Dodaj lokalizacje**
3. Wpisz nazwe i adres lokalizacji (np. „Biuro glowne — Warszawa")
4. Zapisz lokalizacje

## Krok 3: Wdroz sonde

Kazda lokalizacja potrzebuje co najmniej jednej sondy do odkrywania i monitorowania sieci.

### Opcja A: NetRecon OS (zalecana)

1. Przejdz do **Lokalizacje → [Twoja lokalizacja] → Sondy → Dodaj sonde**
2. Wybierz **NetRecon OS** i pobierz obraz dla swojego sprzetu
3. Nagraj obraz na karte SD lub dysk SSD za pomoca [balenaEtcher](https://etcher.balena.io/)
4. Podlacz sonde do sieci kablem Ethernet
5. Wlacz zasilanie — sonda automatycznie polaczy sie z kontem w chmurze przez Cloudflare Tunnel

### Opcja B: Docker na istniejacym serwerze

```bash
# Pobierz i uruchom kontener sondy
docker run -d \
  --name netrecon-probe \
  --network host \
  --restart unless-stopped \
  -e ENROLLMENT_TOKEN="twoj-token-z-panelu" \
  netrecon/probe:latest
```

Token rejestracji uzyskasz w **Lokalizacje → [Twoja lokalizacja] → Sondy → Dodaj sonde → Docker**.

### Opcja C: Maszyna wirtualna

1. Pobierz plik OVA z panelu
2. Zaimportuj do VMware, Proxmox lub Hyper-V
3. Skonfiguruj maszyne wirtualna z **siecią mostkowana (bridged)** (wymagane do skanowania warstwy 2)
4. Uruchom maszyne — pojawi sie automatycznie w panelu

## Krok 4: Rozpocznij skanowanie

Gdy sonda jest online:

1. Przejdz do **Lokalizacje → [Twoja lokalizacja] → Urzadzenia**
2. Kliknij **Skanuj teraz** lub poczekaj na automatyczne odkrywanie (uruchamiane co 15 minut)
3. Odkryte urzadzenia pojawia sie w inwentarzu

## Krok 5: Zainstaluj aplikacje mobilna

Pobierz **NetRecon Scanner** ze sklepu Google Play do skanowania sieci w terenie:

- Skanuj dowolna siec, z ktora polaczony jest Twoj telefon
- Wyniki synchronizuja sie automatycznie z panelem w chmurze
- Zobacz [Przeglad skanera](../scanner/overview), aby uzyskac szczegoly

## Co dalej?

- **Wdroz agenty** na urzadzeniach koncowych dla lepszej widocznosci → [Instalacja agentow](../agents/overview)
- **Skonfiguruj alerty** dla nowych urzadzen, podatnosci lub przestojow
- **Skonfiguruj integracje** z istniejacymi narzedziami (LDAP, SIEM, Jira, ServiceNow)
- **Zapros swoj zespol** przez **Ustawienia → Zarzadzanie zespolem**

## Chmura vs wlasny serwer

| Funkcja | Chmura | Wlasny serwer |
|---|---|---|
| Zarzadzanie serwerem | Zarzadzane przez NetRecon | Zarzadzasz samodzielnie |
| Lokalizacja danych | NetRecon Cloud (UE) | Twoja infrastruktura |
| Aktualizacje | Automatyczne | Reczne (docker pull) |
| Cloudflare Tunnel | W zestawie | Konfigurujesz samodzielnie |
| Cennik | Subskrypcja | Klucz licencyjny |

Potrzebujesz wlasnego serwera? Zobacz [Poradnik instalacji](../self-hosting/installation).

Aby uzyskac pomoc, skontaktuj sie z [support@netreconapp.com](mailto:support@netreconapp.com).
