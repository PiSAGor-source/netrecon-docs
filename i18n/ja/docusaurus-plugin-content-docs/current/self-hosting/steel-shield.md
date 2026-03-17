---
sidebar_position: 3
title: Steel Shield
description: セルフホストデプロイメント向けセキュリティ強化機能
---

# Steel Shield

Steel ShieldはNetReconのセキュリティ強化フレームワークです。セルフホストデプロイメントに複数の保護レイヤーを提供し、すべてのプラットフォームコンポーネントの整合性と信頼性を確保します。

## 概要

Steel Shieldには4つのコアセキュリティメカニズムが含まれます：

| 機能 | 目的 |
|---|---|
| **バイナリ整合性** | 実行ファイルが改ざんされていないことを検証 |
| **証明書ピンニング** | API通信の中間者攻撃を防止 |
| **改ざん対応** | 不正な変更を検出し対応 |
| **ランタイム保護** | メモリ操作やデバッグからの防御 |

## バイナリ整合性検証

すべてのNetReconバイナリ（Probeバックエンド、エージェント、サービス）はデジタル署名されています。起動時に各コンポーネントが自身の整合性を検証します。

### 仕組み

1. ビルド時に、各バイナリがNetReconが保持する秘密鍵で署名されます
2. 署名はバイナリのメタデータに埋め込まれます
3. 起動時に、バイナリが自身のSHA-256ハッシュを計算します
4. ハッシュが埋め込まれた署名と照合されます
5. 検証に失敗した場合、バイナリは起動を拒否しアラートをログに記録します

### 手動検証

バイナリの整合性を手動で検証：

```bash
# Probeバックエンドの検証
netrecon-verify /usr/local/bin/netrecon-probe

# エージェントの検証
netrecon-verify /usr/local/bin/netrecon-agent

# 期待される出力：
# Binary: /usr/local/bin/netrecon-probe
# SHA-256: a1b2c3d4e5f6...
# Signature: VALID
# Signed by: NetRecon Build System
# Signed at: 2026-03-15T10:00:00Z
```

### Dockerイメージの検証

DockerイメージはDocker Content Trust (DCT)を使用して署名されます：

```bash
# コンテンツトラストの有効化
export DOCKER_CONTENT_TRUST=1

# 署名検証付きのプル
docker pull netrecon/api-gateway:latest
```

## 証明書ピンニング

証明書ピンニングにより、NetReconコンポーネントは正当なサーバーとのみ通信し、認証局が侵害されても傍受を防ぎます。

### ピン留めされた接続

| 接続 | ピンニングタイプ |
|---|---|
| エージェントからProbe | 公開鍵ピン |
| Admin ConnectからProbe | 証明書フィンガープリント |
| ProbeからUpdate Server | 公開鍵ピン |
| ProbeからLicense Server | 証明書フィンガープリント |

### 仕組み

1. 期待される証明書の公開鍵ハッシュが各クライアントバイナリに埋め込まれます
2. TLS接続確立時にクライアントがサーバーの公開鍵を抽出します
3. クライアントが公開鍵のSHA-256ハッシュを計算します
4. ハッシュがピン留めされた値と一致しない場合、接続が拒否されます
5. ピン検証の失敗がセキュリティアラートをトリガーします

### ピンのローテーション

証明書がローテーションされる場合：

1. 証明書変更前にアップデートサーバー経由で新しいピンが配布されます
2. 移行期間中は古いピンと新しいピンの両方が有効です
3. 移行後、次のアップデートで古いピンが削除されます

セルフホストデプロイメントの場合、設定でピンを更新：

```yaml
# /etc/netrecon/security.yaml
certificate_pins:
  api_gateway:
    - "sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="  # 現在
    - "sha256/BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB="  # バックアップ
```

## 改ざん対応

Steel Shieldは重要なファイルと設定の不正な変更を監視します。

### 監視対象

| 項目 | 確認頻度 | 対応 |
|---|---|---|
| バイナリファイル | 起動時 + 1時間ごと | アラート + オプションのシャットダウン |
| 設定ファイル | 5分ごと | アラート + バックアップへの復元 |
| データベース整合性 | 15分ごと | アラート + 一貫性チェック |
| TLS証明書 | 5分ごと | 変更があればアラート |
| システムパッケージ | 毎日 | 予期しない変更があればアラート |

### 対応アクション

改ざんが検出された場合、Steel Shieldは以下を実行できます：

1. **ログ** — セキュリティ監査ログにイベントを記録
2. **アラート** — 設定されたチャネル経由で通知を送信
3. **復元** — 既知の正常なバックアップから改ざんされたファイルを復元
4. **隔離** — ネットワークアクセスを管理専用に制限
5. **シャットダウン** — さらなる侵害を防ぐためにサービスを停止

対応レベルの設定：

```yaml
# /etc/netrecon/security.yaml
tamper_response:
  level: "alert_and_revert"  # オプション: log, alert, alert_and_revert, isolate, shutdown
  notify_email: "security@yourcompany.com"
```

### ファイル整合性データベース

Steel Shieldは保護されたすべてのファイルのハッシュデータベースを維持します：

```bash
# 整合性データベースの初期化
netrecon-shield init

# 手動で整合性を確認
netrecon-shield verify

# 期待される出力：
# Checked 47 files
# Status: ALL INTACT
# Last verified: 2026-03-15T14:30:00Z
```

## ランタイム保護

### デバッグ対策

本番モードでは、NetReconバイナリにデバッグ対策が含まれます：
- アタッチされたデバッガの検出（Linuxではptrace、WindowsではIsDebuggerPresent）
- シングルステップ実行のタイミングチェック
- 本番環境でデバッグが検出された場合、プロセスは正常に終了します

:::info
デバッグ対策は、通常のデバッグワークフローを可能にするため、開発ビルドでは無効化されています。
:::

### メモリ保護

- 機密データ（トークン、キー、パスワード）は保護されたメモリ領域に保存されます
- 残留データの露出を防ぐため、使用後にメモリがゼロクリアされます
- Linuxでは、`mlock`を使用して機密ページがディスクにスワップされるのを防ぎます

## 設定

### Steel Shieldの有効化

Steel Shieldは本番デプロイメントでデフォルトで有効です。以下で設定：

```yaml
# /etc/netrecon/security.yaml
steel_shield:
  enabled: true
  binary_integrity: true
  certificate_pinning: true
  tamper_response: true
  runtime_protection: true
  integrity_check_interval: 3600  # 秒
  tamper_check_interval: 300      # 秒
```

### 開発用の無効化

開発・テスト環境の場合：

```yaml
steel_shield:
  enabled: false
```

または特定の機能を無効化：

```yaml
steel_shield:
  enabled: true
  binary_integrity: false   # 開発中のハッシュ検証をスキップ
  runtime_protection: false  # デバッガのアタッチを許可
```

## 監査証跡

すべてのSteel Shieldイベントはセキュリティ監査ログに記録されます：

```bash
# 最近のセキュリティイベントを表示
netrecon-shield audit --last 24h

# 監査ログのエクスポート
netrecon-shield audit --export csv --output security-audit.csv
```

監査ログエントリには以下が含まれます：
- タイムスタンプ
- イベントタイプ（integrity_check、pin_validation、tamper_detectedなど）
- 影響を受けたコンポーネント
- 結果（合格/不合格）
- 実行されたアクション
- 追加の詳細

## セルフホスト時の注意事項

セルフホストする場合、以下に留意してください：

1. **カスタム証明書**：独自のCAを使用する場合、デプロイ後に証明書ピンの設定を更新してください
2. **バイナリの更新**：バイナリの更新後、`netrecon-shield init`を実行して整合性データベースを再構築してください
3. **整合性データベースのバックアップ**：バックアップルーチンに`/etc/netrecon/integrity.db`を含めてください
4. **アラートの監視**：改ざんアラート用にメールまたはWebhook通知を設定してください

## よくある質問

**Q：Steel Shieldは誤検知を引き起こしますか？**
A：誤検知はまれですが、共有ライブラリを変更するシステムアップデート後に発生する可能性があります。システムアップデート後に`netrecon-shield init`を実行して整合性データベースを更新してください。

**Q：Steel Shieldはパフォーマンスに影響しますか？**
A：パフォーマンスへの影響は最小限です。整合性チェックはバックグラウンドスレッドで実行され、通常1秒以内に完了します。

**Q：Steel ShieldのアラートをSIEMと統合できますか？**
A：はい。セキュリティ設定でsyslog出力を設定して、イベントをSIEMに転送できます。Steel Shieldはsyslog（RFC 5424）およびJSON出力フォーマットをサポートしています。

**Q：本番デプロイメントにSteel Shieldは必須ですか？**
A：Steel Shieldは強く推奨されますが、厳密には必須ではありません。無効にすることは可能ですが、重要なセキュリティ保護が失われます。

追加のヘルプが必要な場合は[support@netreconapp.com](mailto:support@netreconapp.com)までお問い合わせください。
