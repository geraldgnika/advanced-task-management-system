import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import * as UserActions from '../../../shared/_store/authentication/authentication.actions';
import { LoginComponent } from './login.component';

class MockTranslateLoader implements TranslateLoader {
  getTranslation(lang: string) {
    return of({});
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let storeSpy: jasmine.SpyObj<Store>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    storeSpy = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [ 
        ReactiveFormsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: MockTranslateLoader }
        })
      ],
      providers: [
        { provide: Store, useValue: storeSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    storeSpy.select.and.returnValue(of(null));

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('username')).toBeDefined();
    expect(component.loginForm.get('password')).toBeDefined();
  });

  it('should navigate to register page', () => {
    component.goToRegister();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/authentication/register']);
  });

  it('should not dispatch login action if form is invalid', () => {
    component.onSubmit();
    expect(storeSpy.dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch login action if form is valid', () => {
    component.loginForm.setValue({
      username: 'gerald_nika',
      password: '123456'
    });
    component.onSubmit();
    expect(storeSpy.dispatch).toHaveBeenCalledWith(
      UserActions.login({ username: 'gerald_nika', password: '123456' })
    );
  });

  it('should dispatch clearAuthenticationError on ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(storeSpy.dispatch).toHaveBeenCalledWith(UserActions.clearAuthenticationError());
  });

  it('should set error$ to null on ngOnDestroy', (done) => {
    component.ngOnDestroy();
    component.error$.subscribe(error => {
      expect(error).toBeNull();
      done();
    });
  });
});