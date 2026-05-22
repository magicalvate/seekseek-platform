#!/usr/bin/env python3
import json
import os
import platform
import subprocess
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

PORT = 7842
REPO_ROOT = Path(__file__).resolve().parent.parent
SKILLS_DIR = REPO_ROOT / "packages" / "skills"
WEB_DIR = Path(__file__).resolve().parent
IS_WINDOWS = platform.system() == "Windows"


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(WEB_DIR), **kwargs)

    def do_POST(self):
        if self.path not in ("/api/install", "/api/uninstall"):
            self.send_error(404)
            return

        length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(length))
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

        try:
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            success = result.returncode == 0
            output = (result.stdout + result.stderr).strip()
            self._json(200, {"success": success, "output": output or ("完成" if success else "执行失败")})
        except Exception as e:
            self._json(200, {"success": False, "output": str(e)})

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

    try:
        # Free the port if something is already listening on it
        with _socket.socket(_socket.AF_INET, _socket.SOCK_STREAM) as s:
            if s.connect_ex(("127.0.0.1", PORT)) == 0:
                if IS_WINDOWS:
                    subprocess.run(
                        ["PowerShell", "-Command",
                         f'Stop-Process -Force -Id (Get-NetTCPConnection -LocalPort {PORT}).OwningProcess'],
                        capture_output=True,
                    )
                else:
                    subprocess.run(["fuser", "-k", f"{PORT}/tcp"], capture_output=True)
                time.sleep(0.5)

        HTTPServer.allow_reuse_address = True
        server = HTTPServer(("127.0.0.1", PORT), Handler)
        print(f"SeekSeek running → http://localhost:{PORT}")
        server.serve_forever()
    except Exception as e:
        print(f"\n[ERROR] {e}", file=sys.stderr)
        input("\nPress Enter to exit...")
