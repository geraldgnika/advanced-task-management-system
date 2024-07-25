import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingRoutingModule } from './landing-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InsightsComponent } from './insights/insights.component';
import { TaskModule } from '../task/task.module';



@NgModule({
  declarations: [
    DashboardComponent,
    InsightsComponent
  ],
  imports: [
    CommonModule,
    LandingRoutingModule,
    TaskModule
  ]
})
export class LandingModule { }
