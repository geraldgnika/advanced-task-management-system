import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskMentionsComponent } from './task-mentions.component';

describe('TaskMentionsComponent', () => {
  let component: TaskMentionsComponent;
  let fixture: ComponentFixture<TaskMentionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskMentionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskMentionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
