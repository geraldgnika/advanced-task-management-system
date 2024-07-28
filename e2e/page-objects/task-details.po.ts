import { by, element } from 'protractor';

export class TaskDetailsPage {
  async getTaskTitle() {
    return element(by.css('.task-title')).getText();
  }

  async getTaskDescription() {
    return element(by.css('.task-description')).getText();
  }

  async getCommentCount() {
    return element.all(by.css('.comment-item')).count();
  }

  async addComment(commentText: string) {
    await element(by.name('comment')).sendKeys(commentText);
    await element(by.buttonText('Add Comment')).click();
  }

  async getLastCommentText() {
    return element.all(by.css('.comment-item')).last().getText();
  }
}
