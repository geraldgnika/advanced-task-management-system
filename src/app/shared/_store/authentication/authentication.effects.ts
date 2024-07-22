import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as AuthenticationActions from './authentication.actions';
import { AuthenticationService } from '../../../core/_services/authentication.service';
import { Router } from '@angular/router';
import { LoginPayload } from '../../../core/types/payloads/authentication/login-payload.interface';
import { RegisterPayload } from '../../../core/types/payloads/authentication/register-payload.interface';

@Injectable()
export class AuthenticationEffects {

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthenticationActions.login),
      switchMap((payload: LoginPayload) =>
        this.authenticationService.login(payload).pipe(
          map(user => {
            if (user) {
              return AuthenticationActions.loginSuccess({ user });
            } else {
              return AuthenticationActions.loginFailure({ error: 'Invalid credentials' });
            }
          }),
          catchError(error => of(AuthenticationActions.loginFailure({ error: 'Login failed' })))
        )
      )
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthenticationActions.register),
      switchMap((payload: RegisterPayload) =>
        this.authenticationService.checkIfExistsAlready(payload.username).pipe(
          switchMap(userExists => {
            if (userExists) {
              return of(AuthenticationActions.registerFailure({ error: 'User already exists' }));
            } else {
              return this.authenticationService.register(payload).pipe(
                map((user) => AuthenticationActions.registerSuccess({ user })),
                catchError(error => of(AuthenticationActions.registerFailure({ error: 'Registration failed' })))
              );
            }
          }),
          catchError(error => of(AuthenticationActions.registerFailure({ error: 'Check user existence failed' })))
        )
      )
    )
  );

  logout$ = createEffect(() => this.actions$.pipe(
    ofType(AuthenticationActions.logout),
    switchMap(() =>
      this.authenticationService.logout().pipe(
        map(() => AuthenticationActions.logoutSuccess()),
        catchError(error => of(AuthenticationActions.logoutFailure({ error })))
      )
    )
  ));

  navigateTo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        AuthenticationActions.registerSuccess,
        AuthenticationActions.loginSuccess,
        AuthenticationActions.logoutSuccess
      ),
      tap(() => {
        this.router.navigate(['/']);
      })
    ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}
}
