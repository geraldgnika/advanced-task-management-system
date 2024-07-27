import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { TaskCreateComponent } from './task-create.component';
import { TaskService } from '../../../core/_services/task.service';
import { AppState } from '../../../shared/_store/_common/app.state';
import { User } from '../../../core/types/interfaces/user';
import { TaskStatus } from '../../../core/types/enums/task/task-status';
import { TaskPriority } from '../../../core/types/enums/task/task-priority';
import { UserRoles } from '../../../core/types/enums/authentication/user-roles';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TaskCreateComponent', () => {
  let component: TaskCreateComponent;
  let fixture: ComponentFixture<TaskCreateComponent>;
  let mockStore: jasmine.SpyObj<Store<AppState>>;
  let mockTaskService: jasmine.SpyObj<TaskService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockUser: User = {
    "id": "_sdf54gg",
    "full_name": "John Doe",
    "username": "john_doe",
    "password": "23454355456",
    "role": UserRoles.ProjectManager,
    "permissions": {
      "canManageTasks": true,
      "canViewInsights": true
    }
  };

  beforeEach(async () => {
    mockStore = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    mockTaskService = jasmine.createSpyObj('TaskService', ['generateUniqueId', 'generateUniqueCommentId']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ TaskCreateComponent ],
      imports: [
        ReactiveFormsModule,
        StoreModule.forRoot({})
      ],
      providers: [
        FormBuilder,
        { provide: Store, useValue: mockStore },
        { provide: TaskService, useValue: mockTaskService },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    mockStore.select.and.returnValues(
      of(mockUser),
      of([mockUser])
    );
    mockTaskService.generateUniqueId.and.returnValue(of('task-123'));
    mockTaskService.generateUniqueCommentId.and.returnValue(of('comment-123'));

    fixture = TestBed.createComponent(TaskCreateComponent);
    component = fixture.componentInstance;
    component.allUsers$ = of([mockUser]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.taskForm.get('title')).toBeTruthy();
    expect(component.taskForm.get('description')).toBeTruthy();
    expect(component.taskForm.get('status')?.value).toBe(TaskStatus.Pending);
    expect(component.taskForm.get('priority')?.value).toBe(TaskPriority.Low);
  });

  it('should load current user on init', () => {
    expect(mockStore.dispatch).toHaveBeenCalledWith(jasmine.any(Object));
    expect(component.taskForm.get('user_id')?.value).toBe(mockUser.id);
    expect(component.taskForm.get('username')?.value).toBe(mockUser.username);
  });

  it('should populate task priorities and statuses', () => {
    expect(Array.isArray(component.taskPriorities)).toBe(true);
    expect(component.taskPriorities.length).toBeGreaterThan(0);
    expect(Array.isArray(component.taskStatuses)).toBe(true);
    expect(component.taskStatuses.length).toBeGreaterThan(0);
  });

  it('should toggle assigned users', () => {
    component.toggleAssignedTo('user1');
    expect(component.taskForm.get('assignedTo')?.value).toContain('user1');

    component.toggleAssignedTo('user1');
    expect(component.taskForm.get('assignedTo')?.value).not.toContain('user1');
  });

  it('should handle file selection', () => {
    const mockFile = new File([''], 'test.txt', { type: 'text/plain' });
    const mockEvent = { target: { files: [mockFile] } } as unknown as Event;

    component.onFileSelected(mockEvent);
    expect(component.taskForm.get('attachment')?.value).toBe('test.txt');
  });

  it('should save task with comment if provided', () => {
    component.taskForm.patchValue({
      title: 'Test Task',
      description: 'Test Description',
      dueDate: '2023-07-01'
    });

    component.commentsTextarea = { nativeElement: { value: 'Test Comment' } } as any;

    component.saveTask();

    expect(mockTaskService.generateUniqueId).toHaveBeenCalled();
    expect(mockTaskService.generateUniqueCommentId).toHaveBeenCalled();
    expect(mockStore.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({
      task: jasmine.objectContaining({
        id: 'task-123',
        title: 'Test Task',
        description: 'Test Description',
        comments: [jasmine.objectContaining({
          id: 'comment-123',
          body: 'Test Comment',
          username: mockUser.username
        })]
      })
    }));
    expect(mockRouter.navigate).toHaveBeenCalledWith(['task/list']);
  });

  it('should save task without comment if not provided', () => {
    component.taskForm.patchValue({
      title: 'Test Task',
      description: 'Test Description',
      dueDate: '2023-07-01'
    });

    component.commentsTextarea = { nativeElement: { value: '' } } as any;

    component.saveTask();

    expect(mockTaskService.generateUniqueId).toHaveBeenCalled();
    expect(mockTaskService.generateUniqueCommentId).not.toHaveBeenCalled();
    expect(mockStore.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({
      task: jasmine.objectContaining({
        id: 'task-123',
        title: 'Test Task',
        description: 'Test Description',
        comments: []
      })
    }));
    expect(mockRouter.navigate).toHaveBeenCalledWith(['task/list']);
  });
});