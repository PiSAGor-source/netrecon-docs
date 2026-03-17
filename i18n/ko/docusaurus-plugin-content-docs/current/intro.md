---
slug: /
sidebar_position: 1
title: NetRecon 시작하기
description: MSP 및 IT 팀을 위한 네트워크 인텔리전스 플랫폼
---

# NetRecon 시작하기

NetRecon은 MSP와 IT 팀을 위해 설계된 네트워크 인텔리전스 플랫폼입니다. 자동화된 네트워크 검색, 장치 인벤토리, 취약점 스캐닝, 구성 관리 및 실시간 모니터링을 제공하며, 중앙 대시보드, 모바일 앱 및 REST API를 통해 모두 접근할 수 있습니다.

## 배포 방식 선택

<div className="row" style={{marginTop: '1.5rem'}}>

<div className="col col--6" style={{marginBottom: '1rem'}}>

### 자체 호스팅

Docker Compose를 사용하여 자체 인프라에 NetRecon을 배포합니다. 데이터에 대한 완전한 제어, 외부 종속성 없음.

- [시스템 요구 사항](self-hosting/requirements)
- [설치 가이드](self-hosting/installation)
- [구성 참조](self-hosting/configuration)

**적합한 경우:** 엄격한 데이터 주권 요구 사항, 에어갭 네트워크 또는 기존 서버 인프라를 보유한 조직.

</div>

<div className="col col--6" style={{marginBottom: '1rem'}}>

### 클라우드 (SaaS)

NetRecon Cloud로 즉시 시작하세요. 서버 설정 불필요 — Probe를 배포하고 스캐닝을 시작하기만 하면 됩니다.

- [빠른 시작 가이드](cloud/quickstart)

**적합한 경우:** 서버 인프라를 관리하지 않고 빠르게 시작하려는 팀.

</div>

</div>

## 플랫폼 구성 요소

| 구성 요소 | 설명 |
|---|---|
| **대시보드** | 모든 NetRecon 기능을 위한 웹 기반 제어판 |
| **NetRecon Scanner** | 이동 중 네트워크 스캐닝을 위한 Android 앱 ([자세히 보기](scanner/overview)) |
| **Admin Connect** | 원격 관리를 위한 Android 관리 앱 ([자세히 보기](admin-connect/overview)) |
| **에이전트** | Windows, macOS 및 Linux 엔드포인트용 경량 에이전트 ([설치](agents/overview)) |
| **Probe** | 지속적인 모니터링을 위한 하드웨어 또는 VM 기반 네트워크 센서 |
| **API** | 자동화 및 통합을 위한 RESTful API ([API 참조](api/overview)) |

## 도움이 필요하신가요?

- 사이드바를 사용하여 문서를 탐색하세요
- 통합 세부 정보는 [API 참조](api/overview)를 확인하세요
- 도움이 필요하시면 [support@netreconapp.com](mailto:support@netreconapp.com)으로 연락하세요
