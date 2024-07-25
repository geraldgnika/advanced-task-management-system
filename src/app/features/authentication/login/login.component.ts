import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as UserActions from '../../../shared/_store/authentication/authentication.actions';
import { AppState } from '../../../shared/_store/_common/app.state';
import { Observable, of } from 'rxjs';
import { selectCurrentUserError } from '../../../shared/_store/authentication/authentication.selectors';
import { Router } from '@angular/router';
import { LoginPayload } from '../../../core/types/payloads/authentication/login-payload.interface';
import { clearAuthenticationError } from '../../../shared/_store/authentication/authentication.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnDestroy {

  loginForm: FormGroup;

  error$: Observable<string | null> = of(null);

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.error$ = this.store.select(selectCurrentUserError);
  }

  goToRegister() : void {
    this.router.navigate(['/authentication/register']);
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      const payload: LoginPayload = { username, password };

      this.store.dispatch(UserActions.login(payload));
    }
  }

  ngOnDestroy(): void {
    this.store.dispatch(clearAuthenticationError());
    
    if (this.error$) {
      this.error$ = of(null);
    }
  }
}
