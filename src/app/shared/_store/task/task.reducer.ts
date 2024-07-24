import { createReducer, on } from '@ngrx/store';
import * as TaskActions from './task.actions';
import { TaskState } from './task.state';
import { Task } from '../../../core/types/interfaces/task';

export const initialTaskState: TaskState = {
  tasks: [],
  task: null,
  loading: false,
  error: null
};

export const taskReducer = createReducer(
  initialTaskState,
  on(TaskActions.loadTasks, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TaskActions.loadTasksSuccess, (state, { tasks }) => ({
    ...state,
    tasks,
    loading: false,
    error: null
  })),
  on(TaskActions.loadTasksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(TaskActions.loadTask, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TaskActions.loadTaskSuccess, (state, { task }) => ({
    ...state,
    task,
    loading: false,
    error: null
  })),
  on(TaskActions.loadTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(TaskActions.addTask, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TaskActions.addTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: [...state.tasks, task],
    loading: false,
    error: null
  })),
  on(TaskActions.addTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(TaskActions.updateTask, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TaskActions.updateTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map(item => item.id === task.id ? task : item),
    loading: false,
    error: null
  })),
  on(TaskActions.updateTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(TaskActions.deleteTask, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TaskActions.deleteTaskSuccess, (state, { id }) => ({
    ...state,
    tasks: state.tasks.filter(item => item.id !== id),
    loading: false,
    error: null
  })),
  on(TaskActions.deleteTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(TaskActions.deleteAttachment, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TaskActions.deleteAttachmentSuccess, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map(theTask => {
      if (theTask.id === task.id) {
        return { ...(theTask as Task), attachment: null };
      }
      return theTask;
    }),
    loading: false,
    error: null
  })),
  on(TaskActions.deleteAttachmentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(TaskActions.updateAttachment, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TaskActions.updateAttachmentSuccess, (state, { task, filename }) => ({
    ...state,
    tasks: state.tasks.map(theTask => {
      if (theTask.id === task.id) {
        return { ...(theTask as Task), attachment: filename };
      }
      return theTask;
    }),
    loading: false,
    error: null
  })),
  on(TaskActions.updateAttachmentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(TaskActions.clearTaskAddError, (state) => ({
    ...state,
    error: null
  }))
);
