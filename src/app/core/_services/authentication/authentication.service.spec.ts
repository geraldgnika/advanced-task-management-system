import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { UserPermissions } from '../../types/enums/authentication/user-permissions';
import { UserRoles } from '../../types/enums/authentication/user-roles';
import { User } from '../../types/interfaces/user';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthenticationService,
      ],
    });
    service = TestBed.inject(AuthenticationService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate a unique ID', (done) => {
    const mockUsers: User[] = [
      {
        id: '_abc123',
        username: 'test',
        full_name: 'Test User',
        password: 'password',
        role: UserRoles.Developer,
        permissions: { canManageTasks: true, canViewInsights: false },
      },
    ];

    service.generateUniqueId().subscribe((id) => {
      expect(id).toBeTruthy();
      expect(id.startsWith('_')).toBeTrue();
      expect(id.length).toBe(8);
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should check if a user exists', (done) => {
    const username = 'testuser';
    const mockUsers: User[] = [
      {
        id: '_abc123',
        username,
        full_name: 'Test User',
        password: 'password',
        role: UserRoles.Developer,
        permissions: { canManageTasks: true, canViewInsights: false },
      },
    ];

    service.checkIfExistsAlready(username).subscribe((exists) => {
      expect(exists).toBeTrue();
      done();
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/users?username=${username}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should register a new user', (done) => {
    const newUser = {
      id: '_def456',
      full_name: 'New User',
      username: 'newuser',
      password: 'password123',
      role: UserRoles.Developer,
    };

    service.register(newUser).subscribe((user) => {
      expect(user).toBeTruthy();
      expect(user.id).toBe(newUser.id);
      expect(user.username).toBe(newUser.username);
      done();
    });

    const checkReq = httpMock.expectOne(
      `${environment.apiUrl}/users?username=${newUser.username}`
    );
    expect(checkReq.request.method).toBe('GET');
    checkReq.flush([]);

    const registerReq = httpMock.expectOne(`${environment.apiUrl}/users`);
    expect(registerReq.request.method).toBe('POST');
    registerReq.flush(newUser);
  });

  it('should login a user', (done) => {
    const loginPayload = { username: 'testuser', password: 'password123' };
    const mockUser: User = {
      id: '_ghi789',
      username: 'testuser',
      full_name: 'Test User',
      password: 'password123',
      role: UserRoles.Developer,
      permissions: {
        [UserPermissions.CanManageTasks]: true,
        [UserPermissions.CanViewInsights]: false,
      },
    };

    service.login(loginPayload).subscribe((user) => {
      expect(user).toBeTruthy();
      expect(user?.username).toBe(loginPayload.username);
      done();
    });

    const credentialsReq = httpMock.expectOne(
      `${environment.apiUrl}/users?username=${loginPayload.username}`
    );
    expect(credentialsReq.request.method).toBe('GET');
    credentialsReq.flush([mockUser]);

    const loginReq = httpMock.expectOne(
      `${environment.apiUrl}/users?username=${loginPayload.username}`
    );
    expect(loginReq.request.method).toBe('GET');
    loginReq.flush([mockUser]);
  });

  it('should logout a user', (done) => {
    spyOn(localStorage, 'removeItem').and.callThrough();
    const mockUser: User = {
      id: '_test123',
      username: 'testuser',
      full_name: 'Test User',
      password: 'password',
      role: UserRoles.Developer,
      permissions: {
        [UserPermissions.CanManageTasks]: true,
        [UserPermissions.CanViewInsights]: false,
      },
    };

    service['currentUserSubject'].next(mockUser);
    localStorage.setItem('currentUser', JSON.stringify(mockUser));

    expect(service.isLoggedIn()).toBeTrue();

    service.logout().subscribe(() => {
      expect(localStorage.removeItem).toHaveBeenCalledWith('currentUser');

      service.getCurrentUserObservable().subscribe((currentUser) => {
        expect(currentUser).toBeNull();

        expect(service.isLoggedIn()).toBeFalse();

        done();
      });
    });
  });

  it('should check user roles', () => {
    const mockUser: User = {
      id: '_jkl012',
      username: 'manager',
      full_name: 'Manager User',
      password: 'password',
      role: UserRoles.ProjectManager,
      permissions: {
        [UserPermissions.CanManageTasks]: true,
        [UserPermissions.CanViewInsights]: true,
      },
    };

    (service as any).currentUserSubject.next(mockUser);

    expect(service.isProjectManager()).toBeTrue();
    expect(service.isTeamLead()).toBeFalse();
    expect(service.isDeveloper()).toBeFalse();
  });

  it('should check user permissions', () => {
    const mockUser: User = {
      id: '_mno345',
      username: 'developer',
      full_name: 'Developer User',
      password: 'password',
      role: UserRoles.Developer,
      permissions: {
        [UserPermissions.CanManageTasks]: true,
        [UserPermissions.CanViewInsights]: false,
      },
    };

    (service as any).currentUserSubject.next(mockUser);

    expect(service.hasPermission(UserPermissions.CanManageTasks)).toBeTrue();
    expect(service.hasPermission(UserPermissions.CanViewInsights)).toBeFalse();
  });

  it('should get user by ID', (done) => {
    const userId = '_pqr678';
    const mockUser = { user_id: userId, username: 'testuser' };

    service.getUserById(userId).subscribe((user) => {
      expect(user).toBeTruthy();
      expect(user.user_id).toBe(userId);
      expect(user.username).toBe('testuser');
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });
});
