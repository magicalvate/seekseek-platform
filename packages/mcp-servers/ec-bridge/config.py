import os
import json

CLOUD_API_BASE = os.getenv("CLOUD_API_BASE", "http://106.13.15.237:8199")
CLOUD_API_KEY = os.getenv("CLOUD_API_KEY", "")

# Set USE_MOCK=true to run without a real cloud API (uses mock_data.py)
USE_MOCK = os.getenv("USE_MOCK", "false").lower() == "true"

# Persistent config file, stored alongside config.py
_CONFIG_FILE = os.path.join(os.path.dirname(__file__), "ec_bridge.config.json")


def _load_local_config() -> dict:
    if os.path.exists(_CONFIG_FILE):
        with open(_CONFIG_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def _save_local_config(data: dict) -> None:
    existing = _load_local_config()
    existing.update(data)
    with open(_CONFIG_FILE, "w", encoding="utf-8") as f:
        json.dump(existing, f, ensure_ascii=False, indent=2)


def get_save_dir() -> str:
    return _load_local_config().get("save_dir", "")


def set_save_dir(path: str) -> None:
    _save_local_config({"save_dir": path})
