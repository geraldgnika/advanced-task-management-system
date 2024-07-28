import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
} from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Chart, ChartConfiguration, ChartData } from 'chart.js';
import { Observable, Subject, combineLatest } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { TaskStatus } from '../../../../core/types/enums/task/task-status';
import { Task } from '../../../../core/types/interfaces/task';

@Component({
  selector: 'app-status-distribution',
  templateUrl: './status-distribution.component.html',
  styleUrls: ['./status-distribution.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusDistributionComponent implements AfterViewInit, OnDestroy {
  @Input() idChart: string = '';
  @Input() tasks$: Observable<Task[]> = new Observable<Task[]>();

  private chart: Chart | undefined;
  private destroy$ = new Subject<void>();

  constructor(private translateService: TranslateService) {}

  ngAfterViewInit() {
    this.createPieChart();
  }

  createPieChart() {
    const langChange$ = this.translateService.onLangChange.pipe(
      startWith({ lang: this.translateService.currentLang } as LangChangeEvent)
    );

    combineLatest([this.tasks$, langChange$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([tasks, _]) => {
        this.updateChart(tasks);
      });
  }

  updateChart(tasks: Task[]) {
    const counts: { [key: string]: number } = {};

    const statusValues = Object.values(TaskStatus);
    statusValues.forEach((status) => (counts[status] = 0));
    tasks.forEach((task) => counts[task.status]++);

    const labels = Object.keys(counts).map((key) =>
      this.translateService.instant(`TASK_STATUS.${key.toUpperCase()}`)
    );
    const data = Object.values(counts);

    if (this.idChart) {
      const ctx = document.getElementById(this.idChart) as HTMLCanvasElement;
      if (ctx) {
        if (this.chart) {
          this.chart.data.labels = labels;
          this.chart.data.datasets[0].data = data;
          this.chart.data.datasets[0].label =
            this.translateService.instant('T_S_D');
          this.chart.options.plugins!.title!.text =
            this.translateService.instant('T_S_D');
          this.chart.update();
        } else {
          const chartData: ChartData = {
            labels: labels,
            datasets: [
              {
                label: this.translateService.instant('T_S_D'),
                data: data,
                backgroundColor: ['orange', 'blue', 'brown', 'green'],
              },
            ],
          };

          const config: ChartConfiguration = {
            type: 'pie',
            data: chartData,
            options: {
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: this.translateService.instant('T_S_D'),
                },
              },
            },
          };

          this.chart = new Chart(ctx, config);
        }
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
