import { Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../shared/_store/_common/app.state';
import * as TaskActions from '../../../shared/_store/task/task.actions';

@Component({
  selector: 'app-task-delete',
  templateUrl: './task-delete.component.html',
  styleUrl: './task-delete.component.css',
})
export class TaskDeleteComponent {
  constructor(private _location: Location, private store: Store<AppState>) {}

  @Input() taskId: string = '';
  @Input() taskTitle: string = '';

  deleteTask(): void {
    const result = confirm(
      `Are you sure you want to delete "${this.taskTitle}"?`
    );

    if (result && this.taskId) {
      this.store.dispatch(TaskActions.deleteTask({ id: this.taskId }));
      this.goBack();
    }
  }

  goBack() {
    this._location.back();
  }
}
