import importlib.util
import subprocess
import sys
from pathlib import Path

DIR = Path(__file__).parent

if importlib.util.find_spec("mcp") is None:
    subprocess.check_call(
        [sys.executable, "-m", "pip", "install", "-r", str(DIR / "requirements.txt"), "-q"]
    )

import runpy
runpy.run_path(str(DIR / "server.py"), run_name="__main__")
