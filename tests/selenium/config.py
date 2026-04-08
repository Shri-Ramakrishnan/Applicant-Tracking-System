import os
from pathlib import Path

from dotenv import load_dotenv


ROOT_DIR = Path(__file__).resolve().parent
load_dotenv(ROOT_DIR / ".env")


def _as_bool(value: str | None, default: bool = False) -> bool:
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


BASE_URL = os.getenv("BASE_URL", "http://localhost:3000").rstrip("/")
API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:5000/api").rstrip("/")
HEADLESS = _as_bool(os.getenv("HEADLESS"), default=True)
DEFAULT_TIMEOUT = int(os.getenv("DEFAULT_TIMEOUT", "15"))
SCREENSHOT_DIR = ROOT_DIR / os.getenv("SCREENSHOT_DIR", "artifacts/screenshots")

RECRUITER_EMAIL = os.getenv("RECRUITER_EMAIL", "recruiter@ats.com")
RECRUITER_PASSWORD = os.getenv("RECRUITER_PASSWORD", "password123")
