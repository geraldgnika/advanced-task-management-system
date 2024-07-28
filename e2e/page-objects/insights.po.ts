import { browser, by, element } from 'protractor';

export class InsightsPage {
  async navigateTo() {
    await browser.get('/landing/insights');
  }

  async isPriorityChartVisible() {
    return element(by.css('.priority-chart')).isPresent();
  }

  async isStatusChartVisible() {
    return element(by.css('.status-chart')).isPresent();
  }

  async isAssignmentsChartVisible() {
    return element(by.css('.assignments-chart')).isPresent();
  }
}
