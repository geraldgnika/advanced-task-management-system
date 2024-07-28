import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralErrorComponent } from './features/errors/general-error/general-error.component';

const routes: Routes = [{ path: 'error', component: GeneralErrorComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
