import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../../_services/authentication.service';
import { inject } from '@angular/core';

export const isProjectManagerGuard: CanActivateFn = (route, state) => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);
  const isProjectManager = authenticationService.isProjectManager();

  if (isProjectManager) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};
