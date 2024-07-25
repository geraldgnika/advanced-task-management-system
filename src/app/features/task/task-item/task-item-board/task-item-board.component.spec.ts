import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskItemBoardComponent } from './task-item-board.component';

describe('TaskItemBoardComponent', () => {
  let component: TaskItemBoardComponent;
  let fixture: ComponentFixture<TaskItemBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskItemBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskItemBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
