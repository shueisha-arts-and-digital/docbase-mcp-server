[公式の MCP Server が発表されましたのでそちらを使ってください](https://www.npmjs.com/package/@krayinc/docbase-mcp-server)

---

## Requirements

- Nodejs 20 以上, NPM 10 以上

## 機能

- [メモの検索 API](https://help.docbase.io/posts/92984)
- [メモの詳細取得 API](https://help.docbase.io/posts/97204)
- [メモの投稿 API](https://help.docbase.io/posts/92980)
- [メモの更新 API](https://help.docbase.io/posts/92981)

## Install

- 下記のように docbase-mcp-server の設定を追加します。
  - DOCBASE_API_TOKEN は、<https://your-domain-here.docbase.io/settings/tokens/new> で取得します
  - DOCBASE_DOMAIN は、<https://your-domain-here.docbase.io> ならば、your-domain-here です

```jsonc
{
  "mcpServers": {
    "docbase": {
      "autoApprove": ["search_posts", "get_post"], // create_post と update_post は承認が必要です
      "disabled": false,
      "timeout": 60,
      "command": "npx",
      "args": [
        "-y",
        "https://github.com/shueisha-arts-and-digital/docbase-mcp-server"
      ],
      "env": {
        "DOCBASE_API_TOKEN": "****", // Get token here https://your-domain-here.docbase.io/settings/tokens/new
        "DOCBASE_DOMAIN": "your-domain-here" // https://your-domain-here.docbase.io
      },
      "transportType": "stdio"
    }
  }
}
```
