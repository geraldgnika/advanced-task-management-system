import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskAssignmentsComponent } from './task-assignments.component';
import { of } from 'rxjs';
import { Task } from '../../../../core/types/interfaces/task';
import * as ChartModule from 'chart.js/auto';

describe('TaskAssignmentsComponent', () => {
  let component: TaskAssignmentsComponent;
  let fixture: ComponentFixture<TaskAssignmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskAssignmentsComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskAssignmentsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.idChart).toBe('');
    expect(component.tasks$).toBeDefined();
  });

  it('should call taskAssignmentBarChart on ngAfterViewInit', () => {
    spyOn(component, 'taskAssignmentBarChart');
    component.ngAfterViewInit();
    expect(component.taskAssignmentBarChart).toHaveBeenCalled();
  });
});