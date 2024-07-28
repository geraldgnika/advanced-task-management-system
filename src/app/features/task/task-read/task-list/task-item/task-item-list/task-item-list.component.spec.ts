import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskPriority } from '../../../../../../core/types/enums/task/task-priority';
import { TaskStatus } from '../../../../../../core/types/enums/task/task-status';
import { Task } from '../../../../../../core/types/interfaces/task';
import { TaskItemListComponent } from './task-item-list.component';

describe('TaskItemListComponent', () => {
  let component: TaskItemListComponent;
  let fixture: ComponentFixture<TaskItemListComponent>;

  const mockTask: Task = {
    id: 'task1',
    title: 'Test Task',
    description: 'This is a test task',
    status: TaskStatus.Pending,
    priority: TaskPriority.Medium,
    createdDate: new Date('2024-07-01'),
    updatedDate: new Date('2024-07-01'),
    dueDate: new Date('2024-07-15'),
    assignedTo: ['user1'],
    comments: [],
    attachment: '',
    user_id: 'user1',
    username: 'User 1',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskItemListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskItemListComponent);
    component = fixture.componentInstance;
    component.task = mockTask;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have task input', () => {
    expect(component.task).toEqual(mockTask);
  });

  it('should emit openTask event', () => {
    spyOn(component.openTask, 'emit');
    component.onOpenTask('task1');
    expect(component.openTask.emit).toHaveBeenCalledWith('task1');
  });

  it('should emit editTask event', () => {
    spyOn(component.editTask, 'emit');
    component.onEditTask('task1');
    expect(component.editTask.emit).toHaveBeenCalledWith('task1');
  });

  it('should handle openTask for different task ids', () => {
    spyOn(component.openTask, 'emit');
    component.onOpenTask('task2');
    expect(component.openTask.emit).toHaveBeenCalledWith('task2');
  });

  it('should handle editTask for different task ids', () => {
    spyOn(component.editTask, 'emit');
    component.onEditTask('task3');
    expect(component.editTask.emit).toHaveBeenCalledWith('task3');
  });
});
