# Selenium E2E Test Setup

This folder adds a fully isolated Selenium test harness for your ATS without modifying any existing app code.

## Folder Structure

```text
tests/selenium/
├── .env.example
├── README.md
├── conftest.py
├── config.py
├── pytest.ini
├── requirements.txt
├── artifacts/
│   └── screenshots/
├── data/
│   └── mock_resume.pdf
├── pages/
│   ├── base_page.py
│   ├── generate_offer_page.py
│   ├── job_applications_page.py
│   ├── job_detail_page.py
│   ├── jobs_page.py
│   ├── login_page.py
│   ├── my_applications_page.py
│   ├── recruiter_jobs_page.py
│   ├── register_page.py
│   └── schedule_interview_page.py
├── tests/
│   ├── test_applicant_flow.py
│   ├── test_authentication.py
│   ├── test_recruiter_flow.py
│   └── test_ui_validation.py
└── utils/
    ├── api_client.py
    ├── driver_factory.py
    └── test_data.py
```

## What The Suite Covers

- Authentication
  - Register a new applicant user
  - Login with valid credentials
  - Login with invalid credentials
- Applicant flow
  - Browse jobs
  - Open job details
  - Upload a mock PDF resume
  - Submit an application
  - Verify success state and application status
- Recruiter flow
  - Login as recruiter
  - View posted jobs
  - Open applications
  - Shortlist candidate
  - Reject candidate
  - Schedule interview
  - Generate offer
- UI validation
  - Navbar buttons visible
  - Navigation works
  - Status badges update correctly

## Prerequisites

1. Backend running on `http://localhost:5000`
2. Frontend running on `http://localhost:3000`
3. MongoDB available to the backend
4. Seed data loaded for the recruiter account and jobs:

```powershell
cd backend
npm run seed
```

That seed creates:

- Recruiter: `recruiter@ats.com` / `password123`
- Active jobs for applicant and recruiter flows

## Install

```powershell
cd tests/selenium
python -m pip install virtualenv
python -m virtualenv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

If needed, update `.env` with your local URLs or recruiter credentials.

## Run Tests

Run the full suite:

```powershell
cd tests/selenium
.venv\Scripts\Activate.ps1
pytest
```

Run only the presentation-safe smoke path:

```powershell
pytest -m smoke
```

Run a single area:

```powershell
pytest tests/test_authentication.py
pytest tests/test_applicant_flow.py
pytest tests/test_recruiter_flow.py
pytest tests/test_ui_validation.py
```

Run in headless mode:

```powershell
$env:HEADLESS="true"
pytest -m smoke
```

Run with the browser visible for presentation:

```powershell
$env:HEADLESS="false"
pytest -v
```

## Notes

- Screenshots are saved automatically on test failure under `artifacts/screenshots/`
- Selenium 4 uses Selenium Manager, so you usually do not need to install ChromeDriver manually
- `webdriver-manager` is included as a fallback dependency for environments where Selenium Manager is blocked
- Recruiter tests create their own applicant/application data through backend APIs for repeatability
- Applicant UI tests use unique emails on every run to avoid collisions
