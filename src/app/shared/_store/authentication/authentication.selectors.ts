import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthenticationState } from './authentication.state';

export const selectAuthenticationState = createFeatureSelector<AuthenticationState>('authentication');

export const selectCurrentAuthentication = createSelector(
  selectAuthenticationState,
  (state: AuthenticationState) => state.currentAuthentication
);

export const selectCurrentAuthenticationLoading = createSelector(
  selectAuthenticationState,
  (state: AuthenticationState) => state.currentAuthentication
);

export const selectCurrentAuthenticationError = createSelector(
  selectAuthenticationState,
  (state: AuthenticationState) => state.error
);
