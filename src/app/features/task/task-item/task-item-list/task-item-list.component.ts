import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../../../core/types/interfaces/task';

@Component({
  selector: 'app-task-item-list',
  templateUrl: './task-item-list.component.html',
  styleUrl: './task-item-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskItemListComponent {
  @Input() task!: Task;
  @Output() openTask = new EventEmitter<string>();
  @Output() editTask = new EventEmitter<string>();
  @Output() deleteTask = new EventEmitter<{ id: string, title: string }>();

  onOpenTask(id: string): void {
    this.openTask.emit(id);
  }

  onEditTask(id: string): void {
    this.editTask.emit(id);
  }

  onDeleteTask(id: string, title: string): void {
    this.deleteTask.emit({ id, title });
  }
}
