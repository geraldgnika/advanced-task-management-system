import { Task } from '../../../core/types/interfaces/task';

export interface TaskState {
  pendingTasks: Task[];
  doingTasks: Task[];
  reviewingTasks: Task[];
  completedTasks: Task[];
  tasks: Task[];
  task: Task | null;
  loading: boolean;
  error: any;
  mentions: {
    commentBody: string;
    username: string;
    taskTitle: string;
    taskId: string;
  }[];
}

export const initialTaskState: TaskState = {
  pendingTasks: [],
  doingTasks: [],
  reviewingTasks: [],
  completedTasks: [],
  tasks: [],
  task: null,
  loading: false,
  error: null,
  mentions: [],
};
