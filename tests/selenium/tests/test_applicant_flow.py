import pytest

from utils.test_data import MOCK_RESUME_PATH, unique_user


@pytest.mark.applicant
@pytest.mark.smoke
def test_applicant_can_browse_and_apply(register_page, jobs_page, job_detail_page, my_applications_page):
    applicant = unique_user(role="applicant")

    register_page.load()
    register_page.register_user(applicant)
    register_page.wait_for_url_contains("/jobs")

    jobs_page.load()
    assert jobs_page.job_count() > 0
    assert jobs_page.view_details_button_visible()

    jobs_page.open_first_job_details()
    selected_title = job_detail_page.title()
    job_detail_page.upload_resume(MOCK_RESUME_PATH)
    job_detail_page.submit_application()

    assert job_detail_page.success_message_visible()

    my_applications_page.load()
    assert my_applications_page.latest_job_title() == selected_title
    assert my_applications_page.latest_status() == "Applied"
