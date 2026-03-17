---
slug: /
sidebar_position: 1
title: NetReconを始めよう
description: MSPおよびITチーム向けネットワークインテリジェンスプラットフォーム
---

# NetReconを始めよう

NetReconは、MSPおよびITチーム向けに構築されたネットワークインテリジェンスプラットフォームです。自動ネットワーク検出、デバイスインベントリ、脆弱性スキャン、構成管理、リアルタイム監視を提供し、一元化されたダッシュボード、モバイルアプリ、REST APIを通じてすべてにアクセスできます。

## デプロイ方式の選択

<div className="row" style={{marginTop: '1.5rem'}}>

<div className="col col--6" style={{marginBottom: '1rem'}}>

### セルフホスト

Docker Composeを使用して、お客様自身のインフラストラクチャにNetReconをデプロイします。データを完全に管理でき、外部依存関係がありません。

- [システム要件](self-hosting/requirements)
- [インストールガイド](self-hosting/installation)
- [設定リファレンス](self-hosting/configuration)

**最適な用途：** 厳格なデータ主権要件、エアギャップネットワーク、または既存のサーバーインフラストラクチャを持つ組織。

</div>

<div className="col col--6" style={{marginBottom: '1rem'}}>

### クラウド（SaaS）

NetRecon Cloudですぐに始められます。サーバーのセットアップは不要 — Probeをデプロイしてスキャンを開始するだけです。

- [クイックスタートガイド](cloud/quickstart)

**最適な用途：** サーバーインフラストラクチャの管理なしで、すぐに使い始めたいチーム。

</div>

</div>

## プラットフォームコンポーネント

| コンポーネント | 説明 |
|---|---|
| **ダッシュボード** | すべてのNetRecon機能のためのWebベースのコントロールパネル |
| **NetRecon Scanner** | 外出先でのネットワークスキャン用Androidアプリ（[詳細](scanner/overview)） |
| **Admin Connect** | リモート管理用Androidマネジメントアプリ（[詳細](admin-connect/overview)） |
| **エージェント** | Windows、macOS、Linuxエンドポイント用の軽量エージェント（[インストール](agents/overview)） |
| **Probe** | 継続的な監視のためのハードウェアまたはVMベースのネットワークセンサー |
| **API** | 自動化と統合のためのRESTful API（[APIリファレンス](api/overview)） |

## ヘルプが必要ですか？

- サイドバーを使用してドキュメントを閲覧してください
- 統合の詳細については[APIリファレンス](api/overview)をご確認ください
- サポートが必要な場合は[support@netreconapp.com](mailto:support@netreconapp.com)までお問い合わせください
