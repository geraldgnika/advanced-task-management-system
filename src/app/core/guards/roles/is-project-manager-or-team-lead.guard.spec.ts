import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../../_services/authentication/authentication.service';
import { isProjectManagerOrTeamLeadGuard } from './is-project-manager-or-team-lead.guard';

describe('isProjectManagerOrTeamLeadGuard', () => {
  let authServiceMock: jasmine.SpyObj<AuthenticationService>;
  let routerMock: jasmine.SpyObj<Router>;
  let routeSnapshot: ActivatedRouteSnapshot;
  let routerStateSnapshot: RouterStateSnapshot;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthenticationService', ['isProjectManager', 'isTeamLead']);
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

  it('should allow access when user is a project manager', () => {
    authServiceMock.isProjectManager.and.returnValue(true);
    authServiceMock.isTeamLead.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() => 
      isProjectManagerOrTeamLeadGuard(routeSnapshot, routerStateSnapshot)
    );

    expect(result).toBe(true);
    expect(authServiceMock.isProjectManager).toHaveBeenCalled();
    expect(authServiceMock.isTeamLead).toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should allow access when user is a team lead', () => {
    authServiceMock.isProjectManager.and.returnValue(false);
    authServiceMock.isTeamLead.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() => 
      isProjectManagerOrTeamLeadGuard(routeSnapshot, routerStateSnapshot)
    );

    expect(result).toBe(true);
    expect(authServiceMock.isProjectManager).toHaveBeenCalled();
    expect(authServiceMock.isTeamLead).toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should allow access when user is both a project manager and a team lead', () => {
    authServiceMock.isProjectManager.and.returnValue(true);
    authServiceMock.isTeamLead.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() => 
      isProjectManagerOrTeamLeadGuard(routeSnapshot, routerStateSnapshot)
    );

    expect(result).toBe(true);
    expect(authServiceMock.isProjectManager).toHaveBeenCalled();
    expect(authServiceMock.isTeamLead).toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to home page and return false when user is neither a project manager nor a team lead', () => {
    authServiceMock.isProjectManager.and.returnValue(false);
    authServiceMock.isTeamLead.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() => 
      isProjectManagerOrTeamLeadGuard(routeSnapshot, routerStateSnapshot)
    );

    expect(result).toBe(false);
    expect(authServiceMock.isProjectManager).toHaveBeenCalled();
    expect(authServiceMock.isTeamLead).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });
});