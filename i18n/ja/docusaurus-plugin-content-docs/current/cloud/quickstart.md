---
sidebar_position: 1
title: クイックスタート
description: NetRecon Cloudを数分で始める
---

# クラウドクイックスタート

NetRecon Cloudは最も速く始められる方法です。サーバーのセットアップもDockerも不要 — サインアップしてProbeをデプロイし、ネットワークの検出を開始するだけです。

## ステップ1：アカウントの作成

1. [app.netreconapp.com](https://app.netreconapp.com)にアクセスし、**サインアップ**をクリック
2. メールアドレス、会社名、パスワードを入力
3. メールアドレスを確認
4. NetReconダッシュボードにログイン

## ステップ2：最初のサイトの追加

1. ダッシュボードで、サイドバーの**サイト**に移動
2. **サイトを追加**をクリック
3. サイトの名前と住所を入力（例：「本社 — 東京」）
4. サイトを保存

## ステップ3：Probeのデプロイ

各サイトには、ネットワーク検出と監視のために少なくとも1つのProbeが必要です。

### オプションA：NetRecon OS（推奨）

1. **サイト → [あなたのサイト] → Probe → Probeを追加**に移動
2. **NetRecon OS**を選択し、ハードウェアに適したイメージをダウンロード
3. [balenaEtcher](https://etcher.balena.io/)を使用してSDカードまたはSSDにイメージを書き込み
4. イーサネット経由でProbeをネットワークに接続
5. 電源をオン — ProbeはCloudflare Tunnel経由でクラウドアカウントに自動接続

### オプションB：既存サーバー上のDocker

```bash
# Probeコンテナをプルして実行
docker run -d \
  --name netrecon-probe \
  --network host \
  --restart unless-stopped \
  -e ENROLLMENT_TOKEN="your-token-from-dashboard" \
  netrecon/probe:latest
```

登録トークンは**サイト → [あなたのサイト] → Probe → Probeを追加 → Docker**から取得してください。

### オプションC：仮想マシン

1. ダッシュボードからOVAファイルをダウンロード
2. VMware、Proxmox、またはHyper-Vにインポート
3. **ブリッジネットワーキング**でVMを構成（レイヤー2スキャンに必要）
4. VMを起動 — ダッシュボードに自動的に表示されます

## ステップ4：スキャンの開始

Probeがオンラインになったら：

1. **サイト → [あなたのサイト] → デバイス**に移動
2. **今すぐスキャン**をクリックするか、自動検出を待つ（15分ごとに実行）
3. 検出されたデバイスがデバイスインベントリに表示されます

## ステップ5：モバイルアプリのインストール

Google Play Storeから**NetRecon Scanner**をダウンロードして、外出先でネットワークスキャン：

- スマートフォンが接続されている任意のネットワークをスキャン
- 結果はクラウドダッシュボードに自動同期
- 詳細は[Scannerの概要](../scanner/overview)をご覧ください

## 次のステップ

- **エージェントのデプロイ** — エンドポイントの詳細な可視化のため → [エージェントのインストール](../agents/overview)
- **アラートの設定** — 新しいデバイス、脆弱性、またはダウンタイムに対して
- **統合の設定** — 既存のツール（LDAP、SIEM、Jira、ServiceNow）と連携
- **チームの招待** — **設定 → チーム管理**から

## クラウド vs セルフホスト

| 機能 | クラウド | セルフホスト |
|---|---|---|
| サーバー管理 | NetReconが管理 | お客様が管理 |
| データの場所 | NetRecon Cloud (EU) | お客様のインフラストラクチャ |
| アップデート | 自動 | 手動 (docker pull) |
| Cloudflare Tunnel | 含まれる | お客様が設定 |
| 料金 | サブスクリプション | ライセンスキー |

セルフホストが必要ですか？[インストールガイド](../self-hosting/installation)をご覧ください。

サポートが必要な場合は[support@netreconapp.com](mailto:support@netreconapp.com)までお問い合わせください。
