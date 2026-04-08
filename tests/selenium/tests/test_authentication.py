import pytest
from selenium.webdriver.common.by import By

from utils.test_data import unique_user


@pytest.mark.auth
@pytest.mark.smoke
def test_register_new_user(register_page):
    applicant = unique_user(role="applicant")

    register_page.load()
    register_page.register_user(applicant)

    register_page.wait_for_url_contains("/jobs")
    assert "/jobs" in register_page.current_path()
    assert register_page.is_visible(By.XPATH, f"//a[normalize-space()='{applicant['name']}']")


@pytest.mark.auth
def test_login_with_valid_credentials(api_client, login_page):
    applicant = unique_user(role="applicant")
    api_client.register_user(applicant)

    login_page.load()
    login_page.login(applicant["email"], applicant["password"])

    login_page.wait_for_url_contains("/jobs")
    assert "/jobs" in login_page.current_path()


@pytest.mark.auth
def test_login_with_invalid_credentials(login_page):
    login_page.load()
    login_page.login("wrong.user@example.com", "bad-password")

    assert "failed" in login_page.error_message().lower() or "invalid" in login_page.error_message().lower()
