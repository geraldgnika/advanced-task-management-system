import { createAction, props } from '@ngrx/store';
import { User } from '../../../core/types/interfaces/user';
import { RegisterPayload } from '../../../core/types/payloads/authentication/register-payload.interface';
import { LoginPayload } from '../../../core/types/payloads/authentication/login-payload.interface';

export const register = createAction('[Authentication] Register', props<RegisterPayload>());
export const registerSuccess = createAction('[Authentication] Register Success', props<{ user: User | null }>());
export const registerFailure = createAction('[Authentication] Register Failure', props<{ error: any }>());

export const login = createAction('[Authentication] Login', props<LoginPayload>());
export const loginSuccess = createAction('[Authentication] Login Success', props<{ user: User | null }>());
export const loginFailure = createAction('[Authentication] Login Failure', props<{ error: any }>());

export const logout = createAction('[Authentication] Logout');
export const logoutSuccess = createAction('[Authentication] Logout Success');
export const logoutFailure = createAction('[Authentication] Logout Failure', props<{ error: any }>());

export const clearAuthenticationError = createAction(
    '[Authentication] Clear Authentication Error'
);