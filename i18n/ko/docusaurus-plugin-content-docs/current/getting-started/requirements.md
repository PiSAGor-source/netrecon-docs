---
sidebar_position: 3
title: 요구 사항
description: NetRecon의 하드웨어, 소프트웨어 및 네트워크 요구 사항
---

# 요구 사항

이 페이지에서는 모든 NetRecon 구성 요소에 대한 최소 및 권장 요구 사항을 자세히 설명합니다.

## Probe 하드웨어

### 지원 플랫폼

| 장치 | 지원 수준 | 참고 |
|---|---|---|
| Orange Pi R2S (8 GB) | 기본 | 듀얼 이더넷, 컴팩트 폼 팩터 |
| Raspberry Pi 4 (4/8 GB) | 기본 | 널리 사용 가능, 좋은 성능 |
| Raspberry Pi 5 (4/8 GB) | 기본 | 최고의 ARM 성능 |
| x86_64 미니 PC (Intel N100+) | 기본 | 최고의 전체 성능, 다중 NIC |
| 기타 ARM64 SBC | 고급 | 수동 구성 필요 가능 |
| 가상 머신 (VMware/Proxmox/Hyper-V) | 지원 | 브리지 네트워킹 필수 |

### 하드웨어 사양

| 요구 사항 | 최소 | 권장 |
|---|---|---|
| 아키텍처 | ARM64 또는 x86_64 | ARM64 쿼드코어 또는 x86_64 |
| CPU 코어 | 2 | 4 이상 |
| RAM | 4 GB | 8 GB |
| 스토리지 | 16 GB (eMMC/SD/SSD) | 32 GB SSD |
| 이더넷 포트 | 1 | 2 이상 (브리지/TAP 모드용) |
| USB | 필수 아님 | USB-A (시리얼 콘솔 어댑터용) |
| 전원 | 5V/3A (SBC) | PoE 또는 배럴 잭 |

### 스토리지 고려 사항

- **16 GB**는 기본 스캐닝 및 모니터링에 충분합니다
- **32 GB 이상**은 PCAP 캡처, IDS 로깅 또는 취약점 스캐닝을 활성화할 경우 권장됩니다
- PCAP 파일은 바쁜 네트워크에서 빠르게 커질 수 있습니다; 장기 캡처를 위해 외부 스토리지를 고려하세요
- SQLite 데이터베이스는 최적의 쓰기 성능을 위해 WAL 모드를 사용합니다

## NetRecon Scanner 앱 (Android)

| 요구 사항 | 세부 사항 |
|---|---|
| Android 버전 | 8.0 (API 26) 이상 |
| RAM | 최소 2 GB |
| 스토리지 | 앱 + 데이터용 100 MB |
| 네트워크 | 대상 네트워크에 연결된 Wi-Fi |
| 루트 접근 | 선택 사항 (고급 스캐닝 모드 활성화) |
| Shizuku | 선택 사항 (루트 없이 일부 기능 활성화) |

## Admin Connect 앱

| 요구 사항 | 세부 사항 |
|---|---|
| Android 버전 | 8.0 (API 26) 이상 |
| RAM | 최소 2 GB |
| 스토리지 | 앱 + 데이터용 80 MB |
| 네트워크 | 인터넷 연결 (Cloudflare Tunnel 경유 연결) |

## 자체 호스팅 서버

| 요구 사항 | 최소 | 권장 |
|---|---|---|
| OS | Ubuntu 22.04 LTS / Debian 12 | Ubuntu 24.04 LTS |
| CPU | 2코어 | 4코어 이상 |
| RAM | 4 GB | 8 GB |
| 스토리지 | 40 GB | 100 GB SSD |
| Docker | v24.0+ | 최신 안정 버전 |
| Docker Compose | v2.20+ | 최신 안정 버전 |

Windows Server도 Docker Desktop 또는 WSL2로 지원됩니다.

## 네트워크 요구 사항

### Probe 네트워크 접근

| 방향 | 포트 | 프로토콜 | 용도 |
|---|---|---|---|
| Probe -> LAN | ARP | Layer 2 | 호스트 검색 |
| Probe -> LAN | TCP (다양) | Layer 4 | 포트 스캐닝 |
| Probe -> LAN | UDP 5353 | mDNS | 서비스 검색 |
| Probe -> 인터넷 | TCP 443 | HTTPS | Cloudflare Tunnel, 업데이트 |
| LAN -> Probe | TCP 3000 | HTTPS | 웹 대시보드 |
| LAN -> Probe | TCP 8080 | HTTP | 설정 마법사 (첫 부팅 시에만) |

### 방화벽 고려 사항

- Cloudflare Tunnel을 사용할 때 Probe는 인터넷에서의 **인바운드 포트가 필요하지 않습니다**
- Probe는 터널 연결 및 시스템 업데이트를 위해 **아웃바운드 HTTPS (443)**이 필요합니다
- 로컬 네트워크 스캐닝의 경우 Probe는 대상 장치와 같은 Layer 2 세그먼트에 있어야 합니다 (또는 SPAN/미러 포트 사용)

### Cloudflare Tunnel

Probe에 대한 원격 접근은 Cloudflare Tunnel을 통해 제공됩니다. 다음이 필요합니다:
- Probe에 활성 인터넷 연결
- 아웃바운드 TCP 443 접근 (인바운드 포트 불필요)
- Cloudflare 계정 (무료 티어로 충분)

## 브라우저 요구 사항 (웹 대시보드)

| 브라우저 | 최소 버전 |
|---|---|
| Google Chrome | 90+ |
| Mozilla Firefox | 90+ |
| Microsoft Edge | 90+ |
| Safari | 15+ |

JavaScript가 활성화되어야 합니다.

## FAQ

**Q: Raspberry Pi 3에서 Probe를 실행할 수 있나요?**
A: Raspberry Pi 3은 RAM이 1 GB뿐이므로 최소 요구 사항 미만입니다. 기본 스캐닝에서는 작동할 수 있지만 지원되지 않습니다.

**Q: Probe에 인터넷 접근이 필요한가요?**
A: 인터넷 접근은 Cloudflare Tunnel(원격 접근) 및 시스템 업데이트에만 필요합니다. 모든 스캐닝 기능은 인터넷 없이도 작동합니다.

**Q: 스캐닝에 USB Wi-Fi 어댑터를 사용할 수 있나요?**
A: Wi-Fi 스캐닝은 지원되지 않습니다. Probe는 안정적이고 완전한 네트워크 검색을 위해 유선 이더넷이 필요합니다.

추가 도움이 필요하시면 [support@netreconapp.com](mailto:support@netreconapp.com)으로 연락하세요.
