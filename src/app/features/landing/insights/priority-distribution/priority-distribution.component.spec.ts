import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorityDistributionComponent } from './priority-distribution.component';

describe('PriorityDistributionComponent', () => {
  let component: PriorityDistributionComponent;
  let fixture: ComponentFixture<PriorityDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PriorityDistributionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriorityDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
