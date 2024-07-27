import { browser, element, by } from 'protractor';

export class TaskCreatePage {
  async navigateTo() {
    await browser.get('/task/create');
  }

  async createTask(title: string, description: string, priority: string, status: string) {
    await element(by.name('title')).sendKeys(title);
    await element(by.name('description')).sendKeys(description);
    await element(by.css(`select[name="priority"] option[value="${priority}"]`)).click();
    await element(by.css(`select[name="status"] option[value="${status}"]`)).click();
    await element(by.buttonText('Create Task')).click();
  }
}