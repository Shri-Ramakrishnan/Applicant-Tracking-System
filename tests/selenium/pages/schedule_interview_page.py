from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select

from pages.base_page import BasePage


class ScheduleInterviewPage(BasePage):
    def schedule(self, interview_datetime: str, mode: str = "Online"):
        self.set_input_value(By.NAME, "interviewDate", interview_datetime)
        Select(self.driver.find_element(By.NAME, "mode")).select_by_visible_text(mode)
        submit_button = self.wait.until(
            lambda driver: driver.find_element(By.XPATH, "//button[@type='submit' and normalize-space()='Schedule Interview']")
        )
        self.driver.execute_script("arguments[0].click();", submit_button)
