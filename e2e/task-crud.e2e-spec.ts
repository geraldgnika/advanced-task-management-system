import { LoginPage } from './page-objects/login.po';
import { TaskCreatePage } from './page-objects/task-create.po';
import { TaskListPage } from './page-objects/task-list.po';
import { TaskUpdatePage } from './page-objects/task-update.po';

describe('Task CRUD Operations', () => {
  let taskListPage: TaskListPage;
  let taskCreatePage: TaskCreatePage;
  let taskUpdatePage: TaskUpdatePage;
  let loginPage: LoginPage;

  beforeEach(async () => {
    taskListPage = new TaskListPage();
    taskCreatePage = new TaskCreatePage();
    taskUpdatePage = new TaskUpdatePage();
    loginPage = new LoginPage();
    await loginPage.navigateTo();
    await loginPage.login('gerald_nika', '123456');
  });

  it('should create a new task', async () => {
    await taskCreatePage.navigateTo();
    await taskCreatePage.createTask('New Test Task', 'This is a test task', 'High', 'To Do');
    expect(await taskListPage.getLastTaskTitle()).toEqual('New Test Task');
  });

  it('should update an existing task', async () => {
    await taskListPage.navigateTo();
    await taskListPage.clickFirstTask();
    await taskUpdatePage.updateTaskTitle('Updated Task Title');
    expect(await taskListPage.getFirstTaskTitle()).toEqual('Updated Task Title');
  });

  it('should delete a task', async () => {
    const initialCount = await taskListPage.getTaskCount();
    await taskListPage.deleteFirstTask();
    expect(await taskListPage.getTaskCount()).toBe(initialCount - 1);
  });
});