import { Task } from "../../../core/types/interfaces/task";

export interface TaskState {
  pendingTasks: Task[];
  doingTasks: Task[];
  reviewingTasks: Task[];
  completedTasks: Task[];
  tasks: Task[];
  task: Task | null;
  loading: boolean;
  error: any;
}

export const initialTaskState: TaskState = {
  pendingTasks: [],
  doingTasks: [],
  reviewingTasks: [],
  completedTasks: [],
  tasks: [],
  task: null,
  loading: false,
  error: null
};