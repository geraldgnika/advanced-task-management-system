import { browser, element, by } from 'protractor';

export class LoginPage {
  async navigateTo() {
    await browser.get('/authentication/login');
  }

  async login(username: string, password: string) {
    await element(by.name('username')).sendKeys(username);
    await element(by.name('password')).sendKeys(password);
    await element(by.buttonText('Login')).click();
  }

  async getErrorMessage() {
    return element(by.css('.error-message')).getText();
  }
}