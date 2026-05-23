# ec-bridge

通过自然语言连接 AI 编程助手与会议记录数据库的 MCP Server。

## 安装（Claude Code）

克隆仓库后，`.mcp.json` 已包含完整配置，直接重启 Claude Code 即可。首次启动时 `start.sh` 会自动安装所需 Python 依赖，之后启动跳过此步骤。

重启 Claude Code 后即可提问，例如：

> "千惠子上周参加了哪些会议？"
> "找一下关于 AI 集成项目的会议"
> "5 月 12 日做了哪些决策？"

## 更新

无需重新注册，只需拉取最新代码并重启 Claude Code：

```bash
cd seekseek-platform
git pull
```

> 重启 Claude Code 后新版本即生效。

## 卸载（Claude Code）

```bash
claude mcp remove ec-bridge --scope user
```

## 安装（其他客户端）

适用于 Cursor、VS Code 或任意支持 MCP 的客户端，手动注册即可：

**启动命令：** `python3 /path/to/ec-bridge/start.py`

**环境变量：**

| 变量 | 值 |
|------|----|
| `CLOUD_API_BASE` | `http://106.13.15.237:8199` |
| `CLOUD_API_KEY` | 留空 |

<details>
<summary>Cursor — ~/.cursor/mcp.json</summary>

```json
{
  "mcpServers": {
    "ec-bridge": {
      "command": "python3",
      "args": ["/path/to/ec-bridge/start.py"],
      "env": {
        "CLOUD_API_BASE": "http://106.13.15.237:8199",
        "CLOUD_API_KEY": ""
      }
    }
  }
}
```
</details>

<details>
<summary>VS Code — .vscode/mcp.json</summary>

```json
{
  "servers": {
    "ec-bridge": {
      "type": "stdio",
      "command": "python3",
      "args": ["/path/to/ec-bridge/start.py"],
      "env": {
        "CLOUD_API_BASE": "http://106.13.15.237:8199",
        "CLOUD_API_KEY": ""
      }
    }
  }
}
```
</details>

## 可用工具

| 工具 | 说明 |
|------|------|
| `search_recordings` | 自然语言搜索会议记录，返回匹配会议及相关摘要 |
| `fetch_transcripts` | 拉取匹配会议的完整转写文本并保存为本地 .txt 文件 |
| `save_search_result` | 将原始 JSON 搜索结果保存到本地文件 |

## 云端 API 规范

Server 连接的后端接口：

**POST /query**
```json
// 请求
{ "question": "千惠子参加了哪些会议？", "top_k": 5 }

// 响应
{
  "question": "...",
  "answer": { "meetings": [{ "meeting_title": "...", "meeting_time": "...", "participants": [], "subject_category": "..." }] },
  "chunks": [{ "chunk_id": 1, "meeting_id": 6, "meeting_title": "...", "meeting_time": "..." }]
}
```

**GET /v1/recordings/:meeting_id/download-url**
```json
{ "meeting_id": 6, "download_url": "https://...", "expires_in": 900 }
```
