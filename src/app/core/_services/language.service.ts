import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLang = new BehaviorSubject<string>(this.getInitialLanguage());

  constructor(private translate: TranslateService) {
    this.setLanguage(this.currentLang.value);
  }

  private getInitialLanguage(): string {
    const savedLang = localStorage.getItem('language');
    return savedLang || 'en';
  }

  setLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLang.next(lang);
    localStorage.setItem('language', lang);
  }

  getCurrentLang() {
    return this.currentLang.asObservable();
  }
}