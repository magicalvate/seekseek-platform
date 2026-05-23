import importlib.util
import subprocess
import sys
from pathlib import Path

DIR = Path(__file__).parent

# mcp requires Python 3.10+; re-exec with a newer interpreter if needed
if sys.version_info < (3, 10):
    candidates = [
        "python3.13", "python3.12", "python3.11", "python3.10",
        "/opt/miniconda3/bin/python3",
        "/opt/homebrew/bin/python3",
        "/usr/local/bin/python3",
    ]
    for candidate in candidates:
        try:
            ok = subprocess.call(
                [candidate, "-c",
                 "import sys; sys.exit(0 if sys.version_info >= (3, 10) else 1)"],
                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
            )
            if ok == 0:
                sys.exit(subprocess.call([candidate] + sys.argv))
        except FileNotFoundError:
            continue
    print("Error: Python 3.10+ is required. Install via conda or homebrew.", file=sys.stderr)
    sys.exit(1)

if importlib.util.find_spec("mcp") is None:
    marker = Path(sys.executable).parent.parent / "EXTERNALLY-MANAGED"
    break_flag = ["--break-system-packages"] if marker.exists() else []
    subprocess.check_call(
        [sys.executable, "-m", "pip", "install", "-r", str(DIR / "requirements.txt"), "-q", *break_flag]
    )

import runpy
runpy.run_path(str(DIR / "server.py"), run_name="__main__")
