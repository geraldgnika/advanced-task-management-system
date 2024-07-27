import { AfterViewInit, ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Task } from '../../../../core/types/interfaces/task';
import { Observable } from 'rxjs';
import { TaskStatus } from '../../../../core/types/enums/task/task-status';
import Chart from 'chart.js/auto';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-status-distribution',
  templateUrl: './status-distribution.component.html',
  styleUrls: ['./status-distribution.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusDistributionComponent implements AfterViewInit {
  @Input() idChart: string = '';
  @Input() tasks$: Observable<Task[]> = new Observable<Task[]>();

  constructor(private translateService: TranslateService) {}

  ngAfterViewInit() {
    this.statusPieChart();
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

      const labels = [
        this.translateService.instant('TASK_STATUS.PENDING'),
        this.translateService.instant('TASK_STATUS.DOING'),
        this.translateService.instant('TASK_STATUS.REVIEWING'),
        this.translateService.instant('TASK_STATUS.COMPLETED')
      ];
      const data = Object.values(statusCounts);

      if (this.idChart) {
        const ctx = document.getElementById(this.idChart) as HTMLCanvasElement;
        if (ctx) {
          new Chart(ctx, {
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
        }
      }
    });
  }
}
