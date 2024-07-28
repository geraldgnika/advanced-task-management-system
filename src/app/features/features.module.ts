import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { FeaturesRoutingModule } from './features-routing.module';
import { TaskModule } from './task/task.module';
import { TranslateModule } from '@ngx-translate/core';
import { GeneralErrorComponent } from './errors/general-error/general-error.component';

@NgModule({
  declarations: [
  
    GeneralErrorComponent
  ],
  imports: [
    CommonModule,
    AuthenticationModule,
    TranslateModule.forChild(),
    FeaturesRoutingModule,
    TaskModule
  ]
})
export class FeaturesModule { }
