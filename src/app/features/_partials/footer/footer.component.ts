import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { LanguageService } from '../../../core/_services/language.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent implements OnInit {
  languages = [
    { code: 'sq', name: 'Albanian' },
    { code: 'de', name: 'German' },
    { code: 'en', name: 'English' }
  ];
  currentLang: string = "";

  constructor(private languageService: LanguageService) {}

  ngOnInit() {
    this.languageService.getCurrentLang().subscribe(lang => {
      this.currentLang = lang;
    });
  }

  changeLang(lang: string) {
    this.languageService.setLanguage(lang);
  }
}
