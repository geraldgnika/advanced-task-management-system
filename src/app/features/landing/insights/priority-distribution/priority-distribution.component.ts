import { AfterViewInit, ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Task } from '../../../../core/types/interfaces/task';
import { Observable } from 'rxjs';
import { TaskPriority } from '../../../../core/types/enums/task/task-priority';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-priority-distribution',
  templateUrl: './priority-distribution.component.html',
  styleUrls: ['./priority-distribution.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriorityDistributionComponent implements AfterViewInit {
  @Input() idChart: string = '';
  @Input() tasks$: Observable<Task[]> = new Observable<Task[]>();

  ngAfterViewInit() {
    this.priorityPieChart();
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

      if (this.idChart) {
        const ctx = document.getElementById(this.idChart) as HTMLCanvasElement;
        if (ctx) {
          new Chart(ctx, {
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
        }
      }
    });
  }
}
