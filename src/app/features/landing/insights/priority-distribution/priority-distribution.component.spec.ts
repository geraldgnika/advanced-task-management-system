import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PriorityDistributionComponent } from './priority-distribution.component';
import { of } from 'rxjs';
import { Task } from '../../../../core/types/interfaces/task';
import { TaskPriority } from '../../../../core/types/enums/task/task-priority';
import * as ChartModule from 'chart.js/auto';

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

  it('should call priorityPieChart on ngAfterViewInit', () => {
    spyOn(component, 'priorityPieChart');
    component.ngAfterViewInit();
    expect(component.priorityPieChart).toHaveBeenCalled();
  });
});