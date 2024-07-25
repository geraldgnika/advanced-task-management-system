import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthenticationState } from './authentication.state';

export const selectAuthenticationState = createFeatureSelector<AuthenticationState>('authentication');

// Select Current User
export const selectCurrentUser = createSelector(
  selectAuthenticationState,
  (state: AuthenticationState) => state.user
);
export const selectCurrentUserLoading = createSelector(
  selectAuthenticationState,
  (state: AuthenticationState) => state.loading
);
export const selectCurrentUserError = createSelector(
  selectAuthenticationState,
  (state: AuthenticationState) => state.error
);

// Select All Users
export const selectAllUsers = createSelector(
  selectAuthenticationState,
  (state: AuthenticationState) => state.users
);
export const selectUsersLoading = createSelector(
selectAuthenticationState,
(state: AuthenticationState) => state.loading
);
export const selectUsersError = createSelector(
selectAuthenticationState,
(state: AuthenticationState) => state.error
);