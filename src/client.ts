import axios from 'axios';
import type { SearchPostsParams, SearchPostsResponse, GetPostParams, GetPostResponse, CreatePostParams, CreatePostResponse, UpdatePostParams, UpdatePostResponse } from './types.js';

export class DocBaseClient {
  private client;
  private domain: string;

  constructor(apiToken: string, domain: string) {
    this.domain = domain;
    this.client = axios.create({
      baseURL: 'https://api.docbase.io',
      headers: {
        'X-DocBaseToken': apiToken,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * メモの検索を行う
   */
  async searchPosts(params: SearchPostsParams): Promise<SearchPostsResponse> {
    try {
      const response = await this.client.get(`/teams/${this.domain}/posts`, {
        params: {
          q: params.q || '',
          page: params.page || 1,
          per_page: params.per_page || 20
        }
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw new Error(`DocBase API Error: ${error.response?.status} - ${error.response?.statusText}`);
      }
      throw error;
    }
  }

  /**
   * メモの詳細を取得する
   */
  async getPost(params: GetPostParams): Promise<GetPostResponse> {
    try {
      const response = await this.client.get(`/teams/${this.domain}/posts/${params.id}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw new Error(`DocBase API Error: ${error.response?.status} - ${error.response?.statusText}`);
      }
      throw error;
    }
  }

  /**
   * メモを投稿する
   */
  async createPost(params: CreatePostParams): Promise<CreatePostResponse> {
    try {
      const response = await this.client.post(`/teams/${this.domain}/posts`, {
        title: params.title,
        body: params.body,
        draft: params.draft,
        tags: params.tags,
        scope: params.scope,
        groups: params.groups,
        notice: params.notice,
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw new Error(`DocBase API Error: ${error.response?.status} - ${error.response?.statusText}`);
      }
      throw error;
    }
  }

  /**
   * メモを更新する
   */
  async updatePost(params: UpdatePostParams): Promise<UpdatePostResponse> {
    try {
      const requestBody: Record<string, unknown> = {};
      if (params.title !== undefined) requestBody.title = params.title;
      if (params.body !== undefined) requestBody.body = params.body;
      if (params.draft !== undefined) requestBody.draft = params.draft;
      if (params.tags !== undefined) requestBody.tags = params.tags;
      if (params.scope !== undefined) requestBody.scope = params.scope;
      if (params.groups !== undefined) requestBody.groups = params.groups;
      if (params.notice !== undefined) requestBody.notice = params.notice;

      const response = await this.client.patch(`/teams/${this.domain}/posts/${params.id}`, requestBody);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw new Error(`DocBase API Error: ${error.response?.status} - ${error.response?.statusText}`);
      }
      throw error;
    }
  }
}
