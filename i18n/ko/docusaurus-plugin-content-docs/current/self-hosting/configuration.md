---
sidebar_position: 3
title: 구성
description: 자체 호스팅 NetRecon의 환경 변수 및 구성 참조
---

# 구성 참조

모든 NetRecon 서비스는 `/opt/netrecon/.env`에 위치한 단일 `.env` 파일을 통해 구성됩니다. 이 페이지에서는 사용 가능한 모든 환경 변수를 설명합니다.

## 핵심 설정

| 변수 | 필수 | 기본값 | 설명 |
|---|---|---|---|
| `NETRECON_DOMAIN` | 예 | — | 도메인 이름 (예: `netrecon.yourcompany.com`) |
| `NETRECON_EMAIL` | 예 | — | Let's Encrypt 및 알림용 관리자 이메일 |

## 데이터베이스 (PostgreSQL)

| 변수 | 필수 | 기본값 | 설명 |
|---|---|---|---|
| `POSTGRES_USER` | 예 | — | PostgreSQL 사용자 이름 |
| `POSTGRES_PASSWORD` | 예 | — | PostgreSQL 비밀번호 |
| `POSTGRES_DB` | 예 | `netrecon` | 데이터베이스 이름 |
| `DATABASE_URL` | 자동 | — | 위 값에서 자동으로 구성됨 |

:::tip
강력하고 무작위로 생성된 비밀번호를 사용하세요. 다음 명령으로 생성할 수 있습니다:
```bash
openssl rand -base64 24
```
:::

## 캐시 (Redis)

| 변수 | 필수 | 기본값 | 설명 |
|---|---|---|---|
| `REDIS_PASSWORD` | 예 | — | Redis 인증 비밀번호 |
| `REDIS_URL` | 자동 | — | 자동으로 구성됨 |

## 인증

| 변수 | 필수 | 기본값 | 설명 |
|---|---|---|---|
| `JWT_SECRET` | 예 | — | JWT 토큰 서명을 위한 비밀 키 (최소 32자) |
| `JWT_EXPIRE_MINUTES` | 아니오 | `1440` | 토큰 만료 시간 (기본값: 24시간) |

안전한 JWT 시크릿 생성:
```bash
openssl rand -hex 32
```

## Agent Registry

| 변수 | 필수 | 기본값 | 설명 |
|---|---|---|---|
| `AGENT_REGISTRY_SECRET` | 예 | — | 에이전트 등록을 위한 시크릿 |
| `AGENT_JWT_SECRET` | 예 | — | 에이전트 인증을 위한 JWT 시크릿 |
| `AGENT_TOKEN_EXPIRE_MINUTES` | 아니오 | `1440` | 에이전트 토큰 만료 시간 |
| `AGENT_HEARTBEAT_INTERVAL` | 아니오 | `30` | 하트비트 간격 (초) |
| `AGENT_HEARTBEAT_TIMEOUT` | 아니오 | `90` | 에이전트를 오프라인으로 표시하기까지의 시간 (초) |

## 이메일 (SMTP)

| 변수 | 필수 | 기본값 | 설명 |
|---|---|---|---|
| `SMTP_HOST` | 예 | — | SMTP 서버 호스트명 |
| `SMTP_PORT` | 아니오 | `587` | SMTP 포트 (STARTTLS: 587, SSL: 465) |
| `SMTP_USER` | 예 | — | SMTP 사용자 이름 |
| `SMTP_PASSWORD` | 예 | — | SMTP 비밀번호 |
| `SMTP_FROM` | 예 | — | 발신자 주소 (예: `NetRecon <noreply@yourcompany.com>`) |

## 라이선스

| 변수 | 필수 | 기본값 | 설명 |
|---|---|---|---|
| `LICENSE_KEY` | 예 | — | NetRecon 라이선스 키 |

라이선스 키를 받으려면 [sales@netreconapp.com](mailto:sales@netreconapp.com)으로 연락하세요.

## 백업 서비스

| 변수 | 필수 | 기본값 | 설명 |
|---|---|---|---|
| `BACKUP_S3_ENDPOINT` | 아니오 | — | S3 호환 스토리지 엔드포인트 |
| `BACKUP_S3_BUCKET` | 아니오 | — | 백업용 버킷 이름 |
| `BACKUP_S3_ACCESS_KEY` | 아니오 | — | S3 접근 키 |
| `BACKUP_S3_SECRET_KEY` | 아니오 | — | S3 시크릿 키 |
| `BACKUP_ENCRYPTION_KEY` | 아니오 | — | 백업용 AES-256-GCM 암호화 키 |
| `BACKUP_RETENTION_DAYS` | 아니오 | `30` | 백업 파일 보존 일수 |

## 알림

| 변수 | 필수 | 기본값 | 설명 |
|---|---|---|---|
| `TELEGRAM_BOT_TOKEN` | 아니오 | — | 경고용 Telegram 봇 토큰 |
| `TELEGRAM_CHAT_ID` | 아니오 | — | 경고 전달을 위한 Telegram 채팅 ID |

## `.env` 파일 예시

```bash
# 핵심
NETRECON_DOMAIN=netrecon.yourcompany.com
NETRECON_EMAIL=admin@yourcompany.com

# PostgreSQL
POSTGRES_USER=netrecon
POSTGRES_PASSWORD=xK9mP2vL8nQ4wR7j
POSTGRES_DB=netrecon

# Redis
REDIS_PASSWORD=hT6yN3bF9cM1pW5s

# 인증
JWT_SECRET=a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2

# Agent Registry
AGENT_REGISTRY_SECRET=r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3
AGENT_JWT_SECRET=h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9

# 이메일
SMTP_HOST=smtp.yourcompany.com
SMTP_PORT=587
SMTP_USER=noreply@yourcompany.com
SMTP_PASSWORD=your-smtp-password
SMTP_FROM=NetRecon <noreply@yourcompany.com>

# 라이선스
LICENSE_KEY=your-license-key
```

:::warning
`.env` 파일을 절대 버전 관리에 커밋하지 마세요. 위에 표시된 모든 값은 예시입니다 — 배포하기 전에 자체 보안 값으로 교체하세요.
:::

## 구성 변경 적용

`.env` 파일을 수정한 후 영향을 받는 서비스를 재시작하세요:

```bash
cd /opt/netrecon

# 모든 서비스 재시작
docker compose down && docker compose up -d

# 또는 특정 서비스 재시작
docker compose restart api-gateway
```

## 서비스 포트

모든 서비스는 포트 80/443의 Nginx 리버스 프록시 뒤에서 실행됩니다. 내부 서비스 포트는 기본적으로 노출되지 않습니다:

| 서비스 | 내부 포트 | 설명 |
|---|---|---|
| API Gateway | 8000 | 메인 API 엔드포인트 |
| Vault Server | 8001 | 시크릿 관리 |
| License Server | 8002 | 라이선스 검증 |
| Email Service | 8003 | SMTP 릴레이 |
| Notification Service | 8004 | 푸시 알림 및 경고 |
| Update Server | 8005 | 에이전트 및 Probe 업데이트 |
| Agent Registry | 8006 | 에이전트 등록 및 관리 |
| Warranty Service | 8007 | 하드웨어 보증 조회 |
| CMod Service | 8008 | 구성 관리 |
| IPAM Service | 8009 | IP 주소 관리 |

서비스 포트를 직접 노출하려면(프로덕션에서는 권장하지 않음) `docker-compose.yml`의 서비스 `ports` 매핑에 추가하세요.

도움이 필요하시면 [support@netreconapp.com](mailto:support@netreconapp.com)으로 연락하세요.
