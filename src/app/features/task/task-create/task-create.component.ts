import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../shared/_store/_common/app.state';
import { TaskService } from '../../../core/_services/task.service';
import * as TaskActions from '../../../shared/_store/task/task.actions';
import * as AuthenticationActions from '../../../shared/_store/authentication/authentication.actions';
import * as AuthenticationSelectors from '../../../shared/_store/authentication/authentication.selectors';
import { Observable, of, switchMap } from 'rxjs';
import { User } from '../../../core/types/interfaces/user';
import { Task } from '../../../core/types/interfaces/task';
import { Comment } from '../../../core/types/interfaces/comment';
import { TaskStatus } from '../../../core/types/enums/task/task-status';
import { TaskPriority } from '../../../core/types/enums/task/task-priority';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCreateComponent implements OnInit {
  taskForm: FormGroup;
  currentUser$: Observable<User | null> = of();
  allUsers$!: Observable<User[]>;
  taskPriorities: { value: string, label: string }[];
  taskStatuses: { value: string, label: string }[];
  usn: string = "";

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private _location: Location,
    private taskService: TaskService,
    private router: Router,
    private cdr: ChangeDetectorRef
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
      username: ['']
    });

    this.currentUser$ = this.store.select('authentication', 'user');
    this.store.dispatch(AuthenticationActions.loadCurrentUser());

    this.currentUser$.subscribe((user) => {
      if (user) {
        this.taskForm.patchValue({
          user_id: user.id,
          username: user.username
        });

        this.usn = user.username;
      }
    });

    this.taskPriorities = Object.values(TaskPriority)
      .filter(value => typeof value === 'string')
      .map(value => ({
        value,
        label: value.charAt(0).toUpperCase() + value.slice(1)
      }));

    this.taskStatuses = Object.values(TaskStatus)
      .filter(value => typeof value === 'string')
      .map(value => ({
        value,
        label: value.charAt(0).toUpperCase() + value.slice(1)
      }));
  }

  ngOnInit(): void {
    this.store.dispatch(AuthenticationActions.loadUsers());
    this.allUsers$ = this.store.select(AuthenticationSelectors.selectAllUsers);

    this.cdr.detectChanges();
  }

  @ViewChild('commentsTextarea') commentsTextarea!: ElementRef;

  saveTask(): void {
    const currentDate = new Date().toISOString().slice(0, 10);
  
    this.taskForm.patchValue({
      createdDate: currentDate,
      updatedDate: currentDate
    });
  
    this.taskService.generateUniqueId().pipe(
      switchMap(taskId => {
        const task: Task = {
          ...this.taskForm.value,
          id: taskId,
          comments: []
        };
  
        if (this.commentsTextarea.nativeElement.value.trim() !== '') {
          return this.taskService.generateUniqueCommentId().pipe(
            switchMap(commentId => {
              const newComment: Comment = {
                id: commentId,
                body: this.commentsTextarea.nativeElement.value,
                username: this.usn
              };
  
              task.comments.push(newComment);
  
              return of(task);
            })
          );
        } else {
          return of(task);
        }
      })
    ).subscribe(task => {
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
      this.taskForm.patchValue({
        attachment: file.name
      });
    }
  }
}
