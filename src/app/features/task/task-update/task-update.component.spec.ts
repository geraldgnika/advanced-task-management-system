import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { Location } from '@angular/common';
import { StoreModule, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { TaskUpdateComponent } from './task-update.component';
import { Task } from '../../../core/types/interfaces/task';
import { User } from '../../../core/types/interfaces/user';
import { AppState } from '../../../shared/_store/_common/app.state';
import * as TaskActions from '../../../shared/_store/task/task.actions';
import * as AuthenticationActions from '../../../shared/_store/authentication/authentication.actions';
import { TaskStatus } from '../../../core/types/enums/task/task-status';
import { TaskPriority } from '../../../core/types/enums/task/task-priority';
import { UserRoles } from '../../../core/types/enums/authentication/user-roles';

describe('TaskUpdateComponent', () => {
  let component: TaskUpdateComponent;
  let fixture: ComponentFixture<TaskUpdateComponent>;
  let store: jasmine.SpyObj<Store<AppState>>;
  let router: jasmine.SpyObj<Router>;
  let location: jasmine.SpyObj<Location>;

  const mockTask: Task = {
    id: 'task1',
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.Pending,
    priority: TaskPriority.Medium,
    createdDate: new Date('2024-07-01'),
    updatedDate: new Date('2024-07-01'),
    dueDate: new Date('2024-07-15'),
    assignedTo: ['user1'],
    comments: [],
    attachment: '',
    user_id: 'user1',
    username: 'User 1'
  };

  const mockUser: User = {
    id: 'user1',
    username: 'testuser',
    full_name: 'Test User',
    role: UserRoles.Developer,
    permissions: { canManageTasks: true, canViewInsights: false },
    password: '3444556'
  };

  beforeEach(async () => {
    const storeSpy = jasmine.createSpyObj('Store', ['dispatch', 'select', 'pipe']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const locationSpy = jasmine.createSpyObj('Location', ['back']);

    await TestBed.configureTestingModule({
      declarations: [ TaskUpdateComponent ],
      imports: [ 
        ReactiveFormsModule,
        StoreModule.forRoot({})
      ],
      providers: [
        FormBuilder,
        provideRouter([]),
        { provide: Store, useValue: storeSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: 'task1' } } } }
      ]
    }).compileComponents();

    store = TestBed.inject(Store) as jasmine.SpyObj<Store<AppState>>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    location = TestBed.inject(Location) as jasmine.SpyObj<Location>;

    store.select.and.returnValues(of(mockUser), of([mockUser]));
    store.pipe.and.returnValue(of([mockTask]));

    fixture = TestBed.createComponent(TaskUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadCurrentUser action on construction', () => {
    expect(store.dispatch).toHaveBeenCalledWith(AuthenticationActions.loadCurrentUser());
  });

  it('should initialize form with task values', () => {
    expect(component.taskForm.value).toEqual(jasmine.objectContaining({
      id: 'task1',
      title: 'Test Task',
      description: 'Test Description',
      status: TaskStatus.Pending,
      priority: TaskPriority.Medium
    }));
  });

  it('should load users on init', () => {
    expect(store.dispatch).toHaveBeenCalledWith(AuthenticationActions.loadUsers());
  });

function taskMatcher(expectedTask: Partial<Task>): any {
  return {
    asymmetricMatch: function(actual: Task) {
      return Object.keys(expectedTask).every(key => 
        (expectedTask as any)[key] === (actual as any)[key]
      );
    },
    jasmineToString: function() {
      return `TaskMatcher(${JSON.stringify(expectedTask)})`;
    }
  };
}

  it('should go back', () => {
    component.goBack();
    expect(location.back).toHaveBeenCalled();
  });

  it('should toggle assigned user', () => {
    component.toggleAssignedTo('user2');
    expect(component.taskForm.get('assignedTo')?.value).toContain('user2');
    component.toggleAssignedTo('user2');
    expect(component.taskForm.get('assignedTo')?.value).not.toContain('user2');
  });

  it('should check if user is assigned', () => {
    expect(component.isAssigned('user1')).toBeTruthy();
    expect(component.isAssigned('user2')).toBeFalsy();
  });
});