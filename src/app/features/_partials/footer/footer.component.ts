import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { LanguageService } from '../../../core/_services/i18n/language.service';
import { LocaleService } from '../../../core/_services/i18n/locale.service';

interface LanguageOption {
  code: string;
  name: string;
  locale: string;
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent implements OnInit {
  languages: LanguageOption[] = [
    { code: 'sq', name: 'Albanian', locale: 'sq-AL' },
    { code: 'de', name: 'German', locale: 'de-DE' },
    { code: 'en', name: 'English', locale: 'en-US' }
  ];
  currentLang: string = "";

  constructor(
    private languageService: LanguageService, 
    private localeService: LocaleService
  ) {}

  ngOnInit() {
    this.languageService.getCurrentLang().subscribe(lang => {
      this.currentLang = lang;
      const selectedLang = this.languages.find(l => l.code === lang);
      if (selectedLang) {
        this.localeService.setLocale(selectedLang.locale);
      }
    });
  }

  changeLang(langCode: string) {
    const selectedLang = this.languages.find(l => l.code === langCode);
    if (selectedLang) {
      this.languageService.setLanguage(langCode);
      this.localeService.setLocale(selectedLang.locale);
    }
  }
}