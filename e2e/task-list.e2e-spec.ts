import { TaskListPage } from './page-objects/task-list.po';
import { LoginPage } from './page-objects/login.po';

describe('Task List', () => {
  let taskListPage: TaskListPage;
  let loginPage: LoginPage;

  beforeEach(async () => {
    taskListPage = new TaskListPage();
    loginPage = new LoginPage();
    await loginPage.navigateTo();
    await loginPage.login('gerald_nika', '123456');
    await taskListPage.navigateTo();
  });

  it('should display task list', async () => {
    expect(await taskListPage.getTaskCount()).toBeGreaterThan(0);
  });

  it('should switch between view modes', async () => {
    await taskListPage.switchToGridView();
    expect(await taskListPage.isGridViewActive()).toBeTruthy();

    await taskListPage.switchToBoardView();
    expect(await taskListPage.isBoardViewActive()).toBeTruthy();

    await taskListPage.switchToCalendarView();
    expect(await taskListPage.isCalendarViewActive()).toBeTruthy();
  });

  it('should filter tasks', async () => {
    const initialCount = await taskListPage.getTaskCount();
    await taskListPage.filterByStatus('In Progress');
    expect(await taskListPage.getTaskCount()).toBeLessThan(initialCount);
  });
});