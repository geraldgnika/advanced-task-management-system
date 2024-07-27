import { browser, element, by } from 'protractor';

export class TaskListPage {
  async navigateTo() {
    await browser.get('/task/list');
  }

  async getTaskCount() {
    return element.all(by.css('.task-item')).count();
  }

  async switchToGridView() {
    await element(by.css('.grid-view-button')).click();
  }

  async switchToBoardView() {
    await element(by.css('.board-view-button')).click();
  }

  async switchToCalendarView() {
    await element(by.css('.calendar-view-button')).click();
  }

  async isGridViewActive() {
    return element(by.css('.grid-view.active')).isPresent();
  }

  async isBoardViewActive() {
    return element(by.css('.board-view.active')).isPresent();
  }

  async isCalendarViewActive() {
    return element(by.css('.calendar-view.active')).isPresent();
  }

  async filterByStatus(status: string) {
    await element(by.css('select[name="status"]')).element(by.cssContainingText('option', status)).click();
  }

  async getLastTaskTitle() {
    return element.all(by.css('.task-item .task-title')).last().getText();
  }

  async getFirstTaskTitle() {
    return element.all(by.css('.task-item .task-title')).first().getText();
  }

  async clickFirstTask() {
    await element.all(by.css('.task-item')).first().click();
  }

  async deleteFirstTask() {
    await element.all(by.css('.task-item .delete-button')).first().click();
  }

  async getCreateTaskButton() {
    return element(by.css('.create-task-button')).isPresent();
  }
}