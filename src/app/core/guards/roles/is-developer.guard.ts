import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../../_services/authentication/authentication.service';

export const isDeveloperGuard: CanActivateFn = (route, state) => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);
  const isDeveloper = authenticationService.isDeveloper();

  if (isDeveloper) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};
