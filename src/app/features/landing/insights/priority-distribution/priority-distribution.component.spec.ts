import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PriorityDistributionComponent } from './priority-distribution.component';

describe('PriorityDistributionComponent', () => {
  let component: PriorityDistributionComponent;
  let fixture: ComponentFixture<PriorityDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriorityDistributionComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(PriorityDistributionComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.idChart).toBe('');
    expect(component.tasks$).toBeDefined();
  });
});