import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../../_services/authentication/authentication.service';

export const isNotAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  if (!authenticationService.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};
