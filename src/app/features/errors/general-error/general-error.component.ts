import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-general-error',
  templateUrl: './general-error.component.html',
  styleUrl: './general-error.component.css',
})
export class GeneralErrorComponent {
  constructor(private router: Router) {}

  goToHomepage(): void {
    this.router.navigate(['/']);
  }
}
