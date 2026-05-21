# ec-bridge

通过自然语言连接 AI 编程助手与会议记录数据库的 MCP Server。

## 安装（Claude Code）

**Mac / Linux**
```bash
git clone https://github.com/magicalvate/seekseek-platform.git
cd seekseek-platform/packages/mcp-servers/ec-bridge
chmod +x setup.sh && ./setup.sh
```

**Windows（PowerShell）**
```powershell
git clone https://github.com/magicalvate/seekseek-platform.git
cd seekseek-platform\packages\mcp-servers\ec-bridge
.\setup.ps1
```

重启 Claude Code 后即可提问，例如：

> "千惠子上周参加了哪些会议？"
> "找一下关于 AI 集成项目的会议"
> "5 月 12 日做了哪些决策？"

## 卸载（Claude Code）

```bash
claude mcp remove ec-bridge --scope user
```

## 安装（其他客户端）

适用于 Cursor、VS Code 或任意支持 MCP 的客户端，手动注册即可：

**启动命令：** `python3 /path/to/ec-bridge/server.py`

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
      "args": ["/path/to/ec-bridge/server.py"],
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
      "args": ["/path/to/ec-bridge/server.py"],
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
| `search_recordings` | 自然语言搜索会议记录 |
| `get_recording_download_url` | 获取会议录音的临时下载链接 |
| `set_save_directory` | 设置搜索结果的本地保存目录 |
| `save_search_result` | 将原始 JSON 结果保存到本地文件 |

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
