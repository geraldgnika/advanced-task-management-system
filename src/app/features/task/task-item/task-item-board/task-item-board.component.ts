import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TaskService } from '../../../../core/_services/task.service';
import {
	CdkDragDrop,
	moveItemInArray,
	transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Observable, of } from 'rxjs';
import { Task } from '../../../../core/types/interfaces/task';
import { TaskStatus } from '../../../../core/types/enums/task/task-status';

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
	@Output() openTask = new EventEmitter<string>();
	taskData: { header: string; status: string; tasks: Observable<Task[]> }[] = [];

	constructor(private taskService: TaskService) {}

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
		this.pendingTasks$ = this.taskService.getTasksByStatus('pending');
		this.doingTasks$ = this.taskService.getTasksByStatus('doing');
		this.reviewingTasks$ = this.taskService.getTasksByStatus('reviewing');
		this.completedTasks$ = this.taskService.getTasksByStatus('completed');
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

			transferArrayItem(
				event.previousContainer.data,
				event.container.data,
				event.previousIndex,
				event.currentIndex
			);

			this.loadTasks();
		}
	}

	onOpenTask(id: string): void {
		this.openTask.emit(id);
	}

	private updateTaskStatus(task: Task, status: TaskStatus): void {
		task.status = status;
		this.taskService.updateTask(task).subscribe(() => {
			this.loadTasks();
		});
	}
}
