# seekseek-platform

AI platform monorepo — MCP servers, skills, and shared tooling.

## Packages

| Package | Description |
|---------|-------------|
| [packages/mcp-servers/ec-bridge](./packages/mcp-servers/ec-bridge/) | MCP server for semantic search over meeting records |

## 插件商店

克隆项目后，用 Python 启动本地服务即可在浏览器中浏览和安装 Skills：

```bash
git clone https://github.com/magicalvate/seekseek-platform.git
cd seekseek-platform
python3 web/server.py
```

然后打开浏览器访问 http://localhost:7842

## Structure

```
seekseek-platform/
└── packages/
    └── mcp-servers/
        └── ec-bridge/   # Meeting records MCP
```
