import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingRoutingModule } from './landing-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InsightsComponent } from './insights/insights.component';
import { TaskModule } from '../task/task.module';
import { PriorityDistributionComponent } from './insights/priority-distribution/priority-distribution.component';
import { StatusDistributionComponent } from './insights/status-distribution/status-distribution.component';
import { TaskAssignmentsComponent } from './insights/task-assignments/task-assignments.component';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    DashboardComponent,
    InsightsComponent,
    PriorityDistributionComponent,
    StatusDistributionComponent,
    TaskAssignmentsComponent
  ],
  imports: [
    CommonModule,
    LandingRoutingModule,
    TranslateModule.forChild(),
    TaskModule
  ]
})
export class LandingModule { }
