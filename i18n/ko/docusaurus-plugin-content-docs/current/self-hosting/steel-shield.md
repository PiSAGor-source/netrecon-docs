---
sidebar_position: 3
title: Steel Shield
description: 자체 호스팅 배포를 위한 보안 강화 기능
---

# Steel Shield

Steel Shield는 NetRecon의 보안 강화 프레임워크입니다. 자체 호스팅 배포를 위한 다중 보호 계층을 제공하여 모든 플랫폼 구성 요소의 무결성과 진정성을 보장합니다.

## 개요

Steel Shield는 네 가지 핵심 보안 메커니즘을 포함합니다:

| 기능 | 목적 |
|---|---|
| **바이너리 무결성** | 실행 파일이 변조되지 않았는지 검증 |
| **인증서 피닝** | API 통신에 대한 중간자 공격 방지 |
| **변조 대응** | 무단 수정 감지 및 대응 |
| **런타임 보호** | 메모리 조작 및 디버깅으로부터 보호 |

## 바이너리 무결성 검증

모든 NetRecon 바이너리(Probe 백엔드, 에이전트, 서비스)는 디지털 서명됩니다. 시작 시 각 구성 요소가 자체 무결성을 검증합니다.

### 작동 방식

1. 빌드 중에 각 바이너리가 NetRecon이 보유한 개인 키로 서명됩니다
2. 서명이 바이너리 메타데이터에 포함됩니다
3. 시작 시 바이너리가 자신의 SHA-256 해시를 계산합니다
4. 해시가 포함된 서명과 비교 검증됩니다
5. 검증 실패 시 바이너리가 시작을 거부하고 경고를 기록합니다

### 수동 검증

바이너리의 무결성을 수동으로 검증:

```bash
# Probe 백엔드 검증
netrecon-verify /usr/local/bin/netrecon-probe

# 에이전트 검증
netrecon-verify /usr/local/bin/netrecon-agent

# 예상 출력:
# Binary: /usr/local/bin/netrecon-probe
# SHA-256: a1b2c3d4e5f6...
# Signature: VALID
# Signed by: NetRecon Build System
# Signed at: 2026-03-15T10:00:00Z
```

### Docker 이미지 검증

Docker 이미지는 Docker Content Trust (DCT)를 사용하여 서명됩니다:

```bash
# Content Trust 활성화
export DOCKER_CONTENT_TRUST=1

# 서명 검증과 함께 풀
docker pull netrecon/api-gateway:latest
```

## 인증서 피닝

인증서 피닝은 NetRecon 구성 요소가 합법적인 서버와만 통신하도록 보장하여, 인증 기관이 손상되더라도 가로채기를 방지합니다.

### 피닝된 연결

| 연결 | 피닝 유형 |
|---|---|
| 에이전트 → Probe | 공개 키 핀 |
| Admin Connect → Probe | 인증서 지문 |
| Probe → Update Server | 공개 키 핀 |
| Probe → License Server | 인증서 지문 |

### 작동 방식

1. 예상 인증서 공개 키 해시가 각 클라이언트 바이너리에 포함됩니다
2. TLS 연결 수립 시 클라이언트가 서버의 공개 키를 추출합니다
3. 클라이언트가 공개 키의 SHA-256 해시를 계산합니다
4. 해시가 피닝된 값과 일치하지 않으면 연결이 거부됩니다
5. 핀 검증 실패 시 보안 경고가 트리거됩니다

### 핀 교체

인증서 교체 시:

1. 인증서 변경 전에 업데이트 서버를 통해 새 핀이 배포됩니다
2. 전환 기간 동안 이전 핀과 새 핀 모두 유효합니다
3. 전환 후 다음 업데이트에서 이전 핀이 제거됩니다

자체 호스팅 배포의 경우 구성에서 핀을 업데이트하세요:

```yaml
# /etc/netrecon/security.yaml
certificate_pins:
  api_gateway:
    - "sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="  # Current
    - "sha256/BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB="  # Backup
```

## 변조 대응

Steel Shield는 중요 파일 및 구성에 대한 무단 변경을 모니터링합니다.

### 모니터링 항목

| 항목 | 확인 빈도 | 대응 |
|---|---|---|
| 바이너리 파일 | 시작 시 + 매 1시간 | 경고 + 선택적 종료 |
| 구성 파일 | 매 5분 | 경고 + 백업으로 복원 |
| 데이터베이스 무결성 | 매 15분 | 경고 + 일관성 검사 |
| TLS 인증서 | 매 5분 | 변경 시 경고 |
| 시스템 패키지 | 매일 | 예상치 못한 변경 시 경고 |

### 대응 조치

변조가 감지되면 Steel Shield는 다음을 수행할 수 있습니다:

1. **기록** — 보안 감사 로그에 이벤트 기록
2. **경고** — 구성된 채널을 통해 알림 전송
3. **복원** — 알려진 정상 백업에서 변조된 파일 복원
4. **격리** — 관리 전용으로 네트워크 접근 제한
5. **종료** — 추가 손상 방지를 위해 서비스 중지

대응 수준 구성:

```yaml
# /etc/netrecon/security.yaml
tamper_response:
  level: "alert_and_revert"  # Options: log, alert, alert_and_revert, isolate, shutdown
  notify_email: "security@yourcompany.com"
```

### 파일 무결성 데이터베이스

Steel Shield는 모든 보호 파일의 해시 데이터베이스를 유지합니다:

```bash
# 무결성 데이터베이스 초기화
netrecon-shield init

# 수동으로 무결성 확인
netrecon-shield verify

# 예상 출력:
# Checked 47 files
# Status: ALL INTACT
# Last verified: 2026-03-15T14:30:00Z
```

## 런타임 보호

### 안티 디버깅

프로덕션 모드에서 NetRecon 바이너리에는 안티 디버깅 조치가 포함됩니다:
- 연결된 디버거 감지 (Linux의 ptrace, Windows의 IsDebuggerPresent)
- 단일 단계 실행에 대한 타이밍 검사
- 프로덕션에서 디버깅이 감지되면 프로세스가 정상적으로 종료됩니다

:::info
안티 디버깅은 개발 빌드에서는 비활성화되어 정상적인 디버깅 워크플로를 허용합니다.
:::

### 메모리 보호

- 민감한 데이터(토큰, 키, 비밀번호)는 보호된 메모리 영역에 저장됩니다
- 잔여 데이터 노출을 방지하기 위해 사용 후 메모리가 0으로 초기화됩니다
- Linux에서는 민감한 페이지가 디스크로 스왑되는 것을 방지하기 위해 `mlock`이 사용됩니다

## 구성

### Steel Shield 활성화

Steel Shield는 프로덕션 배포에서 기본적으로 활성화됩니다. 다음에서 구성하세요:

```yaml
# /etc/netrecon/security.yaml
steel_shield:
  enabled: true
  binary_integrity: true
  certificate_pinning: true
  tamper_response: true
  runtime_protection: true
  integrity_check_interval: 3600  # seconds
  tamper_check_interval: 300      # seconds
```

### 개발 환경에서 비활성화

개발 및 테스트 환경의 경우:

```yaml
steel_shield:
  enabled: false
```

또는 특정 기능만 비활성화:

```yaml
steel_shield:
  enabled: true
  binary_integrity: false   # 개발 중 해시 검증 건너뛰기
  runtime_protection: false  # 디버거 연결 허용
```

## 감사 추적

모든 Steel Shield 이벤트는 보안 감사 로그에 기록됩니다:

```bash
# 최근 보안 이벤트 보기
netrecon-shield audit --last 24h

# 감사 로그 내보내기
netrecon-shield audit --export csv --output security-audit.csv
```

감사 로그 항목에는 다음이 포함됩니다:
- 타임스탬프
- 이벤트 유형 (integrity_check, pin_validation, tamper_detected 등)
- 영향을 받는 구성 요소
- 결과 (통과/실패)
- 수행된 조치
- 추가 세부 정보

## 자체 호스팅 시 고려 사항

자체 호스팅 시 다음 사항을 유의하세요:

1. **맞춤 인증서**: 자체 CA를 사용하는 경우 배포 후 인증서 핀 구성을 업데이트하세요
2. **바이너리 업데이트**: 바이너리를 업데이트한 후 `netrecon-shield init`를 실행하여 무결성 데이터베이스를 재구축하세요
3. **무결성 데이터베이스 백업**: `/etc/netrecon/integrity.db`를 백업 루틴에 포함하세요
4. **경고 모니터링**: 변조 경고를 위한 이메일 또는 웹훅 알림을 구성하세요

## FAQ

**Q: Steel Shield가 오탐지를 유발할 수 있나요?**
A: 오탐지는 드물지만 공유 라이브러리를 수정하는 시스템 업데이트 후에 발생할 수 있습니다. 시스템 업데이트 후 `netrecon-shield init`를 실행하여 무결성 데이터베이스를 새로 고치세요.

**Q: Steel Shield가 성능에 영향을 미치나요?**
A: 성능 영향은 미미합니다. 무결성 검사는 백그라운드 스레드에서 실행되며 일반적으로 1초 이내에 완료됩니다.

**Q: Steel Shield 경고를 SIEM과 통합할 수 있나요?**
A: 네. 보안 구성에서 syslog 출력을 구성하여 이벤트를 SIEM으로 전달하세요. Steel Shield는 syslog (RFC 5424) 및 JSON 출력 형식을 지원합니다.

**Q: 프로덕션 배포에 Steel Shield가 필수인가요?**
A: Steel Shield는 강력히 권장되지만 엄격하게 필수는 아닙니다. 비활성화할 수 있지만, 그렇게 하면 중요한 보안 보호가 제거됩니다.

추가 도움이 필요하시면 [support@netreconapp.com](mailto:support@netreconapp.com)으로 연락하세요.
