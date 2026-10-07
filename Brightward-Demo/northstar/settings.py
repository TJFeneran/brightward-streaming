"""Server-only configuration for the Brightward API project."""
import os
from pathlib import Path

from openai import OpenAI

PROJECT_ID = "proj_ZVeLEv0xHj4ZO6o5jVpWj1yO"
KEY_FILE = Path(__file__).resolve().parents[1] / ".northstar" / "openai-api-key"


def api_key():
    # A deliberately saved project key takes precedence over an older shell key.
    if KEY_FILE.exists():
        if KEY_FILE.is_symlink() or KEY_FILE.stat().st_mode & 0o077:
            raise ValueError("The local API key file must be private (chmod 600).")
        return KEY_FILE.read_text().strip()
    return os.environ.get("OPENAI_API_KEY", "").strip()


def client(*, timeout=75.0, max_retries=0):
    key = api_key()
    if not key:
        raise ValueError("API setup is needed. Run python -m northstar.credentials.")
    return OpenAI(api_key=key, project=PROJECT_ID, timeout=timeout, max_retries=max_retries)
