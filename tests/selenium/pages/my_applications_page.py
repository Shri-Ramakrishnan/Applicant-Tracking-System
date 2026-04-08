from selenium.webdriver.common.by import By

from pages.base_page import BasePage


class MyApplicationsPage(BasePage):
    PATH = "/my-applications"

    def load(self):
        self.open(self.PATH)
        self.wait.until(lambda driver: "My Applications" in driver.page_source)

    def latest_status(self) -> str:
        return self.text_of(By.CSS_SELECTOR, "article span.rounded-full")

    def latest_job_title(self) -> str:
        return self.text_of(By.CSS_SELECTOR, "article h2")
