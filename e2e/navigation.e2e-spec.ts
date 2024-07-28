import { LoginPage } from './page-objects/login.po';
import { NavigationPage } from './page-objects/navigation.po';

describe('Navigation', () => {
  let navigationPage: NavigationPage;
  let loginPage: LoginPage;

  beforeEach(async () => {
    navigationPage = new NavigationPage();
    loginPage = new LoginPage();
    await loginPage.navigateTo();
    await loginPage.login('gerald_nika', '123456');
  });

  it('should navigate to dashboard', async () => {
    await navigationPage.clickDashboardLink();
    expect(await navigationPage.getCurrentUrl()).toContain(
      '/landing/dashboard'
    );
  });

  it('should navigate to task list', async () => {
    await navigationPage.clickTasksLink();
    expect(await navigationPage.getCurrentUrl()).toContain('/task/list');
  });

  it('should navigate to insights for manager role', async () => {
    await loginPage.login('manager', '123456');
    await navigationPage.clickInsightsLink();
    expect(await navigationPage.getCurrentUrl()).toContain('/landing/insights');
  });
});
