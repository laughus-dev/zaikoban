# 在庫番 (Zaikoban) - 飲食店向け在庫管理システム

![Version](https://img.shields.io/badge/version-0.0.0-blue.svg)
![License](https://img.shields.io/badge/license-private-red.svg)
![React](https://img.shields.io/badge/React-19.1.1-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178c6.svg)

## 📋 概要

**在庫番（ザイコバン）**は、飲食店向けの在庫管理Webアプリケーションです。食材・備品の在庫管理を効率化し、適切な発注タイミングの把握、食材ロスの削減、棚卸し作業の簡素化を実現します。

### 現在の開発状況

- 🔧 **フェーズ**: プロトタイプ開発中
- 📊 **データ**: モックデータを使用した動作確認段階
- 🎨 **UI**: 全画面実装完了、レスポンシブ対応済み

## 🚀 デモサイト

[https://laughus-dev.github.io/zaikoban/](https://laughus-dev.github.io/zaikoban/)

## ✨ 主要機能

- 📦 **在庫管理** - リアルタイムの在庫数表示と管理
- 📝 **発注管理** - 自動発注提案と発注書作成
- 📊 **分析レポート** - 在庫推移、回転率、ロス分析
- 👥 **ユーザー管理** - 権限管理（管理者/スタッフ）
- 🏪 **マルチ店舗対応** - 複数店舗の在庫管理
- 📱 **レスポンシブ対応** - タブレット・PC・スマートフォン対応

## 🛠️ 技術スタック

### フロントエンド

- **React** (v19.1.1) - UIライブラリ
- **TypeScript** (v5.8.3) - 型安全な開発
- **Vite** (v7.1.2) - 高速ビルドツール
- **Chakra UI** (v3.26.0) - UIコンポーネントライブラリ
- **Zustand** (v5.0.8) - 状態管理
- **React Router** (v7.8.2) - ルーティング
- **Recharts** (v3.1.2) - チャートライブラリ

### 開発ツール

- **ESLint** - コード品質管理
- **PWA対応** - オフライン対応（vite-plugin-pwa）

## 📦 インストール

```bash
# リポジトリのクローン
git clone https://github.com/laughus-dev/zaikoban.git
cd zaikoban

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

## 🔧 利用可能なスクリプト

```bash
npm run dev          # 開発サーバーの起動（http://localhost:5173）
npm run build        # プロダクションビルド
npm run preview      # ビルドしたアプリのプレビュー
npm run lint         # ESLintによるコードチェック
npm run clean        # node_modulesとdistを削除
npm run reinstall    # クリーンインストール
npm run kill-port    # ポート5173を解放
```

## 📁 プロジェクト構成

```
zaikoban/
├── src/
│   ├── components/       # UIコンポーネント
│   │   ├── common/      # 共通コンポーネント
│   │   └── layout/      # レイアウトコンポーネント
│   ├── pages/           # 画面コンポーネント
│   ├── data/            # モックデータ
│   ├── store/           # Zustand状態管理
│   ├── theme/           # Chakra UIテーマ設定
│   └── types/           # TypeScript型定義
├── public/              # 静的ファイル
├── inventory-app-requirements.md  # 要件定義書
├── TECHNICAL_DOCUMENTATION.md     # 技術仕様書
└── CLAUDE.md           # 開発ガイドライン
```

## 💻 開発ガイドライン

### コーディング規約

- **Chakra UI v3 API必須** - 旧v2 APIは使用禁止
- **TypeScript Strict Mode** - 型安全性を最優先
- **共通コンポーネント再利用** - `src/components/common/`から利用
- **モックデータ利用** - `src/data/mockData.ts`からデータ取得

### ブランチ戦略

- `master` - メインブランチ（GitHub Pagesデプロイ用）
- `develop` - 開発ブランチ
- `feature/*` - 機能開発ブランチ

## 📖 ドキュメント

- 📋 [要件定義書](./inventory-app-requirements.md) - 機能要件と非機能要件
- 📖 [技術仕様書](./TECHNICAL_DOCUMENTATION.md) - 詳細な技術仕様
- 📝 [開発ガイド](./CLAUDE.md) - AIアシスタント向け指示書

## 🎯 今後の実装予定

- [ ] バックエンドAPI実装
- [ ] データベース連携
- [ ] 認証システム実装
- [ ] バーコード読取機能
- [ ] PDF出力機能
- [ ] メール通知機能

## 📄 ライセンス

このプロジェクトはプライベートライセンスです。

## 👤 開発者

**Laughus Dev**

- GitHub: [@laughus-dev](https://github.com/laughus-dev)

---

*現在プロトタイプ開発中です。本番環境での使用はお控えください。*