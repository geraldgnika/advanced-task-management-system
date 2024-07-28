import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskItemCalendarComponent } from './task-item-calendar.component';
import { Task } from '../../../../../../core/types/interfaces/task';
import { TaskStatus } from '../../../../../../core/types/enums/task/task-status';
import { TaskPriority } from '../../../../../../core/types/enums/task/task-priority';
import { Pipe, PipeTransform } from '@angular/core';
import { CapitalizeFirstLetterPipe } from '../../../../../../shared/pipes/capitalize-first-letter.pipe';
import { FormatUsernamePipe } from '../../../../../../shared/pipes/format-username.pipe';

@Pipe({name: 'capitalizeFirstLetter'})
class MockCapitalizeFirstLetterPipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('TaskItemCalendarComponent', () => {
  let component: TaskItemCalendarComponent;
  let fixture: ComponentFixture<TaskItemCalendarComponent>;

  const mockTasks: Task[] = [
    {
      id: 'task1',
      title: 'Task 1',
      description: 'Description 1',
      status: TaskStatus.Pending,
      priority: TaskPriority.Low,
      createdDate: new Date('2024-07-01'),
      updatedDate: new Date('2024-07-01'),
      dueDate: new Date('2024-07-15'),
      assignedTo: ['user1'],
      comments: [],
      attachment: '',
      user_id: 'user1',
      username: 'User 1'
    },
    {
      id: 'task2',
      title: 'Task 2',
      description: 'Description 2',
      status: TaskStatus.Doing,
      priority: TaskPriority.Medium,
      createdDate: new Date('2024-07-02'),
      updatedDate: new Date('2024-07-02'),
      dueDate: new Date('2024-07-20'),
      assignedTo: ['user2'],
      comments: [],
      attachment: '',
      user_id: 'user2',
      username: 'User 2'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        TaskItemCalendarComponent,
        CapitalizeFirstLetterPipe,
        FormatUsernamePipe
      ],
      providers: [
        CapitalizeFirstLetterPipe,
        FormatUsernamePipe
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskItemCalendarComponent);
    component = fixture.componentInstance;
    component.tasks = mockTasks;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with current month', () => {
    const currentMonth = new Date();
    expect(component.currentMonth.getMonth()).toBe(currentMonth.getMonth());
    expect(component.currentMonth.getFullYear()).toBe(currentMonth.getFullYear());
  });

  it('should generate calendar for current month', () => {
    expect(component.weeks).toBeTruthy();
    expect(component.weeks.length).toBeGreaterThan(0);
  });

  it('should move to previous month', () => {
    const initialMonth = component.currentMonth.getMonth();
    component.prevMonth();
    expect(component.currentMonth.getMonth()).toBe((initialMonth - 1 + 12) % 12);
  });

  it('should move to next month', () => {
    const initialMonth = component.currentMonth.getMonth();
    component.nextMonth();
    expect(component.currentMonth.getMonth()).toBe((initialMonth + 1) % 12);
  });

  it('should emit openTask event', () => {
    spyOn(component.openTask, 'emit');
    component.onOpenTask('task1');
    expect(component.openTask.emit).toHaveBeenCalledWith('task1');
  });

  it('should find tasks on a specific day', () => {
    const tasksOnDay = component.tasksOnDay(new Date('2024-07-15'));
    expect(tasksOnDay.length).toBe(1);
    expect(tasksOnDay[0].id).toBe('task1');
  });

  it('should not find tasks on a day without tasks', () => {
    const tasksOnDay = component.tasksOnDay(new Date('2024-07-10'));
    expect(tasksOnDay.length).toBe(0);
  });

  it('should generate correct number of weeks', () => {
    component.generateCalendar(new Date('2024-07-01'));
    expect(component.weeks.length).toBe(5);
  });

  it('should handle month change correctly', () => {
    component.generateCalendar(new Date('2024-12-01'));
    expect(component.currentMonth.getMonth()).toBe(11);
    component.nextMonth();
    expect(component.currentMonth.getMonth()).toBe(0);
    expect(component.currentMonth.getFullYear()).toBe(2025);
  });
});