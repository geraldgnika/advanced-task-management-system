import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../shared/_store/_common/app.state';
import { TaskService } from '../../../core/_services/task.service';
import * as TaskActions from '../../../shared/_store/task/task.actions';
import { Observable } from 'rxjs';
import { User } from '../../../core/types/interfaces/user';
import { AuthenticationService } from '../../../core/_services/authentication.service';
import { Task } from '../../../core/types/interfaces/task';
import { TaskStatus } from '../../../core/types/enums/task/task-status';
import { TaskPriority } from '../../../core/types/enums/task/task-priority';

@Component({
  selector: 'app-task-update',
  templateUrl: './task-update.component.html',
  styleUrls: ['./task-update.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskUpdateComponent implements OnInit {
  taskForm: FormGroup;
  currentUser$: Observable<User | null> = this.authenticationService.getCurrentUserObservable();
  allUsers: User[] = [];
  taskPriorities: { value: string, label: string }[];
  taskStatuses: { value: string, label: string }[];
  task: Task | undefined;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private _location: Location,
    private taskService: TaskService,
    private router: Router,
    private authenticationService: AuthenticationService,
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
      username: ['']
    });

    this.currentUser$.subscribe((user) => {
      if (user) {
        this.taskForm.patchValue({
          user_id: user.id,
          username: user.username
        });
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

  isAssigned(username: string): boolean {
    const assignedToArray = this.taskForm.get('assignedTo') as FormArray;
    return assignedToArray.value.includes(username);
  }

  ngOnInit(): void {
    this.patchTaskValues();

    this.authenticationService.getUsers().subscribe(users => {
      this.allUsers = users;
      this.cdr.detectChanges();
    });
  }

  saveTask(): void {
    const currentDate = new Date().toISOString().slice(0, 10);

    const updatedFields = {
      ...this.taskForm.value,
      updatedDate: currentDate,
      comments: this.task ? this.task.comments : [],
      attachment: this.task ? this.task.attachment : ''
    };

    const task: Task = {
      ...this.task,
      ...updatedFields
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
  
    this.store.pipe(select(state => state.tasks.tasks)).subscribe(tasks => {
      this.task = tasks.find(task => task.id === taskId);
  
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
          user_id: this.task.user_id
        });

        const assignedToArray = this.taskForm.get('assignedTo') as FormArray;
        assignedToArray.clear();
        
        this.task.assignedTo.forEach(userId => {
          assignedToArray.push(this.fb.control(userId));
        });
      }
    });
  }

  toggleAssignedTo(username: string): void {
    const assignedToArray = this.taskForm.get('assignedTo') as FormArray;
    const index = assignedToArray.controls.findIndex(control => control.value === username);
  
    if (index === -1) {
      assignedToArray.push(this.fb.control(username));
    } else {
      assignedToArray.removeAt(index);
    }
  }
}
