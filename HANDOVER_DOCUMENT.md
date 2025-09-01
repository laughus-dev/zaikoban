# 在庫番 (Zaikoban) 開発引継ぎ資料

## 🎯 プロジェクト概要
**在庫番**は飲食店向けの在庫管理システムのプロトタイプです。非エンジニアの方へのデモンストレーションを目的として作成されました。

## 📁 プロジェクト構造と実装済みファイル

### ✅ 完全実装済みファイル

#### 1. エントリーポイント
- **`src/main.tsx`** - アプリケーションのエントリーポイント
- **`src/App.tsx`** - ルーティング設定とレイアウト管理

#### 2. 型定義・設定 
- **`src/types/index.ts`** - 全エンティティの型定義
  - User, Product, Category, Supplier, Order, StockTransaction, Alert型を定義
- **`src/config/constants.ts`** - アプリケーション定数
  - ルート定義、カテゴリ、在庫ステータス、ユーザーロール
- **`src/theme/index.ts`** - Chakra UIテーマ設定
  - ブランドカラー (#FF6B35) とコンポーネントスタイル

#### 3. ユーティリティ
- **`src/utils/formatters.ts`** - フォーマット関数
  ```typescript
  formatCurrency(amount: number) // ¥1,234形式
  formatDate(date: Date | string) // 2024/03/15形式
  formatQuantity(quantity: number, unit: string) // 10 kg形式
  isExpiringSoon(date: Date | string, days = 3) // 期限チェック
  ```
- **`src/utils/calculations.ts`** - 計算ロジック
  ```typescript
  calculateStockLevel(product: Product) // 在庫レベル判定
  calculateTurnoverRate(sold: number, avgStock: number) // 回転率
  calculateReorderPoint(usage: number, leadTime: number, safety: number)
  ```

#### 4. モックデータ
- **`src/data/mockData.ts`** - 完全な日本語デモデータ
  - 50件の商品データ（和牛、野菜、調味料など）
  - 仕入先10社
  - 発注データ
  - アラート情報
  - ダッシュボード統計

#### 5. 共通コンポーネント（100%完成）
- **`src/components/common/DataTable.tsx`** - 汎用テーブル
  - ジェネリック型対応
  - 検索、フィルタ、ソート、ページネーション機能
  - アクションメニュー対応
- **`src/components/common/StatCard.tsx`** - 統計カード
- **`src/components/common/FormField.tsx`** - フォーム入力

#### 6. レイアウトコンポーネント（100%完成）
- **`src/components/Layout/Sidebar.tsx`** - サイドバーナビゲーション
  - デスクトップ/モバイル対応
  - 折りたたみ機能
  - バッジ通知
- **`src/components/Layout/Header.tsx`** - ヘッダー
- **`src/components/Layout/MobileNav.tsx`** - モバイルナビゲーション

#### 7. 完全実装済み画面（9/9画面完成） ✅ プロトタイプ完成

##### ✅ **ログイン画面** (`src/pages/Login.tsx`)
- デモ認証情報表示
- メール: manager@zaikoban.jp
- パスワード: password
- ログイン後ダッシュボードへ遷移

##### ✅ **ダッシュボード** (`src/pages/Dashboard.tsx`)
- 在庫総額、商品数、在庫不足、期限切れ間近の統計カード
- 在庫金額推移グラフ（LineChart）
- カテゴリ別在庫比率（PieChart）
- 最近の取引一覧
- 在庫不足商品リスト
- アラート表示

##### ✅ **在庫一覧** (`src/pages/InventoryList.tsx`)
- 商品一覧表示（DataTable使用）
- カテゴリ別タブ切り替え
- 検索・フィルタ機能
- 商品詳細モーダル
- アクションメニュー（詳細/編集/発注/削除）
- 在庫ステータスバッジ表示

##### ✅ **商品マスタ** (`src/pages/Products.tsx`)
- 商品一覧表示（DataTable再利用）
- 商品追加/編集/削除モーダル
- バーコード対応
- カテゴリ・仕入先フィルタ
- CSVインポート/エクスポート機能（UI実装済み）
- 検索機能（商品名、コード、バーコード）

##### ✅ **入出庫登録** (`src/pages/StockInOut.tsx`)
- 入庫/出庫タブ切り替え
- 商品選択（ドロップダウン）
- 数量入力・仕入単価設定
- バッチ登録機能（複数商品一括）
- 入出庫履歴表示
- 仕入先選択

##### ✅ **棚卸し** (`src/pages/Stocktaking.tsx`)
- 棚卸しリスト作成・管理
- 実在庫入力インターフェース
- 差異計算・リアルタイム表示
- 進捗バー表示
- 棚卸し履歴管理
- レポート出力機能（UI実装済み）

##### ✅ **発注管理** (`src/pages/Orders.tsx`)
- 発注点以下の商品リスト表示
- 優先度別表示（緊急/中/低）
- 複数選択による一括発注書作成
- 仕入先別自動グルーピング
- 発注履歴管理
- ステータス管理（下書き/発注済/納品済/キャンセル）

##### ✅ **レポート** (`src/pages/Reports.tsx`) - 2025年1月実装
- 売上分析（月別売上推移、カテゴリ別構成、目標達成率）
- 在庫分析（在庫効率、回転率の可視化）
- 商品ランキング（TOP5、急上昇商品、要注意商品）
- AI分析による改善提案（発注最適化、売上向上、リスク管理）
- エクスポート機能（PDF、印刷、メール）のUI実装

##### ✅ **設定** (`src/pages/Settings.tsx`) - 2025年1月実装
- プロフィール設定（アバター、パスワード変更）
- 店舗情報（営業時間、定休日、地図表示）
- 商品設定（カテゴリ管理、単位マスタ、在庫アラート設定）
- 通知設定（各種アラートのON/OFF、通知方法選択）
- 画面設定（テーマカラー、文字サイズ、ダークモード）
- ユーザー管理（一覧表示、権限管理、追加/編集/削除）
- システム設定（バックアップ/リストア、キャッシュクリア）
- ヘルプ（FAQ、お問い合わせ、マニュアルダウンロード）

## 🚀 起動方法

```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev

# http://localhost:5173 でアクセス可能
```

## 📦 インストール済みパッケージ

```json
{
  "dependencies": {
    "@chakra-ui/react": "^2.8.2",
    "@emotion/react": "^11.11.4",
    "@emotion/styled": "^11.11.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.23.1",
    "react-icons": "^5.2.1",
    "recharts": "^2.12.7",
    "zustand": "^4.5.2",
    "date-fns": "^3.6.0",
    "framer-motion": "^11.2.10"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.2.2",
    "vite": "^5.3.4",
    "vite-plugin-pwa": "^0.20.0"
  }
}
```

## 🎨 デザインシステム

### カラーパレット
- **プライマリ**: #FF6B35 (オレンジ)
- **成功**: #48BB78 (緑)
- **警告**: #ED8936 (オレンジ)
- **エラー**: #F56565 (赤)
- **情報**: #4299E1 (青)

### レスポンシブブレークポイント
- **sm**: 480px
- **md**: 768px
- **lg**: 992px
- **xl**: 1280px

## 📝 残タスク一覧

### ✅ プロトタイプ完成（2025年1月）
全9画面の実装が完了し、非エンジニアの方へのデモンストレーションが可能な状態になりました。

### 今後の開発タスク（本番実装）

#### 1. PWA対応
```typescript
// vite.config.ts に追加
import { VitePWA } from 'vite-plugin-pwa'

// manifest.json作成
// Service Worker設定
// オフライン対応
```

#### 2. 状態管理実装
```typescript
// src/stores/inventoryStore.ts
import { create } from 'zustand'

// 在庫データのグローバル状態管理
// APIコール統合
```

## 🔧 実装のポイント

### DataTableコンポーネントの再利用例
```typescript
// 商品マスタでの使用例
import { DataTable } from '../components/common/DataTable'

const columns: Column<Product>[] = [
  { key: 'code', label: '商品コード', sortable: true },
  { key: 'name', label: '商品名', sortable: true },
  // ...
]

<DataTable
  data={products}
  columns={columns}
  searchable
  filterable
  paginated
  actions={productActions}
/>
```

### FormFieldコンポーネントの使用例
```typescript
import { FormField } from '../components/common/FormField'

<FormField
  type="text"
  name="productName"
  label="商品名"
  value={productName}
  onChange={setProductName}
  isRequired
  placeholder="商品名を入力"
/>
```

## 🚨 注意事項

1. **Chakra UI使用必須** - 要件で指定されているため全画面で使用
2. **TypeScript厳密モード** - 型安全性を保つ
3. **DRY原則** - 共通コンポーネントを最大限活用
4. **レスポンシブ対応** - 全画面でモバイル対応必須
5. **日本語UI** - 全テキストは日本語表記

## 📊 現在の進捗状況

### プロトタイプフェーズ ✅ 完成
- ✅ 基盤構築: 100%
- ✅ 共通コンポーネント: 100%
- ✅ レイアウト: 100%
- ✅ 画面実装: 100% (9/9画面)
- ✅ デモデータ: 100%
- ✅ レスポンシブ対応: 100%

### 本番実装フェーズ（未着手）
- ❌ PWA対応: 0%
- ❌ バックエンド統合: 0%
- ❌ データベース実装: 0%
- ❌ 認証機能: 0%
- ❌ API実装: 0%

## 🔗 関連ドキュメント

- **[技術仕様書](./TECHNICAL_DOCUMENTATION.md)** - 詳細な技術仕様とNext.js移行計画
- **[要件定義書](./requirements.md)** - 元の要件定義（存在する場合）

## 📂 重要ファイルへの直接参照

### コアファイル
- **型定義**: [`src/types/index.ts`](src/types/index.ts)
- **定数設定**: [`src/config/constants.ts`](src/config/constants.ts)
- **テーマ設定**: [`src/theme/index.ts`](src/theme/index.ts)
- **モックデータ**: [`src/data/mockData.ts`](src/data/mockData.ts)

### 共通コンポーネント（再利用必須）
- **汎用テーブル**: [`src/components/common/DataTable.tsx`](src/components/common/DataTable.tsx)
- **統計カード**: [`src/components/common/StatCard.tsx`](src/components/common/StatCard.tsx)
- **フォーム入力**: [`src/components/common/FormField.tsx`](src/components/common/FormField.tsx)

### レイアウトコンポーネント
- **サイドバー**: [`src/components/Layout/Sidebar.tsx`](src/components/Layout/Sidebar.tsx)
- **ヘッダー**: [`src/components/Layout/Header.tsx`](src/components/Layout/Header.tsx)
- **モバイルナビ**: [`src/components/Layout/MobileNav.tsx`](src/components/Layout/MobileNav.tsx)

### 実装済み画面（参考にすべきファイル）
- **ログイン画面**: [`src/pages/Login.tsx`](src/pages/Login.tsx)
- **ダッシュボード**: [`src/pages/Dashboard.tsx`](src/pages/Dashboard.tsx)
- **在庫一覧**: [`src/pages/InventoryList.tsx`](src/pages/InventoryList.tsx)

### ユーティリティ関数
- **フォーマッター**: [`src/utils/formatters.ts`](src/utils/formatters.ts)
- **計算関数**: [`src/utils/calculations.ts`](src/utils/calculations.ts)

### エントリーポイント
- **メインファイル**: [`src/main.tsx`](src/main.tsx)
- **Appコンポーネント**: [`src/App.tsx`](src/App.tsx)

## 📞 引継ぎ連絡事項

### 次のステップ推奨順序（本番実装）
1. Zustand状態管理の実装（データの永続化）
2. PWA対応（オフライン対応、インストール機能）
3. バックエンド構築（Next.js移行）
4. データベース実装（PostgreSQL + Prisma）
5. 認証機能実装（NextAuth.js）
6. API開発（RESTful API）
7. リアルタイム同期（WebSocket）
8. 本番環境デプロイ（Vercel/AWS）

### 技術的推奨事項
- 新規画面作成時は既存の `Dashboard.tsx` や `InventoryList.tsx` を参考にする
- `DataTable` コンポーネントは汎用性が高いため積極的に活用
- モックデータは `src/data/mockData.ts` に追加
- 新規型定義は `src/types/index.ts` に追加

---
### 🎉 プロトタイプ完成報告

2025年1月、在庫番プロトタイプの全9画面の実装が完了しました。これにより、非エンジニアの方へのデモンストレーションが可能な完全動作するプロトタイプが完成しました。

#### 主な成果
- **ユーザーフレンドリーなUI**: アイコンと日本語ラベルで直感的な操作性を実現
- **視覚的な情報提示**: グラフとチャートで一目で理解できるデータ表示
- **完全レスポンシブ対応**: スマートフォン、タブレット、デスクトップ全対応
- **リッチなインタラクション**: モーダル、タブ、トースト通知等の動的UI

#### 技術的特徴
- React 18 + TypeScript による型安全な実装
- Chakra UI による統一感のあるデザインシステム
- Recharts による美しいデータビジュアライゼーション
- モックデータによる実際の使用感を再現したデモ環境

---
**作成日**: 2024年12月
**最終更新**: 2025年1月
**作成者**: Claude (Assistant)
**プロジェクトバージョン**: 1.0.0 (プロトタイプ完成版)