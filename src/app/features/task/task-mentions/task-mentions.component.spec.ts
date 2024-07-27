import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule, Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TaskMentionsComponent } from './task-mentions.component';
import { Task } from '../../../core/types/interfaces/task';
import { User } from '../../../core/types/interfaces/user';
import * as TaskActions from '../../../shared/_store/task/task.actions';
import { Location } from '@angular/common';
import { provideRouter, Router } from '@angular/router';
import { UserRoles } from '../../../core/types/enums/authentication/user-roles';
import { TaskStatus } from '../../../core/types/enums/task/task-status';
import { TaskPriority } from '../../../core/types/enums/task/task-priority';

describe('TaskMentionsComponent', () => {
  let component: TaskMentionsComponent;
  let fixture: ComponentFixture<TaskMentionsComponent>;
  let store: MockStore;
  let router: jasmine.SpyObj<Router>;
  let location: jasmine.SpyObj<Location>;

  const mockUser: User = {
    id: 'user1',
    username: 'testuser',
    full_name: 'Test User',
    role: UserRoles.ProjectManager,
    permissions: { canManageTasks: true, canViewInsights: true },
    password: '324244'
  };

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
      comments: [
        { id: 'comment1', body: 'Hello @testuser', username: 'testuser' }
      ],
      attachment: '',
      user_id: 'user1',
      username: 'testuser'
    },
    {
      id: 'task2',
      title: 'Task 2',
      description: 'Description 2',
      status: TaskStatus.Doing,
      priority: TaskPriority.Low,
      createdDate: new Date('2024-07-02'),
      updatedDate: new Date('2024-07-02'),
      dueDate: new Date('2024-07-20'),
      assignedTo: ['user1'],
      comments: [
        { id: 'comment2', body: 'No mention here', username: 'testuser' }
      ],
      attachment: '',
      user_id: 'user1',
      username: 'testuser'
    }
  ];

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const locationSpy = jasmine.createSpyObj('Location', ['back']);

    const initialState = { 
      authentication: { user: mockUser },
      tasks: { entities: mockTasks }
    };

    await TestBed.configureTestingModule({
      declarations: [ TaskMentionsComponent ],
      imports: [
        StoreModule.forRoot({})
      ],
      providers: [
        provideRouter([]),
        provideMockStore({ initialState }),
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy }
      ]
    }).compileComponents();

    store = TestBed.inject(Store) as MockStore;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    location = TestBed.inject(Location) as jasmine.SpyObj<Location>;

    fixture = TestBed.createComponent(TaskMentionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set user on init', () => {
    expect(component.user).toEqual(mockUser);
  });

  it('should navigate to task details', () => {
    component.openTask('task1');
    expect(router.navigate).toHaveBeenCalledWith(['task/open/', 'task1']);
  });

  it('should go back when goBack is called', () => {
    component.goBack();
    expect(location.back).toHaveBeenCalled();
  });

  it('should not add comments without mentions to mentionedComments', () => {
    expect(component.mentionedComments.some(comment => comment.commentBody === 'No mention here')).toBeFalsy();
  });
});