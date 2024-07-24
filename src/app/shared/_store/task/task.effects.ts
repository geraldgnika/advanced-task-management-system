import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as TaskActions from './task.actions';
import { TaskService } from '../../../core/_services/task.service';

@Injectable()
export class TaskEffects {
  constructor(private actions$: Actions, private taskService: TaskService) {}

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
}
