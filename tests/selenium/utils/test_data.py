from __future__ import annotations

from datetime import date, datetime, timedelta
from pathlib import Path
from uuid import uuid4


DATA_DIR = Path(__file__).resolve().parent.parent / "data"
MOCK_RESUME_PATH = DATA_DIR / "mock_resume.pdf"


def unique_email(prefix: str = "qa") -> str:
    stamp = datetime.now().strftime("%Y%m%d%H%M%S")
    return f"{prefix}.{stamp}.{uuid4().hex[:6]}@example.com"


def unique_user(role: str = "applicant") -> dict:
    suffix = uuid4().hex[:6]
    name = f"QA {role.title()} {suffix}"
    email = unique_email(prefix=role)
    payload = {
        "name": name,
        "email": email,
        "password": "Password123!",
        "role": role,
    }

    if role == "applicant":
        payload["skills"] = "React, Node.js, MongoDB, Selenium"
        payload["experience"] = "3"
    else:
        payload["organization"] = f"QA Org {suffix}"

    return payload


def interview_datetime_local(days_ahead: int = 2, hour: int = 11, minute: int = 0) -> str:
    uniqueness = int(uuid4().hex[:4], 16)
    day_offset = days_ahead + (uniqueness % 14)
    hour_offset = (hour + ((uniqueness // 14) % 8)) % 24
    minute_offset = (minute + ((uniqueness // 112) % 12) * 5) % 60
    target = datetime.now() + timedelta(days=day_offset)
    local_dt = target.replace(hour=hour_offset, minute=minute_offset, second=0, microsecond=0)
    return local_dt.strftime("%Y-%m-%dT%H:%M")


def joining_date(days_ahead: int = 14) -> str:
    return (date.today() + timedelta(days=days_ahead)).isoformat()
