---
sidebar_position: 3
title: 設定
description: セルフホストNetReconの環境変数と設定リファレンス
---

# 設定リファレンス

すべてのNetReconサービスは、`/opt/netrecon/.env`にある単一の`.env`ファイルを通じて設定されます。このページでは利用可能なすべての環境変数を説明します。

## 基本設定

| 変数 | 必須 | デフォルト | 説明 |
|---|---|---|---|
| `NETRECON_DOMAIN` | はい | — | お客様のドメイン名（例：`netrecon.yourcompany.com`） |
| `NETRECON_EMAIL` | はい | — | Let's Encryptおよび通知用の管理者メール |

## データベース（PostgreSQL）

| 変数 | 必須 | デフォルト | 説明 |
|---|---|---|---|
| `POSTGRES_USER` | はい | — | PostgreSQLユーザー名 |
| `POSTGRES_PASSWORD` | はい | — | PostgreSQLパスワード |
| `POSTGRES_DB` | はい | `netrecon` | データベース名 |
| `DATABASE_URL` | 自動 | — | 上記の値から自動的に構築 |

:::tip
強力なランダムパスワードを使用してください。以下のコマンドで生成できます：
```bash
openssl rand -base64 24
```
:::

## キャッシュ（Redis）

| 変数 | 必須 | デフォルト | 説明 |
|---|---|---|---|
| `REDIS_PASSWORD` | はい | — | Redis認証パスワード |
| `REDIS_URL` | 自動 | — | 自動的に構築 |

## 認証

| 変数 | 必須 | デフォルト | 説明 |
|---|---|---|---|
| `JWT_SECRET` | はい | — | JWTトークン署名用のシークレットキー（最低32文字） |
| `JWT_EXPIRE_MINUTES` | いいえ | `1440` | トークンの有効期限（デフォルト：24時間） |

安全なJWTシークレットの生成：
```bash
openssl rand -hex 32
```

## Agent Registry

| 変数 | 必須 | デフォルト | 説明 |
|---|---|---|---|
| `AGENT_REGISTRY_SECRET` | はい | — | エージェント登録用シークレット |
| `AGENT_JWT_SECRET` | はい | — | エージェント認証用JWTシークレット |
| `AGENT_TOKEN_EXPIRE_MINUTES` | いいえ | `1440` | エージェントトークンの有効期限 |
| `AGENT_HEARTBEAT_INTERVAL` | いいえ | `30` | ハートビート間隔（秒） |
| `AGENT_HEARTBEAT_TIMEOUT` | いいえ | `90` | エージェントをオフラインとマークするまでの秒数 |

## メール（SMTP）

| 変数 | 必須 | デフォルト | 説明 |
|---|---|---|---|
| `SMTP_HOST` | はい | — | SMTPサーバーホスト名 |
| `SMTP_PORT` | いいえ | `587` | SMTPポート（STARTTLSは587、SSLは465） |
| `SMTP_USER` | はい | — | SMTPユーザー名 |
| `SMTP_PASSWORD` | はい | — | SMTPパスワード |
| `SMTP_FROM` | はい | — | 送信者アドレス（例：`NetRecon <noreply@yourcompany.com>`） |

## ライセンス

| 変数 | 必須 | デフォルト | 説明 |
|---|---|---|---|
| `LICENSE_KEY` | はい | — | NetReconライセンスキー |

ライセンスキーの取得は[sales@netreconapp.com](mailto:sales@netreconapp.com)にお問い合わせください。

## バックアップサービス

| 変数 | 必須 | デフォルト | 説明 |
|---|---|---|---|
| `BACKUP_S3_ENDPOINT` | いいえ | — | S3互換ストレージのエンドポイント |
| `BACKUP_S3_BUCKET` | いいえ | — | バックアップ用バケット名 |
| `BACKUP_S3_ACCESS_KEY` | いいえ | — | S3アクセスキー |
| `BACKUP_S3_SECRET_KEY` | いいえ | — | S3シークレットキー |
| `BACKUP_ENCRYPTION_KEY` | いいえ | — | バックアップ用AES-256-GCM暗号化キー |
| `BACKUP_RETENTION_DAYS` | いいえ | `30` | バックアップファイルの保持日数 |

## 通知

| 変数 | 必須 | デフォルト | 説明 |
|---|---|---|---|
| `TELEGRAM_BOT_TOKEN` | いいえ | — | アラート用Telegramボットトークン |
| `TELEGRAM_CHAT_ID` | いいえ | — | アラート配信用TelegramチャットID |

## `.env`ファイルの例

```bash
# 基本
NETRECON_DOMAIN=netrecon.yourcompany.com
NETRECON_EMAIL=admin@yourcompany.com

# PostgreSQL
POSTGRES_USER=netrecon
POSTGRES_PASSWORD=xK9mP2vL8nQ4wR7j
POSTGRES_DB=netrecon

# Redis
REDIS_PASSWORD=hT6yN3bF9cM1pW5s

# 認証
JWT_SECRET=a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2

# Agent Registry
AGENT_REGISTRY_SECRET=r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3
AGENT_JWT_SECRET=h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9

# メール
SMTP_HOST=smtp.yourcompany.com
SMTP_PORT=587
SMTP_USER=noreply@yourcompany.com
SMTP_PASSWORD=your-smtp-password
SMTP_FROM=NetRecon <noreply@yourcompany.com>

# ライセンス
LICENSE_KEY=your-license-key
```

:::warning
`.env`ファイルをバージョン管理にコミットしないでください。上記に示されたすべての値は例です — デプロイ前にお客様自身の安全な値に置き換えてください。
:::

## 設定変更の適用

`.env`ファイルを変更した後、影響を受けるサービスを再起動してください：

```bash
cd /opt/netrecon

# すべてのサービスを再起動
docker compose down && docker compose up -d

# または特定のサービスを再起動
docker compose restart api-gateway
```

## サービスポート

すべてのサービスはNginxリバースプロキシの背後でポート80/443で実行されます。内部サービスポートはデフォルトでは公開されません：

| サービス | 内部ポート | 説明 |
|---|---|---|
| API Gateway | 8000 | メインAPIエンドポイント |
| Vault Server | 8001 | シークレット管理 |
| License Server | 8002 | ライセンス検証 |
| Email Service | 8003 | SMTPリレー |
| Notification Service | 8004 | プッシュ通知とアラート |
| Update Server | 8005 | エージェントとProbeのアップデート |
| Agent Registry | 8006 | エージェントの登録と管理 |
| Warranty Service | 8007 | ハードウェア保証の検索 |
| CMod Service | 8008 | 構成管理 |
| IPAM Service | 8009 | IPアドレス管理 |

サービスポートを直接公開するには（本番環境には非推奨）、`docker-compose.yml`のサービスの`ports`マッピングに追加してください。

サポートが必要な場合は[support@netreconapp.com](mailto:support@netreconapp.com)までお問い合わせください。
