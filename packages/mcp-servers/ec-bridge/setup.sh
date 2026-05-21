#!/bin/bash
set -e

DIR="$(cd "$(dirname "$0")" && pwd)"

echo "1/2 Installing dependencies..."
pip3 install -r "$DIR/requirements.txt" --break-system-packages -q

echo "2/2 Registering ec-bridge with Claude Code..."
claude mcp add ec-bridge \
  -e CLOUD_API_BASE=http://106.13.15.237:8199 \
  -e CLOUD_API_KEY="" \
  -- python3 "$DIR/server.py"

echo ""
echo "Done. Restart Claude Code and ask about your meetings."
