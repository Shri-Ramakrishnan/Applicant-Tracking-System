from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select

from pages.base_page import BasePage


class RegisterPage(BasePage):
    PATH = "/register"

    def load(self):
        self.open(self.PATH)
        self.wait.until(lambda driver: "Create Account" in driver.page_source)

    def register_user(self, user_data: dict):
        self.fill(By.NAME, "name", user_data["name"])
        self.fill(By.NAME, "email", user_data["email"])
        self.fill(By.NAME, "password", user_data["password"])
        Select(self.driver.find_element(By.NAME, "role")).select_by_value(user_data["role"])

        if user_data["role"] == "applicant":
            self.fill(By.NAME, "skills", user_data.get("skills", "Selenium, React"))
            self.fill(By.NAME, "experience", str(user_data.get("experience", "2")))
        else:
            self.fill(By.NAME, "organization", user_data["organization"])

        self.click_button("Register")
