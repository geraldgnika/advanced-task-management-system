import { browser } from 'protractor';
import { UserRoles } from '../src/app/core/types/enums/authentication/user-roles';
import { DashboardPage } from './page-objects/dashboard.po';
import { LoginPage } from './page-objects/login.po';
import { RegisterPage } from './page-objects/register.po';

describe('Authentication', () => {
  let loginPage: LoginPage;
  let registerPage: RegisterPage;
  let dashboardPage: DashboardPage;

  beforeEach(() => {
    loginPage = new LoginPage();
    registerPage = new RegisterPage();
    dashboardPage = new DashboardPage();
  });

  it('should login successfully', async () => {
    await loginPage.navigateTo();
    await loginPage.login('gerald_nika', '123456');
    expect(await dashboardPage.getPageTitle()).toEqual('Dashboard');
  });

  it('should display error for invalid credentials', async () => {
    await loginPage.navigateTo();
    await loginPage.login('invaliduser', 'wrongpassword');
    expect(await loginPage.getErrorMessage()).toContain('Invalid credentials');
  });

  it('should register a new user', async () => {
    await registerPage.navigateTo();
    await registerPage.register(
      'New User',
      'newuser',
      '123456',
      UserRoles.Developer
    );
    expect(await dashboardPage.getPageTitle()).toEqual('Dashboard');
  });

  it('should logout successfully', async () => {
    await loginPage.navigateTo();
    await loginPage.login('gerald_nika', '123456');
    await dashboardPage.logout();
    expect(await browser.getCurrentUrl()).toContain('/authentication/login');
  });
});
