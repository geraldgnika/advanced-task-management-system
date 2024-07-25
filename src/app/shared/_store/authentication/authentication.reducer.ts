import { createReducer, on } from '@ngrx/store';
import { initialAuthenticationState } from './authentication.state';
import * as AuthenticationActions from './authentication.actions';
import { RegisterPayload } from '../../../core/types/payloads/authentication/register-payload.interface';
import { LoginPayload } from '../../../core/types/payloads/authentication/login-payload.interface';

export const authenticationReducer = createReducer(
  initialAuthenticationState,

  // Register
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

  // Login
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

  // Logout
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

  // Clear Authentication Error
  on(AuthenticationActions.clearAuthenticationError, (state) => ({
    ...state,
    error: null
  })),
  on(AuthenticationActions.clearAuthenticationErrorSuccess, (state) => ({
    ...state,
    error: null
  })),
  on(AuthenticationActions.clearAuthenticationErrorFailure, (state, { error }) => ({
    ...state,
    error
  })),

  // Load Users
  on(AuthenticationActions.loadUsers, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthenticationActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    loading: false,
    error: null
  })),
  on(AuthenticationActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load User
  on(AuthenticationActions.loadUser, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthenticationActions.loadUserSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null
  })),
  on(AuthenticationActions.loadUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load Current User
  on(AuthenticationActions.loadCurrentUser, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthenticationActions.loadCurrentUserSuccess, (state, { user }) => ({
    ...state,
    user: user,
    loading: false,
    error: null
  })),
  on(AuthenticationActions.loadCurrentUserFailure, (state, { error }) => ({
    ...state,
    user: null,
    loading: false,
    error
  }))
);
