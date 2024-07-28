import { ErrorHandler, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private router: Router
  ) {}

  handleError(): void {
    this.router.navigate(['/error']);
  }
}