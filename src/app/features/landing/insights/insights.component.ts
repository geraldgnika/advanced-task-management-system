import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { Task } from '../../../core/types/interfaces/task';
import { TaskStatus } from '../../../core/types/enums/task/task-status';
import { TaskPriority } from '../../../core/types/enums/task/task-priority';
import { AppState } from '../../../shared/_store/_common/app.state';
import * as TaskActions from '../../../shared/_store/task/task.actions';
import * as TaskSelectors from '../../../shared/_store/task/task.selectors';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrl: './insights.component.css',
})
export class InsightsComponent implements OnInit {
  constructor(private store: Store<AppState>,) {}
  public chart: any;
  tasks$!: Observable<Task[]>;

  ngOnInit(): void {
    this.fetchTasks();
    this.statusPieChart();
    this.priorityPieChart();
    this.taskAssignmentBarChart();
  }

  fetchTasks(): void {
    this.store.dispatch(TaskActions.loadTasks());
    this.tasks$ = this.store.select(TaskSelectors.selectAllTasks);
  }

  statusPieChart() {
    this.tasks$.subscribe((tasks) => {
      const statusCounts: { [key in TaskStatus]: number } = {
        [TaskStatus.Pending]: 0,
        [TaskStatus.Doing]: 0,
        [TaskStatus.Reviewing]: 0,
        [TaskStatus.Completed]: 0,
      };

      tasks.forEach((task) => {
        statusCounts[task.status]++;
      });

      const labels = Object.keys(statusCounts);
      const data = Object.values(statusCounts);

      this.chart = new Chart('statusPieChart', {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Task Status Distribution',
              data: data,
              backgroundColor: ['orange', 'blue', 'brown', 'green'],
            },
          ],
        },
        options: {
          aspectRatio: 2.5,
        },
      });
    });
  }

  priorityPieChart() {
    this.tasks$.subscribe((tasks) => {
      const priorityCounts: { [key in TaskPriority]: number } = {
        [TaskPriority.Low]: 0,
        [TaskPriority.Medium]: 0,
        [TaskPriority.High]: 0,
      };

      tasks.forEach((task) => {
        priorityCounts[task.priority]++;
      });

      const labels = Object.keys(priorityCounts);
      const data = Object.values(priorityCounts);

      this.chart = new Chart('priorityPieChart', {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Task Priority Distribution',
              data: data,
              backgroundColor: ['blue', 'orange', 'red'],
            },
          ],
        },
        options: {
          aspectRatio: 2.5,
        },
      });
    });
  }

  taskAssignmentBarChart() {
    this.tasks$.subscribe((tasks) => {
      const assignmentCounts = tasks.reduce((acc, task) => {
        task.assignedTo.forEach((user) => {
          if (!acc[user]) {
            acc[user] = 0;
          }
          acc[user]++;
        });
        return acc;
      }, {} as { [key: string]: number });

      const labels = Object.keys(assignmentCounts);
      const data = Object.values(assignmentCounts);

      this.chart = new Chart('taskAssignmentBarChart', {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Task Assignments',
              data: data,
              backgroundColor: 'blue',
            },
          ],
        },
        options: {
          aspectRatio: 2.5,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    });
  }
}
