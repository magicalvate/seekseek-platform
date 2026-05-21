#!/bin/bash
set -e

DIR="$(cd "$(dirname "$0")" && pwd)"

echo "1/2 Installing dependencies..."
pip3 install -r "$DIR/requirements.txt" --user -q 2>/dev/null || \
pip3 install -r "$DIR/requirements.txt" -q

echo "2/2 Registering ec-bridge with Claude Code (user scope)..."
claude mcp remove ec-bridge --scope user 2>/dev/null || true
claude mcp add ec-bridge --scope user \
  -e CLOUD_API_BASE=http://106.13.15.237:8199 \
  -e CLOUD_API_KEY="" \
  -- python3 "$DIR/server.py"

echo ""
echo "Done. Restart Claude Code and ask about your meetings."
