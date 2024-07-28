import { Component } from '@angular/core';
import { LanguageService } from './core/_services/i18n/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Advanced Task Management System';

  constructor(private languageService: LanguageService) {}
}
