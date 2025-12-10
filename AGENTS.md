# DocBase MCP Server - Agent Guide

## プロジェクト概要

このプロジェクトは、DocBase（ドキュメント管理サービス）の API を MCP（Model Context Protocol）サーバーとして提供するものです。AI エージェントが DocBase のメモを検索・取得・作成・更新するためのツールを提供します。

## アーキテクチャ

### 主要コンポーネント

1. **`src/index.ts`** - MCP サーバーのエントリーポイント

   - MCP サーバーの初期化と設定
   - ツール（`search_posts`, `get_post`, `create_post`, `update_post`）の登録
   - 環境変数の検証

2. **`src/client.ts`** - DocBase API クライアント

   - `DocBaseClient`クラス：DocBase API との通信を担当
   - `searchPosts()`: メモの検索機能
   - `getPost()`: メモの詳細取得機能
   - `createPost()`: メモの投稿機能
   - `updatePost()`: メモの更新機能

3. **`src/types.ts`** - TypeScript 型定義
   - DocBase API のレスポンス型定義
   - リクエストパラメータの型定義

## 利用可能なツール

### 1. `search_posts` - メモの検索

DocBase 内のメモを検索します。

**パラメータ:**

- `q` (string, optional): 検索文字列
- `page` (number, optional): ページ番号（デフォルト: 1）
- `per_page` (number, optional): 1 ページあたりのメモ数（デフォルト: 20）

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

指定された ID のメモの詳細情報を取得します。

**パラメータ:**

- `id` (number, required): メモ ID

**レスポンス:**

```typescript
DocBasePost;
```

**使用例:**

- 検索結果で見つけたメモの詳細を取得
- 特定のメモ ID の内容を確認

### 3. `create_post` - メモの投稿

新しいメモを DocBase に投稿します。

**パラメータ:**

- `title` (string, required): メモのタイトル
- `body` (string, required): メモの本文
- `draft` (boolean, optional): 下書きかどうか
- `tags` (string[], optional): タグの配列
- `scope` (string, optional): 公開範囲
- `groups` (number[], optional): アクセス可能なグループ ID の配列
- `notice` (boolean, optional): 通知を送信するかどうか

**レスポンス:**

```typescript
DocBasePost;
```

**使用例:**

- 新しいメモを作成
- 下書きとしてメモを保存
- 特定のグループに公開するメモを作成

### 4. `update_post` - メモの更新

既存のメモを更新します。

**パラメータ:**

- `id` (number, required): 更新するメモの ID
- `title` (string, optional): メモのタイトル
- `body` (string, optional): メモの本文
- `draft` (boolean, optional): 下書きかどうか
- `tags` (string[], optional): タグの配列
- `scope` (string, optional): 公開範囲
- `groups` (number[], optional): アクセス可能なグループ ID の配列
- `notice` (boolean, optional): 通知を送信するかどうか

**レスポンス:**

```typescript
DocBasePost;
```

**使用例:**

- 既存のメモのタイトルや本文を更新
- メモのタグを変更
- 公開範囲を変更

## DocBasePost の構造

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

- `DOCBASE_API_TOKEN`: DocBase API トークン（必須）
  - 取得方法: https://your-domain-here.docbase.io/settings/tokens/new
- `DOCBASE_DOMAIN`: DocBase ドメイン（必須）
  - 例: `https://your-domain-here.docbase.io` の場合、`your-domain-here`

## エラーハンドリング

- API トークンやドメインが設定されていない場合、サーバー起動時にエラーを出力して終了します
- API 呼び出しでエラーが発生した場合、エラーメッセージを返します
- Axios エラーの場合、HTTP ステータスコードとステータステキストを含むエラーメッセージを返します

## 使用フロー

### メモの検索と取得

1. **検索フェーズ**

   - `search_posts`ツールを使用してキーワードでメモを検索
   - レスポンスの`posts`配列から関連するメモを特定

2. **詳細取得フェーズ**

   - 検索結果から必要なメモの`id`を取得
   - `get_post`ツールを使用してメモの詳細情報を取得

3. **情報活用**
   - 取得したメモの`body`（本文）や`title`（タイトル）を参照
   - `tags`、`comments`、`attachments`などの関連情報も利用可能

### メモの作成

1. **作成フェーズ**

   - `create_post`ツールを使用して新しいメモを作成
   - 必須パラメータ（`title`, `body`）を指定
   - オプションパラメータ（`draft`, `tags`, `scope`, `groups`, `notice`）を必要に応じて指定

2. **確認フェーズ**
   - 作成されたメモの`id`を取得
   - `get_post`ツールを使用して作成されたメモの内容を確認

### メモの更新

1. **更新フェーズ**

   - `update_post`ツールを使用して既存のメモを更新
   - 必須パラメータ（`id`）と更新したいフィールドを指定
   - 更新したいフィールドのみを指定（部分更新が可能）

2. **確認フェーズ**
   - `get_post`ツールを使用して更新されたメモの内容を確認

## 技術スタック

- **ランタイム**: Node.js 20 以上
- **言語**: TypeScript
- **MCP SDK**: @modelcontextprotocol/sdk
- **HTTP クライアント**: axios
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

- このプロジェクトは非公式の実装です。公式の MCP Server が利用可能な場合は、そちらを使用することを推奨します
- API トークンは機密情報です。環境変数として適切に管理してください
- API レート制限に注意してください
