import { LoginPage } from './page-objects/login.po';
import { DashboardPage } from './page-objects/dashboard.po';
import { TaskListPage } from './page-objects/task-list.po';

describe('User Roles', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let taskListPage: TaskListPage;

  beforeEach(() => {
    loginPage = new LoginPage();
    dashboardPage = new DashboardPage();
    taskListPage = new TaskListPage();
  });

  it('should allow project manager to access all features', async () => {
    await loginPage.login('gerald_nika', '123456');
    expect(await dashboardPage.getInsightsLink()).toBeTruthy();
    expect(await taskListPage.getCreateTaskButton()).toBeTruthy();
  });

  it('should allow team lead to manage tasks but not access insights', async () => {
    await loginPage.login('andi_nika', '123456');
    expect(await dashboardPage.getInsightsLink()).toBeFalsy();
    expect(await taskListPage.getCreateTaskButton()).toBeTruthy();
  });

  it('should restrict developer from creating tasks', async () => {
    await loginPage.login('gerardo_tatzati', '123456');
    expect(await dashboardPage.getInsightsLink()).toBeFalsy();
    expect(await taskListPage.getCreateTaskButton()).toBeFalsy();
  });
});