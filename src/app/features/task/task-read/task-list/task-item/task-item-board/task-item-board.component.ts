import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskStatus } from '../../../../../../core/types/enums/task/task-status';
import { Task } from '../../../../../../core/types/interfaces/task';
import * as TaskActions from '../../../../../../shared/_store/task/task.actions';
import * as TaskSelector from '../../../../../../shared/_store/task/task.selectors';
import { TaskState } from '../../../../../../shared/_store/task/task.state';

@Component({
  selector: 'app-task-item-board',
  templateUrl: './task-item-board.component.html',
  styleUrls: ['./task-item-board.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskItemBoardComponent implements OnInit {
  pendingTasks$: Observable<Task[]> = of();
  doingTasks$: Observable<Task[]> = of();
  reviewingTasks$: Observable<Task[]> = of();
  completedTasks$: Observable<Task[]> = of();
  error$: Observable<any> = of();
  @Output() openTask = new EventEmitter<string>();

  currentLang$: BehaviorSubject<string>;
  taskData$: Observable<
    { header: string; status: string; tasks: Observable<Task[]> }[]
  > = of();

  constructor(
    private store: Store<TaskState>,
    private translate: TranslateService
  ) {
    this.pendingTasks$ = this.store.select(TaskSelector.selectPendingTasks);
    this.doingTasks$ = this.store.select(TaskSelector.selectDoingTasks);
    this.reviewingTasks$ = this.store.select(TaskSelector.selectReviewingTasks);
    this.completedTasks$ = this.store.select(TaskSelector.selectCompletedTasks);
    this.error$ = this.store.select(TaskSelector.selectTaskError);

    this.currentLang$ = new BehaviorSubject(this.translate.currentLang);

    this.translate.onLangChange.subscribe((lang) => {
      this.currentLang$.next(lang.lang);
    });
  }

  ngOnInit(): void {
    this.loadTasks();
    this.initTaskData();
  }

  getHeaderClass(header: string): string {
    switch (header) {
      case 'PENDING':
        return 'bg-warning text-black';
      case 'DOING':
        return 'bg-primary text-white';
      case 'REVIEWING':
        return 'bg-brown text-white';
      case 'COMPLETED':
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
  }

  initTaskData(): void {
    this.taskData$ = combineLatest([
      this.currentLang$,
      this.pendingTasks$,
      this.doingTasks$,
      this.reviewingTasks$,
      this.completedTasks$,
    ]).pipe(
      map(([lang, pending, doing, reviewing, completed]) => [
        { header: 'PENDING', status: 'pending', tasks: of(pending) },
        { header: 'DOING', status: 'doing', tasks: of(doing) },
        { header: 'REVIEWING', status: 'reviewing', tasks: of(reviewing) },
        { header: 'COMPLETED', status: 'completed', tasks: of(completed) },
      ])
    );
  }

  drop(event: CdkDragDrop<Task[] | any>, newStatus: TaskStatus | any): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const taskToMove = event.previousContainer.data[event.previousIndex];
      const updatedTask: Task = {
        ...taskToMove,
        status: newStatus,
      };

      this.store.dispatch(TaskActions.updateTask({ task: updatedTask }));
    }
    
    this.loadTasks();
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
