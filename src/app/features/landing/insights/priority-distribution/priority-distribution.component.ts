import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { Task } from '../../../../core/types/interfaces/task';
import { Observable, Subject, combineLatest } from 'rxjs';
import { takeUntil, startWith } from 'rxjs/operators';
import { TaskPriority } from '../../../../core/types/enums/task/task-priority';
import { Chart, ChartConfiguration, ChartData } from 'chart.js';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'app-priority-distribution',
  templateUrl: './priority-distribution.component.html',
  styleUrls: ['./priority-distribution.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriorityDistributionComponent implements AfterViewInit, OnDestroy {
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
    
    const priorityValues = Object.values(TaskPriority);
    priorityValues.forEach(priority => counts[priority] = 0);
    tasks.forEach(task => counts[task.priority]++);

    const labels = Object.keys(counts).map(key => 
      this.translateService.instant(`TASK_PRIORITY.${key.toUpperCase()}`)
    );
    const data = Object.values(counts);

    if (this.idChart) {
      const ctx = document.getElementById(this.idChart) as HTMLCanvasElement;
      if (ctx) {
        if (this.chart) {
          this.chart.data.labels = labels;
          this.chart.data.datasets[0].data = data;
          this.chart.data.datasets[0].label = this.translateService.instant('T_P_D');
          this.chart.options.plugins!.title!.text = this.translateService.instant('T_P_D');
          this.chart.update();
        } else {
          const chartData: ChartData = {
            labels: labels,
            datasets: [
              {
                label: this.translateService.instant('T_P_D'),
                data: data,
                backgroundColor: ['blue', 'orange', 'red'],
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
                  text: this.translateService.instant('T_P_D'),
                }
              }
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