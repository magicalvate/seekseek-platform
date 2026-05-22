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
python web/server.py   # Windows
python3 web/server.py  # macOS / Linux
```

然后打开浏览器访问 http://localhost:7842

更新时，在项目目录下执行：

```bash
git pull
```

刷新浏览器即可生效，无需重启服务。

## Structure

```
seekseek-platform/
└── packages/
    └── mcp-servers/
        └── ec-bridge/   # Meeting records MCP
```
