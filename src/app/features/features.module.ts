import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { FeaturesRoutingModule } from './features-routing.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    AuthenticationModule,
    FeaturesRoutingModule
  ]
})
export class FeaturesModule { }
