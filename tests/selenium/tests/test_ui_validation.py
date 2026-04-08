import pytest
from selenium.webdriver.common.by import By

from utils.test_data import unique_user


@pytest.mark.ui
def test_public_navigation_buttons_are_visible(login_page):
    login_page.open("/login")
    assert login_page.is_visible(By.LINK_TEXT, "Register")
    assert login_page.is_visible(By.LINK_TEXT, "ATS PRO")


@pytest.mark.ui
def test_applicant_navigation_and_buttons_work(api_client, login_page, jobs_page):
    applicant = unique_user(role="applicant")
    api_client.register_user(applicant)

    login_page.load()
    login_page.login(applicant["email"], applicant["password"])
    login_page.wait_for_url_contains("/jobs")

    assert login_page.is_visible(By.LINK_TEXT, "Jobs")
    assert login_page.is_visible(By.LINK_TEXT, "Applications")

    login_page.click_link("Applications")
    login_page.wait_for_url_contains("/my-applications")
    login_page.click_link("Jobs")
    login_page.wait_for_url_contains("/jobs")
    assert jobs_page.view_details_button_visible()


@pytest.mark.ui
def test_recruiter_status_badge_updates_when_job_is_toggled(recruiter_credentials, login_page, recruiter_jobs_page):
    login_page.load()
    login_page.login(recruiter_credentials["email"], recruiter_credentials["password"])
    login_page.wait_for_url_contains("/recruiter/jobs")

    recruiter_jobs_page.load()
    assert recruiter_jobs_page.job_action_buttons_visible()

    initial_status = recruiter_jobs_page.first_job_status()
    recruiter_jobs_page.toggle_first_job_status()
    expected_updated = "closed" if initial_status.lower() == "active" else "active"
    recruiter_jobs_page.wait_for_first_job_status(expected_updated)
    updated_status = recruiter_jobs_page.first_job_status()
    assert updated_status != initial_status

    recruiter_jobs_page.toggle_first_job_status()
    recruiter_jobs_page.wait_for_first_job_status(initial_status)
    restored_status = recruiter_jobs_page.first_job_status()
    assert restored_status == initial_status
