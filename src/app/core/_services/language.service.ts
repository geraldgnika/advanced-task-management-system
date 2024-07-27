import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { LocaleService } from './locale.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLang = new BehaviorSubject<string>(this.getInitialLanguage());

  constructor(private translate: TranslateService, private localeService: LocaleService) {
    this.setLanguage(this.currentLang.value);
  }

  private getInitialLanguage(): string {
    const savedLang = localStorage.getItem('language');
    return savedLang || 'en';
  }

  setLanguage(lang: string) {
    this.translate.use(lang);

    switch(lang) {
      case 'en':
        this.localeService.setLocale('en-US');
        break;
      case 'de':
        this.localeService.setLocale('de-DE');
        break;
      case 'sq':
        this.localeService.setLocale('sq-AL');
        break;
      default:
        this.localeService.setLocale('en-US');
    }

    this.currentLang.next(lang);
    localStorage.setItem('language', lang);
  }

  getCurrentLang() {
    return this.currentLang.asObservable();
  }
}