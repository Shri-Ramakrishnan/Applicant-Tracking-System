from __future__ import annotations

from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from config import BASE_URL, DEFAULT_TIMEOUT


class BasePage:
    def __init__(self, driver: WebDriver):
        self.driver = driver
        self.wait = WebDriverWait(driver, DEFAULT_TIMEOUT)

    def open(self, path: str):
        self.driver.get(f"{BASE_URL}{path}")

    def click(self, by: By, value: str):
        self.wait.until(EC.element_to_be_clickable((by, value))).click()

    def fill(self, by: By, value: str, text: str):
        element = self.wait.until(EC.visibility_of_element_located((by, value)))
        element.clear()
        element.send_keys(text)

    def text_of(self, by: By, value: str) -> str:
        element = self.wait.until(EC.visibility_of_element_located((by, value)))
        return element.text.strip()

    def is_visible(self, by: By, value: str) -> bool:
        try:
            self.wait.until(EC.visibility_of_element_located((by, value)))
            return True
        except TimeoutException:
            return False

    def wait_for_url_contains(self, fragment: str):
        self.wait.until(EC.url_contains(fragment))

    def current_path(self) -> str:
        return self.driver.current_url.replace(BASE_URL, "")

    def click_button(self, text: str):
        xpath = f"//button[normalize-space()='{text}'] | //input[@type='submit' and @value='{text}']"
        self.click(By.XPATH, xpath)

    def click_link(self, text: str):
        self.click(By.LINK_TEXT, text)

    def find_cards(self, article_xpath: str = "//article") -> list:
        self.wait.until(EC.presence_of_all_elements_located((By.XPATH, article_xpath)))
        return self.driver.find_elements(By.XPATH, article_xpath)

    def set_input_value(self, by: By, value: str, text: str):
        element = self.wait.until(EC.visibility_of_element_located((by, value)))
        self.driver.execute_script(
            """
            const element = arguments[0];
            const nextValue = arguments[1];
            const prototype = element.tagName === 'TEXTAREA'
              ? window.HTMLTextAreaElement.prototype
              : window.HTMLInputElement.prototype;
            const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value');
            descriptor.set.call(element, nextValue);
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
            """,
            element,
            text,
        )
