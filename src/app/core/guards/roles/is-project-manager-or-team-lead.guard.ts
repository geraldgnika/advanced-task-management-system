import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../../_services/authentication/authentication.service';

export const isProjectManagerOrTeamLeadGuard: CanActivateFn = (
  route,
  state
) => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);
  const isProjectManager = authenticationService.isProjectManager();
  const isTeamLead = authenticationService.isTeamLead();

  if (isTeamLead || isProjectManager) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};
