import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskOpenComponent } from './task-open.component';

describe('TaskOpenComponent', () => {
  let component: TaskOpenComponent;
  let fixture: ComponentFixture<TaskOpenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskOpenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskOpenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
