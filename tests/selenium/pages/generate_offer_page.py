from selenium.webdriver.common.by import By

from pages.base_page import BasePage


class GenerateOfferPage(BasePage):
    def generate_offer(self, salary: str, joining_date: str):
        self.fill(By.NAME, "salary", salary)
        self.set_input_value(By.NAME, "joiningDate", joining_date)
        form = self.wait.until(lambda driver: driver.find_element(By.TAG_NAME, "form"))
        self.driver.execute_script("arguments[0].requestSubmit();", form)
