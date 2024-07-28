import { DatePipe, registerLocaleData } from '@angular/common';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { authenticationInterceptor } from './core/interceptors/authentication.interceptor';
import { FooterComponent } from './features/_partials/footer/footer.component';
import { HeaderComponent } from './features/_partials/header/header.component';
import { FeaturesModule } from './features/features.module';
import { reducers } from './shared/_store/_common/reducers';
import { AuthenticationEffects } from './shared/_store/authentication/authentication.effects';
import { TaskEffects } from './shared/_store/task/task.effects';
import { SharedModule } from './shared/shared.module';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'i18n/', '.json');
}

export function getTranslatedEnum(
  value: string,
  translationKeys: { [key: string]: string },
  translateService: TranslateService
): string {
  const key = translationKeys[value];
  return key ? translateService.instant(key) : value;
}

import localeDe from '@angular/common/locales/de';
import localeEn from '@angular/common/locales/en';
import localeSq from '@angular/common/locales/sq';
import { GlobalErrorHandler } from './core/error-handlers/error-handler.service';

registerLocaleData(localeDe, 'de-DE');
registerLocaleData(localeEn, 'en-US');
registerLocaleData(localeSq, 'sq-AL');

@NgModule({
  declarations: [AppComponent, HeaderComponent, FooterComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    FormsModule,
    SharedModule,
    FeaturesModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: 'en',
    }),
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([AuthenticationEffects, TaskEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
  ],
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    DatePipe,
    { provide: LOCALE_ID, useValue: 'en-US' },
    provideHttpClient(withInterceptors([authenticationInterceptor])),
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
