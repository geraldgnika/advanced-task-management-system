import { TaskListPage } from './page-objects/task-list.po';
import { TaskDetailsPage } from './page-objects/task-details.po';
import { LoginPage } from './page-objects/login.po';

describe('Task Details', () => {
  let taskListPage: TaskListPage;
  let taskDetailsPage: TaskDetailsPage;
  let loginPage: LoginPage;

  beforeEach(async () => {
    taskListPage = new TaskListPage();
    taskDetailsPage = new TaskDetailsPage();
    loginPage = new LoginPage();
    await loginPage.navigateTo();
    await loginPage.login('gerald_nika', '123456');
    await taskListPage.navigateTo();
    await taskListPage.clickFirstTask();
  });

  it('should display task details', async () => {
    expect(await taskDetailsPage.getTaskTitle()).toBeTruthy();
    expect(await taskDetailsPage.getTaskDescription()).toBeTruthy();
  });

  it('should add a comment', async () => {
    const initialCommentCount = await taskDetailsPage.getCommentCount();
    await taskDetailsPage.addComment('This is a test comment');
    expect(await taskDetailsPage.getCommentCount()).toBe(initialCommentCount + 1);
  });

  it('should mention a user in a comment', async () => {
    await taskDetailsPage.addComment('@gerald_nika This is a mention');
    expect(await taskDetailsPage.getLastCommentText()).toContain('@gerald_nika');
  });
});