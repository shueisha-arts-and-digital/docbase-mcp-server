// DocBase API 共通の型定義
export interface DocBaseUser {
  id: number;
  name: string;
  profile_image_url: string;
}

export interface DocBaseTag {
  name: string;
}

export interface DocBaseGroup {
  id: number;
  name: string;
}

export interface DocBaseComment {
  id: number;
  body: string;
  created_at: string;
  user: DocBaseUser;
}

export interface DocBaseAttachment {
  id: string;
  name: string;
  size: number;
  url: string;
  markdown: string;
  created_at: string;
}

export interface DocBasePost {
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

// 検索API関連の型定義
export interface SearchPostsParams {
  q?: string;
  page?: number;
  per_page?: number;
}

export interface SearchPostsResponse {
  posts: DocBasePost[];
  meta: {
    previous_page: string | null;
    next_page: string | null;
    total: number;
  };
}

// 詳細取得API関連の型定義
export interface GetPostParams {
  id: number;
}

export type GetPostResponse = DocBasePost;

// メモ投稿API関連の型定義
export interface CreatePostParams {
  title: string;
  body: string;
  draft?: boolean;
  tags?: string[];
  scope?: string;
  groups?: number[];
  notice?: boolean;
}

export type CreatePostResponse = DocBasePost;

// メモ更新API関連の型定義
export interface UpdatePostParams {
  id: number;
  title?: string;
  body?: string;
  draft?: boolean;
  tags?: string[];
  scope?: string;
  groups?: number[];
  notice?: boolean;
}

export type UpdatePostResponse = DocBasePost;
