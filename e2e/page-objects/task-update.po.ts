import { by, element } from 'protractor';

export class TaskUpdatePage {
  async updateTaskTitle(newTitle: string) {
    await element(by.name('title')).clear();
    await element(by.name('title')).sendKeys(newTitle);
    await element(by.buttonText('Update Task')).click();
  }
}