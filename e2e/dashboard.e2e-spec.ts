import { DashboardPage } from './page-objects/dashboard.po';
import { LoginPage } from './page-objects/login.po';

describe('Dashboard', () => {
  let dashboardPage: DashboardPage;
  let loginPage: LoginPage;

  beforeEach(async () => {
    dashboardPage = new DashboardPage();
    loginPage = new LoginPage();
    await loginPage.navigateTo();
    await loginPage.login('gerald_nika', '123456');
  });

  it('should display dashboard elements', async () => {
    expect(await dashboardPage.getPageTitle()).toEqual('Dashboard');
    expect(await dashboardPage.getTaskSummary()).toBeTruthy();
    expect(await dashboardPage.getRecentActivities()).toBeTruthy();
  });

  it('should display different elements based on user role', async () => {
    expect(await dashboardPage.getInsightsLink()).toBeTruthy();

    await dashboardPage.logout();
    await loginPage.login('gerardo_tatzati', '123456');
    expect(await dashboardPage.getInsightsLink()).toBeFalsy();
  });
});
