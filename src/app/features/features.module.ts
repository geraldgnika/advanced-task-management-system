import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AuthenticationModule } from './authentication/authentication.module';
import { GeneralErrorComponent } from './errors/general-error/general-error.component';
import { FeaturesRoutingModule } from './features-routing.module';
import { TaskModule } from './task/task.module';

@NgModule({
  declarations: [GeneralErrorComponent],
  imports: [
    CommonModule,
    AuthenticationModule,
    TranslateModule.forChild(),
    FeaturesRoutingModule,
    TaskModule,
  ],
})
export class FeaturesModule {}
