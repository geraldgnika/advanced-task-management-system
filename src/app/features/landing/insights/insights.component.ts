import { Component, OnInit } from '@angular/core';
import { Task } from '../../../core/types/interfaces/task';
import { AppState } from '../../../shared/_store/_common/app.state';
import * as TaskActions from '../../../shared/_store/task/task.actions';
import * as TaskSelectors from '../../../shared/_store/task/task.selectors';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrl: './insights.component.css'
})
export class InsightsComponent implements OnInit {
  constructor(private store: Store<AppState>) {}

  tasks$!: Observable<Task[]>;

  ngOnInit(): void {
    this.fetchTasks();
  }

  fetchTasks(): void {
    this.store.dispatch(TaskActions.loadTasks());
    this.tasks$ = this.store.select(TaskSelectors.selectAllTasks);
  }
}
