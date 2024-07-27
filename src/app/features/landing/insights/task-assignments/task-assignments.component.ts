import { AfterViewInit, ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Task } from '../../../../core/types/interfaces/task';
import { Observable } from 'rxjs';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-task-assignments',
  templateUrl: './task-assignments.component.html',
  styleUrls: ['./task-assignments.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskAssignmentsComponent implements AfterViewInit {
  @Input() idChart: string = '';
  @Input() tasks$: Observable<Task[]> = new Observable<Task[]>();

  ngAfterViewInit() {
    this.taskAssignmentBarChart();
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

      if (this.idChart) {
        const ctx = document.getElementById(this.idChart) as HTMLCanvasElement;
        if (ctx) {
          new Chart(ctx, {
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
        }
      }
    });
  }
}
