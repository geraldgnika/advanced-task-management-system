import { DatePipe, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable, of, Subject, Subscription, takeUntil } from 'rxjs';
import { LocaleService } from '../../../../core/_services/i18n/locale.service';
import { TaskService } from '../../../../core/_services/task/task.service';
import { Task } from '../../../../core/types/interfaces/task';
import { User } from '../../../../core/types/interfaces/user';
import { AppState } from '../../../../shared/_store/_common/app.state';
import * as AuthenticationActions from '../../../../shared/_store/authentication/authentication.actions';
import * as TaskActions from '../../../../shared/_store/task/task.actions';
import {
  selectAllTasksError,
  selectAllTasksLoading,
  selectSelectedTask,
} from '../../../../shared/_store/task/task.selectors';

@Component({
  selector: 'app-task-open',
  templateUrl: './task-open.component.html',
  styleUrls: ['./task-open.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskOpenComponent implements OnInit, OnDestroy {
  task$: Observable<Task | null> | undefined;
  loading$: Observable<boolean> | undefined;
  error$: Observable<any> | undefined;
  task!: Task;
  user!: User;
  newComment: string = '';
  currentUser$: Observable<User | null> = of();
  showMentionBox: boolean = false;
  filteredUsernames: string[] = [];
  allUsers$: Observable<User[]> | undefined;
  allUsernames: string[] = [];
  allUsersSubscription: Subscription | undefined;
  @ViewChild('commentInput') commentInput!: ElementRef<HTMLInputElement>;
  newId!: string;
  locale: string = '';
  private destroy$ = new Subject<void>();
  fileName: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _location: Location,
    private datePipe: DatePipe,
    private localeService: LocaleService,
    private store: Store<AppState>,
    private taskService: TaskService
  ) {
    this.currentUser$ = this.store.select('authentication', 'user');
    this.store.dispatch(AuthenticationActions.loadCurrentUser());
  }

  ngOnInit(): void {
    this.localeService.locale$
      .pipe(takeUntil(this.destroy$))
      .subscribe((locale) => {
        this.locale = locale;
      });

    this.getTask();

    this.allUsers$ = this.store.select('authentication', 'users');

    this.allUsersSubscription = this.allUsers$
      .pipe(map((users) => users.map((user) => user.username)))
      .subscribe((usernames) => {
        this.allUsernames = usernames;
      });

    this.store.dispatch(AuthenticationActions.loadUsers());
  }

  getTask() {
    const taskId = this.route.snapshot.params['id'];
    this.store.dispatch(TaskActions.loadTask({ id: taskId }));

    this.task$ = this.store.select(selectSelectedTask);
    this.loading$ = this.store.select(selectAllTasksLoading);
    this.error$ = this.store.select(selectAllTasksError);
  }

  goToTaskUpdate(id: string): void {
    this.router.navigate(['/task/update', id]);
  }

  deleteAttachment(): void {
    this.task$!.subscribe((task) => {
      if (!task) {
        return;
      }

      this.task = task;
    });

    const result = confirm(
      `Are you sure you want to delete "${this.task.attachment}"?`
    );

    if (result && this.task.attachment) {
      this.store.dispatch(TaskActions.deleteAttachment({ task: this.task }));
      this.store.dispatch(TaskActions.loadTask({ id: this.task.id }));
    }
  }

  goBack() {
    this._location.back();
  }

  onFileSelected(event: Event): void {
    this.task$!.subscribe((task) => {
      if (!task) {
        return;
      }

      this.task = task;
    });

    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      this.fileName = file.name;
      this.store.dispatch(
        TaskActions.updateAttachment({ task: this.task, filename: file.name })
      );
      this.store.dispatch(TaskActions.loadTask({ id: this.task.id }));
    }
  }

  handleAtSymbol(event: KeyboardEvent): void {
    const inputText = (event.target as HTMLInputElement).value;
    const lastIndex = inputText.lastIndexOf('@');
    if (lastIndex !== -1) {
      const prevChar = lastIndex > 0 ? inputText[lastIndex - 1] : '';
      if (prevChar === ' ' || prevChar === '') {
        const searchText = inputText.substring(lastIndex + 1);
        this.filteredUsernames = this.allUsernames.filter((username) =>
          username.toLowerCase().includes(searchText.toLowerCase())
        );
        this.showMentionBox = this.filteredUsernames.length > 0;
      } else {
        this.showMentionBox = false;
      }
    } else {
      this.showMentionBox = false;
    }
  }

  selectUsername(username: string): void {
    const inputText = this.newComment;
    const lastIndex = inputText.lastIndexOf('@');
    if (lastIndex !== -1) {
      const prevChar = lastIndex > 0 ? inputText[lastIndex - 1] : '';
      if (prevChar === ' ' || prevChar === '') {
        const newText =
          inputText.substring(0, lastIndex) + '@' + username + ' ';
        this.newComment = newText;
        this.showMentionBox = false;
        setTimeout(() => {
          this.commentInput.nativeElement.focus();
        });
      }
    }
  }

  highlightUsername(commentBody: string): string {
    return commentBody.replace(
      /@(\w+)/g,
      '<span class="text-primary">@$1</span>'
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.allUsersSubscription) {
      this.allUsersSubscription.unsubscribe();
    }
  }

  formatDate(date: Date | string): string {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    return this.datePipe.transform(date, 'mediumDate', '', this.locale) || '';
  }

  deleteComment(commentId: string): void {
    this.task$!.subscribe((task) => {
      if (!task) {
        return;
      }

      this.task = task;

      const updatedComments = task.comments.filter(
        (comment) => comment.id !== commentId
      );

      const updatedTask: Task = {
        ...task,
        comments: updatedComments,
      };

      this.store.dispatch(TaskActions.updateTask({ task: updatedTask }));
      this.store.dispatch(TaskActions.loadTask({ id: this.task.id }));
    });
  }

  postComment(): void {
    this.task$!.subscribe((task) => {
      if (!task) {
        return;
      }

      this.task = task;
    });

    this.currentUser$!.subscribe((user) => {
      if (!user) {
        return;
      }

      this.user = user;
    });

    this.taskService.generateUniqueCommentId().subscribe((newId) => {
      if (!newId) {
        return;
      }

      this.newId = newId;
    });

    const updatedTask = {
      ...this.task,
      comments: [
        ...this.task.comments,
        {
          id: this.newId,
          body: this.newComment,
          username: this.user.username,
        },
      ],
    };

    this.store.dispatch(TaskActions.updateTask({ task: updatedTask }));
    this.newComment = '';
    this.store.dispatch(TaskActions.loadTask({ id: this.task.id }));
  }
}
