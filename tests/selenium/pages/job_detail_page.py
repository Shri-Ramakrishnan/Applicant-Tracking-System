from pathlib import Path

from selenium.webdriver.common.by import By

from pages.base_page import BasePage


class JobDetailPage(BasePage):
    def upload_resume(self, resume_path: Path):
        file_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='file']")
        file_input.send_keys(str(resume_path))

    def submit_application(self):
        self.click_button("Submit Application")

    def success_message_visible(self) -> bool:
        return self.is_visible(By.XPATH, "//*[contains(normalize-space(), 'Applied Successfully')]")

    def title(self) -> str:
        return self.text_of(By.TAG_NAME, "h1")
