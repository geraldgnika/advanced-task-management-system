import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  currentView: 'list' | 'grid' | 'calendar' | 'board' = 'board';

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
