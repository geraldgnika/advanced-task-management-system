import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../../_services/authentication.service';
import { inject } from '@angular/core';

export const isTeamLeadGuard: CanActivateFn = (route, state) => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);
  const isTeamLead = authenticationService.isTeamLead();

  if (isTeamLead) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};
