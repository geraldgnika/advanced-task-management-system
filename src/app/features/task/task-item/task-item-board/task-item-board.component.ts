import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Observable, of } from 'rxjs';
import { Task } from '../../../../core/types/interfaces/task';
import { TaskStatus } from '../../../../core/types/enums/task/task-status';
import * as TaskSelector from '../../../../shared/_store/task/task.selectors';
import * as TaskActions from '../../../../shared/_store/task/task.actions';
import { Store } from '@ngrx/store';
import { TaskState } from '../../../../shared/_store/task/task.state';

@Component({
  selector: 'app-task-item-board',
  templateUrl: './task-item-board.component.html',
  styleUrls: ['./task-item-board.component.css'],
})
export class TaskItemBoardComponent implements OnInit {
  pendingTasks$: Observable<Task[]> = of();
  doingTasks$: Observable<Task[]> = of();
  reviewingTasks$: Observable<Task[]> = of();
  completedTasks$: Observable<Task[]> = of();
  error$: Observable<any> = of();
  @Output() openTask = new EventEmitter<string>();
  taskData: { header: string; status: string; tasks: Observable<Task[]> }[] =
    [];

  constructor(
    private store: Store<TaskState>
  ) {
    this.pendingTasks$ = this.store.select(TaskSelector.selectPendingTasks);
    this.doingTasks$ = this.store.select(TaskSelector.selectDoingTasks);
    this.reviewingTasks$ = this.store.select(TaskSelector.selectReviewingTasks);
    this.completedTasks$ = this.store.select(TaskSelector.selectCompletedTasks);
    this.error$ = this.store.select(TaskSelector.selectTaskError);
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  getHeaderClass(header: string): string {
    switch (header) {
      case 'Pending':
        return 'bg-warning text-black';
      case 'Doing':
        return 'bg-primary text-white';
      case 'Reviewing':
        return 'bg-brown text-white';
      case 'Completed':
        return 'bg-success text-white';
      default:
        return '';
    }
  }

  loadTasks(): void {
    this.store.dispatch(TaskActions.loadTasksByStatus({ status: 'pending' }));
    this.store.dispatch(TaskActions.loadTasksByStatus({ status: 'doing' }));
    this.store.dispatch(TaskActions.loadTasksByStatus({ status: 'reviewing' }));
    this.store.dispatch(TaskActions.loadTasksByStatus({ status: 'completed' }));

    this.taskData = [
      { header: 'Pending', status: 'pending', tasks: this.pendingTasks$ },
      { header: 'Doing', status: 'doing', tasks: this.doingTasks$ },
      { header: 'Reviewing', status: 'reviewing', tasks: this.reviewingTasks$ },
      {
        header: 'Completed',
        status: 'completed',
        tasks: this.completedTasks$,
      },
    ];
  }

  drop(event: CdkDragDrop<Task[] | any>, status: TaskStatus | any): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const taskToMove = event.previousContainer.data[event.previousIndex];

      this.updateTaskStatus(taskToMove, status);

      const previousData = [...event.previousContainer.data];
      const currentData = [...event.container.data];

      previousData.splice(event.previousIndex, 1);

      currentData.splice(event.currentIndex, 0, taskToMove);

      event.previousContainer.data = previousData;
      event.container.data = currentData;

      this.loadTasks();
    }
  }

  onOpenTask(id: string): void {
    this.openTask.emit(id);
  }

  private updateTaskStatus(task: Task, status: TaskStatus): void {
    const updatedTask: Task = {
      ...task,
      status: status,
    };

	this.store.dispatch(TaskActions.updateTask({ task: updatedTask }));
  }
}
