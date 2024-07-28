import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TaskState } from './task.state';

export const selectTaskState = createFeatureSelector<TaskState>('tasks');

// Select All Tasks
export const selectAllTasks = createSelector(
  selectTaskState,
  (state: TaskState) =>
    state.tasks.map((task) => ({
      ...task,
      username: task.username || 'Unknown',
    }))
);
export const selectAllTasksLoading = createSelector(
  selectTaskState,
  (state: TaskState) => state.loading
);
export const selectAllTasksError = createSelector(
  selectTaskState,
  (state: TaskState) => state.error
);

// Select Selected Task
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

// Select Pending Tasks
export const selectPendingTasks = createSelector(
  selectTaskState,
  (state) => state.pendingTasks
);

// Select Doing Tasks
export const selectDoingTasks = createSelector(
  selectTaskState,
  (state) => state.doingTasks
);

// Select Reviewing Tasks
export const selectReviewingTasks = createSelector(
  selectTaskState,
  (state) => state.reviewingTasks
);

// Select Completed Tasks
export const selectCompletedTasks = createSelector(
  selectTaskState,
  (state) => state.completedTasks
);

// Select Erro For Selecting Tasks By Status
export const selectTaskError = createSelector(
  selectTaskState,
  (state) => state.error
);

// Load Mentioned Comments
export const selectTaskMentions = createSelector(
  selectTaskState,
  (state: TaskState) => state.mentions
);
