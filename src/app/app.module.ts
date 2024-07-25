import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { FeaturesModule } from './features/features.module';
import { HeaderComponent } from './features/_partials/header/header.component';
import { FooterComponent } from './features/_partials/footer/footer.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthenticationEffects } from './shared/_store/authentication/authentication.effects';
import { reducers } from './shared/_store/_common/reducers';
import { authenticationInterceptor } from './core/interceptors/authentication.interceptor';
import { TaskEffects } from './shared/_store/task/task.effects';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    FeaturesModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([AuthenticationEffects, TaskEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production })
  ],
  providers: [
    provideHttpClient(withInterceptors([ authenticationInterceptor ])),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
