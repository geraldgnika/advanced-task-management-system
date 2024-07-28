import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { AuthenticationService } from '../../../core/_services/authentication/authentication.service';
import { UserRoles } from '../../../core/types/enums/authentication/user-roles';
import * as UserActions from '../../../shared/_store/authentication/authentication.actions';
import { RegisterComponent } from './register.component';

class MockTranslateLoader implements TranslateLoader {
  getTranslation(lang: string) {
    return of({});
  }
}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let storeSpy: jasmine.SpyObj<Store>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;

  beforeEach(async () => {
    storeSpy = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    authServiceSpy = jasmine.createSpyObj('AuthenticationService', [
      'generateUniqueId',
    ]);

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: MockTranslateLoader },
        }),
      ],
      providers: [
        { provide: Store, useValue: storeSpy },
        { provide: Router, useValue: routerSpy },
        { provide: AuthenticationService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    storeSpy.select.and.returnValue(of(null));
    authServiceSpy.generateUniqueId.and.returnValue(of('unique-id'));

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.registerForm).toBeDefined();
    expect(component.registerForm.get('full_name')).toBeDefined();
    expect(component.registerForm.get('username')).toBeDefined();
    expect(component.registerForm.get('password')).toBeDefined();
    expect(component.registerForm.get('role')).toBeDefined();
    expect(component.registerForm.get('role')?.value).toBe(UserRoles.Developer);
  });

  it('should navigate to login page', () => {
    component.goToLogin();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/authentication/login']);
  });

  it('should not dispatch register action if form is invalid', () => {
    component.onSubmit();
    expect(authServiceSpy.generateUniqueId).not.toHaveBeenCalled();
    expect(storeSpy.dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch register action if form is valid', () => {
    component.registerForm.setValue({
      full_name: 'Test User',
      username: 'testuser',
      password: 'testpassword',
      role: UserRoles.Developer,
    });
    component.onSubmit();
    expect(authServiceSpy.generateUniqueId).toHaveBeenCalled();
    expect(storeSpy.dispatch).toHaveBeenCalledWith(
      UserActions.register({
        id: 'unique-id',
        full_name: 'Test User',
        username: 'testuser',
        password: 'testpassword',
        role: UserRoles.Developer,
      })
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/landing/dashboard']);
  });

  it('should dispatch clearAuthenticationError on ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(storeSpy.dispatch).toHaveBeenCalledWith(
      UserActions.clearAuthenticationError()
    );
  });

  it('should set error$ to null on ngOnDestroy', (done) => {
    component.ngOnDestroy();
    component.error$.subscribe((error) => {
      expect(error).toBeNull();
      done();
    });
  });
});
