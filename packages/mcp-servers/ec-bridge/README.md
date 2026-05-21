# ec-bridge

MCP Server for semantic search over meeting records. Connect any MCP-compatible AI client (Claude Code, Cursor, VS Code, etc.) to your meeting database using natural language.

## Prerequisites

- Python 3.10+
- pip3

## Installation

```bash
git clone https://github.com/magicalvate/seekseek-platform.git
cd seekseek-platform/packages/mcp-servers/ec-bridge
pip3 install -r requirements.txt
```

## Client Registration

### Claude Code

```bash
claude mcp add ec-bridge \
  -e CLOUD_API_BASE=http://106.13.15.237:8199 \
  -e CLOUD_API_KEY="" \
  -- python3 /absolute/path/to/ec-bridge/server.py
```

### Cursor

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "ec-bridge": {
      "command": "python3",
      "args": ["/absolute/path/to/ec-bridge/server.py"],
      "env": {
        "CLOUD_API_BASE": "http://106.13.15.237:8199",
        "CLOUD_API_KEY": ""
      }
    }
  }
}
```

### VS Code (GitHub Copilot)

Add to `.vscode/mcp.json`:

```json
{
  "servers": {
    "ec-bridge": {
      "type": "stdio",
      "command": "python3",
      "args": ["/absolute/path/to/ec-bridge/server.py"],
      "env": {
        "CLOUD_API_BASE": "http://106.13.15.237:8199",
        "CLOUD_API_KEY": ""
      }
    }
  }
}
```

### Any MCP stdio client

```bash
CLOUD_API_BASE=http://106.13.15.237:8199 python3 server.py
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `CLOUD_API_BASE` | `http://106.13.15.237:8199` | Cloud API base URL |
| `CLOUD_API_KEY` | _(empty)_ | API authentication key |
| `USE_MOCK` | `false` | Set to `true` to run with mock data (no API needed) |

## Available Tools

| Tool | Description |
|------|-------------|
| `search_recordings` | Natural language search over meeting records |
| `get_recording_download_url` | Get a temporary download link for a meeting recording |
| `set_save_directory` | Set the local directory for saving search results |
| `save_search_result` | Save raw JSON search results to a local file |

## Try Without an API (Mock Mode)

```bash
USE_MOCK=true python3 server.py
```

Verify the mock pipeline:

```bash
USE_MOCK=true python3 test_mock.py
```

## Cloud API Spec

Your backend needs to implement:

**POST /query**
```json
// Request
{ "question": "Which meetings did Alice attend?", "top_k": 5 }

// Response
{
  "question": "...",
  "answer": { "meetings": [ { "meeting_title": "...", "meeting_time": "...", "participants": [], "subject_category": "..." } ] },
  "chunks": [ { "chunk_id": 1, "meeting_id": 6, "meeting_title": "...", "meeting_time": "..." } ]
}
```

**GET /v1/recordings/:meeting_id/download-url**
```json
// Response
{ "meeting_id": 6, "download_url": "https://...", "expires_in": 900 }
```
