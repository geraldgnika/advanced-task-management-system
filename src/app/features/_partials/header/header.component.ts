import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core/_services/authentication.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../shared/_store/_common/app.state';
import * as UserActions from '../../../shared/_store/authentication/authentication.actions';
import { Observable } from 'rxjs';
import { User } from '../../../core/types/interfaces/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  currentUser$: Observable<User | null> = this.authenticationService.getCurrentUserObservable();

  ngOnInit(): void {
    this.currentUser$ = this.authenticationService.getCurrentUserObservable();
  }
  
  logout(): void {
    this.store.dispatch(UserActions.logout());
  }

  constructor(private router: Router, private authenticationService: AuthenticationService, private store: Store<AppState>) { }

  navigateToHome (): void {
    this.router.navigate(['/']);
  }

  navigateToLogin (): void {
    this.router.navigate(['/authentication/login']);
  }

  navigateToRegister (): void {
    this.router.navigate(['/authentication/register']);
  }
}
