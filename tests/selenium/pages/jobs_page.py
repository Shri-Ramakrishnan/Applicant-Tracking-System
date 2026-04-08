from selenium.webdriver.common.by import By

from pages.base_page import BasePage


class JobsPage(BasePage):
    PATH = "/jobs"

    def load(self):
        self.open(self.PATH)
        self.wait.until(lambda driver: "Available Positions" in driver.page_source)

    def open_first_job_details(self):
        self.click(By.XPATH, "(//a[normalize-space()='View Details'])[1]")

    def job_count(self) -> int:
        return len(self.find_cards())

    def view_details_button_visible(self) -> bool:
        return self.is_visible(By.XPATH, "(//a[normalize-space()='View Details'])[1]")
