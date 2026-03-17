---
slug: /
sidebar_position: 1
title: Pierwsze kroki z NetRecon
description: Platforma analizy sieci dla MSP i zespolow IT
---

# Pierwsze kroki z NetRecon

NetRecon to platforma analizy sieci stworzona dla MSP i zespolow IT. Zapewnia automatyczne odkrywanie sieci, inwentaryzacje urzadzen, skanowanie podatnosci, zarzadzanie konfiguracjami oraz monitorowanie w czasie rzeczywistym — wszystko dostepne przez scentralizowany panel, aplikacje mobilne i REST API.

## Wybierz sposob wdrozenia

<div className="row" style={{marginTop: '1.5rem'}}>

<div className="col col--6" style={{marginBottom: '1rem'}}>

### Wlasny serwer (Self-Hosted)

Wdroz NetRecon na wlasnej infrastrukturze za pomoca Docker Compose. Pelna kontrola nad danymi, brak zewnetrznych zaleznosci.

- [Wymagania systemowe](self-hosting/requirements)
- [Poradnik instalacji](self-hosting/installation)
- [Dokumentacja konfiguracji](self-hosting/configuration)

**Najlepsze dla:** Organizacji z rygorystycznymi wymaganiami dotyczacymi suwerennosci danych, sieci odizolowanych lub posiadajacych wlasna infrastrukture serwerowa.

</div>

<div className="col col--6" style={{marginBottom: '1rem'}}>

### Chmura (SaaS)

Zacznij natychmiast z NetRecon Cloud. Nie wymaga konfiguracji serwera — po prostu wdroz sondy i rozpocznij skanowanie.

- [Poradnik szybkiego startu](cloud/quickstart)

**Najlepsze dla:** Zespolow, ktore chca szybko rozpoczac prace bez zarzadzania infrastruktura serwerowa.

</div>

</div>

## Komponenty platformy

| Komponent | Opis |
|---|---|
| **Panel** | Webowy panel sterowania dla wszystkich funkcji NetRecon |
| **NetRecon Scanner** | Aplikacja na Androida do skanowania sieci w terenie ([Dowiedz sie wiecej](scanner/overview)) |
| **Admin Connect** | Aplikacja do zdalnego zarzadzania na Androida ([Dowiedz sie wiecej](admin-connect/overview)) |
| **Agenty** | Lekkie agenty dla systemow Windows, macOS i Linux ([Instalacja](agents/overview)) |
| **Sondy** | Czujniki sieciowe oparte na sprzetce lub maszynach wirtualnych do ciaglego monitorowania |
| **API** | RESTful API do automatyzacji i integracji ([Dokumentacja API](api/overview)) |

## Potrzebujesz pomocy?

- Przegladaj dokumentacje korzystajac z paska bocznego
- Sprawdz [Dokumentacje API](api/overview) w celu uzyskania szczegolow integracji
- Skontaktuj sie z [support@netreconapp.com](mailto:support@netreconapp.com), aby uzyskac pomoc
