#!/bin/bash
# Usage: install.sh [project_path] [skill_name]
#   project_path  install to <project_path>/.claude/skills  (default: ~/.claude/skills)
#   skill_name    install a single skill by name             (default: all)
set -e

SKILLS_DIR="$(cd "$(dirname "$0")" && pwd)"

if [ -n "${1:-}" ]; then
    TARGET_DIR="$1/.claude/skills"
else
    TARGET_DIR="$HOME/.claude/skills"
fi

FILTER="${2:-}"

mkdir -p "$TARGET_DIR"

installed=0
for skill_dir in "$SKILLS_DIR"/*/; do
    name=$(basename "$skill_dir")
    if [ -n "$FILTER" ] && [ "$name" != "$FILTER" ]; then
        continue
    fi
    rm -rf "$TARGET_DIR/$name"
    cp -r "$skill_dir" "$TARGET_DIR/$name"
    echo "✓ $name"
    installed=$((installed + 1))
done

echo ""
echo "$installed skill(s) installed to $TARGET_DIR"
