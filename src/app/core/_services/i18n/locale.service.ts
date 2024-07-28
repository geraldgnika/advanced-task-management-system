import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { registerLocaleData } from '@angular/common';

import localeEn from '@angular/common/locales/en';
import localeDe from '@angular/common/locales/de';
import localeSq from '@angular/common/locales/sq';

registerLocaleData(localeEn, 'en-US');
registerLocaleData(localeDe, 'de-DE');
registerLocaleData(localeSq, 'sq-AL');

@Injectable({
  providedIn: 'root'
})
export class LocaleService {
  private localeSubject = new BehaviorSubject<string>('en-US');
  locale$ = this.localeSubject.asObservable();

  setLocale(locale: string) {
    if (locale.toLowerCase().startsWith('sq')) {
      locale = 'sq-AL';
    }
    this.localeSubject.next(locale);
  }

  getLocale(): string {
    return this.localeSubject.value;
  }
}