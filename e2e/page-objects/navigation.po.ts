import { browser, element, by } from 'protractor';

export class NavigationPage {
  async clickDashboardLink() {
    await element(by.linkText('Dashboard')).click();
  }

  async clickTasksLink() {
    await element(by.linkText('Tasks')).click();
  }

  async clickInsightsLink() {
    await element(by.linkText('Insights')).click();
  }

  async getCurrentUrl() {
    return browser.getCurrentUrl();
  }
}