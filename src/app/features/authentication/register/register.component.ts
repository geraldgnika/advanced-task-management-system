import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as UserActions from '../../../shared/_store/authentication/authentication.actions';
import { AppState } from '../../../shared/_store/_common/app.state';
import { Observable, of } from 'rxjs';
import { selectCurrentUserError } from '../../../shared/_store/authentication/authentication.selectors';
import { Router } from '@angular/router';
import { RegisterPayload } from '../../../core/types/payloads/authentication/register-payload.interface';
import { UserRoles } from '../../../core/types/enums/authentication/user-roles';
import { clearAuthenticationError } from '../../../shared/_store/authentication/authentication.actions';
import { AuthenticationService } from '../../../core/_services/authentication.service';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnDestroy {
	registerForm: FormGroup;
	error$: Observable<string | null> = of(null);

	constructor(
		private formBuilder: FormBuilder,
		private store: Store<AppState>,
		private router: Router,
		private authenticationService: AuthenticationService
	) {
		this.registerForm = this.formBuilder.group({
			full_name: ['', Validators.required],
			username: ['', Validators.required],
			password: ['', Validators.required],
			role: [UserRoles.Developer, Validators.required],
		});

		this.error$ = this.store.select(selectCurrentUserError);
	}

	goToLogin(): void {
		this.router.navigate(['/authentication/login']);
	}

	onSubmit(): void {
		if (this.registerForm.valid) {
			const payload: RegisterPayload = this.registerForm.value;

			this.authenticationService.generateUniqueId().subscribe((newId) => {
				payload.id = newId;
				this.store.dispatch(UserActions.register(payload));
				this.registerForm.reset();
			});

			this.router.navigate(['/landing/dashboard']);
		}
	}

	ngOnDestroy(): void {
		this.store.dispatch(clearAuthenticationError());
		
		if (this.error$) {
			this.error$ = of(null);
		}
	}
}
