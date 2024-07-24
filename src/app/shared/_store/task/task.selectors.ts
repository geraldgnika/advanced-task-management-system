import { createSelector, createFeatureSelector } from '@ngrx/store';
import { TaskState } from './task.state';

export const selectTaskState = createFeatureSelector<TaskState>('tasks');

export const selectAllTasks = createSelector(
  selectTaskState,
  (state: TaskState) =>
    state.tasks.map((task) => ({
      ...task,
      username: task.username || 'Unknown',
    }))
);
export const selectTasksLoading = createSelector(
  selectTaskState,
  (state: TaskState) => state.loading
);
export const selectTasksError = createSelector(
  selectTaskState,
  (state: TaskState) => state.error
);

export const selectSelectedTask = createSelector(
  selectTaskState,
  (state: TaskState) => state.task
);
export const selectSelectedTaskLoading = createSelector(
  selectTaskState,
  (state: TaskState) => state.loading
);
export const selectSelectedTaskError = createSelector(
  selectTaskState,
  (state: TaskState) => state.error
);
