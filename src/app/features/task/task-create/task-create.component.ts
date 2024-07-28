import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of, Subject, switchMap } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { getTranslatedEnum } from '../../../app.module';
import { TaskService } from '../../../core/_services/task/task.service';
import {
  TaskPriority,
  TaskPriorityTranslationKeys,
} from '../../../core/types/enums/task/task-priority';
import {
  TaskStatus,
  TaskStatusTranslationKeys,
} from '../../../core/types/enums/task/task-status';
import { Comment } from '../../../core/types/interfaces/comment';
import { Task } from '../../../core/types/interfaces/task';
import { User } from '../../../core/types/interfaces/user';
import { AppState } from '../../../shared/_store/_common/app.state';
import * as AuthenticationActions from '../../../shared/_store/authentication/authentication.actions';
import * as AuthenticationSelectors from '../../../shared/_store/authentication/authentication.selectors';
import * as TaskActions from '../../../shared/_store/task/task.actions';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCreateComponent implements OnInit, OnDestroy {
  taskForm: FormGroup;
  currentUser$: Observable<User | null> = of();
  allUsers$!: Observable<User[]>;
  taskPriorities$: Observable<{ value: string; label: string }[]> = of();
  taskStatuses$: Observable<{ value: string; label: string }[]> = of();
  usn: string = '';
  private destroy$ = new Subject<void>();
  fileName: string = '';

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private _location: Location,
    private taskService: TaskService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService
  ) {
    this.taskForm = this.fb.group({
      id: '',
      title: ['', Validators.required],
      description: [''],
      status: [TaskStatus.Pending, Validators.required],
      priority: [TaskPriority.Low, Validators.required],
      createdDate: [''],
      updatedDate: [''],
      dueDate: ['', Validators.required],
      assignedTo: this.fb.array([]),
      comments: this.fb.array([]),
      attachment: [''],
      user_id: [''],
      username: [''],
    });

    this.currentUser$ = this.store.select('authentication', 'user');
    this.store.dispatch(AuthenticationActions.loadCurrentUser());

    this.currentUser$.subscribe((user) => {
      if (user) {
        this.taskForm.patchValue({
          user_id: user.id,
          username: user.username,
        });

        this.usn = user.username;
      }
    });

    this.updateTranslations();

    this.translateService.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateTranslations();
      });
  }

  private updateTranslations(): void {
    this.taskPriorities$ = of(
      Object.values(TaskPriority).map((value) => ({
        value,
        label: getTranslatedEnum(
          value,
          TaskPriorityTranslationKeys,
          this.translateService
        ),
      }))
    );

    this.taskStatuses$ = of(
      Object.values(TaskStatus).map((value) => ({
        value,
        label: getTranslatedEnum(
          value,
          TaskStatusTranslationKeys,
          this.translateService
        ),
      }))
    );

    this.cdr.markForCheck();
  }

  ngOnInit(): void {
    this.store.dispatch(AuthenticationActions.loadUsers());
    this.allUsers$ = this.store.select(AuthenticationSelectors.selectAllUsers);

    this.cdr.detectChanges();
  }

  @ViewChild('commentsTextarea') commentsTextarea!: ElementRef;

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  saveTask(): void {
    const currentDate = new Date().toISOString().slice(0, 10);

    this.taskForm.patchValue({
      createdDate: currentDate,
      updatedDate: currentDate,
    });

    this.taskService
      .generateUniqueId()
      .pipe(
        switchMap((taskId) => {
          const task: Task = {
            ...this.taskForm.value,
            id: taskId,
            status: this.taskForm.value.status as TaskStatus,
            priority: this.taskForm.value.priority as TaskPriority,
            comments: [],
          };

          if (this.commentsTextarea.nativeElement.value.trim() !== '') {
            return this.taskService.generateUniqueCommentId().pipe(
              switchMap((commentId) => {
                const newComment: Comment = {
                  id: commentId,
                  body: this.commentsTextarea.nativeElement.value,
                  username: this.usn,
                };

                task.comments.push(newComment);

                return of(task);
              })
            );
          } else {
            return of(task);
          }
        })
      )
      .subscribe((task) => {
        this.store.dispatch(TaskActions.addTask({ task }));
        this.store.dispatch(TaskActions.loadTasks());
        this.router.navigate(['task/list']);
      });
  }

  goBack() {
    this._location.back();
  }

  toggleAssignedTo(userId: string): void {
    const assignedToArray = this.taskForm.get('assignedTo') as FormArray;
    const index = assignedToArray.value.indexOf(userId);

    if (index === -1) {
      assignedToArray.push(this.fb.control(userId));
    } else {
      assignedToArray.removeAt(index);
    }
  }

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      this.fileName = file.name;
      this.taskForm.patchValue({
        attachment: file.name,
      });
    }
  }
}
