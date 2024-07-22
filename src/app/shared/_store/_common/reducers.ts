import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { authenticationReducer } from '../authentication/authentication.reducer';

export const reducers: ActionReducerMap<AppState> = {
  authentication: authenticationReducer
};
