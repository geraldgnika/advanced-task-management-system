import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskItemGridComponent } from './task-item-grid.component';

describe('TaskItemGridComponent', () => {
  let component: TaskItemGridComponent;
  let fixture: ComponentFixture<TaskItemGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskItemGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskItemGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
