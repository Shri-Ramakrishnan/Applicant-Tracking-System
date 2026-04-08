from selenium.webdriver.common.by import By

from pages.base_page import BasePage


class RecruiterJobsPage(BasePage):
    PATH = "/recruiter/jobs"

    def load(self):
        self.open(self.PATH)
        self.wait.until(lambda driver: "My Job Postings" in driver.page_source)

    def first_job_status(self) -> str:
        return self.text_of(By.CSS_SELECTOR, "article span.rounded-full")

    def first_job_title(self) -> str:
        return self.text_of(By.CSS_SELECTOR, "article h2")

    def open_first_job_applications(self):
        self.click(By.XPATH, "(//a[normalize-space()='View Applications'])[1]")

    def open_applications_for_job(self, title: str):
        xpath = (
            f"//article[.//h2[normalize-space()='{title}']]"
            "//a[normalize-space()='View Applications']"
        )
        link = self.wait.until(lambda driver: driver.find_element(By.XPATH, xpath))
        href = link.get_attribute("href")
        self.driver.get(href)
        self.wait_for_url_contains("/applications")

    def toggle_first_job_status(self):
        button_xpath = "(//article)[1]//button[normalize-space()='Close Job' or normalize-space()='Reopen Job']"
        button = self.wait.until(lambda driver: driver.find_element(By.XPATH, button_xpath))
        self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", button)
        self.driver.execute_script("arguments[0].click();", button)

    def job_action_buttons_visible(self) -> bool:
        return self.is_visible(By.XPATH, "(//a[normalize-space()='View Applications'])[1]") and self.is_visible(
            By.XPATH,
            "(//article)[1]//button[normalize-space()='Close Job' or normalize-space()='Reopen Job']",
        )

    def wait_for_first_job_status(self, expected_status: str):
        self.wait.until(lambda driver: self.first_job_status().lower() == expected_status.lower())
