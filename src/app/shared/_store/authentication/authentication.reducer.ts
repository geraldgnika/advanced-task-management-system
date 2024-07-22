import { createReducer, on } from '@ngrx/store';
import { initialAuthenticationState } from './authentication.state';
import * as AuthenticationActions from './authentication.actions';
import { RegisterPayload } from '../../../core/types/payloads/authentication/register-payload.interface';
import { LoginPayload } from '../../../core/types/payloads/authentication/login-payload.interface';

export const authenticationReducer = createReducer(
  initialAuthenticationState,

  on(AuthenticationActions.register, (state, { full_name, username, password, role }: RegisterPayload) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AuthenticationActions.registerSuccess, (state) => ({
    ...state,
    loading: false,
    error: null
  })),

  on(AuthenticationActions.registerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(AuthenticationActions.login, (state, { username, password }: LoginPayload) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AuthenticationActions.loginSuccess, (state, { user }) => ({
    ...state,
    currentUser: user,
    loading: false,
    error: null
  })),

  on(AuthenticationActions.loginFailure, (state, { error }) => ({
    ...state,
    currentUser: null,
    loading: false,
    error
  })),

  on(AuthenticationActions.logout, (state) => ({
    ...state,
    currentUser: null,
    error: null
  })),

  on(AuthenticationActions.logoutSuccess, (state) => ({
    ...state,
    currentUser: null,
    error: null
  })),

  on(AuthenticationActions.logoutFailure, (state, { error }) => ({
    ...state,
    error
  })),

  on(AuthenticationActions.clearAuthenticationError, (state) => ({
    ...state,
    error: null
  }))
);
