# 在庫番 (Zaikoban) 技術仕様書

## 概要
在庫番は飲食店向けの在庫管理システムです。本ドキュメントは、現在のプロトタイプ実装と本番環境への移行計画について説明します。

## 技術スタック

### 現在のプロトタイプ環境
| カテゴリ    | 技術               | バージョン  | 用途             |
|---------|------------------|--------|----------------|
| ビルドツール  | Vite             | 7.1.2  | 高速な開発環境とビルド    |
| フレームワーク | React            | 19.1.1 | UIコンポーネント構築    |
| 言語      | TypeScript       | 5.8.3  | 型安全性の確保        |
| UIライブラリ | Chakra UI        | 3.26.0 | デザインシステム       |
| ルーティング  | React Router DOM | 7.8.2  | SPAナビゲーション     |
| 状態管理    | Zustand          | 5.0.8  | グローバル状態管理      |
| グラフ     | Recharts         | 3.1.2  | データビジュアライゼーション |
| アイコン    | React Icons      | 5.5.0  | UIアイコン         |
| PWA     | vite-plugin-pwa  | 1.0.3  | PWA対応準備        |

### 本番環境（移行予定）
| カテゴリ          | 技術             | 用途             |
|---------------|----------------|----------------|
| フルスタックフレームワーク | Next.js 15+    | SSR/SSG、APIルート |
| データベース        | MySQL          | データ永続化         |
| ORM           | Prisma         | データベースアクセス     |
| 認証            | NextAuth.js v5 | ユーザー認証         |
| デプロイ          | Vercel/AWS     | ホスティング         |

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

## バーコード/QRコード機能実装計画

### 機能概要

現在の実装では商品登録時にバーコード入力フィールドが存在するが、実際の読取機能は未実装。Phase 2での実装予定。

### 技術仕様

**ライブラリ選択候補**

- **カメラ読取**: QuaggaJS (JavaScript Barcode Reader)
- **QRコード**: jsQR (QR Code Scanner)
- **統合ソリューション**: ZXing-js (多形式対応)

**実装範囲**

- JAN/EANコード（13桁/8桁）対応
- CODE128, CODE39対応
- QRコード読取
- カメラプレビュー表示
- 読取結果の自動入力

### UI設計

```typescript
// バーコード読取コンポーネント
interface BarcodeReaderProps {
    onScan: (code: string, format: string) => void;
    onError: (error: string) => void;
    isActive: boolean;
}

// 商品登録画面での統合
<FormField label = "バーコード" >
<HStack>
    <Input value = {barcode}
onChange = {setBarcode}
/>
< Button
onClick = {openBarcodeReader} >
    <FiCamera / > スキャン
    < /Button>
    < /HStack>
    < /FormField>
```

### Phase別実装計画

- **Phase 2**: カメラ読取基本機能
- **Phase 3**: 専用スキャナー連携
- **Phase 4**: バーコード生成機能

## CSV/Excel処理詳細実装

### 現在の状況

インポート・エクスポートボタンは実装済みだが、実際の処理は未実装。

### 技術仕様

**ライブラリ**

- **Excel処理**: SheetJS (xlsx)
- **CSV処理**: PapaParse
- **ファイル操作**: File API

**対応フォーマット**

- CSV (.csv) - 商品マスタ、在庫データ
- Excel (.xlsx, .xls) - 全データ形式
- テンプレート提供（ダウンロード可能）

### 実装機能詳細

**使用ライブラリ**

- CSV処理: `papaparse` (v5.4.1)
- Excel処理: `exceljs` (v4.4.0)
- ファイルバリデーション: `file-type` (v19.0.0)

**インポート機能実装**

- ファイル形式バリデーション (CSV, XLSX, XLS)
- データ形式検証 (必須フィールド、データ型チェック)
- 重複データのスキップ・マージ機能
- プレビュー機能で確認後にインポート実行
- エラーハンドリング：不正データの詳細レポート生成
- 大容量ファイル対応（ストリーミング処理）
- 文字エンコーディング自動検出（UTF-8, Shift_JIS対応）

**エクスポート機能実装**

- 複数形式 (CSV, XLSX) での出力
- フィルタリング済みデータのエクスポート
- 日付範囲、カテゴリ別などの条件指定
- 大量データの分割ダウンロード対応
- テンプレート機能（商品登録用フォーマット）
- 出力形式カスタマイズ（列選択、順序変更）

**データ処理フロー**

1. ファイルアップロード → 形式・サイズ検証
2. パースエンジン選択 → データ解析
3. スキーマ照合 → エラー検出
4. プレビュー表示 → ユーザー確認
5. バッチ処理実行 → 結果レポート

**エラーハンドリング**

- 行番号付きエラーレポート
- 部分成功時の成功/失敗データ分離
- リトライ機能付きインポート
- ログファイル生成

**エクスポート機能**

```typescript
// 商品マスタエクスポート
interface ExportOptions {
    format: 'csv' | 'excel';
    dateRange?: { from: Date; to: Date };
    categories?: string[];
    includeStock: boolean;
}

const exportProducts = (options: ExportOptions) => {
    // データ加工・フィルタリング
    // ファイル生成・ダウンロード
};
```

**インポート機能**

- ファイル形式検証
- データバリデーション
- 重複チェック
- エラーレポート生成
- プレビュー機能

### エラーハンドリング

- 形式不正検出
- 必須項目チェック
- データ型検証
- 文字エンコーディング対応（UTF-8, Shift-JIS）

## マルチ店舗対応実装計画

### 現在の状況

設定画面にUI要素は存在するが機能は未実装。要件定義書ではPhase 3での実装予定。

### データベース設計拡張

```prisma
// 店舗モデル
model Store {
  id        String  @id @default(cuid())
  name      String  
  code      String  @unique
  address   String? 
  openTime  String? 
  closeTime String? 
  isActive  Boolean @default(true)

  // リレーション
  users    User[]
  products Product[]
  stocks   CurrentStock[]
  orders   Order[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// ユーザー店舗アクセス
model UserStore {
  userId  String
  storeId String
  role    StoreRole

  user  User  @relation(fields: [userId])
  store Store @relation(fields: [storeId])

  @@id([userId, storeId])
}

enum StoreRole {
  ADMIN
  MANAGER
  STAFF
}
```

### UI機能実装詳細

**1. 店舗切り替え機能**

- ヘッダーに店舗選択ドロップダウン
- 店舗固有データの表示切り替え
- 権限に応じたアクセス制御
- ローカルストレージでの選択店舗記憶
- リアルタイム店舗データ同期

**2. 店舗間在庫移動**

```typescript
// 店舗間移動画面
interface StoreTransfer {
    id: string;
    fromStoreId: string;
    toStoreId: string;
    productId: string;
    quantity: number;
    reason: string;
    status: 'pending' | 'approved' | 'shipped' | 'received';
    requestedBy: string;
    approvedBy?: string;
    shippedAt?: Date;
    receivedAt?: Date;
    notes?: string;
}

// 移動申請ワークフロー
enum TransferStatus {
    PENDING = '申請中',
    APPROVED = '承認済み',
    SHIPPED = '発送済み',
    RECEIVED = '受領済み',
    CANCELLED = 'キャンセル'
}
```

**3. 統合レポート機能**

- 全店舗統合ダッシュボード
- 店舗比較分析（売上、在庫回転率、廃棄率）
- 店舗間パフォーマンス比較
- 地域別分析レポート
- 時系列店舗推移グラフ

**4. 権限管理実装**

```typescript
// 店舗権限チェック
interface StorePermission {
    canViewAllStores: boolean;
    canTransferStock: boolean;
    canApproveTransfers: boolean;
    canManageStore: boolean;
    allowedStoreIds: string[];
}

// 機能別アクセス制御
const checkStorePermission = (
    user: User,
    action: StoreAction,
    storeId?: string
): boolean => {
    // 権限チェックロジック
}
```

**5. データ同期機能**

- リアルタイム在庫同期（WebSocket）
- 店舗間データ整合性チェック
- オフライン時の差分同期機能
- コンフリクト解決機能

**Phase別実装計画**

- **Phase 3**: 基本店舗切り替え・在庫移動UI
- **Phase 4**: 高度な分析レポート・権限管理

## 画像アップロード機能実装

### 現在の状況

商品画像はプレースホルダーURLのみ。実際のアップロード機能は未実装。

### 技術仕様

**ストレージ選択肢**

- **開発環境**: ローカルストレージ (public/images)
- **本番環境**: Cloudinary or Supabase Storage

**ファイル制限**

- 対応形式: JPEG, PNG, WebP
- 最大サイズ: 5MB
- 推奨解像度: 800x600px
- 自動リサイズ対応

### 実装機能詳細

**1. アップロード処理**

```typescript
interface ImageUpload {
    file: File;
    productId: string;
    purpose: 'main' | 'gallery' | 'thumbnail';
    alt?: string;
    caption?: string;
}

interface ImageValidation {
    maxSize: number; // 5MB
    allowedTypes: string[]; // ['image/jpeg', 'image/png', 'image/webp']
    minWidth: number; // 200px
    minHeight: number; // 200px
    maxWidth: number; // 2048px
    maxHeight: number; // 2048px
}

const uploadProductImage = async (upload: ImageUpload): Promise<ImageResult> => {
    // 1. ファイル検証（形式・サイズ・解像度）
    const validation = await validateImageFile(upload.file);
    if (!validation.isValid) throw new Error(validation.error);

    // 2. 画像最適化・リサイズ
    const optimizedImage = await optimizeImage(upload.file, {
        maxWidth: 800,
        maxHeight: 600,
        quality: 0.8,
        format: 'webp'
    });

    // 3. サムネイル生成
    const thumbnail = await generateThumbnail(optimizedImage, 150, 150);

    // 4. ストレージアップロード
    const [mainUrl, thumbUrl] = await Promise.all([
        uploadToStorage(optimizedImage, `products/${upload.productId}/main`),
        uploadToStorage(thumbnail, `products/${upload.productId}/thumb`)
    ]);

    // 5. データベース保存
    return await saveImageMetadata({
        productId: upload.productId,
        mainUrl,
        thumbnailUrl: thumbUrl,
        purpose: upload.purpose,
        alt: upload.alt,
        caption: upload.caption
    });
};
```

**2. 画像管理機能**

- **複数画像対応**: メイン画像 + ギャラリー（最大10枚）
- **ドラッグ&ドロップ**: 直感的なアップロード
- **画像プレビュー**: アップロード前の確認機能
- **画像削除機能**: 個別・一括削除対応
- **画像順序変更**: ドラッグ&ドロップでの並び替え
- **画像編集**: 基本的な切り抜き・回転機能
- **Alt text設定**: アクセシビリティ対応

**3. ストレージ実装**

```typescript
// Cloudinary設定（本番環境）
interface CloudinaryConfig {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
    folder: string; // 'zaikoban/products'
    transformation: {
        quality: 'auto:best';
        fetch_format: 'auto';
    };
}

// 開発環境（ローカルストレージ）
const uploadToLocal = async (file: File, path: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);

    const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
    });

    return response.json().url;
};
```

**4. パフォーマンス最適化**

- **遅延読み込み**: Intersection Observer API
- **WebP対応**: 次世代画像フォーマット優先
- **CDN配信**: 高速な画像配信
- **キャッシュ戦略**: ブラウザ・CDNでの適切なキャッシュ
- **プログレッシブ読み込み**: 段階的な画質向上

**5. セキュリティ対策**

- **ファイル形式検証**: MIMEタイプとファイル拡張子の照合
- **マルウェアスキャン**: アップロード時のウィルスチェック
- **アクセス制御**: 権限に応じた画像アクセス制限
- **不正ファイル検出**: 画像偽装ファイルの検出

**Phase別実装計画**

- **Phase 2**: 基本アップロード・表示機能
- **Phase 3**: 画像編集・最適化機能
- **Phase 4**: 高度なギャラリー管理・CDN最適化

## 実装状況サマリー

### ✅ 完了済み機能（プロトタイプレベル）

**画面・UI実装**

- 📊 ダッシュボード画面（統計・グラフ・アラート表示）
- 📋 商品マスタ管理画面（CRUD操作・フィルタリング）
- 📦 在庫リスト画面（検索・分類・詳細表示）
- 📥📤 入出庫管理画面（履歴・バッチ処理）
- 🛍️ 注文管理画面（ステータス管理・詳細表示）
- 📊 棚卸し画面（実施・履歴・進捗管理）
- 📈 レポート画面（各種分析・グラフ表示）
- ⚙️ 設定画面（基本設定UI）
- 🔐 ログイン画面（認証UI）

**共通機能実装**

- 🎨 Chakra UI v3ベースのデザインシステム
- 📱 レスポンシブデザイン（モバイル・タブレット対応）
- 🧩 再利用可能コンポーネント（DataTable、FormField、StatCard等）
- 🌍 日本語ローカライゼーション
- 📊 Recharts統合データビジュアライゼーション
- 🚀 Vite高速ビルド環境
- 📝 TypeScript型安全性確保

### ⏳ 未実装機能（UI表示のみ）

**Phase 2機能**

- 🔍 バーコード/QRコード読取機能
- 📂 CSV/Excelインポート・エクスポート処理
- 📸 商品画像アップロード機能
- 🔔 リアルタイム通知システム

**Phase 3機能**

- 🏪 マルチ店舗対応（店舗切り替え・在庫移動）
- 👥 高度な権限管理・ユーザー管理
- 📱 PWA本格実装（オフライン対応）
- 🔗 外部システム連携（POS・会計システム）

**Phase 4機能**

- 🤖 AI需要予測機能
- 📊 高度な分析・レポート機能
- 🛒 自動発注システム
- 📈 ビジネスインテリジェンス

### 🔗 バックエンド実装計画

- 🗄️ MySQL データベース設計
- 🌐 Next.js APIルート実装
- 🔒 NextAuth.js認証システム
- ☁️ Vercel/AWS デプロイメント

---

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