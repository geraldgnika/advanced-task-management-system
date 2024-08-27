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
import { Observable, Subject } from 'rxjs';
import { switchMap, take, takeUntil, tap } from 'rxjs/operators';
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
  task$: Observable<Task | null>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  newComment: string = '';
  currentUser$: Observable<User | null>;
  showMentionBox: boolean = false;
  filteredUsernames: string[] = [];
  allUsers$: Observable<User[]>;
  allUsernames: string[] = [];
  @ViewChild('commentInput') commentInput!: ElementRef<HTMLInputElement>;
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
    this.task$ = this.store.select(selectSelectedTask);
    this.loading$ = this.store.select(selectAllTasksLoading);
    this.error$ = this.store.select(selectAllTasksError);
    this.allUsers$ = this.store.select('authentication', 'users');
  }

  ngOnInit(): void {
    this.store.dispatch(AuthenticationActions.loadCurrentUser());

    this.localeService.locale$
      .pipe(takeUntil(this.destroy$))
      .subscribe((locale) => {
        this.locale = locale;
      });

    const taskId = this.route.snapshot.params['id'];
    this.store.dispatch(TaskActions.loadTask({ id: taskId }));

    this.allUsers$.pipe(takeUntil(this.destroy$)).subscribe((users) => {
      this.allUsernames = users.map((user) => user.username);
    });

    this.store.dispatch(AuthenticationActions.loadUsers());
  }

  goToTaskUpdate(id: string): void {
    this.router.navigate(['/task/update', id]);
  }

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  deleteAttachment(): void {
    this.task$
      .pipe(
        takeUntil(this.destroy$),
        take(1),
        tap((task) => {
          if (task && task.attachment) {
            const confirmation = confirm(`Are you sure you want to delete "${task.attachment}"?`);
            if (confirmation) {
              const updatedTask: Task = {
                ...task,
                attachment: null,
              };
              this.store.dispatch(TaskActions.updateTask({ task: updatedTask }));
  
              if (this.fileInput) {
                this.fileInput.nativeElement.value = '';
              }
            }
          }
        })
      )
      .subscribe();
  }  

  goBack() {
    this._location.back();
  }

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      this.fileName = file.name;
      this.task$
        .pipe(
          takeUntil(this.destroy$),
          take(1),
          tap((task) => {
            if (task) {
              const updatedTask: Task = {
                ...task,
                attachment: file.name,
              };
              this.store.dispatch(
                TaskActions.updateTask({ task: updatedTask })
              );
              inputElement.value = '';
            }
          })
        )
        .subscribe();
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
  }

  formatDate(date: Date | string): string {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    return this.datePipe.transform(date, 'mediumDate', '', this.locale) || '';
  }

  deleteComment(commentId: string): void {
    this.task$
      .pipe(
        takeUntil(this.destroy$),
        tap((task) => {
          if (task) {
            const updatedTask: Task = {
              ...task,
              comments: task.comments.filter(
                (comment) => comment.id !== commentId
              ),
            };
            this.store.dispatch(TaskActions.updateTask({ task: updatedTask }));
          }
        })
      )
      .subscribe();
  }

  postComment(): void {
    this.currentUser$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((user) => {
          if (!user) throw new Error('No current user');
          return this.task$.pipe(
            tap((task) => {
              if (task) {
                const newComment = {
                  id: Date.now().toString(),
                  body: this.newComment,
                  username: user.username,
                };
                const updatedTask: Task = {
                  ...task,
                  comments: [...task.comments, newComment],
                };
                this.store.dispatch(
                  TaskActions.updateTask({ task: updatedTask })
                );
                this.newComment = '';
              }
            })
          );
        })
      )
      .subscribe();
  }
}
