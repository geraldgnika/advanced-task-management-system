import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../../../core/types/interfaces/task';

@Component({
	selector: 'app-task-item-calendar',
	templateUrl: './task-item-calendar.component.html',
	styleUrl: './task-item-calendar.component.css',
})
export class TaskItemCalendarComponent {
	@Input() tasks!: Task[];
	currentMonth: Date;
	weeks!: any[];
	@Output() openTask = new EventEmitter<string>();

	onOpenTask(id: string): void {
		this.openTask.emit(id);
	}

	constructor() {
		this.currentMonth = new Date();
		this.generateCalendar(this.currentMonth);
	}

	prevMonth() {
		this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
		this.generateCalendar(this.currentMonth);
	}

	nextMonth() {
		this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
		this.generateCalendar(this.currentMonth);
	}

	generateCalendar(month: Date) {
		this.currentMonth = new Date(month);
		this.weeks = [];

		const firstDay = new Date(
			this.currentMonth.getFullYear(),
			this.currentMonth.getMonth(),
			1
		);

		const lastDay = new Date(
			this.currentMonth.getFullYear(),
			this.currentMonth.getMonth() + 1,
			0
		);

		let currentDate = new Date(firstDay);
		while (currentDate <= lastDay) {
			if (
				!this.weeks[Math.floor((currentDate.getDate() - 1 + firstDay.getDay()) / 7)]
			) {
				this.weeks[
					Math.floor((currentDate.getDate() - 1 + firstDay.getDay()) / 7)
				] = [];
			}

			this.weeks[
				Math.floor((currentDate.getDate() - 1 + firstDay.getDay()) / 7)
			].push(new Date(currentDate));

			currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
		}
	}

	tasksOnDay(date: Date): Task[] {
		return this.tasks.filter((task) => {
			const taskDueDate = new Date(task.dueDate);
			return (
				taskDueDate.getFullYear() === date.getFullYear() &&
				taskDueDate.getMonth() === date.getMonth() &&
				taskDueDate.getDate() === date.getDate()
			);
		});
	}
}
