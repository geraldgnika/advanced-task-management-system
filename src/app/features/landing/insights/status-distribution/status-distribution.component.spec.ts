import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusDistributionComponent } from './status-distribution.component';

describe('StatusDistributionComponent', () => {
  let component: StatusDistributionComponent;
  let fixture: ComponentFixture<StatusDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatusDistributionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusDistributionComponent);
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
