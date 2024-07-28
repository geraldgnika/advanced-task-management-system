import { createAction, props } from '@ngrx/store';
import { User } from '../../../core/types/interfaces/user';
import { LoginPayload } from '../../../core/types/payloads/authentication/login-payload.interface';
import { RegisterPayload } from '../../../core/types/payloads/authentication/register-payload.interface';

// Register
export const register = createAction(
  '[Authentication] Register',
  props<RegisterPayload>()
);
export const registerSuccess = createAction(
  '[Authentication] Register Success',
  props<{ user: User | null }>()
);
export const registerFailure = createAction(
  '[Authentication] Register Failure',
  props<{ error: any }>()
);

// Login
export const login = createAction(
  '[Authentication] Login',
  props<LoginPayload>()
);
export const loginSuccess = createAction(
  '[Authentication] Login Success',
  props<{ user: User | null }>()
);
export const loginFailure = createAction(
  '[Authentication] Login Failure',
  props<{ error: any }>()
);

// Logout
export const logout = createAction('[Authentication] Logout');
export const logoutSuccess = createAction('[Authentication] Logout Success');
export const logoutFailure = createAction(
  '[Authentication] Logout Failure',
  props<{ error: any }>()
);

// Load Users
export const loadUsers = createAction('[Authentication] Load Users');
export const loadUsersSuccess = createAction(
  '[Authentication] Load Users Success',
  props<{ users: User[] }>()
);
export const loadUsersFailure = createAction(
  '[Authentication] Load Users Failure',
  props<{ error: any }>()
);

// Load User
export const loadUser = createAction(
  '[Authentication] Load User',
  props<{ id: string }>()
);
export const loadUserSuccess = createAction(
  '[Authentication] Load User Success',
  props<{ user: User }>()
);
export const loadUserFailure = createAction(
  '[Authentication] Load User Failure',
  props<{ error: any }>()
);

// Load Current User
export const loadCurrentUser = createAction(
  '[Authentication] Load Current User'
);
export const loadCurrentUserSuccess = createAction(
  '[Authentication] Load Current User Success',
  props<{ user: User }>()
);
export const loadCurrentUserFailure = createAction(
  '[Authentication] Load Current User Failure',
  props<{ error: any }>()
);

// Clear Authentication Error
export const clearAuthenticationError = createAction(
  '[Authentication] Clear Authentication Error'
);
export const clearAuthenticationErrorSuccess = createAction(
  '[Authentication] Clear Authentication Error'
);
export const clearAuthenticationErrorFailure = createAction(
  '[Authentication] Clear Authentication Error',
  props<{ error: any }>()
);
