import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralErrorComponent } from './general-error.component';

describe('GeneralErrorComponent', () => {
  let component: GeneralErrorComponent;
  let fixture: ComponentFixture<GeneralErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneralErrorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GeneralErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
