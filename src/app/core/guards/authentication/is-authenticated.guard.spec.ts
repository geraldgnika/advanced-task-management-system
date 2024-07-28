import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthenticationService } from '../../_services/authentication/authentication.service';
import { isAuthenticatedGuard } from './is-authenticated.guard';

describe('isAuthenticatedGuard', () => {
  let authServiceMock: jasmine.SpyObj<AuthenticationService>;
  let routerMock: jasmine.SpyObj<Router>;
  let routeSnapshot: ActivatedRouteSnapshot;
  let routerStateSnapshot: RouterStateSnapshot;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthenticationService', [
      'isLoggedIn',
    ]);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    routeSnapshot = {} as ActivatedRouteSnapshot;
    routerStateSnapshot = { url: '/test' } as RouterStateSnapshot;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthenticationService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  it('should allow access when user is logged in', () => {
    authServiceMock.isLoggedIn.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      isAuthenticatedGuard(routeSnapshot, routerStateSnapshot)
    );

    expect(result).toBe(true);
    expect(authServiceMock.isLoggedIn).toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to login page when user is not logged in', () => {
    authServiceMock.isLoggedIn.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() =>
      isAuthenticatedGuard(routeSnapshot, routerStateSnapshot)
    );

    expect(result).toBe(false);
    expect(authServiceMock.isLoggedIn).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/authentication/login']);
  });
});
