from selenium.webdriver.common.by import By

from pages.base_page import BasePage


class JobApplicationsPage(BasePage):
    def wait_until_loaded(self):
        self.wait.until(lambda driver: "Applications:" in driver.page_source)

    def _card_xpath(self, applicant_email: str) -> str:
        return f"//article[.//p[normalize-space()='{applicant_email}']]"

    def wait_for_applicant(self, applicant_email: str):
        self.wait.until(lambda driver: len(driver.find_elements(By.XPATH, self._card_xpath(applicant_email))) > 0)

    def status_for(self, applicant_email: str) -> str:
        return self.text_of(By.XPATH, f"{self._card_xpath(applicant_email)}//span[contains(@class,'rounded-full')]")

    def click_action(self, applicant_email: str, action_text: str):
        locator = f"{self._card_xpath(applicant_email)}//*[self::button or self::a][normalize-space()='{action_text}']"
        element = self.wait.until(lambda driver: driver.find_element(By.XPATH, locator))
        self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", element)
        self.driver.execute_script("arguments[0].click();", element)

    def wait_for_status(self, applicant_email: str, expected_status: str):
        self.wait.until(lambda driver: self.status_for(applicant_email) == expected_status)
