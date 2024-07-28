import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { TaskPriority } from '../../../../core/types/enums/task/task-priority';
import { TaskStatus } from '../../../../core/types/enums/task/task-status';
import { Task } from '../../../../core/types/interfaces/task';
import * as TaskActions from '../../../../shared/_store/task/task.actions';
import { FormatUsernamePipe } from '../../../../shared/pipes/format-username.pipe';
import { TaskListComponent } from './task-list.component';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let store: jasmine.SpyObj<Store>;

  const mockTasks: Task[] = [
    {
      id: 'task1',
      title: 'Task 1',
      description: 'Description 1',
      status: TaskStatus.Pending,
      priority: TaskPriority.Low,
      createdDate: new Date('2024-07-01'),
      updatedDate: new Date('2024-07-01'),
      dueDate: new Date('2024-07-15'),
      assignedTo: ['user1'],
      comments: [],
      attachment: '',
      user_id: 'user1',
      username: 'User 1',
    },
    {
      id: 'task2',
      title: 'Task 2',
      description: 'Description 2',
      status: TaskStatus.Doing,
      priority: TaskPriority.Medium,
      createdDate: new Date('2024-07-02'),
      updatedDate: new Date('2024-07-02'),
      dueDate: new Date('2024-07-20'),
      assignedTo: ['user2'],
      comments: [],
      attachment: '',
      user_id: 'user2',
      username: 'User 2',
    },
  ];

  beforeEach(async () => {
    const storeSpy = jasmine.createSpyObj('Store', ['dispatch', 'select']);

    await TestBed.configureTestingModule({
      declarations: [TaskListComponent, FormatUsernamePipe],
      imports: [StoreModule.forRoot({}), FormsModule],
      providers: [provideRouter([]), { provide: Store, useValue: storeSpy }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    store.select.and.returnValue(of(mockTasks));

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default view mode', () => {
    expect(component.viewMode).toBe('task-component');
  });

  it('should load tasks on init', () => {
    spyOn(component, 'getAllTasks');
    component.ngOnInit();
    expect(component.getAllTasks).toHaveBeenCalled();
  });

  it('should dispatch loadTasks action', () => {
    component.getAllTasks();
    expect(store.dispatch).toHaveBeenCalledWith(TaskActions.loadTasks());
  });

  it('should filter tasks by search term', (done) => {
    component.searchTerm = 'Task 1';
    component.searchTasks();
    component.tasks$.subscribe((tasks) => {
      expect(tasks.length).toBe(1);
      expect(tasks[0].title).toBe('Task 1');
      done();
    });
  });

  it('should sort tasks', (done) => {
    component.sortTasks('title', true);
    component.tasks$.subscribe((tasks) => {
      expect(tasks[0].title).toBe('Task 1');
      expect(tasks[1].title).toBe('Task 2');
      done();
    });
  });

  it('should filter tasks by priority', (done) => {
    component.showLow();
    component.tasks$.subscribe((tasks) => {
      expect(tasks.length).toBe(1);
      expect(tasks[0].priority).toBe(TaskPriority.Low);
      done();
    });
  });

  it('should filter tasks by status', (done) => {
    component.showPending();
    component.tasks$.subscribe((tasks) => {
      expect(tasks.length).toBe(1);
      expect(tasks[0].status).toBe(TaskStatus.Pending);
      done();
    });
  });

  it('should show all tasks', (done) => {
    component.showAll();
    component.tasks$.subscribe((tasks) => {
      expect(tasks.length).toBe(2);
      done();
    });
  });

  it('should navigate to task details', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.openTask('task1');
    expect(routerSpy).toHaveBeenCalledWith(['/task/open', 'task1']);
  });

  it('should navigate to task update', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.goToTaskUpdate('task1');
    expect(routerSpy).toHaveBeenCalledWith(['/task/update', 'task1']);
  });
});
