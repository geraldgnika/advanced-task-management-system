import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../shared/_store/_common/app.state';
import * as TaskActions from '../../../shared/_store/task/task.actions';
import { Observable, of } from 'rxjs';
import { User } from '../../../core/types/interfaces/user';
import * as AuthenticationActions from '../../../shared/_store/authentication/authentication.actions';
import * as AuthenticationSelectors from '../../../shared/_store/authentication/authentication.selectors';
import { Task } from '../../../core/types/interfaces/task';
import { TaskStatus, TaskStatusTranslationKeys } from '../../../core/types/enums/task/task-status';
import { TaskPriority, TaskPriorityTranslationKeys } from '../../../core/types/enums/task/task-priority';
import { getTranslatedEnum } from '../../../app.module';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-task-update',
  templateUrl: './task-update.component.html',
  styleUrls: ['./task-update.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskUpdateComponent implements OnInit, OnDestroy {
  taskForm: FormGroup;
  currentUser$: Observable<User | null> = of();
  allUsers$!: Observable<User[]>;
  taskPriorities$: Observable<{ value: string; label: string }[]> = of();
taskStatuses$: Observable<{ value: string; label: string }[]> = of();
  task: Task | undefined;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private _location: Location,
    private translateService: TranslateService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
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
    this.taskPriorities$ = of(Object.values(TaskPriority).map(value => ({
      value,
      label: getTranslatedEnum(value, TaskPriorityTranslationKeys, this.translateService)
    })));
  
    this.taskStatuses$ = of(Object.values(TaskStatus).map(value => ({
      value,
      label: getTranslatedEnum(value, TaskStatusTranslationKeys, this.translateService)
    })));
  
    this.cdr.markForCheck();
  }

  isAssigned(username: string): boolean {
    const assignedToArray = this.taskForm.get('assignedTo') as FormArray;
    return assignedToArray.value.includes(username);
  }

  ngOnInit(): void {
    this.patchTaskValues();

    this.store.dispatch(AuthenticationActions.loadUsers());
    this.allUsers$ = this.store.select(AuthenticationSelectors.selectAllUsers);

    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  saveTask(): void {
    const currentDate = new Date().toISOString().slice(0, 10);

    const updatedFields = {
      ...this.taskForm.value,
      updatedDate: currentDate,
      comments: this.task ? this.task.comments : [],
      attachment: this.task ? this.task.attachment : '',
      status: this.taskForm.value.status as TaskStatus,
      priority: this.taskForm.value.priority as TaskPriority
    };

    const task: Task = {
      ...this.task,
      ...updatedFields,
    };

    this.store.dispatch(TaskActions.updateTask({ task }));

    this.store.dispatch(TaskActions.loadTasks());
    this.router.navigate(['task/list']);
  }

  goBack() {
    this._location.back();
  }

  patchTaskValues(): void {
    const taskId = this.route.snapshot.params['id'];

    this.store.pipe(select((state) => state.tasks.tasks)).subscribe((tasks) => {
      this.task = tasks.find((task) => task.id === taskId);

      if (this.task) {
        this.taskForm.patchValue({
          id: this.task.id,
          title: this.task.title,
          description: this.task.description,
          status: this.task.status,
          priority: this.task.priority,
          createdDate: this.task.createdDate,
          updatedDate: this.task.updatedDate,
          dueDate: this.task.dueDate,
          user_id: this.task.user_id,
        });

        const assignedToArray = this.taskForm.get('assignedTo') as FormArray;
        assignedToArray.clear();

        this.task.assignedTo.forEach((userId) => {
          assignedToArray.push(this.fb.control(userId));
        });
      }
    });
  }

  toggleAssignedTo(username: string): void {
    const assignedToArray = this.taskForm.get('assignedTo') as FormArray;
    const index = assignedToArray.controls.findIndex(
      (control) => control.value === username
    );

    if (index === -1) {
      assignedToArray.push(this.fb.control(username));
    } else {
      assignedToArray.removeAt(index);
    }
  }
}
