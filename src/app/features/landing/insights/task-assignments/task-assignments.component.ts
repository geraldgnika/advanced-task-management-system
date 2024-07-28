import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { Task } from '../../../../core/types/interfaces/task';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Chart from 'chart.js/auto';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-task-assignments',
  templateUrl: './task-assignments.component.html',
  styleUrls: ['./task-assignments.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskAssignmentsComponent implements AfterViewInit, OnDestroy {
  @Input() idChart: string = '';
  @Input() tasks$: Observable<Task[]> = new Observable<Task[]>();

  private chart: Chart | undefined;
  private destroy$ = new Subject<void>();

  constructor(private translateService: TranslateService) {}

  ngAfterViewInit() {
    this.taskAssignmentBarChart();
    this.setupLangChangeListener();
  }

  taskAssignmentBarChart() {
    this.tasks$.pipe(takeUntil(this.destroy$)).subscribe((tasks) => {
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
          if (this.chart) {
            this.chart.destroy();
          }

          this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: labels,
              datasets: [
                {
                  label: this.translateService.instant('TASK_ASSIGNMENTS'),
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

  setupLangChangeListener() {
    this.translateService.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.chart) {
          this.chart.data.datasets[0].label = this.translateService.instant('TASK_ASSIGNMENTS');
          this.chart.update();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.chart) {
      this.chart.destroy();
    }
  }
}