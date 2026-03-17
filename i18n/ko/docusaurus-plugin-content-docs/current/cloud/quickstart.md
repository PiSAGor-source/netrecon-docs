---
sidebar_position: 1
title: 빠른 시작
description: 몇 분 만에 NetRecon Cloud 시작하기
---

# 클라우드 빠른 시작

NetRecon Cloud는 가장 빠르게 시작할 수 있는 방법입니다. 서버 설정도, Docker도 필요 없습니다 — 가입하고, Probe를 배포하고, 네트워크 검색을 시작하세요.

## 1단계: 계정 생성

1. [app.netreconapp.com](https://app.netreconapp.com)으로 이동하여 **가입**을 클릭합니다
2. 이메일, 회사명, 비밀번호를 입력합니다
3. 이메일 주소를 인증합니다
4. NetRecon 대시보드에 로그인합니다

## 2단계: 첫 번째 사이트 추가

1. 대시보드에서 사이드바의 **사이트**로 이동합니다
2. **사이트 추가**를 클릭합니다
3. 사이트의 이름과 주소를 입력합니다 (예: "본사 — 이스탄불")
4. 사이트를 저장합니다

## 3단계: Probe 배포

각 사이트에는 네트워크 검색 및 모니터링을 위해 최소 하나의 Probe가 필요합니다.

### 옵션 A: NetRecon OS (권장)

1. **사이트 → [사이트 이름] → Probe → Probe 추가**로 이동합니다
2. **NetRecon OS**를 선택하고 하드웨어에 맞는 이미지를 다운로드합니다
3. [balenaEtcher](https://etcher.balena.io/)를 사용하여 SD 카드 또는 SSD에 이미지를 플래시합니다
4. 이더넷을 통해 Probe를 네트워크에 연결합니다
5. 전원을 켜면 — Probe가 Cloudflare Tunnel을 통해 자동으로 클라우드 계정에 연결됩니다

### 옵션 B: 기존 서버에 Docker 사용

```bash
# Probe 컨테이너 풀 및 실행
docker run -d \
  --name netrecon-probe \
  --network host \
  --restart unless-stopped \
  -e ENROLLMENT_TOKEN="your-token-from-dashboard" \
  netrecon/probe:latest
```

**사이트 → [사이트 이름] → Probe → Probe 추가 → Docker**에서 등록 토큰을 받으세요.

### 옵션 C: 가상 머신

1. 대시보드에서 OVA 파일을 다운로드합니다
2. VMware, Proxmox 또는 Hyper-V로 가져옵니다
3. **브리지 네트워킹**으로 VM을 구성합니다 (Layer 2 스캐닝에 필요)
4. VM을 시작하면 — 대시보드에 자동으로 표시됩니다

## 4단계: 스캐닝 시작

Probe가 온라인이 되면:

1. **사이트 → [사이트 이름] → 장치**로 이동합니다
2. **지금 스캔**을 클릭하거나 자동 검색을 기다립니다 (15분마다 실행)
3. 검색된 장치가 장치 인벤토리에 표시됩니다

## 5단계: 모바일 앱 설치

이동 중 네트워크 스캐닝을 위해 Google Play Store에서 **NetRecon Scanner**를 다운로드하세요:

- 휴대폰이 연결된 모든 네트워크를 스캔합니다
- 결과가 자동으로 클라우드 대시보드에 동기화됩니다
- 자세한 내용은 [Scanner 개요](../scanner/overview)를 참조하세요

## 다음 단계

- **에이전트 배포**로 엔드포인트에 대한 더 깊은 가시성 확보 → [에이전트 설치](../agents/overview)
- 새 장치, 취약점 또는 다운타임에 대한 **경고 설정**
- 기존 도구와의 **통합 구성** (LDAP, SIEM, Jira, ServiceNow)
- **설정 → 팀 관리**를 통해 **팀원 초대**

## 클라우드 vs 자체 호스팅

| 기능 | 클라우드 | 자체 호스팅 |
|---|---|---|
| 서버 관리 | NetRecon이 관리 | 직접 관리 |
| 데이터 위치 | NetRecon Cloud (EU) | 자체 인프라 |
| 업데이트 | 자동 | 수동 (docker pull) |
| Cloudflare Tunnel | 포함 | 직접 구성 |
| 가격 | 구독 | 라이선스 키 |

자체 호스팅이 필요하신가요? [설치 가이드](../self-hosting/installation)를 참조하세요.

도움이 필요하시면 [support@netreconapp.com](mailto:support@netreconapp.com)으로 연락하세요.
