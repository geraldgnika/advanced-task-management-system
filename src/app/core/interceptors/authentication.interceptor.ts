import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthenticationService } from '../_services/authentication/authentication.service';

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
  const authenticationService = inject(AuthenticationService);

  const token = authenticationService.getCurrentUserObservable();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  const modifiedReq = req.clone({
    headers: req.headers.delete('Authorization'),
  });

  return next(modifiedReq);
};
