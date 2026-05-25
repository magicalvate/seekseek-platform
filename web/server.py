#!/usr/bin/env python3
import json
import os
import platform
import subprocess
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

PORT = 7842
REPO_ROOT = Path(__file__).resolve().parent.parent
SKILLS_DIR = REPO_ROOT / "packages" / "skills"
MCP_SERVERS_DIR = REPO_ROOT / "packages" / "mcp-servers"
WEB_DIR = Path(__file__).resolve().parent
IS_WINDOWS = platform.system() == "Windows"


def _parse_frontmatter(text: str) -> dict:
    """Parse YAML frontmatter from a SKILL.md file (stdlib only, no PyYAML needed)."""
    import re
    m = re.match(r'^---\s*\n(.*?)\n---', text, re.DOTALL)
    if not m:
        return {}
    result: dict = {}
    current_list_key = None
    for line in m.group(1).splitlines():
        if line.startswith('  - ') and current_list_key is not None:
            result[current_list_key].append(line[4:].strip().strip('"\''))
        elif ':' in line and not line.startswith(' '):
            k, _, v = line.partition(':')
            k, v = k.strip(), v.strip().strip('"\'')
            if v == '':
                result[k] = []
                current_list_key = k
            else:
                result[k] = v
                current_list_key = None
        else:
            current_list_key = None
    return result


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(WEB_DIR), **kwargs)

    def do_GET(self):
        if self.path == '/api/skills':
            self._serve_skills()
            return
        super().do_GET()

    def _serve_skills(self):
        skills = []
        if SKILLS_DIR.exists():
            for skill_dir in sorted(SKILLS_DIR.iterdir()):
                if not skill_dir.is_dir():
                    continue
                skill_md = skill_dir / 'SKILL.md'
                if not skill_md.exists():
                    continue
                try:
                    meta = _parse_frontmatter(skill_md.read_text(encoding='utf-8'))
                except Exception:
                    meta = {}
                sid = skill_dir.name
                tags = meta.get('tags')
                tools = meta.get('tools')
                examples = meta.get('examples')
                skills.append({
                    'id': sid,
                    'type': 'skill',
                    'name': meta.get('name', sid),
                    'description': meta.get('description', ''),
                    'icon': meta.get('icon', '📦'),
                    'author': meta.get('author', 'seekseek'),
                    'tags': tags if isinstance(tags, list) else [sid],
                    'tools': tools if isinstance(tools, list) else [],
                    'examples': examples if isinstance(examples, list) else [],
                })
        self._json(200, skills)

    def do_POST(self):
        if self.path not in ("/api/install", "/api/uninstall", "/api/mcp-install"):
            self.send_error(404)
            return

        length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(length))

        if self.path == "/api/mcp-install":
            mcp_id = body.get("mcp_id", "").strip()
            if not mcp_id:
                self._json(400, {"success": False, "output": "缺少 mcp_id"})
                return
            mcp_dir = MCP_SERVERS_DIR / mcp_id
            req_file = mcp_dir / "requirements.txt"
            if req_file.exists():
                import sysconfig
                stdlib = sysconfig.get_path("stdlib")
                marker = Path(stdlib) / "EXTERNALLY-MANAGED" if stdlib else None
                break_flag = ["--break-system-packages"] if marker and marker.exists() else []
                cmd = [sys.executable, "-m", "pip", "install", "-q", *break_flag, "-r", str(req_file)]
            else:
                self._json(400, {"success": False, "output": f"未找到 {mcp_id} 的安装文件"})
                return
        else:
            skill_id = body.get("skill_id", "").strip()
            if not skill_id:
                self._json(400, {"success": False, "output": "缺少 skill_id"})
                return
            project_path = str(REPO_ROOT)
            if self.path == "/api/install":
                if IS_WINDOWS:
                    ps1 = str(SKILLS_DIR / "install.ps1").replace("/", "\\")
                    cmd = ["PowerShell", "-File", ps1, project_path.replace("/", "\\"), skill_id]
                else:
                    cmd = ["bash", str(SKILLS_DIR / "install.sh"), project_path, skill_id]
            else:
                target = os.path.join(project_path, ".claude", "skills", skill_id)
                if IS_WINDOWS:
                    cmd = ["PowerShell", "-Command",
                           f'Remove-Item -Recurse -Force "{target.replace("/", chr(92))}"']
                else:
                    cmd = ["rm", "-rf", target]

        self._stream_cmd(cmd)

    def _stream_cmd(self, cmd):
        self.send_response(200)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Cache-Control", "no-cache")
        self.end_headers()
        try:
            proc = subprocess.Popen(
                cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                text=True, cwd=str(REPO_ROOT)
            )
            for line in proc.stdout:
                self.wfile.write(line.encode())
                self.wfile.flush()
            proc.wait()
            sentinel = b"__OK__\n" if proc.returncode == 0 else b"__FAIL__\n"
            self.wfile.write(sentinel)
            self.wfile.flush()
        except Exception as e:
            self.wfile.write(f"__FAIL__: {e}\n".encode())
            self.wfile.flush()

    def _json(self, status, data):
        body = json.dumps(data, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", len(body))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):
        pass


if __name__ == "__main__":
    import socket as _socket
    import time
    import sys

    def free_port(port):
        with _socket.socket(_socket.AF_INET, _socket.SOCK_STREAM) as s:
            if s.connect_ex(("127.0.0.1", port)) != 0:
                return
        print(f"端口 {port} 被占用，正在强制释放...")
        if IS_WINDOWS:
            subprocess.run(
                ["PowerShell", "-Command",
                 f'Stop-Process -Force -Id (Get-NetTCPConnection -LocalPort {port}).OwningProcess'],
                capture_output=True,
            )
        elif platform.system() == "Darwin":
            r = subprocess.run(["lsof", "-ti", f":{port}"], capture_output=True, text=True)
            for pid in r.stdout.split():
                try:
                    os.kill(int(pid), 9)
                except (ProcessLookupError, ValueError):
                    pass
        else:
            subprocess.run(["fuser", "-k", f"{port}/tcp"], capture_output=True)
        time.sleep(0.5)

    try:
        free_port(PORT)

        HTTPServer.allow_reuse_address = True
        server = HTTPServer(("127.0.0.1", PORT), Handler)
        print(f"SeekSeek running → http://localhost:{PORT}")
        server.serve_forever()
    except Exception as e:
        print(f"\n[ERROR] {e}", file=sys.stderr)
        input("\nPress Enter to exit...")
