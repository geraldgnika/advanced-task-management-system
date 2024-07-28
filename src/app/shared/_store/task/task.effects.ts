import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, exhaustMap, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as TaskActions from './task.actions';
import { TaskService } from '../../../core/_services/task.service';

@Injectable()
export class TaskEffects {
  constructor(private actions$: Actions, private taskService: TaskService) {}

  // Load Tasks
  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTasks),
      exhaustMap(() => {
        return this.taskService.getTasks().pipe(
          map((tasks) => {
            return TaskActions.loadTasksSuccess({ tasks });
          }),
          catchError((error) => of(TaskActions.loadTasksFailure({ error })))
        );
      })
    )
  );

  // Load Task
  loadTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTask),
      exhaustMap((action) =>
        this.taskService.getTaskById(action.id).pipe(
          map((task) => TaskActions.loadTaskSuccess({ task })),
          catchError((error) => of(TaskActions.loadTaskFailure({ error })))
        )
      )
    )
  );

  // Add Task
  addTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.addTask),
      mergeMap((action) =>
        this.taskService.addTask(action.task).pipe(
          map((task) => TaskActions.addTaskSuccess({ task })),
          catchError((error) => of(TaskActions.addTaskFailure({ error })))
        )
      )
    )
  );

  // Update Task
  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.updateTask),
      mergeMap((action) =>
        this.taskService.updateTask(action.task).pipe(
          map((task) => TaskActions.updateTaskSuccess({ task })),
          catchError((error) => of(TaskActions.updateTaskFailure({ error })))
        )
      )
    )
  );

  // Delete Task
  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.deleteTask),
      mergeMap((action) =>
        this.taskService.deleteTask(action.id).pipe(
          map(() => TaskActions.deleteTaskSuccess({ id: action.id })),
          catchError((error) => of(TaskActions.deleteTaskFailure({ error })))
        )
      )
    )
  );

  // Delete Attachment
  deleteAttachment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.deleteAttachment),
      mergeMap((action) =>
        this.taskService.deleteAttachment(action.task).pipe(
          map((task) => TaskActions.deleteAttachmentSuccess({ task })),
          catchError((error) => of(TaskActions.deleteAttachmentFailure({ error })))
        )
      )
    )
  );

  // Update Attachment
  updateAttachment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.updateAttachment),
      mergeMap((action) =>
        this.taskService.updateAttachment(action.task, action.filename).pipe(
          map((task) => TaskActions.updateAttachmentSuccess({ task, filename: action.filename })),
          catchError((error) => of(TaskActions.updateAttachmentFailure({ error })))
        )
      )
    )
  );
  
  // Load Tasks By Status
  loadTasksByStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTasksByStatus),
      concatMap(action =>
        this.taskService.getTasksByStatus(action.status).pipe(
          map(tasks => TaskActions.loadTasksByStatusSuccess({ status: action.status, tasks })),
          catchError(error => of(TaskActions.loadTasksByStatusFailure({ status: action.status, error })))
        )
      )
    )
  );

  // Load Mentioned Comments
  loadTasksWithMentions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTasksWithMentions),
      switchMap((action) =>
        this.taskService.getTasksWithMentions(action.username).pipe(
          map((mentions) => TaskActions.loadTasksWithMentionsSuccess({ mentions })),
          catchError((error) => of(TaskActions.loadTasksWithMentionsFailure({ error })))
        )
      )
    )
  );
}
