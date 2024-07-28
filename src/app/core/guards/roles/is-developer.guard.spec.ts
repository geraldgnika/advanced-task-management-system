import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../../_services/authentication/authentication.service';
import { isDeveloperGuard } from './is-developer.guard';

describe('isDeveloperGuard', () => {
  let authServiceMock: jasmine.SpyObj<AuthenticationService>;
  let routerMock: jasmine.SpyObj<Router>;
  let routeSnapshot: ActivatedRouteSnapshot;
  let routerStateSnapshot: RouterStateSnapshot;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthenticationService', ['isDeveloper']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    routeSnapshot = {} as ActivatedRouteSnapshot;
    routerStateSnapshot = { url: '/test' } as RouterStateSnapshot;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthenticationService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });
  });

  it('should allow access when user is a developer', () => {
    authServiceMock.isDeveloper.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() => 
      isDeveloperGuard(routeSnapshot, routerStateSnapshot)
    );

    expect(result).toBe(true);
    expect(authServiceMock.isDeveloper).toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to home page and return false when user is not a developer', () => {
    authServiceMock.isDeveloper.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() => 
      isDeveloperGuard(routeSnapshot, routerStateSnapshot)
    );

    expect(result).toBe(false);
    expect(authServiceMock.isDeveloper).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });
});