import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { isAuthenticatedGuard } from '../core/guards/authentication/is-authenticated.guard';
import { isNotAuthenticatedGuard } from '../core/guards/authentication/is-not-authenticated.guard';
import { slashRoute } from '../core/guards/authentication/slash-route.guard';
import { LoginComponent } from './authentication/login/login.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    title: 'Login',
    canActivate: [slashRoute],
  },
  {
    path: 'landing',
    loadChildren: () =>
      import('./landing/landing.module').then((m) => m.LandingModule),
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: 'authentication',
    loadChildren: () =>
      import('./authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
    canActivate: [isNotAuthenticatedGuard],
  },
  {
    path: 'task',
    loadChildren: () => import('./task/task.module').then((m) => m.TaskModule),
    canActivate: [isAuthenticatedGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeaturesRoutingModule {}
