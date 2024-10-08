import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Task } from '../../../../../../core/types/interfaces/task';

@Component({
  selector: 'app-task-item-grid',
  templateUrl: './task-item-grid.component.html',
  styleUrl: './task-item-grid.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskItemGridComponent {
  @Input() task!: Task;
  @Output() openTask = new EventEmitter<string>();
  @Output() editTask = new EventEmitter<string>();
  @Output() deleteTask = new EventEmitter<{ id: string; title: string }>();

  onOpenTask(id: string): void {
    this.openTask.emit(id);
  }

  onEditTask(id: string): void {
    this.editTask.emit(id);
  }
}
