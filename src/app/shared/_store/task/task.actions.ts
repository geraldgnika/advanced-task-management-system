import { createAction, props } from '@ngrx/store';
import { Task } from '../../../core/types/interfaces/task';

export const loadTasks = createAction('[Task] Load Tasks');
export const loadTasksSuccess = createAction('[Task] Load Tasks Success', props<{ tasks: Task[] }>());
export const loadTasksFailure = createAction('[Task] Load Tasks Failure', props<{ error: any }>());

export const loadTask = createAction('[Task] Load Task', props<{ id: string }>());
export const loadTaskSuccess = createAction('[Task] Load Task Success', props<{ task: Task }>());
export const loadTaskFailure = createAction('[Task] Load Task Failure', props<{ error: any }>());

export const addTask = createAction('[Task] Add Task', props<{ task: Task }>());
export const addTaskSuccess = createAction('[Task] Add Task Success', props<{ task: Task }>());
export const addTaskFailure = createAction('[Task] Add Task Failure', props<{ error: any }>());

export const updateTask = createAction('[Task] Update Task', props<{ task: Task }>());
export const updateTaskSuccess = createAction('[Task] Update Task Success', props<{ task: Task }>());
export const updateTaskFailure = createAction('[Task] Update Task Failure', props<{ error: any }>());

export const deleteTask = createAction('[Task] Delete Task', props<{ id: string }>());
export const deleteTaskSuccess = createAction('[Task] Delete Task Success', props<{ id: string }>());
export const deleteTaskFailure = createAction('[Task] Delete Task Failure', props<{ error: any }>());

export const deleteAttachment = createAction('[Task] Delete Attachment', props<{ task: Task }>());
export const deleteAttachmentSuccess = createAction('[Task] Delete Attachment Success', props<{ task: Task }>());
export const deleteAttachmentFailure = createAction('[Task] Delete Attachment Failure', props<{ error: any }>());

export const updateAttachment = createAction('[Task] Update Attachment', props<{ task: Task, filename: string }>());
export const updateAttachmentSuccess = createAction('[Task] Update Attachment Success', props<{ task: Task, filename: string }>());
export const updateAttachmentFailure = createAction('[Task] Update Attachment Failure', props<{ error: any }>());

export const clearTaskAddError = createAction(
    '[Task] Clear Task Add Error'
);