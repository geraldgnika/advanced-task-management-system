import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../../_services/authentication/authentication.service';

export const slashRoute: CanActivateFn = (route, state) => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  if (authenticationService.isLoggedIn()) {
    router.navigate(['/landing/dashboard']);
    return true;
  } else {
    router.navigate(['/authentication/login']);
    return false;
  }
};
