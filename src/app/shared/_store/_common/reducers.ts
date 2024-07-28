import { ActionReducerMap } from '@ngrx/store';
import { authenticationReducer } from '../authentication/authentication.reducer';
import { taskReducer } from '../task/task.reducer';
import { AppState } from './app.state';

export const reducers: ActionReducerMap<AppState> = {
  authentication: authenticationReducer,
  tasks: taskReducer,
};
