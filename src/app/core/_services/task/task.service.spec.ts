import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Task } from '../../types/interfaces/task';
import { AuthenticationService } from '../authentication/authentication.service';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthenticationService', [
      'getUserById',
    ]);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        TaskService,
        { provide: AuthenticationService, useValue: authSpy },
      ],
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(
      AuthenticationService
    ) as jasmine.SpyObj<AuthenticationService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get tasks by status', (done) => {
    const mockTasks: Task[] = [
      { id: '1', title: 'Task 1', status: 'pending', user_id: 'user1' },
      { id: '2', title: 'Task 2', status: 'completed', user_id: 'user2' },
    ] as Task[];

    authServiceSpy.getUserById.and.returnValue(
      of({ user_id: 'user1', username: 'User One' })
    );

    service.getTasksByStatus('pending').subscribe((tasks) => {
      expect(tasks.length).toBe(1);
      expect(tasks[0].status).toBe('pending');
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  });

  it('should update task status', (done) => {
    const taskId = '1';
    const newStatus = 'completed';
    const updatedTask: Task = {
      id: taskId,
      title: 'Task 1',
      status: newStatus,
      user_id: 'user1',
    } as Task;

    service.updateTaskStatus(taskId, newStatus).subscribe((task) => {
      expect(task.status).toBe(newStatus);
      done();
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/tasks/${taskId}/status`
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ status: newStatus });
    req.flush(updatedTask);
  });

  it('should generate a unique task ID', (done) => {
    const mockTasks: Task[] = [
      { id: 'abc123', title: 'Task 1', status: 'pending', user_id: 'user1' },
    ] as Task[];

    service.generateUniqueId().subscribe((id) => {
      expect(id).toBeTruthy();
      expect(id.length).toBe(7);
      expect(id).not.toBe('abc123');
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  });

  it('should generate a unique comment ID', (done) => {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Task 1',
        status: 'pending',
        user_id: 'user1',
        comments: [{ id: 'com123', body: 'Comment 1' }],
      },
    ] as Task[];

    service.generateUniqueCommentId().subscribe((id) => {
      expect(id).toBeTruthy();
      expect(id.length).toBe(7);
      expect(id).not.toBe('com123');
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  });

  it('should get all tasks with usernames', (done) => {
    const mockTasks: Task[] = [
      { id: '1', title: 'Task 1', status: 'pending', user_id: 'user1' },
      { id: '2', title: 'Task 2', status: 'completed', user_id: 'user2' },
    ] as Task[];

    authServiceSpy.getUserById.and.callFake((userId: string) => {
      const users: any = {
        user1: { id: 'user1', username: 'User One' },
        user2: { id: 'user2', username: 'User Two' },
      };
      return of(users[userId]);
    });

    service.getTasks().subscribe((tasks) => {
      expect(tasks.length).toBe(2);
      expect(tasks[0].username).toBe('User One');
      expect(tasks[1].username).toBe('User Two');
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  });

  it('should get a task by ID', (done) => {
    const taskId = '1';
    const mockTask: Task = {
      id: taskId,
      title: 'Task 1',
      status: 'pending',
      user_id: 'user1',
    } as Task;

    authServiceSpy.getUserById.and.returnValue(
      of({ user_id: 'user1', username: 'User One' })
    );

    service.getTaskById(taskId).subscribe((task) => {
      expect(task.id).toBe(taskId);
      expect(task.username).toBe('User One');
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks/${taskId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTask);
  });

  it('should add a new task', (done) => {
    const newTask: Task = {
      id: '1',
      title: 'New Task',
      status: 'pending',
      user_id: 'user1',
    } as Task;

    service.addTask(newTask).subscribe((task) => {
      expect(task).toEqual(newTask);
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTask);
    req.flush(newTask);
  });

  it('should update a task', (done) => {
    const updatedTask: Task = {
      id: '1',
      title: 'Updated Task',
      status: 'completed',
      user_id: 'user1',
    } as Task;

    service.updateTask(updatedTask).subscribe((task) => {
      expect(task).toEqual(updatedTask);
      done();
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/tasks/${updatedTask.id}`
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedTask);
    req.flush(updatedTask);
  });

  it('should delete a task', (done) => {
    const taskId = '1';

    service.deleteTask(taskId).subscribe(() => {
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks/${taskId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should delete an attachment', (done) => {
    const task: Task = {
      id: '1',
      title: 'Task',
      attachment: 'file.pdf',
      user_id: 'user1',
    } as Task;
    const updatedTask: Task = { ...task, attachment: '' };

    service.deleteAttachment(task).subscribe((result) => {
      expect(result.attachment).toBe('');
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks/${task.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedTask);
    req.flush(updatedTask);
  });

  it('should update an attachment', (done) => {
    const task: Task = {
      id: '1',
      title: 'Task',
      attachment: '',
      user_id: 'user1',
    } as Task;
    const filename = 'new-file.pdf';
    const updatedTask: Task = { ...task, attachment: filename };

    service.updateAttachment(task, filename).subscribe((result) => {
      expect(result.attachment).toBe(filename);
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks/${task.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedTask);
    req.flush(updatedTask);
  });
});
