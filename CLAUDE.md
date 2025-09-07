# 在庫番 (Zaikoban) - プロジェクトガイド

**飲食店向け在庫管理システム** | 現在プロトタイプ段階（モックデータ使用）

## 重要ドキュメント参照

- 📋 **要件定義書**: `./inventory-app-requirements.md`
- 📖 **技術仕様書**: `TECHNICAL_DOCUMENTATION.md`
- 📦 **package.json**: 現在の技術スタック確認用

## 必須コーディング規約

- **Chakra UI v3 API必須** - 旧v2 APIは使用禁止
- **TypeScript Strict Mode** - 型安全性最優先
- **共通コンポーネント再利用** - `src/components/common/`から利用
- **モックデータ利用** - `src/data/mockData.ts`からデータ取得

## 現在の実装状況

**✅ 完了**: 全9画面UI実装、モックデータ統合、レスポンシブ対応
**⏳ 未実装**: バックエンドAPI、実データ処理、認証システム

詳細は`TECHNICAL_DOCUMENTATION.md`の「実装状況サマリー」を参照。