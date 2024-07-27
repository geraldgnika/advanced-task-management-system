import { browser, element, by } from 'protractor';

export class RegisterPage {
  async navigateTo() {
    await browser.get('/authentication/register');
  }

  async register(fullName: string, username: string, password: string, role: string) {
    await element(by.name('full_name')).sendKeys(fullName);
    await element(by.name('username')).sendKeys(username);
    await element(by.name('password')).sendKeys(password);
    await element(by.css(`select[name="role"] option[value="${role}"]`)).click();
    await element(by.buttonText('Register')).click();
  }
}