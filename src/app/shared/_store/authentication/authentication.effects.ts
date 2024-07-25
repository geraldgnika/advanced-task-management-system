import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as AuthenticationActions from './authentication.actions';
import { AuthenticationService } from '../../../core/_services/authentication.service';
import { Router } from '@angular/router';
import { LoginPayload } from '../../../core/types/payloads/authentication/login-payload.interface';
import { RegisterPayload } from '../../../core/types/payloads/authentication/register-payload.interface';
import { User } from '../../../core/types/interfaces/user';
import { AppState } from '../_common/app.state';
import { Store } from '@ngrx/store';

@Injectable()
export class AuthenticationEffects {

  // Login
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

  // Register
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

  // Logout
  logout$ = createEffect(() => this.actions$.pipe(
    ofType(AuthenticationActions.logout),
    switchMap(() =>
      this.authenticationService.logout().pipe(
        map(() => AuthenticationActions.logoutSuccess()),
        catchError(error => of(AuthenticationActions.logoutFailure({ error })))
      )
    )
  ));

  // Load Users
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthenticationActions.loadUsers),
      exhaustMap(() => {
        return this.authenticationService.getUsers().pipe(
          map((users) => {
            return AuthenticationActions.loadUsersSuccess({ users });
          }),
          catchError((error) => of(AuthenticationActions.loadUsersFailure({ error })))
        );
      })
    )
  );

  // Load User
  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthenticationActions.loadUser),
      exhaustMap((action) =>
        this.authenticationService.getUser(action.id).pipe(
          map((user) => AuthenticationActions.loadUserSuccess({ user })),
          catchError((error) => of(AuthenticationActions.loadUserFailure({ error })))
        )
      )
    )
  );

  // Load Current User
  loadCurrentUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthenticationActions.loadCurrentUser),
      exhaustMap(() =>
        this.authenticationService.getCurrentUserObservable().pipe(
          map((user: User | null) => {
            if (user) {
              return AuthenticationActions.loadCurrentUserSuccess({ user });
            } else {
              return AuthenticationActions.loadCurrentUserFailure({ error: 'User not found' });
            }
          }),
          catchError((error) => of(AuthenticationActions.loadCurrentUserFailure({ error })))
        )
      )
    )
  );

  // Navigation Dispatcher
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
    private router: Router,
    private store: Store<AppState>
  ) {}
}
