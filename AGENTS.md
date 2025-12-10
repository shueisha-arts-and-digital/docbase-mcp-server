# DocBase MCP Server - Agent Guide

## プロジェクト概要

このプロジェクトは、DocBase（ドキュメント管理サービス）のAPIをMCP（Model Context Protocol）サーバーとして提供するものです。AIエージェントがDocBaseのメモを検索・取得するためのツールを提供します。

## アーキテクチャ

### 主要コンポーネント

1. **`src/index.ts`** - MCPサーバーのエントリーポイント
   - MCPサーバーの初期化と設定
   - ツール（`search_posts`, `get_post`）の登録
   - 環境変数の検証

2. **`src/client.ts`** - DocBase APIクライアント
   - `DocBaseClient`クラス：DocBase APIとの通信を担当
   - `searchPosts()`: メモの検索機能
   - `getPost()`: メモの詳細取得機能

3. **`src/types.ts`** - TypeScript型定義
   - DocBase APIのレスポンス型定義
   - リクエストパラメータの型定義

## 利用可能なツール

### 1. `search_posts` - メモの検索

DocBase内のメモを検索します。

**パラメータ:**
- `q` (string, optional): 検索文字列
- `page` (number, optional): ページ番号（デフォルト: 1）
- `per_page` (number, optional): 1ページあたりのメモ数（デフォルト: 20）

**レスポンス:**
```typescript
{
  posts: DocBasePost[];
  meta: {
    previous_page: string | null;
    next_page: string | null;
    total: number;
  };
}
```

**使用例:**
- 特定のキーワードでメモを検索
- ページネーションを使用して大量のメモを取得

### 2. `get_post` - メモの詳細取得

指定されたIDのメモの詳細情報を取得します。

**パラメータ:**
- `id` (number, required): メモID

**レスポンス:**
```typescript
DocBasePost
```

**使用例:**
- 検索結果で見つけたメモの詳細を取得
- 特定のメモIDの内容を確認

## DocBasePostの構造

```typescript
interface DocBasePost {
  id: number;
  title: string;
  body: string;
  draft: boolean;
  archived: boolean;
  url: string;
  created_at: string;
  updated_at: string;
  scope: string;
  sharing_url: string;
  tags: DocBaseTag[];
  user: DocBaseUser;
  stars_count: number;
  good_jobs_count: number;
  comments: DocBaseComment[];
  groups: DocBaseGroup[];
  representative_image_url?: string;
  attachments?: DocBaseAttachment[];
}
```

## 環境変数

以下の環境変数が必要です：

- `DOCBASE_API_TOKEN`: DocBase APIトークン（必須）
  - 取得方法: https://your-domain-here.docbase.io/settings/tokens/new
  
- `DOCBASE_DOMAIN`: DocBaseドメイン（必須）
  - 例: `https://your-domain-here.docbase.io` の場合、`your-domain-here`

## エラーハンドリング

- APIトークンやドメインが設定されていない場合、サーバー起動時にエラーを出力して終了します
- API呼び出しでエラーが発生した場合、エラーメッセージを返します
- Axiosエラーの場合、HTTPステータスコードとステータステキストを含むエラーメッセージを返します

## 使用フロー

1. **検索フェーズ**
   - `search_posts`ツールを使用してキーワードでメモを検索
   - レスポンスの`posts`配列から関連するメモを特定

2. **詳細取得フェーズ**
   - 検索結果から必要なメモの`id`を取得
   - `get_post`ツールを使用してメモの詳細情報を取得

3. **情報活用**
   - 取得したメモの`body`（本文）や`title`（タイトル）を参照
   - `tags`、`comments`、`attachments`などの関連情報も利用可能

## 技術スタック

- **ランタイム**: Node.js 20以上
- **言語**: TypeScript
- **MCP SDK**: @modelcontextprotocol/sdk
- **HTTPクライアント**: axios
- **バリデーション**: zod
- **型変換**: zod-to-json-schema

## ビルドと実行

```bash
# ビルド
npm run build

# 実行
npm start
```

## 注意事項

- このプロジェクトは非公式の実装です。公式のMCP Serverが利用可能な場合は、そちらを使用することを推奨します
- APIトークンは機密情報です。環境変数として適切に管理してください
- APIレート制限に注意してください


