import { InsightsPage } from './page-objects/insights.po';
import { LoginPage } from './page-objects/login.po';

describe('Insights', () => {
  let insightsPage: InsightsPage;
  let loginPage: LoginPage;

  beforeEach(async () => {
    insightsPage = new InsightsPage();
    loginPage = new LoginPage();
    await loginPage.navigateTo();
    await loginPage.login('gerald_nika', '123456');
    await insightsPage.navigateTo();
  });

  it('should display priority distribution chart', async () => {
    expect(await insightsPage.isPriorityChartVisible()).toBeTruthy();
  });

  it('should display status distribution chart', async () => {
    expect(await insightsPage.isStatusChartVisible()).toBeTruthy();
  });

  it('should display task assignments chart', async () => {
    expect(await insightsPage.isAssignmentsChartVisible()).toBeTruthy();
  });
});