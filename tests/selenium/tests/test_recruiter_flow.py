import pytest

from utils.test_data import interview_datetime_local, joining_date


@pytest.mark.recruiter
@pytest.mark.smoke
def test_recruiter_can_manage_application_lifecycle(
    api_client,
    recruiter_credentials,
    login_page,
    recruiter_jobs_page,
    job_applications_page,
    schedule_interview_page,
    generate_offer_page,
):
    recruiter_auth = api_client.login(recruiter_credentials["email"], recruiter_credentials["password"])
    jobs = api_client.get_active_jobs(recruiter_auth["token"])
    assert jobs, "Seeded active jobs are required for recruiter flow."

    target_job = jobs[0]
    offer_candidate = api_client.create_applicant_and_application(target_job["_id"])
    reject_candidate = api_client.create_applicant_and_application(target_job["_id"])

    login_page.load()
    login_page.login(recruiter_credentials["email"], recruiter_credentials["password"])
    login_page.wait_for_url_contains("/recruiter/jobs")

    recruiter_jobs_page.load()
    recruiter_jobs_page.open_applications_for_job(target_job["title"])

    job_applications_page.wait_until_loaded()
    job_applications_page.wait_for_applicant(offer_candidate["applicant"]["email"])
    job_applications_page.wait_for_applicant(reject_candidate["applicant"]["email"])

    job_applications_page.click_action(reject_candidate["applicant"]["email"], "Reject")
    job_applications_page.wait_for_status(reject_candidate["applicant"]["email"], "Rejected")
    assert job_applications_page.status_for(reject_candidate["applicant"]["email"]) == "Rejected"

    job_applications_page.click_action(offer_candidate["applicant"]["email"], "Shortlist")
    job_applications_page.wait_for_status(offer_candidate["applicant"]["email"], "Shortlisted")
    assert job_applications_page.status_for(offer_candidate["applicant"]["email"]) == "Shortlisted"

    job_applications_page.click_action(offer_candidate["applicant"]["email"], "Schedule Interview")
    schedule_interview_page.schedule(interview_datetime_local(), mode="Online")
    job_applications_page.wait_until_loaded()
    job_applications_page.wait_for_status(offer_candidate["applicant"]["email"], "Interview Scheduled")
    assert job_applications_page.status_for(offer_candidate["applicant"]["email"]) == "Interview Scheduled"

    job_applications_page.click_action(offer_candidate["applicant"]["email"], "Generate Offer")
    generate_offer_page.wait_for_url_contains("/recruiter/offer/")
    api_client.generate_offer(
        recruiter_auth["token"],
        offer_candidate["application"]["_id"],
        "95000",
        joining_date(),
    )
    generate_offer_page.open(f"/recruiter/jobs/{target_job['_id']}/applications")
    job_applications_page.wait_until_loaded()
    job_applications_page.wait_for_status(offer_candidate["applicant"]["email"], "Offered")
    assert job_applications_page.status_for(offer_candidate["applicant"]["email"]) == "Offered"
