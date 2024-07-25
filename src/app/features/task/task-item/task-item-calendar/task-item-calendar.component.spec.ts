import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskItemCalendarComponent } from './task-item-calendar.component';

describe('TaskItemCalendarComponent', () => {
  let component: TaskItemCalendarComponent;
  let fixture: ComponentFixture<TaskItemCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskItemCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskItemCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
