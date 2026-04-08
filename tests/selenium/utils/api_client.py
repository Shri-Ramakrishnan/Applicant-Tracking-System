from __future__ import annotations

from pathlib import Path

import requests

from config import API_BASE_URL
from utils.test_data import MOCK_RESUME_PATH, unique_user


class ATSApiClient:
    def __init__(self):
        self.session = requests.Session()
        self.base_url = API_BASE_URL

    def close(self):
        self.session.close()

    def _url(self, path: str) -> str:
        return f"{self.base_url}{path}"

    def register_user(self, payload: dict) -> dict:
        response = self.session.post(self._url("/auth/register"), json=payload, timeout=30)
        response.raise_for_status()
        return response.json()

    def login(self, email: str, password: str) -> dict:
        response = self.session.post(
            self._url("/auth/login"),
            json={"email": email, "password": password},
            timeout=30,
        )
        response.raise_for_status()
        return response.json()

    def get_active_jobs(self, token: str | None = None) -> list[dict]:
        headers = self._auth_headers(token)
        response = self.session.get(self._url("/jobs"), headers=headers, timeout=30)
        response.raise_for_status()
        return response.json()

    def apply_to_job(self, token: str, job_id: str, resume_path: Path | None = None) -> dict:
        file_path = resume_path or MOCK_RESUME_PATH
        with file_path.open("rb") as file_handle:
            response = self.session.post(
                self._url(f"/applications/apply/{job_id}"),
                headers=self._auth_headers(token),
                files={"resume": (file_path.name, file_handle, "application/pdf")},
                timeout=30,
            )
        response.raise_for_status()
        return response.json()

    def create_applicant_and_application(self, job_id: str) -> dict:
        applicant = unique_user(role="applicant")
        auth_payload = self.register_user(applicant)
        application = self.apply_to_job(auth_payload["token"], job_id)
        return {
            "applicant": applicant,
            "auth": auth_payload,
            "application": application,
        }

    def generate_offer(self, token: str, application_id: str, salary: str, joining_date: str) -> dict:
        response = self.session.post(
            self._url("/offers/generate"),
            headers=self._auth_headers(token),
            json={
                "applicationId": application_id,
                "salary": salary,
                "joiningDate": joining_date,
            },
            timeout=30,
        )
        response.raise_for_status()
        return response.json()

    @staticmethod
    def _auth_headers(token: str | None) -> dict:
        return {"Authorization": f"Bearer {token}"} if token else {}
