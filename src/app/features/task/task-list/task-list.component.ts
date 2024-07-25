import {
	ChangeDetectionStrategy,
	Component,
	Input,
	OnInit,
} from '@angular/core';
import { map, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import * as TaskActions from '../../../shared/_store/task/task.actions';
import { Store } from '@ngrx/store';
import * as TaskSelectors from '../../../shared/_store/task/task.selectors';
import { TaskService } from '../../../core/_services/task.service';
import { AppState } from '../../../shared/_store/_common/app.state';
import { AuthenticationService } from '../../../core/_services/authentication.service';
import { Task } from '../../../core/types/interfaces/task';
import { TaskPriority } from '../../../core/types/enums/task/task-priority';
import { TaskStatus } from '../../../core/types/enums/task/task-status';

@Component({
	selector: 'app-task-list',
	templateUrl: './task-list.component.html',
	styleUrls: ['./task-list.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent implements OnInit {
	@Input() viewMode: 'list' | 'grid' | 'calendar' | 'board' | 'task-component' =
		'task-component';

	tasks$!: Observable<Task[]>;
	loading$!: Observable<boolean>;
	error$!: Observable<any>;
	searchTerm: string = '';

	constructor(
		private taskService: TaskService,
		private router: Router,
		private route: ActivatedRoute,
		private store: Store<AppState>,
		public authenticationService: AuthenticationService
	) {}

	ngOnInit(): void {
		this.getAllTasks();
	}

	deleteTask(id: string, title: string): void {
		const result = confirm('Are you sure you want to delete "' + title + '"?');

		if (result) {
			this.store.dispatch(TaskActions.deleteTask({ id }));
		}
	}

	downloadCSV(): void {
		this.tasks$
			.pipe(map((tasks) => this.generateCSV(tasks)))
			.subscribe((csvContent) => {
				this.downloadFile(csvContent, 'tasks.csv');
			});
	}

	generateCSV(tasks: Task[]): string {
		const excludeFields = ['comments', 'attachment', 'user_id'];
		const header = Object.keys(tasks[0])
			.filter((key) => !excludeFields.includes(key))
			.join(',');

		const rows = tasks.map((task: any) => {
			const values = Object.keys(task)
				.filter((key) => !excludeFields.includes(key))
				.map((key) => this.formatCSVValue(task[key]));
			return values.join(',');
		});

		return `${header}\n${rows.join('\n')}`;
	}

	formatCSVValue(value: any): string {
		if (typeof value === 'string') {
			return `"${value.replace(/"/g, '""')}"`;
		}
		return `${value}`;
	}

	downloadFile(content: string, fileName: string): void {
		const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		const url = URL.createObjectURL(blob);

		link.setAttribute('href', url);
		link.setAttribute('download', fileName);
		link.style.visibility = 'hidden';

		document.body.appendChild(link);
		link.click();

		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}

	getAllTasks(): void {
		this.store.dispatch(TaskActions.loadTasks());

		this.tasks$ = this.store.select(TaskSelectors.selectAllTasks);
		this.loading$ = this.store.select(TaskSelectors.selectTasksLoading);
		this.error$ = this.store.select(TaskSelectors.selectTasksError);
	}

	searchTasks(): void {
		this.tasks$ = this.tasks$.pipe(
			map((tasks) =>
				tasks.filter(
					(task) =>
						task.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
						task.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
						task.username?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
						(task.assignedTo &&
							task.assignedTo.some((username) =>
								username.toLowerCase().includes(this.searchTerm.toLowerCase())
							))
				)
			)
		);
	}

	sortTasks(prop: keyof Task, asc: boolean): void {
		this.tasks$ = this.tasks$.pipe(
			map((tasks) =>
				[...tasks].sort((a, b) => {
					const valueA = a[prop];
					const valueB = b[prop];

					if (typeof valueA === 'string' && typeof valueB === 'string') {
						return asc ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
					} else if (typeof valueA === 'number' && typeof valueB === 'number') {
						return asc ? valueA - valueB : valueB - valueA;
					} else if (valueA instanceof Date && valueB instanceof Date) {
						return asc
							? valueA.getTime() - valueB.getTime()
							: valueB.getTime() - valueA.getTime();
					} else {
						return 0;
					}
				})
			)
		);
	}

	showLow(): void {
		this.getAllTasks();

		this.tasks$ = this.tasks$.pipe(
			map((tasks) => tasks.filter((task) => task.priority === TaskPriority.Low))
		);
	}

	showMedium(): void {
		this.getAllTasks();

		this.tasks$ = this.tasks$.pipe(
			map((tasks) => tasks.filter((task) => task.priority === TaskPriority.Medium))
		);
	}

	showHigh(): void {
		this.getAllTasks();

		this.tasks$ = this.tasks$.pipe(
			map((tasks) => tasks.filter((task) => task.priority === TaskPriority.High))
		);
	}

	showPending(): void {
		this.getAllTasks();

		this.tasks$ = this.tasks$.pipe(
			map((tasks) => tasks.filter((task) => task.status === TaskStatus.Pending))
		);
	}

	showDoing(): void {
		this.getAllTasks();

		this.tasks$ = this.tasks$.pipe(
			map((tasks) => tasks.filter((task) => task.status === TaskStatus.Doing))
		);
	}

	showReviewing(): void {
		this.getAllTasks();

		this.tasks$ = this.tasks$.pipe(
			map((tasks) => tasks.filter((task) => task.status === TaskStatus.Reviewing))
		);
	}

	showCompleted(): void {
		this.getAllTasks();

		this.tasks$ = this.tasks$.pipe(
			map((tasks) => tasks.filter((task) => task.status === TaskStatus.Completed))
		);
	}

	showAll(): void {
		this.getAllTasks();
	}

	openTask(id: string): void {
		this.router.navigate(['/task/open', id]);
	}

	goToTaskUpdate(id: string): void {
		this.router.navigate(['/task/update', id]);
	}
}
