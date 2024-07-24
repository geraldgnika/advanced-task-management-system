import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import * as TaskActions from '../../../shared/_store/task/task.actions';
import { Observable } from 'rxjs';
import { AppState } from '../../../shared/_store/_common/app.state';
import { selectSelectedTask, selectTasksError, selectTasksLoading } from '../../../shared/_store/task/task.selectors';
import { AuthenticationService } from '../../../core/_services/authentication.service';
import { Task } from '../../../core/types/interfaces/task';
import { TaskService } from '../../../core/_services/task.service';

@Component({
  selector: 'app-task-open',
  templateUrl: './task-open.component.html',
  styleUrls: ['./task-open.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskOpenComponent implements OnInit {
  task$: Observable<Task | null> | undefined;
  loading$: Observable<boolean> | undefined;
  error$: Observable<any> | undefined;
  task!: Task;
  newComment: string = '';
  usn = this.authenticationService.getCurrentUser().username;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _location: Location,
    private store: Store<AppState>,
    public authenticationService: AuthenticationService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.getTask();
  }

  getTask() {
    const taskId = this.route.snapshot.params['id'];
    this.store.dispatch(TaskActions.loadTask({ id: taskId }));

    this.task$ = this.store.select(selectSelectedTask);
    this.loading$ = this.store.select(selectTasksLoading);
    this.error$ = this.store.select(selectTasksError);
  }

  deleteTask(): void {
    this.task$!.subscribe(task => {
      if (!task) {
        console.error('Task not found');
        return;
      }

      this.task = task;
    });

    const result = confirm(`Are you sure you want to delete "${this.task.title}"?`);

    if (result && this.task.id) {
      this.store.dispatch(TaskActions.deleteTask({ id: this.task.id }));
      this.goBack();
    }
  }

  goToTaskUpdate(id: string): void {
    this.router.navigate(['/task/update', id]);
  }

  deleteAttachment() : void {
    this.task$!.subscribe(task => {
      if (!task) {
        return;
      }

      this.task = task;
    });

    const result = confirm(`Are you sure you want to delete "${this.task.attachment}"?`);

    if (result && this.task.attachment) {
      this.store.dispatch(TaskActions.deleteAttachment({ task: this.task }));
      this.store.dispatch(TaskActions.loadTask({ id: this.task.id }));
    }
  }

  deleteComment(commentId: string): void {
    this.task$!.subscribe(task => {
      if (!task) {
        console.error('Task not found');
        return;
      }

      this.task = task;

      const updatedComments = task.comments.filter(comment => comment.id !== commentId);

      const updatedTask: Task = {
        ...task,
        comments: updatedComments
      };

      this.store.dispatch(TaskActions.updateTask({ task: updatedTask }));
      this.store.dispatch(TaskActions.loadTask({ id: this.task.id }));
    });
  }

  goBack() {
    this._location.back();
  }

  onFileSelected(event: Event): void {
    this.task$!.subscribe(task => {
      if (!task) {
        console.error('Task not found');
        return;
      }

      this.task = task;
    });
    
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      this.store.dispatch(TaskActions.updateAttachment({ task: this.task, filename: file.name }));
      this.store.dispatch(TaskActions.loadTask({ id: this.task.id }));
    }
  }

  postComment(): void {
    this.task$!.subscribe(task => {
      if (!task) {
        console.error('Task not found');
        return;
      }

      this.task = task;

      const updatedTask: Task = {
        ...task,
        comments: [
          ...task.comments,
          {
            id: this.taskService.generateRandomId(),
            body: this.newComment,
            username: this.authenticationService.getCurrentUser().username
          }
        ]
      };

      this.store.dispatch(TaskActions.updateTask({ task: updatedTask }));
      this.newComment = '';
      this.store.dispatch(TaskActions.loadTask({ id: this.task.id }));
    });
  }
}
