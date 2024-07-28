import { AuthenticationState } from '../authentication/authentication.state';
import { TaskState } from '../task/task.state';

export interface AppState {
  tasks: TaskState;
  authentication: AuthenticationState;
}
