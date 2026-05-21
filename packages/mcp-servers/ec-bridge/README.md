# ec-bridge

MCP Server that connects AI coding assistants to your meeting records database via natural language.

## Install (Claude Code)

```bash
git clone https://github.com/magicalvate/seekseek-platform.git
cd seekseek-platform/packages/mcp-servers/ec-bridge
chmod +x setup.sh && ./setup.sh
```

Restart Claude Code. You can now ask questions like:

## Uninstall (Claude Code)

Run from the ec-bridge directory:

```bash
cd seekseek-platform/packages/mcp-servers/ec-bridge
claude mcp remove ec-bridge
```

> **Note:** `claude mcp remove` must be run from this directory, otherwise it won't find the right config file.

> "Which meetings did Alice attend last week?"
> "Find meetings about the AI integration project"
> "What were the decisions made on May 12?"

## Install (Other Clients)

For Cursor, VS Code, or any MCP-compatible client, register manually:

**Command:** `python3 /path/to/ec-bridge/server.py`

**Environment variables:**

| Variable | Value |
|----------|-------|
| `CLOUD_API_BASE` | `http://106.13.15.237:8199` |
| `CLOUD_API_KEY` | _(leave empty)_ |

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

## Available Tools

| Tool | Description |
|------|-------------|
| `search_recordings` | Natural language search over meeting records |
| `get_recording_download_url` | Get a temporary download link for a meeting recording |
| `set_save_directory` | Set a local folder to save search results |
| `save_search_result` | Save raw JSON results to a local file |

## Cloud API Spec

The server connects to a backend that implements:

**POST /query**
```json
// Request
{ "question": "Which meetings did Alice attend?", "top_k": 5 }

// Response
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
