import { browser, element, by } from 'protractor';

export class DashboardPage {
  async getPageTitle() {
    return element(by.css('h1')).getText();
  }

  async getTaskSummary() {
    return element(by.css('.task-summary')).isPresent();
  }

  async getRecentActivities() {
    return element(by.css('.recent-activities')).isPresent();
  }

  async getInsightsLink() {
    return element(by.linkText('Insights')).isPresent();
  }

  async logout() {
    await element(by.css('.logout-button')).click();
  }
}