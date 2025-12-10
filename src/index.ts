#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { DocBaseClient } from './client.js';

// Get configuration from environment variables
const API_TOKEN = process.env.DOCBASE_API_TOKEN;
const DOMAIN = process.env.DOCBASE_DOMAIN;

// Check if API token and domain are set
if (!API_TOKEN || !DOMAIN) {
  console.error('Please set environment variables DOCBASE_API_TOKEN and DOCBASE_DOMAIN');
  process.exit(1);
}

// Initialize DocBase API client
const docbaseClient = new DocBaseClient(API_TOKEN, DOMAIN);

// Create MCP server
const server = new McpServer({
  name: "DocBase MCP Server",
  version: "1.0.0",
});

// Add search tool
server.tool(
  "search_posts",
  "Search for posts in DocBase.",
  {
    q: z.string().optional().describe("Search query string"),
    page: z.number().optional().describe("Page number"),
    per_page: z.number().optional().describe("Number of posts per page"),
  },
  async ({ q, page, per_page }) => {
    try {
      const result = await docbaseClient.searchPosts({
        q,
        page,
        per_page,
      });
      
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          content: [{ type: "text", text: error.message }],
          isError: true,
        };
      }
      return {
        content: [{ type: "text", text: "Unknown error" }],
        isError: true,
      };
    }
  }
);

// Add post detail retrieval tool
server.tool(
  "get_post",
  "Get detailed information of a post with the specified ID.",
  {
    id: z.number().describe("Post ID"),
  },
  async ({ id }) => {
    try {
      const result = await docbaseClient.getPost({ id });
      
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          content: [{ type: "text", text: error.message }],
          isError: true,
        };
      }
      return {
        content: [{ type: "text", text: "Unknown error" }],
        isError: true,
      };
    }
  }
);

// Start server
async function start() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error(`DocBase MCP Server ready (Domain: ${DOMAIN})`);
    console.error(`Available tools: search_posts, get_post`);
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

start().catch(console.error);
