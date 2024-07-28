import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TaskService } from '../../../core/_services/task/task.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  currentView: 'list' | 'grid' | 'calendar' | 'board' = 'board';
  count: number = 0;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getTaskCount().subscribe((count) => {
      this.count = count;
    });
  }

  switchToListView(): void {
    this.currentView = 'list';
  }

  switchToGridView(): void {
    this.currentView = 'grid';
  }

  switchToCalendarView(): void {
    this.currentView = 'calendar';
  }

  switchToBoardView(): void {
    this.currentView = 'board';
  }
}
