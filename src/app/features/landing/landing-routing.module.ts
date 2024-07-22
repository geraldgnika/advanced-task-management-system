import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InsightsComponent } from './insights/insights.component';
import { isProjectManagerGuard } from '../../core/guards/roles/is-project-manager.guard';
import { isTeamLeadGuard } from '../../core/guards/roles/is-team-lead.guard';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, title: 'Dashboard' },
  { path: 'insights', component: InsightsComponent, title: 'Insights', canActivate: [isProjectManagerGuard, isTeamLeadGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }
