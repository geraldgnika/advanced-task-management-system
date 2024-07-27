import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { HeaderComponent } from './header.component';
import { AuthenticationService } from '../../../core/_services/authentication.service';
import { AppState } from '../../../shared/_store/_common/app.state';
import * as UserActions from '../../../shared/_store/authentication/authentication.actions';
import { User } from '../../../core/types/interfaces/user';
import { UserRoles } from '../../../core/types/enums/authentication/user-roles';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let routerMock: jasmine.SpyObj<Router>;
  let authServiceMock: jasmine.SpyObj<AuthenticationService>;
  let storeMock: jasmine.SpyObj<Store<AppState>>;

  beforeEach(async () => {
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    authServiceMock = jasmine.createSpyObj('AuthenticationService', ['getCurrentUserObservable']);
    storeMock = jasmine.createSpyObj('Store', ['dispatch']);

    await TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: AuthenticationService, useValue: authServiceMock },
        { provide: Store, useValue: storeMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    authServiceMock.getCurrentUserObservable.and.returnValue(of(null));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize currentUser$ in ngOnInit', () => {
    const mockUser: User = {
      id: '1', full_name: 'Test User',
      username: 'test_user',
      password: '3546767',
      role: UserRoles.ProjectManager,
      permissions: {
        canManageTasks: true,
        canViewInsights: true
      }
    };
    authServiceMock.getCurrentUserObservable.and.returnValue(of(mockUser));
    component.ngOnInit();
    component.currentUser$.subscribe(user => {
      expect(user).toEqual(mockUser);
    });
  });

  it('should dispatch logout action', () => {
    component.logout();
    expect(storeMock.dispatch).toHaveBeenCalledWith(UserActions.logout());
  });

  it('should navigate to home', () => {
    component.navigateToHome();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should navigate to login', () => {
    component.navigateToLogin();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/authentication/login']);
  });

  it('should navigate to register', () => {
    component.navigateToRegister();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/authentication/register']);
  });

  it('should return correct initials for full name', () => {
    expect(component.getInitials('John Doe')).toBe('JD');
    expect(component.getInitials('Alice')).toBe('A');
    expect(component.getInitials('')).toBe('');
    expect(component.getInitials(undefined)).toBe('');
  });

  it('should navigate to create task', () => {
    component.goToCreate();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/task/create']);
  });

  it('should navigate to mentions', () => {
    component.goToMentions();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/task/mentions']);
  });

  it('should navigate to tasks list', () => {
    component.goToTasks();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/task/list']);
  });

  it('should navigate to dashboard', () => {
    component.goToDashboard();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/landing/dashboard']);
  });

  it('should navigate to insights', () => {
    component.goToInsights();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/landing/insights']);
  });
});