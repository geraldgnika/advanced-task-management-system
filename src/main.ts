/// <reference types="@angular/localize" />
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

enableProdMode();

import { AppModule } from './app/app.module';

(window as any).__zone_symbol__BLACK_LISTED_EVENTS = ['error'];

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    ngZoneEventCoalescing: true,
  })
  .catch((err) => console.error(err));
