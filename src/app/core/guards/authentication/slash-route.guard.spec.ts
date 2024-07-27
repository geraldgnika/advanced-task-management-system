import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../../_services/authentication.service';
import { slashRoute } from './slash-route.guard';

describe('slashRoute', () => {
  let authServiceMock: jasmine.SpyObj<AuthenticationService>;
  let routerMock: jasmine.SpyObj<Router>;
  let routeSnapshot: ActivatedRouteSnapshot;
  let routerStateSnapshot: RouterStateSnapshot;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthenticationService', ['isLoggedIn']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    routeSnapshot = {} as ActivatedRouteSnapshot;
    routerStateSnapshot = { url: '/' } as RouterStateSnapshot;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthenticationService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });
  });

  it('should redirect to dashboard and return true when user is logged in', () => {
    authServiceMock.isLoggedIn.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() => 
      slashRoute(routeSnapshot, routerStateSnapshot)
    );

    expect(result).toBe(true);
    expect(authServiceMock.isLoggedIn).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/landing/dashboard']);
  });

  it('should redirect to login page and return false when user is not logged in', () => {
    authServiceMock.isLoggedIn.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() => 
      slashRoute(routeSnapshot, routerStateSnapshot)
    );

    expect(result).toBe(false);
    expect(authServiceMock.isLoggedIn).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/authentication/login']);
  });
});