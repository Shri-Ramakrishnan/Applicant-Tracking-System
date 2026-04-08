import sys
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parent
LOCAL_PACKAGES = ROOT_DIR / ".packages"

if LOCAL_PACKAGES.exists():
    sys.path.insert(0, str(LOCAL_PACKAGES))
