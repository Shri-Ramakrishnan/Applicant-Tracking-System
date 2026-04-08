from pathlib import Path

import pytest
from selenium.common.exceptions import WebDriverException

from config import RECRUITER_EMAIL, RECRUITER_PASSWORD, SCREENSHOT_DIR
from pages.job_applications_page import JobApplicationsPage
from pages.job_detail_page import JobDetailPage
from pages.jobs_page import JobsPage
from pages.login_page import LoginPage
from pages.my_applications_page import MyApplicationsPage
from pages.recruiter_jobs_page import RecruiterJobsPage
from pages.register_page import RegisterPage
from pages.schedule_interview_page import ScheduleInterviewPage
from pages.generate_offer_page import GenerateOfferPage
from utils.api_client import ATSApiClient
from utils.driver_factory import build_driver
from utils.test_data import unique_user


@pytest.fixture(scope="session")
def api_client():
    client = ATSApiClient()
    yield client
    client.close()


@pytest.fixture
def driver():
    web_driver = build_driver()
    yield web_driver
    web_driver.quit()


@pytest.fixture
def login_page(driver):
    return LoginPage(driver)


@pytest.fixture
def register_page(driver):
    return RegisterPage(driver)


@pytest.fixture
def jobs_page(driver):
    return JobsPage(driver)


@pytest.fixture
def job_detail_page(driver):
    return JobDetailPage(driver)


@pytest.fixture
def my_applications_page(driver):
    return MyApplicationsPage(driver)


@pytest.fixture
def recruiter_jobs_page(driver):
    return RecruiterJobsPage(driver)


@pytest.fixture
def job_applications_page(driver):
    return JobApplicationsPage(driver)


@pytest.fixture
def schedule_interview_page(driver):
    return ScheduleInterviewPage(driver)


@pytest.fixture
def generate_offer_page(driver):
    return GenerateOfferPage(driver)


@pytest.fixture
def recruiter_credentials():
    return {"email": RECRUITER_EMAIL, "password": RECRUITER_PASSWORD}


@pytest.fixture
def applicant_data():
    return unique_user(role="applicant")


@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    report = outcome.get_result()
    if report.when != "call" or report.passed:
        return

    driver = item.funcargs.get("driver")
    if not driver:
        return

    SCREENSHOT_DIR.mkdir(parents=True, exist_ok=True)
    file_name = f"{item.name}.png"
    screenshot_path = SCREENSHOT_DIR / file_name
    try:
        driver.save_screenshot(str(screenshot_path))
        report.sections.append(("screenshot", f"Saved screenshot to {screenshot_path}"))
    except WebDriverException as exc:
        report.sections.append(("screenshot", f"Unable to capture screenshot: {exc}"))
