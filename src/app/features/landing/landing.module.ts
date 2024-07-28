import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TaskModule } from '../task/task.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InsightsComponent } from './insights/insights.component';
import { PriorityDistributionComponent } from './insights/priority-distribution/priority-distribution.component';
import { StatusDistributionComponent } from './insights/status-distribution/status-distribution.component';
import { TaskAssignmentsComponent } from './insights/task-assignments/task-assignments.component';
import { LandingRoutingModule } from './landing-routing.module';

@NgModule({
  declarations: [
    DashboardComponent,
    InsightsComponent,
    PriorityDistributionComponent,
    StatusDistributionComponent,
    TaskAssignmentsComponent,
  ],
  imports: [
    CommonModule,
    LandingRoutingModule,
    TranslateModule.forChild(),
    TaskModule,
  ],
})
export class LandingModule {}
