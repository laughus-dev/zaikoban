# 在庫番 (Zaikoban) 技術仕様書

## 概要
在庫番は飲食店向けの在庫管理システムです。本ドキュメントは、現在のプロトタイプ実装と本番環境への移行計画について説明します。

## 技術スタック

### 現在のプロトタイプ環境
| カテゴリ | 技術 | バージョン | 用途 |
|---------|------|-----------|------|
| ビルドツール | Vite | 5.x | 高速な開発環境とビルド |
| フレームワーク | React | 18.x | UIコンポーネント構築 |
| 言語 | TypeScript | 5.x | 型安全性の確保 |
| UIライブラリ | Chakra UI | 2.x | デザインシステム |
| ルーティング | React Router DOM | 6.x | SPAナビゲーション |
| 状態管理 | Zustand | 4.x | グローバル状態管理 |
| グラフ | Recharts | 2.x | データビジュアライゼーション |
| アイコン | React Icons | 5.x | UIアイコン |
| PWA | vite-plugin-pwa | 0.20.x | PWA対応準備 |

### 本番環境（移行予定）
| カテゴリ | 技術 | 用途 |
|---------|------|------|
| フルスタックフレームワーク | Next.js 14+ | SSR/SSG、APIルート |
| データベース | PostgreSQL | データ永続化 |
| ORM | Prisma | データベースアクセス |
| 認証 | NextAuth.js | ユーザー認証 |
| デプロイ | Vercel/AWS | ホスティング |

## アーキテクチャ

### ディレクトリ構造
```
src/
├── components/       # UIコンポーネント
│   ├── common/      # 再利用可能な共通コンポーネント
│   └── Layout/      # レイアウトコンポーネント
├── pages/           # 画面コンポーネント
├── types/           # TypeScript型定義
├── utils/           # ユーティリティ関数
├── config/          # 設定ファイル
├── theme/           # Chakra UIテーマ
├── data/            # モックデータ
└── hooks/           # カスタムフック
```

### コンポーネント設計原則

#### 1. DRY原則の適用
- **共通コンポーネント化**: DataTable、FormField、StatCardなど再利用可能なコンポーネントを作成
- **ユーティリティ関数**: formatCurrency、formatDate等の共通処理を関数化
- **型定義の一元管理**: types/index.tsで全エンティティの型を定義

#### 2. 責務の分離
```typescript
// プレゼンテーション層（components/common/DataTable.tsx）
export function DataTable<T>({ data, columns, ...props }) {
  // UIロジックのみ
}

// ビジネスロジック層（utils/calculations.ts）
export const calculateStockLevel = (product: Product) => {
  // ビジネスロジック
}

// データ層（data/mockData.ts → 将来的にAPI/DB）
export const mockProducts: Product[] = [
  // データ定義
]
```

## 主要コンポーネント仕様

### DataTable コンポーネント
汎用的なテーブルコンポーネントで、以下の機能を提供：
- **ジェネリック型対応**: 任意のデータ型に対応
- **検索機能**: リアルタイム検索
- **フィルタリング**: 複数条件でのフィルタ
- **ソート機能**: カラム単位のソート
- **ページネーション**: 大量データの分割表示
- **アクション**: 行ごとのアクションメニュー

```typescript
interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  searchable?: boolean
  filterable?: boolean
  sortable?: boolean
  paginated?: boolean
  actions?: Action<T>[]
}
```

### レスポンシブデザイン
- **モバイルファースト**: 320px〜対応
- **ブレークポイント**:
  - sm: 480px
  - md: 768px
  - lg: 992px
  - xl: 1280px

## PWA実装計画

### 現在の準備状況
- vite-plugin-pwa導入済み
- Workbox設定準備済み
- アイコンアセット配置済み

### 実装手順
1. **manifest.json設定**
```json
{
  "name": "在庫番 - 飲食店向け在庫管理",
  "short_name": "在庫番",
  "theme_color": "#FF6B35",
  "background_color": "#ffffff",
  "display": "standalone",
  "orientation": "portrait",
  "scope": "/",
  "start_url": "/"
}
```

2. **Service Worker設定**
```javascript
// vite.config.ts
VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/api\./,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache'
        }
      }
    ]
  }
})
```

3. **オフライン対応**
- IndexedDBでのローカルデータ保存
- 同期キューの実装
- オフライン時のUI表示

## Next.js移行計画

### 移行手順

#### Phase 1: プロジェクト構造の移行
```bash
# Next.jsプロジェクト作成
npx create-next-app@latest zaikoban-production --typescript --tailwind --app

# 既存コンポーネントの移行
- components/ → app/components/
- pages/ → app/(routes)/
```

#### Phase 2: ルーティングの変換
```typescript
// React Router → Next.js App Router
// 現在: pages/Dashboard.tsx
// 移行後: app/dashboard/page.tsx
export default function DashboardPage() {
  return <Dashboard />
}
```

#### Phase 3: データフェッチングの実装
```typescript
// Server Component
async function InventoryPage() {
  const products = await prisma.product.findMany()
  return <InventoryList products={products} />
}

// API Route (app/api/products/route.ts)
export async function GET() {
  const products = await prisma.product.findMany()
  return NextResponse.json(products)
}
```

#### Phase 4: 認証実装
```typescript
// NextAuth.js設定
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        // 認証ロジック
      }
    })
  ]
}
```

## データベース設計

### Prismaスキーマ（予定）
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  role      Role     @default(STAFF)
  createdAt DateTime @default(now())
}

model Product {
  id           String   @id @default(cuid())
  code         String   @unique
  name         String
  categoryId   String
  category     Category @relation(fields: [categoryId])
  currentStock Float
  minStock     Float
  maxStock     Float
  unit         String
  cost         Float
  price        Float
  supplierId   String?
  supplier     Supplier? @relation(fields: [supplierId])
  expiryDate   DateTime?
  transactions StockTransaction[]
}

model StockTransaction {
  id         String   @id @default(cuid())
  productId  String
  product    Product  @relation(fields: [productId])
  type       TransactionType
  quantity   Float
  totalAmount Float
  note       String?
  createdAt  DateTime @default(now())
  userId     String
  user       User     @relation(fields: [userId])
}

enum Role {
  ADMIN
  MANAGER
  STAFF
}

enum TransactionType {
  IN
  OUT
  DISPOSAL
  ADJUSTMENT
}
```

## パフォーマンス最適化

### 現在の実装
1. **コード分割**: React.lazyによる動的インポート
2. **メモ化**: React.memo、useMemo、useCallbackの活用
3. **仮想化**: 大量データ表示時の仮想スクロール（実装予定）

### 本番環境での最適化
1. **ISR (Incremental Static Regeneration)**: 在庫データの定期更新
2. **Edge Functions**: 認証処理の高速化
3. **Image Optimization**: Next/Imageによる画像最適化
4. **CDN配信**: 静的アセットのCDN配信

## セキュリティ考慮事項

### 実装予定のセキュリティ対策
1. **認証・認可**
   - JWT/セッションベース認証
   - ロールベースアクセス制御（RBAC）
   - 多要素認証（MFA）対応

2. **データ保護**
   - HTTPS通信の強制
   - データベース暗号化
   - 環境変数による機密情報管理

3. **入力検証**
   - Zodによるスキーマ検証
   - SQLインジェクション対策（Prisma使用）
   - XSS対策（React自動エスケープ）

## テスト戦略

### テストレベル
1. **単体テスト**: Vitest + React Testing Library
2. **統合テスト**: Playwright
3. **E2Eテスト**: Cypress

### テストカバレッジ目標
- ユーティリティ関数: 100%
- コンポーネント: 80%以上
- API: 90%以上

## デプロイメント

### CI/CDパイプライン
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test
      - run: npm run build
      - uses: vercel/action@v2
```

### 環境構成
- **開発環境**: localhost
- **ステージング環境**: staging.zaikoban.app
- **本番環境**: zaikoban.app

## モニタリング

### 実装予定の監視項目
1. **アプリケーション監視**
   - エラートラッキング（Sentry）
   - パフォーマンス監視（Vercel Analytics）
   - ユーザー行動分析（Google Analytics）

2. **インフラ監視**
   - サーバー監視（Datadog/New Relic）
   - データベース監視
   - アラート設定

## 今後の開発ロードマップ

### Phase 1 (現在完了)
- ✅ プロトタイプ作成
- ✅ 基本UI実装
- ✅ モックデータ実装

### Phase 2 (1-2ヶ月)
- Next.js移行
- データベース実装
- 認証機能実装
- 基本CRUD操作

### Phase 3 (2-3ヶ月)
- PWA完全対応
- オフライン機能
- リアルタイム同期
- 通知機能

### Phase 4 (3-4ヶ月)
- AI予測機能
- 自動発注機能
- レポート生成
- 外部システム連携

## 開発ガイドライン

### コーディング規約
- ESLint + Prettier設定に従う
- TypeScript strictモード有効
- 関数型プログラミング優先
- 早期リターンパターン使用

### コミット規約
```
feat: 新機能追加
fix: バグ修正
docs: ドキュメント更新
style: フォーマット修正
refactor: リファクタリング
test: テスト追加・修正
chore: ビルド・設定変更
```

### レビューチェックリスト
- [ ] TypeScript型定義の適切性
- [ ] DRY原則の遵守
- [ ] レスポンシブ対応
- [ ] アクセシビリティ考慮
- [ ] パフォーマンス影響
- [ ] セキュリティリスク

## 参考資料
- [Next.js Documentation](https://nextjs.org/docs)
- [Chakra UI Documentation](https://chakra-ui.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PWA Documentation](https://web.dev/progressive-web-apps/)

---
作成日: 2024年12月
バージョン: 1.0.0