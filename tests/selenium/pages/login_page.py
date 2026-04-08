from selenium.webdriver.common.by import By

from pages.base_page import BasePage


class LoginPage(BasePage):
    PATH = "/login"

    def load(self):
        self.open(self.PATH)
        self.wait.until(lambda driver: "Sign In" in driver.page_source)

    def login(self, email: str, password: str):
        self.fill(By.NAME, "email", email)
        self.fill(By.NAME, "password", password)
        self.click_button("Sign In")

    def error_message(self) -> str:
        return self.text_of(By.CSS_SELECTOR, "div.border-red-300")
