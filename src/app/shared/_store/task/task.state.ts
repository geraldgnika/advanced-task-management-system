import { Task } from "../../../core/types/interfaces/task";

export interface TaskState {
  tasks: Task[];
  task: Task | null;
  loading: boolean;
  error: any;
}
