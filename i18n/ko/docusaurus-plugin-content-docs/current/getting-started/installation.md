---
sidebar_position: 1
title: 설치
description: Probe 하드웨어에 NetRecon OS 설치하기
---

# NetRecon OS 설치

이 가이드는 Probe 하드웨어에 NetRecon OS를 설치하는 과정을 안내합니다. 다운로드부터 완전히 작동하는 Probe까지 약 15분이 소요됩니다.

## 사전 요구 사항

- 지원되는 하드웨어 장치 ([요구 사항](./requirements.md) 참조)
- microSD 카드 (최소 16GB, 32GB 권장) 또는 USB 드라이브
- [balenaEtcher](https://etcher.balena.io/) 또는 Raspberry Pi Imager와 같은 이미지 기록 도구
- 이미지를 다운로드하고 기록할 컴퓨터
- 네트워크에 연결된 이더넷 케이블

## 1단계: 이미지 다운로드

NetRecon 고객 포털에서 하드웨어에 맞는 이미지를 다운로드하세요:

| 하드웨어 | 이미지 파일 | 아키텍처 |
|---|---|---|
| Orange Pi R2S | `netrecon-os-arm64.img.xz` | ARM64 |
| Raspberry Pi 4/5 | `netrecon-os-arm64.img.xz` | ARM64 |
| x86_64 미니 PC | `netrecon-os-amd64.iso` | x86_64 |

:::tip
파일 무결성을 확인하기 위해 포털에 표시된 값과 다운로드 체크섬을 비교하세요.
:::

## 2단계: 이미지 기록

### ARM64 장치 (Orange Pi, Raspberry Pi)

1. microSD 카드를 컴퓨터에 삽입합니다
2. balenaEtcher를 엽니다
3. 다운로드한 `.img.xz` 파일을 선택합니다 (압축 해제 불필요)
4. microSD 카드를 대상으로 선택합니다
5. **Flash**를 클릭하고 완료를 기다립니다

### x86_64 장치

1. USB 드라이브를 컴퓨터에 삽입합니다
2. balenaEtcher를 엽니다
3. 다운로드한 `.iso` 파일을 선택합니다
4. USB 드라이브를 대상으로 선택합니다
5. **Flash**를 클릭하고 완료를 기다립니다
6. USB 드라이브에서 미니 PC를 부팅하고 화면의 설치 프로그램을 따릅니다

## 3단계: 첫 번째 부팅

1. microSD 카드(또는 x86_64의 내부 드라이브)를 Probe 장치에 삽입합니다
2. 최소 하나의 이더넷 케이블을 네트워크에 연결합니다
3. 장치의 전원을 켭니다
4. 시스템이 초기화될 때까지 약 60초를 기다립니다

Probe는 첫 번째 부팅 시 DHCP를 통해 IP 주소를 받습니다.

## 4단계: 설정 마법사 실행

1. 같은 네트워크의 장치에서 웹 브라우저를 엽니다
2. `http://<probe-ip>:8080`으로 이동합니다
3. 설정 마법사가 초기 구성을 안내합니다

마법사에서 구성할 항목:
- 관리자 계정 자격 증명
- 네트워크 인터페이스 역할
- 네트워크 스캐닝 모드
- Cloudflare Tunnel 연결
- 보안 설정

자세한 마법사 문서는 [설정 마법사 개요](../setup-wizard/overview.md)를 참조하세요.

## 5단계: 앱 연결

마법사가 완료되면:

- **NetRecon Scanner**: 로컬 네트워크에서 mDNS를 통해 Probe를 검색할 수 있습니다
- **Admin Connect**: 마법사에 표시된 QR 코드를 스캔하거나 `https://probe.netreconapp.com`을 통해 연결합니다

## 하드웨어 요구 사항

| 요구 사항 | 최소 | 권장 |
|---|---|---|
| CPU | ARM64 또는 x86_64 | ARM64 쿼드코어 또는 x86_64 |
| RAM | 4 GB | 8 GB |
| 스토리지 | 16 GB | 32 GB |
| 이더넷 | 1포트 | 2포트 이상 |
| 네트워크 | DHCP 사용 가능 | 고정 IP 선호 |

## 문제 해결

### 네트워크에서 Probe를 찾을 수 없음

- 이더넷 케이블이 올바르게 연결되어 있고 링크 LED가 활성 상태인지 확인하세요
- 라우터의 DHCP 임대 테이블에서 `netrecon`이라는 새 장치를 확인하세요
- 모니터와 키보드를 연결하여 콘솔에서 Probe의 IP 주소를 확인해 보세요

### 마법사가 로드되지 않음

- 포트 8080에 접근하고 있는지 확인하세요: `http://<probe-ip>:8080`
- 마법사 서비스는 부팅 후 약 60초 후에 시작됩니다
- 컴퓨터가 Probe와 같은 네트워크/VLAN에 있는지 확인하세요

### 이미지 기록 실패

- 다른 microSD 카드를 사용해 보세요; 일부 카드에는 호환성 문제가 있습니다
- 이미지를 다시 다운로드하고 체크섬을 확인하세요
- 다른 이미지 기록 도구를 사용해 보세요

## FAQ

**Q: NetRecon OS를 가상 머신에 설치할 수 있나요?**
A: 네, x86_64 ISO는 VMware, Proxmox 또는 Hyper-V에 설치할 수 있습니다. 최소 4 GB RAM을 할당하고 VM에 브리지 네트워크 어댑터가 있는지 확인하세요.

**Q: 설치 후 NetRecon OS를 어떻게 업데이트하나요?**
A: 업데이트는 Admin Connect 앱 또는 Probe의 웹 대시보드의 **설정 > 시스템 업데이트**를 통해 제공됩니다.

**Q: 이더넷 대신 Wi-Fi를 사용할 수 있나요?**
A: Probe는 안정적인 네트워크 스캐닝을 위해 최소 하나의 유선 이더넷 연결이 필요합니다. Wi-Fi는 기본 스캔 인터페이스로 지원되지 않습니다.

추가 도움이 필요하시면 [support@netreconapp.com](mailto:support@netreconapp.com)으로 연락하세요.
