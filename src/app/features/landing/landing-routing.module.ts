import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { isProjectManagerOrTeamLeadGuard } from '../../core/guards/roles/is-project-manager-or-team-lead.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InsightsComponent } from './insights/insights.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, title: 'Dashboard' },
  {
    path: 'insights',
    component: InsightsComponent,
    title: 'Insights',
    canActivate: [isProjectManagerOrTeamLeadGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingRoutingModule {}
